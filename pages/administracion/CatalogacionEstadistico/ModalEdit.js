import { useAuthState } from '../../../context/context';
import { useState, useEffect } from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import { Modal, Button, Form, Col } from 'react-bootstrap';
import ModalComponent from '../../../components/ModalComponent';
import React from 'react';
import ReactDOM from 'react-dom';
import {
    getAmbitos,
    getByTablaCatColumnasProdest,
    updateCatProdEstadisticos
} from '../../../components/Catalogos'

export default function ModalEdit(props) {
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
    const [table, setTable] = useState([]);
    const [columnsTable, setColumnsTable] = useState([]);
    async function handleAmbito() { if (ambitos.length < 1) setAmbitos(await getAmbitos()) }
    async function handleColumnsTable() { if (columnsTable.length < 1) setColumnsTable(await getByTablaCatColumnasProdest(csrfToken, table)) }
    useEffect(() => {
        handleAmbito();
        setPalabrasClave([]);
        if(props!==undefined && props.tableSelect!==undefined){
			if(props.show){
				console.log("Configuración seleccionada",props.tableSelect)
				let tabla = props.tableSelect;
                setTable(tabla);
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

        getColumnsTable(columns);

        if (tabla.palabraClave!==null) {
            let data = tabla.palabraClave.split("|").sort();
            data.forEach(element => {
                setPalabrasClave((oldClaves) => ([...oldClaves, { palabra: element }]));
            });
        }
        if(tabla.nivelDesagregacion!==null){
            let desagregacion = ambitos.find(f=> f.id==tabla.nivelDesagregacion);
            if(desagregacion!==null && desagregacion!==undefined){
                document.getElementById("desagregacion").value = desagregacion.id;
            }
        }
        if(tabla.colEntidad !==null){
            let entidad = columns.find(f=> f.id===tabla.colEntidad);
            if(entidad!==null && entidad!==undefined){
                document.getElementById("entidad").value = JSON.stringify(entidad);
            }
        }
        if(tabla.colMunicipal !==null){
            let municipio = columns.find(f=> f.id===tabla.colMunicipal);
            if(municipio!==null && municipio!==undefined){
                document.getElementById("municipio").value = JSON.stringify(municipio);
            }
        }
        if(tabla.colLocalidad !==null){
            let localidad = columns.find(f=> f.id===tabla.colLocalidad);
            if(localidad!==null && localidad!==undefined){
                document.getElementById("localidad").value = JSON.stringify(localidad);
            }
        }
        if(tabla.colAgeb !==null){
            let ageb = columns.find(f=> f.id===tabla.colAgeb);
            if(ageb!==null && ageb!==undefined){
                document.getElementById("ageb").value = JSON.stringify(ageb);
            }
        }
        if(tabla.filtroMinimo!==null){
            let filtroMinimo = ambitos.find(f=> f.id==tabla.filtroMinimo);
            if(filtroMinimo!==null && filtroMinimo!==undefined){
                document.getElementById("filtroMinimo").value = filtroMinimo.id;
            }
        }
        if(tabla.activo !==null){
            let activo = tabla.activo;
            if(activo!==null && activo!==undefined){
                document.getElementById("activo").checked = activo; 
            }
        }
    }
    //Llenado de combos Segunda Fase
    async function getColumnsTable(columns) {
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

    async function submitForm() {
        let catProdEstadisticos = table;
        //Nombre de la tabla
        let nombre = document.getElementById("txtNombre").value;
        if (nombre === null || nombre === "") {
            setDatosModal({ title: "Advertencia!", body: "Debe ingresar el Nombre del Conjunto de Datos, favor verificar" });
            handleShow();
            return;
        }
        catProdEstadisticos["nombre"] = nombre;
        //Descripción
        let descripcion = document.getElementById("taDescripcion").value;
        if (descripcion === null || descripcion === "") {
            setDatosModal({ title: "Advertencia!", body: "Debe ingresar una Descripción, favor verificar" });
            handleShow();
            return;
        }
        catProdEstadisticos["descripcion"] = descripcion;
        //Palabras Clave
        let buildPalabrasClave;
        if (palabrasClave.length > 0) {
            palabrasClave.forEach(function (val, ind, arr) {
                ind === 0 ? buildPalabrasClave = val.palabra.trim() : buildPalabrasClave = buildPalabrasClave + "|" + val.palabra.trim()
            });
            catProdEstadisticos["palabraClave"] = buildPalabrasClave;
        }else{
            catProdEstadisticos["palabraClave"] = null;
        }
        //Llave GeoEstadistica
        let llaveGeoEstadistica = document.getElementById("llaveGeoEstadistica").value;
        if (llaveGeoEstadistica !== undefined && llaveGeoEstadistica !== null && llaveGeoEstadistica !== "") {
            llaveGeoEstadistica = JSON.parse(llaveGeoEstadistica);
            catProdEstadisticos["llaveGeoest"] = llaveGeoEstadistica.id;
        }else{
            catProdEstadisticos["llaveGeoest"] = null;
        }
        //Nivel de Desagregación
        let nivelDesagregacion = document.getElementById("desagregacion").value;
        if (nivelDesagregacion !== undefined && nivelDesagregacion !== null && nivelDesagregacion !== "") {
            catProdEstadisticos["nivelDesagregacion"] = nivelDesagregacion;
        }else{
            catProdEstadisticos["nivelDesagregacion"] = null;
        }
        //Columna Entidad
        let colEntidad = document.getElementById("entidad").value;
        if (colEntidad !== undefined && colEntidad !== null && colEntidad !== "") {
            colEntidad = JSON.parse(colEntidad);
            catProdEstadisticos["colEntidad"] = colEntidad.id;
        }else{
            catProdEstadisticos["colEntidad"] = null;
        }
        //Columna Municipio
        let colMunicipal = document.getElementById("municipio").value;
        if (colMunicipal !== undefined && colMunicipal !== null && colMunicipal !== "") {
            colMunicipal = JSON.parse(colMunicipal);
            catProdEstadisticos["colMunicipal"] = colMunicipal.id;
        }else{
            catProdEstadisticos["colMunicipal"] = null;
        }
        //Columna Localidad
        let colLocalidad = document.getElementById("localidad").value;
        if (colLocalidad !== undefined && colLocalidad !== null && colLocalidad !== "") {
            colLocalidad = JSON.parse(colLocalidad);
            catProdEstadisticos["colLocalidad"] = colLocalidad.id;
        }else{
            catProdEstadisticos["colLocalidad"] = null;
        }
        //Columna AGEB
        let colAgeb = document.getElementById("ageb").value;
        if (colAgeb !== undefined && colAgeb !== null && colAgeb !== "") {
            colAgeb = JSON.parse(colAgeb);
            catProdEstadisticos["colAgeb"] = colAgeb.id;
        }else{
            catProdEstadisticos["colAgeb"] = null;
        }
        //Filtro Mínimo
        let filtroMinimo = document.getElementById("filtroMinimo").value;
        if (filtroMinimo !== undefined && filtroMinimo !== null && filtroMinimo !== "") {
            catProdEstadisticos["filtroMinimo"] = filtroMinimo;
        }else{
            catProdEstadisticos["filtroMinimo"] = 0;
        }
        //Activo
        let activo = document.getElementById("activo").checked;
        console.log("activo",activo)
        if (activo !== undefined && activo !== null && activo !== "") {
            catProdEstadisticos["activo"] = activo;
        }else{
            catProdEstadisticos["activo"] = false;
        }

        console.log("catProdEstadisticos", catProdEstadisticos);
        await updateCatProdEstadisticos(csrfToken, catProdEstadisticos);
        close();
    }

    function close(){
		props.refreshItems(true);
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
                            <Form.Control type="text" placeholder={INGRESAR} id="txtNombre" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Etiqueta Funcional</Form.Label>
                            <Form.Control type="text" placeholder={INHABILITADO} id="txtEtiquetaFuncional" disabled />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder={INGRESAR} id="taDescripcion" />
                        </Form.Group>
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
                            <Form.Group as={Col}>
                                <Form.Group as={Col} className="text-center">
                                    <Form.Label></Form.Label>
                                    <Form.Check type="checkbox" label="Activo" id="activo"/>
                                </Form.Group>
                            </Form.Group>
                        </Form.Row>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
					<Button variant="secondary" onClick={() => close()}>Cerrar</Button>
					<Button variant="primary" onClick={() => submitForm()}>Guardar</Button>
				</Modal.Footer>

            </Modal>
        </>
    )
}