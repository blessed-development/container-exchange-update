const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const requestWindows = new Map();
const completedRequests = new Map();

const clean = (value, maxLength) => String(value || '').trim().slice(0, maxLength);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clientAddress(request) {
  const forwarded = request.headers['x-forwarded-for'];
  return Array.isArray(forwarded) ? forwarded[0] : (forwarded || 'unknown').split(',')[0].trim();
}

function hasReachedRateLimit(address) {
  const now = Date.now();
  const recent = (requestWindows.get(address) || []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  requestWindows.set(address, recent);
  return recent.length > MAX_REQUESTS_PER_WINDOW;
}

export default function handler(request, response) {
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
  if (completedRequests.has(key)) return response.status(409).json({ error: 'This request was already submitted.' });
  if (hasReachedRateLimit(clientAddress(request))) return response.status(429).json({ error: 'Too many requests. Please wait a few minutes and try again.' });

  // Delivery deliberately remains disabled until an approved mailbox and mail provider are configured.
  // The provider integration will use server-only environment variables and Reply-To: enquiry.customer_email.
  return response.status(503).json({
    error: 'Online quote delivery is not configured yet. Please call (800) 555-1234 for immediate assistance.',
  });
}
