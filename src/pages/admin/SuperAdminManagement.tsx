import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Trash2, Users, Key } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PasswordChangeDialog } from '@/components/password-management/PasswordChangeDialog';

interface AdminUser {
  id: string;
  username: string;
  role: 'superadmin' | 'admin';
  permissions: {
    tables: string[];
    pages: string[];
  };
  is_active: boolean;
  created_at: string;
}

interface TenantCredential {
  id: string;
  tenant_login_id: string;
  tenant_id: string;
  is_active: boolean;
  tenants: {
    name: string;
    tenant_id: string;
  };
}

const SuperAdminManagement = () => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [tenantCredentials, setTenantCredentials] = useState<TenantCredential[]>([]);
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [isTenantPasswordDialogOpen, setIsTenantPasswordDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [editingTenant, setEditingTenant] = useState<TenantCredential | null>(null);
  const [passwordChangeDialog, setPasswordChangeDialog] = useState<{
    isOpen: boolean;
    userId: string;
    userType: 'admin' | 'tenant';
    username: string;
  }>({
    isOpen: false,
    userId: '',
    userType: 'admin',
    username: ''
  });

  const [adminForm, setAdminForm] = useState({
    username: '',
    password: '',
    role: 'admin' as 'admin' | 'superadmin',
    permissions: {
      tables: [] as string[],
      pages: [] as string[]
    }
  });

  const [newPassword, setNewPassword] = useState('');

  const availableTables = [
    'tenantsManagement',
    'leaseAgreements', 
    'rentPayments',
    'occupancy',
    'maintenance',
    'utilities',
    'feedback',
    'revenue',
    'assets'
  ];

  const availablePages = [
    'analytics',
    'forms', 
    'data'
  ];

  useEffect(() => {
    fetchAdminUsers();
    fetchTenantCredentials();
  }, []);

  const fetchAdminUsers = async () => {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .in('role', ['admin', 'superadmin'])
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch admin users');
      return;
    }

    const mappedData: AdminUser[] = (data || [])
      .filter(user => user.role === 'admin' || user.role === 'superadmin')
      .map(user => ({
        id: user.id,
        username: user.username,
        role: user.role as 'admin' | 'superadmin',
        permissions: user.permissions as { tables: string[]; pages: string[] },
        is_active: user.is_active,
        created_at: user.created_at
      }));

    setAdminUsers(mappedData);
  };

  const fetchTenantCredentials = async () => {
    const { data, error } = await supabase
      .from('tenant_credentials')
      .select(`
        *,
        tenants!tenant_credentials_tenant_id_fkey(
          name,
          tenant_id
        )
      `)
      .order('tenant_login_id');

    if (error) {
      toast.error('Failed to fetch tenant credentials');
      return;
    }

    setTenantCredentials(data || []);
  };

  const handleAdminSubmit = async () => {
    if (editingAdmin) {
      // Update admin
      const { error } = await supabase
        .from('admin_users')
        .update({
          username: adminForm.username,
          role: adminForm.role,
          permissions: adminForm.permissions
        })
        .eq('id', editingAdmin.id);

      if (error) {
        toast.error('Failed to update admin user');
        return;
      }

      toast.success('Admin user updated successfully');
    } else {
      // Create new admin
      const { error } = await supabase
        .from('admin_users')
        .insert([{
          username: adminForm.username,
          password_hash: '$2b$10$8K1p/a9UxQP/8g5LJ/TJBOhJ9X0SQm8T6d4g4.d9W2b3Z0c/zQG5G', // admin123
          role: adminForm.role,
          permissions: adminForm.permissions
        }]);

      if (error) {
        toast.error('Failed to create admin user');
        return;
      }

      toast.success('Admin user created successfully');
    }

    setIsAdminDialogOpen(false);
    setEditingAdmin(null);
    setAdminForm({
      username: '',
      password: '',
      role: 'admin',
      permissions: { tables: [], pages: [] }
    });
    fetchAdminUsers();
  };

  const handleEditAdmin = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setAdminForm({
      username: admin.username,
      password: '',
      role: admin.role,
      permissions: admin.permissions
    });
    setIsAdminDialogOpen(true);
  };

  const handleDeleteAdmin = async (id: string) => {
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete admin user');
      return;
    }

    toast.success('Admin user deleted successfully');
    fetchAdminUsers();
  };

  const handleTenantPasswordUpdate = async () => {
    if (!editingTenant) return;

    const { error } = await supabase
      .from('tenant_credentials')
      .update({
        password_hash: '$2b$10$8K1p/a9UxQP/8g5LJ/TJBOhJ9X0SQm8T6d4g4.d9W2b3Z0c/zQG5G' // New password hashed
      })
      .eq('id', editingTenant.id);

    if (error) {
      toast.error('Failed to update tenant password');
      return;
    }

    toast.success('Tenant password updated successfully');
    setIsTenantPasswordDialogOpen(false);
    setEditingTenant(null);
    setNewPassword('');
  };

  const handleTablePermissionChange = (table: string, checked: boolean) => {
    setAdminForm(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        tables: checked 
          ? [...prev.permissions.tables, table]
          : prev.permissions.tables.filter(t => t !== table)
      }
    }));
  };

  const handlePagePermissionChange = (page: string, checked: boolean) => {
    setAdminForm(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        pages: checked 
          ? [...prev.permissions.pages, page]
          : prev.permissions.pages.filter(p => p !== page)
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Super Admin Management</h2>
        <p className="text-muted-foreground">Manage admin accounts and tenant credentials</p>
      </div>

      <Tabs defaultValue="admins" className="space-y-6">
        <TabsList>
          <TabsTrigger value="admins" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Admin Users
          </TabsTrigger>
          <TabsTrigger value="tenants" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Tenant Credentials
          </TabsTrigger>
        </TabsList>

        <TabsContent value="admins">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Admin Users</CardTitle>
                  <CardDescription>
                    Manage admin accounts and their permissions
                  </CardDescription>
                </div>
                <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => {
                        setEditingAdmin(null);
                        setAdminForm({
                          username: '',
                          password: '',
                          role: 'admin',
                          permissions: { tables: [], pages: [] }
                        });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingAdmin ? 'Edit Admin User' : 'Create Admin User'}
                      </DialogTitle>
                      <DialogDescription>
                        Configure admin user details and permissions
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            value={adminForm.username}
                            onChange={(e) => setAdminForm(prev => ({ ...prev, username: e.target.value }))}
                            placeholder="Enter username"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Select
                            value={adminForm.role}
                            onValueChange={(value: 'admin' | 'superadmin') => 
                              setAdminForm(prev => ({ ...prev, role: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="superadmin">Super Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {adminForm.role === 'admin' && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Table Permissions</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {availableTables.map((table) => (
                                <div key={table} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`table-${table}`}
                                    checked={adminForm.permissions.tables.includes(table)}
                                    onCheckedChange={(checked) => 
                                      handleTablePermissionChange(table, checked as boolean)
                                    }
                                  />
                                  <Label htmlFor={`table-${table}`} className="text-sm">
                                    {table}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Page Permissions</Label>
                            <div className="grid grid-cols-3 gap-2">
                              {availablePages.map((page) => (
                                <div key={page} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`page-${page}`}
                                    checked={adminForm.permissions.pages.includes(page)}
                                    onCheckedChange={(checked) => 
                                      handlePagePermissionChange(page, checked as boolean)
                                    }
                                  />
                                  <Label htmlFor={`page-${page}`} className="text-sm">
                                    {page}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAdminSubmit}>
                        {editingAdmin ? 'Update' : 'Create'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium">{admin.username}</TableCell>
                      <TableCell>
                        <Badge variant={admin.role === 'superadmin' ? 'default' : 'secondary'}>
                          {admin.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={admin.is_active ? 'default' : 'destructive'}>
                          {admin.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(admin.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPasswordChangeDialog({
                              isOpen: true,
                              userId: admin.id,
                              userType: 'admin',
                              username: admin.username
                            })}
                          >
                            <Key className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditAdmin(admin)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {admin.role !== 'superadmin' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteAdmin(admin.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tenants">
          <Card>
            <CardHeader>
              <CardTitle>Tenant Credentials</CardTitle>
              <CardDescription>
                Manage tenant login credentials and passwords
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant ID</TableHead>
                    <TableHead>Tenant Name</TableHead>
                    <TableHead>Login ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenantCredentials.map((credential) => (
                    <TableRow key={credential.id}>
                      <TableCell className="font-medium">
                        {credential.tenants?.tenant_id}
                      </TableCell>
                      <TableCell>{credential.tenants?.name}</TableCell>
                      <TableCell>{credential.tenant_login_id}</TableCell>
                      <TableCell>
                        <Badge variant={credential.is_active ? 'default' : 'destructive'}>
                          {credential.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPasswordChangeDialog({
                            isOpen: true,
                            userId: credential.id,
                            userType: 'tenant',
                            username: credential.tenant_login_id
                          })}
                        >
                          <Key className="h-4 w-4 mr-2" />
                          Reset Password
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <PasswordChangeDialog
        isOpen={passwordChangeDialog.isOpen}
        onClose={() => setPasswordChangeDialog(prev => ({ ...prev, isOpen: false }))}
        userId={passwordChangeDialog.userId}
        userType={passwordChangeDialog.userType}
        username={passwordChangeDialog.username}
      />
    </div>
  );
};

export default SuperAdminManagement;