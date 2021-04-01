import { useEffect, useState } from 'react'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { useRouter } from 'next/router'

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

    const [nivel, setNivel] = useState(false)
    const nivelRolCookie = cookies.get('RolUsuario')

    //Para ver la URL
    const router = useRouter();

    // console.log(router.pathname);
    let ruta = router.pathname

    let noActive = 'md:tw-mb-3 md:tw-ml-0 tw-ml-5 tw-text-white tw-font-semibold hover:tw-text-inst-verdef hover:tw-no-underline'
    let active = 'md:tw-mb-3 md:tw-ml-0 tw-ml-5 tw-text-titulo tw-font-semibold tw-pointer-events-none'

    // Deshabilitar el boton del menu donde se encuentra el usuario
    let deshabilitarInicio = false
    let deshabilitarPlaneacion = false
    let deshabilitarAnalisis = false
    let deshabilitarEstadisticas = false
    let deshabilitarConsulta = false
    let deshabilitarAdministracion = false
    let deshabilitarSesion = false

    if (ruta === '/') {
        deshabilitarInicio = true
    } else if (ruta === '/planeacion6') {
        deshabilitarPlaneacion = true
    } else if (ruta === '/analisis/analisis-geografico') {
        deshabilitarAnalisis = true
    } else if (ruta === '/administracion/administracion-sistema') {
        deshabilitarAdministracion = true
    } else if (ruta === '/administracion/inicio-sesion') {
        deshabilitarSesion = true
    }


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

    useEffect(() => {
        if(nivelRolCookie == 1 || nivelRolCookie == 2){
            setNivel(true)
        }
    }, [nivelRolCookie])

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
                            <a className={deshabilitarInicio ? active : noActive}>INICIO</a>
                        </Link>
                        <Link href="/planeacion6">
                            <a className={deshabilitarPlaneacion ? active : noActive} >PLANEACIÓN<br></br>MUNICIPAL</a>
                        </Link>
                        <Link href="/analisis/analisis-geografico">
                            <a className={deshabilitarAnalisis ? active : noActive}>ANÁLISIS<br></br>GEOGRÁFICO</a>
                        </Link>
                        <Link href="/construccion">
                            <a className={noActive}>ESTADÍSTICAS E<br></br>INDICADORES</a>
                        </Link>
                        <Link href="/construccion">
                            <a className={noActive}>CONSULTA<br></br>DOCUMENTAL</a>
                        </Link>
                        {
                            nivel &&
                                <Link href="/administracion/administracion-sistema">
                                    <a className={deshabilitarAdministracion ? active : noActive}>ADMINISTRACIÓN DE<br></br>SISTEMA</a>
                                </Link>
                        }
                        {
                            tokenSesion
                                ?
                                <a className={noActive} href="/administracion/inicio-sesion" onClick={cerrarSesion}>CERRAR<br></br>SESIÓN</a>
                                :
                                <Link href="/administracion/inicio-sesion">
                                    <a className={deshabilitarSesion ? active : noActive} >INICIO DE<br></br>SESIÓN</a>
                                </Link>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}