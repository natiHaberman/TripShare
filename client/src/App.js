import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthContext } from "./context/auth-context";
import { useAuth } from "./hooks/auth-hook";
import MainNavigation from "./components/navigation/MainNavigation/MainNavigation";
import { checkTokenExpiration } from "./util/checkTokenExpiration";
import { RoutesComponent } from "./components/navigation/Routes";

function App() {
  const { accessToken, login, logout, refresh, userID, isLoggedIn, register } =
    useAuth();

  useEffect(() => {
    let refreshInterval;
    refreshInterval = setInterval(async () => {
      if (isLoggedIn && checkTokenExpiration(accessToken)) {
        try {
          await refresh();
        } catch (error) {
          await logout();
        }
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Clear the interval when the component unmounts or the dependency array changes
    return () => clearInterval(refreshInterval);
  }, [isLoggedIn, accessToken, logout, refresh]);

  return (
    <AuthContext.Provider
      value={{ login, logout, accessToken, userID, register, isLoggedIn }}
    >
      <Router>
        <MainNavigation isLoggedIn={isLoggedIn} />
        <main>
          <RoutesComponent isLoggedIn={isLoggedIn} />
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
