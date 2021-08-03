import {Tabs, Tab, FormGroup } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'
import ProyeccionCartografica from '../SistemasDeReferencia/ProyeccionCartografica'

export default function coordenadasPlanas(informacion) {
    
    // proyeccion cartografica
    var proyeccion = informacion.coordenadasPlanas[0].getElementsByTagName("mapprojn");

    // sistema de coordenadas de cuadricula
    var utm_zone =  informacion.coordenadasPlanas[0].getElementsByTagName("utm_zone")[0].innerHTML;
    var utm_sfctrmer =  informacion.coordenadasPlanas[0].getElementsByTagName("utm_sfctrmer")[0].innerHTML;
    var utm_longcm =  informacion.coordenadasPlanas[0].getElementsByTagName("utm_longcm")[0].innerHTML;
    var utm_latprjo =  informacion.coordenadasPlanas[0].getElementsByTagName("utm_latprjo")[0].innerHTML;
    var utm_feast =  informacion.coordenadasPlanas[0].getElementsByTagName("utm_feast")[0].innerHTML;
    var utm_fnorth =  informacion.coordenadasPlanas[0].getElementsByTagName("utm_fnorth")[0].innerHTML;
    
    // plana local
    var local_planar_desc =  informacion.coordenadasPlanas[0].getElementsByTagName("local_planar_desc")[0].innerHTML;
    var local_planar_geo_inf =  informacion.coordenadasPlanas[0].getElementsByTagName("local_planar_geo_inf")[0].innerHTML;
    
    // información de coordenadas planas
    var metodoCodificado =  informacion.coordenadasPlanas[0].getElementsByTagName("plance")[0].innerHTML;
    var resolucionAbscisa =  informacion.coordenadasPlanas[0].getElementsByTagName("absres")[0].innerHTML;
    var resolucionOrdenada =  informacion.coordenadasPlanas[0].getElementsByTagName("ordres")[0].innerHTML;
        // distancia y rumbo
        var distance_res =  informacion.coordenadasPlanas[0].getElementsByTagName("distance_res")[0].innerHTML;
        var bearing_res =  informacion.coordenadasPlanas[0].getElementsByTagName("bearing_res")[0].innerHTML;
        var bearing_uni =  informacion.coordenadasPlanas[0].getElementsByTagName("bearing_uni")[0].innerHTML;
        var ref_bearing_dir =  informacion.coordenadasPlanas[0].getElementsByTagName("ref_bearing_dir")[0].innerHTML;
        var ref_bearing_mer =  informacion.coordenadasPlanas[0].getElementsByTagName("ref_bearing_mer")[0].innerHTML;
    var unidadDistancia =  informacion.coordenadasPlanas[0].getElementsByTagName("plandu")[0].innerHTML;

    return (
        <Container>
            <Form>
                <Form.Group as={Col} controlId="tab1Form.margenSup"></Form.Group>
                <Tabs defaultActiveKey="proyeccion" id="coordenadasPlanas" className="tabs-autorizacion">
                    <Tab eventKey="proyeccion" title="5.1.2.1 Proyección cartográfica">
                        <ProyeccionCartografica infoProyeccion = {proyeccion}/>
                    </Tab>
                    <Tab eventKey="cuadricula" title="5.1.2.2 Sistema de coordenadas de cuadrícula">
                        <Form.Group as={Col} controlId="tab1Cuadricula.margenSup"></Form.Group>
                        <Form.Group>
                            <Form.Row>
                                <Col xs={3}></Col>
                                <Col xs={6}>
                                    <Form.Label><b>5.1.2.2.1 Universal Transversa de Mercator</b></Form.Label>
                                        <Table striped bordered hover>
                                            <thead>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td><b>5.1.2.2.1.1 Número de zona UTM</b></td>
                                                    <td>{utm_zone}</td>                            
                                                </tr>
                                                <tr>
                                                    <td><b>5.1.2.2.1.2 Factor de escala en el meridiano central</b></td>
                                                    <td>{utm_sfctrmer}</td>                            
                                                </tr>
                                                <tr>
                                                    <td><b>5.1.2.2.1.3 Longitud del meridiano central</b></td>
                                                    <td>{utm_longcm}</td>                            
                                                </tr>
                                                <tr>
                                                    <td><b>5.1.2.2.1.4 Longitud del origen de proyección</b></td>
                                                    <td>{utm_latprjo}</td>                            
                                                </tr>
                                                <tr>
                                                    <td><b>5.1.2.2.1.5 Falso este</b></td>
                                                    <td>{utm_feast}</td>                            
                                                </tr>
                                                <tr>
                                                    <td><b>5.1.2.2.1.6 Falso norte</b></td>
                                                    <td>{utm_fnorth}</td>                            
                                                </tr>
                                            </tbody>
                                    </Table>
                                </Col>
                                <Col xs={3}></Col>
                            </Form.Row>
                        </Form.Group>
                    </Tab>
                    <Tab eventKey="planaLocal" title="5.1.2.3 Plana local">
                        <Form>
                            <br></br>
                            <Form.Group as={Col} >
                                <Form.Label> <b>5.1.2.3.1 Descripción de la plana local</b> </Form.Label>
                                <Form.Control id = "5.1.2.3.1_descPlanaLocal" as="textarea" rows={5} defaultValue = {local_planar_desc} readOnly/>
                            </Form.Group>
                            <Form.Group as={Col} >
                                <Form.Label> <b>5.1.2.3.2 Información de georreferencia de la plana local</b> </Form.Label>
                                <Form.Control id = "5.1.2.3.2_infoGeoref" as="textarea" rows={5} defaultValue = {local_planar_geo_inf} readOnly/>
                            </Form.Group>
                        </Form>
                    </Tab>
                    <Tab eventKey="coordenadasPlanas" title="5.1.2.4 Información de coordenadas planas">
                        <Form.Group as={Col} controlId="tab1Cuadricula.margenSup"></Form.Group>                   
                        <Form.Row>
                            <Col xs={3}></Col>
                            <Col xs={6}>
                                <Form.Group>
                                    <Form.Label> <b>5.1.2.4.1 Método codificado de coordenada plana</b> </Form.Label>
                                    <Form.Control id = "5.1.2.4.1_metodoCodificado" type = "text" defaultValue = {metodoCodificado} readOnly/>
                                </Form.Group>
                                <Form.Label> <b>5.1.2.4.2 Representación de coordenadas</b> </Form.Label>
                                <Table striped bordered hover>
                                    <thead>
                                        <th>5.1.2.4.2.1 Resolución de abscisa</th>
                                        <th>5.1.2.4.2.2 Resolución de ordenada</th>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{resolucionAbscisa}</td>
                                            <td>{resolucionOrdenada}</td>                            
                                        </tr>
                                    </tbody>
                                </Table>
                                <Form.Label> <b>5.1.2.4.3 Representación de distancia y rumbo</b> </Form.Label>                               
                                <Table striped bordered hover>
                                    <thead>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><b>5.1.2.4.3.1 Resolución de distancia</b></td>{distance_res}<td></td>                            
                                        </tr>
                                        <tr>
                                            <td><b>5.1.2.4.3.2 Resolución de rumbo</b></td><td>{bearing_res}</td>                            
                                        </tr>
                                        <tr>
                                            <td><b>5.1.2.4.3.3 Unidades de rumbo</b></td><td>{bearing_uni}</td>                            
                                        </tr>
                                        <tr>
                                            <td><b>5.1.2.4.3.4 Dirección del rumbo de referencia</b></td>{ref_bearing_dir}<td></td>                            
                                        </tr>
                                        <tr>
                                            <td><b>5.1.2.4.3.5 Meridiano del rumbo de referecia</b></td><td>{ref_bearing_mer}</td>                            
                                        </tr>
                                    </tbody>
                                </Table>
                                <Form.Group>
                                    <Form.Label> <b>5.1.2.4.4 Unidades de distancia plana</b> </Form.Label>
                                    <Form.Control id = "5.1.2.4.4_unidadDistanci" type = "text" defaultValue = {unidadDistancia} readOnly/>
                                </Form.Group>
                            </Col>
                            <Col xs={3}></Col>
                        </Form.Row>
                    </Tab>
                </Tabs>
            </Form>
        </Container>
    )
}