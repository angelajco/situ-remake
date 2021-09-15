import {Tabs, Tab } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import TabIdentificacionConjunto from '../../components/xmlMetadatosCapas/TabIdentificacionConjunto'
import TabFechasRelacionadas from '../../components/xmlMetadatosCapas/TabFechasRelacionadas'
import TabUnidadEstadoResponsable from '../../components/xmlMetadatosCapas/TabUnidadEstadoResponsable'
import TabLocalizacionGeografica from '../../components/xmlMetadatosCapas/TabLocalizacionGeografica'
import TabSistemaDeReferencias from '../../components/xmlMetadatosCapas/TabSistemaDeReferencias'
import TabCalidadDeInformacion from '../../components/xmlMetadatosCapas/TabCalidadDeInformacion'
import TabEntidadesAtributos from '../../components/xmlMetadatosCapas/TabEntidadesAtributos'
import TabDistribucion from '../../components/xmlMetadatosCapas/TabDistribucion'
import TabInformacionContacto from '../../components/xmlMetadatosCapas/TabInformacionContacto'
import React, {useState} from 'react';
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import { useAuthState  } from '../../context';
import ModalAnalisis from '../../components/ModalAnalisis'
import { useEffect } from "react";

export async function getCapas(){
    return await fetch(`http://172.16.117.11:80/wa0/lista_capas02`)
    .then(res => res.json())
    .then((data) =>{return data.catalogo})
    .catch(error => console.log(error));
}

/* función para extraer el encoding del archivo de metadatos para realizar la correcta interpretación
   al cargarlo con la API FileReader a la pantalla
*/
export function leerEncoding(xml){
    // extraer la cabecera del xml para obtener el encoding
    let headerXML = xml.substring(0, xml.indexOf('?>'));
    let encoding = headerXML.substring(headerXML.indexOf('encoding'), headerXML.length)    
    return encoding.substring(encoding.indexOf('"'), encoding.length).replace('"', '').replace('"', '');
}

