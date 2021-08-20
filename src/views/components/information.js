import React, { Component } from "react";
import { Row, Col, Section } from 'react-materialize'

export class Information extends Component {

    render() {
        return (
            <Row>
                <Col s={12}>
                    <h4 className='card-title principal-title'>{this.props.title}</h4>
                    <div className="divider"></div>
                    <Section>
                        <p className="text-left m0">{this.props.description}</p>
                    </Section>
                </Col>
            </Row>
        );
    }
}

export default Information;
