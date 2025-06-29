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
import ErrorBoundary from "@/components/ErrorBoundary";
import DiagnosticPage from "@/components/DiagnosticPage";

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
import NewInspection from "@/pages/inspetor/NewInspection";

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
import { Monitoring } from "@/pages/admin/Monitoring";

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
      <Route path="/diagnostic" element={<DiagnosticPage />} />
      <Route path="/test-supabase" element={<TestSupabaseConnection />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/login" element={<Navigate to="/auth/login" replace />} />
      <Route path="/register" element={<Navigate to="/auth/register" replace />} />
      <Route path="/forgot-password" element={<Navigate to="/auth/forgot-password" replace />} />
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
      
      {/* Inspections routes */}
      <Route
        path="/inspections"
        element={
          <ProtectedRoute>
            <InspetorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inspections/new"
        element={
          <ProtectedRoute>
            <NewInspection />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inspections/:id"
        element={
          <ProtectedRoute>
            <InspectionExecution />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inspections/:id/execute"
        element={
          <ProtectedRoute>
            <InspectionExecution />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inspections/:id/details"
        element={
          <ProtectedRoute>
            <InspectionExecution />
          </ProtectedRoute>
        }
      />
      
      {/* Reports route */}
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />
      
      {/* Settings route */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Billing />
          </ProtectedRoute>
        }
      />
      
      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <SystemOverview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/sistema"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <SystemOverview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/system"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <SystemOverview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/clientes"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ClientManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/clients"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ClientManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/voz"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <VoiceLogs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/voice-logs"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <VoiceLogs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/monitoring"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Monitoring />
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
      />
      <Route
        path="/team"
        element={
          <ProtectedRoute allowedRoles={['gestor']}>
            <TeamDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gestor/team"
        element={
          <ProtectedRoute allowedRoles={['gestor']}>
            <TeamInspections />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gestor/modelos"
        element={
          <ProtectedRoute allowedRoles={['gestor']}>
            <TemplateManager />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gestor/templates"
        element={
          <ProtectedRoute allowedRoles={['gestor']}>
            <TemplateManager />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gestor/analytics"
        element={
          <ProtectedRoute allowedRoles={['gestor']}>
            <Analytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gestor/faturamento"
        element={
          <ProtectedRoute allowedRoles={['gestor']}>
            <Billing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gestor/billing"
        element={
          <ProtectedRoute allowedRoles={['gestor']}>
            <Billing />
          </ProtectedRoute>
        }
      />

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
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <PermissionsProvider>
            <VoiceAssistantProvider>
              <BrowserRouter>
                <TooltipProvider>
                  <SecurityInitializer>
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
    </ErrorBoundary>
  );
};

export default App;