import React, { useContext, useState } from "react";
import Card from "../UIElements/Card";
import { AuthContext } from "../context/auth-context";
import "./Auth.css";

function Auth() {
  const auth = useContext(AuthContext);
  const [hasAccount, setHasAccount] = useState(true);

  const toggleHasAccount = () => {
    setHasAccount((prevHasAccount) => !prevHasAccount);
  };

  const handleEntry = () => {
    auth.login();
  };

  return (
    <div className="center">
      <Card>
        <div className="auth-container">
          <div className="header-container">
            <h2 className="auth-heading">
              {hasAccount ? "Log in" : "Sign up"}
            </h2>
            <hr className="auth-divider" />{" "}
          </div>
          <div className="input-container">
          <input className="auth-input" placeholder="Username"></input>
          <input className="auth-input" placeholder="Password"></input>
          {!hasAccount && (
            <input
              className="auth-input"
              placeholder="Confirm password"
            ></input>
          )}</div>
          <button className="submit-button" onClick={handleEntry}>
            {hasAccount ? "Log in" : "Sign up"}
          </button>
          <div className="toggle-mode">
          <p className="toggle-text">
            {hasAccount ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button className="toggle-mode-button" onClick={toggleHasAccount}>
              {hasAccount ? "Create one now!" : "Log in!"}
            </button>
            </div>
        </div>
      </Card>
    </div>
  );
}

export default Auth;
