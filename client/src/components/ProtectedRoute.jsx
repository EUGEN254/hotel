import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// For routes that should only be accessible when NOT authenticated (like login/signup)
export const PublicRoute = ({ children }) => {
  const { user, authChecked } = useAuth();
  
  // Wait for auth to be checked
  if (!authChecked) {
    return null; // Or a loading spinner
  }
  
  // If user is authenticated, redirect to guest dashboard
  if (user) {
    return <Navigate to="/guest/dashboard" replace />;
  }
  
  return children;
};

// For routes that should only be accessible when authenticated
export const PrivateRoute = ({ children }) => {
  const { user, authChecked } = useAuth();
  
  // Wait for auth to be checked
  if (!authChecked) {
    return null; // Or a loading spinner
  }
  
  // If user is not authenticated, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};