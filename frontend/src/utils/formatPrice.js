// src/utils/formatPrice.js
export const formatPrice = (value) => {
  if (value === null || value === undefined) return ""

return new Intl.NumberFormat("es-AR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}).format(value)

}
