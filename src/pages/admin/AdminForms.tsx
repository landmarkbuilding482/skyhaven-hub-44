import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreditCard, Wrench, Zap, MessageSquare, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";
import { useFeedbackDropdowns } from "@/hooks/useFeedbackDropdowns";

const AdminForms = () => {
  const { hasTablePermission, hasPagePermission } = usePermissions();
  const { dropdownOptions: feedbackDropdownOptions } = useFeedbackDropdowns();
  
  const [tenants, setTenants] = useState<Array<{id: string, name: string}>>([]);
  
  // Dialog states for the 5 forms
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
  const [isUtilitiesDialogOpen, setIsUtilitiesDialogOpen] = useState(false);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [isRevenueExpenseDialogOpen, setIsRevenueExpenseDialogOpen] = useState(false);
  const [isRentDialogOpen, setIsRentDialogOpen] = useState(false);
  
  // Form states for the 5 forms
  const [maintenanceForm, setMaintenanceForm] = useState({
    date_reported: new Date().toISOString().split('T')[0],
    floor: "",
    issue_reporter: "",
    issue_type: "",
    material_affected: "",
    description: "",
    assigned_vendor: "",
    cost: 0,
    status: "Reported"
  });

  const [utilitiesForm, setUtilitiesForm] = useState({
    date: new Date().toISOString().split('T')[0],
    type: "",
    amount: 0
  });

  const [feedbackForm, setFeedbackForm] = useState({
    date: new Date().toISOString().split('T')[0],
    tenant_id: "none",
    type: "",
    category: "",
    description: "",
    status: "Under Review",
    assigned_to: "unassigned"
  });

  const [revenueExpenseForm, setRevenueExpenseForm] = useState({
    date: new Date().toISOString().split('T')[0],
    type: "",
    category: "",
    description: "",
    amount: 0
  });

  const [rentForm, setRentForm] = useState({
    tenant_id: "",
    payment_date: new Date().toISOString().split('T')[0],
    amount: 0,
    method: "",
    transaction_id: "",
    month_year_range: "",
    tenant_reference: ""
  });

  // Dropdown options (same as in AdminDataTables)
  const [dropdownOptions] = useState({
    issueReporter: ["Maintenance Team", "Building Supervisor", "Other"],
    issueType: ["HVAC", "Plumbing", "Electrical", "Structural", "Cleaning", "Security", "IT/Technology", "Other"],
    materialAffected: ["Walls", "Flooring", "Ceiling", "Windows", "Doors", "Fixtures", "Equipment", "Systems", "Other"],
    assignedVendor: ["Cool Air Systems", "Quick Fix Plumbing", "Bright Electric", "Structural Solutions", "Clean Pro", "SecureTech", "Other"],
    status: ["Reported", "In Progress", "Pending", "Completed", "Cancelled"],
    floor: ["G", "1", "2", "3", "4", "5", "6", "7", "8", "B"]
  });

  const [utilitiesDropdownOptions] = useState({
    type: ["Electricity", "Water", "Gas", "Internet"]
  });

  const [revenueExpenseDropdownOptions] = useState({
    type: ["Revenue", "Expense"],
    revenueCategories: ["Rent Income", "Parking Fees", "Utility Reimbursements", "Late Fees", "Other Income"],
    expenseCategories: ["Maintenance", "Utilities", "Insurance", "Property Tax", "Management Fees", "Marketing", "Legal Fees", "Office Supplies", "Other Expenses"]
  });


  // Available table entry buttons
  const tableEntryButtons = [
    { 
      id: "rent_payments", 
      label: "Add Rent Payment", 
      icon: CreditCard, 
      permission: "rent_payments",
      dialog: () => setIsRentDialogOpen(true)
    },
    { 
      id: "maintenance_repairs", 
      label: "Add Maintenance Request", 
      icon: Wrench, 
      permission: "maintenance_repairs",
      dialog: () => setIsMaintenanceDialogOpen(true)
    },
    { 
      id: "utilities", 
      label: "Add Utility Entry", 
      icon: Zap, 
      permission: "utilities",
      dialog: () => setIsUtilitiesDialogOpen(true)
    },
    { 
      id: "feedback_complaints", 
      label: "Add Feedback Entry", 
      icon: MessageSquare, 
      permission: "feedback_complaints",
      dialog: () => setIsFeedbackDialogOpen(true)
    },
    { 
      id: "revenue_expenses", 
      label: "Add Revenue/Expense", 
      icon: DollarSign, 
      permission: "revenue_expenses",
      dialog: () => setIsRevenueExpenseDialogOpen(true)
    },
  ];

  // If user has forms page permission, show all forms; otherwise filter by table permissions
  const availableButtons = hasPagePermission('forms') 
    ? tableEntryButtons 
    : tableEntryButtons.filter(button => hasTablePermission(button.permission));

  // Fetch tenants for dropdowns
  const fetchTenants = async () => {
    const { data, error } = await supabase
      .from('tenants')
      .select('id, name')
      .order('name');
    
    if (error) {
      console.error('Failed to fetch tenants:', error);
      return;
    }
    
    setTenants(data || []);
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  // Submit handlers for the 5 forms

  const handleMaintenanceSubmit = async () => {
    const { error } = await supabase
      .from('maintenance_repairs')
      .insert([maintenanceForm]);
    
    if (error) {
      toast.error('Failed to create maintenance request');
      return;
    }
    
    toast.success('Maintenance request created successfully');
    setIsMaintenanceDialogOpen(false);
    setMaintenanceForm({
      date_reported: new Date().toISOString().split('T')[0],
      floor: "",
      issue_reporter: "",
      issue_type: "",
      material_affected: "",
      description: "",
      assigned_vendor: "",
      cost: 0,
      status: "Reported"
    });
  };

  const handleUtilitiesSubmit = async () => {
    const { error } = await supabase
      .from('utilities')
      .insert([utilitiesForm]);
    
    if (error) {
      toast.error('Failed to create utility entry');
      return;
    }
    
    toast.success('Utility entry created successfully');
    setIsUtilitiesDialogOpen(false);
    setUtilitiesForm({
      date: new Date().toISOString().split('T')[0],
      type: "",
      amount: 0
    });
  };

  const handleFeedbackSubmit = async () => {
    const { error } = await supabase
      .from('feedback_complaints')
      .insert([feedbackForm]);
    
    if (error) {
      toast.error('Failed to create feedback entry');
      return;
    }
    
    toast.success('Feedback entry created successfully');
    setIsFeedbackDialogOpen(false);
    setFeedbackForm({
      date: new Date().toISOString().split('T')[0],
      tenant_id: "none",
      type: "",
      category: "",
      description: "",
      status: "Under Review",
      assigned_to: "unassigned"
    });
  };

  const handleRevenueExpenseSubmit = async () => {
    const { error } = await supabase
      .from('revenue_expenses')
      .insert([revenueExpenseForm]);
    
    if (error) {
      toast.error('Failed to create revenue/expense entry');
      return;
    }
    
    toast.success('Revenue/expense entry created successfully');
    setIsRevenueExpenseDialogOpen(false);
    setRevenueExpenseForm({
      date: new Date().toISOString().split('T')[0],
      type: "",
      category: "",
      description: "",
      amount: 0
    });
  };


  const handleRentSubmit = async () => {
    const { error } = await supabase
      .from('rent_payments')
      .insert([rentForm]);
    
    if (error) {
      toast.error('Failed to create rent payment');
      return;
    }
    
    toast.success('Rent payment created successfully');
    setIsRentDialogOpen(false);
    setRentForm({
      tenant_id: "",
      payment_date: new Date().toISOString().split('T')[0],
      amount: 0,
      method: "",
      transaction_id: "",
      month_year_range: "",
      tenant_reference: ""
    });
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Entry Forms</CardTitle>
          <CardDescription>
            Quick access forms for all available data tables. These forms use the same logic and dropdown options as the table entry buttons.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableButtons.map((button) => {
              const Icon = button.icon;
              return (
                <Dialog key={button.id} open={
                  button.id === "rent_payments" ? isRentDialogOpen :
                  button.id === "maintenance_repairs" ? isMaintenanceDialogOpen :
                  button.id === "utilities" ? isUtilitiesDialogOpen :
                  button.id === "feedback_complaints" ? isFeedbackDialogOpen :
                  button.id === "revenue_expenses" ? isRevenueExpenseDialogOpen :
                  false
                } onOpenChange={(open) => {
                  if (!open) {
                    if (button.id === "rent_payments") setIsRentDialogOpen(false);
                    if (button.id === "maintenance_repairs") setIsMaintenanceDialogOpen(false);
                    if (button.id === "utilities") setIsUtilitiesDialogOpen(false);
                    if (button.id === "feedback_complaints") setIsFeedbackDialogOpen(false);
                    if (button.id === "revenue_expenses") setIsRevenueExpenseDialogOpen(false);
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center gap-2 p-4"
                      onClick={button.dialog}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-sm text-center">{button.label}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Icon className="h-5 w-5" />
                        {button.label}
                      </DialogTitle>
                    </DialogHeader>
                    

                    {/* Rent Payment Form */}
                    {button.id === "rent_payments" && (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Tenant</Label>
                            <Select value={rentForm.tenant_id} onValueChange={(value) => setRentForm({...rentForm, tenant_id: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select tenant" />
                              </SelectTrigger>
                              <SelectContent>
                                {tenants.map(tenant => (
                                  <SelectItem key={tenant.id} value={tenant.id}>
                                    {tenant.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Payment Date</Label>
                            <Input
                              type="date"
                              value={rentForm.payment_date}
                              onChange={(e) => setRentForm({...rentForm, payment_date: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Amount</Label>
                            <Input
                              type="number"
                              value={rentForm.amount}
                              onChange={(e) => setRentForm({...rentForm, amount: parseFloat(e.target.value) || 0})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Payment Method</Label>
                            <Select value={rentForm.method} onValueChange={(value) => setRentForm({...rentForm, method: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select method" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                <SelectItem value="Cash">Cash</SelectItem>
                                <SelectItem value="Check">Check</SelectItem>
                                <SelectItem value="Credit Card">Credit Card</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Transaction ID</Label>
                            <Input
                              value={rentForm.transaction_id}
                              onChange={(e) => setRentForm({...rentForm, transaction_id: e.target.value})}
                              placeholder="Transaction reference"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Month/Year Range</Label>
                            <Input
                              value={rentForm.month_year_range}
                              onChange={(e) => setRentForm({...rentForm, month_year_range: e.target.value})}
                              placeholder="e.g., Jan 2024"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Tenant Reference</Label>
                          <Input
                            value={rentForm.tenant_reference}
                            onChange={(e) => setRentForm({...rentForm, tenant_reference: e.target.value})}
                            placeholder="Additional reference"
                          />
                        </div>
                        <DialogFooter>
                          <Button onClick={handleRentSubmit}>Add Rent Payment</Button>
                        </DialogFooter>
                      </div>
                    )}

                    {/* Maintenance Request Form */}
                    {button.id === "maintenance_repairs" && (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Date Reported</Label>
                            <Input
                              type="date"
                              value={maintenanceForm.date_reported}
                              onChange={(e) => setMaintenanceForm({...maintenanceForm, date_reported: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Floor</Label>
                            <Select value={maintenanceForm.floor} onValueChange={(value) => setMaintenanceForm({...maintenanceForm, floor: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select floor" />
                              </SelectTrigger>
                              <SelectContent>
                                {dropdownOptions.floor.map(floor => (
                                  <SelectItem key={floor} value={floor}>
                                    {floor === 'G' ? 'Ground' : floor === 'B' ? 'Basement' : `Floor ${floor}`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Issue Reporter</Label>
                            <Select value={maintenanceForm.issue_reporter} onValueChange={(value) => setMaintenanceForm({...maintenanceForm, issue_reporter: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select reporter" />
                              </SelectTrigger>
                              <SelectContent>
                                {dropdownOptions.issueReporter.map(reporter => (
                                  <SelectItem key={reporter} value={reporter}>
                                    {reporter}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Issue Type</Label>
                            <Select value={maintenanceForm.issue_type} onValueChange={(value) => setMaintenanceForm({...maintenanceForm, issue_type: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select issue type" />
                              </SelectTrigger>
                              <SelectContent>
                                {dropdownOptions.issueType.map(type => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Material Affected</Label>
                            <Select value={maintenanceForm.material_affected} onValueChange={(value) => setMaintenanceForm({...maintenanceForm, material_affected: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select material" />
                              </SelectTrigger>
                              <SelectContent>
                                {dropdownOptions.materialAffected.map(material => (
                                  <SelectItem key={material} value={material}>
                                    {material}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Assigned Vendor</Label>
                            <Select value={maintenanceForm.assigned_vendor} onValueChange={(value) => setMaintenanceForm({...maintenanceForm, assigned_vendor: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select vendor" />
                              </SelectTrigger>
                              <SelectContent>
                                {dropdownOptions.assignedVendor.map(vendor => (
                                  <SelectItem key={vendor} value={vendor}>
                                    {vendor}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Cost</Label>
                            <Input
                              type="number"
                              value={maintenanceForm.cost}
                              onChange={(e) => setMaintenanceForm({...maintenanceForm, cost: parseFloat(e.target.value) || 0})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={maintenanceForm.status} onValueChange={(value) => setMaintenanceForm({...maintenanceForm, status: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                {dropdownOptions.status.map(status => (
                                  <SelectItem key={status} value={status}>
                                    {status}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={maintenanceForm.description}
                            onChange={(e) => setMaintenanceForm({...maintenanceForm, description: e.target.value})}
                            placeholder="Describe the maintenance issue"
                          />
                        </div>
                        <DialogFooter>
                          <Button onClick={handleMaintenanceSubmit}>Add Maintenance Request</Button>
                        </DialogFooter>
                      </div>
                    )}

                    {/* Utilities Form */}
                    {button.id === "utilities" && (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Date</Label>
                            <Input
                              type="date"
                              value={utilitiesForm.date}
                              onChange={(e) => setUtilitiesForm({...utilitiesForm, date: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Type</Label>
                            <Select value={utilitiesForm.type} onValueChange={(value) => setUtilitiesForm({...utilitiesForm, type: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select utility type" />
                              </SelectTrigger>
                              <SelectContent>
                                {utilitiesDropdownOptions.type.map(type => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Amount</Label>
                          <Input
                            type="number"
                            value={utilitiesForm.amount}
                            onChange={(e) => setUtilitiesForm({...utilitiesForm, amount: parseFloat(e.target.value) || 0})}
                          />
                        </div>
                        <DialogFooter>
                          <Button onClick={handleUtilitiesSubmit}>Add Utility Entry</Button>
                        </DialogFooter>
                      </div>
                    )}

                    {/* Feedback Form */}
                    {button.id === "feedback_complaints" && (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Date</Label>
                            <Input
                              type="date"
                              value={feedbackForm.date}
                              onChange={(e) => setFeedbackForm({...feedbackForm, date: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Tenant</Label>
                            <Select value={feedbackForm.tenant_id} onValueChange={(value) => setFeedbackForm({...feedbackForm, tenant_id: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select tenant" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">No specific tenant</SelectItem>
                                {tenants.map(tenant => (
                                  <SelectItem key={tenant.id} value={tenant.id}>
                                    {tenant.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Type</Label>
                            <Select value={feedbackForm.type} onValueChange={(value) => setFeedbackForm({...feedbackForm, type: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                {feedbackDropdownOptions.type?.map(type => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Category</Label>
                            <Select value={feedbackForm.category} onValueChange={(value) => setFeedbackForm({...feedbackForm, category: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {feedbackDropdownOptions.category?.map(category => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={feedbackForm.status} onValueChange={(value) => setFeedbackForm({...feedbackForm, status: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                {feedbackDropdownOptions.status?.map(status => (
                                  <SelectItem key={status} value={status}>
                                    {status}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Assigned To</Label>
                            <Select value={feedbackForm.assigned_to} onValueChange={(value) => setFeedbackForm({...feedbackForm, assigned_to: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select assignee" />
                              </SelectTrigger>
                              <SelectContent>
                                {feedbackDropdownOptions.assigned_to?.map(assignee => (
                                  <SelectItem key={assignee} value={assignee}>
                                    {assignee}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={feedbackForm.description}
                            onChange={(e) => setFeedbackForm({...feedbackForm, description: e.target.value})}
                            placeholder="Describe the feedback or complaint"
                          />
                        </div>
                        <DialogFooter>
                          <Button onClick={handleFeedbackSubmit}>Add Feedback Entry</Button>
                        </DialogFooter>
                      </div>
                    )}

                    {/* Revenue/Expense Form */}
                    {button.id === "revenue_expenses" && (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Date</Label>
                            <Input
                              type="date"
                              value={revenueExpenseForm.date}
                              onChange={(e) => setRevenueExpenseForm({...revenueExpenseForm, date: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Type</Label>
                            <Select value={revenueExpenseForm.type} onValueChange={(value) => setRevenueExpenseForm({...revenueExpenseForm, type: value, category: ""})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                {revenueExpenseDropdownOptions.type.map(type => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Category</Label>
                            <Select value={revenueExpenseForm.category} onValueChange={(value) => setRevenueExpenseForm({...revenueExpenseForm, category: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {(revenueExpenseForm.type === "Revenue" 
                                  ? revenueExpenseDropdownOptions.revenueCategories 
                                  : revenueExpenseDropdownOptions.expenseCategories
                                ).map(category => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Amount</Label>
                            <Input
                              type="number"
                              value={revenueExpenseForm.amount}
                              onChange={(e) => setRevenueExpenseForm({...revenueExpenseForm, amount: parseFloat(e.target.value) || 0})}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={revenueExpenseForm.description}
                            onChange={(e) => setRevenueExpenseForm({...revenueExpenseForm, description: e.target.value})}
                            placeholder="Describe the revenue or expense"
                          />
                        </div>
                        <DialogFooter>
                          <Button onClick={handleRevenueExpenseSubmit}>Add Revenue/Expense</Button>
                        </DialogFooter>
                      </div>
                    )}

                  </DialogContent>
                </Dialog>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminForms;
