'use client';

import { useState, useEffect, useCallback } from 'react';
import { Material, ViewMode, SortOption, StrapiPagination } from '../types/material';
import { MaterialService } from '../services/materialService';
import { Headers } from '../components/Headers';
import MaterialCard from '../components/MaterialCard';

export default function MaterialsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKelompok, setSelectedKelompok] = useState<string>('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<StrapiPagination>({
    page: 1,
    pageSize: 12,
    pageCount: 1,
    total: 0
  });

  const fetchMaterials = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const getSortParam = (sort: SortOption): string => {
        switch (sort) {
          case 'name': return 'nama:asc';
          case 'recent': return 'createdAt:desc';
          case 'price-low': return 'harga_satuan:asc';
          case 'price-high': return 'harga_satuan:desc';
          case 'stock-low': return 'no:asc';
          case 'stock-high': return 'no:desc';
          default: return 'createdAt:desc';
        }
      };

      const result = await MaterialService.fetchMaterialsAsCards({
        page,
        pageSize: 12,
        sort: getSortParam(sortBy),
        search: searchQuery || undefined,
        kelompok: selectedKelompok || undefined,
        priceMin: priceRange.min ? parseFloat(priceRange.min) : undefined,
        priceMax: priceRange.max ? parseFloat(priceRange.max) : undefined,
      });

      setMaterials(result.materials);
      setPagination(result.pagination);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch materials');
    } finally {
      setLoading(false);
    }
  }, [sortBy, searchQuery, selectedKelompok, priceRange]);

  useEffect(() => {
    fetchMaterials(1);
  }, [fetchMaterials]);

  const handlePageChange = (page: number) => {
    fetchMaterials(page);
  };

  const handleShowDetails = (materialId: string) => {
    const material = materials.find(m => m.id === materialId);
    if (material) {
      setSelectedMaterial(material);
    }
  };

  const sortOptions = [
    { value: 'recent' as SortOption, label: 'Recently Added' },
    { value: 'name' as SortOption, label: 'Name: A to Z' },
    { value: 'price-low' as SortOption, label: 'Price: Low to High' },
    { value: 'price-high' as SortOption, label: 'Price: High to Low' },
    { value: 'stock-low' as SortOption, label: 'No: Low to High' },
    { value: 'stock-high' as SortOption, label: 'No: High to Low' }
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium mb-2">Error loading materials</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button
            onClick={() => fetchMaterials(1)}
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
      <Headers />
      
      {/* Detail Modal */}
      {selectedMaterial && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4" onClick={() => setSelectedMaterial(null)}>
          <div className="bg-white rounded-lg w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Material Details</h2>
              <button
                onClick={() => setSelectedMaterial(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="col-span-1 sm:col-span-2">
                  <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg overflow-hidden">
                    <img 
                      src={`https://picsum.photos/seed/${parseInt(selectedMaterial.id) % 100 + 1}/800/400`}
                      alt={selectedMaterial.nama}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{selectedMaterial.nama}</h3>
                  {selectedMaterial.bahanUpahAlatBantu && selectedMaterial.bahanUpahAlatBantu !== selectedMaterial.nama && (
                    <p className="text-xs sm:text-sm text-gray-600">{selectedMaterial.bahanUpahAlatBantu}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <div className="text-xs sm:text-sm text-gray-500 mb-1">Kode</div>
                    <div className="font-mono text-sm sm:text-base font-medium text-gray-900">{selectedMaterial.kode}</div>
                  </div>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <div className="text-xs sm:text-sm text-gray-500 mb-1">Kode AHS</div>
                    <div className="font-mono text-sm sm:text-base font-medium text-gray-900">{selectedMaterial.kodeAhs}</div>
                  </div>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <div className="text-xs sm:text-sm text-gray-500 mb-1">No</div>
                    <div className="text-sm sm:text-base font-medium text-gray-900">{selectedMaterial.no}</div>
                  </div>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <div className="text-xs sm:text-sm text-gray-500 mb-1">Kelompok</div>
                    <div className="text-sm sm:text-base font-medium text-gray-900">{selectedMaterial.kelompok}</div>
                  </div>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <div className="text-xs sm:text-sm text-gray-500 mb-1">Satuan</div>
                    <div className="text-sm sm:text-base font-medium text-gray-900">{selectedMaterial.satuan}</div>
                  </div>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <div className="text-xs sm:text-sm text-gray-500 mb-1">Koefisien</div>
                    <div className="text-sm sm:text-base font-medium text-gray-900">{selectedMaterial.koefisien}</div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3 sm:pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <div className="text-xs sm:text-sm text-gray-500 mb-1">Harga Satuan</div>
                      <div className="text-xl sm:text-2xl font-bold text-blue-600">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(selectedMaterial.hargaSatuan)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm text-gray-500 mb-1">Jumlah Harga</div>
                      <div className="text-xl sm:text-2xl font-bold text-gray-900">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(selectedMaterial.jumlahHarga)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Last Updated</div>
                  <div className="text-sm sm:text-base font-medium text-gray-900">
                    {new Date(selectedMaterial.tanggalUpdate).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-600 mb-4 md:mb-6">
          <a href="/" className="hover:text-gray-900">Home</a>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Materials</span>
        </nav>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="md:hidden w-full mb-4 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        <div className="flex gap-6">
          {/* Left Sidebar Filters - Desktop */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedKelompok('');
                    setPriceRange({ min: '', max: '' });
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search materials..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Kelompok Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kelompok</label>
                  <select
                    value={selectedKelompok}
                    onChange={(e) => setSelectedKelompok(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Kelompok</option>
                    <option value="Upah">Upah</option>
                    <option value="Bahan">Bahan</option>
                    <option value="Alat">Alat</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      placeholder="Min Price"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      placeholder="Max Price"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          {showMobileFilters && (
            <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowMobileFilters(false)}>
              <div className="bg-white w-full max-w-sm h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Filters</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="p-4 space-y-4">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search materials..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Kelompok Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kelompok</label>
                    <select
                      value={selectedKelompok}
                      onChange={(e) => setSelectedKelompok(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Kelompok</option>
                      <option value="Upah">Upah</option>
                      <option value="Bahan">Bahan</option>
                      <option value="Alat">Alat</option>
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                    <div className="space-y-2">
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        placeholder="Min Price"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        placeholder="Max Price"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Clear and Apply Buttons */}
                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedKelompok('');
                        setPriceRange({ min: '', max: '' });
                      }}
                      className="flex-1 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="flex-1 px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Materials</h1>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  {pagination.total}
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                {/* View mode toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                </div>

                {/* Sort dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <svg 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Loading indicator */}
            {loading && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-sm text-blue-700">Loading materials...</span>
                </div>
              </div>
            )}

            {/* Materials Grid */}
            <div className={`grid gap-4 mb-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {materials.map((material) => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  onShowDetails={handleShowDetails}
                />
              ))}
            </div>

            {/* Empty State */}
            {!loading && materials.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-6m-6 0H4" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
                <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
              </div>
            )}

            {/* Pagination */}
            {!loading && materials.length > 0 && (
              <div className="flex flex-col items-center gap-4 mt-8">
                <div className="text-xs sm:text-sm text-gray-600 text-center">
                  Showing {(pagination.page - 1) * pagination.pageSize + 1} to {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} results
                </div>

                <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1 || loading}
                    className="px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Prev</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: pagination.pageCount }, (_, i) => i + 1)
                      .filter(page => {
                        return page === 1 || 
                               page === pagination.pageCount || 
                               Math.abs(page - pagination.page) <= 1;
                      })
                      .map((page, index, array) => (
                        <div key={page}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="px-2 py-2 text-xs sm:text-sm text-gray-500">...</span>
                          )}
                          <button
                            onClick={() => handlePageChange(page)}
                            disabled={loading}
                            className={`px-2 sm:px-3 py-2 text-xs sm:text-sm border rounded-md ${
                              page === pagination.page
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-gray-50 disabled:opacity-50'
                            }`}
                          >
                            {page}
                          </button>
                        </div>
                      ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pageCount || loading}
                    className="px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
