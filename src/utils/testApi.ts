import { apiClient } from '../api/client';

export const testApiConnection = async () => {
  try {
    const response = await apiClient.get('/api/projects/api-overview/');
    console.log('✅ API Connection successful:', response.data.api_info);
    return true;
  } catch (error) {
    console.error('❌ API Connection failed:', error);
    return false;
  }
};