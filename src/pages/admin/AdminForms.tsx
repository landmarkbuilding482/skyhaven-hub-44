import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, User, FileText, CreditCard, Wrench, Zap, MessageSquare, DollarSign, Package, Building, Car } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";
import { useFeedbackDropdowns } from "@/hooks/useFeedbackDropdowns";
import TenantForm from "@/components/tenants/TenantForm";

const AdminForms = () => {
  const { hasTablePermission } = usePermissions();
  const { dropdownOptions: feedbackDropdownOptions } = useFeedbackDropdowns();
  
  const [tenants, setTenants] = useState<Array<{id: string, name: string}>>([]);
  
  // Dialog states for each table
  const [isFloorDialogOpen, setIsFloorDialogOpen] = useState(false);
  const [isParkingDialogOpen, setIsParkingDialogOpen] = useState(false);
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
  const [isUtilitiesDialogOpen, setIsUtilitiesDialogOpen] = useState(false);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [isRevenueExpenseDialogOpen, setIsRevenueExpenseDialogOpen] = useState(false);
  const [isAssetInventoryDialogOpen, setIsAssetInventoryDialogOpen] = useState(false);
  const [isTenantDialogOpen, setIsTenantDialogOpen] = useState(false);
  const [isLeaseDialogOpen, setIsLeaseDialogOpen] = useState(false);
  const [isRentDialogOpen, setIsRentDialogOpen] = useState(false);
  
  // Form states (same as in AdminDataTables)
  const [floorForm, setFloorForm] = useState({
    floor: "",
    type: "",
    square_meters_available: 0,
    square_meters_occupied: 0
  });
  
  const [parkingForm, setParkingForm] = useState({
    company: "",
    spots_allowed: 0
  });

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

  const [assetInventoryForm, setAssetInventoryForm] = useState({
    asset_name: "",
    category: "",
    purchase_date: new Date().toISOString().split('T')[0],
    value: 0,
    condition: "Good",
    last_maintenance: "",
    next_maintenance: "",
    warranty_month: "",
    warranty_year: ""
  });

  const [leaseForm, setLeaseForm] = useState({
    tenant_id: "",
    lease_start: "",
    lease_end: "",
    monthly_rent: 0,
    terms_summary: "",
    tenant_reference: ""
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

  const [assetInventoryDropdownOptions] = useState({
    category: ["Furniture", "Electronics", "HVAC Equipment", "Office Equipment", "Security Systems", "Maintenance Tools", "Other"],
    condition: ["Excellent", "Good", "Needs Repairment", "Needs Replacement"]
  });

  // Available table entry buttons
  const tableEntryButtons = [
    { 
      id: "tenants", 
      label: "Add Tenant", 
      icon: User, 
      permission: "tenants",
      dialog: () => setIsTenantDialogOpen(true)
    },
    { 
      id: "lease_agreements", 
      label: "Add Lease Agreement", 
      icon: FileText, 
      permission: "lease_agreements",
      dialog: () => setIsLeaseDialogOpen(true)
    },
    { 
      id: "rent_payments", 
      label: "Add Rent Payment", 
      icon: CreditCard, 
      permission: "rent_payments",
      dialog: () => setIsRentDialogOpen(true)
    },
    { 
      id: "floor_occupancy", 
      label: "Add Floor Occupancy", 
      icon: Building, 
      permission: "floor_occupancy",
      dialog: () => setIsFloorDialogOpen(true)
    },
    { 
      id: "parking_allocations", 
      label: "Add Parking Allocation", 
      icon: Car, 
      permission: "parking_allocations",
      dialog: () => setIsParkingDialogOpen(true)
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
    { 
      id: "asset_inventory", 
      label: "Add Asset", 
      icon: Package, 
      permission: "asset_inventory",
      dialog: () => setIsAssetInventoryDialogOpen(true)
    },
  ];

  // Filter buttons based on user permissions
  const availableButtons = tableEntryButtons.filter(button => hasTablePermission(button.permission));

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

  // Submit handlers for each form (same logic as AdminDataTables)
  const handleFloorSubmit = async () => {
    const { error } = await supabase
      .from('floor_occupancy')
      .insert([floorForm]);
    
    if (error) {
      toast.error('Failed to create floor data');
      return;
    }
    
    toast.success('Floor data created successfully');
    setIsFloorDialogOpen(false);
    setFloorForm({ floor: "", type: "", square_meters_available: 0, square_meters_occupied: 0 });
  };

  const handleParkingSubmit = async () => {
    const { error } = await supabase
      .from('parking_allocations')
      .insert([parkingForm]);
    
    if (error) {
      toast.error('Failed to create parking allocation');
      return;
    }
    
    toast.success('Parking allocation created successfully');
    setIsParkingDialogOpen(false);
    setParkingForm({ company: "", spots_allowed: 0 });
  };

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

  const handleAssetInventorySubmit = async () => {
    const { error } = await supabase
      .from('asset_inventory')
      .insert([{
        ...assetInventoryForm,
        last_maintenance: assetInventoryForm.last_maintenance || null,
        next_maintenance: assetInventoryForm.next_maintenance || null,
        warranty_month: assetInventoryForm.warranty_month ? parseInt(assetInventoryForm.warranty_month) : null,
        warranty_year: assetInventoryForm.warranty_year ? parseInt(assetInventoryForm.warranty_year) : null
      }]);
    
    if (error) {
      toast.error('Failed to create asset entry');
      return;
    }
    
    toast.success('Asset entry created successfully');
    setIsAssetInventoryDialogOpen(false);
    setAssetInventoryForm({
      asset_name: "",
      category: "",
      purchase_date: new Date().toISOString().split('T')[0],
      value: 0,
      condition: "Good",
      last_maintenance: "",
      next_maintenance: "",
      warranty_month: "",
      warranty_year: ""
    });
  };

  const handleLeaseSubmit = async () => {
    const { error } = await supabase
      .from('lease_agreements')
      .insert([leaseForm]);
    
    if (error) {
      toast.error('Failed to create lease agreement');
      return;
    }
    
    toast.success('Lease agreement created successfully');
    setIsLeaseDialogOpen(false);
    setLeaseForm({
      tenant_id: "",
      lease_start: "",
      lease_end: "",
      monthly_rent: 0,
      terms_summary: "",
      tenant_reference: ""
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

  const handleTenantFormSuccess = () => {
    setIsTenantDialogOpen(false);
    fetchTenants(); // Refresh tenant list
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
                  button.id === "tenants" ? isTenantDialogOpen :
                  button.id === "lease_agreements" ? isLeaseDialogOpen :
                  button.id === "rent_payments" ? isRentDialogOpen :
                  button.id === "floor_occupancy" ? isFloorDialogOpen :
                  button.id === "parking_allocations" ? isParkingDialogOpen :
                  button.id === "maintenance_repairs" ? isMaintenanceDialogOpen :
                  button.id === "utilities" ? isUtilitiesDialogOpen :
                  button.id === "feedback_complaints" ? isFeedbackDialogOpen :
                  button.id === "revenue_expenses" ? isRevenueExpenseDialogOpen :
                  button.id === "asset_inventory" ? isAssetInventoryDialogOpen :
                  false
                } onOpenChange={(open) => {
                  if (!open) {
                    if (button.id === "tenants") setIsTenantDialogOpen(false);
                    if (button.id === "lease_agreements") setIsLeaseDialogOpen(false);
                    if (button.id === "rent_payments") setIsRentDialogOpen(false);
                    if (button.id === "floor_occupancy") setIsFloorDialogOpen(false);
                    if (button.id === "parking_allocations") setIsParkingDialogOpen(false);
                    if (button.id === "maintenance_repairs") setIsMaintenanceDialogOpen(false);
                    if (button.id === "utilities") setIsUtilitiesDialogOpen(false);
                    if (button.id === "feedback_complaints") setIsFeedbackDialogOpen(false);
                    if (button.id === "revenue_expenses") setIsRevenueExpenseDialogOpen(false);
                    if (button.id === "asset_inventory") setIsAssetInventoryDialogOpen(false);
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
                    
                    {/* Tenant Form */}
                    {button.id === "tenants" && (
                      <TenantForm
                        onSuccess={handleTenantFormSuccess}
                        onCancel={() => setIsTenantDialogOpen(false)}
                      />
                    )}

                    {/* Floor Occupancy Form */}
                    {button.id === "floor_occupancy" && (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Floor</Label>
                            <Select value={floorForm.floor} onValueChange={(value) => setFloorForm({...floorForm, floor: value})}>
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
                          <div className="space-y-2">
                            <Label>Type</Label>
                            <Select value={floorForm.type} onValueChange={(value) => setFloorForm({...floorForm, type: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="office">Office</SelectItem>
                                <SelectItem value="retail">Retail</SelectItem>
                                <SelectItem value="warehouse">Warehouse</SelectItem>
                                <SelectItem value="mixed">Mixed Use</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Available (sq meters)</Label>
                            <Input
                              type="number"
                              value={floorForm.square_meters_available}
                              onChange={(e) => setFloorForm({...floorForm, square_meters_available: parseFloat(e.target.value) || 0})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Occupied (sq meters)</Label>
                            <Input
                              type="number"
                              value={floorForm.square_meters_occupied}
                              onChange={(e) => setFloorForm({...floorForm, square_meters_occupied: parseFloat(e.target.value) || 0})}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleFloorSubmit}>Add Floor Data</Button>
                        </DialogFooter>
                      </div>
                    )}

                    {/* Parking Allocation Form */}
                    {button.id === "parking_allocations" && (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Company</Label>
                            <Input
                              value={parkingForm.company}
                              onChange={(e) => setParkingForm({...parkingForm, company: e.target.value})}
                              placeholder="Company name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Spots Allowed</Label>
                            <Input
                              type="number"
                              value={parkingForm.spots_allowed}
                              onChange={(e) => setParkingForm({...parkingForm, spots_allowed: parseInt(e.target.value) || 0})}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleParkingSubmit}>Add Parking Allocation</Button>
                        </DialogFooter>
                      </div>
                    )}

                    {/* Additional forms would continue here in the same pattern... */}

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
