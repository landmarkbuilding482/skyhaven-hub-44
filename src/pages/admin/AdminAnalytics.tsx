import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Users, Building, Calendar, AlertTriangle, CheckCircle } from "lucide-react";

const AdminAnalytics = () => {
  // Mock data for charts
  const occupancyData = [
    { floor: "Floor 1", occupied: 80, vacant: 20 },
    { floor: "Floor 2", occupied: 95, vacant: 5 },
    { floor: "Floor 3", occupied: 75, vacant: 25 },
    { floor: "Floor 4", occupied: 90, vacant: 10 },
    { floor: "Floor 5", occupied: 100, vacant: 0 },
    { floor: "Floor 6", occupied: 60, vacant: 40 },
    { floor: "Floor 7", occupied: 85, vacant: 15 },
    { floor: "Floor 8", occupied: 100, vacant: 0 },
  ];

  const revenueData = [
    { month: "Jan", rent: 45000, events: 5000, other: 2000, expenses: 15000 },
    { month: "Feb", rent: 47000, events: 3500, other: 1800, expenses: 16000 },
    { month: "Mar", rent: 46500, events: 7200, other: 2200, expenses: 14500 },
    { month: "Apr", rent: 48000, events: 4800, other: 1900, expenses: 15800 },
    { month: "May", rent: 49500, events: 8500, other: 2400, expenses: 17200 },
    { month: "Jun", rent: 50000, events: 6200, other: 2100, expenses: 16500 },
    { month: "Jul", rent: 51000, events: 9800, other: 2600, expenses: 18000 },
    { month: "Aug", rent: 52000, events: 7500, other: 2300, expenses: 17500 },
  ];

  const trafficData = [
    { day: "Mon", ground: 120, rooftop: 15 },
    { day: "Tue", ground: 95, rooftop: 8 },
    { day: "Wed", ground: 110, rooftop: 12 },
    { day: "Thu", ground: 130, rooftop: 20 },
    { day: "Fri", ground: 180, rooftop: 45 },
    { day: "Sat", ground: 200, rooftop: 85 },
    { day: "Sun", ground: 160, rooftop: 120 },
  ];

  const maintenanceData = [
    { name: "HVAC", value: 35, color: "#0088FE" },
    { name: "Electrical", value: 25, color: "#00C49F" },
    { name: "Plumbing", value: 20, color: "#FFBB28" },
    { name: "Security", value: 12, color: "#FF8042" },
    { name: "Other", value: 8, color: "#8884D8" },
  ];

  const eventTypes = [
    { name: "Corporate", value: 45, color: "#0088FE" },
    { name: "Wedding", value: 30, color: "#00C49F" },
    { name: "Party", value: 15, color: "#FFBB28" },
    { name: "Conference", value: 10, color: "#FF8042" },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const kpiData = [
    {
      title: "Total Monthly Revenue",
      value: "$62,800",
      change: "+8.2%",
      trend: "up",
      icon: DollarSign,
      description: "vs last month"
    },
    {
      title: "Occupancy Rate",
      value: "85.7%",
      change: "+2.1%",
      trend: "up",
      icon: Building,
      description: "vs last month"
    },
    {
      title: "Active Tenants",
      value: "47",
      change: "+3",
      trend: "up",
      icon: Users,
      description: "new this month"
    },
    {
      title: "Event Bookings",
      value: "12",
      change: "-2",
      trend: "down",
      icon: Calendar,
      description: "vs last month"
    },
  ];

  const alertsData = [
    { type: "Maintenance", count: 3, level: "high", icon: AlertTriangle },
    { type: "Late Payments", count: 2, level: "medium", icon: DollarSign },
    { type: "Lease Renewals", count: 5, level: "low", icon: CheckCircle },
    { type: "Vacant Units", count: 8, level: "medium", icon: Building },
  ];

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <h3 className="text-2xl font-bold">{kpi.value}</h3>
                      <div className={`flex items-center gap-1 ${
                        kpi.trend === 'up' ? 'text-success' : 'text-destructive'
                      }`}>
                        {kpi.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="text-sm font-medium">{kpi.change}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
                  </div>
                  <Icon className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>System Alerts & Notifications</CardTitle>
          <CardDescription>Items requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {alertsData.map((alert, index) => {
              const Icon = alert.icon;
              const levelColors = {
                high: 'bg-destructive text-destructive-foreground',
                medium: 'bg-warning text-warning-foreground',
                low: 'bg-success text-success-foreground'
              };
              
              return (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{alert.type}</p>
                      <p className="text-sm text-muted-foreground">{alert.count} items</p>
                    </div>
                  </div>
                  <Badge className={levelColors[alert.level as keyof typeof levelColors]}>
                    {alert.level}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Revenue & Occupancy Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Analysis</CardTitle>
            <CardDescription>Monthly revenue vs expenses breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, '']} />
                <Bar dataKey="rent" stackId="a" fill="#0088FE" name="Rent" />
                <Bar dataKey="events" stackId="a" fill="#00C49F" name="Events" />
                <Bar dataKey="other" stackId="a" fill="#FFBB28" name="Other" />
                <Bar dataKey="expenses" fill="#FF8042" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Occupancy by Floor</CardTitle>
            <CardDescription>Current occupancy rates across all floors</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="floor" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="occupied" fill="#00C49F" name="Occupied %" />
                <Bar dataKey="vacant" fill="#FF8042" name="Vacant %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Traffic & Maintenance Analysis */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Visitor Foot Traffic</CardTitle>
            <CardDescription>Daily visitor traffic patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="ground"
                  stackId="1"
                  stroke="#0088FE"
                  fill="#0088FE"
                  name="Ground Floor"
                />
                <Area
                  type="monotone"
                  dataKey="rooftop"
                  stackId="1"
                  stroke="#00C49F"
                  fill="#00C49F"
                  name="Rooftop"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance Issues Distribution</CardTitle>
            <CardDescription>Breakdown of maintenance requests by type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={maintenanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {maintenanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Event Analysis */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Event Space Utilization</CardTitle>
            <CardDescription>Event bookings by type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={eventTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {eventTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Performance Metrics</CardTitle>
            <CardDescription>Monthly performance summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm font-medium">Average Response Time</span>
              <span className="text-sm text-muted-foreground">2.3 hours</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm font-medium">Tenant Satisfaction</span>
              <span className="text-sm text-muted-foreground">94.2%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm font-medium">Complaint Resolution Rate</span>
              <span className="text-sm text-muted-foreground">98.1%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm font-medium">Event Space Revenue</span>
              <span className="text-sm text-muted-foreground">$8,500</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm font-medium">Utility Cost per Sq Ft</span>
              <span className="text-sm text-muted-foreground">$2.45</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium">Marketing ROI</span>
              <span className="text-sm text-success">+285%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;