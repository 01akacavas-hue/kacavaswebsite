export function formatPrice(cents: number): string {
  const fractionDigits = cents % 100 === 0 ? 0 : 2
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(cents / 100)
}
