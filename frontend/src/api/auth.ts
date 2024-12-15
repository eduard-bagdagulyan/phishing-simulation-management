import apiClient from './apiClient';

interface RegisterResponse {
  username: string;
  id: string;
}

interface LoginResponse {
  access_token: string;
}

export async function register(
  username: string,
  password: string,
): Promise<RegisterResponse> {
  const response = await apiClient.post('/auth/register', {
    username,
    password,
  });
  return response.data;
}

export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const response = await apiClient.post('/auth/login', { username, password });
  return response.data;
}
