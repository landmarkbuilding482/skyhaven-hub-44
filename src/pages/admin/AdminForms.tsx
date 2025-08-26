import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, FileText, CreditCard, Wrench, Zap, Users, Calendar, MessageSquare, DollarSign, Package, Building, Car, PieChart, Shield } from "lucide-react";

const AdminForms = () => {
  const [selectedForm, setSelectedForm] = useState("tenant");

  const forms = [
    { id: "tenant", label: "Tenant Registration", icon: User },
    { id: "lease", label: "Lease Agreement", icon: FileText },
    { id: "rent", label: "Rent Payment", icon: CreditCard },
    { id: "maintenance", label: "Maintenance & Repairs", icon: Wrench },
    { id: "utilities", label: "Utilities", icon: Zap },
    { id: "visitor", label: "Visitor Foot Traffic", icon: Users },
    { id: "event", label: "Event Booking", icon: Calendar },
    { id: "feedback", label: "Feedback & Complaints", icon: MessageSquare },
    { id: "revenue", label: "Revenue & Expenses", icon: DollarSign },
    { id: "asset", label: "Asset Inventory", icon: Package },
    { id: "floor_occupancy", label: "Floor Occupancy", icon: Building },
    { id: "parking_allocations", label: "Parking Allocations", icon: Car },
    { id: "parking_statistics", label: "Parking Statistics", icon: PieChart },
    { id: "tenant_credentials", label: "Tenant Login Credentials", icon: Shield },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`${forms.find(f => f.id === selectedForm)?.label} form submitted successfully!`);
  };

  const renderForm = () => {
    switch (selectedForm) {
      case "tenant":
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tenantName">Tenant Name</Label>
                <Input id="tenantName" placeholder="Company/Individual Name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="floor">Floor</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select floor" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({length: 15}, (_, i) => (
                      <SelectItem key={i} value={`${i + 1}`}>{i + 1}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="spaceType">Space Type</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select space type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="event">Event Space</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type</Label>
                <Input id="businessType" placeholder="e.g., Technology, Retail, Services" required />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="leaseStart">Lease Start Date</Label>
                <Input id="leaseStart" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="leaseEnd">Lease End Date</Label>
                <Input id="leaseEnd" type="date" required />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyRent">Monthly Rent</Label>
                <Input id="monthlyRent" type="number" placeholder="0.00" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactInfo">Contact Information</Label>
                <Input id="contactInfo" placeholder="Email or Phone" required />
              </div>
            </div>
            <Button type="submit" className="w-full">Register Tenant</Button>
          </form>
        );

      case "lease":
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tenantSelect">Select Tenant</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="T001">TechCorp Solutions</SelectItem>
                    <SelectItem value="T002">Fashion Boutique</SelectItem>
                    <SelectItem value="T003">Legal Associates</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="leaseFloor">Floor</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select floor" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({length: 15}, (_, i) => (
                      <SelectItem key={i} value={`${i + 1}`}>{i + 1}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="depositAmount">Deposit Amount</Label>
                <Input id="depositAmount" type="number" placeholder="0.00" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rentAmount">Monthly Rent Amount</Label>
                <Input id="rentAmount" type="number" placeholder="0.00" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="termsSummary">Terms Summary</Label>
              <Textarea id="termsSummary" placeholder="Lease terms and conditions..." rows={4} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="renewalDate">Renewal Date</Label>
              <Input id="renewalDate" type="date" required />
            </div>
            <Button type="submit" className="w-full">Create Lease Agreement</Button>
          </form>
        );

      case "rent":
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rentTenant">Select Tenant</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="T001">TechCorp Solutions</SelectItem>
                    <SelectItem value="T002">Fashion Boutique</SelectItem>
                    <SelectItem value="T003">Legal Associates</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentDate">Payment Date</Label>
                <Input id="paymentDate" type="date" required />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthPaidFor">Month Paid For</Label>
                <Input id="monthPaidFor" placeholder="e.g., August 2024" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amountPaid">Amount Paid</Label>
                <Input id="amountPaid" type="number" placeholder="0.00" required />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="online">Online Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentStatus">Status</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea id="remarks" placeholder="Additional notes..." rows={3} />
            </div>
            <Button type="submit" className="w-full">Record Payment</Button>
          </form>
        );

      case "maintenance":
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reportDate">Date Reported</Label>
                <Input id="reportDate" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maintenanceFloor">Floor</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select floor" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({length: 15}, (_, i) => (
                      <SelectItem key={i} value={`${i + 1}`}>{i + 1}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issueType">Issue Type</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HVAC">HVAC</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="Plumbing">Plumbing</SelectItem>
                    <SelectItem value="Cleaning">Cleaning</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignedVendor">Assigned Vendor</Label>
                <Input id="assignedVendor" placeholder="Vendor name" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="issueDescription">Description</Label>
              <Textarea id="issueDescription" placeholder="Detailed description of the issue..." rows={4} required />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost">Estimated Cost</Label>
                <Input id="cost" type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maintenanceStatus">Status</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reported">Reported</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full">Submit Maintenance Request</Button>
          </form>
        );

      case "utilities":
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="utilityDate">Date</Label>
                <Input id="utilityDate" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="utilityFloor">Floor</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select floor" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({length: 15}, (_, i) => (
                      <SelectItem key={i} value={`${i + 1}`}>{i + 1}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="utilityType">Utility Type</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select utility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electricity">Electricity</SelectItem>
                    <SelectItem value="water">Water</SelectItem>
                    <SelectItem value="internet">Internet</SelectItem>
                    <SelectItem value="gas">Gas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="usage">Usage</Label>
                <Input id="usage" placeholder="Usage amount" required />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="utilityCost">Cost</Label>
                <Input id="utilityCost" type="number" placeholder="0.00" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billedTo">Billed To</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select who pays" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="landlord">Landlord</SelectItem>
                    <SelectItem value="tenant">Tenant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full">Record Utility Usage</Button>
          </form>
        );

      case "visitor":
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="visitDate">Date</Label>
                <Input id="visitDate" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Area</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ground">Ground Floor</SelectItem>
                    <SelectItem value="rooftop">Rooftop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entryTime">Entry Time</Label>
                <Input id="entryTime" type="time" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exitTime">Exit Time</Label>
                <Input id="exitTime" type="time" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="visitorCount">Visitor Count</Label>
                <Input id="visitorCount" type="number" placeholder="Number of visitors" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialEvent">Special Event?</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full">Record Visitor Traffic</Button>
          </form>
        );

      case "event":
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name</Label>
                <Input id="clientName" placeholder="Event organizer name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventType">Event Type</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wedding">Wedding</SelectItem>
                    <SelectItem value="corporate">Corporate Event</SelectItem>
                    <SelectItem value="party">Private Party</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bookingDate">Booking Date</Label>
                <Input id="bookingDate" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventDate">Event Date</Label>
                <Input id="eventDate" type="date" required />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timeSlot">Time Slot</Label>
                <Input id="timeSlot" placeholder="e.g., 6:00 PM - 11:00 PM" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rentalFee">Rental Fee</Label>
                <Input id="rentalFee" type="number" placeholder="0.00" required />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="extras">Extras</Label>
                <Input id="extras" placeholder="Additional services, equipment, etc." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventPaymentStatus">Payment Status</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full">Book Event</Button>
          </form>
        );

      case "feedback":
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tenant">Tenant</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                    <SelectItem value="visitor">Visitor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedbackDate">Date</Label>
                <Input id="feedbackDate" type="date" required />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="feedbackFloor">Floor</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select floor (if applicable)" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({length: 15}, (_, i) => (
                      <SelectItem key={i} value={`${i + 1}`}>{i + 1}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedbackType">Feedback Type</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complaint">Complaint</SelectItem>
                    <SelectItem value="suggestion">Suggestion</SelectItem>
                    <SelectItem value="compliment">Compliment</SelectItem>
                    <SelectItem value="request">Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedbackDescription">Description</Label>
              <Textarea id="feedbackDescription" placeholder="Detailed feedback or complaint..." rows={4} required />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="actionTaken">Action Taken</Label>
                <Textarea id="actionTaken" placeholder="What action was taken..." rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedbackStatus">Status</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full">Submit Feedback</Button>
          </form>
        );

      case "revenue":
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="revenueDate">Date</Label>
                <Input id="revenueDate" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rent">Rent</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="parking">Parking</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" placeholder="Specific category" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" placeholder="0.00" required />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="revenueNotes">Notes</Label>
                <Input id="revenueNotes" placeholder="Additional notes" />
              </div>
            </div>
            <Button type="submit" className="w-full">Record Transaction</Button>
          </form>
        );

      case "asset":
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assetName">Asset Name</Label>
                <Input id="assetName" placeholder="Asset name/description" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Floor/Room/Area" required />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input id="purchaseDate" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assetCost">Cost</Label>
                <Input id="assetCost" type="number" placeholder="0.00" required />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="needs-replacement">Needs Replacement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maintenanceSchedule">Maintenance Schedule</Label>
                <Input id="maintenanceSchedule" placeholder="e.g., Monthly, Quarterly" />
              </div>
            </div>
            <Button type="submit" className="w-full">Add Asset</Button>
          </form>
        );

      case "floor_occupancy":
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="floor">Floor</Label>
                <Input id="floor" placeholder="Floor number or identifier" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="event">Event Space</SelectItem>
                    <SelectItem value="common">Common Area</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sqmAvailable">Square Meters Available</Label>
                <Input id="sqmAvailable" type="number" placeholder="0.00" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sqmOccupied">Square Meters Occupied</Label>
                <Input id="sqmOccupied" type="number" placeholder="0.00" required />
              </div>
            </div>
            <Button type="submit" className="w-full">Add Floor Occupancy</Button>
          </form>
        );

      case "parking_allocations":
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" placeholder="Company name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spotsAllowed">Spots Allowed</Label>
                <Input id="spotsAllowed" type="number" placeholder="Number of spots" required />
              </div>
            </div>
            <Button type="submit" className="w-full">Add Parking Allocation</Button>
          </form>
        );

      case "parking_statistics":
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="spotsAvailable">Spots Available</Label>
                <Input id="spotsAvailable" type="number" placeholder="Number of available spots" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spotsOccupied">Spots Occupied</Label>
                <Input id="spotsOccupied" type="number" placeholder="Number of occupied spots" required />
              </div>
            </div>
            <Button type="submit" className="w-full">Update Parking Statistics</Button>
          </form>
        );

      case "tenant_credentials":
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tenantSelect">Select Tenant</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Choose tenant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="T001">TechCorp Solutions</SelectItem>
                  <SelectItem value="T002">Fashion Boutique</SelectItem>
                  <SelectItem value="T003">Legal Associates</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tenantLoginId">Tenant Login ID</Label>
                <Input id="tenantLoginId" placeholder="Username for tenant login" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Password" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="isActive">Status</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">Create Login Credentials</Button>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Entry Buttons Section */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Entry Buttons</CardTitle>
          <CardDescription>
            Click any button below to add a new entry to the corresponding table
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {forms.map((form) => {
              const IconComponent = form.icon;
              return (
                <Button
                  key={form.id}
                  variant="outline"
                  className="h-20 flex flex-col gap-2"
                  onClick={() => setSelectedForm(form.id)}
                >
                  <IconComponent className="h-6 w-6" />
                  <span className="text-xs text-center">{form.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Entry Forms</CardTitle>
          <CardDescription>
            Select a form to enter new data into the building management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedForm} onValueChange={setSelectedForm}>
            <TabsList className="grid grid-cols-5 w-full">
              {forms.slice(0, 5).map((form) => {
                const Icon = form.icon;
                return (
                  <TabsTrigger key={form.id} value={form.id} className="flex items-center gap-1">
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{form.label.split(' ')[0]}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <TabsList className="grid grid-cols-5 w-full mt-2">
              {forms.slice(5, 10).map((form) => {
                const Icon = form.icon;
                return (
                  <TabsTrigger key={form.id} value={form.id} className="flex items-center gap-1">
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{form.label.split(' ')[0]}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <TabsList className="grid grid-cols-4 w-full mt-2">
              {forms.slice(10).map((form) => {
                const Icon = form.icon;
                return (
                  <TabsTrigger key={form.id} value={form.id} className="flex items-center gap-1">
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{form.label.split(' ')[0]}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {forms.find(f => f.id === selectedForm)?.label}
          </CardTitle>
          <CardDescription>
            Fill out the form below to add new {selectedForm} data
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderForm()}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminForms;