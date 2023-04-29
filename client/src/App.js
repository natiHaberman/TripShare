import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthContext } from "./context/auth-context";
import { useAuth } from "./hooks/auth-hook";
import MainNavigation from "./components/navigation/MainNavigation/MainNavigation";
import { RoutesComponent } from "./components/navigation/Routes";

function App() {

  // Uses auth hook to deal with all authorization relared logic such as access token validation and production using refresh token
  // cookie as well as login, logoout and register functions
  const { accessToken, login, logout, userID, isLoggedIn, register } =
    useAuth();

  return (
    // Provides the auth context to all pages and other stateful components in the website
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
