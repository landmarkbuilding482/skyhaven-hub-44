import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown, DollarSign, Users, Building, AlertTriangle, CheckCircle, FileText, Wrench } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { format, differenceInDays } from 'date-fns';

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

      // Fetch complaints count
      const { data: complaintsData } = await supabase
        .from('feedback_complaints')
        .select('id');

      // Fetch maintenance count
      const { data: maintenanceData } = await supabase
        .from('maintenance_repairs')
        .select('id');

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
      const processedTenantRentData = tenantsWithRent?.map(tenant => {
        const latestPayment = rentPayments?.find(payment => payment.tenant_id === tenant.id);
        const lastPaidDate = latestPayment?.last_paid_rent_date || tenant.first_payment_date;
        
        if (!lastPaidDate) {
          return {
            name: tenant.name,
            monthlyRent: tenant.monthly_rent,
            daysDue: 'No payment date',
            status: 'unknown'
          };
        }

        const today = new Date();
        const lastPaid = new Date(lastPaidDate);
        const nextDueDate = new Date(lastPaid);
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);
        
        const daysRemaining = differenceInDays(nextDueDate, today);
        
        return {
          name: tenant.name,
          monthlyRent: tenant.monthly_rent,
          daysDue: daysRemaining > 0 ? `${daysRemaining} days remaining` : `${Math.abs(daysRemaining)} days overdue`,
          status: daysRemaining > 0 ? 'on-time' : 'overdue'
        };
      }) || [];

      setTenantRentData(processedTenantRentData);

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
      description: "All complaints"
    },
    {
      title: "Total Maintenance",
      value: data.totalMaintenance.toString(),
      change: "+1",
      trend: "up",
      icon: Wrench,
      description: "Maintenance requests"
    }
  ];


  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index}>
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
                    <Badge 
                      variant={tenant.status === 'overdue' ? 'destructive' : 'default'}
                    >
                      {tenant.status === 'overdue' ? 'Overdue' : tenant.status === 'on-time' ? 'On Time' : 'Unknown'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;