// Strapi API Response Types for Materials
export interface StrapiMaterial {
  id: number;
  documentId: string;
  kode: string;
  kelompok: string;
  bahan_upah_alat_bantu: string;
  satuan: string;
  harga_satuan: number;
  tanggal_update: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  jumlah_harga: number;
  kode_ahs: string;
  no: number;
  nama: string;
  koefisien: number;
}

export interface StrapiSupplier {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  kode: string | null;
  kelompok: string | null;
  nama_supplier: string | null;
  alamat: string | null;
  nomor_telepon: string | null;
  email: string | null;
  pic: string | null;
  hp: string | null;
  tanggal_update: string;
}

export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiMaterialResponse {
  data: StrapiMaterial[];
  meta: {
    pagination: StrapiPagination;
  };
}

export interface StrapiSupplierResponse {
  data: StrapiSupplier[];
  meta: {
    pagination: StrapiPagination;
  };
}

// Display Types
export interface Material {
  id: string;
  kode: string;
  kodeAhs: string;
  no: number;
  nama: string;
  kelompok: string;
  bahanUpahAlatBantu: string;
  satuan: string;
  hargaSatuan: number;
  koefisien: number;
  jumlahHarga: number;
  tanggalUpdate: string;
  createdAt: string;
}

export interface Supplier {
  id: string;
  kode: string;
  kelompok: string;
  namaSupplier: string;
  alamat: string;
  nomorTelepon: string;
  email: string;
  pic: string;
  hp: string;
  tanggalUpdate: string;
  createdAt: string;
}

export type ViewMode = 'grid' | 'list';
export type SortOption = 'recent' | 'name' | 'price-low' | 'price-high' | 'stock-low' | 'stock-high';
