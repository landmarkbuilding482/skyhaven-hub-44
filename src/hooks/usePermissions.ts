import { useAuth } from './useAuth';

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPagePermission = (page: string): boolean => {
    if (!user) return false;
    if (user.role === 'superadmin') return true;
    return user.permissions?.pages?.includes(page) || false;
  };

  const hasTablePermission = (table: string): boolean => {
    if (!user) return false;
    if (user.role === 'superadmin') return true;
    return user.permissions?.tables?.includes(table) || false;
  };

  const hasRole = (role: string | string[]): boolean => {
    if (!user) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role);
  };

  return {
    hasPagePermission,
    hasTablePermission,
    hasRole,
    user
  };
};