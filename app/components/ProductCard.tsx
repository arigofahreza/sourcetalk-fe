'use client';

import Image from 'next/image';
import { Product } from '../types/catalog';
import ImageSrc from '@/public/sample.jpeg';

interface ProductCardProps {
  product: Product;
  onToggleLike?: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
}

export default function ProductCard({ 
  product, 
  onToggleLike,
  onAddToCart 
}: ProductCardProps) {
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };


  return (
    <div className="bg-white rounded-lg p-4 relative group hover:shadow-lg transition-shadow duration-200">

      {/* Product Image */}
      <div className="aspect-square mb-3  rounded-lg overflow-hidden">
        <Image
          src={ImageSrc}
          alt={product.name}
          width={300}
          height={300}
          className="w-full h-full object-contain p-4"
        />
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{product.category}</span>
          <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-xs">
            {product.codename}
          </span>
        </div>

        {/* API specific details */}
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <span>Pos: {product.pos}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Art: {product.art_pts_list_no}</span>
          </div>
        </div>

        {/* Product details */}
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>Qty: {product.qty} {product.qu}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l-3-3m3 3l3-3" />
            </svg>
            <span>{product.weight > 0 ? `${product.weight}kg` : 'N/A'}</span>
          </div>
        </div>

        <div className="text-xs text-gray-400">
          Added: {new Date(product.date).toLocaleDateString()}
        </div>


        {/* Buy Button - Only show on hover or mobile */}
        <button
          onClick={() => onAddToCart?.(product.id)}
          className={`w-full mt-3 px-4 py-2 text-sm font-medium text-white rounded-md transition-all duration-200 bg-blue-600 hover:bg-blue-700 opacity-0 group-hover:opacity-100 md:opacity-100`}
        >
          Show Details
        </button>
      </div>
    </div>
  );
}