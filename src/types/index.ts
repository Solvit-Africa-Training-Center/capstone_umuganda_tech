export interface User {
  id: number;
  phone_number: string;
  first_name: string;
  last_name: string;
  email?: string;
  sector?: string;
  role: "volunteer" | "leader" | "admin";
  avatar_url?: string;
  skills: string[];
  badges: string[];
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
  status: "planned" | "ongoing" | "completed" | "cancelled";
  created_at: string;
  volunteer_count: number;
  is_user_registered: boolean;
  skills: string[];
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
  message: string;
}
