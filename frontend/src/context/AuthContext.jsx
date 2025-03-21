import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || "");

    useEffect(() => {
        if (token) {
          fetch(`${import.meta.env.VITE_API}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.user) {
                console.log("Fetched user:", data.user);
                setUser(data.user);
              } else {
                logout();
              }
            })
            .catch(() => logout());
        }
      }, [token]);
      

    const login = (token, user) => {
        localStorage.setItem("token", token);
        setToken(token);
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setToken("");
    };

    return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
        {children}
    </AuthContext.Provider>
    );
};

export default AuthProvider;
