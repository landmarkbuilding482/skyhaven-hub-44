import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Edit, Trash2, CalendarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface RentPayment {
  id: string;
  transaction_id: string;
  tenant_id: string;
  payment_date: string;
  month_year_range: string;
  amount: number;
  service_charge: number;
  method: string;
  last_paid_rent_date: string | null;
}

interface Tenant {
  id: string;
  name: string;
}

interface PaymentFormData {
  transaction_id: string;
  tenant_id: string;
  payment_date: string;
  month_year_range_start: string;
  month_year_range_end: string;
  amount: number;
  service_charge: number;
  method: string;
  last_paid_rent_date: string;
}

const RentPaymentsTable = () => {
  const [rentPayments, setRentPayments] = useState<RentPayment[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<RentPayment | null>(null);
  const [formData, setFormData] = useState<PaymentFormData>({
    transaction_id: "",
    tenant_id: "",
    payment_date: "",
    month_year_range_start: "",
    month_year_range_end: "",
    amount: 0,
    service_charge: 0,
    method: "",
    last_paid_rent_date: ""
  });
  const { toast } = useToast();

  const fetchRentPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('rent_payments')
        .select('*')
        .order('payment_date', { ascending: false });

      if (error) throw error;
      setRentPayments(data || []);
    } catch (error) {
      console.error('Error fetching rent payments:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch rent payments",
      });
    }
  };

  const fetchTenants = async () => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('id, name');

      if (error) throw error;
      setTenants(data || []);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchRentPayments(), fetchTenants()]);
      setLoading(false);
    };

    loadData();
  }, []);

  const getTenantName = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    return tenant ? tenant.name : tenantId;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method.toLowerCase()) {
      case 'bank_transfer':
        return 'bg-blue-100 text-blue-800';
      case 'cash':
        return 'bg-green-100 text-green-800';
      case 'check':
        return 'bg-yellow-100 text-yellow-800';
      case 'card':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (payment: RentPayment) => {
    setEditingPayment(payment);
    // Parse existing month_year_range to extract start and end dates
    const rangeParts = payment.month_year_range.split(' - ');
    setFormData({
      transaction_id: payment.transaction_id,
      tenant_id: payment.tenant_id,
      payment_date: payment.payment_date,
      month_year_range_start: rangeParts[0] || "",
      month_year_range_end: rangeParts[1] || "",
      amount: payment.amount,
      service_charge: payment.service_charge,
      method: payment.method,
      last_paid_rent_date: payment.last_paid_rent_date || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (paymentId: string) => {
    if (!confirm('Are you sure you want to delete this payment record?')) return;

    try {
      const { error } = await supabase
        .from('rent_payments')
        .delete()
        .eq('id', paymentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment record deleted successfully",
      });
      fetchRentPayments();
    } catch (error) {
      console.error('Error deleting payment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete payment record",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Combine start and end dates for month_year_range
      const submissionData = {
        ...formData,
        month_year_range: `${formData.month_year_range_start} - ${formData.month_year_range_end}`
      };
      
      // Remove the separate start/end fields before submission
      const { month_year_range_start, month_year_range_end, ...dataToSubmit } = submissionData;
      
      if (editingPayment) {
        const { error } = await supabase
          .from('rent_payments')
          .update(dataToSubmit)
          .eq('id', editingPayment.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Payment record updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('rent_payments')
          .insert([dataToSubmit]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Payment record created successfully",
        });
      }

      setShowForm(false);
      setEditingPayment(null);
      setFormData({
        transaction_id: "",
        tenant_id: "",
        payment_date: "",
        month_year_range_start: "",
        month_year_range_end: "",
        amount: 0,
        service_charge: 0,
        method: "",
        last_paid_rent_date: ""
      });
      fetchRentPayments();
    } catch (error) {
      console.error('Error saving payment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save payment record",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">Loading rent payments...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Rent Payments</CardTitle>
              <CardDescription>
                Track and manage all rent payment transactions
              </CardDescription>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Payment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Month/Year Range</TableHead>
                  <TableHead>Rent Fee</TableHead>
                  <TableHead>Service Charge</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Last Paid Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rentPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                      No rent payments found
                    </TableCell>
                  </TableRow>
                ) : (
                  rentPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-sm">
                        {payment.transaction_id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {getTenantName(payment.tenant_id)}
                      </TableCell>
                      <TableCell>
                        {formatDate(payment.payment_date)}
                      </TableCell>
                      <TableCell>
                        {payment.month_year_range}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(payment.service_charge)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getPaymentMethodColor(payment.method)}>
                          {payment.method.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {payment.last_paid_rent_date 
                          ? formatDate(payment.last_paid_rent_date)
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEdit(payment)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(payment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              {editingPayment ? 'Edit Payment Record' : 'Add New Payment Record'}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="transaction_id">Transaction ID</Label>
                <Input
                  id="transaction_id"
                  value={formData.transaction_id}
                  onChange={(e) => setFormData({ ...formData, transaction_id: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="tenant_id">Tenant</Label>
                <select
                  id="tenant_id"
                  className="w-full p-2 border rounded-md"
                  value={formData.tenant_id}
                  onChange={(e) => setFormData({ ...formData, tenant_id: e.target.value })}
                  required
                >
                  <option value="">Select Tenant</option>
                  {tenants.map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="payment_date">Payment Date</Label>
                <Input
                  id="payment_date"
                  type="date"
                  value={formData.payment_date}
                  onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="month_year_range_start">Range Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.month_year_range_start && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.month_year_range_start ? (
                          format(new Date(formData.month_year_range_start), "PPP")
                        ) : (
                          <span>Pick start date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.month_year_range_start ? new Date(formData.month_year_range_start) : undefined}
                        onSelect={(date) => 
                          setFormData({ 
                            ...formData, 
                            month_year_range_start: date ? format(date, "yyyy-MM-dd") : "" 
                          })
                        }
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="month_year_range_end">Range End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.month_year_range_end && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.month_year_range_end ? (
                          format(new Date(formData.month_year_range_end), "PPP")
                        ) : (
                          <span>Pick end date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.month_year_range_end ? new Date(formData.month_year_range_end) : undefined}
                        onSelect={(date) => 
                          setFormData({ 
                            ...formData, 
                            month_year_range_end: date ? format(date, "yyyy-MM-dd") : "" 
                          })
                        }
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div>
                <Label htmlFor="amount">Rent Fee ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="service_charge">Service Charge ($)</Label>
                <Input
                  id="service_charge"
                  type="number"
                  step="0.01"
                  value={formData.service_charge}
                  onChange={(e) => setFormData({ ...formData, service_charge: Number(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="method">Payment Method</Label>
                <select
                  id="method"
                  className="w-full p-2 border rounded-md"
                  value={formData.method}
                  onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                  required
                >
                  <option value="">Select Method</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="check">Check</option>
                  <option value="card">Card</option>
                </select>
              </div>
              <div>
                <Label htmlFor="last_paid_rent_date">Last Paid Rent Date</Label>
                <Input
                  id="last_paid_rent_date"
                  type="date"
                  value={formData.last_paid_rent_date}
                  onChange={(e) => setFormData({ ...formData, last_paid_rent_date: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingPayment(null);
                    setFormData({
                      transaction_id: "",
                      tenant_id: "",
                      payment_date: "",
                      month_year_range_start: "",
                      month_year_range_end: "",
                      amount: 0,
                      service_charge: 0,
                      method: "",
                      last_paid_rent_date: ""
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingPayment ? "Update Payment" : "Add Payment"}
                </Button>
              </div>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RentPaymentsTable;