import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'

export default function tabDistribucion(informacion) {
    //console.log(informacion.infoFormTab8[0])

    var restriccionesAcceso = informacion.infoFormTab8[0].getElementsByTagName("accessConstraints")[0].innerHTML;
    var restriccionesUso = informacion.infoFormTab8[0].getElementsByTagName("useConstraints")[0].innerHTML;
    var otrasRestricciones = informacion.infoFormTab8[0].getElementsByTagName("otherConstraints")[0].innerHTML;
    var nombreFormato = informacion.infoFormTab8[0].getElementsByTagName("name")[0].innerHTML;
    var version = informacion.infoFormTab8[0].getElementsByTagName("version")[0].innerHTML;

    return(
        <Container>
            <Form>
                <br></br>
                <Form.Group>
                    <Form.Label><b>8.1 Restricciones de acceso</b></Form.Label>
                    <Form.Control id = "8.1_restriccionAcceso" as="textarea" rows={3}
                                defaultValue = {restriccionesAcceso} readOnly/>
                </Form.Group>
                <Form.Group>
                    <Form.Label><b>8.2 Restricciones de uso</b></Form.Label>
                    <Form.Control id = "8.2_restriccionesUso" as="textarea" rows={3}
                                defaultValue = {restriccionesUso} readOnly/>
                </Form.Group>
                <Form.Group>
                    <Form.Label><b>8.3 Responsabilidad de distribución</b></Form.Label>
                    <Form.Control id = "8.3_otraRestricciones" as="textarea" rows={3}
                                defaultValue = {otrasRestricciones} readOnly/>
                </Form.Group>
                <Form.Label><b>8.4 Formato de distribución</b></Form.Label>
                <Row>
                    <Col xs={1}></Col>
                        <Form.Label><b>8.4.1 Nombre del formato</b></Form.Label>
                    <Col>
                        <Form.Control type = "text" id = "8.4.1_formato"
                            defaultValue ={nombreFormato} readOnly/>
                    </Col>
                    <Col xs={3}></Col>
                </Row>
                <br />
                <Row>
                    <Col xs={1}></Col>
                        <Form.Label><b>8.4.2 Versión del formato</b></Form.Label>
                    <Col>
                        <Form.Control type = "text" id = "8.4.2_version"
                                defaultValue = {version} readOnly/>
                    </Col>
                    <Col xs={3}></Col>
                </Row>  
                <br></br>              
            </Form>
        </Container>
    )
}