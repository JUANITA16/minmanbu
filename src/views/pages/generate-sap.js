import React, { useState, useEffect } from "react";
import { InputDate, Information } from '../components/index'
import { MambuService } from "../../services/mambu-service";
import { setFormatDate, showToast } from "../../helpers/utils";
import { Row, Col, Button, Preloader } from 'react-materialize'

export const service = new MambuService();

export default function GenerateSap() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [title] = useState('Generación del archivo plano SAP');
  const [description] = useState('En esta sección podrá generar el archivo plano por parte de SAP');
  const [loaderText] = useState('Estamos generando el archivo, por favor espere...');
  const [inProgress, setInProgress] = useState(false);

  useEffect(() => {
    console.log(startDate);
    console.log(endDate);
  }, [startDate, endDate])

  async function submit(event) {
    event.preventDefault();
    setInProgress(true);
    await service.generateFile(setFormatDate(startDate), setFormatDate(endDate))
      .then((response) => {
        if (response) {
          setInProgress(false);
          showToast(response.detail);
        }
      });
  }

  const renderElement = () => {
    if (!inProgress) {
      return (
        <React.Fragment>
          <Information title={title} description={description} />
          <form onSubmit={submit}>
            <Row>
              <Col s={6} className="input-field date text-left">
                <InputDate labelName="Fecha inicial" maxValue={endDate} setDate={setStartDate} />
              </Col>
              <Col s={6} className="input-field date text-left">
                <InputDate labelName="Fecha final" minValue={startDate} setDate={setEndDate} />
              </Col>
              <Col s={12} className="input-field m0">
                <Button node="button" type="submit" small className="indigo darken-4">
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
          <p className="mt20 valign center">{loaderText}</p>
        </Row>
      );
    }
  }

  return (
    <React.Fragment>
      {renderElement()}
    </React.Fragment>
  )
}