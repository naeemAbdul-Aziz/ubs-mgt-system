import axios, { AxiosInstance } from 'axios';
import {
  TokenResponse,
  DashboardStatsDto,
  PageResponse,
  Student,
  CreateStudentRequest,
  Staff,
  CreateStaffRequest,
  AcademicYear,
  Term,
  SchoolClass,
  SubmitRegisterRequest,
  AttendanceSummaryDto,
  BulkScoreEntryRequest,
  ReportCard,
  Invoice,
  Payment,
  PaymentRequest,
  BillingRunRequest,
  ProgressionRun,
  ProgressionRunRequest,
  Announcement,
  CreateAnnouncementRequest,
  StudentScoreEntry,
  StudentProgressionDecision
} from '@ubs-lmis/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor to handle token expiry / refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const res = await axios.post<TokenResponse>(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          const { accessToken } = res.data;
          localStorage.setItem('accessToken', accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (err) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// ─── API MODULE DEFINITIONS (PURE REAL-TIME BACKEND) ─────────────────────────

export const AuthAPI = {
  login: async (username: string, password: string): Promise<TokenResponse> => {
    const res = await apiClient.post<TokenResponse>('/auth/login', { username, password });
    localStorage.setItem('accessToken', res.data.accessToken);
    localStorage.setItem('refreshToken', res.data.refreshToken);
    return res.data;
  },
  me: async (): Promise<{ personId: string; username: string; personType: string; permissions: string[] }> => {
    const res = await apiClient.get<{ personId: string; username: string; personType: string; permissions: string[] }>('/auth/me');
    return res.data;
  },
  logout: async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await apiClient.post('/auth/logout', { refreshToken });
      } catch (e) {
        console.warn('Logout API failed silently', e);
      }
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};

export const AnalyticsAPI = {
  getDashboardStats: async (): Promise<DashboardStatsDto> => {
    const res = await apiClient.get<DashboardStatsDto>('/analytics/dashboard');
    return res.data;
  },
  getRecentActivity: async (): Promise<any[]> => {
    const res = await apiClient.get<any[]>('/analytics/recent-activity');
    return res.data;
  },
};

export const StudentsAPI = {
  getStudents: async (query = '', grade = '', status = '', page = 0, size = 10): Promise<PageResponse<Student>> => {
    let url = `/students?query=${query}&page=${page}&size=${size}`;
    if (grade) url += `&grade=${encodeURIComponent(grade)}`;
    if (status) url += `&status=${encodeURIComponent(status)}`;
    const res = await apiClient.get<PageResponse<Student>>(url);
    return res.data;
  },
    createStudent: async (data: CreateStudentRequest): Promise<Student> => {
      const res = await apiClient.post<Student>('/students', data);
      return res.data;
    },
    getStudentLookups: async (): Promise<{ id: string, firstName: string, lastName: string, currentClassName: string, studentNumber: string }[]> => {
      const res = await apiClient.get<any[]>('/students/lookup');
      return res.data;
    },
};

export const StaffAPI = {
  getStaff: async (query = '', page = 0, size = 10): Promise<PageResponse<Staff>> => {
    const res = await apiClient.get<PageResponse<Staff>>(`/staff?query=${query}&page=${page}&size=${size}`);
    return res.data;
  },
  createStaff: async (data: CreateStaffRequest): Promise<Staff> => {
    const res = await apiClient.post<Staff>('/staff', data);
    return res.data;
  },
};

export const AcademicsAPI = {
  getAcademicYears: async (): Promise<AcademicYear[]> => {
    const res = await apiClient.get<AcademicYear[]>('/academic-years');
    return res.data;
  },
  getTerms: async (yearId: string): Promise<Term[]> => {
    const res = await apiClient.get<Term[]>(`/academic-years/${yearId}/terms`);
    return res.data;
  },
  getClasses: async (yearId: string): Promise<SchoolClass[]> => {
    const res = await apiClient.get<SchoolClass[]>(`/academic-years/${yearId}/classes`);
    return res.data;
  },
  assignClassTeacher: async (yearId: string, classId: string, teacherId: string): Promise<void> => {
    await apiClient.put(`/academic-years/${yearId}/classes/${classId}/teacher/${teacherId}`);
  },
  assignSubjectTeacher: async (yearId: string, classId: string, subjectId: string, teacherId: string): Promise<void> => {
    await apiClient.put(`/academic-years/${yearId}/classes/${classId}/subjects/${subjectId}/teacher/${teacherId}`);
  },
  /** Student-scoped: returns the subjects for the caller's current enrollment */
  getMySubjects: async (): Promise<SchoolClass[]> => {
    const res = await apiClient.get<SchoolClass[]>('/academic-years/current/my-subjects');
    return res.data;
  },
  getSubjectCatalog: async (): Promise<import('@ubs-lmis/types').SubjectCatalogItem[]> => {
    // Mocked for frontend usage
    return [];
  },
  getFacultyAllocations: async (): Promise<import('@ubs-lmis/types').FacultyAllocationItem[]> => {
    // Mocked for frontend usage
    return [];
  },
};

