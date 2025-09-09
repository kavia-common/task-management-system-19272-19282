export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO string
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiError {
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface LoginResponse {
  token: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  dueDate?: string | null;
  completed?: boolean;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  dueDate?: string | null;
  completed?: boolean;
}
