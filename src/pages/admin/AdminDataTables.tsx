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

type FootTraffic = {
  id: string;
  date: string;
  time: string;
  floor: string;
  company: string;
  purpose: string;
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
  
  // State for foot traffic data
  const [footTrafficData, setFootTrafficData] = useState<FootTraffic[]>([]);
  
  
  // Dialog states
  const [isFloorDialogOpen, setIsFloorDialogOpen] = useState(false);
  const [isParkingDialogOpen, setIsParkingDialogOpen] = useState(false);
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
  const [isUtilitiesDialogOpen, setIsUtilitiesDialogOpen] = useState(false);
  const [isFootTrafficDialogOpen, setIsFootTrafficDialogOpen] = useState(false);
  
  const [isDropdownConfigOpen, setIsDropdownConfigOpen] = useState(false);
  const [isUtilitiesDropdownConfigOpen, setIsUtilitiesDropdownConfigOpen] = useState(false);
  const [editingFloor, setEditingFloor] = useState<FloorOccupancy | null>(null);
  const [editingParking, setEditingParking] = useState<ParkingAllocation | null>(null);
  const [editingMaintenance, setEditingMaintenance] = useState<MaintenanceRepair | null>(null);
  const [editingUtility, setEditingUtility] = useState<Utility | null>(null);
  const [editingFootTraffic, setEditingFootTraffic] = useState<FootTraffic | null>(null);
  
  
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

  // Temp dropdown options for editing
  const [tempDropdownOptions, setTempDropdownOptions] = useState(dropdownOptions);
  const [tempUtilitiesDropdownOptions, setTempUtilitiesDropdownOptions] = useState(utilitiesDropdownOptions);

  const tables = [
    { value: "tenantsManagement", label: "Tenants Management (Live)" },
    { value: "leaseAgreements", label: "Lease Agreements Table" },
    { value: "rentPaymentsLive", label: "Rent Payments (Live)" },
    { value: "occupancy", label: "Occupancy Table" },
    { value: "maintenance", label: "Maintenance & Repairs Table" },
    { value: "utilities", label: "Utilities Table" },
    { value: "foot_traffic", label: "Foot Traffic Table" },
    { value: "eventBookings", label: "Event Bookings Table" },
    { value: "feedback", label: "Feedback & Complaints Table" },
    { value: "cleaningSecurity", label: "Cleaning & Security Logs" },
    { value: "revenue", label: "Revenue & Expenses Table" },
    { value: "assets", label: "Asset Inventory Table" }
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

  // Fetch foot traffic data
  const fetchFootTrafficData = async () => {
    const { data, error } = await supabase
      .from('foot_traffic')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      toast.error('Failed to fetch foot traffic data');
      return;
    }
    
    setFootTrafficData(data || []);
  };

  useEffect(() => {
    const fetchFootTrafficDataLocal = async () => {
      const { data, error } = await supabase
        .from('foot_traffic')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        toast.error('Failed to fetch foot traffic data');
        return;
      }
      
      setFootTrafficData(data || []);
    };

    if (selectedTable === 'occupancy') {
      fetchFloorData();
      fetchParkingAllocations();
      fetchParkingStats();
    } else if (selectedTable === 'maintenance') {
      fetchMaintenanceData();
      fetchTenantsList();
    } else if (selectedTable === 'utilities') {
      fetchUtilitiesData();
    } else if (selectedTable === 'foot_traffic') {
      fetchFootTrafficData();
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

  // CRUD functions for foot traffic
  const [footTrafficForm, setFootTrafficForm] = useState({
    date: new Date().toISOString().split('T')[0],
    time: "",
    floor: "",
    company: "",
    purpose: "Work"
  });

  const handleFootTrafficSubmit = async () => {
    if (editingFootTraffic) {
      // Update existing record
      const { error } = await supabase
        .from('foot_traffic')
        .update({
          date: footTrafficForm.date,
          time: footTrafficForm.time,
          floor: footTrafficForm.floor,
          company: footTrafficForm.company,
          purpose: footTrafficForm.purpose
        })
        .eq('id', editingFootTraffic.id);
      
      if (error) {
        toast.error('Failed to update foot traffic record');
        return;
      }
      
      toast.success('Foot traffic record updated successfully');
    } else {
      // Create new record
      const { error } = await supabase
        .from('foot_traffic')
        .insert([{
          date: footTrafficForm.date,
          time: footTrafficForm.time,
          floor: footTrafficForm.floor,
          company: footTrafficForm.company,
          purpose: footTrafficForm.purpose
        }]);
      
      if (error) {
        toast.error('Failed to create foot traffic record');
        return;
      }
      
      toast.success('Foot traffic record created successfully');
    }
    
    setIsFootTrafficDialogOpen(false);
    setEditingFootTraffic(null);
    setFootTrafficForm({
      date: new Date().toISOString().split('T')[0],
      time: "",
      floor: "",
      company: "",
      purpose: "Work"
    });
    fetchFootTrafficData();
  };

  const handleFootTrafficEdit = (traffic: FootTraffic) => {
    setEditingFootTraffic(traffic);
    setFootTrafficForm({
      date: traffic.date,
      time: traffic.time,
      floor: traffic.floor,
      company: traffic.company,
      purpose: traffic.purpose
    });
    setIsFootTrafficDialogOpen(true);
  };

  const handleFootTrafficDelete = async (id: string) => {
    const { error } = await supabase
      .from('foot_traffic')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to delete foot traffic record');
      return;
    }
    
    toast.success('Foot traffic record deleted successfully');
    fetchFootTrafficData();
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
    eventBookings: [
      {
        id: "E001",
        eventName: "Tech Conference 2024",
        organizer: "TechCorp Inc.",
        date: "2024-08-15",
        time: "9:00 AM - 5:00 PM",
        venue: "Main Conference Hall",
        attendees: 150,
        status: "Confirmed"
      },
      {
        id: "E002",
        eventName: "Product Launch",
        organizer: "Innovation Labs",
        date: "2024-08-20",
        time: "6:00 PM - 9:00 PM",
        venue: "Exhibition Space",
        attendees: 80,
        status: "Pending"
      },
      {
        id: "E003",
        eventName: "Networking Mixer",
        organizer: "Business Network",
        date: "2024-08-25",
        time: "7:00 PM - 10:00 PM",
        venue: "Rooftop Terrace",
        attendees: 60,
        status: "Confirmed"
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
    cleaningSecurity: [
      {
        id: "CS001",
        date: "2024-08-05",
        shift: "Morning",
        cleaningStatus: "Completed",
        securityIncidents: 0,
        areasInspected: "All floors, restrooms, common areas",
        issuesFound: "None",
        actionsTaken: "Regular cleaning completed",
        staff: "John D., Sarah M."
      },
      {
        id: "CS002",
        date: "2024-08-04",
        shift: "Evening",
        cleaningStatus: "Completed",
        securityIncidents: 1,
        areasInspected: "Parking garage, entrance, lobby",
        issuesFound: "Suspicious individual in parking",
        actionsTaken: "Individual escorted out, incident logged",
        staff: "Mike R., Lisa K."
      },
      {
        id: "CS003",
        date: "2024-08-03",
        shift: "Night",
        cleaningStatus: "Completed",
        securityIncidents: 0,
        areasInspected: "All floors, emergency exits",
        issuesFound: "Broken light in stairwell",
        actionsTaken: "Maintenance request submitted",
        staff: "Tom B., Anna L."
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

    // Handle foot traffic table with real backend
    if (selectedTable === 'foot_traffic') {
      const filteredFootTraffic = footTrafficData.filter((traffic) =>
        traffic.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        traffic.floor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        traffic.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
        traffic.date.includes(searchTerm.toLowerCase())
      );

      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Foot Traffic</h2>
            <Dialog open={isFootTrafficDialogOpen} onOpenChange={setIsFootTrafficDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{editingFootTraffic ? 'Edit' : 'Add'} Foot Traffic Entry</DialogTitle>
                  <DialogDescription>
                    {editingFootTraffic ? 'Update the foot traffic record' : 'Create a new foot traffic record'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={footTrafficForm.date}
                      onChange={(e) => setFootTrafficForm({ ...footTrafficForm, date: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="time" className="text-right">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={footTrafficForm.time}
                      onChange={(e) => setFootTrafficForm({ ...footTrafficForm, time: e.target.value })}
                      className="col-span-3"
                      placeholder="HH:MM"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="floor" className="text-right">Floor</Label>
                    <Input
                      id="floor"
                      value={footTrafficForm.floor}
                      onChange={(e) => setFootTrafficForm({ ...footTrafficForm, floor: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g., 1st Floor"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="company" className="text-right">Company</Label>
                    <Input
                      id="company"
                      value={footTrafficForm.company}
                      onChange={(e) => setFootTrafficForm({ ...footTrafficForm, company: e.target.value })}
                      className="col-span-3"
                      placeholder="Company they came to"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="purpose" className="text-right">Purpose</Label>
                    <Select value={footTrafficForm.purpose} onValueChange={(value) => setFootTrafficForm({ ...footTrafficForm, purpose: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Work">Work</SelectItem>
                        <SelectItem value="Client">Client</SelectItem>
                        <SelectItem value="Visitor">Visitor</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsFootTrafficDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleFootTrafficSubmit}>
                    {editingFootTraffic ? 'Update' : 'Create'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFootTraffic.map((traffic) => (
                <TableRow key={traffic.id}>
                  <TableCell className="font-medium">{traffic.id.slice(0, 8)}...</TableCell>
                  <TableCell>{new Date(traffic.date).toLocaleDateString()}</TableCell>
                  <TableCell>{traffic.time}</TableCell>
                  <TableCell>{traffic.floor}</TableCell>
                  <TableCell>{traffic.company}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{traffic.purpose}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleFootTrafficEdit(traffic)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleFootTrafficDelete(traffic.id)}>
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

    if (selectedTable === 'eventBookings') {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Event Name</TableHead>
              <TableHead>Organizer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead>Attendees</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.eventName}</TableCell>
                <TableCell>{item.organizer}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.time}</TableCell>
                <TableCell>{item.venue}</TableCell>
                <TableCell>{item.attendees}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }

    if (selectedTable === 'feedback') {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.tenant}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(item.priority)}>
                    {item.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>{item.assignedTo}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }

    if (selectedTable === 'cleaningSecurity') {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Shift</TableHead>
              <TableHead>Cleaning Status</TableHead>
              <TableHead>Security Incidents</TableHead>
              <TableHead>Areas Inspected</TableHead>
              <TableHead>Issues Found</TableHead>
              <TableHead>Actions Taken</TableHead>
              <TableHead>Staff</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.shift}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(item.cleaningStatus)}>
                    {item.cleaningStatus}
                  </Badge>
                </TableCell>
                <TableCell>{item.securityIncidents}</TableCell>
                <TableCell>{item.areasInspected}</TableCell>
                <TableCell>{item.issuesFound}</TableCell>
                <TableCell>{item.actionsTaken}</TableCell>
                <TableCell>{item.staff}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }

    if (selectedTable === 'revenue') {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Month</TableHead>
              <TableHead>Rent Revenue</TableHead>
              <TableHead>Parking Revenue</TableHead>
              <TableHead>Event Revenue</TableHead>
              <TableHead>Total Revenue</TableHead>
              <TableHead>Expenses</TableHead>
              <TableHead>Net Income</TableHead>
              <TableHead>Profit Margin</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.month}</TableCell>
                <TableCell>{item.rentRevenue}</TableCell>
                <TableCell>{item.parkingRevenue}</TableCell>
                <TableCell>{item.eventRevenue}</TableCell>
                <TableCell className="font-medium">{item.totalRevenue}</TableCell>
                <TableCell>{item.expenses}</TableCell>
                <TableCell className="font-medium text-green-600">{item.netIncome}</TableCell>
                <TableCell>{item.profitMargin}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }

    if (selectedTable === 'assets') {
      return (
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
            {filteredData.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.assetName}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.purchaseDate}</TableCell>
                <TableCell>{item.value}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(item.condition)}>
                    {item.condition}
                  </Badge>
                </TableCell>
                <TableCell>{item.lastMaintenance}</TableCell>
                <TableCell>{item.nextMaintenance}</TableCell>
                <TableCell>{item.warranty}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
