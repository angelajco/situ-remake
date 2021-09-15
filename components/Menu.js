import { Navbar, Nav, OverlayTrigger, NavDropdown, Tooltip } from 'react-bootstrap'
import { useRouter } from 'next/router'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'

import Link from 'next/link'

import { useAuthState, logout, useAuthDispatch } from '../context';
import publicPages from "../shared/jsons/publicPages.json";

export default function Menu() {

    //Para ver la URL
    const router = useRouter();

    let ruta = router.pathname

    let noActive = 'simi-gob-mx-situ-menu md:tw-mb-3 md:tw-ml-0 tw-ml-5 tw-text-titulo hover:tw-text-inst-verdef hover:tw-no-underline hover:tw-font-bold'
    let active = 'simi-gob-mx-situ-menu md:tw-mb-3 md:tw-ml-0 tw-ml-5 tw-text-titulo tw-font-bold tw-pointer-events-none'  

    const dispatch = useAuthDispatch();

    const userDetails = useAuthState().user;

    const cerrarSesion = async () => {
        await logout(dispatch, userDetails.csrfToken);
    }

    const menuItemWidth = '110px';

    const renderMenu = (menu, tienePadre) => {
        return menu.map((menuItem) => {

            if(!menuItem.titulo) return null;

            if(menuItem.pagina){
                if(tienePadre){
                    return (<NavDropdown.Item key={menuItem.idFuncion} href={menuItem.pagina} className={ruta === menuItem.pagina ?active :noActive}>{menuItem.titulo}</NavDropdown.Item>)
                } else {
                    return (
                        <Link href={menuItem.pagina} key={menuItem.idFuncion} >
                            <a className={ruta === menuItem.pagina ?active :noActive} style={{width: menuItemWidth}}>{menuItem.titulo}</a>
                        </Link>
                        )
                    }
                }
            else {
                if(menuItem.submenu){
                    return (
                        <NavDropdown title={menuItem.titulo} id={menuItem.idFuncion} key={menuItem.idFuncion} className={ruta === menuItem.pagina ?active :noActive} style={{width: menuItemWidth}}>
                            {renderMenu(menuItem.submenu, true)}
                        </NavDropdown>
                        )
                    }
                else {
                        return (null);
                    }
                } 
            } 
        )
    };

    var publicMenuItems = renderMenu(publicPages, false);

    var privateMenuItems = '';

    if(userDetails.menu){
        privateMenuItems = renderMenu(userDetails.menu, false);
    }

    const renderTooltip = (props) => (
        <Tooltip className="tooltip-pass" id="button-tooltip" {...props}>
            <div>
                {userDetails.username ? 'Cerrar sesión' : 'Iniciar sesión'}
            </div>
        </Tooltip>
    );

    return (
        <Navbar expand="lg" className="tw-text-center tw-bg-white justify-content-center custom-mt-situ-menu custom-mt-situ-menu">
            <div className="row custom-max-width">
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="ml-auto custom-toggler" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
                    <Nav className="tw-py-2">
                        {publicMenuItems}
                        {privateMenuItems}
                        {
                            userDetails.username
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
                                    <a className={ruta === "/administracion/inicio-sesion"? active : noActive} >
                                        <OverlayTrigger placement="right" overlay={renderTooltip}>
                                            <FontAwesomeIcon size="3x" icon={faUserCircle} />
                                        </OverlayTrigger>
                                    </a>
                                </Link>
                        }

                        {
                            userDetails.username &&
                            <Navbar.Text className={noActive}>
                                {userDetails.username}
                            </Navbar.Text>
                        }
                        
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>
    )
}