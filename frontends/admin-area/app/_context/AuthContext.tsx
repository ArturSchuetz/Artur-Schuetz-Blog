// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../_services/user.service"; // Pfad anpassen
import UnauthorizedException from "../_common/Exceptions/unauthorized-exception"; // Pfad anpassen

type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

const AuthContext = createContext<AuthContextType>(null as any);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: any }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    getCurrentUser()
      .then((currentUser) => {
        if (currentUser) setIsLoggedIn(true);
      })
      .catch((error) => {
        if (error instanceof UnauthorizedException) {
          setIsLoggedIn(false);
          return;
        } else {
          console.error(error);
        }
      });
  }, []);

  const value = {
    isLoggedIn,
    setIsLoggedIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
