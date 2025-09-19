import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface MaintenanceRepair {
  id: string;
  date_reported: string;
  floor: string;
  issue_reporter: string;
  issue_type: string;
  material_affected: string;
  description: string;
  assigned_vendor: string;
  cost: number;
  status: string;
  completion_date: string;
}

export const TenantMaintenanceTable = () => {
  const { user } = useAuth();
  const [maintenanceData, setMaintenanceData] = useState<MaintenanceRepair[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMaintenanceData = async () => {
    try {
      if (!user?.tenant_login_id) return;

      // Get tenant's floors and name
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .select('floor, name')
        .eq('tenant_id', user.tenant_login_id)
        .single();

      if (tenantError) throw tenantError;

      if (tenantData) {
        // Fetch maintenance data for tenant's floors or reported by tenant
        let query = supabase
          .from('maintenance_repairs')
          .select('*')
          .order('date_reported', { ascending: false });

        // Filter by tenant's floors or tenant's name as reporter
        if (tenantData.floor) {
          query = query.or(`floor.in.(${tenantData.floor.join(',')}),issue_reporter.eq.${tenantData.name}`);
        } else {
          query = query.eq('issue_reporter', tenantData.name);
        }

        const { data, error } = await query;

        if (error) throw error;
        setMaintenanceData(data || []);
      }
    } catch (error) {
      console.error('Error fetching maintenance data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceData();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'in progress':
        return 'bg-warning text-warning-foreground';
      case 'reported':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading maintenance records...</div>;
  }

  if (maintenanceData.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No maintenance records found for your floors.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date Reported</TableHead>
          <TableHead>Floor</TableHead>
          <TableHead>Issue Reporter</TableHead>
          <TableHead>Issue Type</TableHead>
          <TableHead>Material Affected</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Assigned Vendor</TableHead>
          <TableHead>Cost</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Completion Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {maintenanceData.map((maintenance) => (
          <TableRow key={maintenance.id}>
            <TableCell>
              {new Date(maintenance.date_reported).toLocaleDateString()}
            </TableCell>
            <TableCell className="font-medium">{maintenance.floor}</TableCell>
            <TableCell>{maintenance.issue_reporter}</TableCell>
            <TableCell>{maintenance.issue_type}</TableCell>
            <TableCell>{maintenance.material_affected}</TableCell>
            <TableCell className="max-w-xs truncate">
              {maintenance.description}
            </TableCell>
            <TableCell>{maintenance.assigned_vendor || 'Not assigned'}</TableCell>
            <TableCell>
              {maintenance.cost ? `$${maintenance.cost.toLocaleString()}` : 'N/A'}
            </TableCell>
            <TableCell>
              <Badge className={getStatusColor(maintenance.status)}>
                {maintenance.status}
              </Badge>
            </TableCell>
            <TableCell>
              {maintenance.completion_date ? 
                new Date(maintenance.completion_date).toLocaleDateString() : 
                'N/A'
              }
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};