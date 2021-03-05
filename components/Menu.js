import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Navbar, Nav, Container } from 'react-bootstrap'
import axios from 'axios'
import Cookies from 'universal-cookie'
const cookies = new Cookies()

export default function Menu() {

    // Estado para guardar el token
    const [tokenSesion, setTokenSesion] = useState(false)
    const tokenCookie = cookies.get('SessionToken')

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
    }

    return (
        <Navbar expand="lg" className="tw-text-center tw-bg-menu">
            <Container>
                <div className="tw-flex tw-justify-end tw-w-full">
                    <Navbar.Toggle aria-controls="basic-navbar-nav" className="" />
                </div>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto tw-py-2">
                        <Link href="/">
                            <a className="tw-text-white tw-font-semibold hover:tw-text-inst-dorado hover:tw-no-underline">INICIO</a>
                        </Link>
                        <Link href="/planeacion5">
                            <a className="tw-ml-5 tw-text-white tw-font-semibold hover:tw-text-inst-dorado hover:tw-no-underline">PLANEACIÓN MUNICIPAL</a>
                        </Link>
                        <Link href="/analisis-geografico">
                            <a className="tw-ml-5 tw-text-white tw-font-semibold hover:tw-text-inst-dorado hover:tw-no-underline">ANÁLISIS GEOGRÁFICO</a>
                        </Link>
                        <Link href="/construccion">
                            <a className="tw-ml-5 tw-text-white tw-font-semibold hover:tw-text-inst-dorado hover:tw-no-underline">INDICADORES ESTADÍSTICOS</a>
                        </Link>
                        <Link href="/construccion">
                            <a className="tw-ml-5 tw-text-white tw-font-semibold hover:tw-text-inst-dorado hover:tw-no-underline">CONSULTA DOCUMENTAL</a>
                        </Link>
                        {
                            tokenSesion
                                ?
                                <a className="tw-ml-5 tw-text-white tw-font-semibold hover:tw-text-inst-dorado hover:tw-no-underline" href="/administracion/inicio-sesion" onClick={cerrarSesion}>CERRAR SESIÓN</a>
                                :
                                <Link href="/administracion/inicio-sesion">
                                    <a className="tw-ml-5 tw-text-white tw-font-semibold hover:tw-text-inst-dorado hover:tw-no-underline">INICIAR SESIÓN</a>
                                </Link>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}