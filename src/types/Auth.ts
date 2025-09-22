// Auth error response type for use in SignUp and SignIn components
export interface AuthErrorResponse {
  phone_number?: string[];
  password?: string[];
  non_field_errors?: string[];
  detail?: string;
  [key: string]: any;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  upvotes_count: number;
  has_upvoted: boolean;
  location: string;
  description: string;
  type: 'feedback' | 'suggestion' | 'discussion';
  user_name: string;
  sector?: string;
  datetime?: string;
  created_at?: string;
  comments_count?: number;
  user_id?: number;
  author_phone?: string;
  user_phone?: string;
}