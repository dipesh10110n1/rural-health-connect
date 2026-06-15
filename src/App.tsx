import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VoiceProvider } from "@/components/VoiceProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthSelection from "./pages/AuthSelection";
import PatientAuth from "./pages/auth/PatientAuth";
import DoctorAuth from "./pages/auth/DoctorAuth";
import HospitalAuth from "./pages/auth/HospitalAuth";
import AshaWorkerAuth from "./pages/auth/AshaWorkerAuth";
import RelativeAuth from "./pages/auth/RelativeAuth";
import PatientDashboard from "./pages/dashboards/PatientDashboard";
import DoctorDashboard from "./pages/dashboards/DoctorDashboard";
import HospitalDashboard from "./pages/dashboards/HospitalDashboard";
import AshaWorkerDashboard from "./pages/dashboards/AshaWorkerDashboard";
import RelativeDashboard from "./pages/dashboards/RelativeDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <VoiceProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthSelection />} />
              <Route path="/auth/patient" element={<PatientAuth />} />
              <Route path="/auth/doctor" element={<DoctorAuth />} />
              <Route path="/auth/hospital" element={<HospitalAuth />} />
              <Route path="/auth/asha-worker" element={<AshaWorkerAuth />} />
              <Route path="/auth/relative" element={<RelativeAuth />} />
              <Route path="/dashboard/patient" element={<PatientDashboard />} />
              <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
              <Route path="/dashboard/hospital" element={<HospitalDashboard />} />
              <Route path="/dashboard/asha-worker" element={<AshaWorkerDashboard />} />
              <Route path="/dashboard/relative" element={<RelativeDashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </VoiceProvider>
  </QueryClientProvider>
);

export default App;
