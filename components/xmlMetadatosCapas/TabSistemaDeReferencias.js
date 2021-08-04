import {Tabs, Tab } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'

import ReferenciasVerticales from '../xmlMetadatosCapas/SistemasDeReferencia/ReferenciasVerticales'
import CoordenadasPlanas from '../xmlMetadatosCapas/SistemasDeReferencia/CoordenadasPlanas'

export default function tabSistemaDeReferencia(informacion) {
    // coordenadas geográficas
    var resolucionLatitud =  informacion.infoFormTab5[0].getElementsByTagName("latres")[0].innerHTML;
    var resolucionLongitud =  informacion.infoFormTab5[0].getElementsByTagName("longres")[0].innerHTML;
    var undCoordenadasGeoGraficas =  informacion.infoFormTab5[0].getElementsByTagName("geogunit")[0].innerHTML;
    
    // coordenadas planas
    var coordenadasPlanas =  informacion.infoFormTab5[0].getElementsByTagName("planar");
    
    // coordenadas locales
    var clDescLocal = informacion.infoFormTab5[0].getElementsByTagName("local_desc")[0].innerHTML;
    var clInfGeorefLocal = informacion.infoFormTab5[0].getElementsByTagName("local_geo_inf")[0].innerHTML;

    // modelo geodésico
    var mgNombreDatumHorizontal = informacion.infoFormTab5[0].getElementsByTagName("horizdn")[0].innerHTML;
    var mgNombreElipsoide = informacion.infoFormTab5[0].getElementsByTagName("ellips")[0].innerHTML;
    var mgSemiejeMayor = informacion.infoFormTab5[0].getElementsByTagName("semiaxis")[0].innerHTML;
    var mgFactorAchatamiento = informacion.infoFormTab5[0].getElementsByTagName("denflat")[0].innerHTML;
    
    var sistemaReferenciaVertical = informacion.infoFormTab5[0].getElementsByTagName("ReferenceVerticalSystem");
    
    return(
        <Container>
            <Form>
                <br></br>
                <Tabs defaultActiveKey="tabRefHorizontal" id="tabSistemaReferencias" className="tabs-autorizacion">
                    <Tab eventKey="tabRefHorizontal" title="5.1 Horizontal">
                        <Form.Group as={Col}>
                            <Tabs defaultActiveKey="tabGeografica" id="tabSistemaRefHorizontal" className="tabs-autorizacion">
                                <Tab eventKey="tabGeografica" title="5.1.1 Coordenadas geográficas">
                                    <Form>
                                        <br></br>
                                        <Form.Group as={Col} >
                                            <Table striped bordered hover>
                                                <thead>
                                                    <tr>
                                                        <th>5.1.1.1 Resolución de latitud</th>
                                                        <th>5.1.1.2 Resolución de longitud</th>
                                                        <th>5.1.1.3 Unidades de coordenadas geográficas</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>{resolucionLatitud}</td>
                                                        <td>{resolucionLongitud}</td>
                                                        <td>{undCoordenadasGeoGraficas}</td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </Form.Group>
                                    </Form>
                                </Tab>
                                <Tab eventKey="tabPlanar" title="5.1.2 Coordenadas planas">
                                    <CoordenadasPlanas coordenadasPlanas = {coordenadasPlanas}/>
                                </Tab>
                                <Tab eventKey="tabCoordenadasLoc" title="5.1.3 Coordenadas locales">
                                    <Form>
                                        <Form.Group as={Col} controlId="tab1Form.margenSup"></Form.Group>
                                        <Form.Group as={Col} >
                                            <Form.Label> <b>5.1.3.1 Descripción local</b> </Form.Label>
                                            <Form.Control as="textarea" id = "5.1.3.1_descLocal" rows={3} defaultValue = {clDescLocal} readOnly/>
                                        </Form.Group>
                                        <Form.Group as={Col} >
                                            <Form.Label> <b>5.1.3.2 Información de georreferenciación local</b> </Form.Label>
                                            <Form.Control as="textarea" id = "5.1.3.2_infGeorefLocal" rows={3} defaultValue = {clInfGeorefLocal} readOnly/>
                                        </Form.Group>
                                    </Form>
                                </Tab>
                                <Tab eventKey="tabGeodetic" title="5.1.4 Modelo geodésico">
                                    <Form>
                                        <br></br>
                                        <Form.Group as={Col} >
                                            <Form.Label><b>5.1.4.1 Nombre del datum horizontal</b> </Form.Label>
                                            <Form.Control type = "text" id = "5.1.4.1_nmrDatumHrzt" defaultValue = {mgNombreDatumHorizontal} readOnly/>
                                        </Form.Group>
                                        <Form.Group as={Col}>
                                            <Form.Label><b>5.1.4.2 Nombre del elipsoide</b> </Form.Label>
                                            <Form.Control type = "text" id = "5.1.4.2_elipsoide" defaultValue = {mgNombreElipsoide} readOnly/>
                                        </Form.Group>
                                        <Form.Row>
                                            <Col xs={5}>   
                                                <Form.Group as={Col}>
                                                    <Form.Label><b>5.1.4.3 Semieje mayor</b> </Form.Label>
                                                    <Form.Control type = "text" id = "5.1.4.3_semiejeMayor" defaultValue = {mgSemiejeMayor} readOnly/>
                                                </Form.Group>
                                            </Col>
                                            <Col xs={7}>
                                                <Form.Group as={Col}>
                                                    <Form.Label><b>5.1.4.4 Factor denominador de achatamiento</b> </Form.Label>
                                                    <Form.Control type = "text" id = "5.1.4.4_factorAchat" defaultValue = {mgFactorAchatamiento} readOnly/>
                                                </Form.Group>
                                            </Col>
                                        </Form.Row>
                                    </Form>
                                </Tab>
                            </Tabs>
                        </Form.Group>
                    </Tab>
                    
                    <Tab eventKey="tabRefVertical" title="5.2 Vertical">
                        <ReferenciasVerticales refVerticales = {sistemaReferenciaVertical}/>
                    </Tab>

                </Tabs>
            </Form>
        </Container>
    )
}