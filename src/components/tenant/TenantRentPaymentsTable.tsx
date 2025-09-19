import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface RentPayment {
  id: string;
  tenant_id: string;
  transaction_id: string;
  payment_date: string;
  amount: number;
  service_charge: number;
  method: string;
  month_year_range: string;
  last_paid_rent_date: string;
  tenant_reference: string;
}

interface Tenant {
  id: string;
  name: string;
  tenant_id: string;
}

export const TenantRentPaymentsTable = () => {
  const { user } = useAuth();
  const [rentPayments, setRentPayments] = useState<RentPayment[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRentPayments = async () => {
    try {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('rent_payments')
        .select('*')
        .eq('tenant_id', user.id)
        .order('payment_date', { ascending: false });

      if (error) throw error;
      setRentPayments(data || []);
    } catch (error) {
      console.error('Error fetching rent payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTenants = async () => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('id, name, tenant_id')
        .order('name');

      if (error) throw error;
      setTenants(data || []);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  useEffect(() => {
    fetchRentPayments();
    fetchTenants();
  }, [user]);

  const getTenantName = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    return tenant ? tenant.name : 'Unknown Tenant';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method.toLowerCase()) {
      case 'credit card':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'bank transfer':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cash':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'check':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading rent payments...</div>;
  }

  if (rentPayments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No rent payment records found.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Transaction ID</TableHead>
          <TableHead>Tenant</TableHead>
          <TableHead>Payment Date</TableHead>
          <TableHead>Rent Fee</TableHead>
          <TableHead>Service Charge</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Month/Year Range</TableHead>
          <TableHead>Last Paid Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rentPayments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell className="font-mono text-sm font-medium">
              {payment.transaction_id}
            </TableCell>
            <TableCell className="font-medium">
              {getTenantName(payment.tenant_id)}
            </TableCell>
            <TableCell>
              {new Date(payment.payment_date).toLocaleDateString()}
            </TableCell>
            <TableCell className="font-medium">
              {formatCurrency(payment.amount)}
            </TableCell>
            <TableCell className="font-medium">
              {formatCurrency(payment.service_charge || 0)}
            </TableCell>
            <TableCell className="font-medium">
              {formatCurrency(payment.amount + (payment.service_charge || 0))}
            </TableCell>
            <TableCell>
              <Badge className={getPaymentMethodColor(payment.method)}>
                {payment.method}
              </Badge>
            </TableCell>
            <TableCell>{payment.month_year_range}</TableCell>
            <TableCell>
              {payment.last_paid_rent_date ? 
                new Date(payment.last_paid_rent_date).toLocaleDateString() : 
                'N/A'
              }
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};