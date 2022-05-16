import React, { useState, useEffect } from "react";
import { CardHeader } from "../components/index";
import { Button } from 'react-materialize'
import TextField from '@mui/material/TextField';
import { ServerAPI } from "../../services/server";
import Stack from '@mui/material/Stack';

const service = new ServerAPI();

export default function EditarTabla(props) {
  
    const title = "Edicion de CONFIGURACION GENERAL"
    const description = "En esta sección podrá realizar la edicion de los registros CONFIGURACION GENERAL"

    const [taxaccountid, setTaxaccountid] = useState();
    const [credittaxaccount, setCredittaxaccount] = useState();
    const [debittaxaccount, setDebittaxaccount] = useState();
    const [credittaxaccountinterest, setCredittaxaccountinterest] = useState();
    const [debittaxaccountinterest, setDebittaxaccountinterest] = useState();
    const [producttypedescription, setProducttypedescription] = useState();
    const [producttypemaestrosunicos, setProducttypemaestrosunicos] = useState();


    async function goToConfiguracionGeneral (event) {
        props.show(false)
    };

    const handleChangeCredittaxaccount = (event) =>{
        setCredittaxaccount(event.target.value);
    }
    const handleChangeDebittaxaccount= (event) =>{
        setDebittaxaccount(event.target.value);
    }
    const handleChangeCredittaxaccountinterest = (event) =>{
        setCredittaxaccountinterest(event.target.value);
    }
    const handleChangeDebittaxaccountinterest = (event) =>{
        setDebittaxaccountinterest(event.target.value);
    }
    const handleChangeProducttypedescription = (event) =>{
        setProducttypedescription(event.target.value);
    }
    const handleChangeProducttypemaestrosunicos = (event) =>{
        setProducttypemaestrosunicos(event.target.value);
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
        props.show(false)
        event.preventDefault();
    }

    useEffect(() => {
        setTaxaccountid(props.info.taxaccountid)
        setCredittaxaccount(props.info.credittaxaccount)
        setDebittaxaccount(props.info.debittaxaccount)
        setCredittaxaccountinterest(props.info.credittaxaccountinterest)
        setDebittaxaccountinterest(props.info.debittaxaccountinterest)
        setProducttypedescription(props.info.producttypedescription)
        setProducttypemaestrosunicos(props.info.producttypemaestrosunicos)
    }, [,props]);

    return (
        <div>
            <CardHeader title={title} description={description } />
            <form onSubmit={handleSubmit}>
                <Stack direction="row" spacing={0.5} >
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Cuenta crédito"
                        multiline
                        maxRows={4}
                        value={credittaxaccount}
                        variant="standard"
                        onChange={handleChangeCredittaxaccount}
                    />
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Cuenta débito"
                        multiline
                        maxRows={4}
                        value={debittaxaccount}
                        variant="standard"
                        onChange={handleChangeDebittaxaccount}
                    />
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Cuenta crédito interés"
                        multiline
                        maxRows={4}
                        value={credittaxaccountinterest}
                        variant="standard"
                        onChange={handleChangeCredittaxaccountinterest}
                    />
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Cuenta débito interés"
                        multiline
                        maxRows={4}
                        value={debittaxaccountinterest}
                        variant="standard"
                        onChange={handleChangeDebittaxaccountinterest}
                    />
                    <TextField
                        id="outlined-multiline-static"
                        label="Tipo emision"
                        multiline
                        rows={4}
                        defaultValue={producttypedescription}
                        onChange={handleChangeProducttypedescription}
                        variant="standard"
                    />
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Código tipo emisión Maestros Únicos"
                        multiline
                        maxRows={4}
                        value={producttypemaestrosunicos}
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
        </div>
    )
}