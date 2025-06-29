import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { PermissionsProvider } from "@/contexts/PermissionsContext";
import { VoiceAssistantProvider } from "@/contexts/VoiceAssistantContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Loading from "@/components/ui/Loading";
import SecurityInitializer from "@/components/security/SecurityInitializer";
import { TestSupabaseConnection } from "@/components/TestSupabaseConnection";

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

// Admin pages
import ClientManagement from "@/pages/admin/ClientManagement";
import SystemOverview from "@/pages/admin/SystemOverview";
import VoiceLogs from "@/pages/admin/VoiceLogs";

// AppRoutes component to handle routing with auth
const AppRoutes = () => {
  const { loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <Routes location={location} key={location.pathname}>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

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
        path="/inspetor"
        element={
          <ProtectedRoute allowedRoles={['inspetor']}>
            <InspetorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inspetor/executar/:id"
        element={
          <ProtectedRoute allowedRoles={['inspetor']}>
            <InspectionExecution />
          </ProtectedRoute>
        }
      />

      {/* Gestor routes */}
      <Route
        path="/gestor"
        element={
          <ProtectedRoute allowedRoles={['gestor']}>
            <TeamDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<TeamInspections />} />
        <Route path="modelos" element={<TemplateManager />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="faturamento" element={<Billing />} />
      </Route>

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <SystemOverview />
          </ProtectedRoute>
        }
      >
        <Route path="clientes" element={<ClientManagement />} />
        <Route path="sistema" element={<SystemOverview />} />
        <Route path="voz" element={<VoiceLogs />} />
      </Route>

      {/* 404 - Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PermissionsProvider>
          <VoiceAssistantProvider>
            <BrowserRouter>
              <TooltipProvider>
                <SecurityInitializer>
                  {/* Temporary test route for Supabase connection */}
                  <Routes>
                    <Route path="/test-supabase" element={<TestSupabaseConnection />} />
                  </Routes>
                  <AppRoutes />
                </SecurityInitializer>
              </TooltipProvider>
              <Toaster />
              <Sonner />
            </BrowserRouter>
          </VoiceAssistantProvider>
        </PermissionsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;