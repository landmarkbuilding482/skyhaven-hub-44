import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface FeedbackComplaint {
  id: string;
  complaint_id: string;
  date: string;
  tenant_id: string;
  type: string;
  category: string;
  description: string;
  status: string;
  assigned_to: string;
}

export const TenantFeedbackTable = () => {
  const { user } = useAuth();
  const [feedbackData, setFeedbackData] = useState<FeedbackComplaint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbackData = async () => {
    try {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('feedback_complaints')
        .select('*')
        .eq('tenant_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setFeedbackData(data || []);
    } catch (error) {
      console.error('Error fetching feedback data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbackData();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return 'bg-success text-success-foreground';
      case 'under review':
        return 'bg-warning text-warning-foreground';
      case 'submitted':
        return 'bg-info text-info-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'feedback':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'complaint':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'suggestion':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading feedback records...</div>;
  }

  if (feedbackData.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No feedback or complaints found.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Complaint ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Assigned To</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {feedbackData.map((feedback) => (
          <TableRow key={feedback.id}>
            <TableCell className="font-mono text-sm font-medium">
              {feedback.complaint_id}
            </TableCell>
            <TableCell>
              {new Date(feedback.date).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Badge className={getTypeColor(feedback.type)}>
                {feedback.type}
              </Badge>
            </TableCell>
            <TableCell>{feedback.category}</TableCell>
            <TableCell className="max-w-xs truncate">
              {feedback.description}
            </TableCell>
            <TableCell>
              <Badge className={getStatusColor(feedback.status)}>
                {feedback.status}
              </Badge>
            </TableCell>
            <TableCell>{feedback.assigned_to || 'Not assigned'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};