import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import LoginPage from "./components/auth/LoginPage";
import TenantPortal from "./pages/tenant/TenantPortal";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SuperAdminManagement from "./pages/admin/SuperAdminManagement";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route 
              path="/" 
              element={
                <Layout>
                  <Home />
                </Layout>
              } 
            />
            <Route 
              path="/about" 
              element={
                <Layout>
                  <About />
                </Layout>
              } 
            />
            <Route 
              path="/contact" 
              element={
                <Layout>
                  <Contact />
                </Layout>
              } 
            />
            <Route 
              path="/tenant" 
              element={
                <ProtectedRoute requiredRole="tenant">
                  <Layout>
                    <TenantPortal />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole={["admin", "superadmin"]}>
                  <Layout>
                    <AdminDashboard />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/management" 
              element={
                <ProtectedRoute requiredRole="superadmin">
                  <Layout>
                    <SuperAdminManagement />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
