import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar"; // Assuming this is also a local component

// --- START: MOCK DATA AND UTILITIES ---
// This is a mock Supabase client to prevent build errors from unresolvable imports.
// In a real application, you would use the actual Supabase client.
const mockSupabaseData = {
  tenants: [
    { id: "1", full_name: "John Doe", email: "john@example.com", phone_number: "555-1234", unit_number: "101", status: "Active" },
    { id: "2", full_name: "Jane Smith", email: "jane@example.com", phone_number: "555-5678", unit_number: "102", status: "Active" },
  ],
  lease_agreements: [
    { id: "101", tenant_id: "1", unit_number: "101", start_date: "2023-01-01", end_date: "2024-01-01", monthly_rent: 1500, status: "Active" },
    { id: "102", tenant_id: "2", unit_number: "102", start_date: "2023-02-01", end_date: "2024-02-01", monthly_rent: 1600, status: "Active" },
  ],
  rent_payments: [
    { id: "201", tenant_id: "1", invoice_id: "INV-001", amount: 1500, status: "Paid", due_date: "2023-08-01", payment_date: "2023-07-30", lease_id: "101" },
    { id: "202", tenant_id: "2", invoice_id: "INV-002", amount: 1600, status: "Paid", due_date: "2023-08-01", payment_date: "2023-07-31", lease_id: "102" },
  ],
  floor_occupancy: [],
  parking_allocations: [],
  parking_statistics: [],
  maintenance_repairs: [],
  asset_inventory: [],
  feedback_complaints: [],
  utilities: [],
  revenue_expenses: [],
  paid_parking: [
    { id: "pp1", created_at: "2023-08-20", date: "2023-08-20", number_of_vehicles: 50, amount: 250.00, updated_at: "2023-08-20" },
    { id: "pp2", created_at: "2023-08-21", date: "2023-08-21", number_of_vehicles: 65, amount: 325.00, updated_at: "2023-08-21" },
  ],
};

const supabase = {
  from: (table: string) => ({
    select: () => Promise.resolve({ data: mockSupabaseData[table], error: null }),
    delete: () => Promise.resolve({ error: null }),
    update: () => Promise.resolve({ error: null }),
    insert: () => Promise.resolve({ error: null }),
    eq: () => ({
      delete: () => Promise.resolve({ error: null }),
      update: () => Promise.resolve({ error: null }),
    }),
  }),
};

// --- START: CUSTOM TABLE COMPONENTS ---
// These are placeholder components to replace the unresolvable imports.
// You will need to replace these with your actual implementations.

const TenantsTable = ({ data, onEdit, onDelete, onAdd }) => (
  <div className="text-center py-8">Tenants table content goes here.</div>
);
const LeaseAgreementsTable = ({ data, onEdit, onDelete, onAdd }) => (
  <div className="text-center py-8">Lease Agreements table content goes here.</div>
);
const RentPaymentsTable = ({ data, onEdit, onDelete, onAdd }) => (
  <div className="text-center py-8">Rent Payments table content goes here.</div>
);
const DatePicker = ({ date, onDateChange, className }) => (
  <input
    type="date"
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    value={date ? new Date(date).toISOString().split('T')[0] : ''}
    onChange={(e) => onDateChange(new Date(e.target.value))}
  />
);

