const WINDOW_SECONDS = 10 * 60;
const MAX_REQUESTS_PER_WINDOW = 5;
const IDEMPOTENCY_TTL_SECONDS = 24 * 60 * 60;
const MAX = { name: 100, email: 254, phone: 40, zip: 12, container: 140, notes: 3000, sourcePage: 500, sourceForm: 80, location: 160, idempotencyKey: 100 };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const headerUnsafePattern = /[\r\n]/;

const clean = (value, maxLength) => String(value || '').trim().slice(0, maxLength);
const cleanHeader = (value, maxLength) => {
  const result = clean(value, maxLength);
  return headerUnsafePattern.test(result) ? '' : result;
};

function clientAddress(request) {
  const forwarded = request.headers['x-forwarded-for'];
  return (Array.isArray(forwarded) ? forwarded[0] : (forwarded || 'unknown')).split(',')[0].trim();
}

function rateLimitKey(address) {
  return `contact:rate:${address.replace(/[^a-zA-Z0-9:.]/g, '_')}`;
}

async function redisCommand(command) {
  // Support both manually configured Upstash names and the Vercel Marketplace-managed names.
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;

  const result = await fetch(`${url.replace(/\/$/, '')}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });
  if (!result.ok) throw new Error('Rate-limit service unavailable.');
  return result.json();
}

async function enforceDurableRateLimit(address) {
  const key = rateLimitKey(address);
  const result = await redisCommand([['INCR', key], ['EXPIRE', key, WINDOW_SECONDS, 'NX']]);
  if (!result || !Number.isInteger(result[0]?.result)) throw new Error('Rate-limit service is not configured.');
  return result[0].result <= MAX_REQUESTS_PER_WINDOW;
}

async function claimIdempotencyKey(key) {
  const result = await redisCommand([['SET', `contact:idempotency:${key}`, '1', 'EX', IDEMPOTENCY_TTL_SECONDS, 'NX']]);
  if (!result) throw new Error('Rate-limit service is not configured.');
  return result[0]?.result === 'OK';
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

function textMessage(enquiry) {
  return [
    'New Containers Exchange enquiry', '',
    `Form: ${enquiry.source_form}`,
    `Submitted: ${enquiry.submitted_at}`,
    `Source page: ${enquiry.source_page || 'Not provided'}`,
    `Name: ${enquiry.customer_name}`,
    `Email: ${enquiry.customer_email}`,
    `Phone: ${enquiry.customer_phone || 'Not provided'}`,
    `ZIP / Postal code: ${enquiry.zip_code}`,
    `Location: ${enquiry.location || 'Not provided'}`,
    `Container interest: ${enquiry.container_name || 'Not specified'}`,
    '', 'Message:', enquiry.notes || 'Not provided',
  ].join('\n');
}

function htmlMessage(enquiry) {
  return textMessage(enquiry).split('\n').map((line) => `<p style="margin:0 0 10px">${escapeHtml(line || '\u00a0')}</p>`).join('');
}

async function resendEmail(apiKey, payload, idempotencyKey) {
  const result = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
    body: JSON.stringify(payload),
  });
  if (!result.ok) throw new Error('Email delivery provider rejected the request.');
  return result.json().catch(() => ({}));
}

async function sendWithResend(enquiry, idempotencyKey) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) throw new Error('Email delivery is not configured.');

  const subjectSuffix = enquiry.container_name || 'Shipping Container';
  await resendEmail(apiKey, {
    from, to: [to], reply_to: enquiry.customer_email,
    subject: `New ${enquiry.source_form}: ${subjectSuffix} — ${enquiry.zip_code}`,
    text: textMessage(enquiry), html: htmlMessage(enquiry),
  }, `contact-internal-${idempotencyKey}`);

  await resendEmail(apiKey, {
    from, to: [enquiry.customer_email],
    reply_to: to,
    subject: 'We received your Containers Exchange enquiry',
    text: `Hi ${enquiry.customer_name},\n\nWe received your enquiry. A Containers Exchange team member will review the details and reply soon.\n\nThank you,\nContainers Exchange`,
    html: `<p>Hi ${escapeHtml(enquiry.customer_name)},</p><p>We received your enquiry. A Containers Exchange team member will review the details and reply soon.</p><p>Thank you,<br>Containers Exchange</p>`,
  }, `contact-confirmation-${idempotencyKey}`);
}

function hasTrustedOrigin(request) {
  const origin = request.headers.origin;
  if (!origin) return true;
  try {
    const originUrl = new URL(origin);
    const host = String(request.headers.host || '').split(':')[0];
    if (host && originUrl.hostname === host) return true;
    return String(process.env.CONTACT_ALLOWED_ORIGINS || '').split(',').map((item) => item.trim()).filter(Boolean).includes(originUrl.origin);
  } catch { return false; }
}

function parseEnquiry(body) {
  return {
    customer_name: cleanHeader(body.customer_name, MAX.name),
    customer_email: cleanHeader(body.customer_email, MAX.email).toLowerCase(),
    customer_phone: cleanHeader(body.customer_phone, MAX.phone),
    zip_code: cleanHeader(body.zip_code, MAX.zip).toUpperCase(),
    container_name: cleanHeader(body.container_name, MAX.container),
    notes: clean(body.notes, MAX.notes),
    source_page: cleanHeader(body.source_page, MAX.sourcePage),
    source_form: cleanHeader(body.source_form, MAX.sourceForm) || 'Quote request',
    location: cleanHeader(body.location, MAX.location),
    submitted_at: new Date().toISOString(),
  };
}

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed.' });
  if (!hasTrustedOrigin(request)) return response.status(403).json({ error: 'This request could not be verified. Please refresh the page and try again.' });

  const body = request.body || {};
  if (clean(body.company_website, 200)) return response.status(200).json({ accepted: true });

  const enquiry = parseEnquiry(body);
  if (!enquiry.customer_name || !emailPattern.test(enquiry.customer_email) || !enquiry.zip_code) {
    return response.status(400).json({ error: 'Please provide a name, valid email address, and ZIP or postal code.' });
  }

  const key = cleanHeader(request.headers['idempotency-key'], MAX.idempotencyKey);
  if (!key) return response.status(400).json({ error: 'Please refresh the page and try again before submitting.' });
  if (process.env.CONTACT_DELIVERY_ENABLED !== 'true') {
    return response.status(503).json({ error: 'Online quote delivery is not available yet. Please try again shortly.' });
  }

  try {
    if (!(await enforceDurableRateLimit(clientAddress(request)))) return response.status(429).json({ error: 'Too many submissions. Please wait a few minutes and try again.' });
    await sendWithResend(enquiry, key);
    // Claim only after both provider calls succeed. A transient delivery failure must leave the customer's fields retryable.
    await claimIdempotencyKey(key);
    return response.status(202).json({ accepted: true });
  } catch (error) {
    console.error('Contact delivery failure', error?.message);
    return response.status(503).json({ error: 'We could not deliver your enquiry right now. Your details are still in the form, so please try again shortly.' });
  }
}
