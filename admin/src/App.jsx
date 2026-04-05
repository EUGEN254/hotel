import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/adminLayout";
import AdminLogin from "./pages/AdminLogin";
import AdminRooms from "./pages/AdminRooms";
import { Toaster } from "./components/ui/toaster";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<AdminLogin />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/rooms" replace />} />
          <Route path="rooms" element={<AdminRooms />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