export const AttendanceAPI = {
  submitRegister: async (data: SubmitRegisterRequest): Promise<void> => {
    await apiClient.post('/attendance/registers', data);
  },
  getSummaryForEnrollment: async (enrollmentId: string): Promise<AttendanceSummaryDto> => {
    const res = await apiClient.get<AttendanceSummaryDto>(`/attendance/summaries?enrollmentId=${enrollmentId}`);
    return res.data;
  },
  /** Student-scoped: resolves enrollment from JWT, returns caller's own attendance summary */
  getMyAttendanceSummary: async (): Promise<AttendanceSummaryDto> => {
    const res = await apiClient.get<AttendanceSummaryDto>('/attendance/summaries/me');
    return res.data;
  },
};

export const AssessmentAPI = {
  bulkEnterScores: async (data: BulkScoreEntryRequest): Promise<void> => {
    await apiClient.post('/assessment/scores/bulk', data);
  },
  getClassScores: async (classId: string, subjectId: string, termId: string): Promise<StudentScoreEntry[]> => {
    const res = await apiClient.get<StudentScoreEntry[]>(`/assessment/scores?classId=${classId}&subjectId=${subjectId}&termId=${termId}`);
    return res.data;
  },
  getReportCard: async (studentId: string, termId?: string): Promise<ReportCard> => {
    const res = await apiClient.get<ReportCard>(`/assessment/report-card?studentId=${studentId}${termId ? `&termId=${termId}` : ''}`);
    return res.data;
  },
  getAssessmentGridStudents: async (): Promise<import('@ubs-lmis/types').AssessmentGridStudent[]> => {
    const res = await apiClient.get<import('@ubs-lmis/types').AssessmentGridStudent[]>('/assessment/scores');
    return res.data;
  },
};

export const FinanceAPI = {
  getInvoices: async (): Promise<Invoice[]> => {
    const res = await apiClient.get<Invoice[]>('/finance/invoices');
    return res.data;
  },
  /** Student-scoped: returns only the authenticated student's own invoices */
  getMyInvoices: async (): Promise<Invoice[]> => {
    const res = await apiClient.get<Invoice[]>('/finance/my-invoices');
    return res.data;
  },
  recordPayment: async (data: PaymentRequest): Promise<Payment> => {
    const res = await apiClient.post<Payment>('/finance/payments', data);
    return res.data;
  },
  executeBillingRun: async (data: BillingRunRequest): Promise<{ invoicesGenerated: number }> => {
    const res = await apiClient.post<{ invoicesGenerated: number }>('/finance/billing-run', data);
    return res.data;
  },
  getTransactions: async (): Promise<import('@ubs-lmis/types').FinanceTransaction[]> => {
    const res = await apiClient.get<import('@ubs-lmis/types').FinanceTransaction[]>('/finance/transactions');
    return res.data;
  },
};

export const ProgressionAPI = {
  getRuns: async (): Promise<ProgressionRun[]> => {
    const res = await apiClient.get<ProgressionRun[]>('/progression/runs');
    return res.data;
  },
  executeRun: async (data: ProgressionRunRequest): Promise<ProgressionRun> => {
    const res = await apiClient.post<ProgressionRun>('/progression/runs', data);
    return res.data;
  },
  getStudentDecisions: async (): Promise<StudentProgressionDecision[]> => {
    const res = await apiClient.get<StudentProgressionDecision[]>('/progression/decisions');
    return res.data;
  },
};

export const CommunicationAPI = {
  getAnnouncements: async (): Promise<Announcement[]> => {
    const res = await apiClient.get<Announcement[]>('/communication/announcements');
    return res.data;
  },
  sendAnnouncement: async (data: CreateAnnouncementRequest): Promise<Announcement> => {
    const res = await apiClient.post<Announcement>('/communication/announcements', data);
    return res.data;
  },
  getOutboxLogs: async (): Promise<import('@ubs-lmis/types').OutboxLogItem[]> => {
    const res = await apiClient.get<import('@ubs-lmis/types').OutboxLogItem[]>('/communication/outbox-logs');
    return res.data;
  },
  getArchivedFeeds: async (): Promise<import('@ubs-lmis/types').ArchivedFeedItem[]> => {
    const res = await apiClient.get<import('@ubs-lmis/types').ArchivedFeedItem[]>('/communication/archived-feeds');
    return res.data;
  },
};

export const PayrollAPI = {
  getSalaryStructures: async (): Promise<import('@ubs-lmis/types').SalaryStructure[]> => {
    const res = await apiClient.get<import('@ubs-lmis/types').SalaryStructure[]>('/finance/payroll/structures');
    return res.data;
  },
  setSalaryStructure: async (data: { staffId: string; baseSalary: number; taxPercentage: number; allowances: number }): Promise<import('@ubs-lmis/types').SalaryStructure> => {
    const res = await apiClient.post<import('@ubs-lmis/types').SalaryStructure>('/finance/payroll/structures', data);
    return res.data;
  },
  getPayrollRuns: async (): Promise<import('@ubs-lmis/types').PayrollRun[]> => {
    const res = await apiClient.get<import('@ubs-lmis/types').PayrollRun[]>('/finance/payroll/runs');
    return res.data;
  },
  executePayrollRun: async (data: { month: number; year: number }): Promise<import('@ubs-lmis/types').PayrollRun> => {
    const res = await apiClient.post<import('@ubs-lmis/types').PayrollRun>('/finance/payroll/runs', data);
    return res.data;
  },
  getPayslips: async (runId: string): Promise<import('@ubs-lmis/types').Payslip[]> => {
    const res = await apiClient.get<import('@ubs-lmis/types').Payslip[]>(`/finance/payroll/runs/${runId}/payslips`);
    return res.data;
  },
};
