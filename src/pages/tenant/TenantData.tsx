import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, FileText, CreditCard, Wrench, Building, MessageSquare } from "lucide-react";
import { TenantTenantsTable } from "@/components/tenant/TenantTenantsTable";
import { TenantLeaseTable } from "@/components/tenant/TenantLeaseTable";
import { TenantRentPaymentsTable } from "@/components/tenant/TenantRentPaymentsTable";
import { TenantOccupancyTable } from "@/components/tenant/TenantOccupancyTable";
import { TenantMaintenanceTable } from "@/components/tenant/TenantMaintenanceTable";
import { TenantFeedbackTable } from "@/components/tenant/TenantFeedbackTable";

interface TenantDataProps {
  tenantId: string;
}

const TenantData = ({ tenantId }: TenantDataProps) => {
  const [selectedDataType, setSelectedDataType] = useState<string>("");

  const dataTypeOptions = [
    { value: "tenants", label: "Tenant Management (Live)", icon: User },
    { value: "leaseAgreements", label: "Lease Agreements Table", icon: FileText },
    { value: "rentPayments", label: "Rent Payments (Live)", icon: CreditCard },
    { value: "occupancy", label: "Occupancy Table", icon: Building },
    { value: "maintenance", label: "Maintenance & Repairs Table", icon: Wrench },
    { value: "feedback", label: "Feedback & Complaints Table", icon: MessageSquare },
  ];

  const renderDataTable = () => {
    if (!selectedDataType) return null;
    
    switch (selectedDataType) {
      case 'tenants':
        return <TenantTenantsTable />;
      case 'leaseAgreements':
        return <TenantLeaseTable />;
      case 'rentPayments':
        return <TenantRentPaymentsTable />;
      case 'occupancy':
        return <TenantOccupancyTable />;
      case 'maintenance':
        return <TenantMaintenanceTable />;
      case 'feedback':
        return <TenantFeedbackTable />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Data to View</CardTitle>
          <CardDescription>
            Choose the type of information you want to access from your tenant account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedDataType} onValueChange={setSelectedDataType}>
            <SelectTrigger>
              <SelectValue placeholder="Choose data type to view" />
            </SelectTrigger>
            <SelectContent>
              {dataTypeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedDataType && (
        <Card>
          <CardHeader>
            <CardTitle>
              {dataTypeOptions.find(opt => opt.value === selectedDataType)?.label}
            </CardTitle>
            <CardDescription>
              View and manage your {selectedDataType.replace(/([A-Z])/g, ' $1').toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderDataTable()}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TenantData;