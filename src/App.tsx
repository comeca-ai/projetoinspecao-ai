import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Auth pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";

// App pages
import Dashboard from "@/pages/Dashboard";
import Index from "@/pages/Index";
import Unauthorized from "@/pages/Unauthorized";
import NotFound from "@/pages/NotFound";

// Inspetor pages
import InspetorDashboard from "@/pages/inspetor/Dashboard";
import InspectionExecution from "@/pages/inspetor/InspectionExecution";

// Gestor pages
import TeamDashboard from "@/pages/gestor/TeamDashboard";
import TemplateManager from "@/pages/gestor/TemplateManager";
import Analytics from "@/pages/gestor/Analytics";
import Billing from "@/pages/gestor/Billing";
import TeamInspections from "@/pages/gestor/TeamInspections";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Landing page */}
            <Route path="/" element={<Index />} />
            
            {/* Public routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Inspetor routes */}
            <Route
              path="/inspections"
              element={
                <ProtectedRoute roles={['inspetor']}>
                  <InspetorDashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/inspections/:id/execute"
              element={
                <ProtectedRoute roles={['inspetor']}>
                  <InspectionExecution />
                </ProtectedRoute>
              }
            />
            
            {/* Gestor routes */}
            <Route
              path="/team"
              element={
                <ProtectedRoute roles={['gestor']}>
                  <TeamDashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/team-inspections"
              element={
                <ProtectedRoute roles={['gestor']}>
                  <TeamInspections />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/templates"
              element={
                <ProtectedRoute roles={['gestor']}>
                  <TemplateManager />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/analytics"
              element={
                <ProtectedRoute roles={['gestor']}>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/billing"
              element={
                <ProtectedRoute roles={['gestor']}>
                  <Billing />
                </ProtectedRoute>
              }
            />
            
            {/* Admin routes */}
            <Route
              path="/admin/clients"
              element={
                <ProtectedRoute roles={['admin']}>
                  <div className="p-6">Página de Clientes Admin (Em desenvolvimento)</div>
                </ProtectedRoute>
              }
            />
            
            {/* Utility routes */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;