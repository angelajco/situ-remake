import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'

export default function tabUnidadEstadoResponsable(informacion) {

    var nombreContacto = informacion.infoFormTab3[0].getElementsByTagName("CI_ResponsibleParty_individualName")[0].innerHTML;
    var organizacion = informacion.infoFormTab3[0].getElementsByTagName("CI_ResponsibleParty_organisationName")[0].innerHTML;
    var puesto = informacion.infoFormTab3[0].getElementsByTagName("CI_ResponsibleParty_positionName")[0].innerHTML;
    var telefono = informacion.infoFormTab3[0].getElementsByTagName("CI_ResponsibleParty_voice")[0].innerHTML;
    var fax = informacion.infoFormTab3[0].getElementsByTagName("CI_ResponsibleParty_facsimile")[0].innerHTML;
    var direccion = informacion.infoFormTab3[0].getElementsByTagName("CI_ResponsibleParty_deliveryPoint")[0].innerHTML;
    var ciudad = informacion.infoFormTab3[0].getElementsByTagName("CI_ResponsibleParty_city")[0].innerHTML;
    var areaAdministrativa = informacion.infoFormTab3[0].getElementsByTagName("CI_ResponsibleParty_administrativeArea")[0].innerHTML;
    var codigoPostal = informacion.infoFormTab3[0].getElementsByTagName("CI_ResponsibleParty_postalCode")[0].innerHTML;
    var pais = informacion.infoFormTab3[0].getElementsByTagName("CI_ResponsibleParty_country")[0].innerHTML;
    var email = informacion.infoFormTab3[0].getElementsByTagName("CI_ResponsibleParty_electronicMailAddress")[0].innerHTML;
    var urlEnLinea = informacion.infoFormTab3[0].getElementsByTagName("CI_ResponsibleParty_linkage")[0].innerHTML;
    var rol = informacion.infoFormTab3[0].getElementsByTagName("CI_ResponsibleParty_role")[0].innerHTML;

    return(
        <Container>
            <Form>
                <br></br>
                <Form.Group>
                    <Form.Group as={Col}>
                        <Form.Row>
                            <Col xs={5}>
                                <Form.Group>
                                    <Form.Label><b>3.1 Nombre de la persona de contacto</b></Form.Label>
                                    <Form.Control id = "3.1_nombreContacto" type = "text" defaultValue = {nombreContacto} readOnly/>
                                </Form.Group>
                            </Col>
                            <Col xs={7}>
                                <Form.Group>
                                    <Form.Label><b>3.2 Nombre de la organización</b></Form.Label>
                                    <Form.Control id = "3.2_organizacion" type = "text" defaultValue = {organizacion} readOnly/>
                                </Form.Group>    
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label><b>3.3 Puesto del contacto</b></Form.Label>
                                    <Form.Control id = "3.3_puesto" type = "text" defaultValue = {puesto} readOnly/>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={6}>
                                <Form.Group>
                                    <Form.Label><b>3.4 Teléfono</b></Form.Label>
                                    <Form.Control id = "3.4_telefono" type = "text" defaultValue = {telefono} readOnly/>
                                </Form.Group>
                            </Col>
                            <Col xs={6}>
                                <Form.Group>
                                    <Form.Label><b>3.5 Fax</b></Form.Label>
                                    <Form.Control id = "3.5_fax" type = "text" defaultValue = {fax} readOnly/>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label><b>3.6 Dirección</b></Form.Label>
                                    <Form.Control id = "3.6_direccion" as="textarea" rows={2} defaultValue = {direccion} readOnly/>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={3}>
                                <Form.Group>
                                    <Form.Label><b>3.7 Ciudad</b></Form.Label>
                                    <Form.Control id = "3.7_ciudad" type = "text" defaultValue = {ciudad} readOnly/>
                                </Form.Group>
                            </Col>
                            <Col xs={3}>
                            <Form.Group>
                                <Form.Label><b>3.8 Área administrativa:</b></Form.Label>
                                    <Form.Control id = "3.8_areaAdmon" type = "text" defaultValue = {areaAdministrativa} readOnly/>
                                </Form.Group>
                            </Col>
                            <Col xs={3}>
                                <Form.Group>
                                    <Form.Label><b>3.9 Código postal:</b></Form.Label>
                                    <Form.Control id = "3.9_cp" type = "text" defaultValue = {codigoPostal} readOnly/>
                                </Form.Group>
                            </Col>
                            <Col xs={3}>
                            <Form.Group>
                                <Form.Label><b>3.10 País</b></Form.Label>
                                    <Form.Control id ="3.10_pais" type = "text" defaultValue = {pais} readOnly/>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={6}>
                                <Form.Group>
                                    <Form.Label><b>3.11 Dirección de correo electrónico del contacto</b></Form.Label>
                                    <Form.Control id = "3.11_email" type = "text" defaultValue ={email} readOnly/>
                                </Form.Group>
                            </Col>
                            <Col xs={6}>
                                <Form.Group>
                                    <Form.Label><b>3.12 Enlace en línea (dirección de Internet de referencia)</b></Form.Label>
                                    <Form.Control id = "3.12_link" type = "text" defaultValue = {urlEnLinea} readOnly/>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={6}>
                                <Form.Group>
                                    <Form.Label><b>3.13 Rol</b></Form.Label>
                                    <Form.Control id = "3.13_rol" type = "text" defaultValue = {rol} readOnly/>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                    </Form.Group>
                </Form.Group>
            </Form>
        </Container>
    )
}