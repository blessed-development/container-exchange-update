const deliveryUnavailableMessage =
  'Online enquiry delivery is not available yet. Your entered details are still in the form.';

export const isContactDeliveryEnabled =
  import.meta.env.VITE_CONTACT_DELIVERY_ENABLED === 'true';

export async function submitEnquiry(payload) {
  const idempotencyKey =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({
      ...payload,
      source_page: window.location.href,
    }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || deliveryUnavailableMessage);
  }

  return result;
}
