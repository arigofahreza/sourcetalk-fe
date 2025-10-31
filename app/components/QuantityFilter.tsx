'use client';

import { useState, useEffect } from 'react';
import { QuantityRange } from '../types/catalog';
import { Slider } from '@/components/ui/slider';

interface QuantityFilterProps {
  quantityRange: QuantityRange;
  minQty: number;
  maxQty: number;
  onQuantityRangeChange: (range: QuantityRange) => void;
}

export default function QuantityFilter({ 
  quantityRange, 
  minQty, 
  maxQty, 
  onQuantityRangeChange 
}: QuantityFilterProps) {
  const [localMin, setLocalMin] = useState(quantityRange.min);
  const [localMax, setLocalMax] = useState(quantityRange.max);

  useEffect(() => {
    setLocalMin(quantityRange.min);
    setLocalMax(quantityRange.max);
  }, [quantityRange]);

  const handleMinChange = (value: number) => {
    const newMin = Math.min(value, localMax - 1);
    setLocalMin(newMin);
    onQuantityRangeChange({ min: newMin, max: localMax });
  };

  const handleMaxChange = (value: number) => {
    const newMax = Math.max(value, localMin + 1);
    setLocalMax(newMax);
    onQuantityRangeChange({ min: localMin, max: newMax });
  };

  return (
    <div className="space-y-4">
        {/* Quantity Inputs */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Min Qty</label>
            <input
              type="number"
              value={localMin}
              onChange={(e) => handleMinChange(Number(e.target.value))}
              min={minQty}
              max={maxQty}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Max Qty</label>
            <input
              type="number"
              value={localMax}
              onChange={(e) => handleMaxChange(Number(e.target.value))}
              min={minQty}
              max={maxQty}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1000"
            />
          </div>
        </div>

        {/* Range Slider */}
        <div className="relative">
          <Slider
            min={minQty}
            max={maxQty}
            value={[localMin, localMax]}
            onValueChange={(values) => {
              const [newMin, newMax] = values;
              setLocalMin(newMin);
              setLocalMax(newMax);
              onQuantityRangeChange({ min: newMin, max: newMax });
            }}
            className="w-full"
          />
        </div>

        {/* Quantity Display */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{localMin} pcs</span>
          <span>{localMax} pcs</span>
        </div>

        {/* Quick quantity filters */}
        <div className="space-y-2">
          <label className="block text-xs text-gray-500">Quick Filters</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onQuantityRangeChange({ min: 1, max: 10 })}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              Low Stock (1-10)
            </button>
            <button
              onClick={() => onQuantityRangeChange({ min: 11, max: 50 })}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              Medium (11-50)
            </button>
            <button
              onClick={() => onQuantityRangeChange({ min: 51, max: 1000 })}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              High Stock (51+)
            </button>
            <button
              onClick={() => onQuantityRangeChange({ min: 0, max: 0 })}
              className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
            >
              Out of Stock
            </button>
          </div>
        </div>
    </div>
  );
}