import { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    authService
      .getMe()
      .then((data) => {
        setUser(data.user);
      })
      .catch((error) => {
        setUser(null);
      })
      .finally(() => {
        setAuthChecked(true);
      });
  }, []);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const { user } = await authService.login({ email, password });
      setUser(user);
      return user;
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed";
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!authChecked) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ login, user, loading, authChecked }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export default AuthContext;
