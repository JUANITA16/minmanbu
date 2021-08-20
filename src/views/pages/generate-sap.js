import React, { Component } from "react";
import { InputDate, Information } from '../components/index'
import { MambuService } from "../../services/mambu-service";
import { setDate, showToast } from "../../helpers/utils";
import { Row, Col, Button, Preloader } from 'react-materialize'

export const service = new MambuService();

export class GenerateSap extends Component {

  service = new MambuService();

  state = {
    title: "Generación del archivo plano SAP",
    description: "En esta sección podrá generar el archivo plano por parte de SAP",
    startDate: new Date(),
    endDate: new Date(),
    disabled: true,
    inProgress: false,
    response: ""
  };

  handleStartDate = (date) => {
    this.setState({ startDate: date });
  }

  handleEndDate = (date) => {
    this.setState({ endDate: date });
  }

  submit = async (event) => {
    this.setState({ inProgress: true });
    event.preventDefault();
    await service.generateFile(setDate(this.state.startDate), setDate(this.state.endDate))
      .then((response) => {
        if (response) {
          this.setState({ inProgress: false, response: response.detail });
          showToast(response.detail);
        }
      });
  }

  render() {
    const renderElement = () => {
      if (!this.state.inProgress) {
        return (
          <React.Fragment>
            <Information title={this.state.title} description={this.state.description} />
            <form onSubmit={this.submit}>
              <Row>
                <Col s={6} className="input-field date text-left">
                  <InputDate labelName="Fecha inicial" maxValue={this.state.endDate} getShowDate={this.handleStartDate} />
                </Col>
                <Col s={6} className="input-field date text-left">
                  <InputDate labelName="Fecha final" disabled={this.state.disabled} minValue={this.state.startDate} getShowDate={this.handleEndDate} />
                </Col>
                <Col s={12} className="input-field m0">
                  <Button node="button" type="submit" small className="indigo darken-4" onClick={this.generateData}>
                    Generar
                  </Button>
                </Col>
              </Row>
            </form>
          </React.Fragment>);
      } else {
        return (
          <Row className="card-content">
            <Col s={12} className="valign center">
              <Preloader
                active
                color="blue"
                flashing={false}
                size="big"
              />
            </Col>
            <p className="mt20 valign center">Estamos generando el archivo, por favor espere...</p>
          </Row>
        );
      }
    }

    return (
      <React.Fragment>
        {renderElement()}
      </React.Fragment>

    );
  }
}

export default GenerateSap;