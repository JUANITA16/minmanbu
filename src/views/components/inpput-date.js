import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function InputDate (props) {
  const [date, setDate] = useState(new Date())

  function handleDate(selectDate) {
    selectDate = selectDate ? selectDate : date;
    setDate(selectDate);
    props.setDate(selectDate);
  }

  return (
    <React.Fragment>
      <label className="active">{props.labelName}</label>
      <DatePicker
        className="form-control rounded-0"
        selected={date}
        onChange={handleDate}
        dateFormat='yyyy-MM-dd'
        disabled={props.disabled ? "disabled" : ""}
        maxDate={props.maxValue ? props.maxValue : new Date()}
        minDate={props.minValue}
      />
    </React.Fragment>
  );
}
InputDate.propTypes = {
  selectDate: PropTypes.any
}