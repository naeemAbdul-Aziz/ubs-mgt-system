// Comprehensive Domain & API Types for School Management System

export type Gender = 'MALE' | 'FEMALE';
export type StaffType = 'TEACHING' | 'NON_TEACHING' | 'ADMINISTRATIVE';
export type EnrollmentStatus = 'ACTIVE' | 'TRANSFERRED' | 'WITHDRAWN' | 'COMPLETED';
export type StudentStatus = 'APPLICANT' | 'ACTIVE' | 'TRANSFERRED_OUT' | 'WITHDRAWN' | 'GRADUATED' | 'DECEASED' | 'SUSPENDED';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
export type InvoiceStatus = 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED';
export type PaymentMethod = 'CASH' | 'MOBILE_MONEY' | 'BANK_TRANSFER' | 'CHEQUE';
export type ProgressionDecisionType = 'PROMOTE' | 'REPEAT' | 'GRADUATE' | 'RETAIN';
export type DeliveryStatus = 'PENDING' | 'DELIVERED' | 'FAILED';
export type CommunicationChannel = 'SMS' | 'EMAIL' | 'SYSTEM';

// Pagination Envelope (RFC 7807 compatible backend structure)
export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// 1. Auth Types
export interface UserAccount {
  id: string;
  username: string;
  email: string;
  role: string;
  permissions: string[];
  personId?: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresInSeconds: number;
}

// 2. People & Registry Types
export interface Student {
  id: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  otherNames?: string;
  dateOfBirth: string;
  gender: Gender;
  admissionDate: string;
  status: StudentStatus;
  currentClassName?: string;
  guardianName?: string;
  guardianPhone?: string;
}

export interface CreateStudentRequest {
  studentNumber: string;
  firstName: string;
  lastName: string;
  otherNames?: string;
  dateOfBirth: string;
  gender: Gender;
  admissionDate: string;
  guardianId?: string;
}

export interface Staff {
  id: string;
  staffNumber: string;
  firstName: string;
  lastName: string;
  otherNames?: string;
  staffType: StaffType;
  gesRegistrationNo?: string;
  employmentStart: string;
  email?: string;
  phone?: string;
  subjectsTaught?: string[];
}

export interface CreateStaffRequest {
  staffNumber: string;
  firstName: string;
  lastName: string;
  otherNames?: string;
  staffType: StaffType;
  gesRegistrationNo?: string;
  employmentStart: string;
  email?: string;
  phone?: string;
}

export interface Guardian {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  occupation?: string;
  relationship: string;
  wardIds?: string[];
}

// 3. Academic Setup Types
export interface AcademicYear {
  id: string;
  name: string;        // e.g. "2025/2026" — backend field is `name`, not `yearName`
  startDate: string;
  endDate: string;
  status: 'PLANNED' | 'ACTIVE' | 'CLOSED'; // backend enum, replaces isActive/isClosed
}

export interface Term {
  id: string;
  academicYearId: string;
  termNumber: number;  // 1, 2, or 3 — backend sends termNumber, not termName
  startDate: string;
  endDate: string;
}

export interface SchoolClass {
  id: string;
  academicYearId: string;
  classLevelId: string; // UUID of the ClassLevel reference entity
  className: string;    // e.g. "Basic 5 A" (derived: level.name + stream)
  stream: string;       // e.g. "A", "B", "Gold"
  capacity: number;
  enrolledCount: number;
  classTeacherName?: string;
}

export interface SubjectCatalogItem {
  id: string;
  subjectName: string;
  code: string;
  category: 'Core' | 'Elective';
  credits: number;
}

export interface FacultyAllocationItem {
  id: string;
  teacherName: string;
  title: string;
  scope: string; // e.g. JHS 3 • Core Mathematics
  avatarUrl: string;
}

