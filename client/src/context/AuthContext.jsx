import { createContext, useState, useContext } from "react";

const Authcontext = createContext();

// provider to wrap thw whole App
export const AuthProvider = ({ children }) => {
  //check local storage to stay logged-in on refresh
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null,
  );
  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };
  const logout = (userData) => {
    localStorage.removeItem("user");
    setUser(null);
  };
  return (
    <Authcontext.Provider value={{ user, login, logout }}>
      {children}
    </Authcontext.Provider>
  );
};

//useAuth custom hook
export const useAuth = () => useContext(Authcontext);
