import {Tabs, Tab } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'

export default function referenciasVerticales(informacion) {
    var nombreDatumAlt = informacion.refVerticales[0].getElementsByTagName("altdatum")[0].innerHTML;
    var resolucionAlt = informacion.refVerticales[0].getElementsByTagName("altres")[0].innerHTML;
    var undDistanciaAlt = informacion.refVerticales[0].getElementsByTagName("altunits")[0].innerHTML;
    var metodoCodAlt = informacion.refVerticales[0].getElementsByTagName("altenc")[0].innerHTML;

    var nombreDatumProf = informacion.refVerticales[0].getElementsByTagName("depthdn")[0].innerHTML;
    var resolucionProf = informacion.refVerticales[0].getElementsByTagName("depthres")[0].innerHTML;
    var undDistanciaProf = informacion.refVerticales[0].getElementsByTagName("depthdu")[0].innerHTML;
    var metodoCodProf = informacion.refVerticales[0].getElementsByTagName("depthem")[0].innerHTML;
    return(
        <Container>
            <Form.Group as={Col} controlId="tab1Form.margenSup"></Form.Group>
            <Form.Row>
                <Col xs={4}></Col>
                <Col > <Form.Label><b>5.2.1 Definición del sistema de altitud</b></Form.Label> </Col>
                <Col xs={4}></Col>
            </Form.Row>
            <Form.Group as={Col} >
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>5.2.1.1 Nombre del datum</th>
                            <th>5.2.1.2 Resolución</th>
                            <th>5.2.1.3 Unidades de distancia</th>
                            <th>5.2.1.4 Método codificado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{nombreDatumAlt}</td>
                            <td>{resolucionAlt}</td>
                            <td>{undDistanciaAlt}</td>
                            <td>{metodoCodAlt}</td>
                        </tr>
                    </tbody>
                </Table>
            </Form.Group>
            <Form.Row>
                <Col xs={4}></Col>
                <Col > <Form.Label><b>5.2.2 Definición del sistema de profundidad</b></Form.Label> </Col>
                <Col xs={2}></Col>
            </Form.Row>
            <Form.Group as={Col} >
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>5.2.2.1 Nombre del datum</th>
                            <th>5.2.2.2 Resolución</th>
                            <th>5.2.2.3 Unidades de distancia</th>
                            <th>5.2.2.4 Método codificado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{nombreDatumProf}</td>
                            <td>{resolucionProf}</td>
                            <td>{undDistanciaProf}</td>
                            <td>{metodoCodProf}</td>
                        </tr>
                    </tbody>
                </Table>
            </Form.Group>
        </Container>
    )
}