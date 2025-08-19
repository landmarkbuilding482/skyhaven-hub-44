import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Tenant {
  id: string;
  tenant_id: string;
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

interface TenantFormProps {
  tenant?: Tenant | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const TenantForm = ({ tenant, onSuccess, onCancel }: TenantFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    floor: '',
    space_type: '',
    business_type: '',
    registration_date: '',
    monthly_rent: '',
    phone_number: '',
    email: '',
    first_payment_date: '',
    status: 'active'
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name || '',
        floor: tenant.floor || '',
        space_type: tenant.space_type || '',
        business_type: tenant.business_type || '',
        registration_date: tenant.registration_date || '',
        monthly_rent: tenant.monthly_rent.toString() || '',
        phone_number: tenant.phone_number || '',
        email: tenant.email || '',
        first_payment_date: tenant.first_payment_date || '',
        status: tenant.status || 'active'
      });
    }
  }, [tenant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        monthly_rent: parseFloat(formData.monthly_rent),
        phone_number: formData.phone_number || null,
        email: formData.email || null,
        first_payment_date: formData.first_payment_date || null,
      };

      if (tenant) {
        // Update existing tenant
        const { error } = await supabase
          .from('tenants')
          .update(payload)
          .eq('id', tenant.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Tenant updated successfully",
        });
      } else {
        // Generate a unique tenant ID for new tenant
        const { data: existingTenants } = await supabase
          .from('tenants')
          .select('tenant_id')
          .order('tenant_id', { ascending: false })
          .limit(1);

        let nextId = 1001;
        if (existingTenants && existingTenants.length > 0) {
          const lastId = existingTenants[0].tenant_id;
          const lastNumber = parseInt(lastId.split('-')[1]);
          nextId = lastNumber + 1;
        }

        const floorPrefix = payload.floor === 'G' ? 'G' : payload.floor === 'B' ? 'B' : payload.floor;
        const tenantId = `LMT-${floorPrefix}${nextId.toString().padStart(3, '0')}`;

        // Create new tenant
        const { error } = await supabase
          .from('tenants')
          .insert([{ ...payload, tenant_id: tenantId }]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Tenant created successfully",
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving tenant:', error);
      toast({
        title: "Error",
        description: "Failed to save tenant",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tenant ? 'Edit Tenant' : 'Add New Tenant'}</CardTitle>
        <CardDescription>
          {tenant ? 'Update tenant information' : 'Enter tenant details to add them to the system'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tenant Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="floor">Floor *</Label>
              <Input
                id="floor"
                value={formData.floor}
                onChange={(e) => handleChange('floor', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="space_type">Space Type *</Label>
              <Select value={formData.space_type} onValueChange={(value) => handleChange('space_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select space type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office">Office</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_type">Business Type *</Label>
              <Input
                id="business_type"
                value={formData.business_type}
                onChange={(e) => handleChange('business_type', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registration_date">Registration Date *</Label>
              <Input
                id="registration_date"
                type="date"
                value={formData.registration_date}
                onChange={(e) => handleChange('registration_date', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthly_rent">Monthly Rent ($) *</Label>
              <Input
                id="monthly_rent"
                type="number"
                step="0.01"
                value={formData.monthly_rent}
                onChange={(e) => handleChange('monthly_rent', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                type="tel"
                value={formData.phone_number}
                onChange={(e) => handleChange('phone_number', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="first_payment_date">First Payment Date</Label>
              <Input
                id="first_payment_date"
                type="date"
                value={formData.first_payment_date}
                onChange={(e) => handleChange('first_payment_date', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (tenant ? 'Update Tenant' : 'Add Tenant')}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TenantForm;