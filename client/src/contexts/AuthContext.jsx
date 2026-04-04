import { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/guest/guestService";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  // Function to remove preloader with animation
  const removePreloader = () => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      preloader.classList.add("fade-out");
      setTimeout(() => {
        const preloaderElement = document.getElementById("preloader");
        if (preloaderElement) {
          preloaderElement.remove();
        }
      }, 50);
    }
  };

  // On app load
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
        setTimeout(() => {
          removePreloader();
        }, 50);
      });
  }, []);

  const register = async ({ name, email, password }) => {
    setLoading(true);
    try {
      const { user } = await authService.register({ name, email, password });
      setUser(user);
      return user;
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed";
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

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

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  // Don't render anything until auth is checked
  if (!authChecked) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout,authChecked }}>
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
