import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'

export default function tabInformacionContacto(informacion) {
   
   // console.log(informacion.infoFormTab9[0])

    var nombreMetadatos = informacion.infoFormTab9[0].getElementsByTagName("metadataStandardName")[0].innerHTML;
    var versionMetadatos = informacion.infoFormTab9[0].getElementsByTagName("metadataStandardVersion")[0].innerHTML;
    var lenguajeMetadatos = informacion.infoFormTab9[0].getElementsByTagName("Inf_Metadata_language")[0].innerHTML;

    var puntoDeContacto = informacion.infoFormTab9[0].getElementsByTagName("CI_ResponsibleParty");
    var nombreContacto = puntoDeContacto[0].getElementsByTagName("Inf_Metadata_CI_ResponsibleParty_individualName")[0].innerHTML;
    var organizacion = puntoDeContacto[0].getElementsByTagName("Inf_Metadata_CI_ResponsibleParty_organisationName")[0].innerHTML;
    var puesto = puntoDeContacto[0].getElementsByTagName("Inf_Metadata_CI_ResponsibleParty_positionName")[0].innerHTML;
    var telefono = puntoDeContacto[0].getElementsByTagName("Inf_Metadata_CI_ResponsibleParty_voice")[0].innerHTML;
    var fax = puntoDeContacto[0].getElementsByTagName("Inf_Metadata_CI_ResponsibleParty_facsimile")[0].innerHTML;
    var direccion = puntoDeContacto[0].getElementsByTagName("Inf_Metadata_CI_ResponsibleParty_deliveryPoint")[0].innerHTML;
    var ciudad = puntoDeContacto[0].getElementsByTagName("Inf_Metadata_CI_ResponsibleParty_city")[0].innerHTML;
    var areaAdministativa = puntoDeContacto[0].getElementsByTagName("Inf_Metadata_CI_ResponsibleParty_administrativeArea")[0].innerHTML;
    var codigoPostal = puntoDeContacto[0].getElementsByTagName("Inf_Metadata_CI_ResponsibleParty_postalCode")[0].innerHTML;
    var pais = puntoDeContacto[0].getElementsByTagName("Inf_Metadata_CI_ResponsibleParty_country")[0].innerHTML;
    var email = puntoDeContacto[0].getElementsByTagName("Inf_Metadata_CI_ResponsibleParty_electronicMailAddress")[0].innerHTML;
    var rol = puntoDeContacto[0].getElementsByTagName("Inf_Metadata_CI_ResponsibleParty_role")[0].innerHTML;
    

    var fecha = informacion.infoFormTab9[0].getElementsByTagName("dateStamp")[0].innerHTML;
    var encoding = informacion.infoFormTab9[0].getElementsByTagName("Inf_Metadata_characterSet")[0].innerHTML;
    

    return(
        <Container>
            <Form>
                <br></br>
                    <Form.Group>
                        <Form.Label><b>9.1 Nombre del estándar de metadatos</b></Form.Label>
                        <Form.Control id = "9.1_nombreMetadatos" type = "text"
                            defaultValue = {nombreMetadatos} readOnly/>
                    </Form.Group>
                    <Form.Row>
                            <Col xs={6}>
                                <Form.Group>
                                    <Form.Label><b>9.2 Versión de la norma de los metadatos</b></Form.Label>
                                    <Form.Control id = "versionMetadatos" type = "text"
                                            defaultValue = {versionMetadatos} readOnly/>
                                </Form.Group>
                            </Col>
                            <Col xs={6}>
                                <Form.Group>
                                    <Form.Label><b>9.3 Idioma de los metadatos</b></Form.Label>
                                    <Form.Control id = "9.3_idiomaMetadatos" type = "text"
                                            defaultValue = {lenguajeMetadatos} readOnly/>
                                </Form.Group>    
                            </Col>
                        </Form.Row>
                        <Form.Label><b>9.4 Punto de contacto para los metadatos</b></Form.Label>
                        <Row>
                            <Col xs={1}></Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label><b>9.4.1 Nombre de la persona de contacto</b></Form.Label>
                                    <Form.Control id = "9.4.1_nombreContacto" type = "text"
                                            defaultValue = {nombreContacto} readOnly/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={1}></Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label><b>9.4.2 Nombre de la organización</b></Form.Label>
                                    <Form.Control id = "9.4.2_organizacion" type = "text"
                                            defaultValue = {organizacion} readOnly/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={1}></Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label><b>9.4.3 Puesto del contacto</b></Form.Label>
                                    <Form.Control id = "9.4.3_puesto" type = "text"
                                            defaultValue = {puesto} readOnly/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={1}></Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label><b>9.4.4 Teléfono</b></Form.Label>
                                    <Form.Control id = "9.4.4_telefono" type = "text"
                                            defaultValue = {telefono} readOnly/>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label><b>9.4.5 Fax</b></Form.Label>
                                    <Form.Control id = "9.4.5_fax" type = "text"
                                            defaultValue = {fax} readOnly/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={1}></Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label><b>9.4.6 Dirección</b></Form.Label>
                                    <Form.Control id = "9.4.6_direccion" as = "textarea"
                                            defaultValue = {direccion} readOnly rows= {2}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={1}></Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label><b>9.4.7 Ciudad</b></Form.Label>
                                    <Form.Control id = "9.4.7_ciudad" type = "text"
                                            defaultValue = {ciudad} readOnly/>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label><b>9.4.8 Área administrativa</b></Form.Label>
                                    <Form.Control id = "9.4.8_areaAdministrativa" type = "text"
                                            defaultValue = {areaAdministativa} readOnly/>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label><b>9.4.9 Código postal</b></Form.Label>
                                    <Form.Control id = "9.4.9_cp" type = "text"
                                            defaultValue = {codigoPostal} readOnly/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={1}></Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label><b>9.4.10 País</b></Form.Label>
                                    <Form.Control id = "9.4.10_pais" type = "text"
                                            defaultValue = {pais} readOnly/>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label><b>9.4.11 Dirección de correo electrónico</b></Form.Label>
                                    <Form.Control id = "9.4.11_email" type = "text"
                                            defaultValue = {email} readOnly/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={1}></Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label><b>9.4.12 Rol</b></Form.Label>
                                    <Form.Control id = "9.4.12_rol" type = "text"
                                            defaultValue = {rol} readOnly/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group>
                            <Form.Label><b>9.5 Fecha de los metadatos</b></Form.Label>
                            <Form.Control id = "9.5_fecha" type = "text"
                                        defaultValue = {fecha} readOnly/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label><b>9.6 Conjunto de caracteres</b></Form.Label>
                            <Form.Control id = "9.6_encoding" as="textarea" rows={2} 
                                   defaultValue = {encoding} readOnly />
                        </Form.Group>                   
                <br></br>
            </Form>
        </Container>
    )
}