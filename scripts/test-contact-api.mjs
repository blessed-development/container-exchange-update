import assert from 'node:assert/strict';
import handler from '../api/contact.js';

function responseMock() {
  return {
    statusCode: 200,
    payload: null,
    setHeader() {},
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.payload = payload; return this; },
  };
}

function request(body = {}, headers = {}) {
  return {
    method: 'POST',
    body,
    headers: { host: 'preview.example.test', origin: 'https://preview.example.test', 'idempotency-key': 'test-request-1', ...headers },
  };
}

const valid = {
  customer_name: 'Fictional Customer',
  customer_email: 'fictional@example.test',
  customer_phone: '(555) 010-1234',
  zip_code: '90210',
  container_name: '20ft Standard Container',
  notes: 'Fictional test enquiry.',
  source_form: 'Product configurator',
  source_page: 'https://preview.example.test/product/new-20-iicl',
  location: 'Los Angeles, CA',
};

const originalFetch = global.fetch;
const originalEnv = { ...process.env };

try {
  let response = responseMock();
  await handler(request({ ...valid, customer_email: 'invalid' }), response);
  assert.equal(response.statusCode, 400);

  response = responseMock();
  await handler(request({ ...valid, customer_email: 'fictional@example.test\r\nBcc: attacker@example.test' }), response);
  assert.equal(response.statusCode, 400);

  response = responseMock();
  await handler(request({ ...valid, company_website: 'spam.example' }), response);
  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.payload, { accepted: true });

  delete process.env.CONTACT_DELIVERY_ENABLED;
  response = responseMock();
  await handler(request(valid), response);
  assert.equal(response.statusCode, 503);

  process.env.CONTACT_DELIVERY_ENABLED = 'true';
  process.env.RESEND_API_KEY = 'test-key';
  process.env.CONTACT_TO_EMAIL = 'sales@containersexchange.com';
  process.env.CONTACT_FROM_EMAIL = 'Containers Exchange <sales@containersexchange.com>';
  process.env.UPSTASH_REDIS_REST_URL = 'https://redis.example.test';
  process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';
  const calls = [];
  const redisValues = new Map();
  global.fetch = async (url, options = {}) => {
    calls.push({ url, options });
    if (url.includes('redis.example.test')) {
      const commands = JSON.parse(options.body);
      const results = commands.map((command) => {
        const [operation, key] = command;
        if (operation === 'INCR') {
          const nextValue = (redisValues.get(key) || 0) + 1;
          redisValues.set(key, nextValue);
          return { result: nextValue };
        }
        if (operation === 'SET') return { result: 'OK' };
        return { result: 1 };
      });
      return { ok: true, json: async () => results };
    }
    return { ok: true, json: async () => ({ id: `email-${calls.length}` }) };
  };
  response = responseMock();
  await handler(request(valid), response);
  assert.equal(response.statusCode, 202);
  const emailCalls = calls.filter((call) => call.url === 'https://api.resend.com/emails');
  assert.equal(emailCalls.length, 2);
  const internal = JSON.parse(emailCalls[0].options.body);
  const confirmation = JSON.parse(emailCalls[1].options.body);
  assert.equal(internal.to[0], 'sales@containersexchange.com');
  assert.equal(internal.reply_to, 'fictional@example.test');
  assert.match(internal.text, /Product configurator/);
  assert.equal(confirmation.to[0], 'fictional@example.test');

  for (let attempt = 2; attempt <= 5; attempt += 1) {
    response = responseMock();
    await handler(request(valid, { 'idempotency-key': `test-request-${attempt}` }), response);
    assert.equal(response.statusCode, 202);
  }
  response = responseMock();
  await handler(request(valid, { 'idempotency-key': 'test-request-6' }), response);
  assert.equal(response.statusCode, 429);

  redisValues.clear();
  global.fetch = async () => ({ ok: false, json: async () => ({}) });
  response = responseMock();
  await handler(request(valid, { 'idempotency-key': 'test-request-2' }), response);
  assert.equal(response.statusCode, 503);
  assert.match(response.payload.error, /details are still in the form/i);

  console.log('Contact API checks passed.');
} finally {
  global.fetch = originalFetch;
  for (const key of Object.keys(process.env)) if (!(key in originalEnv)) delete process.env[key];
  Object.assign(process.env, originalEnv);
}
