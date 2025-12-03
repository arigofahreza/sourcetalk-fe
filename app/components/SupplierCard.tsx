'use client';

import { Supplier } from '../types/material';

interface SupplierCardProps {
  supplier: Supplier;
  onShowDetails?: (supplierId: string) => void;
}

export default function SupplierCard({ supplier, onShowDetails }: SupplierCardProps) {
  const getKelompokColor = (kelompok: string) => {
    switch (kelompok.toLowerCase()) {
      case 'pondasi':
        return 'bg-purple-100 text-purple-700';
      case 'struktur':
        return 'bg-blue-100 text-blue-700';
      case 'arsitektur':
        return 'bg-green-100 text-green-700';
      case 'mekanikal':
        return 'bg-orange-100 text-orange-700';
      case 'elektrikal':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const kelompokColor = getKelompokColor(supplier.kelompok);

  // Generate random image based on supplier ID for consistency
  const getRandomImage = (id: string) => {
    const seed = parseInt(id) || 1;
    const imageId = 100 + ((seed % 100) + 1); // Offset to get different images than materials
    return `https://picsum.photos/seed/${imageId}/400/400`;
  };

  return (
    <div className="bg-white rounded-lg p-4 relative group hover:shadow-lg transition-shadow duration-200 border border-gray-200 flex flex-col">
      {/* Kelompok Badge */}
      <div className="absolute top-4 right-4">
        <span className={`text-xs font-medium px-2 py-1 rounded ${kelompokColor}`}>
          {supplier.kelompok}
        </span>
      </div>

      {/* Supplier Icon */}
      <div className="aspect-square mb-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg overflow-hidden">
        <img 
          src={getRandomImage(supplier.id)} 
          alt={supplier.namaSupplier}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Supplier Info */}
      <div className="space-y-2 flex-1 flex flex-col">
        {/* Supplier Code */}
        {supplier.kode !== 'N/A' && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-medium">
              {supplier.kode}
            </span>
          </div>
        )}

        {/* Supplier Name */}
        <h3 className="font-medium text-gray-900 text-sm line-clamp-2 min-h-[2.5rem]">
          {supplier.namaSupplier}
        </h3>

        {/* PIC */}
        {supplier.pic !== 'N/A' && (
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>PIC: {supplier.pic}</span>
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-1 pt-2 border-t border-gray-100">
          {supplier.nomorTelepon !== 'N/A' && (
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="truncate">{supplier.nomorTelepon}</span>
            </div>
          )}
          {supplier.hp !== 'N/A' && (
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="truncate">HP: {supplier.hp}</span>
            </div>
          )}
          {supplier.email !== 'N/A' && (
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="truncate">{supplier.email}</span>
            </div>
          )}
        </div>

        {/* Address */}
        {supplier.alamat !== 'N/A' && (
          <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
            <div className="flex items-start gap-1">
              <svg className="w-3 h-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="line-clamp-2">{supplier.alamat}</span>
            </div>
          </div>
        )}

        {/* Update Date */}
        <div className="text-xs text-gray-500 pt-1">
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Updated: {new Date(supplier.tanggalUpdate).toLocaleDateString('id-ID')}</span>
          </div>
        </div>

        {/* Details Button */}
        <button
          onClick={() => onShowDetails?.(supplier.id)}
          className="w-full mt-auto px-4 py-2.5 text-sm font-medium text-white rounded-md transition-all duration-200 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 md:opacity-0 md:group-hover:opacity-100"
        >
          Show Details
        </button>
      </div>
    </div>
  );
}
