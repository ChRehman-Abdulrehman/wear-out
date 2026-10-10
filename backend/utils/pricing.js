// Shared sale-pricing helper — single source of truth for effective price.
function pricing(product, now = Date.now()) {
  const price = Number(product?.price) || 0;
  const salePrice = Number(product?.salePrice) || 0;
  const start = product?.saleStart ? new Date(product.saleStart).getTime() : null;
  const end = product?.saleEnd ? new Date(product.saleEnd).getTime() : null;
  const inWindow = (!start || now >= start) && (!end || now <= end);
  const onSale = salePrice > 0 && salePrice < price && inWindow;
  const current = onSale ? salePrice : price;
  const discountPct = onSale && price > 0 ? Math.round((1 - salePrice / price) * 100) : 0;
  return { price, salePrice, current, onSale, discountPct };
}

module.exports = { pricing };
