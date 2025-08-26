import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useFeedbackDropdowns } from "@/hooks/useFeedbackDropdowns";

interface Tenant {
  id: string;
  name: string;
  tenant_id: string;
}

interface FeedbackSubmissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  feedbackType: 'Feedback' | 'Complaint' | 'Suggestion';
}

export const FeedbackSubmissionDialog = ({ 
  isOpen, 
  onClose, 
  feedbackType
}: FeedbackSubmissionDialogProps) => {
  const { user } = useAuth();
  const { dropdownOptions } = useFeedbackDropdowns();
  const [loading, setLoading] = useState(false);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    tenant_id: "",
    type: feedbackType,
    category: "",
    description: "",
    status: "Under Review",
    assigned_to: "unassigned"
  });

  useEffect(() => {
    setFormData(prev => ({ ...prev, type: feedbackType }));
  }, [feedbackType]);

  useEffect(() => {
    const fetchTenants = async () => {
      const { data, error } = await supabase
        .from('tenants')
        .select('id, name, tenant_id')
        .order('name');
      
      if (!error && data) {
        setTenants(data);
      }
    };

    if (isOpen) {
      fetchTenants();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!formData.category || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('feedback_complaints')
        .insert([{
          date: formData.date,
          tenant_id: formData.tenant_id || (user?.role === 'tenant' ? user.id : null),
          type: formData.type,
          category: formData.category,
          description: formData.description,
          status: formData.status,
          assigned_to: formData.assigned_to === "unassigned" ? null : formData.assigned_to
        }]);

      if (error) {
        toast.error("Failed to submit feedback");
        return;
      }

      toast.success(`${feedbackType} submitted successfully`);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        tenant_id: "",
        type: feedbackType,
        category: "",
        description: "",
        status: "Under Review",
        assigned_to: "unassigned"
      });
      onClose();
    } catch (error) {
      toast.error("An error occurred while submitting feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Submit {feedbackType}</DialogTitle>
          <DialogDescription>
            Share your {feedbackType.toLowerCase()} with our management team
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="tenant">Tenant</Label>
              <Select value={formData.tenant_id} onValueChange={(value) => setFormData(prev => ({ ...prev, tenant_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tenant" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.name} ({tenant.tenant_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value: 'Feedback' | 'Complaint' | 'Suggestion') => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {dropdownOptions.type.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {dropdownOptions.category.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={`Describe your ${feedbackType.toLowerCase()}...`}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {dropdownOptions.status.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="assigned_to">Assigned To</Label>
              <Select value={formData.assigned_to} onValueChange={(value) => setFormData(prev => ({ ...prev, assigned_to: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {dropdownOptions.assigned_to.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : `Submit ${feedbackType}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};