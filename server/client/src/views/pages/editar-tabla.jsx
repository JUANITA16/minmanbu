import React, { useState, useEffect } from "react";
import { CardHeader } from "../components/index";
import { Button } from 'react-materialize'
import TextField from '@mui/material/TextField';
import { ServerAPI } from "../../services/server";
import Stack from '@mui/material/Stack';
import ConfiguracionContableGeneral from "./configuracion-contable-general";

const service = new ServerAPI();

export default function EditarTabla(props) {
  
    const title = "Edicion de CONFIGURACION GENERAL"
    const description = "En esta sección podrá realizar la edicion de los registros CONFIGURACION GENERAL"

    // const [taxaccountid, setTaxaccountid] = useState();
    // const [credittaxaccount, setCredittaxaccount] = useState();
    // const [debittaxaccount, setDebittaxaccount] = useState();
    // const [credittaxaccountinterest, setCredittaxaccountinterest] = useState();
    // const [debittaxaccountinterest, setDebittaxaccountinterest] = useState();
    // const [producttypedescription, setProducttypedescription] = useState();
    // const [producttypemaestrosunicos, setProducttypemaestrosunicos] = useState();

    var taxaccountid=""
    var credittaxaccount=""
    var debittaxaccount=""
    var credittaxaccountinterest=""
    var debittaxaccountinterest=""
    var producttypedescription=""
    var producttypemaestrosunicos=""

    async function goToConfiguracionGeneral (event) {
        props.show(false)
    };

    const handleChangeCredittaxaccount = (event) =>{
        credittaxaccount=event.target.value
        // setCredittaxaccount(event.target.value);
    }
    const handleChangeDebittaxaccount= (event) =>{
        debittaxaccount=event.target.value
        // setDebittaxaccount(event.target.value);
    }
    const handleChangeCredittaxaccountinterest = (event) =>{
        credittaxaccountinterest=event.target.value
        // setCredittaxaccountinterest(event.target.value);
    }
    const handleChangeDebittaxaccountinterest = (event) =>{
        debittaxaccountinterest=event.target.value
        // setDebittaxaccountinterest(event.target.value);
    }
    const handleChangeProducttypedescription = (event) =>{
        producttypedescription=event.target.value
        // setProducttypedescription(event.target.value);
    }
    const handleChangeProducttypemaestrosunicos = (event) =>{
        producttypemaestrosunicos=event.target.value
        // setProducttypemaestrosunicos(event.target.value);
    }

    const handleSubmit = (event) => {
        const dataToUpdate ={
            "producttypemaestrosunicos": producttypemaestrosunicos,
            "credittaxaccountinterest": credittaxaccountinterest,
            "credittaxaccount": credittaxaccount,
            "debittaxaccountinterest": debittaxaccountinterest,
            "debittaxaccount": debittaxaccount,
            "producttypedescription": producttypedescription,
        }
        service.updateItemConfiguracionGeneral(dataToUpdate,taxaccountid)
        // props.show(false)
        goToConfiguracionGeneral()
        event.preventDefault();
    }

    const [pantallaVisibleEditar, setPantallaVisibleEditar] = useState();
    async function goToConfiguracionGeneral () {
        console.log('go to configuracion general');
        setPantallaVisibleEditar(
            <ConfiguracionContableGeneral/>
        );
    };

    useEffect(() => {
        console.log(props)

        taxaccountid=props.info.taxaccountid
        credittaxaccount=props.info.credittaxaccount
        debittaxaccount=props.info.debittaxaccount
        credittaxaccountinterest=props.info.credittaxaccountinterest
        debittaxaccountinterest=props.info.debittaxaccountinterest
        producttypedescription=props.info.producttypedescription
        producttypemaestrosunicos=props.info.producttypemaestrosunicos

        setPantallaVisibleEditar(
        <div>
            <CardHeader title={title} description={description } />
            <form onSubmit={handleSubmit}>
                <Stack direction="row" spacing={0.5} >
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Cuenta crédito"
                        multiline
                        maxRows={4}
                        value={props.info.credittaxaccount}
                        variant="standard"
                        onChange={handleChangeCredittaxaccount}
                    />
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Cuenta débito"
                        multiline
                        maxRows={4}
                        value={props.info.debittaxaccount}
                        variant="standard"
                        onChange={handleChangeDebittaxaccount}
                    />
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Cuenta crédito interés"
                        multiline
                        maxRows={4}
                        value={props.info.credittaxaccountinterest}
                        variant="standard"
                        onChange={handleChangeCredittaxaccountinterest}
                    />
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Cuenta débito interés"
                        multiline
                        maxRows={4}
                        value={props.info.debittaxaccountinterest}
                        variant="standard"
                        onChange={handleChangeDebittaxaccountinterest}
                    />
                    <TextField
                        id="outlined-multiline-static"
                        label="Tipo emision"
                        multiline
                        rows={4}
                        defaultValue={props.info.producttypedescription}
                        onChange={handleChangeProducttypedescription}
                        variant="standard"
                    />
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Código tipo emisión Maestros Únicos"
                        multiline
                        maxRows={4}
                        value={props.info.producttypemaestrosunicos}
                        variant="standard"
                        onChange={handleChangeProducttypemaestrosunicos}
                    />
                </Stack>
                <Stack direction="row" spacing={0.5} >
                    <Button node="button" type="submit" value="Submit" small className="indigo darken-4" >
                        Guardar cambios
                    </Button> 
                    <br />
                    <Button node="button" small className="indigo darken-4" onClick={goToConfiguracionGeneral} >
                        cancelar actualizacion
                    </Button>
                </Stack>
            </form>
        </div>)
    }, [,props]);

    return (
        <React.Fragment>
            {pantallaVisibleEditar}
        </React.Fragment>
    )
}