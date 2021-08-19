import React, { Component } from "react";
import { InputDate, Information } from '../components/index'
import { MambuService } from "../../services/mambu-service";

export const service = new MambuService();

export class GenerateSap extends Component {

  service = new MambuService();

  state = {
    title: "Generación del archivo plano SAP",
    description: "En esta sección podrá generar el archivo plano por parte de SAP",
    startDate: "",
    endDate: "",
    disabled: true,
    complete: false
  };

  handleStartDate = (startDate) => {
    this.setState({ startDate: startDate, disabled: false });
  }

  handleEndDate = (endDate) => {
    this.setState({ endDate: endDate, complete: true });
  }

  generateData = async () => {
    await service.getToken();
  }

  componentDidMount() {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    var current = date.toISOString().split('T')[0];
    this.handleStartDate(current);
    this.handleEndDate(current);
  }

  render() {
    return (
      <React.Fragment>
        <Information title={this.state.title} description={this.state.description} />
        <div className="row">
          <div className="col-lg-6 text-left">
            <InputDate labelName="Fecha inicial" maxValue={this.state.endDate} getShowDate={this.handleStartDate} />
          </div>
          <div className="col-lg-6 text-left">
            <InputDate labelName="Fecha final" disabled={this.state.disabled} minValue={this.state.startDate} getShowDate={this.handleEndDate} />
          </div>
        </div>
        <div className="pt-4 pb-4 text-left">
          <button className="btn btn-primary rounded-0" disabled={!this.state.complete} onClick={this.generateData}>Generar</button>
        </div>
      </React.Fragment>
    );
  }
}

export default GenerateSap;