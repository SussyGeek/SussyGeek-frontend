import { BackendClient } from '@/types/backend';
import { GfgApiClient } from '@/types/geeksforgeeks';
import axios, { AxiosInstance } from 'axios';

// Ensure the environment variable is loaded.
export const API_URL = import.meta.env.VITE_PUBLIC_BACKEND_URL;
const GFG_API_URL = 'https://practiceapi.geeksforgeeks.org/api/v1/';

class Clients {
  Backend_: AxiosInstance;
  Geeksforgeeks_: AxiosInstance;
  Geeksforgeeks: GfgApiClient;
  Backend: BackendClient;
  constructor() {
    this.Backend_ = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.Geeksforgeeks_ = axios.create({
      baseURL: GFG_API_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.Geeksforgeeks = this.Geeksforgeeks_;
    this.Backend = this.Backend_;
  }

  invokeInterceptors() {
    this.Backend_.interceptors.request.use(
      (config) => {
        const sessionId = localStorage.getItem('sessionId');
        if (sessionId) {
          config.headers['Authorization'] = `Bearer ${sessionId}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.Backend_.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        console.error('[API Error]:', error.response?.data?.message || error.message);
        return Promise.reject(error);
      }
    );

    this.Geeksforgeeks_.interceptors.response.use(
      (res) => res.data
    )
  }
};

export const apiClients = new Clients();
apiClients.invokeInterceptors();