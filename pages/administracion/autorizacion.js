import { useEffect, useState, useMemo } from "react"
import { Table, Tabs, Tab } from 'react-bootstrap'

import dynamic from 'next/dynamic'
import Router from 'next/router'
import axios from 'axios'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import { useTable } from 'react-table'

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

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

            fetch(`${process.env.ruta}/wa/publico/showUsers`)
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

    const [infoUsuario, setInfoUsuario] = useState([])
    const muestraInfo = () => {
        alert("se muestra la informacion del usuario");
    }

    const autoriza = () => {
        alert("se muestra la informacion del usuario");
    }

    const rechazar = () => {
        alert("se muestra la informacion del usuario");
    }

    const data = useMemo(
        () => usuarios,
        []
    )

    const columns = useMemo(
        () => [
            {
                Header: 'Nombre',
                accessor: 'nombre',
                Cell: ({ cell }) => {
                    return (
                        cell.row.original.nombre + " " + cell.row.original.apellidoPaterno
                    )
                }
            },
            {
                Header: 'Nombre',
                accessor: 'idRol',
                Cell: ({ value }) => {
                    return (
                        roles.map(valor => {
                            return (
                                value
                            )
                        })
                    )
                }
            }
        ],
        []
    )

    const tableInstance = useTable({
        columns: columns,
        data: usuarios
    })

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance

    return (
        <>

            {
                tokenSesion
                    ?
                    (
                        <div className="container">
                            <div className="row">
                                <div className="col-12">


                                    <table {...getTableProps()}>
                                        <thead>
                                            {headerGroups.map(headerGroup => (
                                                <tr {...headerGroup.getHeaderGroupProps()}>
                                                    {headerGroup.headers.map(column => (
                                                        <th {...column.getHeaderProps()}> {column.render('Header')} </th>
                                                    ))}
                                                </tr>
                                            ))}
                                        </thead>
                                        <tbody {...getTableBodyProps()}>
                                            {rows.map(row => {
                                                prepareRow(row)
                                                return (
                                                    <>
                                                        <tr {...row.getRowProps()}>
                                                            {row.cells.map(cell => {
                                                                return (
                                                                    <>
                                                                        <td {...cell.getCellProps()}>
                                                                            {cell.render('Cell')}
                                                                        </td>
                                                                    </>
                                                                )
                                                            })}
                                                        </tr>
                                                    </>
                                                )
                                            })}
                                            {
                                                usuarios.map(valor => {
                                                    console.log(valor)
                                                    return (
                                                        <tr>{valor.nombre}</tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>


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