'use client';

import { StrapiPagination } from '../types/catalog';

interface PaginationProps {
  pagination: StrapiPagination;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export default function Pagination({ 
  pagination, 
  onPageChange, 
  loading = false 
}: PaginationProps) {
  const { page, pageCount, total, pageSize } = pagination;
  
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(pageCount - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < pageCount - 1) {
      rangeWithDots.push('...', pageCount);
    } else {
      rangeWithDots.push(pageCount);
    }

    return rangeWithDots;
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pageCount && !loading) {
      onPageChange(newPage);
    }
  };

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      {/* Results info */}
      <div className="text-sm text-gray-600">
        Showing {startItem} to {endItem} of {total} results
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1 || loading}
          className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((pageNum, index) => (
            <div key={index}>
              {pageNum === '...' ? (
                <span className="px-3 py-2 text-sm text-gray-500">...</span>
              ) : (
                <button
                  onClick={() => handlePageChange(pageNum as number)}
                  disabled={loading}
                  className={`px-3 py-2 text-sm border rounded-md ${
                    pageNum === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50 disabled:opacity-50'
                  }`}
                >
                  {pageNum}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === pageCount || loading}
          className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      {/* Page size info */}
      <div className="text-xs text-gray-500">
        Page {page} of {pageCount} • {pageSize} items per page
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          Loading...
        </div>
      )}
    </div>
  );
}