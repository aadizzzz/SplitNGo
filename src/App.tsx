import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import BackToTop from "./components/BackToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import { AuthProvider } from "./hooks/useAuth";
import Home from "./pages/Home";
import Results from "./pages/Results";
import Booking from "./pages/Booking";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import HowItWorks from "./pages/HowItWorks";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import API from "./pages/API";
import About from "./pages/About";
import AboutDeveloper from "./pages/AboutDeveloper";
import Vision from "./pages/Vision";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import Support from "./pages/Support";
import HelpCenter from "./pages/HelpCenter";
import Safety from "./pages/Safety";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";

// Error Pages
import Error404 from "./pages/errors/Error404";
import Error500 from "./pages/errors/Error500";
import Error401 from "./pages/errors/Error401";
import Error403 from "./pages/errors/Error403";
import Error408 from "./pages/errors/Error408";
import Error503 from "./pages/errors/Error503";
import Offline from "./pages/errors/Offline";

// Admin Dashboards
import SuperAdminDashboard from "./pages/admin/SuperAdminDashboard";
import ZoneAdminDashboard from "./pages/admin/ZoneAdminDashboard";
import DivisionAdminDashboard from "./pages/admin/DivisionAdminDashboard";
import StationAdminDashboard from "./pages/admin/StationAdminDashboard";
import TTEDashboard from "./pages/admin/TTEDashboard";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <BackToTop />
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
            <Route path="/results" element={<Results />} />
            <Route path="/booking" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
            <Route path="/how-it-works" element={<Layout><HowItWorks /></Layout>} />
            <Route path="/features" element={<Layout><Features /></Layout>} />
            <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
            <Route path="/api" element={<Layout><API /></Layout>} />
            <Route path="/about-us" element={<Layout><About /></Layout>} />
            <Route path="/about-developer" element={<Layout><AboutDeveloper /></Layout>} />
            <Route path="/vision" element={<Layout><Vision /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/careers" element={<Layout><Careers /></Layout>} />
            <Route path="/support" element={<Layout><Support /></Layout>} />
            <Route path="/help-center" element={<Layout><HelpCenter /></Layout>} />
            <Route path="/safety" element={<Layout><Safety /></Layout>} />
            <Route path="/terms-of-service" element={<Layout><TermsOfService /></Layout>} />
            <Route path="/privacy-policy" element={<Layout><PrivacyPolicy /></Layout>} />
            
            {/* Admin Routes */}
            <Route path="/admin/super" element={<RoleProtectedRoute requiredRole="super_admin"><Layout><SuperAdminDashboard /></Layout></RoleProtectedRoute>} />
            <Route path="/admin/zone" element={<RoleProtectedRoute requiredRole="zone_admin"><Layout><ZoneAdminDashboard /></Layout></RoleProtectedRoute>} />
            <Route path="/admin/division" element={<RoleProtectedRoute requiredRole="division_admin"><Layout><DivisionAdminDashboard /></Layout></RoleProtectedRoute>} />
            <Route path="/admin/station" element={<RoleProtectedRoute requiredRole="station_admin"><Layout><StationAdminDashboard /></Layout></RoleProtectedRoute>} />
            <Route path="/admin/tte" element={<RoleProtectedRoute requiredRole="tte"><Layout><TTEDashboard /></Layout></RoleProtectedRoute>} />
            
            {/* Error Pages */}
            <Route path="/500" element={<Error500 />} />
            <Route path="/401" element={<Error401 />} />
            <Route path="/403" element={<Error403 />} />
            <Route path="/408" element={<Error408 />} />
            <Route path="/503" element={<Error503 />} />
            <Route path="/offline" element={<Offline />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<Error404 />} />
          </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;

