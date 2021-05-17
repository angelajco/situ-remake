import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faGlobeAmericas } from '@fortawesome/free-solid-svg-icons'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { useTranslation } from "react-i18next"


export default function Header() {
    const { i18n } = useTranslation();

    let noActive = 'tw-text-white tw-text-sm hover:tw-text-inst-dorado hover:tw-no-underline tw-px-3'

    const changeLanguage = lng => {
        localStorage.setItem("idioma", lng);
        i18n.changeLanguage(lng);
    };

    var hola = (<FontAwesomeIcon icon={faGlobeAmericas} />);

    return (
        <>
            <div className="fixed-top header-principal">
                <Navbar expand="lg" className="container-fluid tw-text-end navbar-dark tw-bg-inst-verdef justify-content-center flexbox">
                    <div className="row custom-max-width">
                        <Navbar.Brand href="https://www.gob.mx" target="_blank">
                            <img
                                src="/images/escudo_1.png"
                                className="d-inline-block align-top"
                                alt="Gobierno de M&eacute;exico"
                            />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" className="ml-auto tw-text-titulo" />
                        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                            <Nav>
                                <a href="https://mivacuna.salud.gob.mx" target="_blank" className={noActive}>Registro para vacunaci&oacute;n</a>
                                <a href="https://coronavirus.gob.mx" target="_blank" className={noActive} >Informaci&oacute;n sobre COVID-19</a>
                                <a href="https://www.gob.mx/tramites" target="_blank" className={noActive}>Tr&aacute;mites</a>
                                <a href="https://www.gob.mx/gobierno" target="_blank" className={noActive} >Gobierno</a>
                                <a href="https://www.gob.mx/busqueda?utf8=%E2%9C%93" target="_blank" className={noActive}>
                                    <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                                </a>
                                <NavDropdown title={<span>Idioma&nbsp;<FontAwesomeIcon icon={faGlobeAmericas} /></span>} id="basic-nav-dropdown" className="tw-text-sm tw-px-3 boton-idioma" >
                                    <NavDropdown.Item onClick={() => changeLanguage('es')}>Español</NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => changeLanguage('en')}>Inglés</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </div>
                </Navbar>
                <div className="container-fluid tw-bg-titulo">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 tw-text-center tw-py-2">
                                <div className="titulo-situ tw-my-4 tw-text-white">
                                    <b>Sistema de Información Territorial y Urbana</b>
                                    <span>&nbsp;SITU</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}