import { Route, Routes } from "react-router-dom";
import NotFound from "./pages/Notfound.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import { Toaster } from "./components/ui/toaster.jsx";
import { TooltipProvider } from "./components/ui/tooltip.jsx";
import Auth from "./pages/Auth.jsx";
import GuestPortal from "./pages/guest/GuestPortal.jsx";
import GuestDashboard from "./pages/guest/GuestDashboard.jsx";
import GuestBookings from "./pages/guest/GuestBookings.jsx";
import GuestBrowseRooms from "./pages/guest/GuestBrowseRooms.jsx";
import GuestProfile from "./pages/guest/GuestProfile.jsx";
import GuestBilling from "./pages/guest/GuestBilling.jsx";
import { PublicRoute, PrivateRoute } from "./components/ProtectedRoute.jsx";
import GuestSettings from "./pages/guest/GuestSettings.jsx";

const App = () => {
  return (
    <>
      <Toaster />
      <TooltipProvider>
        <Routes>
          {/* Public routes - accessible to everyone */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth route - redirects to dashboard if already logged in */}
          <Route
            path="/auth"
            element={
              <PublicRoute>
                <Auth />
              </PublicRoute>
            }
          />

          {/* Guest routes - only accessible when logged in */}
          <Route
            path="/guest"
            element={
              <PrivateRoute>
                <GuestPortal />
              </PrivateRoute>
            }
          >
            <Route index element={<GuestDashboard />} />
            <Route path="dashboard" element={<GuestDashboard />} />
            <Route path="bookings" element={<GuestBookings />} />
            <Route path="browse" element={<GuestBrowseRooms />} />
            <Route path="profile" element={<GuestProfile />} />
            <Route path="billing" element={<GuestBilling />} />
            <Route path="settings" element={<GuestSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </>
  );
};

export default App;
