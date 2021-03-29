import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'

import Link from 'next/link'

export default function Header() {

    let noActive = 'tw-text-white tw-text-sm hover:tw-text-inst-dorado hover:tw-no-underline tw-px-2 simi-gob-mx'
    return (
        <>
            <Navbar expand="md" fixed="top" className="tw-text-end navbar-dark tw-bg-inst-verdef tw-px-8">
                <Navbar.Brand href="https://www.gob.mx" target="_blank">
                    <img
                        src="/images/escudo_1.png"
                        className="d-inline-block align-top"
                        alt="Gobierno de M&eacute;exico"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav>
                        <a href="https://www.gob.mx/tramites" target="_blank" className={noActive}>Trámites</a>
                        <a href="https://www.gob.mx/gobierno" target="_blank" className={noActive} >Gobierno</a>
                        <a href="https://www.gob.mx/busqueda?utf8=%E2%9C%93" target="_blank" className={noActive}>
                            <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                        </a>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    )
}