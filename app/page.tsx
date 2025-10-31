'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Product, ViewMode, SortOption, DateRange, QuantityRange, WeightRange, FilterState, StrapiPagination } from './types/catalog';
import { ApiService } from './services/apiService';
import { useDebounce } from './hooks/useDebounce';

import CatalogHeader from './components/CatalogHeader';
import FilterSidebar from './components/FilterSidebar';
import ProductGrid from './components/ProductGrid';
import Pagination from './components/Pagination';
import FilterIndicator from './components/FilterIndicator';
import { Headers } from './components/Headers';

export default function Home() {
  // State management
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<StrapiPagination>({
    page: 1,
    pageSize: 8,
    pageCount: 1,
    total: 0
  });
  
  const [filters, setFilters] = useState<FilterState>({
    dateRange: { startDate: '', endDate: '' },
    quantityRange: { min: 0, max: 200 },
    weightRange: { min: 0, max: 2 },
    codenames: []
  });

  // Debounce filters for API calls (2 seconds)
  const debouncedFilters = useDebounce(filters, 2000);

  // Track if filter is being debounced
  const [isFilterUpdating, setIsFilterUpdating] = useState(false);

  // Fetch data from API with filters
  const fetchData = useCallback(async (page = 1, resetFilters = false, filterOverride?: FilterState) => {
    setLoading(true);
    setError(null);
    
    try {
      // Map sort option to API sort parameter
      const getSortParam = (sort: SortOption): string => {
        switch (sort) {
          case 'name': return 'title:asc';
          case 'date-new': return 'createdAt:desc';
          case 'date-old': return 'createdAt:asc';
          case 'price-low': return 'pos:asc'; // Using pos as proxy for price
          case 'price-high': return 'pos:desc';
          default: return 'id:desc';
        }
      };

      // Use provided filters or current filters
      const activeFilters = filterOverride || filters;
      
      // Get selected codenames
      const selectedCodenames = activeFilters.codenames
        .filter(codename => codename.checked)
        .map(codename => codename.id);

      const result = await ApiService.fetchCatalogsAsProducts({
        page,
        pageSize: 8,
        sort: getSortParam(sortBy),
        // Apply filters to API call
        dateStart: activeFilters.dateRange.startDate || undefined,
        dateEnd: activeFilters.dateRange.endDate || undefined,
        qtyMin: activeFilters.quantityRange.min,
        qtyMax: activeFilters.quantityRange.max,
        weightMin: activeFilters.weightRange.min,
        weightMax: activeFilters.weightRange.max,
        codenames: selectedCodenames.length > 0 ? selectedCodenames : undefined
      });

      setProducts(result.products);
      setPagination(result.pagination);

      // Initialize codenames filter from fetched data
      if (resetFilters || filters.codenames.length === 0) {
        const uniqueCodenames = Array.from(
          new Set(result.products.map(p => p.codename))
        ).map(codename => ({
          id: codename,
          name: codename,
          checked: false
        }));
        
        setFilters(prev => ({
          ...prev,
          codenames: uniqueCodenames
        }));
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [sortBy, filters]);

  // Initial data fetch
  useEffect(() => {
    fetchData(1, true);
  }, []);

  // Refetch when sort changes
  useEffect(() => {
    if (products.length > 0) {
      fetchData(pagination.page);
    }
  }, [sortBy]);

  // Refetch when debounced filters change (after 2 seconds)
  useEffect(() => {
    if (products.length > 0) {
      setIsFilterUpdating(false);
      fetchData(1, false, debouncedFilters);
    }
  }, [debouncedFilters]);

  // Track when filters are being changed (before debounce)
  useEffect(() => {
    if (products.length > 0) {
      setIsFilterUpdating(true);
    }
  }, [filters]);

  // Calculate min/max values from current products
  const { minQty, maxQty, minWeight, maxWeight } = useMemo(() => {
    if (products.length === 0) {
      return { minQty: 0, maxQty: 100, minWeight: 0, maxWeight: 10 };
    }
    
    const quantities = products.map(p => p.qty);
    const weights = products.map(p => p.weight);
    return {
      minQty: Math.min(...quantities),
      maxQty: Math.max(...quantities),
      minWeight: Math.min(...weights),
      maxWeight: Math.max(...weights)
    };
  }, [products]);

  // Since filtering is now done on the server side, we use products directly
  const filteredProducts = products;

  // Event handlers
  const handlePageChange = (page: number) => {
    fetchData(page);
  };

  const handleDateRangeChange = (range: DateRange) => {
    setFilters(prev => ({
      ...prev,
      dateRange: range
    }));
  };

  const handleQuantityRangeChange = (range: QuantityRange) => {
    setFilters(prev => ({
      ...prev,
      quantityRange: range
    }));
  };

  const handleWeightRangeChange = (range: WeightRange) => {
    setFilters(prev => ({
      ...prev,
      weightRange: range
    }));
  };

  const handleCodenameChange = (codenameId: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      codenames: prev.codenames.map(codename =>
        codename.id === codenameId ? { ...codename, checked } : codename
      )
    }));
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      dateRange: { startDate: '', endDate: '' },
      quantityRange: { min: minQty, max: maxQty },
      weightRange: { min: minWeight, max: maxWeight },
      codenames: filters.codenames.map(codename => ({ ...codename, checked: false }))
    };
    
    setFilters(defaultFilters);
    setIsFilterUpdating(false); // Don't show debounce indicator for clear
    
    // Immediately fetch with cleared filters
    fetchData(1, false, defaultFilters);
  };

  const handleToggleLike = (productId: string) => {
    setProducts(prev => prev.map(product =>
      product.id === productId ? { ...product, isLiked: !product.isLiked } : product
    ));
  };

  const handleAddToCart = (productId: string) => {
    console.log('Add to cart:', productId);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium mb-2">Error loading catalog</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button
            onClick={() => fetchData(1, true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Filter debounce indicator */}
      <FilterIndicator isActive={isFilterUpdating && !loading} delay={2000} />
      
      <div className="flex">
        {/* Sidebar */}
        <FilterSidebar
          filters={filters}
          minQty={minQty}
          maxQty={maxQty}
          minWeight={minWeight}
          maxWeight={maxWeight}
          onDateRangeChange={handleDateRangeChange}
          onQuantityRangeChange={handleQuantityRangeChange}
          onWeightRangeChange={handleWeightRangeChange}
          onCodenameChange={handleCodenameChange}
          onClearFilters={handleClearFilters}
          itemCount={pagination.total}
        />

        {/* Main Content */}
        <div className="w-full">
          <div className="w-full justify-end">
            <Headers />
            </div>
          <div className="flex-1 p-6">
          
          {/* Filter loading indicator */}
          {loading && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-sm text-blue-700">Applying filters...</span>
              </div>
            </div>
          )}
          <CatalogHeader
            totalProducts={pagination.total}
            viewMode={viewMode}
            sortBy={sortBy}
            onViewModeChange={setViewMode}
            onSortChange={setSortBy}
          />

          <ProductGrid
            products={filteredProducts}
            viewMode={viewMode}
            onToggleLike={handleToggleLike}
            onAddToCart={handleAddToCart}
            hasMore={false}
            isLoading={loading}
          />

          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
            loading={loading}
          />
        </div>
        </div>
      </div>
    </div>
  );
}
