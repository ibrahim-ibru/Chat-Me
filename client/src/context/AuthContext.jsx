import { createContext, useState, useEffect } from "react";
import API from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await API.get("/users/me");
          setUser(res.data);
        } catch (err) {
          console.error(err);
          logout();
        }
      }
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await API.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      return true;
    } catch (error) {
      console.error(error.response.data);
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      await API.post("/register", { name, email, password });
      return true;
    } catch (error) {
      console.error(error.response.data);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;