import { useEffect, useState } from "react"
import { Tabs, Tab, Button, OverlayTrigger, Tooltip } from 'react-bootstrap'

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
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory from 'react-bootstrap-table2-editor';

import ModalComponent from '../../components/ModalComponent';
import ModalFunction from '../../components/ModalFunction';

import Cookies from 'universal-cookie'
const cookies = new Cookies()

export default function AdministracionCatalogos() {

    // Estado para guardar el web token que se pide a la API
    const [tokenSesion, setTokenSesion] = useState(false)
    // Guarda el token que viene en la cookie para verificar que la tenga
    const tokenCookie = cookies.get('SessionToken')
    const rolCookie = cookies.get('RolUsuario')
    const estatusCookie = cookies.get('EstatusUsuario')

    //Variable para guardar los usuarios
    const [catalogos, setCatalogos] = useState([])
    const [usuarios, setUsuarios] = useState([])
    const [noUsuarios, setNoUsuarios] = useState([])
    const [siUsuarios, setSiUsuarios] = useState([])
    //Variable para guardar los datos de un solo usuario
    const [infoCatalogo, setInfoCatalogo] = useState()

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
    const handleShowFunction = () => setShowFunction(true);

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

    const muestraInfo = (id_catalogos) => {
        fetch(`${process.env.ruta}/wa/prot/getOneCatalogo?id_catalogo=${id_catalogos}` , {
            headers: {
                    Authorization: `Bearer ${tokenCookie}`
                    }
            })
            .then(res => res.json())
            .then(
                (data) => setInfoCatalogo(data),
                (error) => console.log(error)
            )
    }

    const limpiaInfo = () => {
        setInfoCatalogo();
    }

    const abrirModal = (usuario, valor) => {
        handleShowFunction();
        if (valor) {
            setDatosModalFunction({
                title: 'Autorización de usuario',
                body: '¿Desea autorizar al usuario ' + usuario.email + "?",
                id: usuario.id_usuario
            });
            setNombreFuncion(true)
        }
        else {
            setDatosModalFunction({
                title: 'Rechazo de usuario',
                body: '¿Desea rechazar al usuario ' + usuario.email + "?",
                id: usuario.id_usuario
            });
            setNombreFuncion(false)
        }
    }


    
    const completaNombre = (cell, row) => {
        return row.catalogo
    }
            
    const accionesAutorizados = (cell, row) => {
        return (
            <div className="tw-text-center">
                <OverlayTrigger placement="bottom" overlay={<Tooltip>Ver información</Tooltip>}>
                    <FontAwesomeIcon className="tw-mr-3 tw-cursor-pointer" onClick={() => muestraInfo(row.id_catalogos)} icon={faEye}></FontAwesomeIcon>
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
                <OverlayTrigger placement="bottom" overlay={<Tooltip>Ver información</Tooltip>}>
                    <FontAwesomeIcon className="tw-mr-3 tw-cursor-pointer" onClick={() => muestraInfo(row.id_ambito_actuacion)} icon={faEye}></FontAwesomeIcon>
                </OverlayTrigger>
            </div>
        )
    }
    
        
        
    const conceptoColumna = (cell, row) => {
        return catalogos[0]['llave']
    }
    
    const idCatalogo = (cell, row) => {
        return row.id_catalogos
    }
    
         console.log('idCatalogo: ');
    console.log(idCatalogo);
    
    //console.log(catalogos[0]['llave']);
    
    const columnsOneCatalogo = [
        {
            dataField: "'"+conceptoColumna+"'",
            text: "'"+conceptoColumna+"'"
           // formatter: conceptoColumna
        },
        {
            dataField: 'descripcion',
            text: 'Descripcion'
        },
        {
            dataField: 'en_uso',
            text: 'En uso',
        },
        {
            dataField: 'acciones',
            text: 'Acciones',
            formatter: accionesOneCatalogo
        }
    ];
    
    const pagination = paginationFactory({
        sizePerPage: 10,
        alwaysShowAllBtns: true,
        sizePerPageList: [10, 25, 50, 100],
        withFirstAndLast: false,
        prePageTitle: [],
        nextPageTitle: []
    });

    return (
        <>
            {
                nombreFuncion == true ?
                    <ModalFunction
                        show={showFunction}
                        datos={datosModalFunction}
                        onHide={handleCloseFunction}
                        onClick={handleCloseFunction}
                        funcion={autoriza}
                    />
                    :
                    <ModalFunction
                        show={showFunction}
                        datos={datosModalFunction}
                        onHide={handleCloseFunction}
                        onClick={handleCloseFunction}
                       // funcion={rechaza}
                    />
            }

            <ModalComponent
                show={show}
                datos={datosModal}
                onHide={handleClose}
                onClick={handleClose}
            />

            {
                tokenSesion
                    ?
                    (

                        <div className="container tw-my-6">
                            <div className="row">
                                <div className="col-12 col-tabs-usuarios">

                                    <Tabs defaultActiveKey="autorizar" className="tabs-autorizacion">
                                        <Tab eventKey="autorizar" title="Administración de Catálogos" className="tab-tabla">

                                            <ToolkitProvider keyField="id_catalogos" data={catalogos} columns={columnsCatalogos} search={{ searchFormatted: true }}>
                                                {
                                                    props => (
                                                        <>
                                                            <div className="tw-p-3 tw-bg-titulo">
                                                                <SearchBar
                                                                    {...props.searchProps}
                                                                    placeholder="Buscar"
                                                                    tableId="autorizar"
                                                                />
                                                            </div>
                                                            <BootstrapTable
                                                                {...props.baseProps}
                                                                noDataIndication="No hay resultados de la búsqueda"
                                                                pagination={pagination}
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

                                    {
                                        infoCatalogo && (
                                            <>
                                              
                                              <Tabs defaultActiveKey="acciones" className="tabs-autorizacion">
                                        <Tab eventKey="acciones" title="Catálogo: " className="tab-tabla">

                                            <ToolkitProvider keyField="id_catalogos" data={infoCatalogo} columns={columnsOneCatalogo} search={{ searchFormatted: true }}>
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
                                    <div className="col-12 tw-text-center tw-mt-6">
                                        <Button variant="outline-secondary" className="btn-admin" onClick={limpiaInfo}>CERRAR</Button>
                                     </div>
                                               
                                               

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
