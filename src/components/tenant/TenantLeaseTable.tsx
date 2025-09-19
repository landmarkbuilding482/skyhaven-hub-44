import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { Eye, Download } from "lucide-react";
import { toast } from "sonner";

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
    floor: string[];
    tenant_id: string;
  };
}

export const TenantLeaseTable = () => {
  const { user } = useAuth();
  const [leases, setLeases] = useState<LeaseAgreement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeases = async () => {
    try {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('lease_agreements')
        .select(`
          *,
          tenants (
            name,
            floor,
            tenant_id
          )
        `)
        .eq('tenant_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeases(data || []);
    } catch (error) {
      console.error('Error fetching leases:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeases();
  }, [user]);

  const handleViewContract = async (lease: LeaseAgreement) => {
    try {
      if (!lease.contract_file_path) {
        toast.error('No contract file available');
        return;
      }

      let { data: fileData, error: downloadError } = await supabase.storage
        .from('contracts')
        .download(lease.contract_file_path);

      if (downloadError && !lease.contract_file_path.startsWith('contracts/')) {
        const pathWithPrefix = `contracts/${lease.contract_file_path}`;
        const result = await supabase.storage
          .from('contracts')
          .download(pathWithPrefix);
        fileData = result.data;
        downloadError = result.error;
      }

      if (downloadError || !fileData) {
        toast.error('Contract file not found');
        return;
      }

      const fileUrl = URL.createObjectURL(fileData);
      window.open(fileUrl, '_blank');
    } catch (error) {
      console.error('Error viewing contract:', error);
      toast.error('Failed to view contract');
    }
  };

  const handleDownloadContract = async (lease: LeaseAgreement) => {
    try {
      if (!lease.contract_file_path) {
        toast.error('No contract file available');
        return;
      }

      let { data: fileData, error: downloadError } = await supabase.storage
        .from('contracts')
        .download(lease.contract_file_path);

      if (downloadError && !lease.contract_file_path.startsWith('contracts/')) {
        const pathWithPrefix = `contracts/${lease.contract_file_path}`;
        const result = await supabase.storage
          .from('contracts')
          .download(pathWithPrefix);
        fileData = result.data;
        downloadError = result.error;
      }

      if (downloadError || !fileData) {
        toast.error('Failed to download contract file');
        return;
      }

      const url = URL.createObjectURL(fileData);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${lease.tenants?.name || 'Contract'} - Lease Agreement.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Contract downloaded successfully');
    } catch (error) {
      console.error('Error downloading contract:', error);
      toast.error('Failed to download contract');
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading lease agreements...</div>;
  }

  if (leases.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No lease agreements found.
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
          <TableHead>Lease Start</TableHead>
          <TableHead>Lease End</TableHead>
          <TableHead>Monthly Rent</TableHead>
          <TableHead>Terms Summary</TableHead>
          <TableHead>Contract</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leases.map((lease) => (
          <TableRow key={lease.id}>
            <TableCell className="font-mono text-sm font-medium">
              {lease.tenants?.tenant_id || 'N/A'}
            </TableCell>
            <TableCell className="font-medium">{lease.tenants?.name}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {lease.tenants?.floor?.map((f, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    Floor {f}
                  </Badge>
                )) || 'N/A'}
              </div>
            </TableCell>
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadContract(lease)}
                  disabled={!lease.contract_file_path}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};