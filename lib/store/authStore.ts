import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Customer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  billing: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    postcode: string;
    country: string;
  };
}

interface AuthStore {
  customer: Customer | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateCustomer: (customer: Customer) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      customer: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
          }

          const data = await response.json();

          set({
            customer: data.customer,
            token: data.token,
            isAuthenticated: true,
          });
        } catch (error: any) {
          throw new Error(error.message || 'Login failed');
        }
      },

      register: async (userData: any) => {
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
          }

          const data = await response.json();

          set({
            customer: data.customer,
            token: data.token,
            isAuthenticated: true,
          });
        } catch (error: any) {
          throw new Error(error.message || 'Registration failed');
        }
      },

      logout: () => {
        set({
          customer: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateCustomer: (customer: Customer) => {
        set({ customer });
      },

      checkAuth: async () => {
        const { token } = get();

        if (!token) {
          set({ isAuthenticated: false, customer: null });
          return;
        }

        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Authentication failed');
          }

          const data = await response.json();
          set({
            customer: data.customer,
            isAuthenticated: true,
          });
        } catch (error) {
          set({
            customer: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      skipHydration: true,
    }
  )
);
