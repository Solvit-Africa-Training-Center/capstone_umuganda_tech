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
  total_hours?: number;
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
  user_name?: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
  upvotes_count?: number;
  has_upvoted?: boolean;
  location?: string;
  description?: string;
  type?: 'feedback' | 'suggestion' | 'discussion';
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

