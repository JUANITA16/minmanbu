import React, { useState } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function InputDate (props) {
  const [date, setDate] = useState(new Date());
  const [labelName] = useState(props.labelName);

  function handleDate(selectDate) {
    selectDate = selectDate ? selectDate : date;
    setDate(selectDate);
    props.setDate(selectDate);
  }

  return (
    <React.Fragment>
      <label className="active">{labelName}</label>
      <DatePicker
        className="form-control rounded-0"
        selected={date}
        onChange={handleDate}
        dateFormat='yyyy-MM-dd'
        maxDate={props.maxValue ? props.maxValue : new Date()}
        minDate={props.minValue}
      />
    </React.Fragment>
  );
}

InputDate.propTypes = {
  labelName: PropTypes.any,
  maxValue: PropTypes.any,
  minValue: PropTypes.any,
  disabled: PropTypes.string
}