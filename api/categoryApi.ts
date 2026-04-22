import api from "./axiosConfig";

// Định nghĩa Interface dựa trên DTO của Backend
export interface CategoryDto {
  id: number;
  name: string;
  description?: string;
  thumbnail?: string; // Thêm nếu backend có trả về ảnh
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  thumbnail?: string;
}

const categoryApi = {
  /**
   * Lấy danh sách tất cả category
   * GET /api/categories
   */
  getAllCategories: () => 
    api.get<CategoryDto[]>("/categories"),

  /**
   * Lấy chi tiết 1 category
   * GET /api/categories/:id
   */
  getCategoryById: (id: number) => 
    api.get<CategoryDto>(`/categories/${id}`),

  /**
   * Tạo category mới
   * POST /api/categories
   */
  createCategory: (data: CreateCategoryDto) => 
    api.post<CategoryDto>("/categories", data),

  /**
   * Cập nhật category
   * PUT /api/categories/:id
   */
  updateCategory: (id: number, data: CreateCategoryDto) => 
    api.put<{ message: string }>(`/categories/${id}`, data),

  /**
   * Xóa category
   * DELETE /api/categories/:id
   */
  deleteCategory: (id: number) => 
    api.delete<{ message: string }>(`/categories/${id}`),
};

export default categoryApi;