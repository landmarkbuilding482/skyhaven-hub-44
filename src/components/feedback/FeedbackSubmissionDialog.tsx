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

interface FeedbackSubmissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  feedbackType: 'Feedback' | 'Complaint' | 'Suggestion';
  dropdownOptions?: {
    type: string[];
    category: string[];
    status: string[];
    assigned_to: string[];
  };
}

export const FeedbackSubmissionDialog = ({ 
  isOpen, 
  onClose, 
  feedbackType,
  dropdownOptions 
}: FeedbackSubmissionDialogProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({
    type: ["Complaint", "Feedback", "Suggestion"],
    category: ["Maintenance", "Billing", "Security", "Amenities", "Noise", "Parking", "Cleanliness", "Staff", "Other"],
    status: ["In Progress", "Under Review", "Closed"],
    assigned_to: ["Building Manager", "Maintenance Team", "Security", "Admin", "Customer Service"]
  });
  
  const [formData, setFormData] = useState({
    type: feedbackType,
    category: "",
    description: "",
    status: "Under Review",
    assigned_to: "unassigned"
  });

  useEffect(() => {
    if (dropdownOptions) {
      setOptions(dropdownOptions);
    }
  }, [dropdownOptions]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, type: feedbackType }));
  }, [feedbackType]);

  const fetchDropdownOptions = async () => {
    // This would typically fetch from a settings table or use the configured options
    // For now, we'll use the default options
  };

  useEffect(() => {
    if (isOpen) {
      fetchDropdownOptions();
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
          date: new Date().toISOString().split('T')[0],
          tenant_id: user?.role === 'tenant' ? user.id : null,
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Submit {feedbackType}</DialogTitle>
          <DialogDescription>
            Share your {feedbackType.toLowerCase()} with our management team
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={(value: 'Feedback' | 'Complaint' | 'Suggestion') => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {options.type.map((option) => (
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
                {options.category.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={`Describe your ${feedbackType.toLowerCase()}...`}
              rows={4}
            />
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