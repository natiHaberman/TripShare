import React, { useEffect, useState } from "react";
import "./Input.css";


// Custom input component with validation and error message
const Input = (props) => {
  const [enteredValue, setEnteredValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [showErrorMsg, setShowErrorMsg] = useState(false);

  useEffect(() => {
    if (typeof props.condition === "function") {
      setIsValid(props.condition(enteredValue));
    } else {
      setIsValid(props.condition.test(enteredValue));
    }
  }, [enteredValue, props.condition]);

  // Checks if input is valid and if it has been touched and displays error message accordingly
  useEffect(() => {
    if (isTouched && !isValid) setShowErrorMsg(true);
    else setShowErrorMsg(false);
    props.onChange(isValid, enteredValue);
  }, [isTouched, isValid, enteredValue]);

  // Sets isTouched to true when input is blurred
  const handleBlur = () => {
    setIsTouched(true);
  };

  return (
    <div className="container">
      <input
        type={props.type}
        value={enteredValue}
        onChange={(event) => setEnteredValue(event.target.value)}
        onBlur={handleBlur}
        className="input-field"
        placeholder={props.placeholder}
      />
      {showErrorMsg && <p className="error-text">{props.errorMsg}</p>}
    </div>
  );
};

export default Input;
