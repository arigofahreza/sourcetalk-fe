'use client';

import { Material } from '../types/material';

interface MaterialCardProps {
  material: Material;
  onShowDetails?: (materialId: string) => void;
}

export default function MaterialCard({ material, onShowDetails }: MaterialCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getKelompokColor = (kelompok: string) => {
    switch (kelompok.toLowerCase()) {
      case 'upah':
        return 'bg-blue-100 text-blue-700';
      case 'bahan':
        return 'bg-green-100 text-green-700';
      case 'alat':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const kelompokColor = getKelompokColor(material.kelompok);

  // Generate random image based on material ID for consistency
  const getRandomImage = (id: string) => {
    const seed = parseInt(id) || 1;
    const imageId = (seed % 100) + 1;
    return `https://picsum.photos/seed/${imageId}/400/400`;
  };

  return (
    <div className="bg-white rounded-lg p-4 relative group hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      {/* Kelompok Badge */}
      <div className="absolute top-4 right-4">
        <span className={`text-xs font-medium px-2 py-1 rounded ${kelompokColor}`}>
          {material.kelompok}
        </span>
      </div>

      {/* Material Icon/Image */}
      <div className="aspect-square mb-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg overflow-hidden">
        <img 
          src={getRandomImage(material.id)} 
          alt={material.nama}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Material Info */}
      <div className="space-y-2">
        {/* Material Code & Number */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
            {material.kode}
          </span>
          <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            No: {material.no}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-medium text-gray-900 text-sm line-clamp-2 min-h-[2.5rem]">
          {material.nama}
        </h3>

        {/* Description */}
        {material.bahanUpahAlatBantu && material.bahanUpahAlatBantu !== material.nama && (
          <p className="text-xs text-gray-500 line-clamp-1">
            {material.bahanUpahAlatBantu}
          </p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-blue-600">
            {formatPrice(material.hargaSatuan)}
          </span>
          <span className="text-xs text-gray-500">/ {material.satuan}</span>
        </div>

        {/* Koefisien & Jumlah Harga */}
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            <span>Koef: {material.koefisien}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formatPrice(material.jumlahHarga)}</span>
          </div>
        </div>

        {/* Kode AHS & Update Date */}
        <div className="text-xs text-gray-500 pt-1 space-y-1">
          <div className="flex items-center gap-1">
            <span className="font-medium">AHS:</span>
            <span className="font-mono">{material.kodeAhs}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Updated: {new Date(material.tanggalUpdate).toLocaleDateString('id-ID')}</span>
          </div>
        </div>

        {/* Details Button */}
        <button
          onClick={() => onShowDetails?.(material.id)}
          className="w-full mt-3 px-4 py-2.5 text-sm font-medium text-white rounded-md transition-all duration-200 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 md:opacity-0 md:group-hover:opacity-100"
        >
          Show Details
        </button>
      </div>
    </div>
  );
}