export default function CargaMetaDatos() {
    const userDetails = useAuthState().user;
	let csrfToken = userDetails.csrfToken;

    const [capas, setCapas] = useState([]);

    const [showModalAnalisis, setShowModalAnalisis] = useState(false);
    const handleCloseModalAnalisis = () => setShowModalAnalisis(false);
    const [datosModalAnalisis, setDatosModalAnalisis] = useState(
        {
            title: '',
            body: ''
        }
    );   
    
    async function handleCapas () { setCapas(await getCapas())}
    
    const [archivoCargado, setArchivoCargado] = useState(false);
    const [capaSeleccionada, setCapaSeleccionada] = useState(false);
    let [nombreArchivo, setNombreArchivo] = useState();
    
    let [datosTab1, setDatosTab1] = useState();
    let [datosTab2, setDatosTab2] = useState();
    let [datosTab3, setDatosTab3] = useState();
    let [datosTab4, setDatosTab4] = useState();
    let [datosTab5, setDatosTab5] = useState();
    let [datosTab6, setDatosTab6] = useState();
    let [datosTab7, setDatosTab7] = useState();
    let [datosTab8, setDatosTab8] = useState();
    let [datosTab9, setDatosTab9] = useState();
    let [titulo, setTitulo] = useState();
    let [proposito, setProposito] = useState();
    let [descripcion, setDescripcion] = useState();
    let [categoriaDatos, setCategoriaDatos] = useState();
    let [subCategoriaDatos, setSubCategoriaDatos] = useState();
    let [proveedor, setProveedor] = useState();
    let [strXML, setStrXML] = useState();
    let [idCapa, setIdCapa] = useState();

    // ----------
    function onLoadFile(event){
        var fileType = event.target.files[0].name;
        fileType = fileType.substring(fileType.indexOf('.') + 1);
        if(fileType == 'xml'){
        //console.log(event.target.files[0])
        /* guardar el nombre del archivo de metadatos */
            setNombreArchivo(event.target.files[0].name)
            // lector temporal para conocer el enconding del archivo de metadatos
            var tmpFileReader = new FileReader();
            var xmlFileReader = new FileReader();
            tmpFileReader.readAsText(event.target.files[0], "ISO-8859-1");

            tmpFileReader.onload = loaded => {
                var encoding = leerEncoding(loaded.target.result)  
                console.log(encoding); 
                // leer nuevamente el archivo de metadatos con el encoding indicado en el header
                xmlFileReader.readAsText(event.target.files[0], encoding);
                xmlFileReader.onload = loadedXML => {
                    let parser = new DOMParser();
                    let contenidoXml = parser.parseFromString(loadedXML.target.result, 'text/xml');
                    // modificar las variables que se almacenan en la tabla de registro
                    setStrXML(loadedXML.target.result);
                    setTitulo(contenidoXml.getElementsByTagName("MD_DataIdentification")[0].getElementsByTagName("title")[0].innerHTML);
                    setProposito(contenidoXml.getElementsByTagName("MD_DataIdentification")[0].getElementsByTagName("purpose")[0].innerHTML);    
                    setDescripcion(contenidoXml.getElementsByTagName("MD_DataIdentification")[0].getElementsByTagName("abstract")[0].innerHTML);
                    setCategoriaDatos(contenidoXml.getElementsByTagName("MD_DataIdentification")[0].getElementsByTagName("principalTopic")[0].innerHTML);
                    setSubCategoriaDatos(contenidoXml.getElementsByTagName("MD_DataIdentification")[0].getElementsByTagName("groupCategory")[0].innerHTML);
                    setProveedor(contenidoXml.getElementsByTagName("Inf_Metadata")[0].getElementsByTagName("Inf_Metadata_CI_ResponsibleParty_organisationName")[0].innerHTML);

                    setDatosTab1(contenidoXml.getElementsByTagName("MD_DataIdentification"));
                    setDatosTab2(contenidoXml.getElementsByTagName("CI_Date"));
                    setDatosTab3(contenidoXml.getElementsByTagName("CI_ResponsibleParty"));
                    setDatosTab4(contenidoXml.getElementsByTagName("geographicElement"));
                    setDatosTab5(contenidoXml.getElementsByTagName("MD_ReferenceSystem"));
                    setDatosTab6(contenidoXml.getElementsByTagName("DQ_DataQuality"));
                    setDatosTab7(contenidoXml.getElementsByTagName("Attributes"));
                    setDatosTab8(contenidoXml.getElementsByTagName("MD_Distribution"));
                    setDatosTab9(contenidoXml.getElementsByTagName("Inf_Metadata"));
                    
                    
                    setArchivoCargado(true);
                }
            }
        }else{
            setDatosModalAnalisis({
                title: 'Error',
                body: '¡Formato de archivo no soportado!',
            });
            setShowModalAnalisis(true);
            event.target.value = null
        }
    }
    // ----------
    function onClickUpload(event){
        event.target.value = null
        setArchivoCargado(false);
        setDatosTab1(null);
        setDatosTab2(null);
        setDatosTab3(null);
        setDatosTab4(null);
        setDatosTab5(null);
        setDatosTab6(null);
        setDatosTab7(null);
        setDatosTab8(null);
        setDatosTab9(null);
    }
    // ----------
    function onChangeSelectCapa(e){
        const index = e.target.selectedIndex;
        const optionElement = e.target.childNodes[index];
        const optionElementId = optionElement.getAttribute('id');
        var capaSeleccionada = e.target.value

        setIdCapa(optionElementId)

        if(capaSeleccionada != "etiqueta_seleccion")
            setCapaSeleccionada(true);
        else
            setCapaSeleccionada(false);
    }
    // ----------
    function onClickButtonGuardar(){
        var objectMetadatos = {nombre_archivo: nombreArchivo, id_capa: idCapa
                                , titulo:titulo, proposito:proposito, descripcion:descripcion 
                                , categoriaDatos:categoriaDatos, subCategoriaDatos:subCategoriaDatos
                                , proveedor: proveedor
                                , metadatos: strXML, id_usuario:userDetails.id};
                                 
        let jsonRequest = JSON.stringify(objectMetadatos);
        let requestHeaders = {"Content-Type": "application/json"};
        requestHeaders[`${csrfToken.headerName}`]=csrfToken.token;
        let configRequest = {
            method: "post",
            url: `${process.env.ruta}/wa/prot/guardarMetadatos`,
            headers: requestHeaders,
            data: jsonRequest
            ,withCredentials: true
        } 
        axios(configRequest).then(res => {
            setDatosModalAnalisis({
                title: 'Confirmación de Descarga',
                body: res.data,
            });
            setShowModalAnalisis(true);
            //console.log(res.data)
        }).catch(function (error) {
            console.log(error)
        });
    }
    useEffect(() => { 
        handleCapas();

    }, []);

    // ----------
    return(
        
        <Container>
            <ModalAnalisis show={showModalAnalisis}
                datos={datosModalAnalisis}
                onHide={handleCloseModalAnalisis}> </ModalAnalisis>
            <br/>
            <Container>
            <Form>
                <Row className="align-items-center">
                    <Col xs = {3}></Col>
                    <Col xs="auto" className="my-1">
                        <Form.Group>
                            <Form.Control as = "select" className="me-sm-2" id = "catalogoCapas"
                                onChange = {(e)=> onChangeSelectCapa(e) }>
                                <option value="etiqueta_seleccion" id = "seleccion">Seleccione una capa ...</option>
                                {
                                    capas.map((value, index) => (
                                        <option key = {value.idCapa} value={value.titulo} id = {value.idCapa}>{value.titulo}</option>
                                    ))
                                }
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className = "align-items-center">
                    <Col xs = {3}></Col>
                    <Col xs="auto" className="my-1">
                        <Form.Group className="mb-3">
                            <Form.Control type="file" disabled = {!capaSeleccionada}
                            onClick = {(e) => onClickUpload(e) }
                            onChange = {(e)=> onLoadFile(e) }/>
                        </Form.Group>
                    </Col>
                    <Col xs="auto" className="my-1">
                        <Form.Group>
                                {archivoCargado?  <Button className="tw-block tw-mb-4 tw-border tw-border-black" variant="light" 
                                    onClick = {()=> onClickButtonGuardar()} 
                                    disabled = {!archivoCargado} > Guardar</Button>:
                                    <Button className="tw-mb-4 tw-border" variant="light" 
                                    onClick = {()=> onClickButtonGuardar()} 
                                    disabled = {!archivoCargado} > Guardar</Button>}
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            </Container>
            {archivoCargado
                ? (
                    <Container>
                        <br></br>
                        <Tabs defaultActiveKey="tab1" id="mainTabMetadatos" className="tabs-autorizacion">
                            <Tab eventKey="tab1" title="1. Identificación del conjunto de datos espaciales o producto">
                                <TabIdentificacionConjunto infoFormTab1 = {datosTab1}/>
                            </Tab>
                            <Tab eventKey="tab2" title="2. Fechas Relacionadas con el conjunto de datos espaciales o producto">
                                <TabFechasRelacionadas infoFormTab2 = {datosTab2}/>
                            </Tab>
                            <Tab eventKey="tab3" title="3. Unidad del estado responsable del conjunto de datos espaciales o producto">
                                <TabUnidadEstadoResponsable infoFormTab3 = {datosTab3}/>
                            </Tab>
                            <Tab eventKey="tab4" title="4. Localización Geográfica del conjunto de datos espaciales o producto">
                                <TabLocalizacionGeografica infoFormTab4 = {datosTab4}/>
                            </Tab>
                            <Tab eventKey="tab5" title="5. Sistema de referencia">
                                <TabSistemaDeReferencias infoFormTab5 = {datosTab5}/>
                            </Tab>
                            <Tab eventKey="tab6" title="6. Calidad de la información">
                                <TabCalidadDeInformacion infoFormTab6 = {datosTab6}/>
                            </Tab>
                            <Tab eventKey="tab7" title="7. Entidades y atributos">
                                <TabEntidadesAtributos infoFormTab7 = {datosTab7}/>
                            </Tab>
                            <Tab eventKey="tab8" title="8. Distribución">
                                <TabDistribucion infoFormTab8 = {datosTab8}/>
                            </Tab>
                            <Tab eventKey="tab9" title="9. Información del contacto">
                                <TabInformacionContacto infoFormTab9 = {datosTab9}/>
                            </Tab>
                        </Tabs>
                    </Container>
                )
                :(<Container>
                    <Row>
                        <Col xs={4}></Col>
                        <Col xs={5}>
                            <Form.Label><b>No se ha cargado información para mostrar</b> </Form.Label>
                        </Col>
                        <Col xs={1}></Col>
                    </Row>
                    <br></br>
                </Container> )
            }
        </Container>
    )
}