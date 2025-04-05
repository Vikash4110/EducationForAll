import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Define isLoggingOut here
  const authorizationToken = `Bearer ${token}`;

  const storeTokenInLS = (serverToken) => {
    setToken(serverToken);
    localStorage.setItem("token", serverToken);
  };

  const logoutUser = () => {
    setIsLoggingOut(true); // Set flag before logout
    setToken("");
    setUser(null);
    setRole(null);
    localStorage.removeItem("token");
    setIsLoading(false);
    setTimeout(() => setIsLoggingOut(false), 1000); // Reset after navigation
  };

  const getUserRoleFromToken = () => {
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.role;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const teacherAuthentication = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/teachers/profile`, {
        method: "GET",
        headers: { Authorization: authorizationToken },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setUser(data);
      console.log("Authenticated teacher:", data);
    } catch (error) {
      console.error("Teacher authentication failed:", error.message);
      setUser(null);
    }
  };

  useEffect(() => {
    const tokenRole = getUserRoleFromToken();
    setRole(tokenRole);

    if (!token) {
      setIsLoading(false);
      setUser(null);
      setRole(null);
      return;
    }

    const authenticate = async () => {
      setIsLoading(true);
      if (tokenRole === "teacher") {
        await teacherAuthentication();
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    authenticate();
  }, [token]);

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, storeTokenInLS, logoutUser, user, role, authorizationToken, isLoading, isLoggingOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth used outside of the Provider");
  }
  return authContextValue;
};