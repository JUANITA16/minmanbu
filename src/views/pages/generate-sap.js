import React, { Component } from "react";
import { InputDate, Information } from '../components/index'
import { MambuService } from "../../services/mambu-service";
import { setDate, showToast } from "../../helpers/utils";

export const service = new MambuService();

export class GenerateSap extends Component {

  service = new MambuService();

  state = {
    title: "Generación del archivo plano SAP",
    description: "En esta sección podrá generar el archivo plano por parte de SAP",
    startDate: new Date(),
    endDate: new Date(),
    disabled: true,
    complete: false
  };

  handleStartDate = (startDate) => {
    this.setState({ startDate: startDate, disabled: false });
  }

  handleEndDate = (endDate) => {
    this.setState({ endDate: endDate, complete: true });
  }

  submit = async (event) => {
    event.preventDefault();
    await service.generateFile(setDate(this.state.startDate), setDate(this.state.endDate))
      .then((response) => {
        if (response) {
          showToast(response.detail);
        }
      });
  }

  render() {
    return (
      <React.Fragment>
        <form onSubmit={this.submit}>
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
            <button className="btn btn-primary rounded-0" onClick={this.generateData}>Generar</button>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

export default GenerateSap;