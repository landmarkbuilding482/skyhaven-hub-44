import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Upload, Edit, Trash2, Plus, Download, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type VendorContract = {
  id: string;
  contractor_name: string;
  service_type: string;
  start_date: string;
  end_date: string;
  description: string;
  contract_file_path: string | null;
};

type VendorActivityLog = {
  id: string;
  contractor_name: string;
  date: string;
  activity_type: string;
  description: string;
  status: string;
  rating: number | null;
};

type SubTableType = "contracts" | "activity_logs";

const VendorContractorsTable = () => {
  const [subTable, setSubTable] = useState<SubTableType>("contracts");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Data states
  const [contracts, setContracts] = useState<VendorContract[]>([]);
  const [activityLogs, setActivityLogs] = useState<VendorActivityLog[]>([]);
  
  // Dialog states
  const [isContractDialogOpen, setIsContractDialogOpen] = useState(false);
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  
  // Editing states
  const [editingContract, setEditingContract] = useState<VendorContract | null>(null);
  const [editingActivity, setEditingActivity] = useState<VendorActivityLog | null>(null);
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string } | null>(null);
  
  // Form states
  const [contractForm, setContractForm] = useState({
    contractor_name: "",
    service_type: "",
    start_date: "",
    end_date: "",
    description: "",
    contract_file: null as File | null
  });
  
  const [activityForm, setActivityForm] = useState({
    contractor_name: "",
    date: new Date().toISOString().split('T')[0],
    activity_type: "",
    description: "",
    status: "",
    rating: 5
  });

  // Service types
  const serviceTypes = [
    "Electricity Maintenance Company",
    "Plumbing Maintenance Company", 
    "Construction Maintenance Company",
    "Security Services Company",
    "Cleaning Services Company"
  ];

  const activityTypes = [
    "Routine Maintenance",
    "Emergency Repair",
    "Installation",
    "Inspection",
    "Consultation",
    "Other"
  ];

  const statusOptions = [
    "Scheduled",
    "In Progress", 
    "Completed",
    "Cancelled",
    "Pending Review"
  ];

  // Fetch functions
  const fetchContracts = async () => {
    const { data, error } = await supabase
      .from('vendor_contractor_contracts')
      .select('*')
      .order('start_date', { ascending: false });
    
    if (error) {
      toast.error('Failed to fetch contracts');
      return;
    }
    
    setContracts(data || []);
  };

  const fetchActivityLogs = async () => {
    const { data, error } = await supabase
      .from('vendor_contractor_activity_logs')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      toast.error('Failed to fetch activity logs');
      return;
    }
    
    setActivityLogs(data || []);
  };

  useEffect(() => {
    if (subTable === "contracts") {
      fetchContracts();
    } else {
      fetchActivityLogs();
    }
  }, [subTable]);

  // Contract CRUD functions
  const handleContractSubmit = async () => {
    try {
      let contractFilePath = null;
      
      // Upload file if provided
      if (contractForm.contract_file) {
        const fileName = `${Date.now()}_${contractForm.contract_file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('contracts')
          .upload(fileName, contractForm.contract_file);
        
        if (uploadError) {
          toast.error('Failed to upload contract file');
          return;
        }
        
        contractFilePath = uploadData.path;
      }

      const contractData = {
        contractor_name: contractForm.contractor_name,
        service_type: contractForm.service_type,
        start_date: contractForm.start_date,
        end_date: contractForm.end_date,
        description: contractForm.description,
        contract_file_path: contractFilePath || (editingContract?.contract_file_path || null)
      };

      if (editingContract) {
        const { error } = await supabase
          .from('vendor_contractor_contracts')
          .update(contractData)
          .eq('id', editingContract.id);
        
        if (error) throw error;
        toast.success('Contract updated successfully');
      } else {
        const { error } = await supabase
          .from('vendor_contractor_contracts')
          .insert([contractData]);
        
        if (error) throw error;
        toast.success('Contract created successfully');
      }
      
      setIsContractDialogOpen(false);
      setEditingContract(null);
      setContractForm({
        contractor_name: "",
        service_type: "",
        start_date: "",
        end_date: "",
        description: "",
        contract_file: null
      });
      fetchContracts();
    } catch (error) {
      console.error('Error saving contract:', error);
      toast.error('Failed to save contract');
    }
  };

  const handleContractEdit = (contract: VendorContract) => {
    setEditingContract(contract);
    setContractForm({
      contractor_name: contract.contractor_name,
      service_type: contract.service_type,
      start_date: contract.start_date,
      end_date: contract.end_date,
      description: contract.description,
      contract_file: null
    });
    setIsContractDialogOpen(true);
  };

  const handleContractDelete = async (id: string) => {
    const { error } = await supabase
      .from('vendor_contractor_contracts')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to delete contract');
      return;
    }
    
    toast.success('Contract deleted successfully');
    fetchContracts();
  };

  const handleContractView = async (contract: VendorContract) => {
    if (!contract.contract_file_path) {
      toast.error('No contract file available');
      return;
    }

    try {
      const { data: fileData, error } = await supabase.storage
        .from('contracts')
        .download(contract.contract_file_path);

      if (error) {
        toast.error('Failed to download contract file');
        return;
      }

      const fileUrl = URL.createObjectURL(fileData);
      setPreviewFile({
        url: fileUrl,
        name: `${contract.contractor_name} - Contract.pdf`
      });
      setIsPreviewModalOpen(true);
    } catch (error) {
      console.error('Error viewing contract:', error);
      toast.error('Failed to view contract');
    }
  };

  // Activity CRUD functions
  const handleActivitySubmit = async () => {
    try {
      if (editingActivity) {
        const { error } = await supabase
          .from('vendor_contractor_activity_logs')
          .update(activityForm)
          .eq('id', editingActivity.id);
        
        if (error) throw error;
        toast.success('Activity log updated successfully');
      } else {
        const { error } = await supabase
          .from('vendor_contractor_activity_logs')
          .insert([activityForm]);
        
        if (error) throw error;
        toast.success('Activity log created successfully');
      }
      
      setIsActivityDialogOpen(false);
      setEditingActivity(null);
      setActivityForm({
        contractor_name: "",
        date: new Date().toISOString().split('T')[0],
        activity_type: "",
        description: "",
        status: "",
        rating: 5
      });
      fetchActivityLogs();
    } catch (error) {
      console.error('Error saving activity log:', error);
      toast.error('Failed to save activity log');
    }
  };

  const handleActivityEdit = (activity: VendorActivityLog) => {
    setEditingActivity(activity);
    setActivityForm({
      contractor_name: activity.contractor_name,
      date: activity.date,
      activity_type: activity.activity_type,
      description: activity.description,
      status: activity.status,
      rating: activity.rating || 5
    });
    setIsActivityDialogOpen(true);
  };

  const handleActivityDelete = async (id: string) => {
    const { error } = await supabase
      .from('vendor_contractor_activity_logs')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to delete activity log');
      return;
    }
    
    toast.success('Activity log deleted successfully');
    fetchActivityLogs();
  };

  // Filter functions
  const filteredContracts = contracts.filter(contract =>
    contract.contractor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.service_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredActivityLogs = activityLogs.filter(activity =>
    activity.contractor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.activity_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating: number | null) => {
    if (!rating) return <span className="text-muted-foreground">Not rated</span>;
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vendor Contractors Management</CardTitle>
          <CardDescription>
            Manage vendor contractor contracts and activity logs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Sub-table filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Select value={subTable} onValueChange={(value: SubTableType) => setSubTable(value)}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select table" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contracts">Contracts</SelectItem>
                <SelectItem value="activity_logs">Activity Logs</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end mb-4">
            {subTable === "contracts" ? (
              <Button onClick={() => setIsContractDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Contract
              </Button>
            ) : (
              <Button onClick={() => setIsActivityDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Activity Log
              </Button>
            )}
          </div>

          {/* Contracts table */}
          {subTable === "contracts" && (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Contractor Name</TableHead>
                    <TableHead>Service Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell className="font-mono text-xs">
                        {contract.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="font-medium">{contract.contractor_name}</TableCell>
                      <TableCell>{contract.service_type}</TableCell>
                      <TableCell>{new Date(contract.start_date).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(contract.end_date).toLocaleDateString()}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{contract.description}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleContractView(contract)}
                            disabled={!contract.contract_file_path}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleContractEdit(contract)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleContractDelete(contract.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Activity logs table */}
          {subTable === "activity_logs" && (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Contractor Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Activity Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivityLogs.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-mono text-xs">
                        {activity.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="font-medium">{activity.contractor_name}</TableCell>
                      <TableCell>{new Date(activity.date).toLocaleDateString()}</TableCell>
                      <TableCell>{activity.activity_type}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{activity.description}</TableCell>
                      <TableCell>
                        <Badge variant={activity.status === 'Completed' ? 'default' : 'secondary'}>
                          {activity.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{renderStars(activity.rating)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleActivityEdit(activity)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleActivityDelete(activity.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contract Dialog */}
      <Dialog open={isContractDialogOpen} onOpenChange={setIsContractDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingContract ? 'Edit Contract' : 'Add New Contract'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contractor_name">Contractor Name</Label>
                <Input
                  id="contractor_name"
                  value={contractForm.contractor_name}
                  onChange={(e) => setContractForm({...contractForm, contractor_name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="service_type">Service Type</Label>
                <Select
                  value={contractForm.service_type}
                  onValueChange={(value) => setContractForm({...contractForm, service_type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={contractForm.start_date}
                  onChange={(e) => setContractForm({...contractForm, start_date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={contractForm.end_date}
                  onChange={(e) => setContractForm({...contractForm, end_date: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description (SLA terms and ToRs)</Label>
              <Textarea
                id="description"
                value={contractForm.description}
                onChange={(e) => setContractForm({...contractForm, description: e.target.value})}
                placeholder="Briefly describe SLA terms and Terms of Reference..."
              />
            </div>
            <div>
              <Label htmlFor="contract_file">Contract File (PDF)</Label>
              <Input
                id="contract_file"
                type="file"
                accept=".pdf"
                onChange={(e) => setContractForm({...contractForm, contract_file: e.target.files?.[0] || null})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleContractSubmit}>
              {editingContract ? 'Update Contract' : 'Create Contract'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Activity Dialog */}
      <Dialog open={isActivityDialogOpen} onOpenChange={setIsActivityDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingActivity ? 'Edit Activity Log' : 'Add New Activity Log'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="activity_contractor_name">Contractor Name</Label>
                <Input
                  id="activity_contractor_name"
                  value={activityForm.contractor_name}
                  onChange={(e) => setActivityForm({...activityForm, contractor_name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="activity_date">Date</Label>
                <Input
                  id="activity_date"
                  type="date"
                  value={activityForm.date}
                  onChange={(e) => setActivityForm({...activityForm, date: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="activity_type">Activity Type</Label>
                <Select
                  value={activityForm.activity_type}
                  onValueChange={(value) => setActivityForm({...activityForm, activity_type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {activityTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="activity_status">Status</Label>
                <Select
                  value={activityForm.status}
                  onValueChange={(value) => setActivityForm({...activityForm, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="activity_description">Description</Label>
              <Textarea
                id="activity_description"
                value={activityForm.description}
                onChange={(e) => setActivityForm({...activityForm, description: e.target.value})}
                placeholder="Describe the activity..."
              />
            </div>
            <div>
              <Label htmlFor="rating">Rating (1-5 stars)</Label>
              <Select
                value={activityForm.rating.toString()}
                onValueChange={(value) => setActivityForm({...activityForm, rating: parseInt(value)})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <SelectItem key={rating} value={rating.toString()}>
                      {rating} Star{rating > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleActivitySubmit}>
              {editingActivity ? 'Update Activity' : 'Create Activity'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PDF Preview Modal */}
      <Dialog 
        open={isPreviewModalOpen} 
        onOpenChange={(open) => {
          if (!open && previewFile?.url) {
            URL.revokeObjectURL(previewFile.url);
          }
          setIsPreviewModalOpen(open);
          if (!open) setPreviewFile(null);
        }}
      >
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <DialogTitle className="text-lg font-semibold">
              Contract Preview: {previewFile?.name}
            </DialogTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (previewFile?.url) {
                    const link = document.createElement('a');
                    link.href = previewFile.url;
                    link.download = previewFile.name;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    toast.success('Contract downloaded successfully');
                  }
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 border rounded-lg overflow-hidden bg-muted/10">
            {previewFile?.url && (
              <iframe
                src={previewFile.url}
                className="w-full h-full border-0"
                title="Contract PDF Preview"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorContractorsTable;