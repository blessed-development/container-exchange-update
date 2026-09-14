const WINDOW_SECONDS = 10 * 60;
const MAX_REQUESTS_PER_WINDOW = 5;
const IDEMPOTENCY_TTL_SECONDS = 24 * 60 * 60;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (value, maxLength) => String(value || '').trim().slice(0, maxLength);

function clientAddress(request) {
  const forwarded = request.headers['x-forwarded-for'];
  return (Array.isArray(forwarded) ? forwarded[0] : (forwarded || 'unknown')).split(',')[0].trim();
}

function rateLimitKey(address) {
  return `contact:rate:${address.replace(/[^a-zA-Z0-9:.]/g, '_')}`;
}

async function redisCommand(command) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const result = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });
  if (!result.ok) throw new Error('Rate-limit service unavailable.');
  return result.json();
}

async function enforceDurableRateLimit(address) {
  const result = await redisCommand([
    ['INCR', rateLimitKey(address)],
    ['EXPIRE', rateLimitKey(address), WINDOW_SECONDS, 'NX'],
  ]);
  if (!result || !Number.isInteger(result[0]?.result)) {
    throw new Error('Rate-limit service is not configured.');
  }
  return result[0].result <= MAX_REQUESTS_PER_WINDOW;
}

async function claimIdempotencyKey(key) {
  const result = await redisCommand([
    ['SET', `contact:idempotency:${key}`, '1', 'EX', IDEMPOTENCY_TTL_SECONDS, 'NX'],
  ]);
  if (!result) throw new Error('Rate-limit service is not configured.');
  return result[0]?.result === 'OK';
}

function textMessage(enquiry) {
  return [
    'New Containers Exchange quote request', '',
    `Name: ${enquiry.customer_name}`,
    `Email: ${enquiry.customer_email}`,
    `Phone: ${enquiry.customer_phone || 'Not provided'}`,
    `ZIP / Postal code: ${enquiry.zip_code}`,
    `Container interest: ${enquiry.container_name || 'Not specified'}`,
    '', 'Message:', enquiry.notes || 'Not provided',
  ].join('\n');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character]);
}

async function sendWithResend(enquiry, idempotencyKey) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) throw new Error('Email delivery is not configured.');

  const message = textMessage(enquiry);
  const result = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `contact-${idempotencyKey}`,
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: enquiry.customer_email,
      subject: `Quote request: ${enquiry.container_name || 'Shipping Container'} — ${enquiry.zip_code}`,
      text: message,
      html: message.split('\n').map((line) => `<p>${escapeHtml(line || '\u00a0')}</p>`).join(''),
    }),
  });
  if (!result.ok) throw new Error('Email delivery provider rejected the request.');
}

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed.' });

  const origin = request.headers.origin;
  const siteUrl = process.env.VITE_SITE_URL || process.env.SITE_URL;
  if (origin && siteUrl && new URL(siteUrl).origin !== origin) {
    return response.status(403).json({ error: 'Invalid request origin.' });
  }

  const body = request.body || {};
  if (clean(body.company_website, 200)) return response.status(200).json({ accepted: true });

  const enquiry = {
    customer_name: clean(body.customer_name, 100),
    customer_email: clean(body.customer_email, 254).toLowerCase(),
    customer_phone: clean(body.customer_phone, 40),
    zip_code: clean(body.zip_code, 12).toUpperCase(),
    container_name: clean(body.container_name, 100),
    notes: clean(body.notes, 3000),
  };
  if (!enquiry.customer_name || !emailPattern.test(enquiry.customer_email) || !enquiry.zip_code) {
    return response.status(400).json({ error: 'Please provide a name, valid email address, and ZIP or postal code.' });
  }

  const key = clean(request.headers['idempotency-key'], 100);
  if (!key) return response.status(400).json({ error: 'Missing submission identifier.' });

  // Public delivery remains off until all server-only credentials are configured and tested.
  if (process.env.CONTACT_DELIVERY_ENABLED !== 'true') {
    return response.status(503).json({ error: 'Online quote delivery is not configured yet. Please try again after contact services are available.' });
  }

  try {
    if (!(await enforceDurableRateLimit(clientAddress(request)))) {
      return response.status(429).json({ error: 'Too many requests. Please wait a few minutes and try again.' });
    }
    if (!(await claimIdempotencyKey(key))) {
      return response.status(409).json({ error: 'This request was already submitted.' });
    }
    await sendWithResend(enquiry, key);
    return response.status(202).json({ accepted: true });
  } catch (error) {
    console.error('Contact delivery failure', error?.message);
    return response.status(503).json({ error: 'Quote delivery is temporarily unavailable. Your entered details are still in the form.' });
  }
}
