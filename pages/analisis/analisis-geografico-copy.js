import { useEffect, useState, useMemo } from "react"
import { useForm } from "react-hook-form";
import { Form, Modal, Button, OverlayTrigger, Tooltip, Card, ListGroup } from 'react-bootstrap'
import { DragDropContext, Droppable, Draggable, resetServerContext } from 'react-beautiful-dnd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faCheck } from '@fortawesome/free-solid-svg-icons'

import ContenedorMapaAnalisis from '../../components/ContenedorMapaAnalisis'

import catalogoEntidades from "../../shared/jsons/entidades.json";

import $ from 'jquery'

var referenciaMapa = null;
var layerGroup = null;
//Obten referencia del mapa
function capturaReferenciaMapa(mapa) {
    referenciaMapa = mapa;
    layerGroup = new L.LayerGroup();
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

    //Acciones del formulario
    const { register, handleSubmit } = useForm();
    const { register: register1, handleSubmit: handleSubmit1 } = useForm();

    //Para guardar la columna de la capa espejo
    const [dobleMapa, setDobleMapa] = useState("col-12")
    const [pantallaDividida, setPantallaDividida] = useState(false);

    function dividirPantalla() {
        if (pantallaDividida == true) {
            setPantallaDividida(false);
            setDobleMapa("col-12");
        } else {
            setPantallaDividida(true)
            setDobleMapa("col-6");
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
        var catalogoCapas = [];
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
        fillColor: "#FF0000",
    }
    const [capasVisualizadas, setCapasVisualizadas] = useState([])
    const onSubmit = (data) => {
        let indice = parseInt(data.entidad)
        let capa = datosCapasBackEnd[indice]

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
                    if (capasVisualizadas.some(capaVisual => capaVisual.num_capa === capa.indice)) {
                        return;
                    }
                    else {
                        response["num_capa"] = capa.indice;
                        response["nom_capa"] = capa.titulo;
                        response["habilitado"] = true;
                        response['tipo'] = "geojson";
                        response['estilos'] = { 'transparencia': 1 };
                        setCapasVisualizadas([...capasVisualizadas, response])

                        let layer = L.geoJSON(response, { style: estilos });

                        layerGroup.addLayer(layer)
                        layerGroup.addTo(referenciaMapa);
                        console.log(layerGroup);
                    }
                }
            });
        }
        else {
            if (capasVisualizadas.some(capaVisual => capaVisual.num_capa === capa.indice)) {
                return;
            }
            else {
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
                capaWMS["zoomMinimo"] = 0;
                capaWMS["zoomMaximo"] = 18;
                capaWMS["leyenda"] = capa.leyenda;

                setCapasVisualizadas([...capasVisualizadas, capaWMS])
                let layer = L.tileLayer.wms(capaWMS.url, {
                    layers: capaWMS.layers,
                    format: capaWMS.format,
                    transparent: capaWMS.transparent,
                    attribution: capaWMS.attribution,
                })

                layerGroup.addLayer(layer)
                layerGroup.addTo(referenciaMapa);
                console.log(layerGroup);
            }
        }
    }

    //Al seleccionar y añadir una entidad para el mapa espejo
    const [capasVisualizadasEspejo, setCapasVisualizadasEspejo] = useState([])
    const onSubmitEspejo = (data) => {
        let indice = parseInt(data.entidad)
        let capa = datosCapasBackEnd[indice]

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
                jsonpCallback: 'getJSON',
                url: url,
                dataType: 'jsonp',
                success: function (response) {
                    if (capasVisualizadasEspejo.some(capaVisual => capaVisual.num_capa === capa.indice)) {
                        return;
                    }
                    else {
                        response["num_capa"] = capa.indice;
                        response["nom_capa"] = capa.titulo;
                        response["habilitado"] = true;
                        response['tipo'] = "geojson";
                        response['estilos'] = { 'transparencia': 1 };
                        setCapasVisualizadasEspejo([...capasVisualizadasEspejo, response])
                    }
                }
            });
        }
        else {
            if (capasVisualizadasEspejo.some(capaVisual => capaVisual.num_capa === capa.indice)) {
                return;
            }
            else {
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
                capaWMS["zoomMinimo"] = 0;
                capaWMS["zoomMaximo"] = 18;
                capaWMS["leyenda"] = capa.leyenda;
                setCapasVisualizadasEspejo([...capasVisualizadasEspejo, capaWMS])
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

                let layer = L.tileLayer.wms(valor.url, {
                    layers: valor.layers,
                    format: valor.format,
                    transparent: valor.transparent,
                    attribution: valor.attribution,
                })
                let func = layerGroup.hasLayer(layer);
                console.log(func);
                // referenciaMapa.removeLayer(layerGroup);

                // layer.clearLayers();

                //Si esta habilitado se desabilita, de manera igual en caso contrario
                if (valor.habilitado) {
                    valor.habilitado = false;
                    return valor;
                }
                else {
                    valor.habilitado = true;
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
    const [valorTransparencia, setValorTransparencia] = useState(1)
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
                valor.estilos.transparencia = target.value
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
                } else if (target.dataset.zoom == "max") {
                    valor.zoomMaximo = target.value
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

    return (
        <>
            <div className="main">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <button onClick={dividirPantalla}>Pantalla dividida</button>
                        </div>

                        <div className={dobleMapa}>
                            <div className="row">
                                <div className="col-12 tw-text-center">
                                    <p>
                                        {nombreMapa}
                                        <OverlayTrigger overlay={<Tooltip>Editar nombre</Tooltip>}>
                                            <FontAwesomeIcon className="tw-ml-4 tw-cursor-pointer" onClick={() => setmuestraEditarNombreMapa(false)} icon={faEdit}></FontAwesomeIcon>
                                        </OverlayTrigger>
                                    </p>
                                    <input type="text" hidden={muestraEditarNombreMapa} onChange={(event) => cambiaNombreMapa(event, 0)} value={nombreMapa}></input>
                                    <OverlayTrigger overlay={<Tooltip>Finalizar edición</Tooltip>}>
                                        <FontAwesomeIcon className="tw-ml-4 tw-cursor-pointer" hidden={muestraEditarNombreMapa} onClick={() => setmuestraEditarNombreMapa(true)} icon={faCheck}></FontAwesomeIcon>
                                    </OverlayTrigger>
                                </div>

                                <div className="col-12">
                                    <Form onSubmit={handleSubmit(onSubmit)}>
                                        <Form.Group controlId="entidad">
                                            <Form.Label className="tw-text-red-600">Capas</Form.Label>
                                            <Form.Control as="select" name="entidad" required ref={register}>
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
                                        <input type="submit" value="Agregar" />
                                    </Form>
                                </div>

                                <div className="col-12 tw-mt-8">
                                    <Card>
                                        <Card.Header>Capas</Card.Header>
                                        {/* onDragEnd se ejecuta cuando alguien deje de arrastrar un elemento */}
                                        <DragDropContext onDragEnd={handleOnDragEnd}>
                                            <Droppable droppableId="entidades">
                                                {(provided) => (
                                                    // La referencia es para acceder al elemento html, droppableProps permite realizar un seguimiento de los cambios
                                                    <ListGroup {...provided.droppableProps} ref={provided.innerRef}> {
                                                        capasVisualizadas.map((capa, index) => (
                                                            <Draggable key={capa.num_capa} draggableId={capa.nom_capa} index={index}>
                                                                {(provided) => (
                                                                    <>
                                                                        <ListGroup.Item {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                                            <div className="row">
                                                                                <Form.Group className="col-6">
                                                                                    <Form.Check type="checkbox" defaultChecked={capa.habilitado} label={capa.nom_capa} onChange={(event) => cambiaCheckbox(event, 0)} value={capa.num_capa} />
                                                                                </Form.Group>
                                                                                <Form.Group className="col-6">
                                                                                    <Form.Label>Transparencia</Form.Label>
                                                                                    <div className="tw-flex">
                                                                                        <span className="tw-mr-6">+</span>
                                                                                        <Form.Control custom type="range" min="0" step="0.1" max="1" defaultValue="1" name={capa.num_capa} onChange={(event) => transparenciaCapas(event, 0)} />
                                                                                        <span className="tw-ml-6">-</span>
                                                                                    </div>
                                                                                    {/* <Slider min={0} max={1} defaultValue={1} step={0.1} handle={handle} /> */}
                                                                                </Form.Group>
                                                                                {capa.tipo == "wms" &&
                                                                                    (
                                                                                        <>
                                                                                            <Form.Group className="col-6">
                                                                                                <Form.Label>Escala minima</Form.Label>
                                                                                                <Form.Control defaultValue="0" as="select" onChange={(event) => zoomMinMax(event, 0)} name={capa.num_capa} data-zoom="min">
                                                                                                    <option value="0">1:10000 KM</option>
                                                                                                    <option value="1">1:5000 KM</option>
                                                                                                    <option value="2">1:2000 KM</option>
                                                                                                    <option value="3">1:1000 KM</option>
                                                                                                    <option value="4">1:500 KM</option>
                                                                                                    <option value="5">1:300 KM</option>
                                                                                                    <option value="6">1:200 KM</option>
                                                                                                    <option value="7">1:100 KM</option>
                                                                                                    <option value="8">1:50 KM</option>
                                                                                                    <option value="9">1:20 KM</option>
                                                                                                    <option value="10">1:10 KM</option>
                                                                                                    <option value="11">1:5 KM</option>
                                                                                                    <option value="12">1:3 KM</option>
                                                                                                    <option value="13">1:1 KM</option>
                                                                                                    <option value="14">1:500 M</option>
                                                                                                    <option value="15">1:300 M</option>
                                                                                                    <option value="16">1:200 M</option>
                                                                                                    <option value="17">1:100 M</option>
                                                                                                    <option value="18">1:50 M</option>
                                                                                                </Form.Control>
                                                                                            </Form.Group>
                                                                                            <Form.Group className="col-6">
                                                                                                <Form.Label>Escala maxima</Form.Label>
                                                                                                <Form.Control defaultValue="18" as="select" onChange={(event) => zoomMinMax(event, 0)} name={capa.num_capa} data-zoom="max">
                                                                                                    <option value="0">1:10000 KM</option>
                                                                                                    <option value="1">1:5000 KM</option>
                                                                                                    <option value="2">1:2000 KM</option>
                                                                                                    <option value="3">1:1000 KM</option>
                                                                                                    <option value="4">1:500 KM</option>
                                                                                                    <option value="5">1:300 KM</option>
                                                                                                    <option value="6">1:200 KM</option>
                                                                                                    <option value="7">1:100 KM</option>
                                                                                                    <option value="8">1:50 KM</option>
                                                                                                    <option value="9">1:20 KM</option>
                                                                                                    <option value="10">1:10 KM</option>
                                                                                                    <option value="11">1:5 KM</option>
                                                                                                    <option value="12">1:3 KM</option>
                                                                                                    <option value="13">1:1 KM</option>
                                                                                                    <option value="14">1:500 M</option>
                                                                                                    <option value="15">1:300 M</option>
                                                                                                    <option value="16">1:200 M</option>
                                                                                                    <option value="17">1:100 M</option>
                                                                                                    <option value="18">1:50 M</option>
                                                                                                </Form.Control>
                                                                                            </Form.Group>
                                                                                        </>
                                                                                    )}
                                                                            </div>
                                                                        </ListGroup.Item>
                                                                    </>
                                                                )}
                                                            </Draggable>
                                                        ))
                                                    }
                                                        {/* Se usa para llenar el espacio que ocupaba el elemento que estamos arrastrando */}
                                                        {provided.placeholder}
                                                    </ListGroup>
                                                )}
                                            </Droppable>
                                        </DragDropContext>
                                    </Card>
                                </div>

                                <div className="col-12 tw-mt-8">
                                    <ContenedorMapaAnalisis referencia={capturaReferenciaMapa} />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}