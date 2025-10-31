'use client';

import { useState, useEffect } from 'react';
import { WeightRange } from '../types/catalog';
import { Slider } from '@/components/ui/slider';

interface WeightFilterProps {
  weightRange: WeightRange;
  minWeight: number;
  maxWeight: number;
  onWeightRangeChange: (range: WeightRange) => void;
}

export default function WeightFilter({ 
  weightRange, 
  minWeight, 
  maxWeight, 
  onWeightRangeChange 
}: WeightFilterProps) {
  const [localMin, setLocalMin] = useState(weightRange.min);
  const [localMax, setLocalMax] = useState(weightRange.max);

  useEffect(() => {
    setLocalMin(weightRange.min);
    setLocalMax(weightRange.max);
  }, [weightRange]);

  const handleMinChange = (value: number) => {
    const newMin = Math.min(value, localMax - 0.1);
    setLocalMin(newMin);
    onWeightRangeChange({ min: newMin, max: localMax });
  };

  const handleMaxChange = (value: number) => {
    const newMax = Math.max(value, localMin + 0.1);
    setLocalMax(newMax);
    onWeightRangeChange({ min: localMin, max: newMax });
  };

  return (
    <div className="space-y-4">
        {/* Weight Inputs */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Min Weight</label>
            <input
              type="number"
              step="0.1"
              value={localMin}
              onChange={(e) => handleMinChange(Number(e.target.value))}
              min={minWeight}
              max={maxWeight}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.1"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Max Weight</label>
            <input
              type="number"
              step="0.1"
              value={localMax}
              onChange={(e) => handleMaxChange(Number(e.target.value))}
              min={minWeight}
              max={maxWeight}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="10.0"
            />
          </div>
        </div>

        {/* Range Slider */}
        <div className="relative">
          <Slider
            min={minWeight}
            max={maxWeight}
            step={0.1}
            value={[localMin, localMax]}
            onValueChange={(values) => {
              const [newMin, newMax] = values;
              const roundedMin = Math.round(newMin * 10) / 10;
              const roundedMax = Math.round(newMax * 10) / 10;
              setLocalMin(roundedMin);
              setLocalMax(roundedMax);
              onWeightRangeChange({ min: roundedMin, max: roundedMax });
            }}
            className="w-full"
          />
        </div>

        {/* Weight Display */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{localMin} kg</span>
          <span>{localMax} kg</span>
        </div>

        {/* Quick weight filters */}
        <div className="space-y-2">
          <label className="block text-xs text-gray-500">Quick Filters</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onWeightRangeChange({ min: 0, max: 0.5 })}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              Ultra Light (&lt;0.5kg)
            </button>
            <button
              onClick={() => onWeightRangeChange({ min: 0.5, max: 2.0 })}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              Light (0.5-2kg)
            </button>
            <button
              onClick={() => onWeightRangeChange({ min: 2.0, max: 5.0 })}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              Medium (2-5kg)
            </button>
            <button
              onClick={() => onWeightRangeChange({ min: 5.0, max: 50.0 })}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              Heavy (5kg+)
            </button>
          </div>
        </div>
    </div>
  );
}