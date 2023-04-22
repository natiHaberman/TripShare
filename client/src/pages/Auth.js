import React, { useContext, useState } from "react";
import Card from "../UIElements/Card";
import Input from "../UIElements/Input";
import { AuthContext } from "../context/auth-context";
import "./Auth.css";

function Auth() {
  const EMAIL_REQUIRMENT = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const PASSWORD_REQUIRMENT =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  const [hasAccount, setHasAccount] = useState(true);
  const [passwordValue, setPasswordValue] = useState("");
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [validity, setValidity] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });
  const { login } = useContext(AuthContext);

  const toggleHasAccount = () => {
    setHasAccount((prevHasAccount) => !prevHasAccount);
    setShowErrorMsg(false);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (allFieldsValid()) {
      await login(emailValue, passwordValue);
    } else {
      setShowErrorMsg(true);
    }
  };

  const handleValidationChange = (name, isValid) =>
    setValidity((prevState) => ({ ...prevState, [name]: isValid }));

  const allFieldsValid = () => {
    if (hasAccount) {
      return validity.email && validity.password;
    } else {
      return validity.email && validity.password && validity.confirmPassword;
    }
  };

  return (
    <div className="center">
      <Card>
        <div className="auth-container">
          <div className="header-container">
            <h2 className="auth-heading">
              {hasAccount ? "Log in" : "Sign up"}
            </h2>
            <hr className="auth-divider" />
          </div>
          <form className="input-container" onSubmit={handleSubmit}>
            <Input
              errorMsg={"Please enter a valid email address"}
              condition={EMAIL_REQUIRMENT}
              placeholder={"Email"}
              onChange={(isValid, enteredValue) => {
                handleValidationChange("email", isValid);
                setEmailValue(enteredValue);
              }}
            />
            <Input
              type="password"
              errorMsg={"Please enter a valid password"}
              condition={PASSWORD_REQUIRMENT}
              placeholder={"Password"}
              onChange={(isValid, enteredValue) => {
                handleValidationChange("password", isValid);
                setPasswordValue(enteredValue);
              }}
            />
            {!hasAccount && (
              <Input
                type="password"
                errorMsg={"Must match password"}
                condition={(enteredValue) => enteredValue === passwordValue}
                placeholder={"Confirm Password"}
                onChange={(isValid) =>
                  handleValidationChange("confirmPassword", isValid)
                }
              />
            )}
            <button className="submit-button" type="submit">
              {hasAccount ? "Log in" : "Sign up"}
            </button>
            {showErrorMsg && (
              <p className="error-msg">Please fill out all fields correctly</p>
            )}
          </form>

          <div className="toggle-mode">
            <p className="toggle-text">
              {hasAccount
                ? "Don't have an account?"
                : "Already have an account?"}
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
