import axios from "axios";
import type { Event, Locations } from "../types";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  role?: "user" | "admin";
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "user" | "admin";
  };
}

export const authAPI = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/register", userData);
    return response.data;
  },
};

export interface EventFilters {
  date?: string;
  category?: string;
  location?: string;
  page?: number;
  limit?: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalEvents: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface EventsResponse {
  events: Event[];
  pagination: PaginationInfo;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  registration?: {
    id: string;
    eventId: string;
    userId: string;
    registeredAt: string;
    status: string;
  };
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  category: string;
  capacity: number;
  locationId: string;
  createdBy?: string;
}

export const eventsAPI = {
  getEvents: async (filters?: EventFilters): Promise<EventsResponse> => {
    const params = new URLSearchParams();

    if (filters?.date) {
      params.append("date", filters.date);
    }
    if (filters?.category) {
      params.append("category", filters.category);
    }
    if (filters?.location) {
      params.append("location", filters.location);
    }
    if (filters?.page) {
      params.append("page", filters.page.toString());
    }
    if (filters?.limit) {
      params.append("limit", filters.limit.toString());
    }

    const queryString = params.toString();
    const url = queryString ? `/events?${queryString}` : "/events";

    const response = await api.get<EventsResponse>(url);
    return response.data;
  },

  getEventById: async (id: string): Promise<Event> => {
    const response = await api.get<Event>(`/events/${id}`);
    return response.data;
  },

  getAllRegisterations: async (): Promise<Event> => {
    const response = await api.post<Event>(`/register/getall`);
    return response.data;
  },

  registerForEvent: async (eventId: string): Promise<RegistrationResponse> => {
    const response = await api.post<RegistrationResponse>(
      `/register/${eventId}`
    );
    return response.data;
  },

  checIsRegistered: async (eventId: string): Promise<boolean> => {
    const response = await api.get<boolean>(`/register/${eventId}`);
    return response.data;
  },

  deleteEvent: async (
    eventId: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/events/${eventId}`
    );
    return response.data;
  },
  cancelregisterForEvent: async (
    eventId: string
  ): Promise<RegistrationResponse> => {
    const response = await api.post<RegistrationResponse>(
      `/register/${eventId}/cancel`
    );
    return response.data;
  },
  createEvent: async (eventData: CreateEventData): Promise<Event> => {
    const response = await api.post<Event>("/events", eventData);
    return response.data;
  },
  createLocations: async (eventData: Locations): Promise<Locations> => {
    const response = await api.post<Locations>("/locations", eventData);
    return response.data;
  },
  getLocations: async (): Promise<Locations[]> => {
    const response = await api.get<Locations[]>("/locations");
    return response.data;
  },
  updateEvent: async ({
    eventId,
    eventData,
  }: {
    eventId: string;
    eventData: CreateEventData;
  }): Promise<Event> => {
    const response = await api.put<Event>(`/events/${eventId}`, eventData);
    return response.data;
  },
};

export default api;
