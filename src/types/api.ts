export interface User {
  id: number;
  phone_number: string;
  first_name: string;
  last_name: string;
  email?: string;
  sector: string;
  role: 'Volunteer' | 'Leader';
  avatar_url?: string;
  skills: Skill[];
  badges: Badge[];
  created_at: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  sector: string;
  datetime: string;
  location: string;
  required_volunteers: number;
  image_url?: string;
  admin: number;
  admin_name: string;
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
  created_at: string;
  volunteer_count: number;
  is_user_registered: boolean;
  skills: Skill[];
}

export interface Skill {
  id: number;
  name: string;
  description?: string;
}

export interface Badge {
  id: number;
  name: string;
  description?: string;
  icon_url?: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  author: number;
  author_name: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
}

export interface Certificate {
  id: number;
  user: number;
  project: number;
  project_title: string;
  issued_date: string;
  certificate_url: string;
}

export interface Notification {
  id: number;
  user: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

export interface Attendance {
  id: number;
  user: number;
  project: number;
  check_in_time: string;
  check_out_time?: string;
  hours_worked?: number;
  qr_code: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
  message: string;
}

export interface OTPResponse {
  message: string;
  phone_number: string;
  otp?: string;
  verified?: boolean;
}

export interface DiscoveryResponse {
  nearby: Project[];
  trending: Project[];
  urgent: Project[];
  recent: Project[];
}

export interface SearchSuggestions {
  suggestions: {
    locations: string[];
    titles: string[];
    sectors: string[];
  };
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface APIError {
  detail?: string;
  [key: string]: string[] | string | undefined;
}

export interface RegisterRequest {
  phone_number: string;
}

export interface VerifyOTPRequest {
  phone_number: string;
  otp_code: string;
}

export interface CompleteRegistrationRequest {
  phone_number: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface CompleteLeaderRegistrationRequest {
  phone_number: string;
  password: string;
  first_name: string;
  last_name: string;
  sector: string;
  experience: string;
}

export interface LoginRequest {
  phone_number: string;
  password: string;
}

export interface CreateProjectRequest {
  title: string;
  description: string;
  sector: string;
  datetime: string;
  location: string;
  required_volunteers: number;
}

export interface DashboardStats {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  total_volunteers: number;
  user_projects_count: number;
  user_hours: number;
}

export interface ProjectRegistration {
  user: User;
  project: Project;
  registered_at: string;
}

export interface ProjectRegistrationsResponse {
  project: string;
  total_registered: number;
  registrations: ProjectRegistration[];
}

export interface QRCodeData {
  id: number;
  project: number;
  qr_code: string;
  qr_image_url: string;
  created_at: string;
  is_active: boolean;
}

export interface QRCodeResponse {
  message: string;
  qr_code: QRCodeData;
}

export interface QRCodeUsageStats {
  total_scans: number;
  unique_users: number;
  last_scan: string;
}

export interface LeaderDashboardStats {
  status: {
    total_projects: number;
    active_projects: number;
    completed_projects: number;
    cancelled_projects: number;
    total_volunteers: number;
    certificates_issued: number;
    upcoming_deadlines: number;
    attendance_rate: number;
  };
  recent_projects: Project[];
  upcoming_deadlines: Project[];
  recent_registrations: ProjectRegistration[];
  attendance_overview: {
    today_checkins: number;
    week_attendance: number;
    attendance_rate: number;
  };
}