import { useEffect, useState } from "react"
import { Table, Tabs, Tab } from 'react-bootstrap'

import dynamic from 'next/dynamic'
import Router from 'next/router'
import axios from 'axios'
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { selectFilter } from 'react-bootstrap-table2-filter';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

import ModalComponent from '../../components/ModalComponent';

import Cookies from 'universal-cookie'
const cookies = new Cookies()

export default function AutorizacionUsuarios() {

    // Estado para guardar el web token que se pide a la API
    const [tokenSesion, setTokenSesion] = useState(false)
    // Guarda el token que viene en la cookie para verificar que la tenga
    const tokenCookie = cookies.get('SessionToken')

    //Variable para guardar los usuarios
    const [usuarios, setUsuarios] = useState([])
    const [noUsuarios, setNoUsuarios] = useState([])
    //Variable para guardar los datos de un solo usuario
    const [infoUsuario, setInfoUsuario] = useState()

    //Variable para guardar los estados de los usuarios
    const [roles, setRoles] = useState([])

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

    //Importar dinamicamente el loader
    const Loader = dynamic(() => import('../../components/Loader'));

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
                })
                .catch(function (error) {
                    console.log(error)
                    cookies.remove('SessionToken', { path: "/" })
                    Router.push("/administracion/inicio-sesion")
                })

            fetch(`${process.env.ruta}/wa/publico/showByRol?idRol=1,2`)
                .then(res => res.json())
                .then(
                    (data) => setUsuarios(data),
                    (error) => console.log(error)
                )

            fetch(`${process.env.ruta}/wa/publico/catRoles`)
                .then(res => res.json())
                .then(
                    (data) => setRoles(data),
                    (error) => console.log(error)
                )
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

    const autoriza = () => {
        alert("se muestra la informacion del usuario");
    }

    const rechazar = () => {
        alert("se muestra la informacion del usuario");
    }

    const completaNombre = (cell, row) => {
        return (
            <>
                {row.nombre + " " + row.apellidoPaterno + " " + row.apellidoMaterno}
            </>
        )
    }

    const acciones = (cell, row) => {
        return (
            <>
                <FontAwesomeIcon onClick={() => muestraInfo(row.email)} icon={faEye}></FontAwesomeIcon>
                <FontAwesomeIcon className="tw-text-inst-verdec" icon={faCheckCircle}></FontAwesomeIcon>
                <FontAwesomeIcon className="tw-text-inst-rojo" icon={faTimesCircle}></FontAwesomeIcon>
            </>
        )
    }

    const obtenerNivel = (cell) => {
        var rolValor = roles.find(rol => cell === rol.id_rol)
        return rolValor["rol"]
    }

    const opcionesRoles = {
        1: 'Equipo Técnico del Sistema',
        2: 'Funcionario SEDATU'
    };

    const { SearchBar } = Search;

    const columns = [
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
            dataField: 'idRol',
            text: 'Nivel de usuario solicitado',
            formatter: obtenerNivel,
            filter: selectFilter({
                options: opcionesRoles,
                placeholder: 'Nivel de usuario'
            })
        },
        {
            dataField: 'acciones',
            text: 'Acciones',
            formatter: acciones
        }
    ];

    return (
        <>
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
                        <div className="container">
                            <div className="row">
                                <div className="col-12">

                                    <Tabs defaultActiveKey="autorizados">
                                        <Tab eventKey="autorizados" title="Autorizar usuarios">

                                            <ToolkitProvider keyField="id" data={usuarios} columns={columns} search>
                                                {
                                                    props => (
                                                        <>
                                                            <SearchBar {...props.searchProps} />
                                                            <BootstrapTable
                                                                {...props.baseProps}
                                                                filter={filterFactory()}
                                                                noDataIndication="No hay resultados de la búsqueda"
                                                            />
                                                        </>
                                                    )
                                                }
                                            </ToolkitProvider>

                                            {
                                                infoUsuario && (
                                                    <>
                                                        <div className="row">
                                                            <div className="col-6">
                                                                <div>
                                                                    <span>Nombre</span>
                                                                    <input value={infoUsuario.nombre} disabled></input>
                                                                </div>
                                                                <div>
                                                                    <span>Apellido 1</span>
                                                                    <input value={infoUsuario.apellidoPaterno} disabled></input>
                                                                </div>
                                                                <div>
                                                                    <span>Apellido 2</span>
                                                                    <input value={infoUsuario.apellidoMaterno} disabled></input>
                                                                </div>
                                                                <div>
                                                                    <span>Correo</span>
                                                                    <input value={infoUsuario.email} disabled></input>
                                                                </div>
                                                                <div>
                                                                    <span>Número de teléfono</span>
                                                                    <input value={infoUsuario.celular} disabled></input>
                                                                </div>
                                                                <div>
                                                                    <span>Genero con el que te identificas</span>
                                                                    <input value={infoUsuario.idGenero ? infoUsuario.idGenero : ""} disabled></input>
                                                                </div>
                                                            </div>
                                                            <div className="col-6">
                                                                <div>
                                                                    <span>Fecha de nacimiento</span>
                                                                    <input value={infoUsuario.fechaNacimiento ? moment(infoUsuario.fechaNacimiento).format("DD-MM-YYYY") : ""} disabled></input>
                                                                </div>
                                                                <div>
                                                                    <span>Instituto</span>
                                                                    <input value={infoUsuario.instituto} disabled></input>
                                                                </div>
                                                                <div>
                                                                    <span>Entidad</span>
                                                                    <input value={infoUsuario.idEntidad} disabled></input>
                                                                </div>
                                                                <div>
                                                                    <span>Municipio</span>
                                                                    <input value={infoUsuario.idMunicipio} disabled></input>
                                                                </div>
                                                                <div>
                                                                    <span>Nivel de usuario solicitado</span>
                                                                    <input value={infoUsuario.idRol ? obtenerNivel(infoUsuario.idRol) : ""} disabled></input>
                                                                </div>
                                                                <div>
                                                                    <span>Ambito de actuación</span>
                                                                    <input value={infoUsuario.idAmbitoActuacion ? infoUsuario.idAmbitoActuacion : ""} disabled></input>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )
                                            }

                                        </Tab>
                                        <Tab eventKey="no-autorizados" title="Usuarios no autorizados">
                                        </Tab>
                                    </Tabs>

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