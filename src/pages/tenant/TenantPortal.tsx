import { useState } from "react";
import { Button } from "@/components/ui/button";
import TenantData from "./TenantData";
import { useAuth } from "@/hooks/useAuth";
import { FeedbackSubmissionDialog } from "@/components/feedback/FeedbackSubmissionDialog";
import { Plus } from "lucide-react";

const TenantPortal = () => {
  const { user, logout } = useAuth();
  const [feedbackDialog, setFeedbackDialog] = useState<{
    isOpen: boolean;
    type: 'Feedback' | 'Complaint' | 'Suggestion';
  }>({
    isOpen: false,
    type: 'Feedback'
  });

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

      {/* Feedback Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">Submit Feedback & Complaints</h2>
        <div className="flex gap-2">
          <Button onClick={() => setFeedbackDialog({ isOpen: true, type: 'Feedback' })}>
            <Plus className="h-4 w-4 mr-2" />
            Add Feedback Entry
          </Button>
        </div>
      </div>

      <TenantData tenantId={user?.id || ""} />

      <FeedbackSubmissionDialog
        isOpen={feedbackDialog.isOpen}
        onClose={() => setFeedbackDialog(prev => ({ ...prev, isOpen: false }))}
        feedbackType={feedbackDialog.type}
      />
    </div>
  );
};

export default TenantPortal;