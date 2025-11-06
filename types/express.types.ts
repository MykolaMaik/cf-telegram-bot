import { Request } from 'express';
import { IUserDocument } from './user.types';

export interface CreateUserRequest extends Request {
  body: {
    username: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface APIResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
  count?: number;
  user?: IUserDocument;
  users?: IUserDocument[];
}