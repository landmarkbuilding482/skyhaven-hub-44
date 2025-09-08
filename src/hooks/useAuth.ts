import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Simple password verification function
const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  // For now, compare directly. In production, use proper bcrypt comparison
  return password === hash;
};

export type UserRole = 'superadmin' | 'admin' | 'tenant';

export interface AuthUser {
  id: string;
  username?: string;
  tenant_login_id?: string;
  role: UserRole;
  permissions?: {
    tables: string[];
    pages: string[];
  };
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (credentials: { username: string; password: string }, type: 'admin' | 'tenant') => Promise<{ error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthState = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('auth-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('auth-user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (
    credentials: { username: string; password: string }, 
    type: 'admin' | 'tenant'
  ): Promise<{ error?: string }> => {
    setLoading(true);
    
    try {
      if (type === 'admin') {
        // Admin login
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('username', credentials.username)
          .eq('is_active', true)
          .maybeSingle();

        if (error || !data) {
          setLoading(false);
          return { error: 'Invalid username or password' };
        }

        // Verify password against stored hash
        const isValidPassword = await verifyPassword(credentials.password, data.password_hash);
        if (!isValidPassword) {
          setLoading(false);
          return { error: 'Invalid username or password' };
        }

        const authUser: AuthUser = {
          id: data.id,
          username: data.username,
          role: data.role as UserRole,
          permissions: data.permissions as { tables: string[]; pages: string[] }
        };

        setUser(authUser);
        localStorage.setItem('auth-user', JSON.stringify(authUser));
        
      } else {
        // Tenant login
        const { data, error } = await supabase
          .from('tenant_credentials')
          .select(`
            *,
            tenants!tenant_credentials_tenant_id_fkey(
              id,
              name,
              tenant_id,
              floor,
              space_type,
              business_type
            )
          `)
          .eq('tenant_login_id', credentials.username)
          .eq('is_active', true)
          .single();

        if (error || !data) {
          setLoading(false);
          return { error: 'Invalid tenant ID or password' };
        }

        // Verify password against stored hash
        const isValidPassword = await verifyPassword(credentials.password, data.password_hash);
        if (!isValidPassword) {
          setLoading(false);
          return { error: 'Invalid tenant ID or password' };
        }

        const authUser: AuthUser = {
          id: data.tenant_id,
          tenant_login_id: data.tenant_login_id,
          role: 'tenant',
          permissions: { tables: ['tenant-specific'], pages: ['tenant-portal'] }
        };

        setUser(authUser);
        localStorage.setItem('auth-user', JSON.stringify(authUser));
      }

      setLoading(false);
      return {};
    } catch (error) {
      setLoading(false);
      return { error: 'Login failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth-user');
  };

  return {
    user,
    loading,
    login,
    logout
  };
};

export { AuthContext };