// 4. Attendance Types
export interface AttendanceRecord {
  studentId: string;
  studentName: string;
  studentNumber: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface SubmitRegisterRequest {
  classId: string;
  attendanceDate: string;
  records: {
    studentId?: string;
    enrollmentId?: string;
    status: AttendanceStatus;
    remarks?: string;
    correctionReason?: string;
  }[];
}

export interface AttendanceSummaryDto {
  enrollmentId: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  attendancePercentage: number;
}

// 5. Assessment & Scores Types
export interface AssessmentComponent {
  id: string;
  name: string; // e.g. Classwork, Mid-Term, End of Term Exam
  weightage: number; // e.g. 30%, 70%
  maxScore: number;
}

export interface StudentScoreEntry {
  studentId: string;
  studentName: string;
  studentNumber: string;
  classworkScore?: number;
  midTermScore?: number;
  examScore?: number;
  totalScore?: number;
  grade?: string;
  remarks?: string;
}

export interface BulkScoreEntryRequest {
  assessmentComponentId: string;
  scores: {
    enrollmentId: string;
    rawScore: number;
    isExempt: boolean;
    isNa: boolean;
  }[];
}

export interface AssessmentGridStudent {
  id: string;
  studentNumber: string;
  name: string;
  cw: number;
  mt: number;
  exam: number;
}

export interface ReportCard {
  studentId: string;
  studentName: string;
  studentNumber: string;
  className: string;
  academicYear: string;
  termName: string;
  positionInClass: number;
  totalStudentsInClass: number;
  attendancePercentage: number;
  dateOfBirth?: string;
  house?: string;
  attendanceDays?: string;
  overallAverage?: number;
  gradeAverage?: string;
  classTeacherRemark: string;
  headteacherRemark: string;
  teacherSignatureUrl?: string;
  headmasterSignatureUrl?: string;
  subjectResults: {
    subjectName: string;
    classworkScore: number;
    examScore: number;
    totalScore: number;
    grade: string;
    remark: string;
  }[];
}

// 6. Finance Types
export interface FeeSchedule {
  id: string;
  className: string;
  termName: string;
  feeType: string;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  className: string;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  dueDate: string;
  status: InvoiceStatus;
}

export interface Payment {
  id: string;
  receiptNumber: string;
  studentId: string;
  studentName: string;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  allocatedInvoiceId?: string;
}

export interface FinanceTransaction {
  id: string;
  studentName: string;
  studentCode: string;
  className: string;
  referenceId: string;
  paymentMethod: 'MoMo' | 'Bank' | 'Cash';
  creditAmount: number;
  allocationStatus: 'ALLOCATED' | 'PARTIALLY' | 'PENDING';
  transactionDate: string;
}

export interface PaymentRequest {
  studentId: string;
  amountPaid: number;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
}

export interface BillingRunRequest {
  academicYearId: string;
  termId: string;
  classId?: string;
}

// 7. Progression Types
export interface ProgressionRun {
  id: string;
  sourceAcademicYearId: string;
  sourceAcademicYearName: string;
  targetAcademicYearId: string;
  targetAcademicYearName: string;
  executedAt: string;
  totalStudentsProcessed: number;
  promotedCount: number;
  repeatedCount: number;
  graduatedCount: number;
}

export interface StudentProgressionDecision {
  studentId: string;
  studentName: string;
  studentNumber: string;
  currentClassName: string;
  targetClassName: string;
  averageScore: number;
  attendanceRate: number;
  recommendedDecision: ProgressionDecisionType;
  finalDecision: ProgressionDecisionType;
  overrideReason?: string;
}

export interface ProgressionRunRequest {
  sourceAcademicYearId: string;
  targetAcademicYearId: string;
  minAverageScoreThreshold?: number;
  minAttendanceThreshold?: number;
  promotionPassMark?: number;
  minimumAttendancePercentage?: number;
}

// 8. Communication & Announcements Types
export interface Announcement {
  id: string;
  title: string;
  message: string;
  channel: CommunicationChannel;
  targetAudience: string; // e.g. All Parents, Basic 5, All Teachers
  sentAt: string;
  totalRecipients: number;
  deliveredCount: number;
  failedCount: number;
  status: DeliveryStatus;
}

export interface OutboxLogItem {
  id: string;
  subject: string;
  channels: string; // e.g. Email • SMS
  audience: string; // e.g. Guardians (420)
  timestamp: string; // e.g. Oct 24, 09:15 AM
  status: 'SENT' | 'PENDING' | 'FAILED';
}

export interface ArchivedFeedItem {
  id: string;
  title: string;
  summary: string;
  timeAgo: string;
  iconType: 'calendar' | 'payment' | 'info';
}

export interface CreateAnnouncementRequest {
  title: string;
  message: string;
  channel: CommunicationChannel;
  targetAudience: string;
}

// 9. Analytics Types
export interface DashboardStatsDto {
  totalStudents: number;
  totalTeachers: number;
  totalRevenue: number;
  totalOutstandingFees: number;
  attendanceRateToday?: number;
  activeAcademicYear?: string;
  activeTerm?: string;
}

// 10. Payroll & HR Types
export interface SalaryStructure {
  id: string;
  staffId?: string;
  staffName?: string;  // "FirstName LastName" from backend join
  baseSalary: number;
  allowances: Record<string, number> | number; // number when returned as flat total
  deductions: Record<string, number> | number; // number when returned as flat total
  taxRate?: number;   // percentage, e.g. 12.5
  updatedAt?: string; // ISO date
}

export interface PayrollRun {
  id: string;
  runDate: string;      // ISO date — when run was executed
  periodStart: string;  // ISO date — pay period start
  periodEnd: string;    // ISO date — pay period end
  status: 'DRAFT' | 'APPROVED' | 'PAID';
  totalGrossPay: number;
  totalNetPay: number;
  staffCount?: number;  // number of payslips generated
}

export interface Payslip {
  id: string;
  payrollRunId: string;
  staffId: string;
  staffName: string;
  baseSalary: number;
  totalAllowances: number;
  totalDeductions: number;
  netPay: number;
  status: 'GENERATED' | 'SENT';
}
