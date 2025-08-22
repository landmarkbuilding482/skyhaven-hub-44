import { Button } from "@/components/ui/button";
import TenantData from "./TenantData";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

<Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
  <DialogTrigger asChild>
    <Button>
      <Plus className="h-4 w-4 mr-2" />
      Add Feedback Entry
    </Button>
  </DialogTrigger>
</Dialog>


const TenantPortal = () => {
  const { user, logout } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tenant Portal</h1>
          <p className="text-muted-foreground">Welcome back! {user?.tenant_login_id}</p>
        </div>
        <Button 
          variant="outline" 
          onClick={logout}
        >
          Logout
        </Button>
      </div>

      <TenantData tenantId={user?.id || ""} />
    </div>
  );
};

export default TenantPortal;