import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Edit } from "lucide-react";
import TenantsTable from "@/components/tenants/TenantsTable";
import { LeaseAgreementsTable } from "@/components/leases/LeaseAgreementsTable";
import RentPaymentsTable from "@/components/rent-payments/RentPaymentsTable";

const AdminDataTables = () => {
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  const tables = [
    { value: "tenantsManagement", label: "Tenants Management (Live)" },
    { value: "leaseAgreements", label: "Lease Agreements Table" },
    { value: "rentPaymentsLive", label: "Rent Payments (Live)" },
    { value: "occupancy", label: "Occupancy Table" },
    { value: "maintenance", label: "Maintenance & Repairs Table" },
    { value: "utilities", label: "Utilities Table" },
    { value: "eventBookings", label: "Event Bookings Table" },
    { value: "feedback", label: "Feedback & Complaints Table" },
    { value: "cleaningSecurity", label: "Cleaning & Security Logs" },
    { value: "revenue", label: "Revenue & Expenses Table" },
    { value: "assets", label: "Asset Inventory Table" }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'active':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'in progress':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reported':
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-muted text-muted-foreground';
    }
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

    // Handle other tables with mock data
    const mockData = {
      eventBookings: [
        { id: "E001", eventName: "Annual Conference", organizer: "TechCorp", date: "2024-03-15", time: "09:00", venue: "Conference Room A", attendees: 50, status: "Confirmed" },
        { id: "E002", eventName: "Team Building", organizer: "CreativeStudio", date: "2024-03-20", time: "14:00", venue: "Outdoor Area", attendees: 25, status: "Pending" },
        { id: "E003", eventName: "Product Launch", organizer: "Innovation Ltd", date: "2024-03-25", time: "11:00", venue: "Main Hall", attendees: 100, status: "Confirmed" }
      ],
      feedback: [
        { id: "F001", date: "2024-03-10", tenant: "TechCorp", type: "Complaint", category: "Maintenance", description: "Air conditioning not working", priority: "High", status: "In Progress", assignedTo: "John Doe" },
        { id: "F002", date: "2024-03-12", tenant: "CreativeStudio", type: "Suggestion", category: "Security", description: "Improve lighting in parking", priority: "Medium", status: "Pending", assignedTo: "Jane Smith" },
        { id: "F003", date: "2024-03-14", tenant: "Innovation Ltd", type: "Compliment", category: "Service", description: "Excellent customer service", priority: "Low", status: "Closed", assignedTo: "Mike Johnson" }
      ],
      cleaningSecurity: [
        { id: "CS001", date: "2024-03-15", time: "08:00", type: "Cleaning", area: "Lobby", staff: "Alice Johnson", status: "Completed", notes: "Deep cleaned carpets" },
        { id: "CS002", date: "2024-03-15", time: "22:00", type: "Security", area: "Parking Lot", staff: "Bob Wilson", status: "Completed", notes: "Regular patrol completed" },
        { id: "CS003", date: "2024-03-16", time: "06:00", type: "Cleaning", area: "Restrooms", staff: "Carol Brown", status: "In Progress", notes: "Restocking supplies" }
      ],
      revenue: [
        { id: "R001", date: "2024-03-01", type: "Income", category: "Rent", amount: 25000, tenant: "TechCorp", description: "Monthly rent payment" },
        { id: "R002", date: "2024-03-05", type: "Expense", category: "Maintenance", amount: 2500, vendor: "CleanCo", description: "Deep cleaning service" },
        { id: "R003", date: "2024-03-10", type: "Income", category: "Parking", amount: 1200, tenant: "CreativeStudio", description: "Additional parking fees" }
      ],
      assets: [
        { id: "A001", name: "Conference Room Projector", category: "Electronics", location: "Room A", condition: "Good", purchaseDate: "2023-01-15", value: 2500, lastMaintenance: "2024-02-20" },
        { id: "A002", name: "HVAC System - Floor 1", category: "Equipment", location: "Floor 1", condition: "Excellent", purchaseDate: "2022-06-10", value: 15000, lastMaintenance: "2024-03-01" },
        { id: "A003", name: "Security Camera Set", category: "Security", location: "Entrance", condition: "Good", purchaseDate: "2023-03-20", value: 3500, lastMaintenance: "2024-01-15" }
      ]
    };

    const tableKey = selectedTable as keyof typeof mockData;
    const data = mockData[tableKey] || [];
    const filteredData = data.filter((item: any) =>
      Object.values(item).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

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

    // Default message for other tables
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Table content will be displayed here</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Table Selector</CardTitle>
          <CardDescription>
            Choose which data table you want to view and manage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select value={selectedTable} onValueChange={setSelectedTable}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select a table" />
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