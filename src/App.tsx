
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Destinations from "./pages/Destinations";
import DestinationDetail from "./pages/DestinationDetail";
import Bookings from "./pages/Bookings";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ContactUs from "./pages/ContactUs";
import Experiences from "./pages/Experiences";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path='/'
              element={<Index />}
            />
            <Route
              path='/auth'
              element={<Auth />}
            />
            <Route
              path='/auth/signup'
              element={<SignUp />}
            />
            <Route
              path='/dashboard'
              element={<Dashboard />}
            />
            <Route
              path='/profile'
              element={<Profile />}
            />
            <Route
              path='/destinations'
              element={<Destinations />}
            />
            <Route
              path='/destination/:id'
              element={<DestinationDetail />}
            />
            <Route
              path='/bookings'
              element={<Bookings />}
            />
            <Route
              path='/about'
              element={<AboutUs />}
            />
            <Route
              path='/privacy'
              element={<PrivacyPolicy />}
            />
            <Route
              path='/terms'
              element={<TermsOfService />}
            />
            <Route
              path='/contact'
              element={<ContactUs />}
            />
            <Route
              path='/experiences'
              element={<Experiences />}
            />
            <Route
              path='*'
              element={<NotFound />}
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
