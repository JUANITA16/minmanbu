import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { convertTZ } from "../../helpers/utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function InputDate(props) {
  const [date, setCurrentDate] = useState(convertTZ(new Date()));
  const { setDate, labelName, maxValue, minValue } = props;

  function handleDate(selectDate) {
    selectDate = selectDate ? selectDate : date;
    setCurrentDate(selectDate);
  }

  useEffect(() => {
    setDate(date);
  }, [setDate, date])

  return (
    <React.Fragment>
      <label className="active">{labelName}</label>
      <DatePicker
        className="form-control rounded-0"
        selected={date}
        onChange={handleDate}
        dateFormat='yyyy-MM-dd'
        maxDate={maxValue ? maxValue : convertTZ(new Date())}
        minDate={minValue}
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