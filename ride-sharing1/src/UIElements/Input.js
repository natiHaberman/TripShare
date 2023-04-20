import React, { useEffect, useState } from "react";
import "./Input.css";

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
    if (isTouched && !isValid) setShowErrorMsg(true);
    else setShowErrorMsg(false);
    props.onChange(isValid, enteredValue);
  }, [enteredValue, isTouched, isValid, props.condition]);

  const handleBlur = () => {
    setIsTouched(true);
  };

  return (
    <div container>
      <input
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
