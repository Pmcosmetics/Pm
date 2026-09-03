export function calculatePrice({ basePrice, minPrice = null, maxPrice = null, adjustment = 0 }) {
  const price = Number(basePrice) + Number(adjustment);
  if (!Number.isFinite(price) || price < 0) throw new Error('invalid_price');
  if (minPrice !== null && price < Number(minPrice)) return Number(minPrice);
  if (maxPrice !== null && price > Number(maxPrice)) return Number(maxPrice);
  return Number(price.toFixed(2));
}
