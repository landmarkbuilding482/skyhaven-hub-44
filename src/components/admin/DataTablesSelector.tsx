import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Database } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import AdminDataTables from "@/pages/admin/AdminDataTables";

const DataTablesSelector = () => {
  const { hasTablePermission } = usePermissions();
  const [showDataTables, setShowDataTables] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string>("");

  const allTables = [
    { value: "tenantsManagement", label: "Tenants Management (Live)", permission: "tenants" },
    { value: "leaseAgreements", label: "Lease Agreements Table", permission: "lease_agreements" },
    { value: "rentPaymentsLive", label: "Rent Payments (Live)", permission: "rent_payments" },
    { value: "occupancy", label: "Occupancy Table", permission: "floor_occupancy" },
    { value: "maintenance", label: "Maintenance & Repairs Table", permission: "maintenance_repairs" },
    { value: "utilities", label: "Utilities Table", permission: "utilities" },
    { value: "feedback", label: "Feedback & Complaints Table", permission: "feedback_complaints" },
    { value: "revenue", label: "Revenue & Expenses Table", permission: "revenue_expenses" },
    { value: "assets", label: "Asset Inventory Table", permission: "asset_inventory" },
  ];

  const allowedTables = allTables.filter(table => hasTablePermission(table.permission));

  return (
    <div className="mb-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => setShowDataTables(!showDataTables)}
          className="flex items-center gap-2"
        >
          <Database className="h-4 w-4" />
          {showDataTables ? 'Hide Data Tables' : 'Show Data Tables'}
        </Button>
        
        {showDataTables && allowedTables.length > 0 && (
          <Select value={selectedTable} onValueChange={setSelectedTable}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select a table to view" />
            </SelectTrigger>
            <SelectContent>
              {allowedTables.map((table) => (
                <SelectItem key={table.value} value={table.value}>
                  {table.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      
      {showDataTables && selectedTable && (
        <div className="mt-6">
          <AdminDataTables initialSelectedTable={selectedTable} />
        </div>
      )}
    </div>
  );
};

export default DataTablesSelector;