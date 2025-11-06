import axios, { AxiosResponse } from 'axios';
import { APIResponse, IUser, CreateUserData } from './types/api.types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getUsers = (): Promise<AxiosResponse<APIResponse<IUser[]>>> => 
  api.get<APIResponse<IUser[]>>('/api/users');

export const addUser = (userData: CreateUserData): Promise<AxiosResponse<APIResponse<IUser>>> => 
  api.post<APIResponse<IUser>>('/api/users', userData);

export const deleteUser = (identifier: number | string): Promise<AxiosResponse<APIResponse<IUser>>> => 
  api.delete<APIResponse<IUser>>(`/api/users/${identifier}`);

export default api;