const PaidParkingTable = ({ data, onEdit, onDelete, onAdd }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, date: "", number_of_vehicles: 0, amount: 0 });

  const handleEditClick = (row) => {
    setFormData(row);
    setOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      await onDelete(id);
    }
  };

  const handleSave = async () => {
    if (formData.id) {
      await onEdit(formData.id, formData);
    } else {
      await onAdd(formData);
    }
    setOpen(false);
    setFormData({ id: null, date: "", number_of_vehicles: 0, amount: 0 });
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => {
          setFormData({ id: null, date: "", number_of_vehicles: 0, amount: 0 });
          setOpen(true);
        }}>
          <Plus className="mr-2" /> Add Record
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Number of Vehicles</TableHead>
            <TableHead>Amount ($)</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
              <TableCell>{row.number_of_vehicles}</TableCell>
              <TableCell>${row.amount.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(row)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(row.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formData.id ? "Edit" : "Add"} Paid Parking Record</DialogTitle>
            <DialogDescription>
              {formData.id ? "Update the details of the selected record." : "Enter the details for a new paid parking record."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <DatePicker
                date={formData.date ? new Date(formData.date) : null}
                onDateChange={(date) => setFormData({ ...formData, date: date.toISOString() })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vehicles" className="text-right">
                Number of Vehicles
              </Label>
              <Input
                id="vehicles"
                type="number"
                value={formData.number_of_vehicles}
                onChange={(e) => setFormData({ ...formData, number_of_vehicles: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
// --- END: CUSTOM TABLE COMPONENTS ---

// Define the types for your data tables
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

type RentPayment = {
  id: string;
  tenant_id: string;
  invoice_id: string;
  amount: number;
  status: string;
  due_date: string;
  payment_date: string;
  lease_id: string;
};

type LeaseAgreement = {
  id: string;
  tenant_id: string;
  unit_number: string;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  status: string;
};

type Tenant = {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  unit_number: string;
  status: string;
};

type MaintenanceRepair = {
  id: string;
  request_id: string;
  unit_number: string;
  tenant_name: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  completed_at: string;
};

type AssetInventory = {
  id: string;
  asset_name: string;
  category: string;
  condition: string;
  last_maintenance: string;
  next_maintenance: string;
  purchase_date: string;
  value: number;
  warranty_year: number;
};

type FeedbackComplaint = {
  id: string;
  tenant_name: string;
  type: string;
  subject: string;
  details: string;
  status: string;
  date_received: string;
};

type Utility = {
  id: string;
  utility_type: string;
  provider: string;
  account_number: string;
  monthly_cost: number;
};

type RevenueExpense = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
};

type TableType =
  | "tenants"
  | "lease_agreements"
  | "rent_payments"
  | "floor_occupancy"
  | "parking_allocations"
  | "parking_statistics"
  | "maintenance_repairs"
  | "asset_inventory"
  | "feedback_complaints"
  | "utilities"
  | "revenue_expenses"
  | "paid_parking";

type AllDataTypes =
  | Tenant
  | LeaseAgreement
  | RentPayment
  | FloorOccupancy
  | ParkingAllocation
  | ParkingStatistics
  | MaintenanceRepair
  | AssetInventory
  | FeedbackComplaint
  | Utility
  | RevenueExpense
  | PaidParking;

const AdminDataTables = () => {
  const [selectedTable, setSelectedTable] = useState<TableType | null>(null);
  const [data, setData] = useState<AllDataTypes[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const tables = [
    { value: "tenants", label: "Tenants" },
    { value: "lease_agreements", label: "Lease Agreements" },
    { value: "rent_payments", label: "Rent Payments" },
    { value: "floor_occupancy", label: "Floor Occupancy" },
    { value: "parking_allocations", label: "Parking Allocations" },
    { value: "parking_statistics", label: "Parking Statistics" },
    { value: "maintenance_repairs", label: "Maintenance & Repairs" },
    { value: "asset_inventory", label: "Asset Inventory" },
    { value: "feedback_complaints", label: "Feedback & Complaints" },
    { value: "utilities", label: "Utilities" },
    { value: "revenue_expenses", label: "Revenue & Expenses" },
    { value: "paid_parking", label: "Paid Parking" },
  ];

  // A mock function for the fetch operation that returns a Promise with the data
  const fetchTableData = async (table: TableType) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from(table).select("*");
      if (error) throw error;
      // Convert mock data to a more realistic format if needed
      setData(data);
    } catch (error) {
      toast.error(`Failed to fetch data: ${error.message}`);
      console.error("Error fetching data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (table: TableType, id: string) => {
    try {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
      toast.success("Record deleted successfully.");
      // For mock data, we just filter it out
      setData(data.filter(item => item.id !== id));
    } catch (error) {
      toast.error(`Failed to delete record: ${error.message}`);
      console.error("Error deleting record:", error);
    }
  };

  const handleEdit = async (table: TableType, id: string, updatedData: Partial<AllDataTypes>) => {
    try {
      const { error } = await supabase.from(table).update(updatedData).eq("id", id);
      if (error) throw error;
      toast.success("Record updated successfully.");
      // For mock data, we update the item
      setData(data.map(item => (item.id === id ? { ...item, ...updatedData } : item)));
    } catch (error) {
      toast.error(`Failed to update record: ${error.message}`);
      console.error("Error updating record:", error);
    }
  };

  const handleAdd = async (table: TableType, newData: Partial<AllDataTypes>) => {
    try {
      const { error } = await supabase.from(table).insert(newData);
      if (error) throw error;
      toast.success("Record added successfully.");
      // For mock data, we add a new item with a temporary ID
      const newRecord = { ...newData, id: (data.length + 1).toString() };
      setData([...data, newRecord]);
    } catch (error) {
      toast.error(`Failed to add record: ${error.message}`);
      console.error("Error adding record:", error);
    }
  };


  useEffect(() => {
    if (selectedTable) {
      fetchTableData(selectedTable);
    }
  }, [selectedTable]);

  const filteredData = data.filter((item: any) =>
    Object.values(item).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const renderTable = () => {
    if (loading) {
      return <div className="text-center py-8">Loading...</div>;
    }

    if (!selectedTable) {
      return <div className="text-center py-8">Please select a table to view.</div>;
    }

    switch (selectedTable) {
      case "tenants":
        return <TenantsTable data={filteredData as Tenant[]} onEdit={(id, d) => handleEdit(selectedTable, id, d)} onDelete={(id) => handleDelete(selectedTable, id)} onAdd={(d) => handleAdd(selectedTable, d)} />;
      case "lease_agreements":
        return <LeaseAgreementsTable data={filteredData as LeaseAgreement[]} onEdit={(id, d) => handleEdit(selectedTable, id, d)} onDelete={(id) => handleDelete(selectedTable, id)} onAdd={(d) => handleAdd(selectedTable, d)} />;
      case "rent_payments":
        return <RentPaymentsTable data={filteredData as RentPayment[]} onEdit={(id, d) => handleEdit(selectedTable, id, d)} onDelete={(id) => handleDelete(selectedTable, id)} onAdd={(d) => handleAdd(selectedTable, d)} />;
      case "floor_occupancy":
        return <FloorOccupancyTable data={filteredData as FloorOccupancy[]} onEdit={(id, d) => handleEdit(selectedTable, id, d)} onDelete={(id) => handleDelete(selectedTable, id)} onAdd={(d) => handleAdd(selectedTable, d)} />;
      case "parking_allocations":
        return <ParkingAllocationsTable data={filteredData as ParkingAllocation[]} onEdit={(id, d) => handleEdit(selectedTable, id, d)} onDelete={(id) => handleDelete(selectedTable, id)} onAdd={(d) => handleAdd(selectedTable, d)} />;
      case "parking_statistics":
        return <ParkingStatisticsTable data={filteredData as ParkingStatistics[]} onEdit={(id, d) => handleEdit(selectedTable, id, d)} onDelete={(id) => handleDelete(selectedTable, id)} onAdd={(d) => handleAdd(selectedTable, d)} />;
      case "maintenance_repairs":
        return <MaintenanceRepairsTable data={filteredData as MaintenanceRepair[]} onEdit={(id, d) => handleEdit(selectedTable, id, d)} onDelete={(id) => handleDelete(selectedTable, id)} onAdd={(d) => handleAdd(selectedTable, d)} />;
      case "asset_inventory":
        return <AssetInventoryTable data={filteredData as AssetInventory[]} onEdit={(id, d) => handleEdit(selectedTable, id, d)} onDelete={(id) => handleDelete(selectedTable, id)} onAdd={(d) => handleAdd(selectedTable, d)} />;
      case "feedback_complaints":
        return <FeedbackComplaintsTable data={filteredData as FeedbackComplaint[]} onEdit={(id, d) => handleEdit(selectedTable, id, d)} onDelete={(id) => handleDelete(selectedTable, id)} onAdd={(d) => handleAdd(selectedTable, d)} />;
      case "utilities":
        return <UtilitiesTable data={filteredData as Utility[]} onEdit={(id, d) => handleEdit(selectedTable, id, d)} onDelete={(id) => handleDelete(selectedTable, id)} onAdd={(d) => handleAdd(selectedTable, d)} />;
      case "revenue_expenses":
        return <RevenueExpensesTable data={filteredData as RevenueExpense[]} onEdit={(id, d) => handleEdit(selectedTable, id, d)} onDelete={(id) => handleDelete(selectedTable, id)} onAdd={(d) => handleAdd(selectedTable, d)} />;
      case "paid_parking":
        return <PaidParkingTable data={filteredData as PaidParking[]} onEdit={(id, d) => handleEdit(selectedTable, id, d)} onDelete={(id) => handleDelete(selectedTable, id)} onAdd={(d) => handleAdd(selectedTable, d)} />;
      default:
        return <div className="text-center py-8">Unknown table selected.</div>;
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
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

// --- START: PLACEHOLDER COMPONENTS (Add your own implementations) ---
const FloorOccupancyTable = ({ data, onEdit, onDelete, onAdd }) => <div className="text-center py-8">Floor Occupancy table content will go here.</div>;
const ParkingAllocationsTable = ({ data, onEdit, onDelete, onAdd }) => <div className="text-center py-8">Parking Allocations table content will go here.</div>;
const ParkingStatisticsTable = ({ data, onEdit, onDelete, onAdd }) => <div className="text-center py-8">Parking Statistics table content will go here.</div>;
const MaintenanceRepairsTable = ({ data, onEdit, onDelete, onAdd }) => <div className="text-center py-8">Maintenance & Repairs table content will go here.</div>;
const AssetInventoryTable = ({ data, onEdit, onDelete, onAdd }) => <div className="text-center py-8">Asset Inventory table content will go here.</div>;
const FeedbackComplaintsTable = ({ data, onEdit, onDelete, onAdd }) => <div className="text-center py-8">Feedback & Complaints table content will go here.</div>;
const UtilitiesTable = ({ data, onEdit, onDelete, onAdd }) => <div className="text-center py-8">Utilities table content will go here.</div>;
const RevenueExpensesTable = ({ data, onEdit, onDelete, onAdd }) => <div className="text-center py-8">Revenue & Expenses table content will go here.</div>;
