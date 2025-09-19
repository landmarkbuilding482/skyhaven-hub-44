import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Tenant {
  id: string;
  tenant_id: string;
  name: string;
  floor: string[];
  space_type: string;
  business_type: string;
  registration_date: string;
  monthly_rent: number;
  phone_number: string;
  email: string;
  status: string;
}

export const TenantTenantsTable = () => {
  const { user } = useAuth();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTenants = async () => {
    try {
      if (!user?.tenant_login_id) return;

      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('tenant_id', user.tenant_login_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTenants(data || []);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, [user]);

  const calculateOccupancyMonths = (registrationDate: string) => {
    const regDate = new Date(registrationDate);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - regDate.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return diffMonths;
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading tenant information...</div>;
  }

  if (tenants.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No tenant information found.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tenant ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Floor</TableHead>
          <TableHead>Space Type</TableHead>
          <TableHead>Business Type</TableHead>
          <TableHead>Registration Date</TableHead>
          <TableHead>Occupancy Months</TableHead>
          <TableHead>Monthly Rent</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tenants.map((tenant) => (
          <TableRow key={tenant.id}>
            <TableCell className="font-mono text-sm font-medium">
              {tenant.tenant_id}
            </TableCell>
            <TableCell className="font-medium">{tenant.name}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {tenant.floor.map((f, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    Floor {f}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>{tenant.space_type}</TableCell>
            <TableCell>{tenant.business_type}</TableCell>
            <TableCell>{new Date(tenant.registration_date).toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge variant="secondary" className="font-medium">
                {calculateOccupancyMonths(tenant.registration_date)} months
              </Badge>
            </TableCell>
            <TableCell className="font-medium">${tenant.monthly_rent.toLocaleString()}</TableCell>
            <TableCell>{tenant.phone_number || 'N/A'}</TableCell>
            <TableCell>{tenant.email || 'N/A'}</TableCell>
            <TableCell>
              <Badge 
                className={tenant.status === 'active' ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}
              >
                {tenant.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};