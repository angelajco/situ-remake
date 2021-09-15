import { Modal,Container,Form, Row, Col, Table, Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faEye, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { useAuthState } from '../../context';
import { useState, useEffect} from "react";
import ModalComponent from '../../components/ModalComponent';
import axios from 'axios'

export default function AltaRolUsuarios() {

    const [funcionesDisponiblesOptions, setFuncionesDisponiblesOptions] = useState([]);
    const [renderFuncionesDisponibles, setRenderFuncionesDisponibles] = useState(false);

    const [rolesExistentes, setRolesExistentes] = useState([]);
    const [renderRolesExistentes, setRenderRolesExistentes] = useState(true);

    const [rolSeleccionado, setRolSeleccionado] = useState({});
    const [esConsulta, setEsConsulta] = useState(false);

    const userDetails = useAuthState().user;


    const renderAcciones = (idFuncion,acciones, accionesAsignadas)=>{
        return acciones.map(accion => {
            return esConsulta?
                    <Form.Check type="checkbox" label={accion.titulo} value={accion.idAccion} name={idFuncion} checked={accionesAsignadas?accionesAsignadas.filter(a=>a.idFuncion===accion.idAccion).length>0:false}/>:
                    <Form.Check type="checkbox" label={accion.titulo} value={accion.idAccion} name={idFuncion} defaultChecked={accionesAsignadas?accionesAsignadas.filter(a=>a.idFuncion===accion.idAccion).length>0:false}/>;
        });
    }

    const seekFuncion = (funciones,funcion)=>{
        for(let fn of funciones){
            if(fn.idFuncion===funcion.idFuncion){
                return [fn];
            }else{
                if(fn.hijas){
                    let ansTemp = seekFuncion(fn.hijas, funcion);
                    if(ansTemp.length>0){
                        return ansTemp;
                    }
                }
            }
        }
        return [];
    }

    const renderFuncionItem = (funcion) => {
        let funcionAsignada = rolSeleccionado.funciones?seekFuncion(rolSeleccionado.funciones, funcion):[];
        funcionAsignada = funcionAsignada.length>0?funcionAsignada[0]:null;
        let acciones = funcion.acciones?renderAcciones(funcion.idFuncion,funcion.acciones, funcionAsignada?funcionAsignada.hijas:null):'';
        return <tr>
                    <td>
                        <Form.Group className="mb-3" id = "">
                            {esConsulta?
                                <Form.Check type="checkbox" value={funcion.idFuncion} name="funciones" checked={funcionAsignada?true:false}/>:
                                <Form.Check type="checkbox" value={funcion.idFuncion} name="funciones" defaultChecked={funcionAsignada?true:false}/>}
                        </Form.Group>
                    </td>
                    <td style={{ paddingLeft: `${funcion.spacing}rem` }} >{funcion.titulo}</td>
                    <td>{funcion.pagina}</td>
                    <td><Form.Group className="mb-3" id = "">{acciones}</Form.Group></td>
                </tr>;
    }

    const expand = (funcion, nivel) =>{
        let funcExp = [];
        funcion.spacing = nivel;
        funcExp.push(funcion);
        if(funcion.submenu){
            funcion.submenu.forEach(fe=>{
                expand(fe, nivel+3).forEach(expF=>{
                    funcExp.push(expF);
                });
            });
        }
        return funcExp;
    }

    const renderFuncionesDisponiblesF = (funciones)=>{
        return funciones.map(funcion => {
            return expand(funcion, 0).map(expFun =>{
                return renderFuncionItem(expFun);
            });
        });
    }

    
    //Datos para el modal
    const [show, setShow] = useState(false);
    const [datosModal, setDatosModal] = useState(
        {
            title: '',
            body: ''
        }
    );
    //Estados para mostrar el modal
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const guardaRol = (evnt)=>{
        var bodyFormData = new FormData(evnt.currentTarget.form);
        if(rolSeleccionado.idRol){
            bodyFormData.append("esModificacion",true);
        }
        let requestHeaders = { "Content-Type": "multipart/form-data" };
        requestHeaders[`${userDetails.csrfToken.headerName}`]=userDetails.csrfToken.token;
        axios.post(`${process.env.ruta}/wa/prot/guardaRol`,bodyFormData,{headers: requestHeaders, withCredentials: true})
                .then(response => {
                    setShowForm(false);
                    handleShow();
                    setDatosModal({
                            title: `${rolSeleccionado.idRol?'Modificación':'Alta'} de Rol`,
                            body: 'Datos guardados con éxito'
                        });
                    setRenderRolesExistentes(true);
                });
    }

    //Datos para el modal Roles
    const [showForm, setShowForm] = useState(false);
    const RenderForm = () =>{
        return <Modal
        show={showForm}
        backdrop="static"
        contentClassName="custom-modal-form-roles-style"
        centered>

        <Modal.Header closeButton>
            <Modal.Title>{esConsulta?'Consulta':rolSeleccionado.idRol?'Modificación':'Alta'} de Rol</Modal.Title>
        </Modal.Header>

        <Modal.Body>
                <Form>
                    <Row>
                        <Col xs = {7}>
                            <Form.Group>
                                <Form.Label><b>Identificador</b> </Form.Label>
                                    <Form.Control type = "text" id = "idRol" name="idRol" defaultValue={rolSeleccionado.idRol} readOnly={esConsulta||(!esConsulta&&rolSeleccionado.idRol)}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label><b>Descripción</b> </Form.Label>
                                <Form.Control as = "textarea" id = "descripcion" name="descripcion" rows = {2} defaultValue={rolSeleccionado.descripcion} readOnly={esConsulta}/>
                            </Form.Group>
                            <Form.Group className="mb-3" >
                                {esConsulta?
                                    <Form.Check type="checkbox" label="Habilitado" id = "habilitado" checked={rolSeleccionado.habilitado?true:false} name="habilitado" />:
                                    <Form.Check type="checkbox" label="Habilitado" id = "habilitado" defaultChecked={rolSeleccionado.habilitado?true:false} name="habilitado" />}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group>
                        <h3>Selección de Funcionalidad</h3>
                    </Form.Group>
                    <Form.Group>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Función</th>
                                    <th>Página</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {funcionesDisponiblesOptions}
                            </tbody>
                        </Table>
                    </Form.Group>
                    <Form.Group>
                        <Button className="tw-mb-4 tw-border tw-border-black" variant="light" onClick={() => setShowForm(false)}>Cerrar</Button>   {!esConsulta&&<Button className="tw-mb-4 tw-border tw-border-black" variant="light" onClick={guardaRol} > Guardar </Button>}
                    </Form.Group>
                </Form>
        </Modal.Body>

    </Modal>
    };

    const actionButtons = (cell, row, rowIndex, formatExtraData) =>{
        return (
            <div className="d-flex justify-content-center" >
                <Form.Group>
                    {row.acciones.filter(a => a.idAccion === 'GESTION_ROLES_MODIFICACION').length > 0 && 
                        <Button variant="light" onClick={() => {setEsConsulta(false);setRenderFuncionesDisponibles(true);setRolSeleccionado(row);setShowForm(true);}}>
                            <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                        </Button>}
                    {row.acciones.filter(a => a.idAccion === 'GESTION_ROLES_CONSULTA').length > 0 && 
                        <Button variant="light" onClick={() => {setEsConsulta(true);setRenderFuncionesDisponibles(true);setRolSeleccionado(row);setShowForm(true);}}>
                            <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                        </Button>}
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
    const columns = [{
                            dataField: 'idRol',
                            text: 'Identificador',
                            headerAlign: 'center',
                            formatter: cell => <div className="d-flex justify-content-center">{cell}</div>
                        }, {
                            dataField: 'descripcion',
                            text: 'Nombre',
                            headerAlign: 'center',
                            formatter: cell => <div className="d-flex justify-content-center">{cell}</div>
                        }, {
                            dataField: 'acciones',
                            text: 'Acciones',
                            headerAlign: 'center',
                            formatter: actionButtons
                    }];


    useEffect(() => {
        if(renderFuncionesDisponibles){
            let requestHeaders = {};
            requestHeaders[`${userDetails.csrfToken.headerName}`]=userDetails.csrfToken.token;
            axios.get(`${process.env.ruta}/wa/prot/getFuncionesDisponibles`,{headers: requestHeaders, withCredentials: true})
                .then(response=>{
                    setRenderFuncionesDisponibles(false);
                    setFuncionesDisponiblesOptions(renderFuncionesDisponiblesF(response.data));
                });
        }

        if(renderRolesExistentes){
            let requestHeaders = {};
            requestHeaders[`${userDetails.csrfToken.headerName}`]=userDetails.csrfToken.token;
            axios.get(`${process.env.ruta}/wa/prot/getRolesDisponibles`,{headers: requestHeaders, withCredentials: true})
                .then(response=>{
                    setRenderRolesExistentes(false);
                    response.data.forEach(rol=>rol.acciones = userDetails.accionesCurrentPath);
                    setRolesExistentes(response.data);
                });
        }
    });

    return(
        <Container>
            <ModalComponent
            show={show}
            datos={datosModal}
            onHide={handleClose}
            onClick={handleClose}
                />
        {userDetails.accionesCurrentPath.filter(a => a.idAccion === 'GESTION_ROLES_ALTA').length > 0 && 
            <Button variant="secondary" onClick={() => {setEsConsulta(false);setRenderFuncionesDisponibles(true);setRolSeleccionado({});setShowForm(true);}}>
                <FontAwesomeIcon icon={faPlusCircle}></FontAwesomeIcon>
            </Button>}
        <BootstrapTable 
            bootstrap4 
            keyField='rolesTable' 
            data={rolesExistentes} 
            columns={columns} 
            pagination={pagination}
            noDataIndication="No hay resultados de la búsqueda" 
            /*defaultSorted={ defaultSorted }*/
        />
        {showForm &&
            <RenderForm/>}
        </Container>

    )
}