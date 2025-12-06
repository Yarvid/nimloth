export interface IUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface IAuthResponse {
  authenticated: boolean;
  user?: IUser;
}

export interface ILoginResponse {
  success: boolean;
  user?: IUser;
  error?: string;
}
