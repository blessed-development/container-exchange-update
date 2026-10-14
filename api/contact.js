const WINDOW_SECONDS = 10 * 60;
const MAX_REQUESTS_PER_WINDOW = 5;
const IDEMPOTENCY_TTL_SECONDS = 24 * 60 * 60;
const MAX = { name: 100, email: 254, phone: 40, zip: 12, container: 140, notes: 3000, sourcePage: 500, sourceForm: 80, location: 160, idempotencyKey: 100, itemTitle: 180, itemSubtitle: 100, itemImage: 700, itemUrl: 700 };
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

function emailBaseUrl() {
  const configuredUrl = cleanHeader(process.env.PUBLIC_SITE_URL, 500);
  if (configuredUrl) {
    try { return new URL(configuredUrl).origin; } catch { /* Fall through to the canonical site. */ }
  }
  // Email recipients cannot access protected Vercel Preview URLs. Use the public site for all email assets and links.
  return 'https://containersexchange.com';
}

function money(value) {
  return `$${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function deliveryAmount(value) {
  return String(value || '').replace(/\s*USD\s*$/i, '').trim();
}

function imageUrl(image, baseUrl) {
  const value = cleanHeader(image, MAX.itemImage);
  if (!value) return '';
  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return '';
  }
}

function productUrl(productUrlValue, baseUrl) {
  const value = cleanHeader(productUrlValue, MAX.itemUrl);
  if (!value) return '';
  try {
    const base = new URL(baseUrl);
    const url = new URL(value, base);
    return url.origin === base.origin ? url.toString() : '';
  } catch {
    return '';
  }
}

function reservationItems(value, baseUrl) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 12).map((item) => {
    const quantity = Math.min(99, Math.max(1, Number.parseInt(item?.quantity, 10) || 1));
    const unitPrice = Math.max(0, Number(item?.unit_price) || 0);
    return {
      title: cleanHeader(item?.title, MAX.itemTitle) || 'Shipping container',
      subtitle: cleanHeader(item?.subtitle, MAX.itemSubtitle),
      image: imageUrl(item?.image, baseUrl),
      productUrl: productUrl(item?.product_url, baseUrl),
      rating: Math.min(5, Math.max(0, Number(item?.rating) || 0)),
      reviewCount: Math.min(999999, Math.max(0, Number.parseInt(item?.review_count, 10) || 0)),
      quantity,
      unitPrice,
      subtotal: quantity * unitPrice,
    };
  });
}

function actionLink(href, label, primary = false) {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;margin:${primary ? '0 10px 12px 0' : '0 12px 12px 0'};padding:${primary ? '12px 18px' : '0'};border-radius:8px;background:${primary ? '#ff5a14' : 'transparent'};color:${primary ? '#ffffff' : '#0b6fca'};font-size:14px;font-weight:700;text-decoration:none;">${escapeHtml(label)}</a>`;
}

