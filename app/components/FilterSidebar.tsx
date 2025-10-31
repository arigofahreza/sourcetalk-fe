'use client';

import { FilterState, DateRange, QuantityRange, WeightRange } from '../types/catalog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import DateFilter from './DateFilter';
import QuantityFilter from './QuantityFilter';
import WeightFilter from './WeightFilter';
import CodenameFilter from './CodenameFilter';

interface FilterSidebarProps {
  filters: FilterState;
  minQty: number;
  maxQty: number;
  minWeight: number;
  maxWeight: number;
  onDateRangeChange: (range: DateRange) => void;
  onQuantityRangeChange: (range: QuantityRange) => void;
  onWeightRangeChange: (range: WeightRange) => void;
  onCodenameChange: (codenameId: string, checked: boolean) => void;
  onClearFilters: () => void;
  itemCount: number;
}

export default function FilterSidebar({
  filters,
  minQty,
  maxQty,
  minWeight,
  maxWeight,
  onDateRangeChange,
  onQuantityRangeChange,
  onWeightRangeChange,
  onCodenameChange,
  onClearFilters,
  itemCount
}: FilterSidebarProps) {
  return (
    <div className="w-64 bg-white p-6 border-r border-gray-200 h-fit sticky top-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <button
          onClick={onClearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Clear
        </button>
      </div>

      <Accordion type="multiple" defaultValue={["date", "quantity", "weight", "codename"]} className="space-y-0">
        {/* Date Filter */}
        <AccordionItem value="date">
          <AccordionTrigger className="text-base font-medium text-gray-900">
            Date Range
          </AccordionTrigger>
          <AccordionContent>
            <DateFilter
              dateRange={filters.dateRange}
              onDateRangeChange={onDateRangeChange}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Quantity Filter */}
        <AccordionItem value="quantity">
          <AccordionTrigger className="text-base font-medium text-gray-900">
            Quantity Range
          </AccordionTrigger>
          <AccordionContent>
            <QuantityFilter
              quantityRange={filters.quantityRange}
              minQty={minQty}
              maxQty={maxQty}
              onQuantityRangeChange={onQuantityRangeChange}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Weight Filter */}
        <AccordionItem value="weight">
          <AccordionTrigger className="text-base font-medium text-gray-900">
            Weight Range
          </AccordionTrigger>
          <AccordionContent>
            <WeightFilter
              weightRange={filters.weightRange}
              minWeight={minWeight}
              maxWeight={maxWeight}
              onWeightRangeChange={onWeightRangeChange}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Codename Filter */}
        <AccordionItem value="codename">
          <AccordionTrigger className="text-base font-medium text-gray-900">
            Codename
          </AccordionTrigger>
          <AccordionContent>
            <CodenameFilter
              codenames={filters.codenames}
              onCodenameChange={onCodenameChange}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Filter Results Count */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="bg-blue-50 text-blue-800 text-sm font-medium px-3 py-2 rounded-lg text-center">
          {itemCount} items found
        </div>
      </div>
    </div>
  );
}