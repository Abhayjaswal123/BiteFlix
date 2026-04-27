import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { clearAccessToken, setAccessToken } from "../api/api.interceptor";
import api from "../api/api.axios";

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initUser = async () => {
      try {
        const res = await api.post("/auth/refresh-token");
        setAccessToken(res.data.accessToken);

        const userRes = await api.get("/auth/me");
        setUser(userRes.data.user);
      } catch {
        clearAccessToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initUser();
  }, []);

  const login = (data) => {
    setAccessToken(data.accessToken);
    setUser(data.user);
    setLoading(false);
  };

  const logout = () => {
    clearAccessToken();
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ login, logout, user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

