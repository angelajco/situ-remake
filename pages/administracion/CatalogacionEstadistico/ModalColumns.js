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
    updateCatColumnasProdest
} from '../../../components/Catalogos'

export default function ModalColumns(props) {
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
    const [columnEdit, setColumnEdit] = useState([]);
    async function handleAmbito() { if (ambitos.length < 1) setAmbitos(await getAmbitos()) }
    useEffect(() => {
        setPalabrasClave([]);
        handleAmbito();
        if(props!==undefined && props.tableSelect!==undefined){
			if(props.show){
				console.log("Configuración seleccionada",props.tableSelect)
				let tabla = props.tableSelect;
                setTable(tabla);
                llenaComboColumna(tabla)
			}
        }
    }, [props]);
    
    async function llenaComboColumna(tabla){
        let columns = await getByTablaCatColumnasProdest(csrfToken, tabla.nombreTabla);
        console.log("colums",columns)
        setColumnsTable(columns);
    }

    async function llenaFormularia(columnSelect){
        let column = JSON.parse(columnSelect);
        setColumnEdit(column);
        console.log(column);
        //Columna
        document.getElementById("columnas").disabled = true;
        //Id
        document.getElementById("id").value = column.id;
        //Encabezado
        document.getElementById("encabezado").value = column.encabezado;
        document.getElementById("encabezado").disabled = false;
        document.getElementById("encabezado").placeholder = INGRESAR;
        //Tipo
        document.getElementById("tipo").value = column.tipo;
        //Descripción
        document.getElementById("descripcion").value = column.descripcion;
        document.getElementById("descripcion").disabled = false;
        document.getElementById("descripcion").placeholder = INGRESAR;
        //Palabras Clave
        document.getElementById("palabraClave").disabled = false;
        document.getElementById("palabraClave").placeholder = INGRESAR;
        if (column.palabraClave!==null) {
            let data = column.palabraClave.split("|").sort();
            data.forEach(element => {
                setPalabrasClave((oldClaves) => ([...oldClaves, { palabra: element }]));
            });
        }
        //Nivel Desagregación
        document.getElementById("desagregacion").disabled = false;
        if(column.nivelDesagregacion!==null){
            let desagregacion = ambitos.find(f=> f.id==column.nivelDesagregacion);
            if(desagregacion!==null && desagregacion!==undefined){
                document.getElementById("desagregacion").value = desagregacion.id;
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
        let catColumnasProdest = columnEdit;

        //Encabezado
        let encabezado = document.getElementById("encabezado").value;
        if (encabezado !== undefined && encabezado !== null && encabezado !== "") {
            catColumnasProdest["encabezado"] = encabezado;
        }else{
            catColumnasProdest["encabezado"] = null;
        }
        //Descripción
        let descripcion = document.getElementById("descripcion").value;
        if (descripcion !== undefined && descripcion !== null && descripcion !== "") {
            catColumnasProdest["descripcion"] = descripcion;
        }else{
            catColumnasProdest["descripcion"] = null;
        }
        //Palabras Clave
        let buildPalabrasClave;
        if (palabrasClave.length > 0) {
            palabrasClave.forEach(function (val, ind, arr) {
                ind === 0 ? buildPalabrasClave = val.palabra.trim() : buildPalabrasClave = buildPalabrasClave + "|" + val.palabra.trim()
            });
            catColumnasProdest["palabraClave"] = buildPalabrasClave;
        }else{
            catColumnasProdest["palabraClave"] = null;
        }
        //Nivel de Desagregación
        let nivelDesagregacion = document.getElementById("desagregacion").value;
        if (nivelDesagregacion !== undefined && nivelDesagregacion !== null && nivelDesagregacion !== "") {
            catColumnasProdest["nivelDesagregacion"] = nivelDesagregacion;
        }else{
            catColumnasProdest["nivelDesagregacion"] = null;
        }
        console.log("catColumnasProdest", catColumnasProdest);
        await updateCatColumnasProdest(csrfToken, catColumnasProdest);
        close();
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
                    <Modal.Title>Catalogación Columnas</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Columna</Form.Label>
                            <Form.Control as="select" id='columnas' defaultValue="" onChange={e => {llenaFormularia(e.target.value)}}>
                                <option value="" disabled>{SELECCIONAR}</option>
                                {
                                    columnsTable.map((value, index) => (
                                        <option key={index} value={JSON.stringify(value)}>
                                            {value.columna}
                                        </option>
                                    ))
                                }
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Id</Form.Label>
                            <Form.Control type="text" placeholder={INHABILITADO} id="id" disabled />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Encabezado</Form.Label>
                            <Form.Control type="text" placeholder={INHABILITADO} id="encabezado" disabled />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Tipo</Form.Label>
                            <Form.Control type="text" placeholder={INHABILITADO} id="tipo" disabled />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control type="text" placeholder={INHABILITADO} id="descripcion" disabled />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Palabras Clave</Form.Label>
                        </Form.Group>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Group>
                                    <Form.Control type="text" id="palabraClave" placeholder={INHABILITADO}  disabled/>
                                </Form.Group>
                                <Form.Group as={Col} className="text-right">
                                    <Button variant="secondary" id="palabraClaveButton"
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
                        <Form.Group>
                                <Form.Label>Nivel de desagregación</Form.Label>
                                <Form.Control as="select" id='desagregacion' defaultValue="" disabled>
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