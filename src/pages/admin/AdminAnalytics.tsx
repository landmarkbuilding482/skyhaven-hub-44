import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, Building, AlertTriangle, CheckCircle, FileText, Wrench } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { format, differenceInDays } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const AdminAnalytics = () => {
  const [data, setData] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    totalTenants: 0,
    totalComplaints: 0,
    totalMaintenance: 0,
    occupancyPercentage: 0,
    totalSquareMeters: 0,
    occupiedSquareMeters: 0
  });
  const [tenantRentData, setTenantRentData] = useState([]);
  const [rentStatusData, setRentStatusData] = useState([]);
  const [complaintsStatusData, setComplaintsStatusData] = useState([]);
  const [maintenanceStatusData, setMaintenanceStatusData] = useState([]);
  const [showComplaintsDialog, setShowComplaintsDialog] = useState(false);
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      // Fetch total revenue
      const { data: revenueData } = await supabase
        .from('revenue_expenses')
        .select('amount, type');

      // Fetch tenant count
      const { data: tenantData } = await supabase
        .from('tenants')
        .select('id, name');

      // Fetch complaints count and status breakdown
      const { data: complaintsData } = await supabase
        .from('feedback_complaints')
        .select('id, status');

      // Fetch maintenance count and status breakdown
      const { data: maintenanceData } = await supabase
        .from('maintenance_repairs')
        .select('id, status');

      // Fetch occupancy data
      const { data: occupancyData } = await supabase
        .from('floor_occupancy')
        .select('square_meters_available, square_meters_occupied');

      // Fetch tenant rent data with latest payments
      const { data: tenantsWithRent } = await supabase
        .from('tenants')
        .select('id, name, monthly_rent, first_payment_date');

      const { data: rentPayments } = await supabase
        .from('rent_payments')
        .select('tenant_id, last_paid_rent_date')
        .order('last_paid_rent_date', { ascending: false });

      // Calculate totals
      const totalRevenue = revenueData?.filter(r => r.type === 'Revenue').reduce((sum, r) => sum + Number(r.amount), 0) || 0;
      const totalExpenses = revenueData?.filter(r => r.type === 'Expense').reduce((sum, r) => sum + Number(r.amount), 0) || 0;
      const totalSquareMeters = occupancyData?.reduce((sum, o) => sum + Number(o.square_meters_available), 0) || 0;
      const occupiedSquareMeters = occupancyData?.reduce((sum, o) => sum + Number(o.square_meters_occupied), 0) || 0;
      const occupancyPercentage = totalSquareMeters > 0 ? (occupiedSquareMeters / totalSquareMeters) * 100 : 0;

      setData({
        totalRevenue,
        totalExpenses,
        totalTenants: tenantData?.length || 0,
        totalComplaints: complaintsData?.length || 0,
        totalMaintenance: maintenanceData?.length || 0,
        occupancyPercentage,
        totalSquareMeters,
        occupiedSquareMeters
      });

      // Process tenant rent data
      const kigaliTimezone = 'Africa/Kigali';
      const processedTenantRentData = tenantsWithRent?.map(tenant => {
        const latestPayment = rentPayments?.find(payment => payment.tenant_id === tenant.id);
        
        // If no payment record exists, show " - "
        if (!latestPayment) {
          return {
            name: tenant.name,
            monthlyRent: tenant.monthly_rent,
            daysDue: ' - ',
            status: 'no-record'
          };
        }

        const lastPaidDate = latestPayment.last_paid_rent_date;
        
        // Get today's date in Kigali timezone
        const today = toZonedTime(new Date(), kigaliTimezone);
        const dueDate = new Date(lastPaidDate);
        
        const daysRemaining = differenceInDays(dueDate, today);
        
        return {
          name: tenant.name,
          monthlyRent: tenant.monthly_rent,
          daysDue: daysRemaining > 0 ? `${daysRemaining} days remaining` : `${Math.abs(daysRemaining)} days overdue`,
          status: daysRemaining > 0 ? 'on-time' : 'overdue'
        };
      }) || [];

      setTenantRentData(processedTenantRentData);

      // Process rent status data for pie chart
      const onTimeCount = processedTenantRentData.filter(t => t.status === 'on-time').length;
      const overdueCount = processedTenantRentData.filter(t => t.status === 'overdue').length;

      setRentStatusData([
        { name: 'On Time', value: onTimeCount, color: '#22c55e' },
        { name: 'Overdue', value: overdueCount, color: '#ef4444' }
      ].filter(item => item.value > 0));

      // Process complaints status data
      const complaintsStatusBreakdown = complaintsData?.reduce((acc, complaint) => {
        acc[complaint.status] = (acc[complaint.status] || 0) + 1;
        return acc;
      }, {}) || {};

      setComplaintsStatusData(Object.entries(complaintsStatusBreakdown).map(([status, count]) => ({
        status,
        count
      })));

      // Process maintenance status data
      const maintenanceStatusBreakdown = maintenanceData?.reduce((acc, maintenance) => {
        acc[maintenance.status] = (acc[maintenance.status] || 0) + 1;
        return acc;
      }, {}) || {};

      setMaintenanceStatusData(Object.entries(maintenanceStatusBreakdown).map(([status, count]) => ({
        status,
        count
      })));

    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  const kpiData = [
    {
      title: "Total Revenue",
      value: `$${data.totalRevenue.toLocaleString()}`,
      change: "+8.2%",
      trend: "up",
      icon: DollarSign,
      description: "All time revenue"
    },
    {
      title: "Total Expenses",
      value: `$${data.totalExpenses.toLocaleString()}`,
      change: "+5.1%",
      trend: "up",
      icon: TrendingDown,
      description: "All time expenses"
    },
    {
      title: "Total Tenants",
      value: data.totalTenants.toString(),
      change: "+3",
      trend: "up",
      icon: Users,
      description: "Active tenants"
    },
    {
      title: "Floor Occupancy",
      value: `${data.occupancyPercentage.toFixed(1)}%`,
      change: "+2.1%",
      trend: "up",
      icon: Building,
      description: "Space utilization"
    },
    {
      title: "Total Complaints",
      value: data.totalComplaints.toString(),
      change: "-2",
      trend: "down",
      icon: FileText,
      description: "All complaints",
      clickable: true,
      onClick: () => setShowComplaintsDialog(true)
    },
    {
      title: "Total Maintenance",
      value: data.totalMaintenance.toString(),
      change: "+1",
      trend: "up",
      icon: Wrench,
      description: "Maintenance requests",
      clickable: true,
      onClick: () => setShowMaintenanceDialog(true)
    }
  ];


  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card 
              key={index} 
              className={kpi.clickable ? "cursor-pointer hover:shadow-md transition-shadow" : ""}
              onClick={kpi.onClick}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <h3 className="text-xl font-bold">{kpi.value}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
                  </div>
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Rent Status Pie Chart */}
      {rentStatusData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Rent Payment Status Distribution</CardTitle>
            <CardDescription>Count of tenants by payment status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={rentStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {rentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tenant Rent Due Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tenant Rent Payment Status</CardTitle>
          <CardDescription>Days remaining or overdue for each tenant</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant Name</TableHead>
                <TableHead>Monthly Rent</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenantRentData.map((tenant, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{tenant.name}</TableCell>
                  <TableCell>${tenant.monthlyRent}</TableCell>
                  <TableCell>{tenant.daysDue}</TableCell>
                  <TableCell>
                    {tenant.status === 'no-record' ? (
                      <Badge variant="secondary">No Record</Badge>
                    ) : (
                      <Badge variant={tenant.status === 'overdue' ? 'destructive' : 'default'}>
                        {tenant.status === 'overdue' ? 'Overdue' : 'On Time'}
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Complaints Status Dialog */}
      <Dialog open={showComplaintsDialog} onOpenChange={setShowComplaintsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complaints by Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {complaintsStatusData.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="font-medium">{item.status}</span>
                <Badge variant="secondary">{item.count}</Badge>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Maintenance Status Dialog */}
      <Dialog open={showMaintenanceDialog} onOpenChange={setShowMaintenanceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Maintenance by Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {maintenanceStatusData.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="font-medium">{item.status}</span>
                <Badge variant="secondary">{item.count}</Badge>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAnalytics;