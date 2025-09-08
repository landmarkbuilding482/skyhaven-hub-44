import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, Edit, Trash2, Eye, Upload } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface InspectionReport {
  id: string;
  inspector: string;
  inspection_type: string;
  date: string;
  description: string;
  status: string;
  rating: number | null;
  report_file_path: string | null;
  created_at: string;
  updated_at: string;
}

const InspectionComplianceTable = () => {
  const { toast } = useToast();
  const [reports, setReports] = useState<InspectionReport[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<InspectionReport | null>(null);
  const [formData, setFormData] = useState({
    inspector: "",
    inspection_type: "",
    date: "",
    description: "",
    status: "Pending",
    rating: "none",
    report_file: null as File | null,
  });

  // Fetch reports from Supabase
  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("inspection_compliance_reports")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error("Error fetching inspection reports:", error);
      toast({
        title: "Error",
        description: "Failed to fetch inspection reports",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let reportFilePath = editingReport?.report_file_path || null;

      // Handle file upload if a new file is selected
      if (formData.report_file) {
        const fileExt = formData.report_file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('contracts')
          .upload(fileName, formData.report_file);

        if (uploadError) {
          throw uploadError;
        }

        reportFilePath = fileName;
      }

      const reportData = {
        inspector: formData.inspector,
        inspection_type: formData.inspection_type,
        date: formData.date,
        description: formData.description,
        status: formData.status,
        rating: formData.rating && formData.rating !== "none" ? parseInt(formData.rating) : null,
        report_file_path: reportFilePath,
      };

      if (editingReport) {
        // Update existing report
        const { error } = await supabase
          .from("inspection_compliance_reports")
          .update(reportData)
          .eq("id", editingReport.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Inspection report updated successfully",
        });
      } else {
        // Create new report
        const { error } = await supabase
          .from("inspection_compliance_reports")
          .insert([reportData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Inspection report created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingReport(null);
      setFormData({
        inspector: "",
        inspection_type: "",
        date: "",
        description: "",
        status: "Pending",
        rating: "none",
        report_file: null,
      });
      fetchReports();
    } catch (error) {
      console.error("Error saving inspection report:", error);
      toast({
        title: "Error",
        description: "Failed to save inspection report",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (report: InspectionReport) => {
    setEditingReport(report);
    setFormData({
      inspector: report.inspector,
      inspection_type: report.inspection_type,
      date: report.date,
      description: report.description,
      status: report.status,
      rating: report.rating?.toString() || "none",
      report_file: null,
    });
    setIsDialogOpen(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inspection report?")) return;

    try {
      const { error } = await supabase
        .from("inspection_compliance_reports")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Inspection report deleted successfully",
      });
      fetchReports();
    } catch (error) {
      console.error("Error deleting inspection report:", error);
      toast({
        title: "Error",
        description: "Failed to delete inspection report",
        variant: "destructive",
      });
    }
  };

  // Handle view/download file
  const handleView = async (filePath: string) => {
    try {
      const { data } = await supabase.storage
        .from('contracts')
        .createSignedUrl(filePath, 60);

      if (data?.signedUrl) {
        // Open PDF in new tab instead of iframe to avoid browser blocking
        window.open(data.signedUrl, '_blank');
      }
    } catch (error) {
      console.error("Error viewing file:", error);
      toast({
        title: "Error",
        description: "Failed to view file",
        variant: "destructive",
      });
    }
  };

  // Filter reports based on search
  const filteredReports = reports.filter(report =>
    report.inspector.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.inspection_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render star rating
  const renderStars = (rating: number | null) => {
    if (!rating) return <span className="text-muted-foreground">No rating</span>;
    
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'default';
      case 'in progress':
        return 'secondary';
      case 'pending':
        return 'outline';
      case 'scheduled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Inspection & Compliance Reports</span>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingReport(null);
                setFormData({
                  inspector: "",
                  inspection_type: "",
                  date: "",
                  description: "",
                  status: "Pending",
                  rating: "none",
                  report_file: null,
                });
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingReport ? "Edit Inspection Report" : "Add New Inspection Report"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="inspector">Inspector</Label>
                    <Input
                      id="inspector"
                      value={formData.inspector}
                      onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="inspection_type">Inspection Type</Label>
                    <Select
                      value={formData.inspection_type}
                      onValueChange={(value) => setFormData({ ...formData, inspection_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select inspection type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fire Safety Audit">Fire Safety Audit</SelectItem>
                        <SelectItem value="Environmental Assessment">Environmental Assessment</SelectItem>
                        <SelectItem value="Security Risk Assessment">Security Risk Assessment</SelectItem>
                        <SelectItem value="Structural Inspection">Structural Inspection</SelectItem>
                        <SelectItem value="Regulatory Compliance Review">Regulatory Compliance Review</SelectItem>
                        <SelectItem value="Occupational Health & Safety">Occupational Health & Safety</SelectItem>
                        <SelectItem value="Electrical Safety Inspection">Electrical Safety Inspection</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rating">Rating (1-5 stars)</Label>
                    <Select
                      value={formData.rating}
                      onValueChange={(value) => setFormData({ ...formData, rating: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No rating</SelectItem>
                        <SelectItem value="1">1 Star</SelectItem>
                        <SelectItem value="2">2 Stars</SelectItem>
                        <SelectItem value="3">3 Stars</SelectItem>
                        <SelectItem value="4">4 Stars</SelectItem>
                        <SelectItem value="5">5 Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="report_file" className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Inspection Report Document
                    </Label>
                    <div className="space-y-2">
                      <Input
                        id="report_file"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setFormData({ ...formData, report_file: e.target.files?.[0] || null })}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground">
                        Upload PDF, DOC, or DOCX files only
                      </p>
                      {editingReport?.report_file_path && (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <Eye className="h-4 w-4" />
                          Current file exists - upload new file to replace
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : editingReport ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Inspector</TableHead>
              <TableHead>Inspection Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Document</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-mono text-xs">
                  {report.id.slice(0, 8)}...
                </TableCell>
                <TableCell>{report.inspector}</TableCell>
                <TableCell>{report.inspection_type}</TableCell>
                <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                <TableCell className="max-w-xs truncate">{report.description}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(report.status)}>
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell>{renderStars(report.rating)}</TableCell>
                <TableCell>
                  {report.report_file_path ? (
                    <Badge variant="default" className="text-xs">
                      <Eye className="h-3 w-3 mr-1" />
                      Uploaded
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      <Upload className="h-3 w-3 mr-1" />
                      No Document
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(report)}
                      title="Edit Report"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(report.id)}
                      title="Delete Report"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {report.report_file_path ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleView(report.report_file_path!)}
                        title="View Report Document"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(report)}
                        title="Upload Report Document"
                        className="text-muted-foreground"
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredReports.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No inspection reports found.
          </div>
        )}
      </CardContent>

    </Card>
  );
};

export default InspectionComplianceTable;