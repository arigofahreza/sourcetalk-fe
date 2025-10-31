'use client';

import { Product, ViewMode } from '../types/catalog';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  viewMode: ViewMode;
  onToggleLike?: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
  onShowMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

export default function ProductGrid({
  products,
  viewMode,
  onToggleLike,
  onAddToCart,
  onShowMore,
  hasMore = false,
  isLoading = false
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-6m-6 0H4" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Products Grid */}
      <div className={`grid gap-4 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1'
      }`}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onToggleLike={onToggleLike}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Show More Button */}
      {hasMore && !isLoading && (
        <div className="flex justify-center pt-8">
          <button
            onClick={onShowMore}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Show 145 More
          </button>
        </div>
      )}

      {/* Products Count Info */}
      <div className="text-center text-sm text-gray-500 pt-4">
        Showing {products.length} product{products.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}