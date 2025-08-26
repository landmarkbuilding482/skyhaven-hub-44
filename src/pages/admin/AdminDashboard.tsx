import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminForms from "./AdminForms";
import AdminDataTables from "./AdminDataTables";
import AdminAnalytics from "./AdminAnalytics";
import SuperAdminManagement from "./SuperAdminManagement";
import { FileText, Database, BarChart3, Settings, Shield } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import DataTablesSelector from "@/components/admin/DataTablesSelector";

const AdminDashboard = () => {
  const { hasPagePermission, hasRole } = usePermissions();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage building operations, tenant data, and analytics
        </p>
      </div>

      {/* Data Tables Selector */}
      {hasPagePermission('data-tables') && <DataTablesSelector />}

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className={`grid w-full ${hasRole('superadmin') ? 'grid-cols-4' : 'grid-cols-3'}`}>
          {hasPagePermission('analytics') && (
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics Dashboard
            </TabsTrigger>
          )}
          {hasPagePermission('forms') && (
            <TabsTrigger value="forms" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Forms
            </TabsTrigger>
          )}
          {hasPagePermission('data-tables') && (
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Data Tables
            </TabsTrigger>
          )}
          {hasRole('superadmin') && (
            <TabsTrigger value="management" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              User Management
            </TabsTrigger>
          )}
        </TabsList>

        {hasPagePermission('analytics') && (
          <TabsContent value="analytics">
            <AdminAnalytics />
          </TabsContent>
        )}

        {hasPagePermission('forms') && (
          <TabsContent value="forms">
            <AdminForms />
          </TabsContent>
        )}

        {hasPagePermission('data-tables') && (
          <TabsContent value="data">
            <AdminDataTables />
          </TabsContent>
        )}

        {hasRole('superadmin') && (
          <TabsContent value="management">
            <SuperAdminManagement />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default AdminDashboard;