function reservationEmailHtml(enquiry, { isTestSubmission, subjectSuffix }) {
  const baseUrl = emailBaseUrl();
  const items = enquiry.reservation_items || [];
  const itemRows = items.map((item) => `<tr>
    <td style="padding:16px 0;border-top:1px solid #e5eaf0;vertical-align:top;">
      ${item.image ? `<img src="${escapeHtml(item.image)}" width="74" height="56" alt="${escapeHtml(item.title)}" style="display:block;width:74px;height:56px;object-fit:cover;border-radius:8px;border:1px solid #dce4eb;">` : ''}
    </td>
    <td style="padding:16px 14px;border-top:1px solid #e5eaf0;vertical-align:top;">
      <div style="max-width:315px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;color:#10263e;font-size:14px;font-weight:700;line-height:1.4;">${item.productUrl ? `<a href="${escapeHtml(item.productUrl)}" style="display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;color:#10263e;text-decoration:underline;">${escapeHtml(item.title)}</a>` : escapeHtml(item.title)}</div>
      ${item.subtitle ? `<div style="margin-top:3px;color:#64748b;font-size:13px;line-height:1.4;">${escapeHtml(item.subtitle)}</div>` : ''}
      ${item.rating ? `<div style="margin-top:7px;color:#e4a400;font-size:13px;line-height:1.3;letter-spacing:1px;">★★★★★ <span style="color:#51606f;letter-spacing:0;">${item.rating.toFixed(1)}${item.reviewCount ? ` (${item.reviewCount} reviews)` : ''}</span></div>` : ''}
    </td>
    <td align="right" style="padding:16px 0;border-top:1px solid #e5eaf0;vertical-align:top;color:#10263e;font-size:14px;font-weight:800;white-space:nowrap;">${money(item.subtotal)}</td>
  </tr>`).join('');
  const summary = items.length ? `<div style="margin:0 0 24px;padding:20px;border:1px solid #dce4eb;border-radius:10px;background:#ffffff;">
          <div style="margin:0 0 12px;color:#10263e;font-size:17px;font-weight:800;">Reservation summary</div>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>
            <td width="74" style="padding:0 0 10px;"></td>
            <td style="padding:0 14px 10px;color:#64748b;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">Item</td>
            <td width="130" align="right" style="padding:0 0 10px;color:#64748b;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;">Subtotal</td>
          </tr>${itemRows}</table>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:2px;border-top:1px solid #dce4eb;">
            <tr><td style="padding:13px 0 0;color:#51606f;font-size:14px;">Container subtotal</td><td align="right" style="padding:13px 0 0;color:#10263e;font-size:14px;font-weight:700;">${money(enquiry.quoted_subtotal)}</td></tr>
            <tr><td style="padding:9px 0 0;color:#51606f;font-size:14px;">Estimated sales tax</td><td align="right" style="padding:9px 0 0;color:#10263e;font-size:14px;font-weight:700;">${money(enquiry.estimated_sales_tax)}</td></tr>
            ${enquiry.estimated_delivery ? `<tr><td style="padding:9px 0 0;color:#51606f;font-size:14px;">Estimated delivery</td><td align="right" style="padding:9px 0 0;color:#10263e;font-size:14px;font-weight:700;">${escapeHtml(deliveryAmount(enquiry.estimated_delivery))}</td></tr>` : ''}
            <tr><td style="padding:15px 0 0;color:#10263e;font-size:16px;font-weight:800;">Total</td><td align="right" style="padding:15px 0 0;color:#10263e;font-size:16px;font-weight:800;">${money(enquiry.estimated_total)}</td></tr>
          </table>
        </div>` : '';
  const testNotice = isTestSubmission
    ? '<div style="margin:0 0 22px;padding:12px 14px;border-radius:8px;background:#fff5d9;color:#6b4800;font-size:14px;font-weight:700;">TEST ONLY — no action is needed.</div>'
    : '';
  return `<!doctype html>
<html lang="en"><head><meta char="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Reservation request received</title></head>
<body style="margin:0;padding:0;background:#f3f5f7;color:#19212b;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="padding:32px 12px;"><tr><td align="center">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:620px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 8px 28px rgba(18,30,44,.10);">
      <tr><td style="padding:25px 32px;background:#071a2d;color:#ffffff;">
        <div style="font-size:20px;font-weight:800;letter-spacing:.2px;">Containers <span style="color:#ff5a14;">Exchange</span></div>
        <div style="margin-top:6px;color:#c9d5e2;font-size:14px;">Reservation request confirmation</div>
      </td></tr>
      <tr><td style="padding:32px;">
        ${testNotice}
        <p style="margin:0 0 18px;font-size:16px;line-height:1.6;">Hi ${escapeHtml(enquiry.customer_name)},</p>
        <p style="margin:0 0 22px;font-size:16px;line-height:1.6;">Thank you for your reservation request for <strong>${escapeHtml(subjectSuffix)}</strong>. Our team will review availability and delivery details, then contact you with the next steps.</p>
        <div style="margin:0 0 24px;padding:17px 18px;border:1px solid #dce4eb;border-radius:10px;background:#f8fafc;">
          <div style="margin:0 0 5px;color:#64748b;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">Reservation reference</div>
          <div style="color:#10263e;font-size:20px;font-weight:800;letter-spacing:.04em;">${escapeHtml(enquiry.reservation_reference)}</div>
        </div>
        ${summary}
        <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:#51606f;">Please keep this reference for your records. It does not represent a payment receipt or a final delivery confirmation.</p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#51606f;">Thank you,<br>Containers Exchange</p>
        <div style="padding-top:22px;border-top:1px solid #e5eaf0;">
          ${actionLink(`${baseUrl}/inventory`, 'Browse containers', true)}
          ${actionLink(`${baseUrl}/contact`, 'Contact us')}
          ${actionLink(`${baseUrl}/customer-care`, 'Customer care')}
        </div>
        <div style="margin-top:20px;color:#8a96a3;font-size:11px;line-height:1.55;">containersexchange.com</div>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
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
  const isReservation = enquiry.source_form === 'Checkout reservation request';
  const isTestSubmission = /\btest\b/i.test(`${enquiry.source_form} ${enquiry.notes}`);
  const confirmationPrefix = isTestSubmission ? 'TEST — ' : '';
  const confirmationNotice = isTestSubmission
    ? 'This is a test of the Containers Exchange enquiry system. No action is needed.\n\n'
    : '';
  await resendEmail(apiKey, {
    from, to: [to], reply_to: enquiry.customer_email,
    subject: isReservation
      ? `New reservation request ${enquiry.reservation_reference}: ${subjectSuffix} — ${enquiry.zip_code}`
      : `New ${enquiry.source_form}: ${subjectSuffix} — ${enquiry.zip_code}`,
    text: textMessage(enquiry), html: htmlMessage(enquiry),
  }, `contact-internal-${idempotencyKey}`);

  await resendEmail(apiKey, {
    from, to: [enquiry.customer_email],
    reply_to: to,
    subject: isReservation
      ? `${confirmationPrefix}We received your reservation request — ${enquiry.reservation_reference}`
      : `${confirmationPrefix}We received your Containers Exchange enquiry`,
    text: isReservation
      ? `${confirmationNotice}Hi ${enquiry.customer_name},\n\nThank you for your reservation request with Containers Exchange. We received your request for ${subjectSuffix}. Our team will review availability and delivery details, then contact you with the next steps.\n\nReservation reference: ${enquiry.reservation_reference}\n\nThank you,\nContainers Exchange`
      : `${confirmationNotice}Hi ${enquiry.customer_name},\n\nWe received your enquiry. A Containers Exchange team member will review the details and reply soon.\n\nThank you,\nContainers Exchange`,
    html: isReservation
      ? reservationEmailHtml(enquiry, { isTestSubmission, subjectSuffix })
      : `${isTestSubmission ? '<p><strong>TEST ONLY — no action is needed.</strong></p>' : ''}<p>Hi ${escapeHtml(enquiry.customer_name)},</p><p>We received your enquiry. A Containers Exchange team member will review the details and reply soon.</p><p>Thank you,<br>Containers Exchange</p>`,
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
  const sourcePage = cleanHeader(body.source_page, MAX.sourcePage);
  return {
    customer_name: cleanHeader(body.customer_name, MAX.name),
    customer_email: cleanHeader(body.customer_email, MAX.email).toLowerCase(),
    customer_phone: cleanHeader(body.customer_phone, MAX.phone),
    zip_code: cleanHeader(body.zip_code, MAX.zip).toUpperCase(),
    container_name: cleanHeader(body.container_name, MAX.container),
    notes: clean(body.notes, MAX.notes),
    source_page: sourcePage,
    source_form: cleanHeader(body.source_form, MAX.sourceForm) || 'Quote request',
    location: cleanHeader(body.location, MAX.location),
    reservation_items: reservationItems(body.reservation_items, emailBaseUrl()),
    quoted_subtotal: Math.max(0, Number(body.quoted_subtotal) || 0),
    estimated_sales_tax: Math.max(0, Number(body.estimated_sales_tax) || 0),
    estimated_delivery: cleanHeader(body.estimated_delivery, 120),
    estimated_total: Math.max(0, Number(body.estimated_total) || 0),
    submitted_at: new Date().toISOString(),
  };
}

function reservationReference(idempotencyKey) {
  const date = new Date();
  const day = [
    String(date.getUTCFullYear()).slice(-2),
    String(date.getUTCMonth() + 1).padStart(2, '0'),
    String(date.getUTCDate()).padStart(2, '0'),
  ].join('');
  const suffix = String(idempotencyKey || '').replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase() || 'REQUEST';
  return `RES-${day}-${suffix}`;
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
    const isReservation = enquiry.source_form === 'Checkout reservation request';
    const enrichedEnquiry = isReservation
      ? { ...enquiry, reservation_reference: reservationReference(key) }
      : enquiry;
    await sendWithResend(enrichedEnquiry, key);
    // Claim only after both provider calls succeed. A transient delivery failure must leave the customer's fields retryable.
    await claimIdempotencyKey(key);
    return response.status(202).json({ accepted: true, ...(isReservation ? { reservationReference: enrichedEnquiry.reservation_reference } : {}) });
  } catch (error) {
    console.error('Contact delivery failure', error?.message);
    return response.status(503).json({ error: 'We could not deliver your enquiry right now. Your details are still in the form, so please try again shortly.' });
  }
}
