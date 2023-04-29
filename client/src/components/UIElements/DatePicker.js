import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React from "react";

const CustomDatePicker = (props) => {
  return (
    <DatePicker
      selected={props.departureTime}
      onChange={props.onChange}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={5}
      timeCaption="Departure Time"
      dateFormat="h:mm aa"
    />
  );
};

export default CustomDatePicker;
