import {Tabs, Tab } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'

export default function tabAlcanceOAmbito(informacion) {

    return(
        <Container>
            <Form.Group controlId="tab1Form.margenSup"></Form.Group>
            <Form.Group as={Col} >
                <Form.Label> <b>6.1.1 Nivel</b> </Form.Label>
                <Form.Control type = "text" id = "6.1.1_nivel" defaultValue = {informacion.infoNivel} readOnly/>
            </Form.Group>
        </Container>
    )
}