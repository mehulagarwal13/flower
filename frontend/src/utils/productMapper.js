export function normalizeProduct(product) {
  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    category: product.category,
    tagline: product.tagline || '',
    description: product.description || '',
    startingPrice: product.starting_price ?? product.startingPrice ?? 0,
    basePrice: product.base_price ?? product.basePrice ?? 0,
    badge: product.badge || '',
    images: product.images || [],
    options: product.options || {},
    isActive: product.is_active ?? product.isActive ?? true,
    createdAt: product.created_at || product.createdAt || '',
  };
}

export function normalizeProducts(products = []) {
  return products.map(normalizeProduct).filter(Boolean);
}
