import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Upload, Edit, Trash2 } from "lucide-react";
import TenantsTable from "@/components/tenants/TenantsTable";

const AdminDataTables = () => {
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  const tables = [
    { value: "tenantsManagement", label: "Tenants Management (Live)" },
    { value: "leaseAgreements", label: "Lease Agreements Table" },
    { value: "rentPayments", label: "Rent Payments Table" },
    { value: "occupancy", label: "Occupancy Table" },
    { value: "maintenance", label: "Maintenance & Repairs Table" },
    { value: "utilities", label: "Utilities Table" },
    { value: "visitorTraffic", label: "Visitor Foot Traffic Table" },
    { value: "eventBookings", label: "Event Bookings Table" },
    { value: "feedback", label: "Feedback & Complaints Table" },
    { value: "cleaningSecurity", label: "Cleaning & Security Logs" },
    { value: "revenue", label: "Revenue & Expenses Table" },
    { value: "assets", label: "Asset Inventory Table" },
  ];

  // Mock data for all tables
  const mockData = {
    leaseAgreements: [
      { id: "L001", tenantId: "T001", name: "TechCorp Solutions", floor: "5", leaseStart: "2023-01-15", leaseEnd: "2026-01-14", monthlyRent: "$5,200", termsSummary: "3-year commercial lease with annual 3% increase", contractCopy: "contract-001.pdf" },
      { id: "L002", tenantId: "T002", name: "Fashion Boutique LLC", floor: "1", leaseStart: "2023-03-01", leaseEnd: "2025-02-28", monthlyRent: "$3,800", termsSummary: "2-year retail lease with option to extend", contractCopy: "contract-002.pdf" },
      { id: "L003", tenantId: "T003", name: "Legal Associates Inc", floor: "8", leaseStart: "2022-06-01", leaseEnd: "2025-05-31", monthlyRent: "$6,500", termsSummary: "3-year professional services lease", contractCopy: null },
      { id: "L004", tenantId: "T004", name: "Creative Studio", floor: "3", leaseStart: "2023-09-15", leaseEnd: "2025-09-14", monthlyRent: "$4,200", termsSummary: "2-year creative space lease", contractCopy: "contract-004.pdf" },
    ],
    rentPayments: [
      { id: "P001", tenantId: "T001", paymentDate: "2024-08-01", monthPaidFor: "August 2024", amount: "$5,200", method: "Bank Transfer", status: "Paid", remarks: "On time payment" },
      { id: "P002", tenantId: "T002", paymentDate: "2024-08-03", monthPaidFor: "August 2024", amount: "$3,800", method: "Check", status: "Paid", remarks: "3 days late" },
      { id: "P003", tenantId: "T003", paymentDate: "2024-07-28", monthPaidFor: "August 2024", amount: "$6,500", method: "Online Payment", status: "Paid", remarks: "Early payment" },
    ],
    occupancy: [
      { unitId: "U501", floor: "5", type: "Office", status: "Occupied", tenantId: "T001", dateAvailable: "-" },
      { unitId: "U101", floor: "1", type: "Retail", status: "Occupied", tenantId: "T002", dateAvailable: "-" },
      { unitId: "U801", floor: "8", type: "Office", status: "Occupied", tenantId: "T003", dateAvailable: "-" },
      { unitId: "U502", floor: "5", type: "Office", status: "Vacant", tenantId: "-", dateAvailable: "2024-09-01" },
      { unitId: "U601", floor: "6", type: "Office", status: "Vacant", tenantId: "-", dateAvailable: "2024-08-15" },
    ],
    maintenance: [
      { id: "M001", dateReported: "2024-08-05", floor: "5", issueType: "HVAC", description: "Air conditioning not cooling properly", assignedVendor: "Cool Air Systems", cost: "$850", status: "In Progress", completionDate: "-" },
      { id: "M002", dateReported: "2024-07-15", floor: "1", issueType: "Electrical", description: "Lighting fixture replacement", assignedVendor: "Bright Electric", cost: "$320", status: "Completed", completionDate: "2024-07-17" },
      { id: "M003", dateReported: "2024-08-01", floor: "8", issueType: "Plumbing", description: "Leaky faucet in restroom", assignedVendor: "Quick Fix Plumbing", cost: "$150", status: "Completed", completionDate: "2024-08-02" },
    ],
    utilities: [
      { id: "U001", date: "2024-08-01", floor: "5", utilityType: "Electricity", usage: "2,450 kWh", cost: "$490", billedTo: "Landlord" },
      { id: "U002", date: "2024-08-01", floor: "1", utilityType: "Water", usage: "850 gallons", cost: "$145", billedTo: "Tenant" },
      { id: "U003", date: "2024-08-01", floor: "8", utilityType: "Internet", usage: "Unlimited", cost: "$120", billedTo: "Landlord" },
    ],
    visitorTraffic: [
      { id: "V001", date: "2024-08-07", area: "Ground Floor", entryTime: "09:00", exitTime: "17:30", count: "45", specialEvent: "No" },
      { id: "V002", date: "2024-08-06", area: "Rooftop", entryTime: "18:00", exitTime: "23:00", count: "120", specialEvent: "Yes" },
      { id: "V003", date: "2024-08-05", area: "Ground Floor", entryTime: "08:30", exitTime: "18:00", count: "38", specialEvent: "No" },
    ],
    eventBookings: [
      { id: "E001", clientName: "Johnson & Associates", eventType: "Corporate Meeting", bookingDate: "2024-08-01", eventDate: "2024-08-20", timeSlot: "2:00 PM - 6:00 PM", rentalFee: "$800", extras: "Catering, AV Equipment", paymentStatus: "Paid" },
      { id: "E002", clientName: "Sarah Miller", eventType: "Wedding Reception", bookingDate: "2024-07-15", eventDate: "2024-09-15", timeSlot: "6:00 PM - 12:00 AM", rentalFee: "$2,500", extras: "Decorations, DJ", paymentStatus: "Partial" },
    ],
    feedback: [
      { id: "F001", source: "Tenant", date: "2024-08-01", floor: "5", feedbackType: "Suggestion", description: "Request for additional parking spaces", actionTaken: "Under review by management", status: "Open" },
      { id: "F002", source: "Visitor", date: "2024-07-28", floor: "1", feedbackType: "Complaint", description: "Difficulty finding parking", actionTaken: "Installed better signage", status: "Resolved" },
      { id: "F003", source: "Tenant", date: "2024-07-20", floor: "8", feedbackType: "Compliment", description: "Excellent maintenance response time", actionTaken: "Shared with maintenance team", status: "Closed" },
    ],
    cleaningSecurity: [
      { id: "CS001", date: "2024-08-07", floor: "5", activityType: "Cleaning", time: "20:00", staffName: "Maria Santos", notes: "Deep cleaned office suite 501" },
      { id: "CS002", date: "2024-08-07", floor: "All", activityType: "Security", time: "22:00", staffName: "David Chen", notes: "Security round - all clear" },
      { id: "CS003", date: "2024-08-06", floor: "1", activityType: "Cleaning", time: "19:30", staffName: "Carlos Rodriguez", notes: "Retail area maintenance cleaning" },
    ],
    revenue: [
      { id: "R001", date: "2024-08-01", source: "Rent", category: "Office Rent", amount: "$15,700", type: "Revenue", notes: "Monthly rent collection" },
      { id: "R002", date: "2024-08-01", source: "Event", category: "Rooftop Rental", amount: "$800", type: "Revenue", notes: "Corporate event booking" },
      { id: "R003", date: "2024-08-02", source: "Maintenance", category: "HVAC Repair", amount: "$850", type: "Expense", notes: "AC repair on floor 5" },
      { id: "R004", date: "2024-08-03", source: "Utilities", category: "Electricity", amount: "$1,200", type: "Expense", notes: "Monthly electricity bill" },
    ],
    assets: [
      { id: "A001", name: "Elevator System - Main", location: "Central Core", purchaseDate: "2020-01-15", cost: "$45,000", condition: "Good", maintenanceSchedule: "Quarterly" },
      { id: "A002", name: "HVAC Unit - Floor 5", location: "Floor 5 - Mechanical Room", purchaseDate: "2021-03-10", cost: "$12,000", condition: "Excellent", maintenanceSchedule: "Bi-annually" },
      { id: "A003", name: "Security Camera System", location: "Building-wide", purchaseDate: "2022-06-20", cost: "$8,500", condition: "Excellent", maintenanceSchedule: "Annually" },
      { id: "A004", name: "Conference Room Furniture", location: "Floor 8 - Suite 801", purchaseDate: "2023-01-05", cost: "$3,200", condition: "Good", maintenanceSchedule: "As needed" },
    ],
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

  const renderTable = () => {
    if (!selectedTable) return null;

    // Handle live tenants management separately
    if (selectedTable === 'tenantsManagement') {
      return <TenantsTable />;
    }

    const data = mockData[selectedTable as keyof typeof mockData];
    const filteredData = data.filter((item: any) => 
      Object.values(item).some(value => 
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    switch (selectedTable) {
      case 'leaseAgreements':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Lease Start</TableHead>
                <TableHead>Lease End</TableHead>
                <TableHead>Monthly Rent</TableHead>
                <TableHead>Terms Summary</TableHead>
                <TableHead>Contract Copy</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((lease: any) => (
                <TableRow key={lease.id}>
                  <TableCell className="font-medium">{lease.tenantId}</TableCell>
                  <TableCell>{lease.name}</TableCell>
                  <TableCell>{lease.floor}</TableCell>
                  <TableCell>{lease.leaseStart}</TableCell>
                  <TableCell>{lease.leaseEnd}</TableCell>
                  <TableCell className="font-medium">{lease.monthlyRent}</TableCell>
                  <TableCell className="max-w-xs truncate" title={lease.termsSummary}>{lease.termsSummary}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {lease.contractCopy ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => console.log('View contract:', lease.contractCopy)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => console.log('Upload contract for:', lease.id)}
                        >
                          <Upload className="h-4 w-4 mr-1" />
                          Upload
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => console.log('Edit lease:', lease.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => console.log('Delete lease:', lease.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case 'rentPayments':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Tenant ID</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Month Paid For</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((payment: any) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>{payment.tenantId}</TableCell>
                  <TableCell>{payment.paymentDate}</TableCell>
                  <TableCell>{payment.monthPaidFor}</TableCell>
                  <TableCell className="font-medium">{payment.amount}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                  </TableCell>
                  <TableCell>{payment.remarks}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case 'occupancy':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unit ID</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tenant ID</TableHead>
                <TableHead>Date Available</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((unit: any) => (
                <TableRow key={unit.unitId}>
                  <TableCell className="font-medium">{unit.unitId}</TableCell>
                  <TableCell>{unit.floor}</TableCell>
                  <TableCell>{unit.type}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(unit.status)}>{unit.status}</Badge>
                  </TableCell>
                  <TableCell>{unit.tenantId}</TableCell>
                  <TableCell>{unit.dateAvailable}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case 'maintenance':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Issue ID</TableHead>
                <TableHead>Date Reported</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Issue Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Assigned Vendor</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Completion Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((issue: any) => (
                <TableRow key={issue.id}>
                  <TableCell className="font-medium">{issue.id}</TableCell>
                  <TableCell>{issue.dateReported}</TableCell>
                  <TableCell>{issue.floor}</TableCell>
                  <TableCell>{issue.issueType}</TableCell>
                  <TableCell className="max-w-xs truncate" title={issue.description}>{issue.description}</TableCell>
                  <TableCell>{issue.assignedVendor}</TableCell>
                  <TableCell className="font-medium">{issue.cost}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                  </TableCell>
                  <TableCell>{issue.completionDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case 'utilities':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Record ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Utility Type</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Billed To</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((utility: any) => (
                <TableRow key={utility.id}>
                  <TableCell className="font-medium">{utility.id}</TableCell>
                  <TableCell>{utility.date}</TableCell>
                  <TableCell>{utility.floor}</TableCell>
                  <TableCell>{utility.utilityType}</TableCell>
                  <TableCell>{utility.usage}</TableCell>
                  <TableCell className="font-medium">{utility.cost}</TableCell>
                  <TableCell>{utility.billedTo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case 'visitorTraffic':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entry ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Entry Time</TableHead>
                <TableHead>Exit Time</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Special Event</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((visitor: any) => (
                <TableRow key={visitor.id}>
                  <TableCell className="font-medium">{visitor.id}</TableCell>
                  <TableCell>{visitor.date}</TableCell>
                  <TableCell>{visitor.area}</TableCell>
                  <TableCell>{visitor.entryTime}</TableCell>
                  <TableCell>{visitor.exitTime}</TableCell>
                  <TableCell className="font-medium">{visitor.count}</TableCell>
                  <TableCell>{visitor.specialEvent}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case 'eventBookings':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event ID</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>Booking Date</TableHead>
                <TableHead>Event Date</TableHead>
                <TableHead>Time Slot</TableHead>
                <TableHead>Rental Fee</TableHead>
                <TableHead>Extras</TableHead>
                <TableHead>Payment Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((event: any) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.id}</TableCell>
                  <TableCell>{event.clientName}</TableCell>
                  <TableCell>{event.eventType}</TableCell>
                  <TableCell>{event.bookingDate}</TableCell>
                  <TableCell>{event.eventDate}</TableCell>
                  <TableCell>{event.timeSlot}</TableCell>
                  <TableCell className="font-medium">{event.rentalFee}</TableCell>
                  <TableCell className="max-w-xs truncate" title={event.extras}>{event.extras}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(event.paymentStatus)}>{event.paymentStatus}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case 'feedback':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feedback ID</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Action Taken</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((feedback: any) => (
                <TableRow key={feedback.id}>
                  <TableCell className="font-medium">{feedback.id}</TableCell>
                  <TableCell>{feedback.source}</TableCell>
                  <TableCell>{feedback.date}</TableCell>
                  <TableCell>{feedback.floor}</TableCell>
                  <TableCell>{feedback.feedbackType}</TableCell>
                  <TableCell className="max-w-xs truncate" title={feedback.description}>{feedback.description}</TableCell>
                  <TableCell className="max-w-xs truncate" title={feedback.actionTaken}>{feedback.actionTaken}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(feedback.status)}>{feedback.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case 'cleaningSecurity':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Record ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Activity Type</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Staff Name</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((log: any) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.id}</TableCell>
                  <TableCell>{log.date}</TableCell>
                  <TableCell>{log.floor}</TableCell>
                  <TableCell>{log.activityType}</TableCell>
                  <TableCell>{log.time}</TableCell>
                  <TableCell>{log.staffName}</TableCell>
                  <TableCell className="max-w-xs truncate" title={log.notes}>{log.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case 'revenue':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Record ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((record: any) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.id}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.source}</TableCell>
                  <TableCell>{record.category}</TableCell>
                  <TableCell className={`font-medium ${record.type === 'Revenue' ? 'text-success' : 'text-destructive'}`}>
                    {record.type === 'Revenue' ? '+' : '-'}{record.amount}
                  </TableCell>
                  <TableCell>
                    <Badge className={record.type === 'Revenue' ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'}>
                      {record.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{record.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case 'assets':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Maintenance Schedule</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((asset: any) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.id}</TableCell>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>{asset.location}</TableCell>
                  <TableCell>{asset.purchaseDate}</TableCell>
                  <TableCell className="font-medium">{asset.cost}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(asset.condition)}>{asset.condition}</Badge>
                  </TableCell>
                  <TableCell>{asset.maintenanceSchedule}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Tables</CardTitle>
          <CardDescription>
            View and manage all building data tables
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedTable} onValueChange={setSelectedTable}>
              <SelectTrigger className="sm:w-[300px]">
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
                placeholder="Search table data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="sm:w-[300px]"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {selectedTable && (
        <Card>
          <CardHeader>
            <CardTitle>
              {tables.find(table => table.value === selectedTable)?.label}
            </CardTitle>
            <CardDescription>
              All records from the {selectedTable.replace(/([A-Z])/g, ' $1').toLowerCase()} table
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              {renderTable()}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDataTables;