import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'

export default function tabLocalizacionGeografica(informacion) {
    var limiteOeste = informacion.infoFormTab4[0].getElementsByTagName("westBoundLongitude")[0].innerHTML;
    var limiteEste = informacion.infoFormTab4[0].getElementsByTagName("eastBoundLongitude")[0].innerHTML;
    var limiteSur = informacion.infoFormTab4[0].getElementsByTagName("southBoundLatitude")[0].innerHTML;
    var limiteNorte = informacion.infoFormTab4[0].getElementsByTagName("northBoundLatitude")[0].innerHTML;
    var repEspacial = informacion.infoFormTab4[0].getElementsByTagName("spatialRepresentationType")[0].innerHTML;
    
    return(
        <Container>
            <Form>
                <br></br>
                <Form.Group as={Col}>
                    <Form.Label><b>4.1 Localización geográfica del conjunto de datos espaciales o producto</b></Form.Label>
                    <Form.Row>
                        <Col xs={3}></Col>
                        <Col xs={6}>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><b>4.1.1 Coordenada límite al oeste</b></td>
                                        <td>{limiteOeste}</td>                            
                                    </tr>
                                    <tr>
                                        <td><b>4.1.2 Coordenada límite al este</b></td>
                                        <td>{limiteEste}</td>                            
                                    </tr>
                                    <tr>
                                        <td><b>4.1.3 Coordenada límite al sur</b></td>
                                        <td>{limiteSur}</td>                            
                                    </tr>
                                    <tr>
                                        <td><b>4.1.1 Coordenada límite al norte</b></td>
                                        <td>{limiteNorte}</td>                            
                                    </tr>
                                </tbody>    
                            </Table>
                        </Col>
                        <Col xs={3}></Col>
                    </Form.Row>
                </Form.Group>
                <Form.Row>
                    <Col >
                        <Form.Group>
                            <Form.Label><b>4.2 Tipo de representación espacial:</b></Form.Label>
                            <Form.Control type = "text" id = "4.2_repEspacial" defaultValue = {repEspacial} readOnly/>
                        </Form.Group>
                    </Col>
                </Form.Row>
            </Form>
        </Container>
    )
}