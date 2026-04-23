import api from "./axiosConfig";

// 1. Khớp hoàn toàn với class ReportDto trong C#
export interface ReportDto {
  id: number;
  reporterId: number;
  reportedUserId?: number; // Nullable int
  streamId?: number;       // Nullable int
  reason: string;
  status: string;          // "pending", "resolved", "rejected"
  createdAt: string;
}

// 2. Khớp hoàn toàn với class CreateReportDto trong C#
export interface CreateReportDto {
  reporterId: number;
  reportedUserId?: number;
  streamId?: number;
  reason: string;
}

// 3. Khớp hoàn toàn với class UpdateReportStatusDto trong C#
export interface UpdateReportStatusDto {
  status: string; // "resolved", "rejected"
}

const reportApi = {
  /**
   * Lấy danh sách tất cả báo cáo
   * GET /api/reports
   */
  getReports: () => 
    api.get<ReportDto[]>("/reports"),

  /**
   * Tạo báo cáo mới
   * POST /api/reports
   */
  create: (data: CreateReportDto) => 
    api.post<ReportDto>("/reports", data),

  /**
   * Cập nhật trạng thái báo cáo
   * PATCH /api/reports/{id}/status
   */
  updateStatus: (id: number, status: string) => 
    api.patch(`/reports/${id}/status`, { status } as UpdateReportStatusDto),
};

export default reportApi;