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
import { Eye, Upload, Edit, Trash2, Plus } from "lucide-react";
import TenantsTable from "@/components/tenants/TenantsTable";
import { LeaseAgreementsTable } from "@/components/leases/LeaseAgreementsTable";
import RentPaymentsTable from "@/components/rent-payments/RentPaymentsTable";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type FloorOccupancy = {
  id: string;
  floor: string;
  type: string;
  square_meters_available: number;
  square_meters_occupied: number;
};

type ParkingAllocation = {
  id: string;
  company: string;
  spots_allowed: number;
};

type ParkingStatistics = {
  id: string;
  spots_available: number;
  spots_occupied: number;
};

type MaintenanceRepair = {
  id: string;
  date_reported: string;
  floor: string;
  issue_reporter: string;
  issue_type: string;
  material_affected: string;
  description: string;
  assigned_vendor: string | null;
  cost: number;
  status: string;
  completion_date: string | null;
};

type Utility = {
  id: string;
  date: string;
  type: string;
  amount: number;
};

type FeedbackComplaint = {
  id: string;
  complaint_id: string;
  date: string;
  tenant_id: string | null;
  tenant_name?: string;
  type: string;
  category: string;
  description: string;
  status: string;
  assigned_to: string | null;
};

type RevenueExpense = {
  id: string;
  revenue_expense_id: string;
  date: string;
  type: string;
  category: string;
  description: string;
  amount: number;
};

type AssetInventory = {
  id: string;
  asset_id: string;
  asset_name: string;
  category: string;
  purchase_date: string;
  value: number;
  condition: string;
  last_maintenance: string | null;
  next_maintenance: string | null;
  warranty_month: number | null;
  warranty_year: number | null;
};


