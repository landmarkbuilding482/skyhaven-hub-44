import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Shield, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const LoginPage = () => {
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });
  const [tenantCredentials, setTenantCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(adminCredentials, 'admin');
    
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      navigate('/admin');
    }
  };

  const handleTenantLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(tenantCredentials, 'tenant');
    
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      navigate('/tenant');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">Building Management</h1>
          <p className="text-muted-foreground">Access your dashboard</p>
        </div>

        <Tabs defaultValue="admin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Admin
            </TabsTrigger>
            <TabsTrigger value="tenant" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Tenant
            </TabsTrigger>
          </TabsList>

          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Admin Login
                </CardTitle>
                <CardDescription>
                  Access the administrative dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-username">Username</Label>
                    <Input
                      id="admin-username"
                      type="text"
                      placeholder="Enter username"
                      value={adminCredentials.username}
                      onChange={(e) => setAdminCredentials(prev => ({ ...prev, username: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="Enter password"
                      value={adminCredentials.password}
                      onChange={(e) => setAdminCredentials(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    <Lock className="h-4 w-4 mr-2" />
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Demo Login:</strong><br />
                    Username: superadmin<br />
                    Password: admin123
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tenant">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Tenant Login
                </CardTitle>
                <CardDescription>
                  Access your tenant portal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTenantLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tenant-id">Tenant ID</Label>
                    <Input
                      id="tenant-id"
                      type="text"
                      placeholder="Enter your tenant ID"
                      value={tenantCredentials.username}
                      onChange={(e) => setTenantCredentials(prev => ({ ...prev, username: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tenant-password">Password</Label>
                    <Input
                      id="tenant-password"
                      type="password"
                      placeholder="Enter password"
                      value={tenantCredentials.password}
                      onChange={(e) => setTenantCredentials(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    <Lock className="h-4 w-4 mr-2" />
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Demo Login:</strong><br />
                    Use any tenant ID from the database<br />
                    Password: tenant123
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LoginPage;