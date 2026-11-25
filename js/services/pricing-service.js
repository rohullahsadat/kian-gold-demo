
export function calculateProductPrice(product, gold) {
  const base =
    Number(gold.gram24) *
    (Number(product.karat) / 24) *
    Number(product.weight);

  const making = base * Number(product.making || 0);
  const margin = (base + making) * Number(product.margin || 0);
  const extra = Number(product.extra || 0);

  return {
    gold: base,
    making,
    margin,
    extra,
    total: base + making + margin + extra
  };
}

export function money(value) {
  return (
    new Intl.NumberFormat('fa-IR', {
      maximumFractionDigits: 0
    }).format(Math.round(Number(value) || 0)) + ' تومان'
  );
}
