import React, { Component } from "react";
import { Row, Col, Section } from 'react-materialize'

export class Information extends Component {
    render() {
        return (
            <Row>
                <Col s={12}>
                    <h4 className='card-title indigo-text'><b>{this.props.title}</b></h4>
                    <div className="divider"></div>
                    <Section>
                        <p className="grey-text text-darken-2">{this.props.description}</p>
                    </Section>
                </Col>
            </Row>
        );
    }
}

export default Information;
