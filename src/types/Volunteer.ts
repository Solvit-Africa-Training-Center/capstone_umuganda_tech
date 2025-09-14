// src/types/Volunteer.ts

export interface VolunteerProfile {
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  sector: string;
  profilePhotoUrl?: string;
}

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  title: string;
  content: string;
  date: string;  // or Date if you convert
}

export interface ProjectCard {
  id: number;
  title: string;
  imageUrl: string;
  date: string;
  status: "Upcoming" | "Completed" | "Ongoing" | string;
}

// src/types/Volunteer.ts

export interface Volunteer {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  organization?: string;
  sector?: string;
  profilePhotoUrl?: string;
}

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface EventItem {
  id: string;
  title: string;
  image: string;
  date: string;
  participants: number;
  status: "Active" | "Completed" | "Upcoming" | string;
}

export interface CommunityPost {
   id:string
  author: string;
  title: string;
  content: string;
  date: string;
}
