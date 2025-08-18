import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, FileText, CreditCard, Wrench, Calendar, MessageSquare } from "lucide-react";

interface TenantDataProps {
  tenantId: string;
}

const TenantData = ({ tenantId }: TenantDataProps) => {
  const [selectedDataType, setSelectedDataType] = useState<string>("");
  const [newComplaint, setNewComplaint] = useState("");

  // Mock data for demonstration
  const mockData = {
    tenants: [
      { id: "T001", name: "TechCorp Solutions", floor: "5", spaceType: "Office", businessType: "Technology", leaseStart: "2023-01-15", leaseEnd: "2026-01-14", monthlyRent: "$5,200", status: "Active" }
    ],
    leaseAgreements: [
      { id: "L001", tenantId: "T001", floor: "5", leaseStart: "2023-01-15", leaseEnd: "2026-01-14", deposit: "$15,600", rentAmount: "$5,200", renewalDate: "2025-10-15" }
    ],
    rentPayments: [
      { id: "P001", paymentDate: "2024-08-01", monthPaidFor: "August 2024", amount: "$5,200", method: "Bank Transfer", status: "Paid" },
      { id: "P002", paymentDate: "2024-07-01", monthPaidFor: "July 2024", amount: "$5,200", method: "Bank Transfer", status: "Paid" },
      { id: "P003", paymentDate: "2024-06-01", monthPaidFor: "June 2024", amount: "$5,200", method: "Bank Transfer", status: "Paid" }
    ],
    maintenance: [
      { id: "M001", dateReported: "2024-08-05", issueType: "HVAC", description: "Air conditioning not cooling properly", status: "In Progress", completionDate: "-" },
      { id: "M002", dateReported: "2024-07-15", issueType: "Electrical", description: "Lighting fixture replacement", status: "Completed", completionDate: "2024-07-17" }
    ],
    eventBookings: [
      { id: "E001", eventType: "Corporate Meeting", bookingDate: "2024-08-10", eventDate: "2024-08-20", timeSlot: "2:00 PM - 6:00 PM", fee: "$800", status: "Confirmed" }
    ],
    feedback: [
      { id: "F001", date: "2024-08-01", type: "Suggestion", description: "Request for additional parking spaces", status: "Under Review" },
      { id: "F002", date: "2024-07-20", type: "Complaint", description: "Noise from construction work", status: "Resolved" }
    ]
  };

  const dataTypeOptions = [
    { value: "tenants", label: "Tenant Information", icon: User },
    { value: "leaseAgreements", label: "Lease Agreements", icon: FileText },
    { value: "rentPayments", label: "Rent Payments", icon: CreditCard },
    { value: "maintenance", label: "Maintenance & Repairs", icon: Wrench },
    { value: "eventBookings", label: "Event Bookings", icon: Calendar },
    { value: "feedback", label: "Feedback & Complaints", icon: MessageSquare },
  ];

  const handleSubmitComplaint = () => {
    if (newComplaint.trim()) {
      // In a real app, this would submit to the backend
      alert("Complaint submitted successfully!");
      setNewComplaint("");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'paid':
      case 'completed':
      case 'confirmed':
      case 'resolved':
        return 'bg-success text-success-foreground';
      case 'in progress':
      case 'under review':
        return 'bg-warning text-warning-foreground';
      case 'late':
      case 'pending':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const renderDataTable = () => {
    if (!selectedDataType) return null;

    const data = mockData[selectedDataType as keyof typeof mockData];
    
    switch (selectedDataType) {
      case 'tenants':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Space Type</TableHead>
                <TableHead>Business Type</TableHead>
                <TableHead>Monthly Rent</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.floor}</TableCell>
                  <TableCell>{item.spaceType}</TableCell>
                  <TableCell>{item.businessType}</TableCell>
                  <TableCell>{item.monthlyRent}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case 'leaseAgreements':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lease ID</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Lease Start</TableHead>
                <TableHead>Lease End</TableHead>
                <TableHead>Deposit</TableHead>
                <TableHead>Monthly Rent</TableHead>
                <TableHead>Renewal Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.floor}</TableCell>
                  <TableCell>{item.leaseStart}</TableCell>
                  <TableCell>{item.leaseEnd}</TableCell>
                  <TableCell>{item.deposit}</TableCell>
                  <TableCell>{item.rentAmount}</TableCell>
                  <TableCell>{item.renewalDate}</TableCell>
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
                <TableHead>Payment Date</TableHead>
                <TableHead>Month Paid For</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>{item.paymentDate}</TableCell>
                  <TableCell>{item.monthPaidFor}</TableCell>
                  <TableCell className="font-medium">{item.amount}</TableCell>
                  <TableCell>{item.method}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                  </TableCell>
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
                <TableHead>Date Reported</TableHead>
                <TableHead>Issue Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Completion Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>{item.dateReported}</TableCell>
                  <TableCell>{item.issueType}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                  </TableCell>
                  <TableCell>{item.completionDate}</TableCell>
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
                <TableHead>Event Type</TableHead>
                <TableHead>Booking Date</TableHead>
                <TableHead>Event Date</TableHead>
                <TableHead>Time Slot</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>{item.eventType}</TableCell>
                  <TableCell>{item.bookingDate}</TableCell>
                  <TableCell>{item.eventDate}</TableCell>
                  <TableCell>{item.timeSlot}</TableCell>
                  <TableCell className="font-medium">{item.fee}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case 'feedback':
        return (
          <div className="space-y-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Card>
              <CardHeader>
                <CardTitle>Submit New Complaint</CardTitle>
                <CardDescription>
                  Report any issues or provide feedback about your space
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Describe your complaint or feedback..."
                  value={newComplaint}
                  onChange={(e) => setNewComplaint(e.target.value)}
                  rows={4}
                />
                <Button onClick={handleSubmitComplaint}>
                  Submit Complaint
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Data to View</CardTitle>
          <CardDescription>
            Choose the type of information you want to access from your tenant account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedDataType} onValueChange={setSelectedDataType}>
            <SelectTrigger>
              <SelectValue placeholder="Choose data type to view" />
            </SelectTrigger>
            <SelectContent>
              {dataTypeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedDataType && (
        <Card>
          <CardHeader>
            <CardTitle>
              {dataTypeOptions.find(opt => opt.value === selectedDataType)?.label}
            </CardTitle>
            <CardDescription>
              View and manage your {selectedDataType.replace(/([A-Z])/g, ' $1').toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderDataTable()}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TenantData;