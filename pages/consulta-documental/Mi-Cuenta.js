import React, { useState, useEffect } from 'react'
import { Navbar, Nav, OverlayTrigger, NavDropdown, Tooltip, Tabs, Tab, Row, Col, Container } from 'react-bootstrap'
import MiCuentaComponent from '../../components/MiCuentaComponent'
import TablerosComponent from './tableros-indicadores/index'
import {getByFilterTableros} from './../../components/Catalogos'
import Form from 'react-bootstrap/Form'
import { useAuthState } from '../../context/context';

export default function miCuenta() {
    const [tabs, setTabs] = useState([]);
    //Datos Usuario
    const userDetails = useAuthState().user;
    let csrfToken = userDetails.csrfToken;
    async function handleSelect (key) { 
        if (key === "tableros"){
            let filter = {idUsuario:userDetails.id}
            setTabs(await getByFilterTableros(csrfToken,filter));
        }else if (key === "descargas"){
            
        }
    }

    return( 
            <Container>
                <Tab.Container id="left-tabs-example" 
                    defaultActiveKey="descargas"  onSelect={handleSelect}>
                    <Row>
                        <Col sm={5}>
                            <Nav variant="nav nav-vertical-tab" className="flex-column">
                                <Nav.Link eventKey="descargas">Descarga de información</Nav.Link>
                                <Nav.Link eventKey="tableros">Tableros de indicadores</Nav.Link>
                            </Nav>
                        </Col>
                        <Col sm={7}>
                            <Tab.Content >
                                <Tab.Pane eventKey="descargas">
                                    <MiCuentaComponent />
                                </Tab.Pane>
                                <Tab.Pane eventKey="tableros">
                                    <TablerosComponent tableros={tabs} />
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </Container>
    )
}