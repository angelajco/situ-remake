import { useEffect, useState } from 'react'
import { Navbar, Nav, OverlayTrigger, NavDropdown, Tooltip } from 'react-bootstrap'
import { useRouter } from 'next/router'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'

import Link from 'next/link'

import axios from 'axios'

import Cookies from 'universal-cookie'
const cookies = new Cookies()

export default function Menu() {

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

    const renderTooltip = (props) => (
        <Tooltip className="tooltip-pass" id="button-tooltip" {...props}>
            <div>
                {tokenSesion ? 'Cerrar sesión' : 'Iniciar sesión'}
            </div>
        </Tooltip>
    );

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
    } else if (ruta.includes('/estadisticas-indicadores')) {
        deshabilitarEstadisticas = true
    }else if (ruta.includes('/consulta-documental')) {
        deshabilitarConsulta = true
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
        setTokenSesion(false)
        cookies.remove('SessionToken', { path: "/" })
        cookies.remove('RolUsuario', { path: "/" })
        cookies.remove('EstatusUsuario', { path: "/" })
        cookies.remove('Usuario', { path: "/" })
    }

    return (
        <Navbar expand="lg" className="tw-text-center tw-bg-white justify-content-center custom-mt-situ-menu custom-mt-situ-menu">
            <div className="row custom-max-width">
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="ml-auto custom-toggler" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
                    <Nav className="tw-py-2">
                        <Link href="/">
                            <a className={deshabilitarInicio ? active : noActive}>INICIO</a>
                        </Link>
                        <Link href="/planeacion6">
                            <a className={deshabilitarPlaneacion ? active : noActive} >PLANEACI&Oacute;N<br></br>MUNICIPAL</a>
                        </Link>
                        <Link href="/analisis/analisis-geografico">
                            <a className={deshabilitarAnalisis ? active : noActive}>AN&Aacute;LISIS<br></br>GEOGR&Aacute;FICO</a>
                        </Link>
                        <Link href="/estadisticas-indicadores/estadisticas">
                        {/* <Link href="/construccion"> */}
                            <a className={deshabilitarEstadisticas ? active : noActive}>ESTAD&Iacute;STICAS E<br></br>INDICADORES</a>
                        </Link>
                        <Link href="/consulta-documental">
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
                                <Link href="/administracion/inicio-sesion">
                                    <a className={noActive} onClick={cerrarSesion}>
                                        <OverlayTrigger placement="right" overlay={renderTooltip}>
                                            <FontAwesomeIcon size="3x" icon={faUserCircle} />
                                        </OverlayTrigger>
                                    </a>
                                </Link>
                                :
                                <Link href="/administracion/inicio-sesion">
                                    <a className={deshabilitarSesion ? active : noActive} >
                                        <OverlayTrigger placement="right" overlay={renderTooltip}>
                                            <FontAwesomeIcon size="3x" icon={faUserCircle} />
                                        </OverlayTrigger>
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