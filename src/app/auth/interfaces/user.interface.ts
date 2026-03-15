export interface UserResponse {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
  avatar: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export type SessionUser = Omit<UserResponse, 'password'>;
