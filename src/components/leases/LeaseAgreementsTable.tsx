import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, Upload, Edit, Trash2, FileText, Plus } from "lucide-react";
import { format } from "date-fns";

interface LeaseAgreement {
  id: string;
  tenant_id: string;
  lease_start: string;
  lease_end: string;
  monthly_rent: number;
  terms_summary: string;
  contract_file_path: string;
  tenants: {
    name: string;
    floor: string;
  };
}

interface LeaseFormData {
  tenant_id: string;
  lease_start: string;
  lease_end: string;
  monthly_rent: number;
  terms_summary: string;
}

export const LeaseAgreementsTable = () => {
  const [leases, setLeases] = useState<LeaseAgreement[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLease, setEditingLease] = useState<LeaseAgreement | null>(null);
  const [formData, setFormData] = useState<LeaseFormData>({
    tenant_id: "",
    lease_start: "",
    lease_end: "",
    monthly_rent: 0,
    terms_summary: ""
  });

  const fetchLeases = async () => {
    try {
      const { data, error } = await supabase
        .from('lease_agreements')
        .select(`
          *,
          tenants (
            name,
            floor
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeases(data || []);
    } catch (error) {
      console.error('Error fetching leases:', error);
      toast.error('Failed to fetch lease agreements');
    } finally {
      setLoading(false);
    }
  };

  const fetchTenants = async () => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('id, name, floor')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      setTenants(data || []);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  useEffect(() => {
    fetchLeases();
    fetchTenants();
  }, []);

  const handleViewContract = async (lease: LeaseAgreement) => {
    try {
      if (!lease.contract_file_path) {
        toast.error('No contract file available');
        return;
      }

      const { data, error } = await supabase.storage
        .from('contracts')
        .download(lease.contract_file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error viewing contract:', error);
      toast.error('Failed to view contract');
    }
  };

  const handleUploadContract = async (lease: LeaseAgreement, file: File) => {
    try {
      const filePath = `contracts/${lease.tenant_id}_lease_agreement.pdf`;
      
      const { error: uploadError } = await supabase.storage
        .from('contracts')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from('lease_agreements')
        .update({ contract_file_path: filePath })
        .eq('id', lease.id);

      if (updateError) throw updateError;

      toast.success('Contract uploaded successfully');
      fetchLeases();
    } catch (error) {
      console.error('Error uploading contract:', error);
      toast.error('Failed to upload contract');
    }
  };

  const handleEdit = (lease: LeaseAgreement) => {
    setEditingLease(lease);
    setFormData({
      tenant_id: lease.tenant_id,
      lease_start: lease.lease_start,
      lease_end: lease.lease_end,
      monthly_rent: lease.monthly_rent,
      terms_summary: lease.terms_summary || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (leaseId: string) => {
    if (!confirm('Are you sure you want to delete this lease agreement?')) return;

    try {
      const { error } = await supabase
        .from('lease_agreements')
        .delete()
        .eq('id', leaseId);

      if (error) throw error;

      toast.success('Lease agreement deleted successfully');
      fetchLeases();
    } catch (error) {
      console.error('Error deleting lease:', error);
      toast.error('Failed to delete lease agreement');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingLease) {
        const { error } = await supabase
          .from('lease_agreements')
          .update(formData)
          .eq('id', editingLease.id);

        if (error) throw error;
        toast.success('Lease agreement updated successfully');
      } else {
        const { error } = await supabase
          .from('lease_agreements')
          .insert([formData]);

        if (error) throw error;
        toast.success('Lease agreement created successfully');
      }

      setShowForm(false);
      setEditingLease(null);
      setFormData({
        tenant_id: "",
        lease_start: "",
        lease_end: "",
        monthly_rent: 0,
        terms_summary: ""
      });
      fetchLeases();
    } catch (error) {
      console.error('Error saving lease:', error);
      toast.error('Failed to save lease agreement');
    }
  };

  const generateSamplePDFs = async () => {
    try {
      toast.info('Generating sample contract PDFs...');
      
      const { data, error } = await supabase.functions.invoke('generate-contract-pdfs');

      if (error) throw error;

      toast.success('Sample contract PDFs generated successfully');
      fetchLeases();
    } catch (error) {
      console.error('Error generating PDFs:', error);
      toast.error('Failed to generate sample PDFs');
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading lease agreements...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Lease Agreements</CardTitle>
        <div className="flex gap-2">
          <Button onClick={generateSamplePDFs} variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Generate Sample PDFs
          </Button>
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Lease
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {leases.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No lease agreements found. Click "Add Lease" to create one.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Lease Start</TableHead>
                <TableHead>Lease End</TableHead>
                <TableHead>Monthly Rent</TableHead>
                <TableHead>Terms Summary</TableHead>
                <TableHead>Contract Copy</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leases.map((lease) => (
                <TableRow key={lease.id}>
                  <TableCell className="font-mono text-sm">
                    {lease.tenant_id.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="font-medium">{lease.tenants?.name}</TableCell>
                  <TableCell>{lease.tenants?.floor}</TableCell>
                  <TableCell>{format(new Date(lease.lease_start), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{format(new Date(lease.lease_end), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>${lease.monthly_rent.toLocaleString()}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {lease.terms_summary || 'No summary available'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewContract(lease)}
                        disabled={!lease.contract_file_path}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <label className="cursor-pointer">
                        <Button variant="outline" size="sm" asChild>
                          <span>
                            <Upload className="w-4 h-4" />
                          </span>
                        </Button>
                        <input
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadContract(lease, file);
                          }}
                        />
                      </label>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(lease)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(lease.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingLease ? 'Edit Lease Agreement' : 'Create New Lease Agreement'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                      {tenant.name} - Floor {tenant.floor}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="lease_start">Lease Start Date</Label>
                <Input
                  id="lease_start"
                  type="date"
                  value={formData.lease_start}
                  onChange={(e) => setFormData({ ...formData, lease_start: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lease_end">Lease End Date</Label>
                <Input
                  id="lease_end"
                  type="date"
                  value={formData.lease_end}
                  onChange={(e) => setFormData({ ...formData, lease_end: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="monthly_rent">Monthly Rent ($)</Label>
                <Input
                  id="monthly_rent"
                  type="number"
                  value={formData.monthly_rent}
                  onChange={(e) => setFormData({ ...formData, monthly_rent: Number(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="terms_summary">Terms Summary</Label>
                <Textarea
                  id="terms_summary"
                  value={formData.terms_summary}
                  onChange={(e) => setFormData({ ...formData, terms_summary: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingLease ? 'Update' : 'Create'} Lease
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};