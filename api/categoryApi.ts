import api from "./axiosConfig";

export interface CategoryDto {
  id: number;
  name: string;
  description?: string;
  slug?: string;
  coverImageUrl?: string;
  bannerImageUrl?: string;
  genres?: string;    // Dạng: "FPS, Action"
  steamTags?: string;
  isFreeToPlay: boolean;
  currentViewers: number;
  activeStreamsCount: number;
  price?: number;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  coverImageUrl?: string;
  genres?: string;
  isFreeToPlay: boolean;
  steamAppId?: number;
}

export interface SteamSearchResult {
  appId: number;
  name: string;
  price: number;
  isFree: boolean;
  steamUrl: string;
}

const categoryApi = {
  /** Lấy tất cả danh mục (hiện trang chủ) */
  getAllCategories: () => 
    api.get<CategoryDto[]>("/categories"),

  /** Lấy chi tiết 1 danh mục */
  getById: (id: number) => 
    api.get<CategoryDto>(`/categories/${id}`),

  /** Lấy danh sách các thể loại duy nhất (để làm filter/chọn) */
  getGenresList: () => 
    api.get<string[]>("/categories/genres"),

  /** Admin: Tìm kiếm game trên Steam để sync */
  searchSteam: (query: string) => 
    api.get<SteamSearchResult[]>("/categories/search-steam", { params: { q: query } }),

  /** Admin: Đồng bộ game từ Steam về DB */
  syncFromSteam: (appId: number) => 
    api.post<CategoryDto>(`/categories/sync-steam/${appId}`),

  /** Admin: Tạo danh mục thủ công */
  create: (data: CreateCategoryRequest) => 
    api.post<CategoryDto>("/categories", data),

  /** Admin: Xóa danh mục */
  delete: (id: number) => 
    api.delete(`/categories/${id}`),

  /** Cập nhật thống kê (viewers) cho danh mục */
  updateStats: (id: number) => 
    api.post(`/categories/${id}/update-stats`),
};

export default categoryApi;