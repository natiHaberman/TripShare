import React, { useState } from "react";
import "./ToggleButton.css";
const ToggleButton = (props) => {
  const [active, setActive] = useState(false);
  const handleDisplay = () => {
    props.handleToggle();
    setActive((prevState) => !prevState);
  };

  return (
    <div className="toggle-container">
      <button
        className={`toggle-btn ${!active ? "active" : ""}`}
        onClick={handleDisplay}
      >
        {props.option1}
      </button>
      <button
        className={`toggle-btn ${active ? "active" : ""}`}
        onClick={handleDisplay}
      >
        {props.option2}
      </button>
    </div>
  );
};

export default ToggleButton;
