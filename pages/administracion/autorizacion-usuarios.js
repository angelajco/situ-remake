import { useEffect, useState } from "react"
import { Tabs, Tab, Modal, Button } from 'react-bootstrap'

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

import ModalComponent from '../../components/ModalComponent';
import ModalFunction from '../../components/ModalFunction';

import Cookies from 'universal-cookie'
const cookies = new Cookies()

export default function AutorizacionUsuarios() {

    // Estado para guardar el web token que se pide a la API
    const [tokenSesion, setTokenSesion] = useState(false)
    // Guarda el token que viene en la cookie para verificar que la tenga
    const tokenCookie = cookies.get('SessionToken')
    const nivelRolCookie = cookies.get('RolUsuario')

    //Variable para guardar los usuarios
    const [usuarios, setUsuarios] = useState([])
    const [noUsuarios, setNoUsuarios] = useState([])
    //Variable para guardar los datos de un solo usuario
    const [infoUsuario, setInfoUsuario] = useState()

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
        if (nivelRolCookie != undefined) {
            if (nivelRolCookie != '1' && nivelRolCookie != '2') {
                Router.push('/');
            }
        }
    }, [nivelRolCookie])

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

                    fetch(`${process.env.ruta}/wa/publico/showByEstRol?id_estatus=93`)
                        .then(res => res.json())
                        .then(
                            (data) => setNoUsuarios(data),
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

    const muestraInfo = (email) => {
        fetch(`${process.env.ruta}/wa/publico/showByEmail?email=${email}`)
            .then(res => res.json())
            .then(
                (data) => setInfoUsuario(data),
                (error) => console.log(error)
            )
    }

    const limpiaInfo = () => {
        setInfoUsuario();
    }

    const abrirModal = (usuario, valor) => {
        handleShowFunction();
        if (valor) {
            setDatosModalFunction({
                title: 'Autorización de usuario',
                body: '¿Desea autorizar al usuario ' + usuario.nombre + "?",
                id: usuario.id_usuario
            });
            setNombreFuncion(true)
        }
        else {
            setDatosModalFunction({
                title: 'Rechazo de usuario',
                body: '¿Desea rechazar al usuario ' + usuario.nombre + "?",
                id: usuario.id_usuario
            });
            setNombreFuncion(false)
        }
    }

    const autoriza = (id) => {
        handleCloseFunction();
        var config = {
            method: 'get',
            url: `${process.env.ruta}/wa/prot/authorizationUser?id=${id}`,
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

                fetch(`${process.env.ruta}/wa/publico/showByEstRol?id_estatus=93`)
                    .then(res => res.json())
                    .then(
                        (data) => setNoUsuarios(data),
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

    const rechaza = (id) => {
        handleCloseFunction();
        var config = {
            method: 'get',
            url: `${process.env.ruta}/wa/prot/noAuthorizationUser?id=${id}`,
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

                fetch(`${process.env.ruta}/wa/publico/showByEstRol?id_estatus=93`)
                    .then(res => res.json())
                    .then(
                        (data) => setNoUsuarios(data),
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

    const completaNombre = (cell, row) => {
        return row.nombre + " " + row.apellido_paterno + " " + row.apellido_materno
    }

    const accionesAutorizados = (cell, row) => {
        return (
            <>
                <FontAwesomeIcon className="tw-mr-3 tw-cursor-pointer" onClick={() => muestraInfo(row.email)} icon={faEye}></FontAwesomeIcon>
                <FontAwesomeIcon className="tw-mr-3 tw-cursor-pointer tw-text-inst-verdec" onClick={() => abrirModal(row, true)} icon={faCheckCircle}></FontAwesomeIcon>
                <FontAwesomeIcon className="tw-cursor-pointer tw-text-inst-rojo" onClick={() => abrirModal(row, false)} icon={faTimesCircle}></FontAwesomeIcon>
            </>
        )
    }

    const accionesNoAutorizados = (cell, row) => {
        return (
            <>
                <FontAwesomeIcon className="tw-mr-3 tw-cursor-pointer" onClick={() => muestraInfo(row.email)} icon={faEye}></FontAwesomeIcon>
                <FontAwesomeIcon className="tw-mr-3 tw-cursor-pointer tw-text-inst-verdec" onClick={() => abrirModal(row, true)} icon={faCheckCircle}></FontAwesomeIcon>
            </>
        )
    }

    const { SearchBar } = Search;

    const columnsAutorizados = [
        {
            dataField: 'nombre',
            text: 'Nombre',
            formatter: completaNombre
        },
        {
            dataField: 'email',
            text: 'Correo electrónico'
        },
        {
            dataField: 'fecha_creacion',
            text: 'Fecha de solicitud',
            formatter: cell => moment(cell).format('DD-MM-YYYY')
        },
        {
            dataField: 'rol',
            text: 'Nivel de usuario solicitado',
        },
        {
            dataField: 'acciones',
            text: 'Acciones',
            formatter: accionesAutorizados
        }
    ];

    const columnsNoAutorizados = [
        {
            dataField: 'nombre',
            text: 'Nombre',
            formatter: completaNombre
        },
        {
            dataField: 'email',
            text: 'Correo electrónico'
        },
        {
            dataField: 'fecha_creacion',
            text: 'Fecha de solicitud',
            formatter: cell => moment(cell).format('DD-MM-YYYY')
        },
        {
            dataField: 'rol',
            text: 'Nivel de usuario solicitado',
        },
        {
            dataField: 'acciones',
            text: 'Acciones',
            formatter: accionesNoAutorizados
        }
    ];

    const pagination = paginationFactory({
        sizePerPage: 5,
        alwaysShowAllBtns: true,
        sizePerPageList: []
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
                        funcion={rechaza}
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

                                    <Tabs defaultActiveKey="autorizados" className="tabs-autorizacion">
                                        <Tab eventKey="autorizados" title="Autorizar Usuarios" className="tab-tabla">

                                            <ToolkitProvider keyField="id_usuario" data={usuarios} columns={columnsAutorizados} search>
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
                                                            />
                                                        </>
                                                    )
                                                }
                                            </ToolkitProvider>

                                        </Tab>

                                        <Tab eventKey="no-autorizados" title="Usuarios No Autorizados" className="tab-tabla">

                                            <ToolkitProvider keyField="id_usuario" data={noUsuarios} columns={columnsNoAutorizados} search>
                                                {
                                                    props => (
                                                        <>
                                                            <div className="tw-p-3 tw-bg-titulo">
                                                                <SearchBar
                                                                    {...props.searchProps}
                                                                    placeholder="Buscar"
                                                                    tableId="no-autorizados"
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

                                    {
                                        infoUsuario && (
                                            <>
                                                <div className="row">
                                                    <div className="col-12 tw-bg-menu tw-text-white tw-py-2">
                                                        <FontAwesomeIcon className="tw-text-inst-verdef" icon={faUser}></FontAwesomeIcon><b>&nbsp;INFORMACIÓN</b> DEL USUARIO
                                                            </div>
                                                    <div className="col-12 tw-border-solid tw-border tw-border-black tw-py-4 tw-px-8">
                                                        <div className="row tw-border-solid tw-border tw-border-black tw-p-6 tw-bg-guia-grisf6">
                                                            <div className="col-12 col-md-6">
                                                                <div className="row tw-mb-4">
                                                                    <span className="col-6 tw-text-right">Nombre</span>
                                                                    <input className="col-6 tw-bg-white" value={infoUsuario.nombre} disabled></input>
                                                                </div>
                                                                <div className="row tw-mb-4">
                                                                    <span className="col-6 tw-text-right">Apellido 1</span>
                                                                    <input className="col-6 tw-bg-white" value={infoUsuario.apellidoPaterno} disabled></input>
                                                                </div>
                                                                <div className="row tw-mb-4">
                                                                    <span className="col-6 tw-text-right">Apellido 2</span>
                                                                    <input className="col-6 tw-bg-white" value={infoUsuario.apellidoMaterno} disabled></input>
                                                                </div>
                                                                <div className="row tw-mb-4">
                                                                    <span className="col-6 tw-text-right">Correo</span>
                                                                    <input className="col-6 tw-bg-white" value={infoUsuario.email} disabled></input>
                                                                </div>
                                                                <div className="row tw-mb-4">
                                                                    <span className="col-6 tw-text-right">Número de teléfono</span>
                                                                    <input className="col-6 tw-bg-white" value={infoUsuario.celular} disabled></input>
                                                                </div>
                                                                <div className="row tw-mb-4">
                                                                    <span className="col-6 tw-text-right">Genero con el que te identificas</span>
                                                                    <input className="col-6 tw-bg-white" value={infoUsuario.genero} disabled></input>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-6">
                                                                <div className="row tw-mb-4">
                                                                    <span className="col-6 tw-text-right">Fecha de nacimiento</span>
                                                                    <input className="col-6 tw-bg-white" value={infoUsuario.fechaNacimiento ? moment(infoUsuario.fechaNacimiento).format("DD-MM-YYYY") : ""} disabled></input>
                                                                </div>
                                                                <div className="row tw-mb-4">
                                                                    <span className="col-6 tw-text-right">Instituto</span>
                                                                    <input className="col-6 tw-bg-white" value={infoUsuario.instituto} disabled></input>
                                                                </div>
                                                                <div className="row tw-mb-4">
                                                                    <span className="col-6 tw-text-right">Entidad</span>
                                                                    <input className="col-6 tw-bg-white" value={infoUsuario.nombre_entidad} disabled></input>
                                                                </div>
                                                                <div className="row tw-mb-4">
                                                                    <span className="col-6 tw-text-right">Municipio</span>
                                                                    <input className="col-6 tw-bg-white" value={infoUsuario.nombre_municipio} disabled></input>
                                                                </div>
                                                                <div className="row tw-mb-4">
                                                                    <span className="col-6 tw-text-right">Nivel de usuario solicitado</span>
                                                                    <input className="col-6 tw-bg-white" value={infoUsuario.rol} disabled></input>
                                                                </div>
                                                                <div className="row tw-mb-4">
                                                                    <span className="col-6 tw-text-right">Ambito de actuación</span>
                                                                    <input className="col-6 tw-bg-white" value={infoUsuario.ambito_actuacion} disabled></input>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 tw-text-center tw-mt-6">
                                                                <Button variant="outline-secondary" className="btn-admin" onClick={limpiaInfo}>ACEPTAR</Button>
                                                            </div>
                                                        </div>
                                                    </div>
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