import Link from 'next/link'
import { Navbar, Nav, Container } from 'react-bootstrap'

export default function Menu() {
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
                        <Link href="#">
                            <a className="tw-ml-5 tw-text-white tw-font-semibold hover:tw-text-inst-dorado">PLANEACIÓN MUNICIPAL</a>
                        </Link>
                        <Link href="#">
                            <a className="tw-ml-5 tw-text-white tw-font-semibold hover:tw-text-inst-dorado">ANÁLISIS GEOGRÁFICO</a>
                        </Link>
                        <Link href="#">
                            <a className="tw-ml-5 tw-text-white tw-font-semibold hover:tw-text-inst-dorado">INDICADORES ESTADÍSTICOS</a>
                        </Link>
                        <Link href="#">
                            <a className="tw-ml-5 tw-text-white tw-font-semibold hover:tw-text-inst-dorado">CONSULTA DOCUMENTAL</a>
                        </Link>
                    </Nav>
                    <Nav className="ml-auto">
                        <Link href="/administracion/inicio-sesion">
                            <a className="tw-ml-5 tw-text-white tw-font-semibold hover:tw-text-inst-dorado">INICIAR SESIÓN</a>
                        </Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
