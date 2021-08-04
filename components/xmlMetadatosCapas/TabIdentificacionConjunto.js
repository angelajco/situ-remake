import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'

export default function tabIdentificacionConjunto(informacion) {

    //console.log(informacion.infoFormTab1)

    var titulo = informacion.infoFormTab1[0].getElementsByTagName("title")[0].innerHTML;
    var proposito = informacion.infoFormTab1[0].getElementsByTagName("purpose")[0].innerHTML;
    var resumen = informacion.infoFormTab1[0].getElementsByTagName("abstract")[0].innerHTML;
    var lenguaje = informacion.infoFormTab1[0].getElementsByTagName("MD_DataIdentification_language")[0].innerHTML.substring(0,2);
    var temaPrincipal = informacion.infoFormTab1[0].getElementsByTagName("principalTopic")[0].innerHTML;
    var grupoDeDatos =  informacion.infoFormTab1[0].getElementsByTagName("groupCategory")[0].innerHTML;    
    var pivotPalabrasClave = Array.from(informacion.infoFormTab1[0].getElementsByTagName("keyword")); 
    var palabrasClave = informacion.infoFormTab1[0].getElementsByTagName("keyword"); 
    var tipoPalabraClave = informacion.infoFormTab1[0].getElementsByTagName("type"); 
    var nombreTesauro = informacion.infoFormTab1[0].getElementsByTagName("thesaurusName")[0].innerHTML;
    var edicion = informacion.infoFormTab1[0].getElementsByTagName("edition")[0].innerHTML;
    var presentacionDatos = informacion.infoFormTab1[0].getElementsByTagName("presentationForm")[0].innerHTML;
    var urlRecurso = informacion.infoFormTab1[0].getElementsByTagName("CI_OnlineResource_linkage")[0].innerHTML;
    var descripcionRecurso = informacion.infoFormTab1[0].getElementsByTagName("CI_OnlineResource_description")[0].innerHTML;
    var mantenimiento = informacion.infoFormTab1[0].getElementsByTagName("maintenanceAndUpdateFrequency")[0].innerHTML;
    var encoding = informacion.infoFormTab1[0].getElementsByTagName("MD_DataIdentification_characterSet")[0].innerHTML;
    var archivoGrafico = informacion.infoFormTab1[0].getElementsByTagName("graphfilename")[0].innerHTML;
    var usoEspecifico = informacion.infoFormTab1[0].getElementsByTagName("specuse")[0].innerHTML;
    
    return(
        <Container>
            <Form>
                <br></br>
                <Form.Group>
                    <Form.Label><b>1.1 Título del conjunto de datos espaciales o producto</b> </Form.Label>
                    <Form.Control type = "text" id = "1.1_titulo" defaultValue = {titulo} readOnly/>
                </Form.Group>
                <Form.Group>
                    <Form.Label> <b>1.2 Propósito</b> </Form.Label>
                    <Form.Control id = "1.2_proposito" as="textarea" defaultValue = {proposito} rows={3} readOnly/>
                </Form.Group>
                <Form.Group >
                    <Form.Label> <b>1.3 Descripción del conjunto de datos espaciales o producto</b> </Form.Label>
                    <Form.Control id = "1.3_resumen" as="textarea"defaultValue = {resumen} rows={5} readOnly/>
                </Form.Group>
                <Form.Group>
                    <div className="border-bottom">
                    <Form.Label> <b>1.4 Idioma del conjunto de datos espaciales o producto</b> </Form.Label>                   
                        <Form.Group as={Col}> 
                            <Row>
                                <Col>
                                    {lenguaje == 'ES'? (
                                        <Form.Check type="radio" id = "1.4_lenguaje_es" name = "radioIdioma" inline label = "ES - Español." defaultChecked disabled/>)
                                        : (<Form.Check type="radio" id = "1.4_lenguaje_es" name = "radioIdioma" inline label = "ES - Español." disabled/>)}
                                </Col>
                                <Col>
                                    {lenguaje == 'EN'? (<Form.Check type="radio" id = "1.4_lenguaje_eN" name = "radioIdioma" inline label = "EN - Inglés." defaultChecked disabled/>)
                                    :(<Form.Check type="radio" id = "1.4_lenguaje_en" name = "radioIdioma" inline label = "EN - Inglés." disabled/>)}
                                </Col>
                            </Row>
                        </Form.Group>
                    </div>
                </Form.Group>
                <Form.Group>
                    <div className="border-bottom">
                        <Form.Label> <b>1.5 Categoría del tema del conjunto de datos espaciales o proucto</b> </Form.Label>                   
                        <Form.Group as as={Col}>
                            <Form.Group>
                                <Form.Label><b>1.5.1 Tema principal del conjunto de datos espaciales o proucto </b></Form.Label>
                                <Form.Control id = "1.5.1_temaPrincipal" type = "text" defaultValue = {temaPrincipal} readOnly/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label id="tab1Form.taGrupoDatos" ><b>1.5.2 Grupo de datos del conjunto de datos espaciales o proucto </b></Form.Label>
                                <Form.Control id = "1.5.2_grupoDeDatos" as="textarea" rows={2} defaultValue = {grupoDeDatos} readOnly/>
                            </Form.Group>
                        </Form.Group>
                    </div>
                </Form.Group>
                <Form.Group >
                    <div className="border-bottom">
                        <Form.Label> <b>Palabras clave:</b> </Form.Label>
                        <Form.Group as={Col} >
                            <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>1.6 Palabra clave</th>
                                    <th>1.7 Tipo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pivotPalabrasClave.map((palabra, index) => 
                                    <tr key = {index}>
                                        <td key = {palabrasClave[index].innerHTML}>{palabrasClave[index].innerHTML}</td>
                                        <td key = {tipoPalabraClave[index].innerHTML}  >{tipoPalabraClave[index].innerHTML}</td>
                                    </tr>
                                    )}
                            </tbody>    
                            </Table>
                        </Form.Group>
                    </div>
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Row>
                        <Col xs={8}>
                            <Form.Label><b>1.8 Nombre del tesauro:</b> </Form.Label>
                            <Form.Control id = "1.8_tesauro" defaultValue = {nombreTesauro} readOnly/>
                        </Col>
                        <Col>
                            <Form.Label><b>1.9 Edición:</b> </Form.Label>
                            <Form.Control id = "1.9_edicion" defaultValue = {edicion} readOnly/>
                        </Col>
                    </Form.Row>
                </Form.Group>
                <Form.Group as={Col}>
                    <div className="border-bottom">
                        <Form.Group>
                            <Form.Label><b> 1.10 Forma de presentación de los datos especiales:</b> </Form.Label>
                            <Form.Control id = "1.10_presentacion_datos" defaultValue = {presentacionDatos} readOnly/>
                        </Form.Group>
                    </div>
                </Form.Group>
                <Form.Group as={Col}>
                    <div className="border-bottom">
                        <Form.Label> <b>1.11 Enlace en línea:</b> </Form.Label>                  
                        <Form.Group as={Col}>
                            <Form.Row>
                                <Col >
                                    <Form.Label><b>1.11.1 URL del recurso </b></Form.Label>
                                    <Form.Control id = "1.11.1_urlRecurso" defaultValue = {urlRecurso} readOnly/>
                                </Col>
                                <Col xs={8}>
                                    <Form.Label ><b>1.11.2 Descripción del acceso al recurso </b></Form.Label>
                                    <Form.Control as="textarea" id = "1.11.2_descRecurso" rows={2} defaultValue = {descripcionRecurso} readOnly/>
                                </Col>
                            </Form.Row>
                        </Form.Group>     
                    </div>
                </Form.Group>
                                   
                <Form.Group as={Col} >
                    <Form.Label><b>1.12 Frecuencia de mantenimiento y actualización</b> </Form.Label>
                    <Form.Control id = "1.12_mantenimiento" defaultValue = {mantenimiento} readOnly/>
                </Form.Group>
                <Form.Row>
                    <Col>
                        <Form.Group as={Col} >
                            <Form.Label ><b>1.13 Conjunto de caractéres</b> </Form.Label>
                            <Form.Control type = "text" id = "1.13_encoding" defaultValue = {encoding} readOnly/>
                        </Form.Group>
                    </Col>
                </Form.Row>
                <Form.Row>    
                    <Col xs={8}>
                        <Form.Group as={Col} >
                            <Form.Label><b>1.14 Nombre del archivo gráfico</b> </Form.Label>
                            <Form.Control id = "1.14_archivoGrafico" defaultValue = {archivoGrafico} readOnly/>
                        </Form.Group>
                    </Col>
                </Form.Row>
                <Form.Group as={Col} >
                    <Form.Label ><b>1.15 Uso específico</b> </Form.Label>
                    <Form.Control id = "1.15_usoEspecifico" as="textarea" rows={5} defaultValue = {usoEspecifico} readOnly/>
                </Form.Group>
                <br></br>
            </Form>
        </Container>
    )
}