import { useAuthState } from '../../../context/context';
import { useState, useEffect } from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import { Modal, Button, Form, Col } from 'react-bootstrap';
import ModalComponent from '../../../components/ModalComponent';
import React from 'react';
import ReactDOM from 'react-dom';
import {
    getTablasDisponiblesAdmonGeoEstadistica,
    getAmbitos,
    insertaPreRegistroAdministracionGeoEstadistica,
    getByIdCatProdEstadisticos,
    getByTablaCatColumnasProdest,
    updateCatProdEstadisticos
} from '../../../components/Catalogos'

export default function ModalAdd(props) {
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
    const [tablas, setTablas] = useState([]);
    const [ambitos, setAmbitos] = useState([]);
    async function handleTablas(csrfToken) {
        let tab = await getTablasDisponiblesAdmonGeoEstadistica(csrfToken);
        if (tab === undefined || tab.length < 1) { tab = []; }
        setTablas(tab);
    }
    async function handleAmbito() { if (ambitos.length < 1) setAmbitos(await getAmbitos()) }
    useEffect(() => {
        handleTablas(csrfToken);
        handleAmbito();
        setSegundaFase()
        setShowSegundaFase(false);
        setCatProdEstadisticos();
        setPalabrasClave([]);
    }, [props]);

    //Segunda fase de captura
    const [segundaFase, setSegundaFase] = useState(null);
    const [showSegundaFase, setShowSegundaFase] = useState(false);
    const [catProdEstadisticos, setCatProdEstadisticos] = useState();
    const FormSegundaFase = () => {
        return (
            <React.Fragment>
                <Form.Group>
                    <Form.Label>Palabras Clave</Form.Label>
                </Form.Group>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Group>
                            <Form.Control type="text" id="palabraClave" placeholder={INGRESAR} />
                        </Form.Group>
                        <Form.Group as={Col} className="text-right">
                            <Button variant="secondary"
                                onClick={() => {
                                    const a = document.getElementById("palabraClave").value;
                                    setPalabraClave(a);
                                    document.getElementById("palabraClave").value = ""
                                }
                                }>Agregar</Button>
                        </Form.Group>
                    </Form.Group>
                    <Form.Group as={Col} className="text-center">
                        <div className="scrollTable" id="tablaPalabrasClave">
                            <BootstrapTable
                                bootstrap4
                                keyField='palabra'
                                data={palabrasClave}
                                columns={columns}
                                noDataIndication="No se han agregado Palabras Clave"
                                selectRow={selectRowRemove}
                            />
                        </div>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>Llave GeoEstadistica</Form.Label>
                        <Form.Control as="select" id='llaveGeoEstadistica' defaultValue="" >
                            <option value="" >{SELECCIONAR}</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Nivel de desagregación</Form.Label>
                        <Form.Control as="select" id='desagregacion' defaultValue="">
                            <option value="">{SELECCIONAR}</option>
                            {
                                ambitos.map((value, index) => (
                                    <option key={index} value={value.id}>
                                        {value.descripcion}
                                    </option>
                                ))
                            }
                        </Form.Control>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>Columna Entidad</Form.Label>
                        <Form.Control as="select" id='entidad' defaultValue="">
                            <option value="">{SELECCIONAR}</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Columna Municipio</Form.Label>
                        <Form.Control as="select" id='municipio' defaultValue="">
                            <option value="">{SELECCIONAR}</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Columna Localidad</Form.Label>
                        <Form.Control as="select" id='localidad' defaultValue="">
                            <option value="">{SELECCIONAR}</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Columna AGEB</Form.Label>
                        <Form.Control as="select" id='ageb' defaultValue="">
                            <option value="">{SELECCIONAR}</option>
                        </Form.Control>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>Filtro Mínimo</Form.Label>
                        <Form.Control as="select" id='filtroMinimo' defaultValue="">
                            <option value="" >{SELECCIONAR}</option>
                            {
                                ambitos.map((value, index) => (
                                    <option key={index} value={value.id}>
                                        {value.descripcion}
                                    </option>
                                ))
                            }
                        </Form.Control>
                    </Form.Group>
                </Form.Row>
                <Form.Group>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="primary" className="pull-right" id="btnTerminar" onClick={() => handleTerminar()}>Terminar</Button>
                    </div>
                </Form.Group>
            </React.Fragment>
        )
    }
    useEffect(() => {
        if (showSegundaFase === true) {
            setSegundaFase(FormSegundaFase())
            document.getElementById("btnSiguiente").style.display = "none";
            document.getElementById("cbTablas").disabled = true;
            document.getElementById("txtNombre").disabled = true;
            document.getElementById("txtEtiquetaFuncional").disabled = true;
            document.getElementById("taDescripcion").disabled = true;

        }
    }, [showSegundaFase]);
    async function handlePreRegistro() {
        let tabla = document.getElementById("cbTablas").value;
        if (tabla === null || tabla === "") {
            setDatosModal({ title: "Advertencia!", body: "Debe seleccionar una Tabla, favor verificar" });
            handleShow();
            return;
        }
        tabla = JSON.parse(document.getElementById("cbTablas").value);
        if (tabla === null || tabla === "") {
            setDatosModal({ title: "Advertencia!", body: "Debe seleccionar una Tabla, favor verificar" });
            handleShow();
            return;
        }
        let nombre = document.getElementById("txtNombre").value;
        if (nombre === null || nombre === "") {
            setDatosModal({ title: "Advertencia!", body: "Debe ingresar el Nombre del Conjunto de Datos, favor verificar" });
            handleShow();
            return;
        }
        let etiquetaFuncional = document.getElementById("txtEtiquetaFuncional").value;
        if (etiquetaFuncional === null || etiquetaFuncional === "") {
            setDatosModal({ title: "Advertencia!", body: "Debe capturar la Etiqueta Funcional, favor verificar" });
            handleShow();
            return;
        }
        let descripcion = document.getElementById("taDescripcion").value;
        if (descripcion === null || descripcion === "") {
            setDatosModal({ title: "Advertencia!", body: "Debe ingresar una Descripción, favor verificar" });
            handleShow();
            return;
        }
        let preRegistro = {
            nombreTabla: tabla.tableName,
            esquema: tabla.tableSchema,
            nombre: nombre,
            etiquetaFuncional: etiquetaFuncional[etiquetaFuncional.length - 1] === "_" ? etiquetaFuncional : etiquetaFuncional + "_",
            descripcion: descripcion
        }
        let id = await insertaPreRegistroAdministracionGeoEstadistica(csrfToken, preRegistro);
        let registro = await getByIdCatProdEstadisticos(csrfToken, id)
        console.log(registro);
        getColumnsTable(registro);
        setCatProdEstadisticos(registro);
        setShowSegundaFase(true);
    }
    async function handleTerminar() {
        //Palabras Clave
        let buildPalabrasClave;
        if(palabrasClave.length>0){
            palabrasClave.forEach(function (val, ind, arr) {
				ind === 0?buildPalabrasClave = val.palabra.trim():buildPalabrasClave = buildPalabrasClave + "|" + val.palabra.trim()
			});
            catProdEstadisticos["palabraClave"] = buildPalabrasClave;
        }
        //Llave GeoEstadistica
        let llaveGeoEstadistica = document.getElementById("llaveGeoEstadistica").value;
        if(llaveGeoEstadistica!==undefined && llaveGeoEstadistica!==null && llaveGeoEstadistica!==""){
            llaveGeoEstadistica = JSON.parse(llaveGeoEstadistica);
            catProdEstadisticos["llaveGeoest"] = llaveGeoEstadistica.id;
        }
        //Nivel de Desagregación
        let nivelDesagregacion = document.getElementById("desagregacion").value;
        if(nivelDesagregacion!==undefined && nivelDesagregacion!==null && nivelDesagregacion!==""){
            catProdEstadisticos["nivelDesagregacion"] = nivelDesagregacion;
        }
        //Columna Entidad
        let colEntidad = document.getElementById("entidad").value;
        if(colEntidad!==undefined && colEntidad!==null && colEntidad!==""){
            colEntidad = JSON.parse(colEntidad);
            catProdEstadisticos["colEntidad"] = colEntidad.id;
        }
        //Columna Municipio
        let colMunicipal = document.getElementById("municipio").value;
        if(colMunicipal!==undefined && colMunicipal!==null && colMunicipal!==""){
            colMunicipal = JSON.parse(colMunicipal);
            catProdEstadisticos["colMunicipal"] = colMunicipal.id;
        }
        //Columna Localidad
        let colLocalidad = document.getElementById("localidad").value;
        if(colLocalidad!==undefined && colLocalidad!==null && colLocalidad!==""){
            colLocalidad = JSON.parse(colLocalidad);
            catProdEstadisticos["colLocalidad"] = colLocalidad.id;
        }
        //Columna AGEB
        let colAgeb = document.getElementById("ageb").value;
        if(colAgeb!==undefined && colAgeb!==null && colAgeb!==""){
            colAgeb = JSON.parse(colAgeb);
            catProdEstadisticos["colAgeb"] = colAgeb.id;
        }
        //Filtro Mínimo
        let filtroMinimo = document.getElementById("filtroMinimo").value;
        if(filtroMinimo!==undefined && filtroMinimo!==null && filtroMinimo!==""){
            filtroMinimo = JSON.parse(filtroMinimo);
            catProdEstadisticos["filtroMinimo"] = filtroMinimo;
        }

        console.log("catProdEstadisticos",catProdEstadisticos)
        await updateCatProdEstadisticos(csrfToken, catProdEstadisticos);
        close();
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
        setSegundaFase(FormSegundaFase());
    }, [palabraClave]);
    const selectRowRemove = {
        mode: 'checkbox',
        clickToSelect: true,
        hideSelectColumn: true,
        onSelect: (row, isSelect, rowIndex, e) => {
            setPalabrasClave(palabrasClave.filter(f => f !== row))
        }
    }
    const columns = [{
        dataField: 'palabra',
        text: 'Palabras Clave',
        sort: true,
        headerAlign: 'center',
        formatter: cell => <div className="d-flex justify-content-center">{cell}</div>
    }];

    //Llenado de combos Segunda Fase
    async function getColumnsTable(registro) {
        console.log(registro)
        let columns = await getByTablaCatColumnasProdest(csrfToken, registro.nombreTabla);
        console.log("colums", columns);
        let cbEntidad = document.getElementById("entidad");
        let cbMunicipio = document.getElementById("municipio");
        let cbLocalidad = document.getElementById("localidad");
        let cbAgeb = document.getElementById("ageb");
        let cbLlaveGeoEstadistica = document.getElementById("llaveGeoEstadistica");
        columns.forEach(function (v) {
            addOptions(cbEntidad, v);
            addOptions(cbMunicipio, v);
            addOptions(cbLocalidad, v);
            addOptions(cbAgeb, v);
            addOptions(cbLlaveGeoEstadistica, v);
        });
    }
    function addOptions(comboBox, value) {
        let option = document.createElement("option");
        option.value = JSON.stringify(value);
        option.text = value.columna;
        comboBox.add(option)
    }

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
                            <Form.Label>Tablas Disponibles</Form.Label>
                            <Form.Control as="select" id='cbTablas' defaultValue="" >
                                <option value="" disabled>{SELECCIONAR}</option>
                                {
                                    tablas.map((value, index) => (
                                        <option key={index} value={JSON.stringify(value)}>
                                            {value.tableName}
                                        </option>
                                    ))
                                }
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Nombre Conjunto de Datos</Form.Label>
                            <Form.Control type="text" placeholder={INGRESAR} id="txtNombre" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Etiqueta Funcional</Form.Label>
                            <Form.Control type="text" placeholder={INGRESAR} id="txtEtiquetaFuncional" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder={INGRESAR} id="taDescripcion" />
                        </Form.Group>
                        <Form.Group>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button variant="primary" className="pull-right" id="btnSiguiente" onClick={() => handlePreRegistro()}>Siguiente</Button>
                            </div>
                        </Form.Group>
                        {segundaFase}
                    </Form>
                </Modal.Body>

            </Modal>
        </>
    )
}