import { Container,Form, Row, Col, Table, Button ,ListGroup,ButtonGroup  } from "react-bootstrap";
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { useAuthState } from '../../context';
import { useState, useEffect} from "react";
import axios from 'axios'
import ModalComponent from '../../components/ModalComponent';

export default function AsignacionRolUsuarios() {

    const [isLoading, setIsLoading] = useState(false);
    const [userSelectOptions, setUserSelectOptions] = useState([]);
  
    const userDetails = useAuthState().user;

    const handleUserSearch = async (userQueryString) => {
        setIsLoading(true);
    
        let requestHeaders = {};
        requestHeaders[`${userDetails.csrfToken.headerName}`]=userDetails.csrfToken.token;
        let response = await axios.get(`${process.env.ruta}/wa/prot/filtroUsuarios?userQueryString=`+userQueryString,{headers: requestHeaders, withCredentials: true});

        const options = response.data.map((i) => ({
            value: i.idUsuario,
            label: i.idUsuario + ' - ' + i.datosUsuario.nombre + ' ' + i.datosUsuario.apMaterno + ' ' + i.datosUsuario.apPaterno,
            name: 'id_usuario',
          }));
  
          setUserSelectOptions(options);
          setIsLoading(false);
      };

    // Bypass client-side filtering by returning `true`. Results are already
    // filtered by the search endpoint, so no need to do it again.
    const filterBy = () => true;

    const [rolesAsignadosSelectOptions, setRolesAsignadosSelectOptions] = useState([]);
    const [rolesAsignadosRawSelectOptions, setRolesAsignadosRawSelectOptions] = useState([]);
    const [rolAsignadoSeleccionado, setRolAsignadoSeleccionado] = useState('');
    const [renderRolesAsignados, setRenderRolesAsignados] = useState(false);

    const [rolesDisponiblesSelectOptions, setRolesDisponiblesSelectOptions] = useState([]);
    const [rolesDisponiblesRawSelectOptions, setRolesDisponiblesRawSelectOptions] = useState([]);
    const [renderRolesDisponibles, setRenderRolesDisponibles] = useState(true);
    const [rolDisponibleSeleccionado, setRolDisponibleSeleccionado] = useState('');

    const [agregarDisabled, setAgregarDisabled] = useState(false);
    const [quitarDisabled, setQuitarDisabled] = useState(true);
    const [guardarDisabled, setGuardarDisabled] = useState(true);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('');

    const renderRolItem = (rol, rolSeleccionado, onClickRol) => {
        return <ListGroup.Item as="div" id={rol.idRol} active={(rolSeleccionado === rol.idRol)?true:false} action onClick={onClickRol}>{rol.descripcion}</ListGroup.Item>;
    }

    const renderRolesAsignadosF = (roles)=>{
        return roles.map(rol => {
            return renderRolItem(rol, rolAsignadoSeleccionado, (rolSeleccionado)=> {
                                                                    setRolAsignadoSeleccionado(rolSeleccionado.target.id);
                                                                    setRenderRolesAsignados(true);
                                                                });
        });
    }

    const setRolesAsignados = (rolesAsignados)=>{
        setRolesAsignadosRawSelectOptions(rolesAsignados);
        rolesAsignados.forEach(rolAsignado => { 
            let disIdx = rolesDisponiblesRawSelectOptions.findIndex(rolDisponible => rolDisponible.idRol === rolAsignado.idRol);
            if(disIdx >=0){
                rolesDisponiblesRawSelectOptions.splice(disIdx, 1); 
            }
        });
        if(rolesDisponiblesRawSelectOptions.length===0){
            setAgregarDisabled(true);
        }
        if(rolesAsignados.length > 0){
            setQuitarDisabled(false);
        }
        setQuitarDisabled(false);
        setRolesDisponiblesRawSelectOptions(rolesDisponiblesRawSelectOptions);
        setRolesDisponiblesSelectOptions(renderRolesDisponiblesF(rolesDisponiblesRawSelectOptions));
        setRolesAsignadosSelectOptions(renderRolesAsignadosF(rolesAsignados));
    }

    const setRolesDisponibles = (rolesDisponibles)=>{
        setRolesDisponiblesRawSelectOptions(rolesDisponibles);
        rolesDisponibles.forEach(rolDisponible => { 
            let disIdx = rolesAsignadosRawSelectOptions.findIndex(rolAsignado => rolAsignado.idRol === rolDisponible.idRol);
            if(disIdx >=0){
                rolesAsignadosRawSelectOptions.splice(disIdx, 1); 
            }
        });
        if(rolesAsignadosRawSelectOptions.length===0){
            setQuitarDisabled(true);
        }
        if(rolesDisponibles.length > 0){
            setAgregarDisabled(false);
        }
        setRolesAsignadosRawSelectOptions(rolesAsignadosRawSelectOptions);
        setRolesAsignadosSelectOptions(renderRolesAsignadosF(rolesAsignadosRawSelectOptions));
        setRolesDisponiblesSelectOptions(renderRolesDisponiblesF(rolesDisponibles));
    }

    const onUsuarioSeleccionado = (usuarioSel) => {
        let requestHeaders = {};
        requestHeaders[`${userDetails.csrfToken.headerName}`]=userDetails.csrfToken.token;
        axios.get(`${process.env.ruta}/wa/prot/getRolesFor?idUsuario=`+usuarioSel[0].value,{headers: requestHeaders, withCredentials: true})
             .then(response=>{
                setRolesAsignadosRawSelectOptions(response.data);
                setRolesAsignados(response.data);
                if(response.data.length>0){
                    setQuitarDisabled(false);
                }
                setGuardarDisabled(false);
                setUsuarioSeleccionado(usuarioSel[0].value);
             });
    };

    const renderRolesDisponiblesF = (roles)=>{
        return roles.map(rol => {
            return renderRolItem(rol, rolDisponibleSeleccionado, (rolSeleccionado)=> {
                                                                    setRolDisponibleSeleccionado(rolSeleccionado.target.id);
                                                                    setRenderRolesDisponibles(true);
                                                                });
        });
    }

    const CenteredDiv = ({ children }) => (
        <div style={{"display": "flex", "justifyContent": "center", "alignItems": "center"}}>
            <div style={{"maxWidth": "50%"}}>
                {children}
            </div>
        </div>
    );

    const agregaRol = ()=>{
        let rolSeleccionado = rolesDisponiblesRawSelectOptions.find(rolDisponible => rolDisponible.idRol === rolDisponibleSeleccionado);
        rolesAsignadosRawSelectOptions.push(rolSeleccionado);
        setRolesAsignados(rolesAsignadosRawSelectOptions);
    }

    const quitaRol = ()=>{
        let rolSeleccionado = rolesAsignadosRawSelectOptions.find(rolAsignado => rolAsignado.idRol === rolAsignadoSeleccionado);
        rolesDisponiblesRawSelectOptions.push(rolSeleccionado);
        setRolesDisponibles(rolesDisponiblesRawSelectOptions);
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

    const guardaRolesAsignados = ()=>{
        var bodyFormData = new FormData();
        bodyFormData.append('idUsuario', usuarioSeleccionado);
        rolesAsignadosRawSelectOptions.forEach(rolAsignado=>{
            bodyFormData.append(`rolesAsignados`, rolAsignado.idRol);
        });
        let requestHeaders = { "Content-Type": "multipart/form-data" };
        requestHeaders[`${userDetails.csrfToken.headerName}`]=userDetails.csrfToken.token;
        axios.post(`${process.env.ruta}/wa/prot/asignaRolesUsuario`,bodyFormData,{headers: requestHeaders, withCredentials: true})
                .then(response => {
                    handleShow();
                    setDatosModal({
                            title: 'Asignación de Roles',
                            body: 'Datos guardados con éxito'
                        });
                });
    }


    useEffect(() => {
        if(renderRolesDisponibles){
            if(rolesDisponiblesRawSelectOptions.length===0){
                let requestHeaders = {};
                requestHeaders[`${userDetails.csrfToken.headerName}`]=userDetails.csrfToken.token;
                axios.get(`${process.env.ruta}/wa/prot/getRolesDisponibles`,{headers: requestHeaders, withCredentials: true})
                     .then(response=>{
                         setRenderRolesDisponibles(false);
                         setRolesDisponiblesRawSelectOptions(response.data);
                         setRolesDisponiblesSelectOptions(renderRolesDisponiblesF(response.data));
                     });
            } else {
                setRenderRolesDisponibles(false);
                setRolesDisponiblesSelectOptions(renderRolesDisponiblesF(rolesDisponiblesRawSelectOptions));
            }
        }

        if(renderRolesAsignados){
            setRenderRolesAsignados(false);
            setRolesAsignadosSelectOptions(renderRolesAsignadosF(rolesAsignadosRawSelectOptions));
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
            <Form>
                <Row>
                    <Col xs = {8}>
                    <Form.Group>
                        <h3>Asignación de Roles</h3>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label><b>Identificador de Usuario</b> </Form.Label>
                        <AsyncTypeahead
                            filterBy={filterBy}
                            id="id_usuario"
                            isLoading={isLoading}
                            labelKey={"label"}
                            minLength={4}
                            onSearch={handleUserSearch}
                            options={userSelectOptions}
                            placeholder="Buscar usuario..."
                            onChange={onUsuarioSeleccionado}
                            />
                    </Form.Group>
                    </Col>
                </Row>

                <Form.Group>
                    <h3>Selección de Roles</h3>
                    <Row>
                        <Col xs={1}></Col>
                        <Col xs={4}>
                            <Form.Group>
                                <Form.Label><b>Disponibles</b> </Form.Label>
                                <ListGroup id = "disponibles">
                                    {rolesDisponiblesSelectOptions}
                                </ListGroup>
                            </Form.Group>
                        </Col>
                        <Col xs={2}>
                            <CenteredDiv>
                                {userDetails.accionesCurrentPath.filter(a => a.idAccion === 'ASIGNACION_ROLES_EDICION').length > 0 && 
                                    <ButtonGroup vertical>
                                        <Button className="tw-block tw-mb-4 tw-border tw-border-black" variant="light" onClick={agregaRol} disabled={agregarDisabled}> Agregar </Button>
                                        <Button className="tw-block tw-mb-4 tw-border tw-border-black" variant="light" onClick={quitaRol} disabled={quitarDisabled}> Quitar </Button>
                                    </ButtonGroup>}
                            </CenteredDiv>
                        </Col>
                        <Col xs={4}>
                            <Form.Group>
                            <Form.Label><b>Asignados</b> </Form.Label>
                                <ListGroup id = "asignados">
                                    {rolesAsignadosSelectOptions}
                                </ListGroup>
                            </Form.Group>
                        </Col>
                        <Col xs={1}></Col>
                    </Row>
                </Form.Group>
                {userDetails.accionesCurrentPath.filter(a => a.idAccion === 'ASIGNACION_ROLES_EDICION').length > 0 && 
                    <Button className="tw-block tw-mb-4 tw-border tw-border-black" variant="light" onClick={guardaRolesAsignados} disabled={guardarDisabled}> Guardar </Button>}
            </Form>
        </Container>
    )
}