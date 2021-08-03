import {Tabs, Tab, FormGroup } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'

export default function proyeccionCartografica(informacion) {
    //console.log(informacion.infoProyeccion[0])
    // Crónica conforme de Lambert
    var lambertc_stdparll_0 =  informacion.infoProyeccion[0].getElementsByTagName("lambertc_stdparll")[0].innerHTML;
    var lambertc_stdparll_1 = "";
    if(informacion.infoProyeccion[0].getElementsByTagName("lambertc_stdparll").length > 1)
        lambertc_stdparll_1 =  informacion.infoProyeccion[0].getElementsByTagName("lambertc_stdparll")[1].innerHTML;
    var lambertc_longcm =  informacion.infoProyeccion[0].getElementsByTagName("lambertc_longcm")[0].innerHTML;
    var lambertc_latprjo =  informacion.infoProyeccion[0].getElementsByTagName("lambertc_latprjo")[0].innerHTML;
    var lambertc_feast =  informacion.infoProyeccion[0].getElementsByTagName("lambertc_feast")[0].innerHTML;
    var lambertc_fnorth =  informacion.infoProyeccion[0].getElementsByTagName("lambertc_fnorth")[0].innerHTML;
    // Transversa de Mercator
    var mercatort_sfctrmer =  informacion.infoProyeccion[0].getElementsByTagName("mercatort_sfctrmer")[0].innerHTML;
    var mercatort_longcm =  informacion.infoProyeccion[0].getElementsByTagName("mercatort_longcm")[0].innerHTML;
    var mercatort_latprjo =  informacion.infoProyeccion[0].getElementsByTagName("mercatort_latprjo")[0].innerHTML;
    var mercatort_feast =  informacion.infoProyeccion[0].getElementsByTagName("mercatort_feast")[0].innerHTML;
    var mercatort_fnorth =  informacion.infoProyeccion[0].getElementsByTagName("mercatort_fnorth")[0].innerHTML;
    // Mercator
    var mercator_stdparll =  informacion.infoProyeccion[0].getElementsByTagName("mercator_stdparll")[0].innerHTML;
    var mercator_sfec =  informacion.infoProyeccion[0].getElementsByTagName("mercator_sfec")[0].innerHTML;
    var mercator_longcm =  informacion.infoProyeccion[0].getElementsByTagName("mercator_longcm")[0].innerHTML;
    var mercator_feast =  informacion.infoProyeccion[0].getElementsByTagName("mercator_feast")[0].innerHTML;
    var mercator_fnorth =  informacion.infoProyeccion[0].getElementsByTagName("mercator_fnorth")[0].innerHTML;
    // Transversa modificada ejidal
    var tme_sfctrmer =  informacion.infoProyeccion[0].getElementsByTagName("tme_sfctrmer")[0].innerHTML;
    var tme_longcm =  informacion.infoProyeccion[0].getElementsByTagName("tme_longcm")[0].innerHTML;
    var tme_latprjo =  informacion.infoProyeccion[0].getElementsByTagName("tme_latprjo")[0].innerHTML;
    var tme_feast =  informacion.infoProyeccion[0].getElementsByTagName("tme_feast")[0].innerHTML;
    var tme_fnorth =  informacion.infoProyeccion[0].getElementsByTagName("tme_fnorth")[0].innerHTML;

    var anoth_proj_def =  informacion.infoProyeccion[0].getElementsByTagName("anoth_proj_def")[0].innerHTML;
    
    return(
        <Container>
            <Form.Group as={Col} controlId="tab1Form.margenSup"></Form.Group>
            <Tabs defaultActiveKey="cronica" id="coordenadasPlanas" className="tabs-autorizacion">
                <Tab eventKey="cronica" title="5.1.2.1.1 Crónica conforme de Lambert">
                    <Form.Group as={Col} controlId="tabCronicaForm.margenSup"></Form.Group>
                    <Form.Row>
                        <Col xs={3}></Col>
                        <Col xs={6}>
                            <Table striped bordered hover>
                                <thead>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><b>5.1.2.1.1.1 Paralelo estándar</b></td><td>{lambertc_stdparll_0} , {lambertc_stdparll_1}</td>                            
                                    </tr>
                                    <tr>
                                        <td><b>5.1.2.1.1.2 Longitud del meridiano central</b></td><td>{lambertc_longcm}</td>                            
                                    </tr>
                                    <tr>
                                        <td><b>5.1.2.1.1.3 Latitud del origen de proyección</b></td><td>{lambertc_latprjo}</td>                            
                                    </tr>
                                    <tr>
                                        <td><b>5.1.2.1.1.4 Falso este</b></td><td>{lambertc_feast}</td>                            
                                    </tr>
                                    <tr>
                                        <td><b>5.1.2.1.1.5 Falso norte</b></td><td>{lambertc_fnorth}</td>                            
                                    </tr>
                                </tbody>    
                            </Table>
                        </Col>
                        <Col xs={3}></Col>
                    </Form.Row>                    
                </Tab>
                <Tab eventKey="transversa" title="5.1.2.1.2 Transversa de Mercator">
                    <Form.Group as={Col} controlId="tabTransvForm.margenSup"></Form.Group>
                    <Form.Row>
                        <Col xs={3}></Col>
                        <Col xs={6}>
                            <Table striped bordered hover>
                                <thead>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><b>5.1.2.1.2.1 Factor de escala en el meridiano central</b></td>
                                        <td>{mercatort_sfctrmer}</td>                            
                                    </tr>
                                    <tr>
                                        <td><b>5.1.2.1.2.2 Longitud del meridiano central</b></td>
                                        <td>{mercatort_longcm}</td>                            
                                    </tr>
                                    <tr>
                                        <td><b>5.1.2.1.2.3 Latitud del origen de proyección</b></td>
                                        <td>{mercatort_latprjo}</td>                            
                                    </tr>
                                    <tr>
                                        <td><b>5.1.2.1.2.4 Falso este</b></td>
                                        <td>{mercatort_feast}</td>                            
                                    </tr>
                                    <tr>
                                        <td><b>5.1.2.1.2.5 Falso norte</b></td>
                                        <td>{mercatort_fnorth}</td>                            
                                    </tr>
                                </tbody>    
                            </Table>
                        </Col>
                        <Col xs={3}></Col>
                    </Form.Row>                      
                </Tab>
                <Tab eventKey="mercator" title="5.1.2.1.3 Mercator">
                    <Form.Group as={Col} controlId="tabMercForm.margenSup"></Form.Group>
                    <Form.Row>
                        <Col xs={3}></Col>
                        <Col xs={6}>
                            <Table striped bordered hover>
                                <thead>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><b>5.1.2.1.3.1 Paralelo estándar</b></td>
                                        <td>{mercator_stdparll}</td>                            
                                    </tr>
                                    <tr>
                                        <td><b>5.1.2.1.3.2 Factor de escala en el ecuador</b></td>
                                        <td>{mercator_sfec}</td>                            
                                    </tr>
                                    <tr>
                                        <td><b>5.1.2.1.3.3 Longitud del meridiano central</b></td>
                                        <td>{mercator_longcm}</td>                            
                                    </tr>
                                    <tr>
                                        <td><b>5.1.2.1.3.4 Falso este</b></td>
                                        <td>{mercator_feast}</td>                            
                                    </tr>
                                    <tr>
                                        <td><b>5.1.2.1.3.5 Falso norte</b></td>
                                        <td>{mercator_fnorth}</td>                            
                                    </tr>
                                </tbody>    
                            </Table>
                        </Col>
                        <Col xs={3}></Col>
                    </Form.Row>
                </Tab>
                <Tab eventKey="transversaEjidal" title="5.1.2.1.4 Transversa modificada ejidal">
                    <Form.Group as={Col} controlId="tabTransvEjidalForm.margenSup"></Form.Group>               
                    <Form.Row>
                        <Col xs={3}></Col>
                        <Col xs={6}>
                            <Table striped bordered hover>
                                <thead>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><b>5.1.2.1.4.1 Factor de escala en el meridiano central</b></td>
                                        <td>{tme_sfctrmer}</td>                            
                                    </tr>
                                    <tr>
                                        <td><b>5.1.2.1.4.2 Longitud del meridiano central</b></td>
                                        <td>{tme_longcm}</td>                            
                                    </tr>
                                    <tr>
                                        <td><b>5.1.2.1.4.3 Latitud del origen de proyección</b></td>
                                        <td>{tme_latprjo}</td>                            
                                    </tr>
                                    <tr>
                                        <td><b>5.1.2.1.4.4 Falso este</b></td>
                                        <td>{tme_feast}</td>                            
                                    </tr>
                                    <tr>
                                        <td><b>5.1.2.1.4.5 Falso norte</b></td>
                                        <td>{tme_fnorth}</td>                            
                                    </tr>
                                </tbody>    
                            </Table>
                        </Col>
                        <Col xs={3}></Col>
                    </Form.Row>
                </Tab>
                <Tab eventKey="transversaOtraProyeccion" title="5.1.2.1.5 Definición de otra proyección">
                    <Form.Group as={Col} controlId="tabTransvOPForm.margenSup"></Form.Group>
                    <Form.Group>
                        <Form.Control as="textarea" id = "5.1.2.1.5_otraProyeccion" rows={5} defaultValue = {anoth_proj_def}/>
                    </Form.Group>
                </Tab>
            </Tabs>        
        </Container>
    )
}