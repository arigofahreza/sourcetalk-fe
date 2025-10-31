// Strapi API Response Types
export interface StrapiCatalogItem {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  filename: string;
  page: number;
  date: string;
  time: string;
  codename: string;
  drawg1: string | null;
  part_list_no: string;
  pos: number;
  art_pts_list_no: string;
  title: string;
  v: string | null;
  qty: number;
  qu: string;
  pt: string;
  bg: string | null;
  standard_supplier: string | null;
  material_no: string | null;
  weight: number;
  drawg_docu_no: string | null;
  r: string | null;
  do: string | null;
  designation: string | null;
}

export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiApiResponse {
  data: StrapiCatalogItem[];
  meta: {
    pagination: StrapiPagination;
  };
}

export interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  brand: string;
  color: string;
  inStock: boolean;
  isSpecial?: boolean;
  discount?: number;
  isLiked?: boolean;
  date: string; // ISO date string
  qty: number; // quantity/stock
  weight: number; // weight in kg
  codename: string; // product codename
  filename: string;
  part_list_no: string;
  art_pts_list_no: string;
  pos: number;
  qu: string; // quantity unit
  drawg_docu_no?: string;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface QuantityRange {
  min: number;
  max: number;
}

export interface WeightRange {
  min: number;
  max: number;
}

export interface CodenameFilter {
  id: string;
  name: string;
  checked: boolean;
}

export interface FilterState {
  dateRange: DateRange;
  quantityRange: QuantityRange;
  weightRange: WeightRange;
  codenames: CodenameFilter[];
}

export type ViewMode = 'grid' | 'list';
export type SortOption = 'popular' | 'price-low' | 'price-high' | 'name' | 'date-new' | 'date-old';

export interface CatalogState {
  products: Product[];
  filteredProducts: Product[];
  filters: FilterState;
  viewMode: ViewMode;
  sortBy: SortOption;
  pagination: StrapiPagination;
  loading: boolean;
  error: string | null;
}