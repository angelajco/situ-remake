import {Tabs, Tab } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'

export default function tabEntidadesAtributos(informacion) {

    var esquemaAscci = informacion.infoFormTab7[0].getElementsByTagName("schemaAscii")[0].innerHTML;
    var detalles = informacion.infoFormTab7[0].getElementsByTagName("entity_detail")[0].innerHTML;
    return(
        <Container>
            <Form.Group as={Col} controlId="tab3FormMarginSup"></Form.Group>
            <Form>
                <Form.Group>
                    <Form.Label><b> 7.1 Descripción general de entidades y atributos:</b></Form.Label>
                    <Form.Control id = "7.1_descGral" as="textarea" rows={5}
                        defaultValue = {esquemaAscci} readOnly/>
                </Form.Group>
                <Form.Group>
                    <Form.Label><b> 7.2 Cita del detalle entidades y atributos:</b></Form.Label>
                    <Form.Control id = "7.2_citaDetalle" as="textarea" rows={5}
                        defaultValue = {detalles} readOnly/>
                </Form.Group>
            </Form>
        </Container>
    )
}