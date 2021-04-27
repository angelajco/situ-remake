import Head from 'next/head'
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { Form, Button, OverlayTrigger, Tooltip, Card, Accordion, Collapse, Table } from 'react-bootstrap'
import { DragDropContext, Droppable, Draggable, resetServerContext } from 'react-beautiful-dnd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faCheck, faAngleDown, faCaretLeft } from '@fortawesome/free-solid-svg-icons'

import ContenedorMapaAnalisis from '../../components/ContenedorMapaAnalisis'

import catalogoEntidades from "../../shared/jsons/entidades.json";

import $ from 'jquery'

//Obten referencia del mapa
var referenciaMapa = null;
function capturaReferenciaMapa(mapa) {
    referenciaMapa = mapa;
}

export default function AnalisisGeograficoCopy() {
    useEffect(() => {
        fetch(`${process.env.ruta}/wa0/lista_capas01`)
            .then(res => res.json())
            .then(
                (data) => construyeCatalogo(data),
                (error) => console.log(error)
            )
    }, [])

    //Para guardar los rasgos
    const [rasgos, setRasgos] = useState([])
    const [rasgosEspejo, setRasgosEspejo] = useState([])

    //Acciones del formulario
    const { register, handleSubmit } = useForm();
    const { register: register1, handleSubmit: handleSubmit1 } = useForm();

    //Para guardar la columna de la capa espejo
    const [dobleMapa, setDobleMapa] = useState("col-12")
    const [pantallaDividida, setPantallaDividida] = useState(false);
    const [dobleMapaVista, setDobleMapaVista] = useState("col-6")

    function dividirPantalla() {
        if (pantallaDividida == true) {
            setPantallaDividida(false);
            setDobleMapa("col-12");
            setDobleMapaVista("col-6");
        } else {
            setPantallaDividida(true)
            setDobleMapa("col-6");
            setDobleMapaVista("col-12");
        }
    }

    //Nombres para mapas
    //Mapa original
    const [nombreMapa, setNombreMapa] = useState("Titulo mapa")
    const [muestraEditarNombreMapa, setmuestraEditarNombreMapa] = useState(true)
    //Mapa espejo
    const [nombreMapaEspejo, setNombreMapaEspejo] = useState("Titulo mapa")
    const [muestraEditarNombreMapaEspejo, setmuestraEditarNombreMapaEspejo] = useState(true)

    function cambiaNombreMapa(e, mapa) {
        if (mapa == 0) {
            setNombreMapa(e.target.value)
        } else if (mapa == 1) {
            setNombreMapaEspejo(e.target.value)
        }

    }

    //Para guardar los datos de las capas del BackEnd
    const [datosCapasBackEnd, setDatosCapasBackEnd] = useState([])
    function construyeCatalogo(capasBackEnd) {
        //Para guardar la información de las capas que viene desde el backend, sirve como arreglo temporal
        let catalogoCapas = [];
        //Para guardar las capas que sean de entidades
        let capaEstatal = null;
        capasBackEnd["catalogo"].map(value => {
            // Si el valor es igual a la capa de entidades
            if (value.titulo == "Limite Municipal") {
                capaEstatal = value;
                return;
            }
        })
        if (capaEstatal != null) {
            for (let i = 0; i < 32; i++) {
                let capa = {};
                capa.titulo = "Municipios de " + catalogoEntidades[i].entidad;
                capa.url = capaEstatal.url;
                capa.capa = capaEstatal.capa;
                capa.filtro_entidad = capaEstatal.filtro_entidad;
                capa.tipo = "filtrada";
                capa.valor_filtro = catalogoEntidades[i].id;
                capa.wfs = capaEstatal.wfs;
                capa.wms = capaEstatal.wms;
                capa.indice = catalogoCapas.length;
                catalogoCapas.push(capa);
            }
        }
        //Se recorre otra vez el arreglo de capas de back end para ahora agregar todas las capas Wms
        capasBackEnd["catalogo"].map(value => {
            if (value.titulo != "Limite Municipal") {
                value.tipo = "mosaico"
                value.indice = catalogoCapas.length;
                catalogoCapas.push(value)
            }
        })
        //Se agrega a datos capas que es el arreglo que se va a recorrer para mostrar en el input
        setDatosCapasBackEnd(catalogoCapas);
    }

    //Al seleccionar y añadir una entidad para el mapa original
    //Para guardar las capas que se van a mostrar

    const estilos = {
        color: "#FF0000",
        fillColor: "#FF7777",
        opacity: "1",
        fillOpacity: "1"
    }

    const [capasVisualizadas, setCapasVisualizadas] = useState([])
    const onSubmit = (data) => {
        let indice = parseInt(data.capaMapa)
        let capa = datosCapasBackEnd[indice]
        if (capasVisualizadas.some(capaVisual => capaVisual.num_capa === capa.indice)) {
            return;
        }
        else {
            if (capa.tipo == "filtrada") {
                const owsrootUrl = capa.url;
                const defaultParameters1 = {
                    service: 'WFS',
                    version: '2.0',
                    request: 'GetFeature',
                    //sedatu:
                    typeName: capa.capa,
                    outputFormat: 'text/javascript',
                    format_options: 'callback:getJson',
                    cql_filter: capa.filtro_entidad + "=" + "'" + capa.valor_filtro + "'"
                };
                var parameters1 = L.Util.extend(defaultParameters1);
                var url = owsrootUrl + L.Util.getParamString(parameters1);
                //Hace la petición para traer los datos de la entidad
                $.ajax({
                    jsonpCallback: 'getJson',
                    url: url,
                    dataType: 'jsonp',
                    success: function (response) {
                        response["num_capa"] = capa.indice;
                        response["nom_capa"] = capa.titulo;
                        response["habilitado"] = true;
                        response['tipo'] = "geojson";
                        response['estilos'] = { 'transparencia': 1 };
                        let layer = L.geoJSON(response, {
                            style: estilos,
                            onEachFeature: function (feature = {}, layer) {
                                layer.on('click', function () {
                                    setRasgos([feature.properties])
                                })
                            }
                        });
                        response['layer'] = layer;
                        setCapasVisualizadas([...capasVisualizadas, response])
                        referenciaMapa.addLayer(response.layer)
                    }
                });
            } else {
                const capaWMS = {};
                //Se guardan los datos de la capa
                capaWMS["attribution"] = "No disponible"
                capaWMS["url"] = capa.url
                capaWMS["layers"] = capa.capa
                capaWMS["format"] = "image/png"
                capaWMS["transparent"] = "true"
                capaWMS["tipo"] = "wms"
                capaWMS["nom_capa"] = capa.titulo;
                capaWMS["num_capa"] = capa.indice;
                capaWMS["habilitado"] = true;
                capaWMS["estilos"] = { 'transparencia': 1 };
                capaWMS["zoomMinimo"] = 5;
                capaWMS["zoomMaximo"] = 18;
                capaWMS["simbologia"] = capa.leyenda;

                let layer = L.tileLayer.wms(capaWMS.url, {
                    layers: capaWMS.layers,
                    format: capaWMS.format,
                    transparent: capaWMS.transparent,
                    attribution: capaWMS.attribution,
                    opacity: capaWMS.estilos.transparencia,
                    minZoom: capaWMS.zoomMinimo,
                    maxZoom: capaWMS.zoomMaximo,
                })
                capaWMS["layer"] = layer;
                setCapasVisualizadas([...capasVisualizadas, capaWMS])
                referenciaMapa.addLayer(capaWMS.layer)
            }
        }
    }

    //Al seleccionar y añadir una entidad para el mapa espejo
    const [capasVisualizadasEspejo, setCapasVisualizadasEspejo] = useState([])
    const onSubmitEspejo = (data) => {
        let indice = parseInt(data.capaEspejo)
        let capa = datosCapasBackEnd[indice]
        if (capasVisualizadasEspejo.some(capaVisual => capaVisual.num_capa === capa.indice)) {
            return;
        } else {
            if (capa.tipo == "filtrada") {
                const owsrootUrl = capa.url;
                const defaultParameters1 = {
                    service: 'WFS',
                    version: '2.0',
                    request: 'GetFeature',
                    //sedatu:
                    typeName: capa.capa,
                    outputFormat: 'text/javascript',
                    format_options: 'callback:getJson',
                    cql_filter: capa.filtro_entidad + "=" + "'" + capa.valor_filtro + "'"
                };
                var parameters1 = L.Util.extend(defaultParameters1);
                var url = owsrootUrl + L.Util.getParamString(parameters1);
                //Hace la petición para traer los datos de la entidad
                $.ajax({
                    jsonpCallback: 'getJson',
                    url: url,
                    dataType: 'jsonp',
                    success: function (response) {
                        response["num_capa"] = capa.indice;
                        response["nom_capa"] = capa.titulo;
                        response["habilitado"] = true;
                        response['tipo'] = "geojson";
                        response['estilos'] = { 'transparencia': 1 };
                        let layer = L.geoJSON(response, {
                            style: estilos,
                            onEachFeature: function (feature = {}, layer) {
                                layer.on('click', function () {
                                    setRasgosEspejo([feature.properties])
                                })
                            }
                        });
                        response['layer'] = layer;
                        setCapasVisualizadasEspejo([...capasVisualizadasEspejo, response])
                        referenciaMapa.addLayer(response.layer)
                    }
                });
            } else {
                const capaWMS = {};
                //Se guardan los datos de la capa
                capaWMS["attribution"] = "No disponible"
                capaWMS["url"] = capa.url
                capaWMS["layers"] = capa.capa
                capaWMS["format"] = "image/png"
                capaWMS["transparent"] = "true"
                capaWMS["tipo"] = "wms"
                capaWMS["nom_capa"] = capa.titulo;
                capaWMS["num_capa"] = capa.indice;
                capaWMS["habilitado"] = true;
                capaWMS["estilos"] = { 'transparencia': 1 };
                capaWMS["zoomMinimo"] = 5;
                capaWMS["zoomMaximo"] = 18;
                capaWMS["simbologia"] = capa.leyenda;
                let layer = L.tileLayer.wms(capaWMS.url, {
                    layers: capaWMS.layers,
                    format: capaWMS.format,
                    transparent: capaWMS.transparent,
                    attribution: capaWMS.attribution,
                    opacity: capaWMS.estilos.transparencia,
                    minZoom: capaWMS.zoomMinimo,
                    maxZoom: capaWMS.zoomMaximo,
                })
                capaWMS["layer"] = layer;

                setCapasVisualizadasEspejo([...capasVisualizadasEspejo, capaWMS])
                referenciaMapa.addLayer(capaWMS.layer)
            }
        }
    }

    //Funcion para cambiar el estado del checkbox
    const cambiaCheckbox = ({ target }, mapa) => {
        let mapaBase;
        if (mapa == 0) {
            mapaBase = capasVisualizadas;
        } else if (mapa == 1) {
            mapaBase = capasVisualizadasEspejo;
        }
        //Hace copia a otro arreglo para volver a sobreescribir capasVisualizadas
        let capasVisualisadasActualizado = mapaBase.map((valor) => {
            //Si es igual a la entidad que se envia, se cambia el checkbox
            if (valor.num_capa == target.value) {
                //Si esta habilitado se desabilita, de manera igual en caso contrario
                if (valor.habilitado) {
                    valor.habilitado = false;
                    referenciaMapa.removeLayer(valor.layer);
                    return valor;
                }
                else {
                    valor.habilitado = true;
                    referenciaMapa.addLayer(valor.layer)
                    return valor;
                }
            }
            //Si no es igual a la entidad que se envia, se envia con los mismos valores
            else {
                return valor;
            }
        });
        if (mapa == 0) {
            setCapasVisualizadas(capasVisualisadasActualizado);
        } else if (mapa == 1) {
            setCapasVisualizadasEspejo(capasVisualisadasActualizado);
        }
    }

    //Cambia la transparencia de las capas
    const transparenciaCapas = ({ target }, mapa) => {
        let mapaBase;
        if (mapa == 0) {
            mapaBase = capasVisualizadas;
        } else if (mapa == 1) {
            mapaBase = capasVisualizadasEspejo;
        }
        //Hace copia a otro arreglo para volver a sobreescribir capasVisualizadas
        let capasVisualisadasActualizado = mapaBase.map((valor) => {
            //Si es igual a la entidad que se envia, se cambia la transparencia
            if (valor.num_capa == target.name) {
                valor.estilos.transparencia = target.value;
                if (valor.tipo == "geojson") {
                    valor.layer.setStyle({ opacity: valor.estilos.transparencia, fillOpacity: valor.estilos.transparencia })
                }
                else if (valor.tipo == "wms") {
                    valor.layer.setOpacity(valor.estilos.transparencia)
                }
                return valor;
            }
            // Si no es igual a la entidad que se envia, se envia con los mismos valores
            else {
                return valor;
            }
        });
        if (mapa == 0) {
            setCapasVisualizadas(capasVisualisadasActualizado);
        } else if (mapa == 1) {
            setCapasVisualizadasEspejo(capasVisualisadasActualizado);
        }
    }

    //Cambia la escala de la visualización de las capas
    const zoomMinMax = ({ target }, mapa) => {
        let mapaBase;
        if (mapa == 0) {
            mapaBase = capasVisualizadas;
        } else if (mapa == 1) {
            mapaBase = capasVisualizadasEspejo;
        }
        let capasVisualisadasActualizado = mapaBase.map((valor) => {
            //Si es igual a la entidad que se envia, se cambia el zoom
            if (valor.num_capa == target.name) {
                if (target.dataset.zoom == "min") {
                    valor.zoomMinimo = target.value
                    valor.layer.options.minZoom = valor.zoomMinimo;
                } else if (target.dataset.zoom == "max") {
                    valor.zoomMaximo = target.value
                    valor.layer.options.maxZoom = valor.zoomMaximo;
                }
                referenciaMapa.removeLayer(valor.layer)
                referenciaMapa.addLayer(valor.layer)
                return valor;
            }
            // Si no es igual a la entidad que se envia, se envia con los mismos valores
            else {
                return valor;
            }
        });
        if (mapa == 0) {
            setCapasVisualizadas(capasVisualisadasActualizado);
        } else if (mapa == 1) {
            setCapasVisualizadasEspejo(capasVisualisadasActualizado)
        }
    }

    //Cuando se renderiza el lado del servidor (SSR). Garantiza que el estado del contexto no persista en varias representaciones en el servidor, lo que provocaría discrepancias en las marcas de cliente / servidor después de que se presenten varias solicitudes en el servidor
    resetServerContext();
    //Funcion para ordenar los nuevos datos
    function handleOnDragEnd(result) {
        // Si el destino existe, esto es para evitar cuando se arrastra fuera del contenedor
        if (!result.destination) {
            return
        }
        // Se crea una copia de capasVisualizadas
        let items = Array.from(capasVisualizadas)
        // Lo eliminamos de acuerdo al index que le pasa
        let [reorderedItem] = items.splice(result.source.index, 1)
        // Se usa destination.index para agregar ese valor a su nuevo destino
        items.splice(result.destination.index, 0, reorderedItem)
        // Actualizamos datos entidades
        setCapasVisualizadas(items)
    }

    function handleOnDragEndEspejo(result) {
        if (!result.destination) {
            return
        }
        let items = Array.from(capasVisualizadasEspejo)
        let [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)
        setCapasVisualizadasEspejo(items)
    }

    //Para mostrar menu lateral de mapas
    const [menuLateral, setMenuLateral] = useState(false);
    const [menuLateralEspejo, setMenuLateralEspejo] = useState(false);

    //Para mostrar collapse de mapas
    const [openCapasCollapse, setOpenCapasCollapse] = useState(true);
    const [openCapasCollapseEspejo, setOpenCapasCollapseEspejo] = useState(true);
    const [openRasgosCollapse, setOpenRasgosCollapse] = useState(true);
    const [openRasgosCollapseEspejo, setOpenRasgosCollapseEspejo] = useState(true);

    return (
        <>
            <div className="main tw-mb-12">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <button className="btn-analisis" onClick={dividirPantalla}>Pantalla dividida</button>
                        </div>

                        <div className={dobleMapa}>
                            <div className="row">
                                <div className="col-12 tw-text-center">
                                    <p>
                                        {nombreMapa}
                                        <OverlayTrigger overlay={<Tooltip>Editar nombre</Tooltip>}>
                                            <FontAwesomeIcon className="tw-ml-4 tw-cursor-pointer" onClick={() => setmuestraEditarNombreMapa(false)} icon={faEdit} />
                                        </OverlayTrigger>
                                    </p>
                                    <input type="text" hidden={muestraEditarNombreMapa} onChange={(event) => cambiaNombreMapa(event, 0)} value={nombreMapa}></input>
                                    <OverlayTrigger overlay={<Tooltip>Finalizar edición</Tooltip>}>
                                        <FontAwesomeIcon className="tw-ml-4 tw-cursor-pointer" hidden={muestraEditarNombreMapa} onClick={() => setmuestraEditarNombreMapa(true)} icon={faCheck}></FontAwesomeIcon>
                                    </OverlayTrigger>
                                </div>

                                <div className={dobleMapaVista}>
                                    <p>Capas</p>
                                    <Form onSubmit={handleSubmit(onSubmit)}>
                                        <Form.Group className="tw-inline-flex tw-mr-4" controlId="capaMapa">
                                            <Form.Control className=" " as="select" name="capaMapa" required ref={register}>
                                                <option value=""></option>
                                                {
                                                    datosCapasBackEnd.map((value, index) => {
                                                        return (
                                                            <option key={index} value={value.indice}>{value.titulo}</option>
                                                        )
                                                    })
                                                }
                                            </Form.Control>
                                        </Form.Group>
                                        <button className="btn-analisis tw-inline-flex" type="submit">AGREGAR
                                        </button>
                                    </Form>
                                </div>

                                <div className="col-12 tw-mt-8">
                                    <div className="contenedor-menu-lateral">
                                        <div className={menuLateral ? "tw-w-96 menu-lateral" : "tw-w-0 menu-lateral"}>
                                            <Card>
                                                <Card.Header>
                                                    <Button onClick={() => setOpenRasgosCollapse(!openRasgosCollapse)} variant="link">
                                                        <FontAwesomeIcon icon={faAngleDown} />
                                                    </Button>
                                                    <b>Información de rasgos</b>
                                                </Card.Header>
                                            </Card>
                                            {rasgos &&
                                                rasgos.map((valor, index) => (
                                                    <Collapse in={openRasgosCollapse} key={index}>
                                                        <Table striped bordered hover>
                                                            <thead>
                                                                <tr>
                                                                    <th colSpan="2" className="tw-text-center">Información de rasgos</th>
                                                                </tr>
                                                                <tr>
                                                                    <th>Valor</th>
                                                                    <th>Descripción</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    Object.keys(valor).map((key, indexKey) => (
                                                                        <tr>
                                                                            <td key={indexKey}>{key}</td>
                                                                            <td>{valor[key]}</td>
                                                                        </tr>
                                                                    ))
                                                                }
                                                            </tbody>
                                                        </Table>
                                                    </Collapse>
                                                ))
                                            }
                                            <Card>
                                                <Card.Header>
                                                    <Button onClick={() => setOpenCapasCollapse(!openCapasCollapse)} variant="link">
                                                        <FontAwesomeIcon icon={faAngleDown} />
                                                    </Button>
                                                    <b>Capas</b>
                                                </Card.Header>
                                            </Card>
                                            <Collapse in={openCapasCollapse}>
                                                <Accordion>
                                                    {/* onDragEnd se ejecuta cuando alguien deje de arrastrar un elemento */}
                                                    <DragDropContext onDragEnd={handleOnDragEnd}>
                                                        <Droppable droppableId="capas">
                                                            {(provided) => (
                                                                // La referencia es para acceder al elemento html, droppableProps permite realizar un seguimiento de los cambios
                                                                <div {...provided.droppableProps} ref={provided.innerRef}> {
                                                                    capasVisualizadas.map((capa, index) => (
                                                                        <Draggable key={capa.num_capa} draggableId={capa.nom_capa} index={index}>
                                                                            {(provided) => (
                                                                                <Card {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                                                    <Card.Header>
                                                                                        <Accordion.Toggle as={Button} variant="link" eventKey={capa.num_capa.toString()}>
                                                                                            <FontAwesomeIcon icon={faAngleDown} />
                                                                                        </Accordion.Toggle>
                                                                                        <Form.Group className="tw-inline-block">
                                                                                            <Form.Check type="checkbox" defaultChecked={capa.habilitado} label={capa.nom_capa} onChange={(event) => cambiaCheckbox(event, 0)} value={capa.num_capa} />
                                                                                        </Form.Group>
                                                                                    </Card.Header>
                                                                                    <Accordion.Collapse eventKey={capa.num_capa.toString()}>
                                                                                        <Card.Body>
                                                                                            <Form.Group>
                                                                                                <Form.Label>Transparencia</Form.Label>
                                                                                                <div className="tw-flex">
                                                                                                    <span className="tw-mr-6">+</span>
                                                                                                    <Form.Control custom type="range" min="0" step="0.1" max="1" defaultValue="1" name={capa.num_capa} onChange={(event) => transparenciaCapas(event, 0)} />
                                                                                                    <span className="tw-ml-6">-</span>
                                                                                                </div>
                                                                                            </Form.Group>
                                                                                            {capa.tipo == "wms" &&
                                                                                                (
                                                                                                    <div className="row">
                                                                                                        <Form.Group className="col-6">
                                                                                                            <Form.Label>Zoom mínimo</Form.Label>
                                                                                                            <Form.Control defaultValue="0" as="select" onChange={(event) => zoomMinMax(event, 0)} name={capa.num_capa} data-zoom="min">
                                                                                                                <option value="5">5</option>
                                                                                                                <option value="6">6</option>
                                                                                                                <option value="7">7</option>
                                                                                                                <option value="8">8</option>
                                                                                                                <option value="9">9</option>
                                                                                                                <option value="10">10</option>
                                                                                                                <option value="11">11</option>
                                                                                                                <option value="12">12</option>
                                                                                                                <option value="13">13</option>
                                                                                                                <option value="14">14</option>
                                                                                                                <option value="15">15</option>
                                                                                                                <option value="16">16</option>
                                                                                                                <option value="17">17</option>
                                                                                                                <option value="18">18</option>
                                                                                                            </Form.Control>
                                                                                                        </Form.Group>
                                                                                                        <Form.Group className="col-6">
                                                                                                            <Form.Label>Zoom máximo</Form.Label>
                                                                                                            <Form.Control defaultValue="18" as="select" onChange={(event) => zoomMinMax(event, 0)} name={capa.num_capa} data-zoom="max">
                                                                                                                <option value="5">5</option>
                                                                                                                <option value="6">6</option>
                                                                                                                <option value="7">7</option>
                                                                                                                <option value="8">8</option>
                                                                                                                <option value="9">9</option>
                                                                                                                <option value="10">10</option>
                                                                                                                <option value="11">11</option>
                                                                                                                <option value="12">12</option>
                                                                                                                <option value="13">13</option>
                                                                                                                <option value="14">14</option>
                                                                                                                <option value="15">15</option>
                                                                                                                <option value="16">16</option>
                                                                                                                <option value="17">17</option>
                                                                                                                <option value="18">18</option>
                                                                                                            </Form.Control>
                                                                                                        </Form.Group>
                                                                                                    </div>
                                                                                                )}
                                                                                        </Card.Body>
                                                                                    </Accordion.Collapse>
                                                                                </Card>
                                                                            )}
                                                                        </Draggable>
                                                                    ))
                                                                }
                                                                    {/* Se usa para llenar el espacio que ocupaba el elemento que estamos arrastrando */}
                                                                    {provided.placeholder}
                                                                </div>
                                                            )}
                                                        </Droppable>
                                                    </DragDropContext>
                                                </Accordion>
                                            </Collapse>
                                        </div>
                                        <button className="btn btn-light boton-menu-lateral" onClick={() => setMenuLateral(!menuLateral)}>
                                            <FontAwesomeIcon className="tw-cursor-pointer" icon={faCaretLeft} />
                                        </button>
                                    </div>
                                    <ContenedorMapaAnalisis referencia={capturaReferenciaMapa} botones={true} datos={capasVisualizadas} />
                                </div>
                            </div>
                        </div>


                        {
                            pantallaDividida &&
                            <div className="col-6">
                                <div className="row">
                                    <div className="col-12 tw-text-center">
                                        <p>
                                            {nombreMapaEspejo}
                                            <OverlayTrigger overlay={<Tooltip>Editar nombre</Tooltip>}>
                                                <FontAwesomeIcon className="tw-ml-4 tw-cursor-pointer" onClick={() => setmuestraEditarNombreMapaEspejo(false)} icon={faEdit}></FontAwesomeIcon>
                                            </OverlayTrigger>
                                        </p>
                                        <input type="text" hidden={muestraEditarNombreMapaEspejo} onChange={(event) => cambiaNombreMapa(event, 1)} value={nombreMapaEspejo}></input>
                                        <OverlayTrigger overlay={<Tooltip>Finalizar edición</Tooltip>}>
                                            <FontAwesomeIcon className="tw-ml-4 tw-cursor-pointer" hidden={muestraEditarNombreMapaEspejo} onClick={() => setmuestraEditarNombreMapaEspejo(true)} icon={faCheck}></FontAwesomeIcon>
                                        </OverlayTrigger>
                                    </div>

                                    <div className={dobleMapaVista}>
                                        <p>Capas</p>
                                        <Form onSubmit={handleSubmit1(onSubmitEspejo)}>
                                            <Form.Group className="tw-inline-flex tw-mr-4" controlId="capaEspejo">
                                                <Form.Control as="select" name="capaEspejo" required ref={register1}>
                                                    <option value=""></option>
                                                    {
                                                        datosCapasBackEnd.map((value, index) => {
                                                            return (
                                                                <option key={index} value={value.indice}>{value.titulo}</option>
                                                            )
                                                        })
                                                    }
                                                </Form.Control>
                                            </Form.Group>
                                            <button className="btn-analisis tw-inline-flex" type="submit">AGREGAR</button>
                                        </Form>
                                    </div>

                                    <div className="col-12 tw-mt-8">
                                        <div className="contenedor-menu-lateral">
                                            <div className={menuLateralEspejo ? "tw-w-96 menu-lateral" : "tw-w-0 menu-lateral"}>
                                                <Card>
                                                    <Card.Header>
                                                        <Button onClick={() => setOpenRasgosCollapseEspejo(!openRasgosCollapseEspejo)} variant="link">
                                                            <FontAwesomeIcon icon={faAngleDown} />
                                                        </Button>
                                                        <b>Información de rasgos</b>
                                                    </Card.Header>
                                                </Card>
                                                {rasgosEspejo &&
                                                    rasgosEspejo.map((valor, index) => (
                                                        <Collapse in={openRasgosCollapseEspejo} key={index}>
                                                            <Table striped bordered hover>
                                                                <thead>
                                                                    <tr>
                                                                        <th colSpan="2" className="tw-text-center">Información de rasgos</th>
                                                                    </tr>
                                                                    <tr>
                                                                        <th>Valor</th>
                                                                        <th>Descripción</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        Object.keys(valor).map((key, indexKey) => (
                                                                            <tr>
                                                                                <td key={indexKey}>{key}</td>
                                                                                <td>{valor[key]}</td>
                                                                            </tr>
                                                                        ))
                                                                    }
                                                                </tbody>
                                                            </Table>
                                                        </Collapse>
                                                    ))
                                                }
                                                <Card>
                                                    <Card.Header>
                                                        <Button onClick={() => setOpenCapasCollapseEspejo(!openCapasCollapseEspejo)} variant="link">
                                                            <FontAwesomeIcon icon={faAngleDown} />
                                                        </Button>
                                                        <b>Capas</b>
                                                    </Card.Header>
                                                </Card>
                                                {/* onDragEnd se ejecuta cuando alguien deje de arrastrar un elemento */}
                                                <Collapse in={openCapasCollapseEspejo}>
                                                    <Accordion>
                                                        <DragDropContext onDragEnd={handleOnDragEndEspejo}>
                                                            <Droppable droppableId="capas-espejo">
                                                                {(provided) => (
                                                                    // La referencia es para acceder al elemento html, droppableProps permite realizar un seguimiento de los cambios
                                                                    <div {...provided.droppableProps} ref={provided.innerRef}> {
                                                                        capasVisualizadasEspejo.map((capa, index) => (
                                                                            <Draggable key={capa.num_capa} draggableId={capa.nom_capa} index={index}>
                                                                                {(provided) => (
                                                                                    <Card {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                                                        <Card.Header>
                                                                                            <Accordion.Toggle as={Button} variant="link" eventKey={capa.num_capa.toString()}>
                                                                                                <FontAwesomeIcon icon={faAngleDown} />
                                                                                            </Accordion.Toggle>
                                                                                            <Form.Group className="tw-inline-block">
                                                                                                <Form.Check type="checkbox" defaultChecked={capa.habilitado} label={capa.nom_capa} onChange={(event) => cambiaCheckbox(event, 1)} value={capa.num_capa} />
                                                                                            </Form.Group>
                                                                                        </Card.Header>
                                                                                        <Accordion.Collapse eventKey={capa.num_capa.toString()}>
                                                                                            <Card.Body>
                                                                                                <Form.Group>
                                                                                                    <Form.Label>Transparencia</Form.Label>
                                                                                                    <div className="tw-flex">
                                                                                                        <span className="tw-mr-6">+</span>
                                                                                                        <Form.Control custom type="range" min="0" step="0.1" max="1" defaultValue="1" name={capa.num_capa} onChange={(event) => transparenciaCapas(event, 1)} />
                                                                                                        <span className="tw-ml-6">-</span>
                                                                                                    </div>
                                                                                                </Form.Group>
                                                                                                {capa.tipo == "wms" &&
                                                                                                    (
                                                                                                        <div className="row">
                                                                                                            <Form.Group className="col-6">
                                                                                                                <Form.Label>Zoom mínimo</Form.Label>
                                                                                                                <Form.Control defaultValue="0" as="select" onChange={(event) => zoomMinMax(event, 1)} name={capa.num_capa} data-zoom="min">
                                                                                                                    <option value="5">5</option>
                                                                                                                    <option value="6">6</option>
                                                                                                                    <option value="7">7</option>
                                                                                                                    <option value="8">8</option>
                                                                                                                    <option value="9">9</option>
                                                                                                                    <option value="10">10</option>
                                                                                                                    <option value="11">11</option>
                                                                                                                    <option value="12">12</option>
                                                                                                                    <option value="13">13</option>
                                                                                                                    <option value="14">14</option>
                                                                                                                    <option value="15">15</option>
                                                                                                                    <option value="16">16</option>
                                                                                                                    <option value="17">17</option>
                                                                                                                    <option value="18">18</option>
                                                                                                                </Form.Control>
                                                                                                            </Form.Group>
                                                                                                            <Form.Group className="col-6">
                                                                                                                <Form.Label>Zoom máximo</Form.Label>
                                                                                                                <Form.Control defaultValue="18" as="select" onChange={(event) => zoomMinMax(event, 1)} name={capa.num_capa} data-zoom="max">
                                                                                                                    <option value="5">5</option>
                                                                                                                    <option value="6">6</option>
                                                                                                                    <option value="7">7</option>
                                                                                                                    <option value="8">8</option>
                                                                                                                    <option value="9">9</option>
                                                                                                                    <option value="10">10</option>
                                                                                                                    <option value="11">11</option>
                                                                                                                    <option value="12">12</option>
                                                                                                                    <option value="13">13</option>
                                                                                                                    <option value="14">14</option>
                                                                                                                    <option value="15">15</option>
                                                                                                                    <option value="16">16</option>
                                                                                                                    <option value="17">17</option>
                                                                                                                    <option value="18">18</option>
                                                                                                                </Form.Control>
                                                                                                            </Form.Group>
                                                                                                        </div>
                                                                                                    )}
                                                                                            </Card.Body>
                                                                                        </Accordion.Collapse>
                                                                                    </Card>
                                                                                )}
                                                                            </Draggable>
                                                                        ))
                                                                    }
                                                                        {/* Se usa para llenar el espacio que ocupaba el elemento que estamos arrastrando */}
                                                                        {provided.placeholder}
                                                                    </div>
                                                                )}
                                                            </Droppable>
                                                        </DragDropContext>
                                                    </Accordion>
                                                </Collapse>
                                            </div>
                                            <button className="btn btn-light boton-menu-lateral" onClick={() => setMenuLateralEspejo(!menuLateralEspejo)}>
                                                <FontAwesomeIcon className="tw-cursor-pointer" icon={faCaretLeft} />
                                            </button>
                                        </div>
                                        <ContenedorMapaAnalisis referencia={capturaReferenciaMapa} botones={false} datos={capasVisualizadasEspejo} />
                                    </div>
                                </div>
                            </div>
                        }



                    </div>
                </div>
            </div>
        </>
    )
}