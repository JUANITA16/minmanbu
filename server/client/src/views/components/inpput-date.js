import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { convertTZ } from "../../helpers/utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function InputDate(props) {
  const [date, setCurrentDate] = useState(convertTZ(new Date()));
  const { setDate,dateInput, labelName, maxValue, minValue,isDisabled } = props;

  const handleDate = useCallback((selectDate) => {
    const newDate = selectDate || date;
    setCurrentDate(newDate);
    setDate(newDate);
  }, [date, setDate]);

  useEffect(() => {
    setCurrentDate(dateInput);
  }, [setCurrentDate, dateInput])

  return (
    <React.Fragment>
      <label className="active">{labelName}</label>
      <DatePicker
        className="form-control rounded-0"
        wrapperClassName="date-picker"
        selected={date}
        onChange={handleDate}
        dateFormat='yyyy-MM-dd'
        maxDate={maxValue || convertTZ(new Date())}
        minDate={minValue}
        disabled={isDisabled}
      />
    </React.Fragment>
  );
}

InputDate.propTypes = {
  labelName: PropTypes.string.isRequired,
  maxValue: PropTypes.instanceOf(Date),
  minValue: PropTypes.instanceOf(Date),
  isDisabled: PropTypes.bool
};