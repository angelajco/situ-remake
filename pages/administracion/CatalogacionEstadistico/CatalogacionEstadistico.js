import { useAuthState } from '../../../context/context';
import { useState, useEffect } from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faEdit, faEye, faCog, faColumns } from '@fortawesome/free-solid-svg-icons'
import { Button, Form } from 'react-bootstrap';
import ModalAdd from './ModalAdd'
import ModalEdit from './ModalEdit'
import ModalView from './ModalView'
import ModalColumns from './ModalColumns'
import React from 'react';
import {
    findAllCatProdEstadisticos
} from '../../../components/Catalogos'

export default function AdministracionGeoEstadistica(props) {
    //Datos Usuario
    const userDetails = useAuthState().user;
    let csrfToken = userDetails.csrfToken;
    //CATALOGOS
    const [items, setItems] = useState([]);
    useEffect(() => {
        refreshItems();
    });
    async function refreshItems(edit) {
        let consulta = await findAllCatProdEstadisticos(csrfToken);
        if(items.length !== consulta.length){
            setItems(consulta);
        }else if(edit===true){
            setItems(consulta)
        }
    }
     //PROPIEDASDES TABLE
     const columns = [{
        dataField: 'id',
        text: 'ID',
        sort: true,
        headerAlign: 'center',
        formatter: cell => <div className="d-flex justify-content-center">{cell}</div>
    }, {
        dataField: 'nombre',
        text: 'Titulo',
        sort: true,
        headerAlign: 'center',
        formatter: cell => <div className="d-flex justify-content-center">{cell}</div>
    }, {
        dataField: 'nombreTabla',
        text: 'Tabla',
        sort: true,
        headerAlign: 'center',
        formatter: cell => <div className="d-flex justify-content-center">{cell}</div>
    }, {
        dataField: '',
        text: 'Acciones',
        headerAlign: 'center',
        formatter: actionButtons
}];
function actionButtons (cell, row, rowIndex, formatExtraData) {
    return (
        <div className="d-flex justify-content-center" >
        <Form.Group>
            <Button variant="light" onClick={() => abrirModalEdit(row)}>
                <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
            </Button>
             <Button variant="light" onClick={() => abrirModalView(row)}>
                <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
            </Button>
            <Button variant="light" onClick={() => abrirModalColumns(row)}>
                <FontAwesomeIcon icon={faColumns}></FontAwesomeIcon>
            </Button>
        </Form.Group>
        </div>
    );
};
const pagination = paginationFactory({
    sizePerPage: 5,
    alwaysShowAllBtns: true,
    sizePerPageList: [5, 10, 15],
    withFirstAndLast: false
});
const defaultSorted = [{
    dataField: 'idTablero',
    order: 'desc'
}];

    //MODAL ADD
    const [showModalAdd, setShowModalAdd] = useState(false);
    const handleCloseModalAdd = () => setShowModalAdd(false);
    const abrirModalAdd = () => { setShowModalAdd(true); }
    //MODAL EDIT
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [editTable, setEditTable] = useState();
    const handleCloseModalEdit = () => setShowModalEdit(false);
    const abrirModalEdit = (row) => { setEditTable(row); setShowModalEdit(true); }
    //MODAL VIEW
    const [showModalView, setShowModalView] = useState(false);
    const [viewTable, setViewTable] = useState();
    const handleCloseModalView = () => setShowModalView(false);
    const abrirModalView = (row) => { setViewTable(row); setShowModalView(true); }
    //MODAL COLUMNS
    const [showModalColumns, setShowModalColumns] = useState(false);
    const [viewColumns, setColumns] = useState();
    const handleCloseModalColumns = () => setShowModalColumns(false);
    const abrirModalColumns = (row) => { setColumns(row); setShowModalColumns(true); }

    return (
        <>
            {/* CREACIÓN DE PANTALLA MODAL ADD */}
            <ModalAdd
                show={showModalAdd}
                onHide={handleCloseModalAdd}
                onClick={handleCloseModalAdd}
                refreshItems={refreshItems}
            />
            {/* CREACIÓN DE PANTALLA MODAL EDIT */}
            <ModalEdit
                show={showModalEdit}
                onHide={handleCloseModalEdit}
                onClick={handleCloseModalEdit}
                refreshItems={refreshItems}
                tableSelect = {editTable}
            />
            {/* CREACIÓN DE PANTALLA MODAL VIEW */}
            <ModalView
                show={showModalView}
                onHide={handleCloseModalView}
                onClick={handleCloseModalView}
                refreshItems={refreshItems}
                tableSelect = {viewTable}
            />
            {/* CREACIÓN DE PANTALLA MODAL COLUMNS */}
            <ModalColumns
                show={showModalColumns}
                onHide={handleCloseModalColumns}
                onClick={handleCloseModalColumns}
                refreshItems={refreshItems}
                tableSelect = {viewColumns}
            />

            <div className="main">
                <div className="container">
                    {/* TITULO */}
                    <div className="d-flex justify-content-center" >Catalogación GeoEstadistica</div>
                    <Form>
                        {/* GENERACION TABLA */}
                        <Form.Group>
                            <BootstrapTable
                                bootstrap4
                                keyField='id'
                                data={items}
                                columns={columns}
                                pagination={pagination}
                                noDataIndication="No hay resultados de la búsqueda"
                                defaultSorted={defaultSorted}
                            />
                        </Form.Group>
                        {/* BUTTON ADD TABLERO */}
                        <Form.Group>
                            <Button variant="secondary" onClick={() => abrirModalAdd()}>
                                <FontAwesomeIcon icon={faPlusCircle}></FontAwesomeIcon>
                            </Button>
                        </Form.Group>
                    </Form>
                </div>
            </div>

        </>
    )
}