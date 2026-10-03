export async function validateCheckoutPricing(cart) {
  const items = (cart || []).map((item) => ({
    productId: item.productId,
    country: item.location?.country,
    state: item.location?.state || item.location?.stateCode,
    city: item.location?.city,
  }));
  const response = await fetch('/api/validate-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.eligible) throw new Error(payload.error || 'Fixed pricing is not currently available. Please request a quote.');
  return payload;
}
