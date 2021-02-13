import { useState} from 'react'
import Link from 'next/link'
import { Navbar, Nav, Container } from 'react-bootstrap'
import axios from 'axios'
import Cookies from 'universal-cookie'
const cookies = new Cookies()

export default function Menu() {

    // Estado para guardar el token
    const [tokenSesion, setTokenSesion] = useState(false)
    const token = cookies.get('SessionToken')
    if (token != undefined) {
        // Configuracion para verificar el token
        var config = {
            method: 'get',
            url: 'http://172.16.117.11:8080/SITU-API-1.0/acceso',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        };
        axios(config)
            .then(response => response.data)
            .then(
                (datosSesion) => {
                    setTokenSesion(datosSesion['success-boolean'])
                },
                (error) => {
                    console.log(error)
                }
            )
    }

    const cerrarSesion = () => {
        cookies.remove('SessionToken', { path: "/" })
        window.location.href = "/administracion/inicio-sesion"
    }

    return (
            <Navbar expand="lg" className="tw-text-center tw-bg-inst-verde-claro">
                <Container>
                    <div className="tw-flex tw-justify-end tw-w-full">
                        <Navbar.Toggle aria-controls="basic-navbar-nav" className="" />
                    </div>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto tw-py-2">
                            <Link href="/">
                                <a className="tw-text-white tw-font-semibold hover:tw-text-inst-dorado">INICIO</a>
                            </Link>
                            <Link href="/construccion">
                                <a className="tw-ml-5 tw-text-white tw-font-semibold hover:tw-text-inst-dorado">PLANEACIÓN MUNICIPAL</a>
                            </Link>
                            <Link href="/analisis-geografico/">
                                <a className="tw-ml-5 tw-text-white tw-font-semibold hover:tw-text-inst-dorado">ANÁLISIS GEOGRÁFICO</a>
                            </Link>
                            <Link href="/construccion">
                                <a className="tw-ml-5 tw-text-white tw-font-semibold hover:tw-text-inst-dorado">INDICADORES ESTADÍSTICOS</a>
                            </Link>
                            <Link href="/construccion">
                                <a className="tw-ml-5 tw-text-white tw-font-semibold hover:tw-text-inst-dorado">CONSULTA DOCUMENTAL</a>
                            </Link>
                        </Nav>
                        {
                            tokenSesion
                                ?
                                <Nav className="ml-auto">
                                    <a className="tw-ml-5 tw-text-white tw-font-semibold hover:tw-text-inst-dorado" onClick={cerrarSesion}>CERRAR SESIÓN</a>
                                </Nav>
                                :
                                <Nav className="ml-auto">
                                    <Link href="/administracion/inicio-sesion">
                                        <a className="tw-ml-5 tw-text-white tw-font-semibold hover:tw-text-inst-dorado">INICIAR SESIÓN</a>
                                    </Link>
                                </Nav>
                        }
                    </Navbar.Collapse>
                </Container>
            </Navbar>
    )
}