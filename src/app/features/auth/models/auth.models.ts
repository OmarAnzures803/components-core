export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'employee' | 'admin';
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}
