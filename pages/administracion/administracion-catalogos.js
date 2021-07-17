import { useEffect, useState } from "react"
import { Tabs, Tab, Button, OverlayTrigger, Tooltip, Form, Modal } from 'react-bootstrap'

import dynamic from 'next/dynamic'
import Router from 'next/router'
import axios from 'axios'
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faCheckCircle, faTimesCircle, faUser } from '@fortawesome/free-solid-svg-icons'

import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';

import ModalComponent from '../../components/ModalComponent';
import ModalFunction from '../../components/ModalFunction';

import Cookies from 'universal-cookie'
const cookies = new Cookies()

import {useForm} from 'react-hook-form' 

export default function AdministracionCatalogos() {

    // Estado para guardar el web token que se pide a la API
    const [tokenSesion, setTokenSesion] = useState(false)
    // Guarda el token que viene en la cookie para verificar que la tenga
    const tokenCookie = cookies.get('SessionToken')
    const rolCookie = cookies.get('RolUsuario')
    const estatusCookie = cookies.get('EstatusUsuario')

    //Variable para guardar todos los catálogos
    const [catalogos, setCatalogos] = useState([])

    //Variable para guardar los datos de un solo Catálogo
    const [infoCatalogo, setInfoCatalogo] = useState([])
    //Variable para guardar los datos de las columnas
    const [columnasCat, setColumnasCat] = useState([])
    
    const [usuarios, setUsuarios] = useState([])
    const [noUsuarios, setNoUsuarios] = useState([])
    const [siUsuarios, setSiUsuarios] = useState([])
    //Datos para el modal component
    const [show, setShow] = useState(false);
    const [datosModal, setDatosModal] = useState(
        {
            title: '',
            body: ''
        }
    );
    //Estados para mostrar el modal component
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //Datos para el modal function
    const [showFunction, setShowFunction] = useState(false);
    const [nombreFuncion, setNombreFuncion] = useState(false)
    const [datosModalFunction, setDatosModalFunction] = useState(
        {
            title: '',
            body: ''
        }
    );
    //Estados para mostrar el modal component
    const handleCloseFunction = () => setShowFunction(false);
    //const handleShowFunction = () => setShowFunction(true);

    //Importar dinamicamente el loader
    const Loader = dynamic(() => import('../../components/Loader'));

    useEffect(() => {
        if ((rolCookie != 1 && rolCookie != 2) || estatusCookie != 10) {
            Router.push('/');
        }
    }, [rolCookie, estatusCookie])

    useEffect(() => {
        if (tokenCookie != undefined) 
        {
            let config1 = {
                headers: { Authorization: `Bearer ${tokenCookie}` }
            };

            axios.get( 
            `${process.env.ruta}/wa/prot/getAllCatalogos`,
            config1
            ).then(response => {
                setCatalogos(response.data);
            })
            .catch((error) => {
                console.log('error ' + error);
            })
            
            fetch(`${process.env.ruta}/wa/prot/getOneCatalogo?id_catalogo=1` , {
            headers: {
                    Authorization: `Bearer ${tokenCookie}`
                    }
            })
            .then(res => res.json())
            .then(
                (data) => {setIdActual(1)
                    setInfoCatalogo(data)
                },
                (error) => console.log(error)
            )
            
            fetch(`${process.env.ruta}/wa/prot/getColumnasCatalogo?id_catalogo=1` , {
            headers: {
                    Authorization: `Bearer ${tokenCookie}`
                    }
            })
                    .then(res => res.json())
                    .then(
                        (data) => setColumnasCat(data),
                        (error) => console.log(error)
            )
       }
        else {
            Router.push('/administracion/inicio-sesion')
        }
    }, [tokenCookie])


        
    useEffect(() => {
        if (tokenCookie != undefined) {
            // Configuracion para verificar el token
            var config = {
                method: 'get',
                url: `${process.env.ruta}/wa/prot/acceso`,
                headers: {
                    'Authorization': `Bearer ${tokenCookie}`
                },
            };
            axios(config)
                .then(function (response) {
                    setTokenSesion(response.data['success-boolean'])
                    
                    fetch(`${process.env.ruta}/wa/publico/showByEstRol?id_estatus=5&id_rol=1,2`)
                        .then(res => res.json())
                        .then(
                            (data) => setUsuarios(data),
                            (error) => console.log(error)
                        )
                })
                .catch(function (error) {
                    console.log(error)
                    cookies.remove('SessionToken', { path: "/" })
                    Router.push("/administracion/inicio-sesion")
                })
                

        }
        else {
            Router.push('/administracion/inicio-sesion')
        }
    }, [tokenCookie])
    
    const [idActual, setIdActual] = useState(null)
    
    const muestraInfo = (id_catalogos) => {
        fetch(`${process.env.ruta}/wa/prot/getOneCatalogo?id_catalogo=${id_catalogos}` , {
            headers: {
                    Authorization: `Bearer ${tokenCookie}`
                    }
            })
            .then(res => res.json())
            .then(
                (data) => {setIdActual(id_catalogos)
                    setInfoCatalogo(data)
                },
                (error) => console.log(error)
            )
            
        fetch(`${process.env.ruta}/wa/prot/getColumnasCatalogo?id_catalogo=${id_catalogos}` , {
            headers: {
                    Authorization: `Bearer ${tokenCookie}`
                    }
            })
                    .then(res => res.json())
                    .then(
                        (data) => setColumnasCat(data),
                        (error) => console.log(error)
            )
    }

  /*  const limpiaInfo = () => {
        setInfoCatalogo();
    } */

    const variableHeader = () => {
     if (infoCatalogo != undefined) {
          return infoCatalogo.map(x => Object.keys(x))
          console.log(infoCatalogo.map(x => Object.keys(x))[0]);
      }
    }
    
    const completaNombre = (cell, row) => {
        return row.catalogo
    }
            
    const accionesAutorizados = (cell, row) => {
        return (
            <div className="tw-text-center">
                <OverlayTrigger placement="bottom" overlay={<Tooltip>Ver información</Tooltip>}>
                    <FontAwesomeIcon className="tw-mr-3 tw-cursor-pointer" onClick={() => { muestraInfo(row.id_catalogos)}} icon={faEye}></FontAwesomeIcon>
                </OverlayTrigger>
            </div>
        )
    }

    const { SearchBar } = Search;

    const columnsCatalogos = [
        {
            dataField: 'catalogo',
            text: 'Nombre del Catálogo',
            formatter: completaNombre
        },
        {
            dataField: 'acciones',
            text: 'Acciones',
            formatter: accionesAutorizados
        }
    ];


    
    //Acciones Sobre solo un catálogo    
    const accionesOneCatalogo = (cell, row) => {
        return (
            <div className="tw-text-center">
                <OverlayTrigger placement="bottom" overlay={<Tooltip>Actualizar</Tooltip>}>
                    <FontAwesomeIcon className="tw-mr-3 tw-cursor-pointer tw-text-inst-verdec" onClick={() => abrirModal(row, true)} icon={faCheckCircle}></FontAwesomeIcon>
                </OverlayTrigger>
            </div>
        )
    }
                          
    //ColumnasFormulario2Dinamicas    

    
    let variable1 = "[";
    
    let variable2 = "";
    if (columnasCat != undefined) {
        const foundBoleano = columnasCat.find(boleano => boleano === "en_uso");
        if(foundBoleano != undefined)
            {
            for(var i = 0; i < columnasCat.length - 1; i++){
                variable2=variable2+"{dataField : '" + columnasCat[i] + "',text : '" + columnasCat[i] + "', sort: true},";
                } 
            variable2=variable2+"{dataField: 'en_uso', text: 'en_uso', validator: (newValue, row, column) => {if ((newValue === 'true') || (newValue === 'false')) { return true; } else {return {valid: false, message: 'Solo acepta: true/false'};} return true}},";   
            }
        else
            {
            for(var i = 0; i < columnasCat.length; i++){
                variable2=variable2+"{dataField : '" + columnasCat[i] + "',text : '" + columnasCat[i] + "', sort: true},";
                }
            }
    }
    
    let variable3 = "{dataField: 'acciones', text: 'Acciones', formatter: accionesOneCatalogo, editable: false}];";

    let variableFinal = variable1 + variable2 + variable3;  
    
   const columnsOneCatalogo = eval(variableFinal)
                  
    const pagination = paginationFactory({
        sizePerPage: 10,
        alwaysShowAllBtns: true,
        sizePerPageList: [10, 25, 50, 100],
        withFirstAndLast: false,
        prePageTitle: [],
        nextPageTitle: []
    });

    //ActualizarDato
    //InicializarObjetoVacio
    const columsNull = () => {
        if (infoCatalogo != undefined) { 
            let catalogoNull = {};
            
            for (var i = 0; i < columnasCat.length; i++){
                catalogoNull[columnasCat[i]] = null;
            }
            return catalogoNull
        }
    }

    //const hola = {id_ambito_actuacion: null, ambito_actuacion: null, descripcion: null, en_uso: null}
    const [updateInfoCatalogo, setUpdateInfoCatalogo] = useState(columsNull)
    
    const abrirModal = (infoCatalogo) => {
            const catalogoFull = [];
           
            for (var i = 0; i < columnasCat.length; i++){
                catalogoFull.push(columnasCat[i]+" : infoCatalogo."+columnasCat[i]);
            }
            const textCatFull = eval("({"+catalogoFull.join()+"})");

        setUpdateInfoCatalogo(textCatFull)
        setShowFunction(true);
            setDatosModalFunction({
                title: 'Actualización de catálogos',
                body: '¿Desea actualizar ' + infoCatalogo.concepto + "?",
                id: idActual
            });
        }

    const updateCatalogo = (id) => {
        handleCloseFunction();
        const urlprueba = [];
        for (var i = 0; i < columnasCat.length; i++){
                urlprueba.push(columnasCat[i]+"='${updateInfoCatalogo."+columnasCat[i]+"}'");
        }
        console.log(urlprueba, 'urlprueba');
        const urlFinal = eval('`'+urlprueba.join('&')+'`');
        
        console.log(urlFinal, 'urlFinal');
        var config = {
            method: 'get',
            url: `${process.env.ruta}/wa/prot/updateDatoCatalogo?id_catalogo=${id}&${urlFinal}`,
            headers: {
                'Authorization': `Bearer ${tokenCookie}`
            },
        };
        axios(config)
            .then(function (response) {
                setDatosModal({
                    title: response.data['message-subject'],
                    body: response.data['message']
                })
                handleShow();

                fetch(`${process.env.ruta}/wa/publico/showByEstRol?id_estatus=5&id_rol=1,2`)
                    .then(res => res.json())
                    .then(
                        (data) => setUsuarios(data),
                        (error) => console.log(error)
                    )

                fetch(`${process.env.ruta}/wa/publico/showByEstRol?id_estatus=10`)
                    .then(res => res.json())
                    .then(
                        (data) => setSiUsuarios(data),
                        (error) => console.log(error)
                    )

        fetch(`${process.env.ruta}/wa/prot/getOneCatalogo?id_catalogo=${id}` , {
            headers: {
                    Authorization: `Bearer ${tokenCookie}`
                    }
            })
            .then(res => res.json())
            .then(
                (data) => {setIdActual(id)
                    setInfoCatalogo(data)
                },
                (error) => console.log(error)
            )
            
          fetch(`${process.env.ruta}/wa/prot/getColumnasCatalogo?id_catalogo=${id}` , {
            headers: {
                    Authorization: `Bearer ${tokenCookie}`
                    }
            })
                    .then(res => res.json())
                    .then(
                        (data) => setColumnasCat(data),
                        (error) => console.log(error)
            )

            })
            .catch(function (error) {
                console.log(error);
                setDatosModal({
                    title: "Conexión no establecida",
                    body: "El tiempo de respuesta se ha agotado, favor de intentar más tarde."
                })
                handleShow();
            })
    }
    
    //NuevoRenglon
    //InsertarDatos    
    const [abreNuevoRenglon, setAbreNuevoRenglon] = useState(false);
            
    const {register: registroNuevoRenglon, handleSubmit: handleNuevoRenglon, errors: errorNuevoRenglon,  setError: setErrorNuevoRenglon} = useForm()
            
    const submitNuevoRenglon = (data) => {     
        
            const res = infoCatalogo.map(x => Object.keys(x));
            console.log(data, 'dataNuevoRenglon');
                
        const foundId = infoCatalogo.find(({ id }) => id == data.id);
        if(foundId != undefined)
            {
            window.alert('Error: id ' + data.id + ' ya esta en uso')
            } else {   
        }
        const urlPreInsert = [];
        for (var i = 0; i < columnasCat.length; i++){
                urlPreInsert.push(columnasCat[i]+"='${data."+columnasCat[i]+"}'");
        }
        const urlInsert = eval('`'+urlPreInsert.join('&')+'`');
        
        var config = {
            method: 'get',
            url: `${process.env.ruta}/wa/prot/insertDatoCatalogo?id_catalogo=${data.idCatPadre}&${urlInsert}`,
            headers: {
                'Authorization': `Bearer ${tokenCookie}`
            },
        };
        axios(config)
            .then(function (response) {
                setDatosModal({
                    title: response.data['message-subject'],
                    body: response.data['message']
                })
                handleShow();

        fetch(`${process.env.ruta}/wa/prot/getOneCatalogo?id_catalogo=${data.idCatPadre}` , {
            headers: {
                    Authorization: `Bearer ${tokenCookie}`
                    }
            })
            .then(res => res.json())
            .then(
                (datos) => {setIdActual(data.idCatPadre)
                    setInfoCatalogo(datos)
                },
                (error) => console.log(error)
            )

                fetch(`${process.env.ruta}/wa/publico/showByEstRol?id_estatus=10`)
                    .then(res => res.json())
                    .then(
                        (data) => setSiUsuarios(data),
                        (error) => console.log(error)
                    )

                fetch(`${process.env.ruta}/wa/publico/showByEstRol?id_estatus=93`)
                    .then(res => res.json())
                    .then(
                        (data) => setNoUsuarios(data),
                        (error) => console.log(error)
                    )
                    
            fetch(`${process.env.ruta}/wa/prot/getColumnasCatalogo?id_catalogo=${data.idCatPadre}` , {
            headers: {
                    Authorization: `Bearer ${tokenCookie}`
                    }
            })
                    .then(res => res.json())
                    .then(
                        (data) => setColumnasCat(data),
                        (error) => console.log(error)
            )       

            })
            .catch(function (error) {
                console.log(error);
                setDatosModal({
                    title: "Conexión no establecida",
                    body: "El tiempo de respuesta se ha agotado, favor de intentar más tarde."
                })
                handleShow();
            })
    }
        
    return (
        <>

                    <ModalFunction
                        show={showFunction}
                        datos={datosModalFunction}
                        onHide={handleCloseFunction}
                        onClick={handleCloseFunction}
                        funcion={updateCatalogo}
                    />



                       <Modal show={abreNuevoRenglon} onHide={() => setAbreNuevoRenglon(!abreNuevoRenglon)} keyboard={false} backdrop="static" >
                        <Modal.Header closeButton>
                            <Modal.Title>
                              Nuevo registro  
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleNuevoRenglon(submitNuevoRenglon)}>
                            
                            {columnasCat.length != 0 && 
                                columnasCat.find(boleano => boleano === "en_uso") 
                                
                                ? 

                                columnasCat.filter(word => word != "en_uso").map((name, index) => (
                                <Form.Group Key={index} controlId={name}>
                                        <Form.Label>{name}</Form.Label>      
                                        <Form.Control name={name} ref = {registroNuevoRenglon} type="text" />
                                </Form.Group> 
                                ))           
                            .concat(
                                <Form.Group controlId="en_uso">
                                    <Form.Label>en_uso</Form.Label>
                                    <Form.Control name="en_uso" ref = {registroNuevoRenglon} as="select" defaultValue="true">
                                    <option>true</option>
                                    <option>false</option>
                                    </Form.Control>
                                </Form.Group>)
                                                          
                                :
                                
                                columnasCat.map((name, index) => (
                                <Form.Group Key={index} controlId={name}>
                                        <Form.Label>{name}</Form.Label>      
                                        <Form.Control name={name} ref = {registroNuevoRenglon} type="text" />
                                    </Form.Group>
                                ))
                            }
                            
                           { idActual != null &&
                           <Form.Group controlId="idCatPadre">
                                <Form.Control name="idCatPadre" ref = {registroNuevoRenglon} value={idActual} type="hidden" />
                            </Form.Group>}
                                
                        <Button variant="outline-danger" type="submit">Registrar</Button>
                            
                            </Form>
                        </Modal.Body>
                    </Modal>

                     
            {
                tokenSesion
                    ?
                    (

                        <div className="container tw-my-6">
                            <div className="row">
                                <div className="col-12 col-tabs-usuarios">

                                    <Tabs defaultActiveKey="actualizar" className="tabs-autorizacion">
                                        <Tab eventKey="actualizar" title="Administración de Catálogos" className="tab-tabla">

                                            <ToolkitProvider keyField="id_concepto" data={catalogos} columns={columnsCatalogos} search={{ searchFormatted: true }}>
                                                {
                                                    props => (
                                                        <>
                                                            <div className="tw-p-3 tw-bg-titulo">
                                                                <SearchBar
                                                                    {...props.searchProps}
                                                                    placeholder="Buscar"
                                                                    tableId="actualizar"
                                                                />
                                                            </div>
                                                            <BootstrapTable
                                                                {...props.baseProps}
                                                                noDataIndication="No hay resultados de la búsqueda"
                                                                pagination={pagination}
                                                                headerClasses="tabla-usuarios-header"
                                                                wrapperClasses="table-responsive"
                                                            />
                                                        </>
                                                    )
                                                }
                                            </ToolkitProvider>
                                        </Tab>
                        
                                    </Tabs>
                


    <div>
      <button variant="outline-secondary" className="btn-analisis" onClick={() => setAbreNuevoRenglon(true)}>
        +Nuevo
      </button>
    </div>

                                    {
                                        infoCatalogo && (
                                            <>
                                              
                                        <Tabs defaultActiveKey="acciones" className="tabs-autorizacion">
                                        <Tab eventKey="acciones" title="Catálogo: " className="tab-tabla">

                                            <ToolkitProvider keyField="id" data={infoCatalogo} insertRow columns={columnsOneCatalogo} search={{ searchFormatted: true }}>
                                                {
                                                    props => (
                                                        <>
                                                            <div className="tw-p-3 tw-bg-titulo">
                                                                <SearchBar
                                                                    {...props.searchProps}
                                                                    placeholder="Buscar"
                                                                    tableId="acciones"
                                                                />
                                                            </div>
                                                            

                                                            <BootstrapTable
                                                                {...props.baseProps}
                                                                noDataIndication="No hay resultados de la búsqueda"
                                                               // pagination={pagination}
                                                                headerClasses="tabla-usuarios-header"
                                                                wrapperClasses="table-responsive"
                                                                cellEdit={ cellEditFactory({
                                                                    mode: 'click',
                                                                    blurToSave: true                                                 
                                                                }) }
                                                            />

                                                        
                                                        
                                                        </>
                                                    )
                                                }
                                            </ToolkitProvider>
                                        </Tab>
                        
                                    </Tabs>
                                                                                    

                                            </>
                                        )
                                    }

                                </div>
                            </div>
                        </div>
                    )
                    :
                    (typeof window !== 'undefined') &&
                    (
                        <Loader />
                    )
            }
        </>
    )
}
