import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'

export default function tabFechasRelacionadas(informacion) {
    var fechaEvento = informacion.infoFormTab2[0].getElementsByTagName("date")[0].innerHTML;
    var tipoFecha = informacion.infoFormTab2[0].getElementsByTagName("dateType")[0].innerHTML;
    var fechaCreacion = informacion.infoFormTab2[0].getElementsByTagName("date_creation")[0].innerHTML;
    var fechaInicial = informacion.infoFormTab2[0].getElementsByTagName("date_begin")[0].innerHTML;
    var fechaFinal = informacion.infoFormTab2[0].getElementsByTagName("date_end")[0].innerHTML;
    var insumo = informacion.infoFormTab2[0].getElementsByTagName("inpname")[0].innerHTML;

    return(
        <Container>
            <Form>
                <br></br>
                <Form.Group>
                    <Form.Label><b>2.1 Fechas y eventos</b> </Form.Label>
                    <div className="border-bottom">
                        <Form.Group as={Col}>
                            <Form.Row>
                                <Col xs={3}>
                                    <Form.Label><b>2.1.1 Fecha de referencia</b></Form.Label>
                                    <Form.Control id = "2.1.1_fechaRef" type = "text" defaultValue = {fechaEvento} readOnly/>
                                </Col>
                                <Col>
                                    <Form.Label><b>2.1.2 Tipo de fecha </b></Form.Label>
                                    <Form.Control id = "2.1.2_tipoFecha" type = "text" defaultValue = {tipoFecha} readOnly/>
                                </Col>
                            </Form.Row>
                        </Form.Group>
                    </div>
                </Form.Group>
                <Form.Group>               
                    <Form.Label><b>2.2 Fechas de los insumos tomados para la elaboración del producto o conjunto de datos especiales</b> </Form.Label>    
                    <Form.Group as={Col}>
                        <Form.Row>
                            <Col xs={4}>
                                <Form.Label><b>2.2.1 Fecha de creación</b> </Form.Label>
                                <Form.Control id = "2.1.1_fechaCreacion" type = "text" defaultValue = {fechaCreacion} readOnly/>
                            </Col>
                            <Col xs={4}>
                                <Form.Label><b>2.2.2 Fecha inicial</b> </Form.Label>
                                <Form.Control id = "2.2.2_fechaInicial" type = "text" defaultValue = {fechaInicial} readOnly/>
                            </Col>
                            <Col xs={4}>
                                <Form.Label><b>2.2.3 Fecha final</b></Form.Label>
                                <Form.Control id = "2.2.3_fechaFinal" type = "text" defaultValue = {fechaFinal} readOnly/>
                            </Col>
                        </Form.Row>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label><b>2.2.4 Nombre del insumo</b> </Form.Label>
                        <Form.Control id = "2.2.4_insumo" as = "textarea" defaultValue = {insumo} rows={2} readOnly/>
                    </Form.Group>
                </Form.Group>
                <br></br>
            </Form>
        </Container>
    )
}