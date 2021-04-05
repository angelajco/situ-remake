import { useEffect, useState } from 'react'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { useRouter } from 'next/router'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'

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

    const [rolEstatus, setRolEstatus] = useState(false)
    const [nombreUsuario, setNombreUsuario] = useState(false)
    const rolCookie = cookies.get('RolUsuario')
    const estatusCookie = cookies.get('EstatusUsuario')
    const usuarioCookie = cookies.get('Usuario')

    //Para ver la URL
    const router = useRouter();

    // console.log(router.pathname);
    let ruta = router.pathname

    let noActive = 'simi-gob-mx-situ-menu md:tw-mb-3 md:tw-ml-0 tw-ml-5 tw-text-titulo hover:tw-text-inst-verdef hover:tw-no-underline hover:tw-font-bold'
    let active = 'simi-gob-mx-situ-menu md:tw-mb-3 md:tw-ml-0 tw-ml-5 tw-text-titulo tw-font-bold tw-pointer-events-none'

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
        if ((rolCookie == 1 || rolCookie == 2) && estatusCookie == 10) {
            setRolEstatus(true)
        }
        if (usuarioCookie != undefined) {
            setNombreUsuario(true);
        }
    }, [rolCookie, estatusCookie, usuarioCookie])

    const cerrarSesion = () => {
        cookies.remove('SessionToken', { path: "/" })
        cookies.remove('RolUsuario', { path: "/" })
        cookies.remove('EstatusUsuario', { path: "/" })
        cookies.remove('Usuario', { path: "/" })
    }

    console.log(usuarioCookie);

    const changeLanguage = lng => {
        localStorage.setItem("idioma", lng);
        i18n.changeLanguage(lng);
    };

    return (
        <Navbar expand="lg" className="tw-text-center tw-bg-white justify-content-center">
            <div className="row custom-max-width">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
                    <Nav className="tw-py-2">
                        <NavDropdown title="CAMBIO DE IDIOMA" id="basic-nav-dropdown" className="md:tw-mb-3 tw-font-semibold md:tw-ml-0 tw-ml-5 tw-text-titulo hover:tw-text-inst-verdef hover:tw-no-underline hover:tw-font-bold">
                            <NavDropdown.Item onClick={() => changeLanguage('es')}>Español</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => changeLanguage('en')}>Inglés</NavDropdown.Item>
                        </NavDropdown>
                        <Link href="/">
                            <a className={deshabilitarInicio ? active : noActive}>INICIO</a>
                        </Link>
                        <Link href="/planeacion6">
                            <a className={deshabilitarPlaneacion ? active : noActive} >PLANEACI&Oacute;N<br></br>MUNICIPAL</a>
                        </Link>
                        <Link href="/analisis/analisis-geografico">
                            <a className={deshabilitarAnalisis ? active : noActive}>AN&Aacute;LISIS<br></br>GEOGR&Aacute;FICO</a>
                        </Link>
                        <Link href="/construccion">
                            <a className={noActive}>ESTAD&Iacute;STICAS E<br></br>INDICADORES</a>
                        </Link>
                        <Link href="/construccion">
                            <a className={noActive}>CONSULTA<br></br>DOCUMENTAL</a>
                        </Link>
                        {
                            rolEstatus &&
                            <Link href="/administracion/administracion-sistema">
                                <a className={deshabilitarAdministracion ? active : noActive}>ADMINISTRACI&Oacute;N DE<br></br>SISTEMA</a>
                            </Link>
                        }
                        {
                            tokenSesion
                                ?
                                <a className={noActive} href="/administracion/inicio-sesion" onClick={cerrarSesion}>CERRAR<br></br>SESI&Oacute;N</a>
                                :
                                <Link href="/administracion/inicio-sesion">
                                    <a className={deshabilitarSesion ? active : noActive} >
                                        INICIO DE<br/>SESI&Oacute;N
                                    </a>
                                </Link>
                        }
                        {
                            tokenSesion
                                ?
                                <a className={noActive} href="/administracion/inicio-sesion" onClick={cerrarSesion}>
                                    <FontAwesomeIcon size="3x" icon={faUserCircle}/>
                                </a>
                                :
                                <Link href="/administracion/inicio-sesion">
                                    <a className={deshabilitarSesion ? active : noActive} >
                                        <FontAwesomeIcon size="3x" icon={faUserCircle}/>
                                    </a>
                                </Link>
                        }
                        {
                            nombreUsuario &&
                            <Navbar.Text className={noActive}>
                                {usuarioCookie}
                            </Navbar.Text>
                        }
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>
    )
}