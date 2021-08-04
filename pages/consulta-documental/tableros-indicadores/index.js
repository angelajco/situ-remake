import { Table, Button, Form, Pagination} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faEdit, faEye, faCog } from '@fortawesome/free-solid-svg-icons'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { useState, useEffect } from "react";
import {getByFilterTableros} from './Catalogos'
import ModalTabAdd from './ModalTabAdd'
import ModalTabEdit from './ModalTabEdit'
import ModalTabView from './ModalTabView'
import ModalMetas from './ModalMetas'
import { useAuthState } from '../../../context/context';

export default function TablerosComponent(props) {
    //Datos Usuario
    const userDetails = useAuthState().user;
    let csrfToken = userDetails.csrfToken;
    let filter = {idUsuario:userDetails.id}
    //CATALOGOS
    const [tabs, setTabs] = useState([]);
    useEffect(() => {
        refreshTabs();
    });
    async function refreshTabs (edit){
        let t = await getByFilterTableros(csrfToken,filter)
        if(tabs.length !== t.length){
            setTabs(t)
        }else if(edit===true){
            setTabs(t)
        }
    }
    //PROPIEDASDES TABLE
    const columns = [{
            dataField: 'idTablero',
            text: 'No.',
            sort: true,
            headerAlign: 'center',
            formatter: cell => <div className="d-flex justify-content-center">{cell}</div>
        }, {
            dataField: 'titulo',
            text: 'Titulo',
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
                <Button variant="light" onClick={() => abrirModalMetas(row)}>
                    <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                </Button>
                 <Button variant="light" onClick={() => abrirModalTabView(row)}>
                    <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                </Button>
                <Button variant="light" onClick={() => abrirModalTabEdit(row)}>
                    <FontAwesomeIcon icon={faCog}></FontAwesomeIcon>
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
    const [showModalTabAdd, setShowModalTabAdd] = useState(false);
    const handleCloseModalTabAdd = () => setShowModalTabAdd(false);
	const abrirModalTabAdd = () => { setShowModalTabAdd(true); }
    //MODAL EDIT
    const [showModalTabEdit, setShowModalTabEdit] = useState(false);
    const [editTab, setEditTab] = useState();
    const handleCloseModalTabEdit = () => setShowModalTabEdit(false);
	const abrirModalTabEdit = (row) => { setEditTab(row); setShowModalTabEdit(true);}
    //MODAL VIEW
    const [showModalTabView, setShowModalTabView] = useState(false);
    const [viewTab, setViewTab] = useState();
    const handleCloseModalTabView = () => setShowModalTabView(false);
	const abrirModalTabView = (row) => { setViewTab(row); setShowModalTabView(true);}
    //MODAL METAS
    const [showModalMetas, setShowModalMetas] = useState(false);
    const [metas, setMetas] = useState();
    const handleCloseModalMetas = () => setShowModalMetas(false);
	const abrirModalMetas = (row) => { setMetas(row); setShowModalMetas(true);}

    return (
        <>
            {/* CREACIÓN DE PANTALLA MODAL ADD */}
            <ModalTabAdd  
                show={showModalTabAdd}   
                onHide={handleCloseModalTabAdd}  
                onClick={handleCloseModalTabAdd} 
                refreshTabs = {refreshTabs}
            />
            {/* CREACIÓN DE PANTALLA MODAL EDIT */}
            <ModalTabEdit 
                show={showModalTabEdit} 
                onHide={handleCloseModalTabEdit} 
                onClick={handleCloseModalTabEdit} 
                refreshTabs = {refreshTabs} 
                tableroSelect = {editTab} 
            />
            {/* CREACIÓN DE PANTALLA MODAL VIEW */}
            <ModalTabView 
                show={showModalTabView} 
                onHide={handleCloseModalTabView} 
                onClick={handleCloseModalTabView} 
                refreshTabs = {refreshTabs} 
                tableroSelect = {viewTab}
            />
            {/* CREACIÓN DE PANTALLA MODAL METAS */}
            <ModalMetas 
                show={showModalMetas}
                onHide={handleCloseModalMetas}
                onClick={handleCloseModalMetas}
                refreshTabs = {refreshTabs}
                tableroSelect = {metas}
            />

            <div className="main">
                <div className="container">
                    {/* TITULO */}
                    <div className="d-flex justify-content-center" >Tableros e Indicadores</div>
                    <Form>
                        {/* GENERACION TABLA */}
                        <Form.Group>
                            <BootstrapTable 
                                bootstrap4 
                                keyField='idTablero' 
                                data={tabs} 
                                columns={columns} 
                                pagination={pagination}
                                noDataIndication="No hay resultados de la búsqueda" 
                                defaultSorted={ defaultSorted }
                            />
                        </Form.Group>
                        {/* BUTTON ADD TABLERO */}
                        <Form.Group>
                            <Button variant="secondary" onClick={() => abrirModalTabAdd()}>
                                <FontAwesomeIcon icon={faPlusCircle}></FontAwesomeIcon>
                            </Button>
                        </Form.Group>
                    </Form>
                </div>
            </div>
        </>
    )
}