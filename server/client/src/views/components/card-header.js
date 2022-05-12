import React from "react";
import { Row, Col, Divider } from 'react-materialize'

export default function CardHeader({title, description}) {

    return (
        <Row>
            <Col s={12}>
                <h4 className='card-title indigo-text'><b>{title}</b></h4>
                <Divider></Divider>
                <div>
                    <p className="grey-text text-darken-2">{description}</p>
                </div>
            </Col>
        </Row>
    );
}