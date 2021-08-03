import {Tabs, Tab } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'

export default function tabReporte(informacion) {

    //console.log(informacion.infoReporte[0])
    // completitud
    var DQ_Completeness_nameOfMeasure = informacion.infoReporte[0].getElementsByTagName("DQ_Completeness_nameOfMeasure")[0].innerHTML;
    var DQ_Completeness_measureDescription = informacion.infoReporte[0].getElementsByTagName("DQ_Completeness_measureDescription")[0].innerHTML;
    var DQ_Completeness_valueUnit = informacion.infoReporte[0].getElementsByTagName("DQ_Completeness_valueUnit")[0].innerHTML;
    var DQ_Completeness_value = informacion.infoReporte[0].getElementsByTagName("DQ_Completeness_value")[0].innerHTML;
    // consistencia lógica
    var DQ_LogicConsistency_nameOfMeasure = informacion.infoReporte[0].getElementsByTagName("DQ_LogicConsistency_nameOfMeasure")[0].innerHTML;
    var DQ_LogicConsistency_measureDescription = informacion.infoReporte[0].getElementsByTagName("DQ_LogicConsistency_measureDescription")[0].innerHTML;
    var DQ_LogicConsistency_valueUnit = informacion.infoReporte[0].getElementsByTagName("DQ_LogicConsistency_valueUnit")[0].innerHTML;
    var DQ_LogicConsistency_value = informacion.infoReporte[0].getElementsByTagName("DQ_LogicConsistency_value")[0].innerHTML;
    // exactitud posicional
    var PositionalAccuracy_nameOfMeasure = informacion.infoReporte[0].getElementsByTagName("PositionalAccuracy_nameOfMeasure")[0].innerHTML;
    var PositionalAccuracy_measureDescription = informacion.infoReporte[0].getElementsByTagName("PositionalAccuracy_measureDescription")[0].innerHTML;
    var PositionalAccuracy_valueUnit = informacion.infoReporte[0].getElementsByTagName("PositionalAccuracy_valueUnit")[0].innerHTML;
    var PositionalAccuracy_value = informacion.infoReporte[0].getElementsByTagName("PositionalAccuracy_value")[0].innerHTML;
    // exactitud temporal
    var TemporalAccuracy_nameOfMeasure = informacion.infoReporte[0].getElementsByTagName("TemporalAccuracy_nameOfMeasure")[0].innerHTML;
    var TemporalAccuracy_measureDescription = informacion.infoReporte[0].getElementsByTagName("TemporalAccuracy_measureDescription")[0].innerHTML;
    var TemporalAccuracy_valueUnit = informacion.infoReporte[0].getElementsByTagName("TemporalAccuracy_valueUnit")[0].innerHTML;
    var TemporalAccuracy_value = informacion.infoReporte[0].getElementsByTagName("TemporalAccuracy_value")[0].innerHTML;
    // exactitud temática
    var ThematicAccuracy_nameOfMeasure = informacion.infoReporte[0].getElementsByTagName("ThematicAccuracy_nameOfMeasure")[0].innerHTML;
    var ThematicAccuracy_measureDescription = informacion.infoReporte[0].getElementsByTagName("ThematicAccuracy_measureDescription")[0].innerHTML;
    var ThematicAccuracy_valueUnit = informacion.infoReporte[0].getElementsByTagName("ThematicAccuracy_valueUnit")[0].innerHTML;
    var ThematicAccuracy_value = informacion.infoReporte[0].getElementsByTagName("ThematicAccuracy_value")[0].innerHTML;
    

    
    return (
        <Container>
            <br></br>
            <Tabs defaultActiveKey="tab1" id="mainTabReporte" className="tabs-autorizacion">
                <Tab eventKey="tab1" title="6.2.1 Completitud">
                    <br></br>
                    <Form>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={5}>
                                <b>6.2.1.1 Nombre del subcriterio de calidad evaluado</b>
                            </Form.Label>
                            <Col sm={4}>
                                <Form.Control readOnly/>
                            </Col>
                        </Form.Group>
                        <Form.Row>
                            <Col xs={1}></Col>
                            <Col >
                                <Form.Group>
                                    <Form.Label><b>6.2.1.1.1 Nombre de la prueba</b></Form.Label>
                                    <Form.Control id = "6.2.1.1.1_nombrePrueba" as="textarea" 
                                                rows={3} defaultValue = {DQ_Completeness_nameOfMeasure} readOnly/>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={1}></Col>
                            <Col >
                                <Form.Group>
                                    <Form.Label><b>6.2.1.1.2 Descripción de la prueba</b></Form.Label>
                                    <Form.Control id = "6.2.1.1.2_descPrueba" as="textarea" 
                                                    rows={3} defaultValue = {DQ_Completeness_measureDescription} readOnly/>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={1}></Col>
                            <Col >
                                <Form.Group>
                                    <Form.Label><b>6.2.1.1.3 Resultado</b></Form.Label>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={2}></Col>
                            <Col >
                                <Form.Group>
                                    <Form.Label><b>6.2.1.1.3.1 Resultado cuantitativo</b></Form.Label>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Row>
                            <Col xs={3}></Col>
                                <Form.Label><b>6.2.1.1.3.1.1 Unidad de valor</b></Form.Label>
                            <Col>
                                <Form.Control type = "text" id = "6.2.1.1.3.1.1_unidadValor" 
                                                defaultValue = {DQ_Completeness_valueUnit} readOnly/>
                            </Col>
                            <Col xs={3}></Col>
                        </Row>
                        <br />
                        <Row>
                            <Col xs={3}></Col>
                                <Form.Label><b>6.2.1.1.3.1.2 Valor</b></Form.Label>
                            <Col>
                                <Form.Control type = "text" id = "6.2.1.1.3.1.2_valor" 
                                            defaultValue = {DQ_Completeness_value} readOnly/>
                            </Col>
                            <Col xs={3}></Col>
                        </Row>
                    </Form>
                    <br></br>
                </Tab>
                <Tab eventKey="tab2" title="6.2.2 Consistencia Lógica">
                    <br></br>
                    <Form>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={5}>
                                <b>6.2.2.1 Nombre del subcriterio de calidad evaluado</b>
                            </Form.Label>
                            <Col sm={4}>
                                <Form.Control readOnly/>
                            </Col>
                        </Form.Group>
                        <Form.Row>
                            <Col xs={1}></Col>
                            <Col >
                                <Form.Group>
                                    <Form.Label><b>6.2.2.1.1 Nombre de la prueba</b></Form.Label>
                                    <Form.Control id = "6.2.2.1.1_nombrePrueba" defaultValue = {DQ_LogicConsistency_nameOfMeasure}
                                                 as="textarea" rows={3} readOnly/>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={1}></Col>
                            <Col >
                                <Form.Group>
                                    <Form.Label><b>6.2.2.1.2 Descripción de la prueba</b></Form.Label>
                                    <Form.Control id = "6.2.2.1.2_descPrueba" as="textarea" rows={3}
                                                    defaultValue = {DQ_LogicConsistency_measureDescription} readOnly/>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={1}></Col>
                            <Col >
                                <Form.Group>
                                    <Form.Label><b>6.2.2.1.3 Resultado</b></Form.Label>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={2}></Col>
                            <Col >
                                <Form.Group>
                                    <Form.Label><b>6.2.2.1.3.1 Resultado cuantitativo</b></Form.Label>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Row>
                            <Col xs={3}></Col>
                                <Form.Label><b>6.2.2.1.3.1.1 Unidad de valor</b></Form.Label>
                            <Col>
                                <Form.Control type = "text" id = "6.2.2.1.3.1.1_unidadValor" 
                                            defaultValue = {DQ_LogicConsistency_valueUnit} readOnly/>
                            </Col>
                            <Col xs={3}></Col>
                        </Row>
                        <br />
                        <Row>
                            <Col xs={3}></Col>
                                <Form.Label><b>6.2.2.1.3.1.2 Valor</b></Form.Label>
                            <Col>
                                <Form.Control type = "text" id = "6.2.2.1.3.1.2_valor"
                                            defaultValue = {DQ_LogicConsistency_value} readOnly/>
                            </Col>
                            <Col xs={3}></Col>
                        </Row>
                        <br></br>
                    </Form>                    
                </Tab>
                <Tab eventKey="tab3" title="6.2.3 Exactitud posicional">
                    <br></br>
                    <Form>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={5}>
                                <b>6.2.3.1 Nombre del subcriterio de calidad evaluado</b>
                            </Form.Label>
                            <Col sm={4}>
                                <Form.Control readOnly/>
                            </Col>
                        </Form.Group>
                        <Form.Row>
                            <Col xs={1}></Col>
                            <Col >
                                <Form.Group>
                                    <Form.Label><b>6.2.3.1.1 Nombre de la prueba</b></Form.Label>
                                    <Form.Control id = "6.2.3.1.1_nombrePrueba" as="textarea" rows={3}
                                        defaultValue ={PositionalAccuracy_nameOfMeasure} readOnly/>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={1}></Col>
                            <Col >
                                <Form.Group>
                                    <Form.Label><b>6.2.3.1.2 Descripción de la prueba</b></Form.Label>
                                    <Form.Control id = "6.2.3.1.2_descPrueba" as="textarea" rows={3}
                                        defaultValue = {PositionalAccuracy_measureDescription} readOnly/>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={1}></Col>
                            <Col >
                                <Form.Group>
                                    <Form.Label><b>6.2.3.1.3 Resultado</b></Form.Label>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={2}></Col>
                            <Col >
                                <Form.Group>
                                    <Form.Label><b>6.2.3.1.3.1 Resultado cuantitativo</b></Form.Label>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Row>
                            <Col xs={3}></Col>
                                <Form.Label><b>6.2.3.1.3.1.1 Unidad de valor</b></Form.Label>
                            <Col>
                                <Form.Control type = "text" id = "6.2.3.1.3.1.1_unidadValor"
                                            defaultValue = {PositionalAccuracy_valueUnit} readOnly/>
                            </Col>
                            <Col xs={3}></Col>
                        </Row>
                        <br />
                        <Row>
                            <Col xs={3}></Col>
                                <Form.Label><b>6.2.3.1.3.1.2 Valor</b></Form.Label>
                            <Col>
                                <Form.Control type = "text" id = "6.2.3.1.3.1.2_valor"
                                            defaultValue = {PositionalAccuracy_value} readOnly/>
                            </Col>
                            <Col xs={3}></Col>
                        </Row>
                        <br></br>
                    </Form> 
                </Tab>
                <Tab eventKey="tab4" title="6.2.4 Exactitud temporal">
                    <br></br>
                    <Form>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={6}>
                                <b>6.2.4.1 Nombre del subcriterio de calidad evaluado</b>
                            </Form.Label>
                            <Col sm={4}>
                                <Form.Control readOnly/>
                            </Col>
                        </Form.Group>
                        <Form.Row>
                            <Col xs={1}></Col>
                            <Col >
                                <Form.Group>
                                    <Form.Label><b>6.2.4.1.1 Nombre de la prueba</b></Form.Label>
                                    <Form.Control id = "6.2.4.1.1_nombrePrueba" as="textarea" rows={3}
                                                defaultValue = {TemporalAccuracy_nameOfMeasure} readOnly/>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={1}></Col>
                            <Col >
                                <Form.Group>
                                    <Form.Label><b>6.2.4.1.2 Descripción de la prueba</b></Form.Label>
                                    <Form.Control id = "6.2.4.1.2_descPrueba" as="textarea" rows={3}
                                            defaultValue = {TemporalAccuracy_measureDescription} readOnly/>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={1}></Col>
                            <Col >
                                <Form.Group>
                                    <Form.Label><b>6.2.4.1.3 Resultado</b></Form.Label>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={2}></Col>
                            <Col >
                                <Form.Group>
                                    <Form.Label><b>6.2.4.1.3.1 Resultado cuantitativo</b></Form.Label>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Row>
                            <Col xs={3}></Col>
                                <Form.Label><b>6.2.4.1.3.1.1 Unidad de valor</b></Form.Label>
                            <Col>
                                <Form.Control type = "text" id = "6.2.4.1.3.1.1_unidadValor" 
                                            defaultValue = {TemporalAccuracy_valueUnit} readOnly/>
                            </Col>
                            <Col xs={3}></Col>
                        </Row>
                        <br />
                        <Row>
                            <Col xs={3}></Col>
                                <Form.Label><b>6.2.4.1.3.1.2 Valor</b></Form.Label>
                            <Col>
                                <Form.Control type = "text" id = "6.2.4.1.3.1.2_valor"
                                    defaultValue = {TemporalAccuracy_value} readOnly/>
                            </Col>
                            <Col xs={3}></Col>
                        </Row>
                        <br></br>
                    </Form> 
                </Tab>
                <Tab eventKey="tab5" title="6.2.5 Exactitud temática">
                    <br></br>
                    <Form>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={5}>
                                <b>6.2.5.1 Nombre del subcriterio de calidad evaluado</b>
                            </Form.Label>
                            <Col sm={4}>
                                <Form.Control readOnly/>
                            </Col>
                        </Form.Group>
                        <Form.Row>
                            <Col xs={1}></Col>
                            <Col >
                                <Form.Group>
                                    <Form.Label><b>6.2.5.1.1 Nombre de la prueba</b></Form.Label>
                                    <Form.Control id = "6.2.5.1.1_nombrePrueba" as="textarea" rows={3}
                                        defaultValue = {ThematicAccuracy_nameOfMeasure} readOnly/>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={1}></Col>
                            <Col >
                                <Form.Group>
                                    <Form.Label><b>6.2.5.1.2 Descripción de la prueba</b></Form.Label>
                                    <Form.Control id = "6.2.5.1.2_descPrueba" as="textarea" rows={3}
                                        defaultValue = {ThematicAccuracy_measureDescription} readOnly/>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={1}></Col>
                            <Col >
                                <Form.Group>
                                    <Form.Label><b>6.2.5.1.3 Resultado</b></Form.Label>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={2}></Col>
                            <Col >
                                <Form.Group>
                                    <Form.Label><b>6.2.5.1.3.1 Resultado cuantitativo</b></Form.Label>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Row>
                            <Col xs={3}></Col>
                                <Form.Label><b>6.2.5.1.3.1.1 Unidad de valor</b></Form.Label>
                            <Col>
                                <Form.Control type = "text" id = "6.2.5.1.3.1.1_unidadValor"
                                        defaultValue = {ThematicAccuracy_valueUnit} readOnly/>
                            </Col>
                            <Col xs={3}></Col>
                        </Row>
                        <br />
                        <Row>
                            <Col xs={3}></Col>
                                <Form.Label><b>6.2.5.1.3.1.2 Valor</b></Form.Label>
                            <Col>
                                <Form.Control type = "text" id = "6.2.5.1.3.1.2_valor" 
                                    defaultValue = {ThematicAccuracy_value} readOnly/>
                            </Col>
                            <Col xs={3}></Col>
                        </Row>
                    </Form> 
                    <br></br>
                </Tab>
            </Tabs>
        </Container>
    )
}