'use client';

import { useState, useEffect, useCallback } from 'react';
import { Supplier, ViewMode, StrapiPagination } from '../types/material';
import { MaterialService } from '../services/materialService';
import { Headers } from '../components/Headers';
import SupplierCard from '../components/SupplierCard';

type SupplierSortOption = 'recent' | 'name' | 'kelompok' | 'update-date';

export default function SuppliersPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SupplierSortOption>('recent');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKelompok, setSelectedKelompok] = useState<string>('');
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

  const fetchSuppliers = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const getSortParam = (sort: SupplierSortOption): string => {
        switch (sort) {
          case 'name': return 'nama_supplier:asc';
          case 'kelompok': return 'kelompok:asc';
          case 'update-date': return 'tanggal_update:desc';
          case 'recent': return 'createdAt:desc';
          default: return 'createdAt:desc';
        }
      };

      const result = await MaterialService.fetchSuppliersAsCards({
        page,
        pageSize: 12,
        sort: getSortParam(sortBy),
        search: searchQuery || undefined,
        kelompok: selectedKelompok || undefined,
      });

      setSuppliers(result.suppliers);
      setPagination(result.pagination);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch suppliers');
    } finally {
      setLoading(false);
    }
  }, [sortBy, searchQuery, selectedKelompok]);

  useEffect(() => {
    fetchSuppliers(1);
  }, [fetchSuppliers]);

  const handlePageChange = (page: number) => {
    fetchSuppliers(page);
  };

  const handleShowDetails = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    if (supplier) {
      setSelectedSupplier(supplier);
    }
  };

  const sortOptions = [
    { value: 'recent' as SupplierSortOption, label: 'Recently Added' },
    { value: 'name' as SupplierSortOption, label: 'Name: A to Z' },
    { value: 'kelompok' as SupplierSortOption, label: 'Kelompok: A to Z' },
    { value: 'update-date' as SupplierSortOption, label: 'Last Updated' }
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium mb-2">Error loading suppliers</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button
            onClick={() => fetchSuppliers(1)}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
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
      {selectedSupplier && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4" onClick={() => setSelectedSupplier(null)}>
          <div className="bg-white rounded-lg w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Supplier Details</h2>
              <button
                onClick={() => setSelectedSupplier(null)}
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
                  <div className="aspect-video bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg overflow-hidden">
                    <img 
                      src={`https://picsum.photos/seed/${100 + (parseInt(selectedSupplier.id) % 100 + 1)}/800/400`}
                      alt={selectedSupplier.namaSupplier}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{selectedSupplier.namaSupplier}</h3>
                  {selectedSupplier.kode !== 'N/A' && (
                    <div className="inline-block bg-purple-100 text-purple-700 text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-1 rounded-full">
                      {selectedSupplier.kode}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <div className="text-xs sm:text-sm text-gray-500 mb-1">Kelompok</div>
                    <div className="text-sm sm:text-base font-medium text-gray-900">{selectedSupplier.kelompok}</div>
                  </div>
                  {selectedSupplier.pic !== 'N/A' && (
                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                      <div className="text-xs sm:text-sm text-gray-500 mb-1">PIC</div>
                      <div className="text-sm sm:text-base font-medium text-gray-900">{selectedSupplier.pic}</div>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-3 sm:pt-4">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">Contact Information</h4>
                  <div className="space-y-2 sm:space-y-3">
                    {selectedSupplier.nomorTelepon !== 'N/A' && (
                      <div className="flex items-start gap-2 sm:gap-3">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs sm:text-sm text-gray-500">Phone</div>
                          <div className="text-sm sm:text-base font-medium text-gray-900 break-all">{selectedSupplier.nomorTelepon}</div>
                        </div>
                      </div>
                    )}
                    {selectedSupplier.hp !== 'N/A' && (
                      <div className="flex items-start gap-2 sm:gap-3">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs sm:text-sm text-gray-500">Mobile</div>
                          <div className="text-sm sm:text-base font-medium text-gray-900 break-all">{selectedSupplier.hp}</div>
                        </div>
                      </div>
                    )}
                    {selectedSupplier.email !== 'N/A' && (
                      <div className="flex items-start gap-2 sm:gap-3">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs sm:text-sm text-gray-500">Email</div>
                          <div className="text-sm sm:text-base font-medium text-gray-900 break-all">{selectedSupplier.email}</div>
                        </div>
                      </div>
                    )}
                    {selectedSupplier.alamat !== 'N/A' && (
                      <div className="flex items-start gap-2 sm:gap-3">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs sm:text-sm text-gray-500">Address</div>
                          <div className="text-sm sm:text-base font-medium text-gray-900">{selectedSupplier.alamat}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Last Updated</div>
                  <div className="text-sm sm:text-base font-medium text-gray-900">
                    {new Date(selectedSupplier.tanggalUpdate).toLocaleDateString('id-ID', {
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
          <span className="text-gray-900 font-medium">Suppliers</span>
        </nav>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="md:hidden w-full mb-4 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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
                  }}
                  className="text-xs text-purple-600 hover:text-purple-700"
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
                    placeholder="Search suppliers..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Kelompok Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kelompok</label>
                  <select
                    value={selectedKelompok}
                    onChange={(e) => setSelectedKelompok(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All Kelompok</option>
                    <option value="Pondasi">Pondasi</option>
                    <option value="Struktur">Struktur</option>
                    <option value="Arsitektur">Arsitektur</option>
                    <option value="Mekanikal">Mekanikal</option>
                    <option value="Elektrikal">Elektrikal</option>
                  </select>
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
                      placeholder="Search suppliers..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Kelompok Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kelompok</label>
                    <select
                      value={selectedKelompok}
                      onChange={(e) => setSelectedKelompok(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">All Kelompok</option>
                      <option value="Pondasi">Pondasi</option>
                      <option value="Struktur">Struktur</option>
                      <option value="Arsitektur">Arsitektur</option>
                      <option value="Mekanikal">Mekanikal</option>
                      <option value="Elektrikal">Elektrikal</option>
                    </select>
                  </div>

                  {/* Clear and Apply Buttons */}
                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedKelompok('');
                      }}
                      className="flex-1 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="flex-1 px-4 py-2 text-sm text-white bg-purple-600 rounded-md hover:bg-purple-700"
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
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Suppliers</h1>
                <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
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
                    onChange={(e) => setSortBy(e.target.value as SupplierSortOption)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
              <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-md">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                  <span className="text-sm text-purple-700">Loading suppliers...</span>
                </div>
              </div>
            )}

            {/* Suppliers Grid */}
            <div className={`grid gap-4 mb-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {suppliers.map((supplier) => (
                <SupplierCard
                  key={supplier.id}
                  supplier={supplier}
                  onShowDetails={handleShowDetails}
                />
              ))}
            </div>

            {/* Empty State */}
            {!loading && suppliers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No suppliers found</h3>
                <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
              </div>
            )}

            {/* Pagination */}
            {!loading && suppliers.length > 0 && (
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
                                ? 'bg-purple-600 text-white border-purple-600'
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
