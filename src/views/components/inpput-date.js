import React, { Component } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export class InputDate extends Component {
  state = {
    date: new Date(),
  };

  handleDate = (selectDate) => {
    this.setState({ date: selectDate });
    this.props.getShowDate(selectDate);
  };

  render() {
    return (
      <React.Fragment>
        <label className="active">{this.props.labelName}</label>
        <DatePicker
          className="form-control rounded-0"
          selected={this.state.date}
          onChange={this.handleDate}
          dateFormat='yyyy-MM-dd'
          disabled={this.props.disabled ? "disabled" : ""}
          maxDate={this.props.maxValue ? this.props.maxValue : new Date()}
          minDate={this.props.minValue}
        />
      </React.Fragment>
    );
  }
}

export default InputDate;
