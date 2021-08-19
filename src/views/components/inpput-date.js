import React, { Component } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker.css";

export class InputDate extends Component {
  state = {
    date: new Date(),
    showDate: ""
  };

  handleDate = (selectDate) => {
    this.setState({ date: selectDate });
    const offset = selectDate.toISOString().split('T')[0];
    this.props.getShowDate(offset);
  };

  render() {
    return (
      <React.Fragment>
        <label>{this.props.labelName}</label>
        <DatePicker
          className="form-control rounded-0"
          selected={this.state.date}
          onChange={this.handleDate}
          dateFormat='yyyy-MM-dd'
          disabled={this.props.disabled ? "disabled" : ""}
          maxDate={this.props.maxValue ? new Date(this.props.maxValue) : new Date()}
          minDate={new Date(this.props.minValue)}
        />
      </React.Fragment>
    );
  }
}

export default InputDate;
