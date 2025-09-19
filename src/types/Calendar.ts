// src/types/Calendar.ts

export interface Reminder {
  id: string;
  title: string;
  date: Date;
  description?: string;
}

export interface Props {
  deadlines?: Date[];
}

// Example slice initial state
const initialState = {
  items: [],
  loading: false,
  error: null,
  // ...other fields
};
