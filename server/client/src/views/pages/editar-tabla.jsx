import React, { useState, useEffect, useRef } from "react";
import { CardHeader } from "../components/index";
import { Row, Col, Button, Collapsible, CollapsibleItem, Icon, Table } from 'react-materialize'
import ConfiguracionContableGeneral from "./configuracion-contable-general";
import TextField from '@mui/material/TextField';

export default function EditarTabla(props) {
  
    const title = "Edicion de xxxx"
    const description = "En esta sección podrá realizar la edicion de los registros almacenados en xxxx"

    const [state, setState] = useState();

    async function goToConfiguracionGeneral (event) {
        props.show(false)
    };

    const handleChange = (event) =>{
        console.log(event)
        setState(event.target.value);
    }

    const handleSubmit = (event) => {
        alert('A name was submitted: ' + state);
        event.preventDefault();
    }

    return (
        <div>
            <CardHeader title={title} description={description } />
            <form onSubmit={handleSubmit}>
                {Object.keys(props.info).map((data,i)=>{
                    return(
                        <TextField id="outlined-basic" label={data} variant="outlined" />
                        // <label>
                        //     {data}
                        //     <input type="text" value ={data} placeholder={props.info[data]} onChange={handleChange} />
                        // </label>
                    )
                })}
                <Button node="button" type="submit" value="Submit" small className="indigo darken-4" >
                    Guardar cambios
                </Button> 
            </form>
            <br />
            <Row>
                <Button node="button" small className="indigo darken-4" onClick={goToConfiguracionGeneral} >
                    cancelar actualizacion
                </Button>
            </Row>
        </div>
    )
}