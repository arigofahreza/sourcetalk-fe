import { StrapiApiResponse, StrapiCatalogItem, Product } from '../types/catalog';

const API_BASE_URL = 'https://strapi.jailbreak.pro/api';
const BEARER_TOKEN = '7fc618c6cdcef286f3727b036756f2eafd741ff4ff394af7f1481fd09901bd676422b596164d083b55292d19d0dcc3f2be872bef4af1a6eb8ee25bad6f6ac580a414abb31e1cb1919f3677d91dfd01ac658846be8bd56ad0cb3d3b4b7de3e48db86d488787a6be2e5308e7f3789c192dc8441401516e8d63cb3d5142923d143b';

export interface FetchCatalogsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  codename?: string;
  sort?: string;
  dateStart?: string;
  dateEnd?: string;
  qtyMin?: number;
  qtyMax?: number;
  weightMin?: number;
  weightMax?: number;
  codenames?: string[];
}

export class ApiService {
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

  static async fetchCatalogs(params: FetchCatalogsParams = {}): Promise<StrapiApiResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('pagination[page]', params.page.toString());
    if (params.pageSize) searchParams.append('pagination[pageSize]', params.pageSize.toString());
    if (params.search) searchParams.append('filters[title][$containsi]', params.search);
    if (params.codename) searchParams.append('filters[codename][$containsi]', params.codename);
    if (params.sort) searchParams.append('sort', params.sort);
    
    // Date filters
    if (params.dateStart) {
      const convertedDate = params.dateStart.split('T')[0]; // Convert to YYYY-MM-DD
      searchParams.append('filters[date][$gte]', convertedDate);
    }
    if (params.dateEnd) {
      const convertedDate = params.dateEnd.split('T')[0]; // Convert to YYYY-MM-DD
      searchParams.append('filters[date][$lte]', convertedDate);
    }
    
    // Quantity filters
    if (params.qtyMin !== undefined) {
      searchParams.append('filters[qty][$gte]', params.qtyMin.toString());
    }
    if (params.qtyMax !== undefined) {
      searchParams.append('filters[qty][$lte]', params.qtyMax.toString());
    }
    
    // Weight filters
    if (params.weightMin !== undefined) {
      searchParams.append('filters[weight][$gte]', params.weightMin.toString());
    }
    if (params.weightMax !== undefined) {
      searchParams.append('filters[weight][$lte]', params.weightMax.toString());
    }
    
    // Codenames filter (multiple values)
    if (params.codenames && params.codenames.length > 0) {
      params.codenames.forEach((codename, index) => {
        searchParams.append(`filters[$or][${index}][codename][$eq]`, codename);
      });
    }

    const endpoint = `/catalogs?${searchParams.toString()}`;
    return this.request<StrapiApiResponse>(endpoint);
  }

  static mapStrapiItemToProduct(item: StrapiCatalogItem): Product {
    // Convert DD.MM.YYYY to ISO date format
    const convertDate = (dateStr: string): string => {
      if (!dateStr) return new Date().toISOString();
      
      const parts = dateStr.split('.');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        return new Date(`${year}-${month}-${day}`).toISOString();
      }
      return new Date().toISOString();
    };


    
    return {
      id: item.id.toString(),
      name: item.title || 'Untitled Item',
      image: '/api/placeholder/300/300', // Placeholder image
      category: item.art_pts_list_no || 'General',
      brand: 'Industrial Equipment',
      color: 'gray',
      inStock: item.qty > 0,
      isSpecial: item.bg === 'X',
      discount: Math.random() > 0.7 ? Math.round(Math.random() * 30) : undefined,
      isLiked: false,
      date: convertDate(item.date),
      qty: item.qty,
      weight: item.weight,
      codename: item.codename,
      filename: item.filename,
      part_list_no: item.part_list_no,
      art_pts_list_no: item.art_pts_list_no,
      pos: item.pos,
      qu: item.qu,
      drawg_docu_no: item.drawg_docu_no || undefined,
    };
  }

  static async fetchCatalogsAsProducts(params: FetchCatalogsParams = {}): Promise<{
    products: Product[];
    pagination: StrapiApiResponse['meta']['pagination'];
  }> {
    const response = await this.fetchCatalogs(params);
    const products = response.data.map(this.mapStrapiItemToProduct);
    
    return {
      products,
      pagination: response.meta.pagination,
    };
  }
}