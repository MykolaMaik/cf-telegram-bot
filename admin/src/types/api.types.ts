export interface IUser {
    telegramId?: number | null;
    username: string;
    firstName?: string;
    lastName?: string;
    isActive?: boolean;
    createdAt?: string;
  }
  
  export interface CreateUserData {
    username: string;
    firstName?: string;
    lastName?: string;
  }
  
  export interface APIResponse<T = unknown> {
    success: boolean;
    message?: string;
    error?: string;
    data?: T;
    count?: number;
    user?: IUser;
    users?: IUser[];
  }