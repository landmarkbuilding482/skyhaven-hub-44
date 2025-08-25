import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { usePermissions } from "@/hooks/usePermissions";
import TenantsTable from "@/components/tenants/TenantsTable";
import { LeaseAgreementsTable } from "@/components/leases/LeaseAgreementsTable";
import RentPaymentsTable from "@/components/rent-payments/RentPaymentsTable";
import { 
  Users, 
  FileText, 
  CreditCard, 
  Building, 
  Wrench, 
  Zap, 
  MessageSquare, 
  DollarSign, 
  Package,
  BarChart3
} from "lucide-react";

const AdminDataTables = () => {
  const { hasTablePermission, user } = usePermissions();
  const [activeTab, setActiveTab] = useState<string>("");

  // Define all available tables with their metadata
  const allTables = [
    { 
      id: 'tenants', 
      label: 'Tenants', 
      icon: Users, 
      component: <TenantsTable />,
      description: "Manage tenant information and registrations"
    },
    { 
      id: 'lease_agreements', 
      label: 'Lease Agreements', 
      icon: FileText, 
      component: <LeaseAgreementsTable />,
      description: "View and manage lease agreements"
    },
    { 
      id: 'rent_payments', 
      label: 'Rent Payments', 
      icon: CreditCard, 
      component: <RentPaymentsTable />,
      description: "Track rent payment records"
    },
    { 
      id: 'floor_occupancy', 
      label: 'Floor Occupancy', 
      icon: Building, 
      component: <div className="p-8 text-center text-muted-foreground">Floor Occupancy table coming soon...</div>,
      description: "Monitor floor space utilization"
    },
    { 
      id: 'maintenance_repairs', 
      label: 'Maintenance & Repairs', 
      icon: Wrench, 
      component: <div className="p-8 text-center text-muted-foreground">Maintenance & Repairs table coming soon...</div>,
      description: "Track maintenance requests and repairs"
    },
    { 
      id: 'utilities', 
      label: 'Utilities', 
      icon: Zap, 
      component: <div className="p-8 text-center text-muted-foreground">Utilities table coming soon...</div>,
      description: "Manage utility usage and billing"
    },
    { 
      id: 'feedback_complaints', 
      label: 'Feedback & Complaints', 
      icon: MessageSquare, 
      component: <div className="p-8 text-center text-muted-foreground">Feedback & Complaints table coming soon...</div>,
      description: "Review tenant feedback and complaints"
    },
    { 
      id: 'revenue_expenses', 
      label: 'Revenue & Expenses', 
      icon: DollarSign, 
      component: <div className="p-8 text-center text-muted-foreground">Revenue & Expenses table coming soon...</div>,
      description: "Track financial transactions"
    },
    { 
      id: 'asset_inventory', 
      label: 'Asset Inventory', 
      icon: Package, 
      component: <div className="p-8 text-center text-muted-foreground">Asset Inventory table coming soon...</div>,
      description: "Manage building assets and equipment"
    }
  ];

  // Filter tables based on permissions
  const allowedTables = allTables.filter(table => {
    // Superadmin can see all tables
    if (user?.role === 'superadmin') return true;
    // Regular admin can only see tables they have permission for
    return hasTablePermission(table.id);
  });

  // Set the first allowed table as active tab on mount
  useEffect(() => {
    if (allowedTables.length > 0 && !activeTab) {
      setActiveTab(allowedTables[0].id);
    }
  }, [allowedTables, activeTab]);

  if (allowedTables.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Data Tables Available</h3>
            <p>You don't have permission to access any data tables. Contact your administrator for access.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Data Tables</h2>
        <p className="text-muted-foreground">
          Access and manage building data across different categories
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${Math.min(allowedTables.length, 5)}, 1fr)` }}>
          {allowedTables.slice(0, 5).map((table) => {
            const Icon = table.icon;
            return (
              <TabsTrigger key={table.id} value={table.id} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{table.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {allowedTables.length > 5 && (
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${allowedTables.length - 5}, 1fr)` }}>
            {allowedTables.slice(5).map((table) => {
              const Icon = table.icon;
              return (
                <TabsTrigger key={table.id} value={table.id} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{table.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        )}

        {allowedTables.map((table) => (
          <TabsContent key={table.id} value={table.id}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <table.icon className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>{table.label}</CardTitle>
                    <CardDescription>{table.description}</CardDescription>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    {user?.role === 'superadmin' ? 'Full Access' : 'Limited Access'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {table.component}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AdminDataTables;