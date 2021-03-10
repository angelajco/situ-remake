import { useEffect, useState } from 'react'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'

import Link from 'next/link'

import axios from 'axios'

import Cookies from 'universal-cookie'
const cookies = new Cookies()

import { useTranslation } from "react-i18next"

export default function Menu() {

    const { i18n } = useTranslation();

    // Estado para guardar el token
    const [tokenSesion, setTokenSesion] = useState(false)
    const tokenCookie = cookies.get('SessionToken')
    const nivelRolCookie = cookies.get('RolUsuario')

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
    }, [tokenCookie])

    const cerrarSesion = () => {
        cookies.remove('SessionToken', { path: "/" })
        cookies.remove('RolUsuario', { path: "/" })
    }

    const changeLanguage = lng => {
        localStorage.setItem("idioma", lng);
        i18n.changeLanguage(lng);
    };

    return (
        <Navbar expand="lg" className="tw-text-center tw-bg-menu">
            <Container>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
                    <Nav className="tw-py-2">
                        <NavDropdown title="CAMBIO DE IDIOMA" id="basic-nav-dropdown" className="idioma-menu tw-font-semibold">
                            <NavDropdown.Item onClick={() => changeLanguage('es')}>Español</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => changeLanguage('en')}>Inglés</NavDropdown.Item>
                        </NavDropdown>
                        <Link href="/">
                            <a className="tw-ml-5 tw-text-white tw-font-semibold hover:tw-text-inst-dorado hover:tw-no-underline">INICIO</a>
                        </Link>
                        <Link href="/planeacion5">
                            <a className="tw-ml-5 tw-text-white tw-font-semibold hover:tw-text-inst-dorado hover:tw-no-underline">PLANEACIÓN<br></br>MUNICIPAL</a>
                        </Link>
                        <Link href="/analisis/analisis-geografico">
                            <a className="tw-ml-5 tw-text-white tw-font-semibold hover:tw-text-inst-dorado hover:tw-no-underline">ANÁLISIS<br></br>GEOGRÁFICO</a>
                        </Link>
                        <Link href="/construccion">
                            <a className="tw-ml-5 tw-text-white tw-font-semibold hover:tw-text-inst-dorado hover:tw-no-underline">ESTADÍSTICAS E<br></br>INDICADORES</a>
                        </Link>
                        <Link href="/construccion">
                            <a className="tw-ml-5 tw-text-white tw-font-semibold hover:tw-text-inst-dorado hover:tw-no-underline">CONSULTA<br></br>DOCUMENTAL</a>
                        </Link>
                        {
                            (nivelRolCookie == '1' || nivelRolCookie == '2') ?
                                <Link href="/administracion/autorizacion-usuarios">
                                    <a className="tw-ml-5 tw-text-white tw-font-semibold hover:tw-text-inst-dorado hover:tw-no-underline">AUTORIZACION DE<br></br>USUARIOS</a>
                                </Link>
                                : ""
                        }
                        {
                            tokenSesion
                                ?
                                <a className="tw-ml-5 tw-text-white tw-font-semibold hover:tw-text-inst-dorado hover:tw-no-underline" href="/administracion/inicio-sesion" onClick={cerrarSesion}>CERRAR<br></br>SESIÓN</a>
                                :
                                <Link href="/administracion/inicio-sesion">
                                    <a className="tw-ml-5 tw-text-white tw-font-semibold hover:tw-text-inst-dorado hover:tw-no-underline">INICIO DE<br></br>SESIÓN</a>
                                </Link>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}