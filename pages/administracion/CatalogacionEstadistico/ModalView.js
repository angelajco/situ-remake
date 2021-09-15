import { useAuthState } from '../../../context/context';
import { useRef, useState, useEffect, useCallback} from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import { Modal, Button, Form, Col, onChange, Tabs, Tab, Container} from 'react-bootstrap';
import ModalComponent from '../../../components/ModalComponent';
import React from 'react';
import {
    getTablasDisponiblesAdmonGeoEstadistica,
    getAmbitos,
    insertaPreRegistroAdministracionGeoEstadistica,
    getByIdCatProdEstadisticos,
    getByTablaCatColumnasProdest
} from '../../../components/Catalogos'

export default function ModalView(props){
    //Datos Usuario
    const userDetails = useAuthState().user;
    let csrfToken = userDetails.csrfToken;
    let filter = { idUsuario: userDetails.id }
    //Modal mensajes
    const [show, setShow] = useState(false);
    const [datosModal, setDatosModal] = useState({ title: '', body: '' });
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    //CONSTANTES
    const SELECCIONAR = "Seleccionar";
    const INGRESAR = "Ingresar";
    const INHABILITADO = "Inhabilitado";
    //Catalogos
    const [ambitos, setAmbitos] = useState([]);
    async function handleAmbito() { if (ambitos.length < 1) setAmbitos(await getAmbitos()) }
    useEffect(() => {
        handleAmbito();
        setPalabrasClave([]);
        if(props!==undefined && props.tableSelect!==undefined){
			if(props.show){
				console.log("Configuración seleccionada",props.tableSelect)
				let tabla = props.tableSelect;
				llenaFormularioView(tabla);
			}
        }
    }, [props]);
    async function llenaFormularioView(tabla){
        let columns = await getByTablaCatColumnasProdest(csrfToken, tabla.nombreTabla);
        console.log("colums",columns)
        document.getElementById("txtTabla").value = tabla.nombreTabla;
        document.getElementById("txtNombre").value = tabla.nombre;
        document.getElementById("txtEtiquetaFuncional").value = tabla.etiquetaFuncional;
        document.getElementById("taDescripcion").value = tabla.descripcion;
        if (tabla.palabraClave!==null) {
            let data = tabla.palabraClave.split("|").sort();
            data.forEach(element => {
                setPalabrasClave((oldClaves) => ([...oldClaves, { palabra: element }]));
            });
        }
        if(tabla.nivelDesagregacion!==null){
            let desagregacion = ambitos.find(f=> f.id==tabla.nivelDesagregacion);
            if(desagregacion!==null && desagregacion!==undefined){
                document.getElementById("desagregacion").value = desagregacion.descripcion;
            }
        }
        if(tabla.colEntidad !==null){
            let entidad = columns.find(f=> f.id===tabla.colEntidad);
            if(entidad!==null && entidad!==undefined){
                document.getElementById("entidad").value = entidad.columna; 
            }
        }
        if(tabla.colMunicipal !==null){
            let municipio = columns.find(f=> f.id===tabla.colMunicipal);
            if(municipio!==null && municipio!==undefined){
                document.getElementById("municipio").value = municipio.columna; 
            }
        }
        if(tabla.colLocalidad !==null){
            let localidad = columns.find(f=> f.id===tabla.colLocalidad);
            if(localidad!==null && localidad!==undefined){
                document.getElementById("localidad").value = localidad.columna; 
            }
        }
        if(tabla.colAgeb !==null){
            let ageb = columns.find(f=> f.id===tabla.colAgeb);
            if(ageb!==null && ageb!==undefined){
                document.getElementById("ageb").value = ageb.columna; 
            }
        }
        if(tabla.filtroMinimo!==null){
            let filtroMinimo = ambitos.find(f=> f.id==tabla.filtroMinimo);
            if(filtroMinimo!==null && filtroMinimo!==undefined){
                document.getElementById("filtroMinimo").value = filtroMinimo.descripcion;
            }
        }
        if(tabla.activo !==null){
            let activo = tabla.activo;
            if(activo!==null && activo!==undefined){
                document.getElementById("activo").checked = activo; 
            }
        }
    }

    //Palabra Clave
    const [palabraClave, setPalabraClave] = useState();
    const [palabrasClave, setPalabrasClave] = useState([]);
    useEffect(() => {
        if (palabraClave !== undefined) {
            if (palabraClave === "") {
                setDatosModal({ title: "Advertencia!", body: "No se permiten vacios, favor verificar" });
                handleShow();
                return;
            }
            const duplicado = palabrasClave.filter(f => f.palabra == palabraClave);
            if (duplicado.length >= 1) {
                setDatosModal({ title: "Advertencia!", body: "El valor capturado ya se encuentra registrado, favor verificar" });
                handleShow();
                return;
            }
            setPalabrasClave((oldClaves) => ([...oldClaves, { palabra: palabraClave }]));
            setPalabraClave();
        }
    }, [palabraClave]);
    const columns = [{
        dataField: 'palabra',
        text: 'Palabras Clave',
        sort: true,
        headerAlign: 'center',
        formatter: cell => <div className="d-flex justify-content-center">{cell}</div>
    }];

    function close(){
		props.refreshItems();
		props.onClick();
	}

    return (
        <>
            {/*Construcción de modal para mensajes*/}
            <ModalComponent show={show} datos={datosModal} onHide={handleClose} onClick={handleClose} />

            <Modal
                show={props.show}
                onHide={() => props.onHide()}
                backdrop="static"
                centered
                contentClassName="custom-modal-tablero-indicadores-style"
            >

                <Modal.Header closeButton>
                    <Modal.Title>Catalogación Estadistico</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Tablas</Form.Label>
                            <Form.Control type="text" placeholder={INHABILITADO} id="txtTabla" disabled />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Nombre Conjunto de Datos</Form.Label>
                            <Form.Control type="text" placeholder={INHABILITADO} id="txtNombre" disabled />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Etiqueta Funcional</Form.Label>
                            <Form.Control type="text" placeholder={INHABILITADO} id="txtEtiquetaFuncional" disabled />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder={INGRESAR} id="taDescripcion" disabled />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Palabras Clave</Form.Label>
                        </Form.Group>
                        <Form.Row>
                            <Form.Group as={Col} className="text-center">
                                <div className="scrollTable" id="tablaPalabrasClave">
                                    <BootstrapTable
                                        bootstrap4
                                        keyField='palabra'
                                        data={palabrasClave}
                                        columns={columns}
                                        noDataIndication="No se han agregado Palabras Clave"
                                    />
                                </div>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Llave GeoEstadistica</Form.Label>
								<Form.Control type="text" placeholder={INHABILITADO} id="llaveGeoEstadistica" disabled />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Nivel de desagregación</Form.Label>
								<Form.Control type="text" placeholder={INHABILITADO} id="desagregacion" disabled />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Columna Entidad</Form.Label>
								<Form.Control type="text" placeholder={INHABILITADO} id="entidad" disabled />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Columna Municipio</Form.Label>
								<Form.Control type="text" placeholder={INHABILITADO} id="municipio" disabled />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Columna Localidad</Form.Label>
								<Form.Control type="text" placeholder={INHABILITADO} id="localidad" disabled />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Columna AGEB</Form.Label>
								<Form.Control type="text" placeholder={INHABILITADO} id="ageb" disabled />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Filtro Mínimo</Form.Label>
                                <Form.Control type="text" placeholder={INHABILITADO} id="filtroMinimo" disabled />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Group as={Col} className="text-center">
                                    <Form.Label></Form.Label>
                                    <Form.Check type="checkbox" label="Activo" id="activo" disabled/>
                                </Form.Group>
                            </Form.Group>
                        </Form.Row>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
					<Button variant="secondary" onClick={() => close()}>Cerrar</Button>
				</Modal.Footer>

            </Modal>
        </>
    )
}