import React, { useState } from "react";
import { Row, Col, Divider, Section } from 'react-materialize'

export default function CardHeader({title, description}) {

    return (
        <Row>
            <Col s={12}>
                <h4 className='card-title indigo-text'><b>{title}</b></h4>
                <Divider></Divider>
                <Section>
                    <p className="grey-text text-darken-2">{description}</p>
                </Section>
            </Col>
        </Row>
    );
}