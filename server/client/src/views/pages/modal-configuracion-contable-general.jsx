import React, { useState, useEffect } from "react";
import { Row, Col, Button,  Modal } from 'react-materialize'
import Select from 'react-select'
import { ServerAPI } from "../../services/server";
import { toast } from 'react-toastify';



const service = new ServerAPI();



export default function ModalConfiguracionContableGeneral(props) {

    const title = "Nuevo - Configuración general"
    const [credittaxaccount, setCredittaxaccount] = useState("");
    const [debittaxaccount, setDebittaxaccount] = useState("");
    const [credittaxaccountinterest, setCredittaxaccountinterest] = useState("");
    const [debittaxaccountinterest, setDebittaxaccountinterest] = useState("");
    const [producttypedescription, setProducttypedescription] = useState('0');
    const [producttypemaestrosunicos, setProducttypemaestrosunicos] = useState("");
    
    const handleChangeCredittaxaccount = (event) => {
        setCredittaxaccount(event.target.value);
    }

    const handleChangeDebittaxaccount = (event) => {
        setDebittaxaccount(event.target.value);
    }
    const handleChangeCredittaxaccountinterest = (event) => {
        setCredittaxaccountinterest(event.target.value);
    }
    const handleChangeDebittaxaccountinterest = (event) => {
        setDebittaxaccountinterest(event.target.value);
    }

    const handleChangeProducttypemaestrosunicos = (event) => {
        setProducttypemaestrosunicos(event.target.value);
    }
    
    const onChangeEmision = (event) => {
        setProducttypedescription(event.value);
    }
    
    
    async function handleSubmit (){
        const dataSubmit ={
            "producttypemaestrosunicos": producttypemaestrosunicos,
            "credittaxaccountinterest": credittaxaccountinterest,
            "credittaxaccount": credittaxaccount,
            "debittaxaccountinterest": debittaxaccountinterest,
            "debittaxaccount": debittaxaccount,
            "producttypedescription": producttypedescription,
        }
        const responseCreate = await service.createItemConfiguracionGeneral(dataSubmit).then(response => {
            return response;
            }
        );
        if(responseCreate.status===200){
            toast.success("Configuración registrada correctamente.");
        }else{
            toast.error("Error al registrar configuración.");
        }

        
        setCredittaxaccount("")
        setDebittaxaccount("")
        setCredittaxaccountinterest("")
        setDebittaxaccountinterest("")
        setProducttypedescription("0")
        setProducttypemaestrosunicos("")
        
        props.setSave(new Date());

    }


    useEffect(() => { 
        document.title = title
    }, [producttypedescription]);

    return(
            <Modal
                actions={[
                    <Button node="button" small modal="close" className="indigo darken-4" onClick={handleSubmit}>Guardar</Button>,
                    <Button flat modal="close" node="button" waves="green">Cancelar</Button>
                ]}
                bottomSheet={false}
                fixedFooter={false}
                header={title}
                id="Modal-1"
                open={false}
                options={{
                    dismissible: true,
                    endingTop: '20%',
                    inDuration: 250,
                    onCloseEnd: null,
                    onCloseStart: null,
                    onOpenEnd: null,
                    onOpenStart: null,
                    opacity: 0.5,
                    outDuration: 250,
                    preventScrolling: true,
                    startingTop: '4%'
                }}
                trigger={<Button node="button" small className="indigo darken-4">Nuevo</Button>}
                >
                    <Row></Row>
                    <Row>
                            <Col s={12} m={9} >
                                <label className="active">Tipo de emisión</label>
                                <Select className="basic-single" defaultValue={props.emisiones[0]} options={props.emisiones} onChange={onChangeEmision} />
                            </Col>
                            <Col s={12} m={3} >
                            <div className="input-field">
                                <input type="number" className="valid" onChange={handleChangeProducttypemaestrosunicos}
                                id="producttypemaestrosunicosId" value={producttypemaestrosunicos}/>
                                <label htmlFor="producttypemaestrosunicosId">Número de Cuenta</label>
                            </div>
                            </Col>
                    </Row>
                    <Row>

                            <Col s={12} m={3} >
                                <div className="input-field">
                                    <input type="number" className="valid" onChange={handleChangeCredittaxaccount}
                                    id="credittaxaccountId" value={credittaxaccount}/>
                                    <label htmlFor="credittaxaccountId">Cuenta crédito</label>
                                </div>
                            </Col>
                            <Col s={12} m={3} >
                                <div className="input-field">
                                    <input type="number" className="valid" onChange={handleChangeDebittaxaccount}
                                    id="debittaxaccountId" value={debittaxaccount}/>
                                    <label htmlFor="debittaxaccountId">Cuenta débito</label>
                                </div>
                            </Col>
                            <Col s={12} m={3} >
                                <div className="input-field">
                                    <input type="number" className="valid" onChange={handleChangeCredittaxaccountinterest}
                                    id="credittaxaccountinterestId" value={credittaxaccountinterest}/>
                                    <label htmlFor="credittaxaccountinterestId">Cuenta crédito interés</label>
                                </div>
                            </Col>
                            <Col s={12} m={3} >
                                <div className="input-field">
                                    <input type="number" className="valid" onChange={handleChangeDebittaxaccountinterest}
                                    id="debittaxaccountinterestId" value={debittaxaccountinterest}/>
                                    <label htmlFor="debittaxaccountinterestId">Cuenta débito interés</label>
                                </div>
                            </Col>
                    </Row>
                    
                </Modal>
        );
}