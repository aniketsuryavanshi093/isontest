export interface User {
  _id: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

export interface Location {
  _id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

export interface CreatedBy {
  _id: string;
  name: string;
  email: string;
}
export interface Locations {
  _id: string | null | undefined;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
}
export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  location: Location;
  createdBy: CreatedBy;
  createdAt: string;
  updatedAt: string;
  __v: number;

  // Optional fields for compatibility
  time?: string;
  capacity?: number;
  registeredCount?: number;
  image?: string;
}

export interface Registrations {
  createdAt: string | number | Date;
  _id: string;
  user: User;
  event: Event;
  registeredAt: string;
  status: "registered" | "cancelled";
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface FormErrors {
  [key: string]: string | undefined;
}
