'use client';

import { DateRange } from '../types/catalog';

interface DateFilterProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export default function DateFilter({ 
  dateRange, 
  onDateRangeChange 
}: DateFilterProps) {
  const handleStartDateChange = (date: string) => {
    onDateRangeChange({
      ...dateRange,
      startDate: date
    });
  };

  const handleEndDateChange = (date: string) => {
    onDateRangeChange({
      ...dateRange,
      endDate: date
    });
  };

  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="space-y-2">
          <label className="block text-xs text-gray-500">From Date</label>
          <input
            type="date"
            value={formatDateForInput(dateRange.startDate)}
            onChange={(e) => handleStartDateChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-xs text-gray-500">To Date</label>
          <input
            type="date"
            value={formatDateForInput(dateRange.endDate)}
            onChange={(e) => handleEndDateChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Quick date filters */}
        <div className="space-y-2">
          <label className="block text-xs text-gray-500">Quick Filters</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                const today = new Date();
                const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                onDateRangeChange({
                  startDate: lastWeek.toISOString(),
                  endDate: today.toISOString()
                });
              }}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              Last 7 days
            </button>
            <button
              onClick={() => {
                const today = new Date();
                const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                onDateRangeChange({
                  startDate: lastMonth.toISOString(),
                  endDate: today.toISOString()
                });
              }}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              Last 30 days
            </button>
            <button
              onClick={() => {
                const today = new Date();
                const startOfYear = new Date(today.getFullYear(), 0, 1);
                onDateRangeChange({
                  startDate: startOfYear.toISOString(),
                  endDate: today.toISOString()
                });
              }}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              This year
            </button>
            <button
              onClick={() => {
                onDateRangeChange({
                  startDate: '',
                  endDate: ''
                });
              }}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              All time
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}