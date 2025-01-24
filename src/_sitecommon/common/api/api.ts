import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_URL } from '../constants/Config';

class ApiHelper {
  private static api: AxiosInstance | null = null;

  // Initialize Axios instance with interceptors if not already initialized
  private static initialize() {
    if (!this.api) {
      this.api = axios.create({
        baseURL: API_URL,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      this.initializeInterceptors();
    }
  }

  // Setup request and response interceptors
  private static initializeInterceptors() {
    if (!this.api) {
      throw new Error('Axios instance is not initialized. Call initialize() first.');
    }

    // Request Interceptor
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('busnPartnerId'); // Retrieve token from localStorage
        if (token) {
          config.headers.set('Authorization', `${token}`);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          window.location.href = '/auth/login'; // Redirect to login page
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic GET request
  public static async get<T>(url: string, params?: object): Promise<AxiosResponse<T>> {
    this.initialize(); // Ensure Axios instance is initialized
    return this.api!.get<T>(url, { params });
  }

  // Generic POST request
  public static async post<T>(url: string, data: object): Promise<AxiosResponse<T>> {
    this.initialize();
    return this.api!.post<T>(url, data);
  }

  // Generic PUT request
  public static async put<T>(url: string, data: object): Promise<AxiosResponse<T>> {
    this.initialize();
    return this.api!.put<T>(url, data);
  }

    // Generic PATCH request
    public static async patch<T>(url: string, data: object): Promise<AxiosResponse<T>> {
      this.initialize();
      return this.api!.patch<T>(url, data);
    }

  // Generic DELETE request
  public static async delete<T>(url: string): Promise<AxiosResponse<T>> {
    this.initialize();
    return this.api!.delete<T>(url);
  }
}

export default ApiHelper;