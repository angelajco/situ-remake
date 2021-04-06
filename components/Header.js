import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'

import Link from 'next/link'

export default function Header() {

    let noActive = 'tw-text-white tw-text-sm hover:tw-text-inst-dorado hover:tw-no-underline tw-px-3 simi-gob-mx'
    return (
        <>
            <Navbar expand="lg" fixed="top" className="container-fluid tw-text-end navbar-dark tw-bg-inst-verdef justify-content-center flexbox">
                <div className="row custom-max-width">
                    <Navbar.Brand href="https://www.gob.mx" target="_blank">
                        <img
                            src="/images/escudo_1.png"
                            className="d-inline-block align-top"
                            alt="Gobierno de M&eacute;exico"
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" className="ml-auto tw-text-titulo"/>
                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                        <Nav>
                            <a href="https://mivacuna.salud.gob.mx" target="_blank" className={noActive}>Registro para vacunaci&oacute;n</a>
                            <a href="https://coronavirus.gob.mx" target="_blank" className={noActive} >Informaci&oacute;n sobre COVID-19</a>
                            <a href="https://www.gob.mx/tramites" target="_blank" className={noActive}>Tr&aacute;mites</a>
                            <a href="https://www.gob.mx/gobierno" target="_blank" className={noActive} >Gobierno</a>
                            <a href="https://www.gob.mx/busqueda?utf8=%E2%9C%93" target="_blank" className={noActive}>
                                <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                            </a>
                        </Nav>
                    </Navbar.Collapse>
                </div>
            </Navbar>
        </>
    )
}