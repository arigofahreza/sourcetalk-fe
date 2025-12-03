import { 
  StrapiMaterialResponse, 
  StrapiSupplierResponse,
  StrapiMaterial,
  StrapiSupplier,
  Material,
  Supplier,
  StrapiPagination
} from '../types/material';

const API_BASE_URL = 'https://strapi.jailbreak.pro/api';
const BEARER_TOKEN = '7fc618c6cdcef286f3727b036756f2eafd741ff4ff394af7f1481fd09901bd676422b596164d083b55292d19d0dcc3f2be872bef4af1a6eb8ee25bad6f6ac580a414abb31e1cb1919f3677d91dfd01ac658846be8bd56ad0cb3d3b4b7de3e48db86d488787a6be2e5308e7f3789c192dc8441401516e8d63cb3d5142923d143b';

export interface FetchMaterialsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  kelompok?: string;
  sort?: string;
  priceMin?: number;
  priceMax?: number;
}

export interface FetchSuppliersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  kelompok?: string;
  sort?: string;
}

export class MaterialService {
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Materials
  static async fetchMaterials(params: FetchMaterialsParams = {}): Promise<StrapiMaterialResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('pagination[page]', params.page.toString());
    if (params.pageSize) searchParams.append('pagination[pageSize]', params.pageSize.toString());
    if (params.search) {
      searchParams.append('filters[$or][0][nama][$containsi]', params.search);
      searchParams.append('filters[$or][1][kode][$containsi]', params.search);
      searchParams.append('filters[$or][2][bahan_upah_alat_bantu][$containsi]', params.search);
    }
    if (params.kelompok) searchParams.append('filters[kelompok][$containsi]', params.kelompok);
    if (params.sort) searchParams.append('sort', params.sort);
    
    if (params.priceMin !== undefined) {
      searchParams.append('filters[harga_satuan][$gte]', params.priceMin.toString());
    }
    if (params.priceMax !== undefined) {
      searchParams.append('filters[harga_satuan][$lte]', params.priceMax.toString());
    }

    const endpoint = `/materials?${searchParams.toString()}`;
    return this.request<StrapiMaterialResponse>(endpoint);
  }

  static mapStrapiMaterialToMaterial(item: StrapiMaterial): Material {
    return {
      id: item.id.toString(),
      kode: item.kode || 'N/A',
      kodeAhs: item.kode_ahs || 'N/A',
      no: item.no || 0,
      nama: item.nama || item.bahan_upah_alat_bantu || 'Unnamed Material',
      kelompok: item.kelompok || 'General',
      bahanUpahAlatBantu: item.bahan_upah_alat_bantu || '',
      satuan: item.satuan || 'Hr',
      hargaSatuan: item.harga_satuan || 0,
      koefisien: item.koefisien || 0,
      jumlahHarga: item.jumlah_harga || 0,
      tanggalUpdate: item.tanggal_update || new Date().toISOString().split('T')[0],
      createdAt: item.createdAt || new Date().toISOString(),
    };
  }
  static async fetchMaterialsAsCards(params: FetchMaterialsParams = {}): Promise<{
    materials: Material[];
    pagination: StrapiPagination;
  }> {
    const response = await this.fetchMaterials(params);
    const materials = response.data.map(this.mapStrapiMaterialToMaterial);
    
    return {
      materials,
      pagination: response.meta.pagination,
    };
  }

  // Suppliers
  static async fetchSuppliers(params: FetchSuppliersParams = {}): Promise<StrapiSupplierResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('pagination[page]', params.page.toString());
    if (params.pageSize) searchParams.append('pagination[pageSize]', params.pageSize.toString());
    if (params.search) {
      searchParams.append('filters[$or][0][nama_supplier][$containsi]', params.search);
      searchParams.append('filters[$or][1][kode][$containsi]', params.search);
      searchParams.append('filters[$or][2][pic][$containsi]', params.search);
    }
    if (params.kelompok) searchParams.append('filters[kelompok][$containsi]', params.kelompok);
    if (params.sort) searchParams.append('sort', params.sort);

    const endpoint = `/suppliers?${searchParams.toString()}`;
    return this.request<StrapiSupplierResponse>(endpoint);
  }

  static mapStrapiSupplierToSupplier(item: StrapiSupplier): Supplier {
    return {
      id: item.id.toString(),
      kode: item.kode || 'N/A',
      kelompok: item.kelompok || 'General',
      namaSupplier: item.nama_supplier || 'Unnamed Supplier',
      alamat: item.alamat || 'N/A',
      nomorTelepon: item.nomor_telepon || 'N/A',
      email: item.email || 'N/A',
      pic: item.pic || 'N/A',
      hp: item.hp || 'N/A',
      tanggalUpdate: item.tanggal_update || new Date().toISOString().split('T')[0],
      createdAt: item.createdAt || new Date().toISOString(),
    };
  }

  static async fetchSuppliersAsCards(params: FetchSuppliersParams = {}): Promise<{
    suppliers: Supplier[];
    pagination: StrapiPagination;
  }> {
    const response = await this.fetchSuppliers(params);
    const suppliers = response.data.map(this.mapStrapiSupplierToSupplier);
    
    return {
      suppliers,
      pagination: response.meta.pagination,
    };
  }
}
