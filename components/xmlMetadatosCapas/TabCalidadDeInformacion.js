import {Tabs, Tab } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'

import AlcanceOAmbito from '../xmlMetadatosCapas/CalidadInformacion/AlcanceOAmbito'
import Reporte from '../xmlMetadatosCapas/CalidadInformacion/Reporte'


export default function tabCalidadDeInformacion(informacion) {

    //console.log(informacion.infoFormTab6[0]);
    var nivel =  informacion.infoFormTab6[0].getElementsByTagName("level")[0].innerHTML;
    var reporte = informacion.infoFormTab6[0].getElementsByTagName("report");

    // linaje
    var enunciado = informacion.infoFormTab6[0].getElementsByTagName("statement")[0].innerHTML;
    var descripcionPasos = informacion.infoFormTab6[0].getElementsByTagName("LI_ProcessStep_description")[0].innerHTML;
    var fuente = informacion.infoFormTab6[0].getElementsByTagName("LI_Source_description")[0].innerHTML;
    
    
    return (
        <Container>
            <Form.Group as={Col} controlId="tab2FormMarginSup"></Form.Group>
            <Tabs defaultActiveKey="tab1" id="mainCalidadInformacion" className="tabs-autorizacion">
                <Tab eventKey="tab1" title="6.1 Alcance o ámbito">
                    <AlcanceOAmbito infoNivel ={nivel}/>
                </Tab>
                <Tab eventKey="tab2" title="6.2 Reporte">
                    <Reporte infoReporte = {reporte}/>
                </Tab>
                <Tab eventKey="tab3" title="6.3 Linaje">
                    <br></br>
                    <Form>
                        <Form.Group>
                            <Form.Label><b>6.3.1 Enunciado</b></Form.Label>
                            <Form.Control id = "6.3.1_enunciado" as="textarea" rows={4} 
                                defaultValue = {enunciado} readOnly/>
                        </Form.Group>
                        <Form.Label><b>6.3.2 Pasos del proceso</b></Form.Label>
                        <Form.Row>
                            <Col xs={1}></Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label><b>6.3.2.1 Descripcion</b></Form.Label>
                                    <Form.Control id = "6.3.2.1_descPasos" as="textarea" rows={4}
                                        defaultValue = {descripcionPasos} readOnly/>
                                    </Form.Group>
                                </Col>
                            </Form.Row>
                        <Form.Label><b>6.3.3 Fuente</b></Form.Label>
                        <Form.Row>
                            <Col xs={1}></Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label><b>6.3.3.1 Descripcion</b></Form.Label>
                                    <Form.Control id = "6.3.3.1_fuente" as="textarea" rows={4}
                                                defaultValue = {fuente} readOnly/>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                    </Form>
                    <br></br>
                </Tab>
            </Tabs>
        </Container>
    )
}