import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, differenceInCalendarMonths, addDays } from "date-fns";
import TenantForm from "./TenantForm";

interface Tenant {
  id: string;
  name: string;
  floor: string;
  space_type: string;
  business_type: string;
  registration_date: string;
  monthly_rent: number;
  phone_number: string | null;
  email: string | null;
  first_payment_date: string | null;
  status: string;
}

const TenantsTable = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const fetchTenants = async () => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTenants(data || []);
    } catch (error) {
      console.error('Error fetching tenants:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tenants data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const calculateOccupancyMonths = (registrationDate: string): number => {
    return differenceInCalendarMonths(new Date(), new Date(registrationDate));
  };

  const calculateRentDueDate = (firstPaymentDate: string | null): Date | null => {
    if (!firstPaymentDate) return null;
    
    const today = new Date();
    const firstPayment = new Date(firstPaymentDate);
    const daysSinceFirst = Math.floor((today.getTime() - firstPayment.getTime()) / (1000 * 60 * 60 * 24));
    const cycleNumber = Math.ceil(daysSinceFirst / 30);
    
    return addDays(firstPayment, cycleNumber * 30);
  };

  const isRentOverdue = (firstPaymentDate: string | null): boolean => {
    if (!firstPaymentDate) return false;
    
    const dueDate = calculateRentDueDate(firstPaymentDate);
    if (!dueDate) return false;
    
    return new Date() > dueDate;
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tenant?')) return;

    try {
      const { error } = await supabase
        .from('tenants')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tenant deleted successfully",
      });
      fetchTenants();
    } catch (error) {
      console.error('Error deleting tenant:', error);
      toast({
        title: "Error",
        description: "Failed to delete tenant",
        variant: "destructive",
      });
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTenant(null);
    fetchTenants();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading tenants...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Tenants Management</CardTitle>
            <CardDescription>
              Manage all building tenants with automatic calculations
            </CardDescription>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Tenant
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
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
                  <TableHead>First Payment</TableHead>
                  <TableHead>Rent Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((tenant) => {
                  const occupancyMonths = calculateOccupancyMonths(tenant.registration_date);
                  const rentDueDate = calculateRentDueDate(tenant.first_payment_date);
                  const isOverdue = isRentOverdue(tenant.first_payment_date);

                  return (
                    <TableRow key={tenant.id}>
                      <TableCell className="font-mono text-xs">
                        {tenant.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="font-medium">{tenant.name}</TableCell>
                      <TableCell>{tenant.floor}</TableCell>
                      <TableCell>{tenant.space_type}</TableCell>
                      <TableCell>{tenant.business_type}</TableCell>
                      <TableCell>
                        {format(new Date(tenant.registration_date), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{occupancyMonths} months</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${tenant.monthly_rent.toFixed(2)}
                      </TableCell>
                      <TableCell>{tenant.phone_number || 'N/A'}</TableCell>
                      <TableCell>{tenant.email || 'N/A'}</TableCell>
                      <TableCell>
                        {tenant.first_payment_date 
                          ? format(new Date(tenant.first_payment_date), 'MMM dd, yyyy')
                          : 'N/A'
                        }
                      </TableCell>
                      <TableCell>
                        {rentDueDate ? (
                          <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                            {format(rentDueDate, 'MMM dd, yyyy')}
                            {isOverdue && ' (OVERDUE)'}
                          </span>
                        ) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            tenant.status === 'active' ? 'default' : 
                            tenant.status === 'inactive' ? 'destructive' : 'secondary'
                          }
                        >
                          {tenant.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingTenant(tenant);
                              setShowForm(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(tenant.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {tenants.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tenants found</p>
              <Button 
                onClick={() => setShowForm(true)}
                className="mt-4"
              >
                Add Your First Tenant
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <TenantForm
          tenant={editingTenant}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingTenant(null);
          }}
        />
      )}
    </div>
  );
};

export default TenantsTable;