const AdminDataTables = () => {
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // State for floor occupancy data
  const [floorData, setFloorData] = useState<FloorOccupancy[]>([]);
  const [parkingAllocations, setParkingAllocations] = useState<ParkingAllocation[]>([]);
  const [parkingStats, setParkingStats] = useState<ParkingStatistics | null>(null);
  
  // State for maintenance data
  const [maintenanceData, setMaintenanceData] = useState<MaintenanceRepair[]>([]);
  const [tenantsList, setTenantsList] = useState<string[]>([]);
  
  // State for utilities data
  const [utilitiesData, setUtilitiesData] = useState<Utility[]>([]);
  
  // State for feedback & complaints data
  const [feedbackData, setFeedbackData] = useState<FeedbackComplaint[]>([]);
  const [tenants, setTenants] = useState<Array<{id: string, name: string}>>([]);
  
  // State for revenue & expenses data
  const [revenueExpenseData, setRevenueExpenseData] = useState<RevenueExpense[]>([]);
  
  // State for asset inventory data
  const [assetInventoryData, setAssetInventoryData] = useState<AssetInventory[]>([]);
  
  
  // Dialog states
  const [isFloorDialogOpen, setIsFloorDialogOpen] = useState(false);
  const [isParkingDialogOpen, setIsParkingDialogOpen] = useState(false);
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
  const [isUtilitiesDialogOpen, setIsUtilitiesDialogOpen] = useState(false);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [isFeedbackViewDialogOpen, setIsFeedbackViewDialogOpen] = useState(false);
  const [isRevenueExpenseDialogOpen, setIsRevenueExpenseDialogOpen] = useState(false);
  const [isRevenueExpenseViewDialogOpen, setIsRevenueExpenseViewDialogOpen] = useState(false);
  const [isAssetInventoryDialogOpen, setIsAssetInventoryDialogOpen] = useState(false);
  const [isAssetInventoryViewDialogOpen, setIsAssetInventoryViewDialogOpen] = useState(false);
  
  
  const [isDropdownConfigOpen, setIsDropdownConfigOpen] = useState(false);
  const [isUtilitiesDropdownConfigOpen, setIsUtilitiesDropdownConfigOpen] = useState(false);
  const [isFeedbackDropdownConfigOpen, setIsFeedbackDropdownConfigOpen] = useState(false);
  const [isRevenueExpenseDropdownConfigOpen, setIsRevenueExpenseDropdownConfigOpen] = useState(false);
  const [isAssetInventoryDropdownConfigOpen, setIsAssetInventoryDropdownConfigOpen] = useState(false);
  const [editingFloor, setEditingFloor] = useState<FloorOccupancy | null>(null);
  const [editingParking, setEditingParking] = useState<ParkingAllocation | null>(null);
  const [editingMaintenance, setEditingMaintenance] = useState<MaintenanceRepair | null>(null);
  const [editingUtility, setEditingUtility] = useState<Utility | null>(null);
  const [editingFeedback, setEditingFeedback] = useState<FeedbackComplaint | null>(null);
  const [viewingFeedback, setViewingFeedback] = useState<FeedbackComplaint | null>(null);
  const [editingRevenueExpense, setEditingRevenueExpense] = useState<RevenueExpense | null>(null);
  const [viewingRevenueExpense, setViewingRevenueExpense] = useState<RevenueExpense | null>(null);
  const [editingAssetInventory, setEditingAssetInventory] = useState<AssetInventory | null>(null);
  const [viewingAssetInventory, setViewingAssetInventory] = useState<AssetInventory | null>(null);
  
  
  
  // Form states
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

  // Dropdown options state
  const [dropdownOptions, setDropdownOptions] = useState({
    issueReporter: ["Maintenance Team", "Building Supervisor", "Other"],
    issueType: ["HVAC", "Plumbing", "Electrical", "Structural", "Cleaning", "Security", "IT/Technology", "Other"],
    materialAffected: ["Walls", "Flooring", "Ceiling", "Windows", "Doors", "Fixtures", "Equipment", "Systems", "Other"],
    assignedVendor: ["Cool Air Systems", "Quick Fix Plumbing", "Bright Electric", "Structural Solutions", "Clean Pro", "SecureTech", "Other"],
    status: ["Reported", "In Progress", "Pending", "Completed", "Cancelled"],
    floor: ["G", "1", "2", "3", "4", "5", "6", "7", "8", "B"]
  });

  // Utilities dropdown options state
  const [utilitiesDropdownOptions, setUtilitiesDropdownOptions] = useState({
    type: ["Electricity", "Water", "Gas", "Internet"]
  });

  // Feedback & Complaints dropdown options state
  const [feedbackDropdownOptions, setFeedbackDropdownOptions] = useState({
    type: ["Complaint", "Feedback", "Suggestion"],
    category: ["Maintenance", "Billing", "Security", "Amenities", "Noise", "Parking", "Cleanliness", "Staff", "Other"],
    status: ["In Progress", "Under Review", "Closed"],
    assigned_to: ["Building Manager", "Maintenance Team", "Security", "Admin", "Customer Service"]
  });

  // Revenue & Expenses dropdown options state
  const [revenueExpenseDropdownOptions, setRevenueExpenseDropdownOptions] = useState({
    type: ["Revenue", "Expense"],
    revenueCategories: ["Rent Income", "Parking Fees", "Utility Reimbursements", "Late Fees", "Other Income"],
    expenseCategories: ["Maintenance", "Utilities", "Insurance", "Property Tax", "Management Fees", "Marketing", "Legal Fees", "Office Supplies", "Other Expenses"]
  });

  // Asset Inventory dropdown options state
  const [assetInventoryDropdownOptions, setAssetInventoryDropdownOptions] = useState({
    category: ["Furniture", "Electronics", "HVAC Equipment", "Office Equipment", "Security Systems", "Maintenance Tools", "Other"],
    condition: ["Excellent", "Good", "Needs Repairment", "Needs Replacement"]
  });

  // Temp dropdown options for editing
  const [tempDropdownOptions, setTempDropdownOptions] = useState(dropdownOptions);
  const [tempUtilitiesDropdownOptions, setTempUtilitiesDropdownOptions] = useState(utilitiesDropdownOptions);
  const [tempFeedbackDropdownOptions, setTempFeedbackDropdownOptions] = useState(feedbackDropdownOptions);
  const [tempRevenueExpenseDropdownOptions, setTempRevenueExpenseDropdownOptions] = useState(revenueExpenseDropdownOptions);
  const [tempAssetInventoryDropdownOptions, setTempAssetInventoryDropdownOptions] = useState(assetInventoryDropdownOptions);

  const tables = [
    { value: "tenantsManagement", label: "Tenants Management (Live)" },
    { value: "leaseAgreements", label: "Lease Agreements Table" },
    { value: "rentPaymentsLive", label: "Rent Payments (Live)" },
    { value: "occupancy", label: "Occupancy Table" },
    { value: "maintenance", label: "Maintenance & Repairs Table" },
    { value: "utilities", label: "Utilities Table" },
    { value: "feedback", label: "Feedback & Complaints Table" },
    { value: "revenue", label: "Revenue & Expenses Table" },
    { value: "assets", label: "Asset Inventory Table" },
    
  ];

  // Fetch data functions
  const fetchFloorData = async () => {
    const { data, error } = await supabase
      .from('floor_occupancy')
      .select('*')
      .order('floor');
    
    if (error) {
      toast.error('Failed to fetch floor data');
      return;
    }
    
    setFloorData(data || []);
  };

  const fetchParkingAllocations = async () => {
    const { data, error } = await supabase
      .from('parking_allocations')
      .select('*')
      .order('company');
    
    if (error) {
      toast.error('Failed to fetch parking allocations');
      return;
    }
    
    setParkingAllocations(data || []);
  };

  const fetchParkingStats = async () => {
    const { data, error } = await supabase
      .from('parking_statistics')
      .select('*')
      .single();
    
    if (error) {
      console.error('Failed to fetch parking stats:', error);
      return;
    }
    
    setParkingStats(data);
  };

  // Fetch maintenance data functions
  const fetchMaintenanceData = async () => {
    const { data, error } = await supabase
      .from('maintenance_repairs')
      .select('*')
      .order('date_reported', { ascending: false });
    
    if (error) {
      toast.error('Failed to fetch maintenance data');
      return;
    }
    
    setMaintenanceData(data || []);
  };

  const fetchTenantsList = async () => {
    const { data, error } = await supabase
      .from('tenants')
      .select('name')
      .order('name');
    
    if (error) {
      console.error('Failed to fetch tenants list:', error);
      return;
    }
    
    setTenantsList(data?.map(tenant => tenant.name) || []);
  };

  // Fetch utilities data
  const fetchUtilitiesData = async () => {
    const { data, error } = await supabase
      .from('utilities')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      toast.error('Failed to fetch utilities data');
      return;
    }
    
    setUtilitiesData(data || []);
  };

  // Fetch feedback & complaints data
  const fetchFeedbackData = async () => {
    const { data, error } = await supabase
      .from('feedback_complaints')
      .select(`
        *,
        tenants!feedback_complaints_tenant_id_fkey(name)
      `)
      .order('date', { ascending: false });
    
    if (error) {
      toast.error('Failed to fetch feedback & complaints data');
      return;
    }
    
    const formattedData = data?.map(item => ({
      ...item,
      tenant_name: item.tenants?.name || 'N/A'
    })) || [];
    
    setFeedbackData(formattedData);
  };

  // Fetch tenants for dropdown
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

  // Fetch revenue & expenses data
  const fetchRevenueExpenseData = async () => {
    const { data, error } = await supabase
      .from('revenue_expenses')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      toast.error('Failed to fetch revenue & expenses data');
      return;
    }
    
    setRevenueExpenseData(data || []);
  };

  // Fetch asset inventory data
  const fetchAssetInventoryData = async () => {
    const { data, error } = await supabase
      .from('asset_inventory')
      .select('*')
      .order('purchase_date', { ascending: false });
    
    if (error) {
      toast.error('Failed to fetch asset inventory data');
      return;
    }
    
    setAssetInventoryData(data || []);
  };
  

  useEffect(() => {
    if (selectedTable === 'occupancy') {
      fetchFloorData();
      fetchParkingAllocations();
      fetchParkingStats();
    } else if (selectedTable === 'maintenance') {
      fetchMaintenanceData();
      fetchTenantsList();
    } else if (selectedTable === 'utilities') {
      fetchUtilitiesData();
    } else if (selectedTable === 'feedback') {
      fetchFeedbackData();
      fetchTenants();
    } else if (selectedTable === 'revenue') {
      fetchRevenueExpenseData();
    } else if (selectedTable === 'assets') {
      fetchAssetInventoryData();
    }
  }, [selectedTable]);


  // CRUD functions for floor occupancy
  const handleFloorSubmit = async () => {
    if (editingFloor) {
      // Update existing floor
      const { error } = await supabase
        .from('floor_occupancy')
        .update(floorForm)
        .eq('id', editingFloor.id);
      
      if (error) {
        toast.error('Failed to update floor data');
        return;
      }
      
      toast.success('Floor data updated successfully');
    } else {
      // Create new floor
      const { error } = await supabase
        .from('floor_occupancy')
        .insert([floorForm]);
      
      if (error) {
        toast.error('Failed to create floor data');
        return;
      }
      
      toast.success('Floor data created successfully');
    }
    
    setIsFloorDialogOpen(false);
    setEditingFloor(null);
    setFloorForm({ floor: "", type: "", square_meters_available: 0, square_meters_occupied: 0 });
    fetchFloorData();
  };

  const handleFloorEdit = (floor: FloorOccupancy) => {
    setEditingFloor(floor);
    setFloorForm({
      floor: floor.floor,
      type: floor.type,
      square_meters_available: floor.square_meters_available,
      square_meters_occupied: floor.square_meters_occupied
    });
    setIsFloorDialogOpen(true);
  };

  const handleFloorDelete = async (id: string) => {
    const { error } = await supabase
      .from('floor_occupancy')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to delete floor data');
      return;
    }
    
    toast.success('Floor data deleted successfully');
    fetchFloorData();
  };

  // CRUD functions for parking allocations
  const handleParkingSubmit = async () => {
    if (editingParking) {
      // Update existing parking allocation
      const { error } = await supabase
        .from('parking_allocations')
        .update(parkingForm)
        .eq('id', editingParking.id);
      
      if (error) {
        toast.error('Failed to update parking allocation');
        return;
      }
      
      toast.success('Parking allocation updated successfully');
    } else {
      // Create new parking allocation
      const { error } = await supabase
        .from('parking_allocations')
        .insert([parkingForm]);
      
      if (error) {
        toast.error('Failed to create parking allocation');
        return;
      }
      
      toast.success('Parking allocation created successfully');
    }
    
    setIsParkingDialogOpen(false);
    setEditingParking(null);
    setParkingForm({ company: "", spots_allowed: 0 });
    fetchParkingAllocations();
  };

  const handleParkingEdit = (parking: ParkingAllocation) => {
    setEditingParking(parking);
    setParkingForm({
      company: parking.company,
      spots_allowed: parking.spots_allowed
    });
    setIsParkingDialogOpen(true);
  };

  const handleParkingDelete = async (id: string) => {
    const { error } = await supabase
      .from('parking_allocations')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to delete parking allocation');
      return;
    }
    
    toast.success('Parking allocation deleted successfully');
    fetchParkingAllocations();
  };

  // Update parking statistics
  const updateParkingStats = async (field: 'spots_available' | 'spots_occupied', value: number) => {
    if (!parkingStats) return;
    
    const { error } = await supabase
      .from('parking_statistics')
      .update({ [field]: value })
      .eq('id', parkingStats.id);
    
    if (error) {
      toast.error('Failed to update parking statistics');
      return;
    }
    
    setParkingStats({ ...parkingStats, [field]: value });
    toast.success('Parking statistics updated');
  };

  // CRUD functions for maintenance repairs
  const handleMaintenanceSubmit = async () => {
    if (editingMaintenance) {
      // Update existing maintenance
      const { error } = await supabase
        .from('maintenance_repairs')
        .update(maintenanceForm)
        .eq('id', editingMaintenance.id);
      
      if (error) {
        toast.error('Failed to update maintenance record');
        return;
      }
      
      toast.success('Maintenance record updated successfully');
    } else {
      // Create new maintenance
      const { error } = await supabase
        .from('maintenance_repairs')
        .insert([maintenanceForm]);
      
      if (error) {
        toast.error('Failed to create maintenance record');
        return;
      }
      
      toast.success('Maintenance record created successfully');
    }
    
    setIsMaintenanceDialogOpen(false);
    setEditingMaintenance(null);
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
    fetchMaintenanceData();
  };

  const handleMaintenanceEdit = (maintenance: MaintenanceRepair) => {
    setEditingMaintenance(maintenance);
    setMaintenanceForm({
      date_reported: maintenance.date_reported,
      floor: maintenance.floor,
      issue_reporter: maintenance.issue_reporter,
      issue_type: maintenance.issue_type,
      material_affected: maintenance.material_affected,
      description: maintenance.description,
      assigned_vendor: maintenance.assigned_vendor || "",
      cost: maintenance.cost,
      status: maintenance.status
    });
    setIsMaintenanceDialogOpen(true);
  };

  const handleMaintenanceDelete = async (id: string) => {
    const { error } = await supabase
      .from('maintenance_repairs')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to delete maintenance record');
      return;
    }
    
    toast.success('Maintenance record deleted successfully');
    fetchMaintenanceData();
  };

  // CRUD functions for utilities
  const handleUtilitiesSubmit = async () => {
    if (editingUtility) {
      // Update existing utility
      const { error } = await supabase
        .from('utilities')
        .update(utilitiesForm)
        .eq('id', editingUtility.id);
      
      if (error) {
        toast.error('Failed to update utility record');
        return;
      }
      
      toast.success('Utility record updated successfully');
    } else {
      // Create new utility
      const { error } = await supabase
        .from('utilities')
        .insert([utilitiesForm]);
      
      if (error) {
        toast.error('Failed to create utility record');
        return;
      }
      
      toast.success('Utility record created successfully');
    }
    
    setIsUtilitiesDialogOpen(false);
    setEditingUtility(null);
    setUtilitiesForm({
      date: new Date().toISOString().split('T')[0],
      type: "",
      amount: 0
    });
    fetchUtilitiesData();
  };

  const handleUtilitiesEdit = (utility: Utility) => {
    setEditingUtility(utility);
    setUtilitiesForm({
      date: utility.date,
      type: utility.type,
      amount: utility.amount
    });
    setIsUtilitiesDialogOpen(true);
  };

  const handleUtilitiesDelete = async (id: string) => {
    const { error } = await supabase
      .from('utilities')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to delete utility record');
      return;
    }
    
    toast.success('Utility record deleted successfully');
    fetchUtilitiesData();
  };

  // CRUD functions for feedback & complaints
  const handleFeedbackSubmit = async () => {
    if (editingFeedback) {
      // Update existing feedback
      const { error } = await supabase
        .from('feedback_complaints')
        .update({
          date: feedbackForm.date,
          tenant_id: feedbackForm.tenant_id === "none" ? null : feedbackForm.tenant_id,
          type: feedbackForm.type,
          category: feedbackForm.category,
          description: feedbackForm.description,
          status: feedbackForm.status,
          assigned_to: feedbackForm.assigned_to === "unassigned" ? null : feedbackForm.assigned_to
        })
        .eq('id', editingFeedback.id);
      
      if (error) {
        toast.error('Failed to update feedback record');
        return;
      }
      
      toast.success('Feedback record updated successfully');
    } else {
      // Create new feedback
      const { error } = await supabase
        .from('feedback_complaints')
        .insert([{
          date: feedbackForm.date,
          tenant_id: feedbackForm.tenant_id === "none" ? null : feedbackForm.tenant_id,
          type: feedbackForm.type,
          category: feedbackForm.category,
          description: feedbackForm.description,
          status: feedbackForm.status,
          assigned_to: feedbackForm.assigned_to === "unassigned" ? null : feedbackForm.assigned_to
        }]);
      
      if (error) {
        toast.error('Failed to create feedback record');
        return;
      }
      
      toast.success('Feedback record created successfully');
    }
    
    setIsFeedbackDialogOpen(false);
    setEditingFeedback(null);
    setFeedbackForm({
      date: new Date().toISOString().split('T')[0],
      tenant_id: "none",
      type: "",
      category: "",
      description: "",
      status: "Under Review",
      assigned_to: "unassigned"
    });
    fetchFeedbackData();
  };

  const handleFeedbackEdit = (feedback: FeedbackComplaint) => {
    setEditingFeedback(feedback);
    setFeedbackForm({
      date: feedback.date,
      tenant_id: feedback.tenant_id || "none",
      type: feedback.type,
      category: feedback.category,
      description: feedback.description,
      status: feedback.status,
      assigned_to: feedback.assigned_to || "unassigned"
    });
    setIsFeedbackDialogOpen(true);
  };

  const handleFeedbackDelete = async (id: string) => {
    const { error } = await supabase
      .from('feedback_complaints')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to delete feedback record');
      return;
    }
    
    toast.success('Feedback record deleted successfully');
    fetchFeedbackData();
  };

  const handleFeedbackView = (feedback: FeedbackComplaint) => {
    setViewingFeedback(feedback);
    setIsFeedbackViewDialogOpen(true);
  };

  // CRUD functions for revenue & expenses
  const handleRevenueExpenseSubmit = async () => {
    if (editingRevenueExpense) {
      // Update existing revenue/expense
      const { error } = await supabase
        .from('revenue_expenses')
        .update(revenueExpenseForm)
        .eq('id', editingRevenueExpense.id);
      
      if (error) {
        toast.error('Failed to update revenue/expense record');
        return;
      }
      
      toast.success('Revenue/expense record updated successfully');
    } else {
      // Create new revenue/expense
      const { error } = await supabase
        .from('revenue_expenses')
        .insert([revenueExpenseForm]);
      
      if (error) {
        toast.error('Failed to create revenue/expense record');
        return;
      }
      
      toast.success('Revenue/expense record created successfully');
    }
    
    setIsRevenueExpenseDialogOpen(false);
    setEditingRevenueExpense(null);
    setRevenueExpenseForm({
      date: new Date().toISOString().split('T')[0],
      type: "",
      category: "",
      description: "",
      amount: 0
    });
    fetchRevenueExpenseData();
  };

  const handleRevenueExpenseEdit = (revenueExpense: RevenueExpense) => {
    setEditingRevenueExpense(revenueExpense);
    setRevenueExpenseForm({
      date: revenueExpense.date,
      type: revenueExpense.type,
      category: revenueExpense.category,
      description: revenueExpense.description,
      amount: revenueExpense.amount
    });
    setIsRevenueExpenseDialogOpen(true);
  };

  const handleRevenueExpenseDelete = async (id: string) => {
    const { error } = await supabase
      .from('revenue_expenses')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to delete revenue/expense record');
      return;
    }
    
    toast.success('Revenue/expense record deleted successfully');
    fetchRevenueExpenseData();
  };

  const handleRevenueExpenseView = (revenueExpense: RevenueExpense) => {
    setViewingRevenueExpense(revenueExpense);
    setIsRevenueExpenseViewDialogOpen(true);
  };

  // CRUD functions for asset inventory
  const handleAssetInventorySubmit = async () => {
    const formData = {
      asset_name: assetInventoryForm.asset_name,
      category: assetInventoryForm.category,
      purchase_date: assetInventoryForm.purchase_date,
      value: Number(assetInventoryForm.value),
      condition: assetInventoryForm.condition,
      last_maintenance: assetInventoryForm.last_maintenance || null,
      next_maintenance: assetInventoryForm.next_maintenance || null,
      warranty_month: assetInventoryForm.warranty_month ? Number(assetInventoryForm.warranty_month) : null,
      warranty_year: assetInventoryForm.warranty_year ? Number(assetInventoryForm.warranty_year) : null
    };

    if (editingAssetInventory) {
      // Update existing asset
      const { error } = await supabase
        .from('asset_inventory')
        .update(formData)
        .eq('id', editingAssetInventory.id);
      
      if (error) {
        toast.error('Failed to update asset');
        return;
      }
      
      toast.success('Asset updated successfully');
    } else {
      // Create new asset
      const { error } = await supabase
        .from('asset_inventory')
        .insert([formData]);
      
      if (error) {
        toast.error('Failed to add asset');
        return;
      }
      
      toast.success('Asset added successfully');
    }
    
    setIsAssetInventoryDialogOpen(false);
    setEditingAssetInventory(null);
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
    fetchAssetInventoryData();
  };

  const handleAssetInventoryEdit = (asset: AssetInventory) => {
    setEditingAssetInventory(asset);
    setAssetInventoryForm({
      asset_name: asset.asset_name,
      category: asset.category,
      purchase_date: asset.purchase_date,
      value: asset.value,
      condition: asset.condition,
      last_maintenance: asset.last_maintenance || "",
      next_maintenance: asset.next_maintenance || "",
      warranty_month: asset.warranty_month?.toString() || "",
      warranty_year: asset.warranty_year?.toString() || ""
    });
    setIsAssetInventoryDialogOpen(true);
  };

  const handleAssetInventoryDelete = async (id: string) => {
    const { error } = await supabase
      .from('asset_inventory')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to delete asset');
      return;
    }
    
    toast.success('Asset deleted successfully');
    fetchAssetInventoryData();
  };

  const handleAssetInventoryView = (asset: AssetInventory) => {
    setViewingAssetInventory(asset);
    setIsAssetInventoryViewDialogOpen(true);
  };

  

  // Dropdown configuration functions
  const handleDropdownConfigSave = () => {
    setDropdownOptions(tempDropdownOptions);
    setIsDropdownConfigOpen(false);
    toast.success('Dropdown options updated successfully');
  };

  const handleDropdownConfigCancel = () => {
    setTempDropdownOptions(dropdownOptions);
    setIsDropdownConfigOpen(false);
  };

  // Utilities dropdown configuration functions
  const handleUtilitiesDropdownConfigSave = () => {
    setUtilitiesDropdownOptions(tempUtilitiesDropdownOptions);
    setIsUtilitiesDropdownConfigOpen(false);
    toast.success('Utilities dropdown options updated successfully');
  };

  const handleUtilitiesDropdownConfigCancel = () => {
    setTempUtilitiesDropdownOptions(utilitiesDropdownOptions);
    setIsUtilitiesDropdownConfigOpen(false);
  };

  // Feedback dropdown configuration functions
  const handleFeedbackDropdownConfigSave = () => {
    setFeedbackDropdownOptions(tempFeedbackDropdownOptions);
    setIsFeedbackDropdownConfigOpen(false);
    toast.success('Feedback dropdown options updated successfully');
  };

  const handleFeedbackDropdownConfigCancel = () => {
    setTempFeedbackDropdownOptions(feedbackDropdownOptions);
    setIsFeedbackDropdownConfigOpen(false);
  };

  // Revenue & Expenses dropdown configuration functions
  const handleRevenueExpenseDropdownConfigSave = () => {
    setRevenueExpenseDropdownOptions(tempRevenueExpenseDropdownOptions);
    setIsRevenueExpenseDropdownConfigOpen(false);
    toast.success('Revenue & Expenses dropdown options updated successfully');
  };

  const handleRevenueExpenseDropdownConfigCancel = () => {
    setTempRevenueExpenseDropdownOptions(revenueExpenseDropdownOptions);
    setIsRevenueExpenseDropdownConfigOpen(false);
  };

  // Asset Inventory dropdown configuration functions
  const handleAssetInventoryDropdownConfigSave = () => {
    setAssetInventoryDropdownOptions(tempAssetInventoryDropdownOptions);
    setIsAssetInventoryDropdownConfigOpen(false);
    toast.success('Asset Inventory dropdown options updated successfully');
  };

  const handleAssetInventoryDropdownConfigCancel = () => {
    setTempAssetInventoryDropdownOptions(assetInventoryDropdownOptions);
    setIsAssetInventoryDropdownConfigOpen(false);
  };

  const addDropdownOption = (category: string, newOption: string) => {
    if (newOption.trim() && !tempDropdownOptions[category as keyof typeof tempDropdownOptions].includes(newOption.trim())) {
      setTempDropdownOptions(prev => ({
        ...prev,
        [category]: [...prev[category as keyof typeof prev], newOption.trim()]
      }));
    }
  };

  const removeDropdownOption = (category: string, optionToRemove: string) => {
    setTempDropdownOptions(prev => ({
      ...prev,
      [category]: prev[category as keyof typeof prev].filter(option => option !== optionToRemove)
    }));
  };

  // Mock data for other tables
  const mockData = {
    maintenance: [
      {
        id: "M001",
        dateReported: "2024-08-05",
        floor: "5",
        issueType: "HVAC",
        description: "Air conditioning not cooling properly",
        assignedVendor: "Cool Air Systems",
        cost: "$850",
        status: "In Progress",
        completionDate: "-"
      },
      {
        id: "M002",
        dateReported: "2024-08-03",
        floor: "3",
        issueType: "Plumbing",
        description: "Leaky faucet in restroom",
        assignedVendor: "Quick Fix Plumbing",
        cost: "$120",
        status: "Completed",
        completionDate: "2024-08-04"
      },
      {
        id: "M003",
        dateReported: "2024-08-01",
        floor: "7",
        issueType: "Electrical",
        description: "Flickering lights in conference room",
        assignedVendor: "Bright Electric",
        cost: "$300",
        status: "Pending",
        completionDate: "-"
      }
    ],
    utilities: [
      {
        id: "U001",
        month: "July 2024",
        electricity: "$2,450",
        water: "$890",
        gas: "$320",
        internet: "$450",
        total: "$4,110",
        status: "Paid"
      },
      {
        id: "U002",
        month: "June 2024",
        electricity: "$2,200",
        water: "$820",
        gas: "$280",
        internet: "$450",
        total: "$3,750",
        status: "Paid"
      },
      {
        id: "U003",
        month: "May 2024",
        electricity: "$2,100",
        water: "$780",
        gas: "$250",
        internet: "$450",
        total: "$3,580",
        status: "Paid"
      }
    ],
    visitorTraffic: [
      {
        id: "V001",
        date: "2024-08-05",
        totalVisitors: 145,
        peakHour: "2:00 PM",
        averageStayTime: "2.5 hours",
        mostVisitedFloor: "Ground Floor",
        purpose: "Business Meetings"
      },
      {
        id: "V002",
        date: "2024-08-04",
        totalVisitors: 132,
        peakHour: "11:00 AM",
        averageStayTime: "1.8 hours",
        mostVisitedFloor: "5th Floor",
        purpose: "Consultations"
      },
      {
        id: "V003",
        date: "2024-08-03",
        totalVisitors: 98,
        peakHour: "3:00 PM",
        averageStayTime: "3.2 hours",
        mostVisitedFloor: "3rd Floor",
        purpose: "Training Sessions"
      }
    ],
    feedback: [
      {
        id: "F001",
        date: "2024-08-05",
        tenant: "ABC Corp",
        type: "Complaint",
        category: "Maintenance",
        description: "Elevator frequently breaks down",
        priority: "High",
        status: "In Progress",
        assignedTo: "Maintenance Team"
      },
      {
        id: "F002",
        date: "2024-08-04",
        tenant: "XYZ Ltd",
        type: "Suggestion",
        category: "Amenities",
        description: "Add more parking spaces",
        priority: "Medium",
        status: "Under Review",
        assignedTo: "Management"
      },
      {
        id: "F003",
        date: "2024-08-03",
        tenant: "Tech Solutions",
        type: "Compliment",
        category: "Service",
        description: "Excellent cleaning service",
        priority: "Low",
        status: "Closed",
        assignedTo: "Cleaning Team"
      }
    ],
    revenue: [
      {
        id: "R001",
        month: "July 2024",
        rentRevenue: "$45,000",
        parkingRevenue: "$3,200",
        eventRevenue: "$1,800",
        totalRevenue: "$50,000",
        expenses: "$18,500",
        netIncome: "$31,500",
        profitMargin: "63%"
      },
      {
        id: "R002",
        month: "June 2024",
        rentRevenue: "$44,500",
        parkingRevenue: "$3,100",
        eventRevenue: "$2,200",
        totalRevenue: "$49,800",
        expenses: "$17,800",
        netIncome: "$32,000",
        profitMargin: "64.3%"
      },
      {
        id: "R003",
        month: "May 2024",
        rentRevenue: "$43,800",
        parkingRevenue: "$2,900",
        eventRevenue: "$1,500",
        totalRevenue: "$48,200",
        expenses: "$16,900",
        netIncome: "$31,300",
        profitMargin: "64.9%"
      }
    ],
    assets: [
      {
        id: "A001",
        assetName: "HVAC System - Floor 5",
        category: "HVAC",
        purchaseDate: "2022-03-15",
        value: "$15,000",
        condition: "Good",
        lastMaintenance: "2024-07-15",
        nextMaintenance: "2024-10-15",
        warranty: "Active until 2025"
      },
      {
        id: "A002",
        assetName: "Elevator #1",
        category: "Transportation",
        purchaseDate: "2021-08-20",
        value: "$45,000",
        condition: "Needs Replacement",
        lastMaintenance: "2024-06-30",
        nextMaintenance: "2024-09-30",
        warranty: "Expired"
      },
      {
        id: "A003",
        assetName: "Security Camera System",
        category: "Security",
        purchaseDate: "2023-01-10",
        value: "$8,500",
        condition: "Excellent",
        lastMaintenance: "2024-08-01",
        nextMaintenance: "2024-11-01",
        warranty: "Active until 2026"
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'paid':
      case 'completed':
      case 'occupied':
      case 'resolved':
      case 'closed':
      case 'excellent':
        return 'bg-success text-success-foreground';
      case 'in progress':
      case 'open':
      case 'partial':
      case 'good':
        return 'bg-warning text-warning-foreground';
      case 'late':
      case 'pending':
      case 'vacant':
      case 'poor':
      case 'needs replacement':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const calculateOccupancyPercentage = (occupied: number, available: number) => {
    if (available === 0) return 0;
    return Math.round((occupied / available) * 100 * 10) / 10;
  };

  const renderTable = () => {
    if (!selectedTable) return null;

    // Handle live components separately
    if (selectedTable === 'tenantsManagement') {
      return <TenantsTable />;
    }
    if (selectedTable === 'leaseAgreements') {
      return <LeaseAgreementsTable />;
    }
    if (selectedTable === 'rentPaymentsLive') {
      return <RentPaymentsTable />;
    }

    if (selectedTable === 'occupancy') {
      const filteredFloorData = floorData.filter((item) =>
        Object.values(item).some(value =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

      return (
        <div className="space-y-6">
          {/* Main Occupancy Table for Floors 8-G */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Floor Occupancy (Floors 8-G)</h3>
              <Dialog open={isFloorDialogOpen} onOpenChange={setIsFloorDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default" size="sm" onClick={() => {
                    setEditingFloor(null);
                    setFloorForm({ floor: "", type: "", square_meters_available: 0, square_meters_occupied: 0 });
                  }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Entry
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingFloor ? 'Edit Floor' : 'Add Floor'}</DialogTitle>
                    <DialogDescription>
                      {editingFloor ? 'Update floor occupancy information' : 'Add new floor occupancy information'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="floor" className="text-right">Floor</Label>
                      <Input
                        id="floor"
                        value={floorForm.floor}
                        onChange={(e) => setFloorForm({ ...floorForm, floor: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">Type</Label>
                      <Input
                        id="type"
                        value={floorForm.type}
                        onChange={(e) => setFloorForm({ ...floorForm, type: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="available" className="text-right">Available (m²)</Label>
                      <Input
                        id="available"
                        type="number"
                        value={floorForm.square_meters_available}
                        onChange={(e) => setFloorForm({ ...floorForm, square_meters_available: parseInt(e.target.value) || 0 })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="occupied" className="text-right">Occupied (m²)</Label>
                      <Input
                        id="occupied"
                        type="number"
                        value={floorForm.square_meters_occupied}
                        onChange={(e) => setFloorForm({ ...floorForm, square_meters_occupied: parseInt(e.target.value) || 0 })}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleFloorSubmit}>
                      {editingFloor ? 'Update' : 'Create'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Floor</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Square Meters Available</TableHead>
                  <TableHead>Square Meters Occupied</TableHead>
                  <TableHead>Percentage of Occupancy</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFloorData.map((floor) => {
                  const occupancyPercentage = calculateOccupancyPercentage(floor.square_meters_occupied, floor.square_meters_available);
                  return (
                    <TableRow key={floor.id}>
                      <TableCell className="font-medium">{floor.floor}</TableCell>
                      <TableCell>{floor.type}</TableCell>
                      <TableCell>{floor.square_meters_available.toLocaleString()} m²</TableCell>
                      <TableCell>{floor.square_meters_occupied.toLocaleString()} m²</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{occupancyPercentage}%</span>
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all" 
                              style={{ width: `${occupancyPercentage}%` }} 
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleFloorEdit(floor)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleFloorDelete(floor.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* B Floor Companies Table */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">B Floor - Company Parking Allocations</h3>
              <Dialog open={isParkingDialogOpen} onOpenChange={setIsParkingDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default" size="sm" onClick={() => {
                    setEditingParking(null);
                    setParkingForm({ company: "", spots_allowed: 0 });
                  }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Entry
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingParking ? 'Edit Parking Allocation' : 'Add Parking Allocation'}</DialogTitle>
                    <DialogDescription>
                      {editingParking ? 'Update parking allocation information' : 'Add new parking allocation information'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="company" className="text-right">Company</Label>
                      <Input
                        id="company"
                        value={parkingForm.company}
                        onChange={(e) => setParkingForm({ ...parkingForm, company: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="spots" className="text-right">Spots Allowed</Label>
                      <Input
                        id="spots"
                        type="number"
                        value={parkingForm.spots_allowed}
                        onChange={(e) => setParkingForm({ ...parkingForm, spots_allowed: parseInt(e.target.value) || 0 })}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleParkingSubmit}>
                      {editingParking ? 'Update' : 'Create'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Spots Allowed</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parkingAllocations.map((parking) => (
                  <TableRow key={parking.id}>
                    <TableCell className="font-medium">{parking.company}</TableCell>
                    <TableCell>{parking.spots_allowed}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleParkingEdit(parking)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleParkingDelete(parking.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* B Floor Overall Statistics */}
          {parkingStats && (
            <div>
              <h3 className="text-lg font-semibold mb-4">B Floor - Overall Occupancy</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Spots Available</div>
                    <div className="text-2xl font-bold text-primary">
                      <Input 
                        type="number" 
                        value={parkingStats.spots_available} 
                        onChange={(e) => updateParkingStats('spots_available', parseInt(e.target.value) || 0)}
                        className="text-2xl font-bold border-none p-0 h-auto bg-transparent" 
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Spots Occupied</div>
                    <div className="text-2xl font-bold text-primary">
                      <Input 
                        type="number" 
                        value={parkingStats.spots_occupied} 
                        onChange={(e) => updateParkingStats('spots_occupied', parseInt(e.target.value) || 0)}
                        className="text-2xl font-bold border-none p-0 h-auto bg-transparent" 
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Occupancy Percentage</div>
                    <div className="text-2xl font-bold text-primary">
                      {calculateOccupancyPercentage(parkingStats.spots_occupied, parkingStats.spots_available)}%
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-2">
                      <div 
                        className="h-full bg-primary rounded-full transition-all" 
                        style={{ 
                          width: `${calculateOccupancyPercentage(parkingStats.spots_occupied, parkingStats.spots_available)}%` 
                        }} 
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    
    // Handle other mock tables
    const data = mockData[selectedTable as keyof typeof mockData];
    if (!data) return null;

    const filteredData = data.filter((item: any) =>
      Object.values(item).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    // Handle maintenance table with real backend
    if (selectedTable === 'maintenance') {
      const filteredMaintenanceData = maintenanceData.filter((item) =>
        Object.values(item).some(value =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

      return (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Maintenance & Repairs</h3>
            <div className="flex gap-2">
              <Dialog open={isDropdownConfigOpen} onOpenChange={setIsDropdownConfigOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => setTempDropdownOptions(dropdownOptions)}>
                    Configure Dropdowns
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Configure Dropdown Options</DialogTitle>
                    <DialogDescription>
                      Manage the dropdown options for maintenance form fields
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    {Object.entries(tempDropdownOptions).map(([category, options]) => (
                      <div key={category} className="space-y-3">
                        <h4 className="font-semibold capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</h4>
                        <div className="flex flex-wrap gap-2">
                          {options.map((option, index) => (
                            <div key={index} className="flex items-center gap-2 bg-secondary px-2 py-1 rounded">
                              <span className="text-sm">{option}</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-4 w-4 p-0"
                                onClick={() => removeDropdownOption(category, option)}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder={`Add new ${category.replace(/([A-Z])/g, ' $1').toLowerCase()} option`}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                addDropdownOption(category, e.currentTarget.value);
                                e.currentTarget.value = '';
                              }
                            }}
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                              addDropdownOption(category, input.value);
                              input.value = '';
                            }}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={handleDropdownConfigCancel}>
                      Cancel
                    </Button>
                    <Button onClick={handleDropdownConfigSave}>
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <Dialog open={isMaintenanceDialogOpen} onOpenChange={setIsMaintenanceDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default" size="sm" onClick={() => {
                  setEditingMaintenance(null);
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
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingMaintenance ? 'Edit Maintenance Record' : 'Add Maintenance Record'}</DialogTitle>
                  <DialogDescription>
                    {editingMaintenance ? 'Update maintenance record information' : 'Add new maintenance record information'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date_reported">Date Reported</Label>
                      <Input
                        id="date_reported"
                        type="date"
                        value={maintenanceForm.date_reported}
                        onChange={(e) => setMaintenanceForm({ ...maintenanceForm, date_reported: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="floor">Floor</Label>
                      <Select value={maintenanceForm.floor} onValueChange={(value) => setMaintenanceForm({ ...maintenanceForm, floor: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select floor" />
                        </SelectTrigger>
                        <SelectContent>
                          {dropdownOptions.floor.map((floor) => (
                            <SelectItem key={floor} value={floor}>{floor}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="issue_reporter">Issue Reporter</Label>
                      <Select value={maintenanceForm.issue_reporter} onValueChange={(value) => setMaintenanceForm({ ...maintenanceForm, issue_reporter: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reporter" />
                        </SelectTrigger>
                        <SelectContent>
                          {dropdownOptions.issueReporter.map((reporter) => (
                            <SelectItem key={reporter} value={reporter}>{reporter}</SelectItem>
                          ))}
                          {tenantsList.map((tenant) => (
                            <SelectItem key={tenant} value={tenant}>{tenant}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="issue_type">Issue Type</Label>
                      <Select value={maintenanceForm.issue_type} onValueChange={(value) => setMaintenanceForm({ ...maintenanceForm, issue_type: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select issue type" />
                        </SelectTrigger>
                        <SelectContent>
                          {dropdownOptions.issueType.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="material_affected">Material Affected</Label>
                      <Select value={maintenanceForm.material_affected} onValueChange={(value) => setMaintenanceForm({ ...maintenanceForm, material_affected: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select material" />
                        </SelectTrigger>
                        <SelectContent>
                          {dropdownOptions.materialAffected.map((material) => (
                            <SelectItem key={material} value={material}>{material}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assigned_vendor">Assigned Vendor</Label>
                      <Select value={maintenanceForm.assigned_vendor} onValueChange={(value) => setMaintenanceForm({ ...maintenanceForm, assigned_vendor: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vendor" />
                        </SelectTrigger>
                        <SelectContent>
                          {dropdownOptions.assignedVendor.map((vendor) => (
                            <SelectItem key={vendor} value={vendor}>{vendor}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={maintenanceForm.description}
                      onChange={(e) => setMaintenanceForm({ ...maintenanceForm, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cost">Cost</Label>
                      <Input
                        id="cost"
                        type="number"
                        value={maintenanceForm.cost}
                        onChange={(e) => setMaintenanceForm({ ...maintenanceForm, cost: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={maintenanceForm.status} onValueChange={(value) => setMaintenanceForm({ ...maintenanceForm, status: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {dropdownOptions.status.map((status) => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleMaintenanceSubmit}>
                    {editingMaintenance ? 'Update' : 'Create'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date Reported</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Issue Reporter</TableHead>
                <TableHead>Issue Type</TableHead>
                <TableHead>Material Affected</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Assigned Vendor</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Completion Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaintenanceData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id.slice(0, 8)}...</TableCell>
                  <TableCell>{new Date(item.date_reported).toLocaleDateString()}</TableCell>
                  <TableCell>{item.floor}</TableCell>
                  <TableCell>{item.issue_reporter}</TableCell>
                  <TableCell>{item.issue_type}</TableCell>
                  <TableCell>{item.material_affected}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                  <TableCell>{item.assigned_vendor || '-'}</TableCell>
                  <TableCell>${item.cost.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.completion_date ? new Date(item.completion_date).toLocaleDateString() : '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleMaintenanceEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleMaintenanceDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    }

    if (selectedTable === 'utilities') {
      const filteredUtilities = utilitiesData.filter((utility) =>
        utility.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        utility.date.includes(searchTerm.toLowerCase()) ||
        utility.amount.toString().includes(searchTerm.toLowerCase())
      );

      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Utilities Records</h3>
            <div className="flex gap-2">
              <Dialog open={isUtilitiesDropdownConfigOpen} onOpenChange={setIsUtilitiesDropdownConfigOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => setTempUtilitiesDropdownOptions(utilitiesDropdownOptions)}>
                    Configure Dropdowns
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Configure Utilities Dropdown Options</DialogTitle>
                    <DialogDescription>
                      Manage the available options for utility types.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Utility Types</Label>
                      <div className="space-y-2">
                        {tempUtilitiesDropdownOptions.type.map((option, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm">{option}</span>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                setTempUtilitiesDropdownOptions(prev => ({
                                  ...prev,
                                  type: prev.type.filter(item => item !== option)
                                }));
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Add new utility type"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                const newOption = e.currentTarget.value.trim();
                                if (newOption && !tempUtilitiesDropdownOptions.type.includes(newOption)) {
                                  setTempUtilitiesDropdownOptions(prev => ({
                                    ...prev,
                                    type: [...prev.type, newOption]
                                  }));
                                  e.currentTarget.value = '';
                                }
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={handleUtilitiesDropdownConfigCancel}>
                      Cancel
                    </Button>
                    <Button onClick={handleUtilitiesDropdownConfigSave}>
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog open={isUtilitiesDialogOpen} onOpenChange={setIsUtilitiesDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Entry
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingUtility ? 'Edit Utility Record' : 'Add New Utility Record'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={utilitiesForm.date}
                        onChange={(e) => setUtilitiesForm({ ...utilitiesForm, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select value={utilitiesForm.type} onValueChange={(value) => setUtilitiesForm({ ...utilitiesForm, type: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select utility type" />
                        </SelectTrigger>
                        <SelectContent>
                          {utilitiesDropdownOptions.type.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={utilitiesForm.amount}
                        onChange={(e) => setUtilitiesForm({ ...utilitiesForm, amount: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsUtilitiesDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUtilitiesSubmit}>
                      {editingUtility ? 'Update' : 'Create'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUtilities.map((utility) => (
                <TableRow key={utility.id}>
                  <TableCell className="font-medium">{utility.id}</TableCell>
                  <TableCell>{new Date(utility.date).toLocaleDateString()}</TableCell>
                  <TableCell>{utility.type}</TableCell>
                  <TableCell>${utility.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleUtilitiesEdit(utility)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleUtilitiesDelete(utility.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    }



    if (selectedTable === 'feedback') {
      const filteredFeedback = feedbackData.filter(feedback =>
        feedback.complaint_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.tenant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.assigned_to?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Feedback Entry
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingFeedback ? 'Edit' : 'Add'} Feedback & Complaint</DialogTitle>
                    <DialogDescription>
                      {editingFeedback ? 'Edit the feedback record' : 'Enter the feedback details below.'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="date" className="text-right">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={feedbackForm.date}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, date: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="tenant" className="text-right">Tenant</Label>
                      <Select value={feedbackForm.tenant_id} onValueChange={(value) => setFeedbackForm({ ...feedbackForm, tenant_id: value })}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select tenant" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None/Anonymous</SelectItem>
                          {tenants.map((tenant) => (
                            <SelectItem key={tenant.id} value={tenant.id}>
                              {tenant.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">Type</Label>
                      <Select value={feedbackForm.type} onValueChange={(value) => setFeedbackForm({ ...feedbackForm, type: value })}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {feedbackDropdownOptions.type.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="category" className="text-right">Category</Label>
                      <Select value={feedbackForm.category} onValueChange={(value) => setFeedbackForm({ ...feedbackForm, category: value })}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {feedbackDropdownOptions.category.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">Description</Label>
                      <Textarea
                        id="description"
                        value={feedbackForm.description}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, description: e.target.value })}
                        className="col-span-3"
                        placeholder="Enter description..."
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="status" className="text-right">Status</Label>
                      <Select value={feedbackForm.status} onValueChange={(value) => setFeedbackForm({ ...feedbackForm, status: value })}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {feedbackDropdownOptions.status.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="assigned_to" className="text-right">Assigned To</Label>
                      <Select value={feedbackForm.assigned_to} onValueChange={(value) => setFeedbackForm({ ...feedbackForm, assigned_to: value })}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {feedbackDropdownOptions.assigned_to.map((assignee) => (
                            <SelectItem key={assignee} value={assignee}>
                              {assignee}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleFeedbackSubmit}>
                      {editingFeedback ? 'Update' : 'Add'} Feedback
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isFeedbackDropdownConfigOpen} onOpenChange={setIsFeedbackDropdownConfigOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Configure Dropdowns</Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Configure Feedback Dropdown Options</DialogTitle>
                    <DialogDescription>
                      Manage the dropdown options for feedback & complaints.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    {Object.entries(tempFeedbackDropdownOptions).map(([category, options]) => (
                      <div key={category} className="space-y-2">
                        <Label className="text-sm font-medium capitalize">{category.replace('_', ' ')}</Label>
                        <div className="flex flex-wrap gap-2">
                          {options.map((option, index) => (
                            <div key={index} className="flex items-center bg-secondary rounded-md px-3 py-1">
                              <span className="text-sm">{option}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="ml-2 h-4 w-4 p-0"
                                onClick={() => {
                                  const newOptions = { ...tempFeedbackDropdownOptions };
                                  newOptions[category as keyof typeof newOptions] = newOptions[category as keyof typeof newOptions].filter((_, i) => i !== index);
                                  setTempFeedbackDropdownOptions(newOptions);
                                }}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder={`Add new ${category.replace('_', ' ')}`}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const input = e.target as HTMLInputElement;
                                if (input.value.trim()) {
                                  const newOptions = { ...tempFeedbackDropdownOptions };
                                  if (!newOptions[category as keyof typeof newOptions].includes(input.value.trim())) {
                                    newOptions[category as keyof typeof newOptions] = [...newOptions[category as keyof typeof newOptions], input.value.trim()];
                                    setTempFeedbackDropdownOptions(newOptions);
                                  }
                                  input.value = '';
                                }
                              }
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={handleFeedbackDropdownConfigCancel}>Cancel</Button>
                    <Button onClick={handleFeedbackDropdownConfigSave}>Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFeedback.map((feedback) => (
                <TableRow key={feedback.id}>
                  <TableCell className="font-medium">{feedback.complaint_id}</TableCell>
                  <TableCell>{new Date(feedback.date).toLocaleDateString()}</TableCell>
                  <TableCell>{feedback.tenant_name}</TableCell>
                  <TableCell>
                    <Badge variant={feedback.type === 'Complaint' ? 'destructive' : feedback.type === 'Feedback' ? 'default' : 'secondary'}>
                      {feedback.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{feedback.category}</TableCell>
                  <TableCell className="max-w-xs truncate">{feedback.description}</TableCell>
                  <TableCell>
                    <Badge variant={feedback.status === 'Closed' ? 'default' : feedback.status === 'In Progress' ? 'secondary' : 'outline'}>
                      {feedback.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{feedback.assigned_to || 'Unassigned'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleFeedbackView(feedback)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleFeedbackEdit(feedback)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleFeedbackDelete(feedback.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* View Feedback Dialog */}
          <Dialog open={isFeedbackViewDialogOpen} onOpenChange={setIsFeedbackViewDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Feedback & Complaint Details</DialogTitle>
                <DialogDescription>
                  View complete details of the feedback/complaint record.
                </DialogDescription>
              </DialogHeader>
              {viewingFeedback && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">ID</Label>
                      <p className="text-sm font-mono">{viewingFeedback.complaint_id}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Date</Label>
                      <p className="text-sm">{new Date(viewingFeedback.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Tenant</Label>
                      <p className="text-sm">{viewingFeedback.tenant_name || 'Anonymous'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                      <Badge variant={viewingFeedback.type === 'Complaint' ? 'destructive' : viewingFeedback.type === 'Feedback' ? 'default' : 'secondary'}>
                        {viewingFeedback.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                      <p className="text-sm">{viewingFeedback.category}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                      <Badge variant={viewingFeedback.status === 'Closed' ? 'default' : viewingFeedback.status === 'In Progress' ? 'secondary' : 'outline'}>
                        {viewingFeedback.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Assigned To</Label>
                    <p className="text-sm">{viewingFeedback.assigned_to || 'Unassigned'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                    <div className="mt-1 p-3 bg-muted/50 rounded-md">
                      <p className="text-sm whitespace-pre-wrap">{viewingFeedback.description}</p>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsFeedbackViewDialogOpen(false)}>
                  Close
                </Button>
                {viewingFeedback && (
                  <Button onClick={() => {
                    setIsFeedbackViewDialogOpen(false);
                    handleFeedbackEdit(viewingFeedback);
                  }}>
                    Edit Record
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      );
    }


    if (selectedTable === 'revenue') {
      const filteredRevenueExpense = revenueExpenseData.filter(item =>
        item.revenue_expense_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const getCategories = () => {
        if (revenueExpenseForm.type === 'Revenue') {
          return revenueExpenseDropdownOptions.revenueCategories;
        } else if (revenueExpenseForm.type === 'Expense') {
          return revenueExpenseDropdownOptions.expenseCategories;
        }
        return [];
      };

      return (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Revenue & Expenses</h3>
            <div className="flex gap-2">
              <Dialog open={isRevenueExpenseDropdownConfigOpen} onOpenChange={setIsRevenueExpenseDropdownConfigOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Configure Dropdowns
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Configure Revenue & Expenses Dropdowns</DialogTitle>
                    <DialogDescription>
                      Manage the options available in dropdown menus for revenue and expense categories.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    {[
                      { key: 'type', label: 'Type Options' },
                      { key: 'revenueCategories', label: 'Revenue Categories' },
                      { key: 'expenseCategories', label: 'Expense Categories' }
                    ].map(({ key, label }) => (
                      <div key={key} className="space-y-3">
                        <Label className="text-sm font-medium">{label}</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {tempRevenueExpenseDropdownOptions[key as keyof typeof tempRevenueExpenseDropdownOptions].map((option: string) => (
                            <Badge key={option} variant="secondary" className="flex items-center gap-1">
                              {option}
                              <button
                                onClick={() => {
                                  setTempRevenueExpenseDropdownOptions(prev => ({
                                    ...prev,
                                    [key]: prev[key as keyof typeof prev].filter((item: string) => item !== option)
                                  }));
                                }}
                                className="ml-1 hover:text-destructive"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder={`Add new ${label.toLowerCase()}`}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const input = e.target as HTMLInputElement;
                                const newOption = input.value.trim();
                                if (newOption && !tempRevenueExpenseDropdownOptions[key as keyof typeof tempRevenueExpenseDropdownOptions].includes(newOption)) {
                                  setTempRevenueExpenseDropdownOptions(prev => ({
                                    ...prev,
                                    [key]: [...prev[key as keyof typeof prev], newOption]
                                  }));
                                  input.value = '';
                                }
                              }
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={handleRevenueExpenseDropdownConfigCancel}>Cancel</Button>
                    <Button onClick={handleRevenueExpenseDropdownConfigSave}>Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isRevenueExpenseDialogOpen} onOpenChange={setIsRevenueExpenseDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Entry
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingRevenueExpense ? 'Edit Revenue/Expense' : 'Add New Revenue/Expense'}</DialogTitle>
                    <DialogDescription>
                      {editingRevenueExpense ? 'Update the revenue/expense record details.' : 'Enter the details for the new revenue/expense record.'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={revenueExpenseForm.date}
                          onChange={(e) => setRevenueExpenseForm({...revenueExpenseForm, date: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Type</Label>
                        <Select value={revenueExpenseForm.type} onValueChange={(value) => setRevenueExpenseForm({...revenueExpenseForm, type: value, category: ""})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {revenueExpenseDropdownOptions.type.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={revenueExpenseForm.category} onValueChange={(value) => setRevenueExpenseForm({...revenueExpenseForm, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {getCategories().map((category) => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          value={revenueExpenseForm.amount}
                          onChange={(e) => setRevenueExpenseForm({...revenueExpenseForm, amount: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={revenueExpenseForm.description}
                        onChange={(e) => setRevenueExpenseForm({...revenueExpenseForm, description: e.target.value})}
                        placeholder="Enter description..."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsRevenueExpenseDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleRevenueExpenseSubmit}>
                      {editingRevenueExpense ? 'Update' : 'Create'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRevenueExpense.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.revenue_expense_id}</TableCell>
                  <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={item.type === 'Revenue' ? 'default' : 'secondary'}>
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                  <TableCell className={`font-medium ${item.type === 'Revenue' ? 'text-green-600' : 'text-red-600'}`}>
                    ${item.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleRevenueExpenseView(item)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleRevenueExpenseEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleRevenueExpenseDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* View Dialog */}
          <Dialog open={isRevenueExpenseViewDialogOpen} onOpenChange={setIsRevenueExpenseViewDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Revenue/Expense Details</DialogTitle>
                <DialogDescription>
                  Detailed view of the revenue/expense record.
                </DialogDescription>
              </DialogHeader>
              {viewingRevenueExpense && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">ID</Label>
                      <p className="text-sm font-mono">{viewingRevenueExpense.revenue_expense_id}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Date</Label>
                      <p className="text-sm">{new Date(viewingRevenueExpense.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                      <Badge variant={viewingRevenueExpense.type === 'Revenue' ? 'default' : 'secondary'}>
                        {viewingRevenueExpense.type}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                      <p className="text-sm">{viewingRevenueExpense.category}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Amount</Label>
                    <p className={`text-lg font-medium ${viewingRevenueExpense.type === 'Revenue' ? 'text-green-600' : 'text-red-600'}`}>
                      ${viewingRevenueExpense.amount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                    <div className="mt-1 p-3 bg-muted/50 rounded-md">
                      <p className="text-sm whitespace-pre-wrap">{viewingRevenueExpense.description}</p>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRevenueExpenseViewDialogOpen(false)}>
                  Close
                </Button>
                {viewingRevenueExpense && (
                  <Button onClick={() => {
                    setIsRevenueExpenseViewDialogOpen(false);
                    handleRevenueExpenseEdit(viewingRevenueExpense);
                  }}>
                    Edit Record
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      );
    }

    if (selectedTable === 'assets') {
      const filteredAssetInventory = assetInventoryData.filter(item =>
        item.asset_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.asset_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.condition.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const isWarrantyActive = (month: number | null, year: number | null) => {
        if (!month || !year) return false;
        const warrantyDate = new Date(year, month - 1); // month is 0-indexed in Date
        const currentDate = new Date();
        return warrantyDate >= currentDate;
      };

      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Asset Inventory</h3>
            <div className="flex gap-2">
              <Dialog open={isAssetInventoryDropdownConfigOpen} onOpenChange={setIsAssetInventoryDropdownConfigOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => setTempAssetInventoryDropdownOptions(assetInventoryDropdownOptions)}>
                    Configure Dropdowns
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Configure Asset Inventory Dropdowns</DialogTitle>
                    <DialogDescription>
                      Manage dropdown options for asset inventory fields
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Categories</Label>
                      {tempAssetInventoryDropdownOptions.category.map((option, index) => (
                        <div key={index} className="flex items-center gap-2 mt-2">
                          <Input
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...tempAssetInventoryDropdownOptions.category];
                              newOptions[index] = e.target.value;
                              setTempAssetInventoryDropdownOptions({
                                ...tempAssetInventoryDropdownOptions,
                                category: newOptions
                              });
                            }}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newOptions = tempAssetInventoryDropdownOptions.category.filter((_, i) => i !== index);
                              setTempAssetInventoryDropdownOptions({
                                ...tempAssetInventoryDropdownOptions,
                                category: newOptions
                              });
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          setTempAssetInventoryDropdownOptions({
                            ...tempAssetInventoryDropdownOptions,
                            category: [...tempAssetInventoryDropdownOptions.category, 'New Category']
                          });
                        }}
                      >
                        Add Category
                      </Button>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Conditions</Label>
                      {tempAssetInventoryDropdownOptions.condition.map((option, index) => (
                        <div key={index} className="flex items-center gap-2 mt-2">
                          <Input
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...tempAssetInventoryDropdownOptions.condition];
                              newOptions[index] = e.target.value;
                              setTempAssetInventoryDropdownOptions({
                                ...tempAssetInventoryDropdownOptions,
                                condition: newOptions
                              });
                            }}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newOptions = tempAssetInventoryDropdownOptions.condition.filter((_, i) => i !== index);
                              setTempAssetInventoryDropdownOptions({
                                ...tempAssetInventoryDropdownOptions,
                                condition: newOptions
                              });
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          setTempAssetInventoryDropdownOptions({
                            ...tempAssetInventoryDropdownOptions,
                            condition: [...tempAssetInventoryDropdownOptions.condition, 'New Condition']
                          });
                        }}
                      >
                        Add Condition
                      </Button>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={handleAssetInventoryDropdownConfigCancel}>Cancel</Button>
                    <Button onClick={handleAssetInventoryDropdownConfigSave}>Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isAssetInventoryDialogOpen} onOpenChange={setIsAssetInventoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingAssetInventory(null);
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
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Entry
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingAssetInventory ? 'Edit Asset' : 'Add Asset'}</DialogTitle>
                    <DialogDescription>
                      {editingAssetInventory ? 'Update asset information' : 'Add new asset to inventory'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="asset_name">Asset Name</Label>
                        <Input
                          id="asset_name"
                          value={assetInventoryForm.asset_name}
                          onChange={(e) => setAssetInventoryForm({ ...assetInventoryForm, asset_name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={assetInventoryForm.category}
                          onValueChange={(value) => setAssetInventoryForm({ ...assetInventoryForm, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {assetInventoryDropdownOptions.category.map((option) => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="purchase_date">Purchase Date</Label>
                        <Input
                          id="purchase_date"
                          type="date"
                          value={assetInventoryForm.purchase_date}
                          onChange={(e) => setAssetInventoryForm({ ...assetInventoryForm, purchase_date: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="value">Value</Label>
                        <Input
                          id="value"
                          type="number"
                          value={assetInventoryForm.value}
                          onChange={(e) => setAssetInventoryForm({ ...assetInventoryForm, value: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="condition">Condition</Label>
                      <Select
                        value={assetInventoryForm.condition}
                        onValueChange={(value) => setAssetInventoryForm({ ...assetInventoryForm, condition: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          {assetInventoryDropdownOptions.condition.map((option) => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="last_maintenance">Last Maintenance</Label>
                        <Input
                          id="last_maintenance"
                          type="date"
                          value={assetInventoryForm.last_maintenance}
                          onChange={(e) => setAssetInventoryForm({ ...assetInventoryForm, last_maintenance: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="next_maintenance">Next Maintenance</Label>
                        <Input
                          id="next_maintenance"
                          type="date"
                          value={assetInventoryForm.next_maintenance}
                          onChange={(e) => setAssetInventoryForm({ ...assetInventoryForm, next_maintenance: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="warranty_month">Warranty Month</Label>
                        <Input
                          id="warranty_month"
                          type="number"
                          min="1"
                          max="12"
                          placeholder="1-12"
                          value={assetInventoryForm.warranty_month}
                          onChange={(e) => setAssetInventoryForm({ ...assetInventoryForm, warranty_month: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="warranty_year">Warranty Year</Label>
                        <Input
                          id="warranty_year"
                          type="number"
                          min="2020"
                          max="2050"
                          placeholder="e.g., 2025"
                          value={assetInventoryForm.warranty_year}
                          onChange={(e) => setAssetInventoryForm({ ...assetInventoryForm, warranty_year: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAssetInventoryDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAssetInventorySubmit}>
                      {editingAssetInventory ? 'Update Asset' : 'Add Asset'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Asset Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Last Maintenance</TableHead>
                <TableHead>Next Maintenance</TableHead>
                <TableHead>Warranty</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssetInventory.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.asset_id}</TableCell>
                  <TableCell>{asset.asset_name}</TableCell>
                  <TableCell>{asset.category}</TableCell>
                  <TableCell>{new Date(asset.purchase_date).toLocaleDateString()}</TableCell>
                  <TableCell>${asset.value.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(asset.condition)}>
                      {asset.condition}
                    </Badge>
                  </TableCell>
                  <TableCell>{asset.last_maintenance ? new Date(asset.last_maintenance).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>{asset.next_maintenance ? new Date(asset.next_maintenance).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>
                    {asset.warranty_month && asset.warranty_year ? (
                      <span className={isWarrantyActive(asset.warranty_month, asset.warranty_year) ? 'text-green-600' : 'text-red-600'}>
                        {asset.warranty_month}/{asset.warranty_year}
                      </span>
                    ) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleAssetInventoryView(asset)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleAssetInventoryEdit(asset)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleAssetInventoryDelete(asset.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Dialog open={isAssetInventoryViewDialogOpen} onOpenChange={setIsAssetInventoryViewDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Asset Details</DialogTitle>
                <DialogDescription>Complete information for this asset</DialogDescription>
              </DialogHeader>
              {viewingAssetInventory && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">ID</Label>
                      <p className="font-medium">{viewingAssetInventory.asset_id}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Asset Name</Label>
                      <p>{viewingAssetInventory.asset_name}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                      <p>{viewingAssetInventory.category}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Condition</Label>
                      <Badge className={getStatusColor(viewingAssetInventory.condition)}>
                        {viewingAssetInventory.condition}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Purchase Date</Label>
                      <p>{new Date(viewingAssetInventory.purchase_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Value</Label>
                      <p>${viewingAssetInventory.value.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Last Maintenance</Label>
                      <p>{viewingAssetInventory.last_maintenance ? new Date(viewingAssetInventory.last_maintenance).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Next Maintenance</Label>
                      <p>{viewingAssetInventory.next_maintenance ? new Date(viewingAssetInventory.next_maintenance).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Warranty</Label>
                    {viewingAssetInventory.warranty_month && viewingAssetInventory.warranty_year ? (
                      <p className={isWarrantyActive(viewingAssetInventory.warranty_month, viewingAssetInventory.warranty_year) ? 'text-green-600' : 'text-red-600'}>
                        {viewingAssetInventory.warranty_month}/{viewingAssetInventory.warranty_year} 
                        {isWarrantyActive(viewingAssetInventory.warranty_month, viewingAssetInventory.warranty_year) ? ' (Active)' : ' (Expired)'}
                      </p>
                    ) : <p>No warranty information</p>}
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAssetInventoryViewDialogOpen(false)}>Close</Button>
                {viewingAssetInventory && (
                  <Button onClick={() => {
                    setIsAssetInventoryViewDialogOpen(false);
                    handleAssetInventoryEdit(viewingAssetInventory);
                  }}>
                    Edit Asset
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Tables</h1>
        <p className="text-muted-foreground">
          Manage and view all your building data in organized tables.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Table Selector</CardTitle>
          <CardDescription>Choose which data table you want to view and manage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Select value={selectedTable} onValueChange={setSelectedTable}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select a table to view" />
              </SelectTrigger>
              <SelectContent>
                {tables.map((table) => (
                  <SelectItem key={table.value} value={table.value}>
                    {table.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedTable && (
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {selectedTable && (
        <Card>
          <CardContent className="p-6">
            {renderTable()}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDataTables;
