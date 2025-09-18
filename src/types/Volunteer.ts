export interface VolunteerProfile {
  id: number;
  name: string;
  avatar_url?: string;
  email: string;
  projectsCompleted: number;
  hoursContributed: number;
  totalProjects: number;
  activeProjects: number;
  joinDate?: string;
  location?: string;
  skills?: string[];
}

export interface Project {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  sector: string;
  datetime: string;
  location: string;
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
  required_volunteers: number;
  volunteer_count: number;
  admin: number;
  admin_name: string;
  created_at: string;
  is_user_registered: boolean;
  skills: any[];
}

export interface FilterState {
  search?: string;
  status?: Project['status'] | '';
  location?: string;
  tab: 'all' | 'my-projects' | 'ongoing' | 'completed';
}

export interface SortState {
  sortBy: 'datetime' | 'title' | 'volunteer_count' | 'created_at' | 'required_volunteers';
  order: 'asc' | 'desc';
}

export interface PaginationState {
  page: number;
  pageSize: number;
  hasMore: boolean;
  total: number;
  totalPages: number;
}