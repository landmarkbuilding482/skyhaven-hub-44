import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TenantData from "./TenantData";
import { User, Lock } from "lucide-react";

const TenantPortal = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tenantId, setTenantId] = useState<string>("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple demo login - in real app, this would validate credentials
    setIsLoggedIn(true);
    setTenantId("T001"); // Demo tenant ID
  };

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <User className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Tenant Portal Login</CardTitle>
              <CardDescription>
                Access your tenant dashboard and data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tenantId">Tenant ID</Label>
                  <Input 
                    id="tenantId" 
                    placeholder="Enter your tenant ID (e.g., T001)"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Lock className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </form>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Demo Access:</strong> Use any tenant ID (T001, T002, T003) to access the portal
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tenant Portal</h1>
          <p className="text-muted-foreground">Welcome back! Tenant ID: {tenantId}</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setIsLoggedIn(false)}
        >
          Logout
        </Button>
      </div>

      <TenantData tenantId={tenantId} />
    </div>
  );
};

export default TenantPortal;