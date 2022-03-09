import React, { useState } from "react";
import { Row, Col, Preloader } from 'react-materialize'
import PropTypes from "prop-types";

export default function Loading(props) {
    const [text] = useState(props.text);
    const [aditional] = useState(props.aditional);

    return (
        <Row className="card-content">
            <Col s={12} className="valign center">
                <Preloader
                    active
                    color="blue"
                    flashing={false}
                    size="big" />
            </Col>
            <Col s={12} className="valign center">
                <p className="grey-text text-darken-2">{text}</p>
                <small>{aditional}</small>
            </Col>
        </Row>
    );
}

Loading.propTypes = {
    text: PropTypes.string,
    aditional: PropTypes.string
}