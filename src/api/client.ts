import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  console.log('🔑 API Request:', {
    url: config.url,
    method: config.method?.toUpperCase(),
    hasToken: !!token,
    tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token',
    headers: {
      'Content-Type': config.headers['Content-Type'],
      'Authorization': token ? 'Bearer [TOKEN]' : 'Missing'
    }
  });
  
  // Ensure Content-Type is set for POST/PUT requests (except FormData)
  if (['post', 'put', 'patch'].includes(config.method?.toLowerCase() || '')) {
    // Don't override Content-Type if it's FormData (let browser set boundary)
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    } else {
      // For FormData, explicitly remove Content-Type to let browser set it
      delete config.headers['Content-Type'];
      console.log('📎 FormData detected - letting browser set Content-Type with boundary');
    }
  }
  
  // Always set Authorization header if token exists
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.warn('⚠️ No JWT token found in localStorage!');
    // Don't proceed with authenticated requests without token
    if (config.url?.includes('/api/') && !config.url?.includes('/auth/')) {
      return Promise.reject(new Error('Authentication required'));
    }
  }
  
  return config;
});

// Handle token refresh and errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
            refresh: refreshToken
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          originalRequest.headers.Authorization = `Bearer ${access}`;
          
          return apiClient(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/signin';
        }
      } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/signin';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;