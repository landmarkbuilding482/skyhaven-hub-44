import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminForms from "./AdminForms";
import AdminDataTables from "./AdminDataTables";
import AdminAnalytics from "./AdminAnalytics";
import SuperAdminManagement from "./SuperAdminManagement";
import { FileText, Database, BarChart3, Settings, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage building operations, tenant data, and analytics
        </p>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics Dashboard
          </TabsTrigger>
          <TabsTrigger value="forms" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Forms
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data Tables
          </TabsTrigger>
          {user?.role === 'superadmin' && (
            <TabsTrigger value="management" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              User Management
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="analytics">
          <AdminAnalytics />
        </TabsContent>

        <TabsContent value="forms">
          <AdminForms />
        </TabsContent>

        <TabsContent value="data">
          <AdminDataTables />
        </TabsContent>

        {user?.role === 'superadmin' && (
          <TabsContent value="management">
            <SuperAdminManagement />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default AdminDashboard;