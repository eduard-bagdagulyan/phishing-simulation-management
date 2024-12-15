import apiClient from './apiClient';
import { Attempt } from '../types';

export async function getAttempts(): Promise<Attempt[]> {
  const response = await apiClient.get('/attempts');
  return response.data;
}

export async function sendAttempt(email: string): Promise<Attempt> {
  const response = await apiClient.post('/attempts/send', { email });
  return response.data;
}
