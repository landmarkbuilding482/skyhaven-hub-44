import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Users, Building, CalendarIcon, AlertTriangle, CheckCircle, FileText, Wrench } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { format, addDays, subDays } from 'date-fns';

const AdminAnalytics = () => {
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date }>({
    from: subDays(new Date(), 30),
    to: new Date()
  });
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
  const [rentPaymentData, setRentPaymentData] = useState([]);
  const [parkingData, setParkingData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);

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
        .select('id');

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

      // Fetch rent payments with due dates
      const { data: rentData } = await supabase
        .from('rent_payments')
        .select('payment_date, amount, last_paid_rent_date');

      // Fetch parking statistics
      const { data: parkingStats } = await supabase
        .from('parking_statistics')
        .select('spots_available, spots_occupied, created_at');

      // Fetch maintenance and complaints over time
      const { data: maintenanceTimeline } = await supabase
        .from('maintenance_repairs')
        .select('date_reported, status');

      const { data: complaintsTimeline } = await supabase
        .from('feedback_complaints')
        .select('date, status');

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

      // Process rent payment data for bar chart
      const processedRentData = rentData?.map((payment, index) => {
        const paymentDate = new Date(payment.payment_date);
        const today = new Date();
        const daysDifference = Math.ceil((today.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24));
        
        return {
          tenant: `Tenant ${index + 1}`,
          days: daysDifference > 30 ? -daysDifference : Math.max(0, 30 - daysDifference),
          amount: payment.amount
        };
      }) || [];

      setRentPaymentData(processedRentData.slice(0, 10)); // Show top 10

      // Process parking data
      const processedParkingData = parkingStats?.map(stat => ({
        date: format(new Date(stat.created_at), 'MMM dd'),
        occupied: stat.spots_occupied,
        available: stat.spots_available,
        total: stat.spots_occupied + stat.spots_available
      })) || [];

      setParkingData(processedParkingData);

      // Process timeline data
      const maintenanceByMonth = {};
      const complaintsByMonth = {};

      maintenanceTimeline?.forEach(item => {
        const month = format(new Date(item.date_reported), 'MMM yyyy');
        maintenanceByMonth[month] = (maintenanceByMonth[month] || 0) + 1;
      });

      complaintsTimeline?.forEach(item => {
        const month = format(new Date(item.date), 'MMM yyyy');
        complaintsByMonth[month] = (complaintsByMonth[month] || 0) + 1;
      });

      const allMonths = [...new Set([...Object.keys(maintenanceByMonth), ...Object.keys(complaintsByMonth)])];
      const timelineProcessed = allMonths.map(month => ({
        month,
        maintenance: maintenanceByMonth[month] || 0,
        complaints: complaintsByMonth[month] || 0
      }));

      setTimelineData(timelineProcessed);

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

  // Speedometer component for occupancy
  const SpeedometerChart = ({ percentage, label }) => {
    const angle = (percentage / 100) * 180 - 90;
    const color = percentage >= 80 ? '#22c55e' : percentage >= 60 ? '#f59e0b' : '#ef4444';
    
    return (
      <div className="relative w-48 h-24 mx-auto">
        <svg width="192" height="96" viewBox="0 0 192 96">
          <path
            d="M 16 80 A 80 80 0 0 1 176 80"
            fill="none"
            stroke="#e5e5e5"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <path
            d="M 16 80 A 80 80 0 0 1 176 80"
            fill="none"
            stroke={color}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={`${(percentage / 100) * 251.2} 251.2`}
          />
          <g transform={`translate(96,80) rotate(${angle})`}>
            <line x1="0" y1="0" x2="0" y2="-60" stroke="#374151" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="0" cy="0" r="4" fill="#374151"/>
          </g>
        </svg>
        <div className="absolute inset-0 flex items-end justify-center pb-2">
          <div className="text-center">
            <div className="text-2xl font-bold">{percentage.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">{label}</div>
          </div>
        </div>
      </div>
    );
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
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

      {/* Occupancy Speedometer and Rent Payments */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Occupancy Rate</CardTitle>
            <CardDescription>Current occupancy percentage and square meters</CardDescription>
          </CardHeader>
          <CardContent>
            <SpeedometerChart percentage={data.occupancyPercentage} label="Occupancy" />
            <div className="mt-4 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                {data.occupiedSquareMeters.toLocaleString()} / {data.totalSquareMeters.toLocaleString()} sq meters occupied
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rent Payment Status</CardTitle>
            <CardDescription>Days late (negative) or days remaining (positive)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rentPaymentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tenant" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [
                    typeof value === 'number' && value > 0 ? `${value} days remaining` : `${Math.abs(Number(value))} days late`,
                    'Status'
                  ]}
                  labelFormatter={(label) => `${label}`}
                />
                <Bar 
                  dataKey="days" 
                  fill="#22c55e"
                  name="Days"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Parking and Timeline Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Parking Usage</CardTitle>
            <CardDescription>
              Daily parking occupancy 
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-4">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Filter Date Range
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={parkingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="occupied" 
                  fill="#0088FE"
                  name="Occupied Spots"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance & Complaints Timeline</CardTitle>
            <CardDescription>Monthly trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="maintenance" 
                  stroke="#0088FE" 
                  strokeWidth={2}
                  name="Maintenance"
                />
                <Line 
                  type="monotone" 
                  dataKey="complaints" 
                  stroke="#FF8042" 
                  strokeWidth={2}
                  name="Complaints"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;