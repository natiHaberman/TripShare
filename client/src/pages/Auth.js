import React, { useContext, useState } from "react";
import Card from "../UIElements/Card";
import Input from "../UIElements/Input";
import LoadingSpinner from "../UIElements/LoadingSpinner";
import { AuthContext } from "../context/auth-context";
import "./Auth.css";

function Auth() {
  const EMAIL_REQUIRMENT = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const PASSWORD_REQUIRMENT =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  const USERNAME_REQUIRMENT = /^(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

  const EMAIL_ERROR_MESSAGE = "Please enter a valid email address";
  const PASSWORD_ERROR_MESSAGE =
    "Password must contain at least one lowercase and upercase letter, one number, and be at least 8 characters long";
  const CONFIRM_PASSWORD_ERROR_MESSAGE = "Passwords do not match";
  const USERNAME_ERROR_MESSAGE =
    "Username must contain at least one lowercase letter, one number, and be at least 8 characters long";

  const [hasAccount, setHasAccount] = useState(true);
  const [passwordValue, setPasswordValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [username, setUsername] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [validity, setValidity] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });
  const { login, register } = useContext(AuthContext);

  const toggleHasAccount = () => {
    setHasAccount((prevHasAccount) => !prevHasAccount);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (allFieldsValid()) {
      setIsLoading(true);
      if (hasAccount) {
        try {
          await login(emailValue, passwordValue);
        } catch (err) {
          alert(err);
        }
      } else {
        try {
          await register(emailValue, passwordValue, username);
        } catch (err) {
          alert(err);
        }
      }
      setIsLoading(false);
    } else {
      alert("Please fill out all fields correctly");
    }
  };

  const handleValidationChange = (name, isValid) =>
    setValidity((prevState) => ({ ...prevState, [name]: isValid }));

  const allFieldsValid = () => {
    if (hasAccount) {
      return validity.email && validity.password;
    } else {
      return (
        validity.email &&
        validity.password &&
        validity.confirmPassword &&
        validity.username
      );
    }
  };
  return (
    <div className="center">
      {isLoading && <LoadingSpinner asOverlay />}
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
              errorMsg={EMAIL_ERROR_MESSAGE}
              condition={EMAIL_REQUIRMENT}
              placeholder={"Email"}
              onChange={(isValid, enteredValue) => {
                handleValidationChange("email", isValid);
                setEmailValue(enteredValue);
              }}
            />
            {!hasAccount && (
              <Input
                errorMsg={USERNAME_ERROR_MESSAGE}
                condition={USERNAME_REQUIRMENT}
                placeholder={"Username"}
                onChange={(isValid, enteredValue) => {
                  handleValidationChange("username", isValid);
                  setUsername(enteredValue);
                }}
              />
            )}
            <Input
              type="password"
              errorMsg={PASSWORD_ERROR_MESSAGE}
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
                errorMsg={CONFIRM_PASSWORD_ERROR_MESSAGE}
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
