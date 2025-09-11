// types/index.ts

export interface Activity {
  description: string;
  timestamp: string;
}

export interface StatCard {
  label: string;
  value: number | string;
  status?: 'good' | 'warning' | 'critical';
}

export interface Deadline {
  description: string;
  when: string;
}

export interface Task {
  id: number;
  title: string;
  dueDate: string;
}