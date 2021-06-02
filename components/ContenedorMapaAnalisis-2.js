import React, { useState, useEffect, useContext } from 'react';
import { useForm } from "react-hook-form";
import { Form, Button, OverlayTrigger, Tooltip, Card, Accordion, Collapse, Table, AccordionContext, useAccordionToggle, Modal, Tabs, Tab } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages, faAngleDown, faCaretLeft, faFileCsv, faAngleRight, faTrash, faTable, faDownload, faCaretRight, faUpload, faDotCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faWindowRestore } from '@fortawesome/free-regular-svg-icons';
import { DragDropContext, Droppable, Draggable as DraggableDnd, resetServerContext } from 'react-beautiful-dnd';
import { CSVLink } from "react-csv";
import { Typeahead } from 'react-bootstrap-typeahead';
import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware';

import $ from 'jquery';
import * as turf from '@turf/turf';
import Draggable from 'react-draggable';
import ModalDialog from 'react-bootstrap/ModalDialog';
import dynamic from 'next/dynamic';
import shpjs from 'shpjs';
import xml2js from 'xml2js'
import xpath from 'xml2js-xpath'

import 'react-bootstrap-typeahead/css/Typeahead.css';

import ModalComponent from './ModalComponent'
import catalogoEntidades from "../shared/jsons/entidades.json";

const Map = dynamic(
    () => import('./MapAnalisis'),
    {
        loading: () => <p>El mapa está cargando</p>,
        ssr: false
    }
)

const MapEspejo = dynamic(
    () => import('./MapAnalisisEspejo'),
    {
        loading: () => <p>El mapa está cargando</p>,
        ssr: false
    }
)

var referenciaMapa = null;

function ContenedorMapaAnalisis(props) {
    const [mainLayer, setMainLayer] = useState();
    useEffect(() => {
    }, [mainLayer]);

    //Obten referencia del mapa
    const [capturoReferenciaMapa, setCapturoReferenciaMapa] = useState(false)
    function capturaReferenciaMapa(mapa) {
        referenciaMapa = mapa;
        if (referenciaMapa != null) {
            setTimeout(() => {
                setCapturoReferenciaMapa(true);
            }, 300)
        }
    }

    const [arregloCapasBackEnd, setArregloCapasBackEnd] = useState([])
    const [arregloMetadatosCapasBackEnd, setArregloMetadatosCapasBackEnd] = useState([])

    useEffect(() => {
        //Datos para construir el catalogo
        fetch(`${process.env.ruta}/wa/publico/getCapas/`)
            .then(res => res.json())
            .then(
                (data) => {
                    construyeCatalogo(data)
                    setArregloCapasBackEnd(data)
                },
                (error) => console.log(error)
            )

        fetch(`${process.env.ruta}/wa/publico/getMetadatosCapas/`)
            .then(res => res.json())
            .then(
                (data) => {
                    setArregloMetadatosCapasBackEnd(data);
                },
                (error) => console.log(error)
            )

        fetch(`${process.env.ruta}/wa/publico/getMetadatosCapas/5`)
            .then(res => res.json())
            .then(
                (data) => console.log(data, "getMetadatosCapas"),
                (error) => console.log(error)
            )

    }, [])

    //Para guardar los datos de las capas del BackEnd
    const [datosCapasBackEnd, setDatosCapasBackEnd] = useState([])
    function construyeCatalogo(capasBackEnd) {
        //Para guardar la información de las capas que viene desde el backend, sirve como arreglo temporal
        let catalogoCapas = [];
        let otrasCapas = [];

        capasBackEnd.map(value => {
            if (value.titulo == "Limite Municipal") {
                for (let i = 0; i < 32; i++) {
                    let capa = {};
                    capa.titulo = "Municipios de " + catalogoEntidades[i].entidad;
                    capa.url = value.url;
                    capa.capa = value["nombre_capa"];
                    capa.filtro_entidad = value.filtro_entidad;
                    capa.valor_filtro = catalogoEntidades[i].id;
                    capa.wfs = value.wfs;
                    capa.wms = value.wms;
                    capa.indice = catalogoCapas.length;
                    capa.tipo = "filtrada"
                    catalogoCapas.push(capa);
                }
            } else {
                otrasCapas.push(value)
            }
        })

        otrasCapas.map(value => {
            value.indice = catalogoCapas.length;
            value.tipo = "mosaico";
            catalogoCapas.push(value)
        })
        setDatosCapasBackEnd(catalogoCapas);
    }

    useEffect(() => {
        if (capturoReferenciaMapa == true) {
            referenciaMapa.on('draw:created', function (e) {
                let layerDibujada = e.layer;
                let puntos = null;
                if (e.layerType !== 'polyline') {
                    if (e.layerType === "marker") {
                        puntos = layerDibujada.getLatLng();
                    } else {
                        puntos = layerDibujada.getLatLngs()
                    }
                }
                let capasIntersectadas = [];
                referenciaMapa.eachLayer(function (layer) {
                    if (e.layerType !== 'polyline') {
                        if (layer instanceof L.GeoJSON) {
                            layer.eachLayer(function (layerConFeatures) {
                                let seIntersectan = turf.intersect(layerConFeatures.toGeoJSON(), layerDibujada.toGeoJSON())
                                if (seIntersectan != null) {
                                    layerConFeatures.feature.properties["nombre_capa"] = layer.options["nombre"];
                                    capasIntersectadas.push(layerConFeatures.feature.properties)
                                }
                            })
                        }
                    }
                });
                if (capasIntersectadas.length != 0) {
                    setRasgos(capasIntersectadas);
                }
            });
        }
    }, [capturoReferenciaMapa])

    const creaSVG = (nombreCapa) => {
        var creaSVG = `<svg height='20' xmlns='http://www.w3.org/2000/svg'><rect x='0' y='0' width='15' height='15' fill='#FF7777' stroke='#FF0000' strokeWidth='2'></rect><text x='20' y='15' width='200' height='200' fontSize='12.5' fontWeight='500' font-family='Montserrat, sans-serif'>${nombreCapa}</text></svg>`
        var DOMURL = self.URL || self.webkitURL || self;
        var svg = new Blob([creaSVG], { type: "image/svg+xml;charset=utf-8" });
        var url = DOMURL.createObjectURL(svg);
        return url;
    }

    //Al seleccionar y añadir una entidad para los mapas
    //Para guardar las capas que se van a mostrar
    const [capasVisualizadas, setCapasVisualizadas] = useState([]);
    //Estilos de los geojson
    const estilos = {
        color: "#FF0000",
        fillColor: "#FF7777",
        opacity: "1",
        fillOpacity: "1"
    }
    //Para guardar los rasgos
    const [rasgos, setRasgos] = useState([])
    //Acciones del formulario
    const { register, handleSubmit, control, errors } = useForm();
    //Al seleccionar y añadir una entidad para los mapas
    const onSubmit = (data) => {
        let capa = data.capaAgregar[0];
        if (capasVisualizadas.some(capaVisual => capaVisual.num_capa === capa.indice)) {
            return;
        }
        else {
            if (capa.tipo == "mosaico") {
                let capaWMS = {};
                //Se guardan los datos de la capa
                capaWMS["attribution"] = "No disponible"
                capaWMS["url"] = capa.url
                capaWMS["layers"] = capa["nombre_capa"]
                capaWMS["format"] = capa.wms
                capaWMS["transparent"] = "true"
                capaWMS["tipo"] = "wms"
                capaWMS["nom_capa"] = capa.titulo;
                capaWMS["num_capa"] = capa.indice;
                capaWMS["habilitado"] = true;
                capaWMS["estilos"] = { 'transparencia': 1 };
                capaWMS["zoomMinimo"] = 5;
                capaWMS["zoomMaximo"] = 18;
                capaWMS['simbologia'] = capa["leyenda_simb"];

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
                var url = `https://ide.sedatu.gob.mx:8080/wfs?request=GetFeature&service=WFS&version=1.0.0&typeName=${capaWMS.layers}&outputFormat=`
                var download = [
                    { num_capa: capaWMS.num_capa, nom_capa: capaWMS.nom_capa, link: `${url}KML`, tipo: 'KML' },
                    { num_capa: capaWMS.num_capa, nom_capa: capaWMS.nom_capa, link: `https://ide.sedatu.gob.mx:8080/ows?service=WMS&request=GetMap&version=1.1.1&format=application/vnd.google-earth.kmz+XML&width=1024&height=1024&layers=${capaWMS.layers}&bbox=-180,-90,180,90`, tipo: 'KMZ' },
                    { num_capa: capaWMS.num_capa, nom_capa: capaWMS.nom_capa, link: `${url}SHAPE-ZIP`, tipo: 'SHAPE' }
                ];
                capaWMS.download = download;
                setCapasVisualizadas([...capasVisualizadas, capaWMS])
                referenciaMapa.addLayer(capaWMS.layer)
            } else if (capa.tipo == "filtrada") {
                const owsrootUrl = capa.url;
                const defaultParameters1 = {
                    service: 'WFS',
                    version: '2.0',
                    request: 'GetFeature',
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
                        var download = JSON.stringify(response)
                        // setGeoJsonFiles
                        response["num_capa"] = capa.indice;
                        response["nom_capa"] = capa.titulo;
                        response["habilitado"] = true;
                        response['tipo'] = "geojson";
                        response['estilos'] = { 'transparencia': 1 };
                        let layer = L.geoJSON(response, {
                            style: estilos,
                            nombre: response["nom_capa"],
                            onEachFeature: function (feature = {}, layerPadre) {
                                layerPadre.on('click', function () {
                                    feature.properties["nombre_capa"] = layerPadre.options["nombre"];
                                    setRasgos([feature.properties])
                                })
                            }
                        });
                        response['layer'] = layer;
                        response['simbologia'] = creaSVG(capa.titulo)
                        response.download = [{ num_capa: response.num_capa, nom_capa: response.nom_capa, link: download, tipo: 'GeoJSON' }];
                        response.cveEnt = capa.valor_filtro;
                        setCapasVisualizadas([...capasVisualizadas, response])
                        referenciaMapa.addLayer(response.layer)
                    }
                });
            }
        }
    }

    //Para agregar un servicio de otra identidad
    const [guardaServicio, setGuardaServicio] = useState([])
    const [avisoServicio, setAvisoServicio] = useState("")
    const { register: registraServicio, handleSubmit: handleAgregaServicio } = useForm();
    const agregaServicio = (data) => {
        setGuardaServicio([])
        setAvisoServicio("")
        // https://ide.sedatu.gob.mx:8080/ows?service=wms&version=1.1.1&request=GetCapabilities
        let req = new XMLHttpRequest();
        req.open("GET", `${data.urlServicio}?service=WMS&request=GetCapabilities`);
        req.send();
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    xml2js.parseString(req.response, (err, result) => {
                        if (err) {
                            setAvisoServicio("El servicio no está disponible o agrego una URL erronea, favor de verificar.")
                        } else {
                            let matches = xpath.find(result, "//Layer/Layer/@opaque");
                            if (matches.length != 0) {
                                // if (data.nombreServicio) {
                                //     let resultMatchName = matches.find(match => match.Title[0].toLowerCase() == data.nombreServicio.toLowerCase())
                                //     if (resultMatchName == undefined) {
                                //         setAvisoServicio("El título que está consultando, no existe en este servicio.")
                                //     } else {
                                //         setGuardaServicio([[resultMatchName], data.urlServicio]);
                                //     }
                                // }
                                // else {
                                // }
                                setGuardaServicio([matches, data.urlServicio]);
                                // setGuardaServicio(matches);
                            }
                            else {
                                setAvisoServicio("El servicio no está disponible o agrego una URL erronea, favor de verificar.")
                            }
                        }
                    })
                }
                else {
                    setAvisoServicio("El servicio no está disponible o agrego una URL erronea, favor de verificar.")
                }
            }
        }
    }

    const agregaCapaServicio = (capaServicio) => {
        let capaWMS = {};
        capaWMS["attribution"] = "No disponible"
        capaWMS["url"] = guardaServicio[1]
        capaWMS["layers"] = capaServicio[0].Name[0]
        capaWMS["format"] = "image/png"
        capaWMS["transparent"] = "true"
        capaWMS["tipo"] = "wms"
        capaWMS["nom_capa"] = capaServicio[0].Title[0];
        capaWMS["habilitado"] = true;
        capaWMS["estilos"] = { 'transparencia': 1 };
        capaWMS["zoomMinimo"] = 5;
        capaWMS["zoomMaximo"] = 18;
        capaWMS['simbologia'] = capaServicio[0].Style[0]["LegendURL"][0]["OnlineResource"][0]["$"]["xlink:href"];

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
        referenciaMapa.addLayer(capaWMS.layer)
        setCapasVisualizadas([...capasVisualizadas, capaWMS])
        setShowModalAgregarCapas(false);
        setGuardaServicio([])
        setAvisoServicio("")
    }

    //Para buscar los metadatos de la capa
    const { register: registraMetadatos, handleSubmit: handleSubmitMetadatos } = useForm();
    const [avisoBusquedaCapas, setAvisoBusquedaCapas] = useState("")
    const [capasBusqueda, setCapasBusqueda] = useState("")
    const buscaMetadatos = (data) => {
        setAvisoBusquedaCapas("")
        let capasId = [];
        let capasArr = [];
        if (data.titulo) {
            let tituloMet;
            tituloMet = arregloMetadatosCapasBackEnd.filter(metadato => metadato.titulo.toLowerCase() == data.titulo.toLowerCase()).map(metadato => metadato["id_capa"]);
            if (tituloMet.length != 0) {
                tituloMet.map(value => capasId.push(value))
            }
        }
        if (data.palabrasClave) {
            arregloMetadatosCapasBackEnd.map(value => {
                value["palabras_clave"].split(",").map(valueKey => {
                    if (valueKey.trim().toLowerCase() == data.palabrasClave.trim().toLowerCase()) {
                        capasId.push(value["id_capa"])
                    }
                })
            })
        }
        if (data.tema) {
            let temaMet;
            temaMet = arregloMetadatosCapasBackEnd.filter(metadato => metadato.tema.toLowerCase() == data.tema.toLowerCase()).map(metadato => metadato["id_capa"]);
            if (temaMet.length != 0) {
                temaMet.map(value => capasId.push(value))
            }
        }
        if (data.subtema) {
            let subtemaMet;
            subtemaMet = arregloMetadatosCapasBackEnd.filter(metadato => metadato.subtema.toLowerCase() == data.subtema.toLowerCase()).map(metadato => metadato["id_capa"]);
            if (subtemaMet.length != 0) {
                subtemaMet.map(value => capasId.push(value))
            }
        }

        if (capasId.length != 0) {
            let unique = [...new Set(capasId)]
            unique.map(value => {
                let capaBack = arregloCapasBackEnd.filter(capasBack => capasBack["id_capa"] == value)
                capasArr.push(...capaBack)
            })
            if (capasArr.lengt != 0) {
                setCapasBusqueda(capasArr)
            } else {
                setAvisoBusquedaCapas("No se encontraron capas con estos criterios")
            }
        } else {
            setAvisoBusquedaCapas("No se encontraron capas con estos criterios")
        }
    }

    const agregaCapaBusqueda = (capa) => {
        setShowModalAgregarCapas(false);
        let capaWMS = {};
        capaWMS["attribution"] = "No disponible"
        capaWMS["url"] = capa.url
        capaWMS["layers"] = capa["nombre_capa"]
        capaWMS["format"] = capa.wms
        capaWMS["transparent"] = "true"
        capaWMS["tipo"] = "wms"
        capaWMS["nom_capa"] = capa.titulo;
        capaWMS["habilitado"] = true;
        capaWMS["estilos"] = { 'transparencia': 1 };
        capaWMS["zoomMinimo"] = 5;
        capaWMS["zoomMaximo"] = 18;
        capaWMS['simbologia'] = capa["leyenda_simb"];

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
        var url = `https://ide.sedatu.gob.mx:8080/wfs?request=GetFeature&service=WFS&version=1.0.0&typeName=${capaWMS.layers}&outputFormat=`
        var download = [
            { nom_capa: capaWMS.nom_capa, link: `${url}KML`, tipo: 'KML' },
            { nom_capa: capaWMS.nom_capa, link: `https://ide.sedatu.gob.mx:8080/ows?service=WMS&request=GetMap&version=1.1.1&format=application/vnd.google-earth.kmz+XML&width=1024&height=1024&layers=${capaWMS.layers}&bbox=-180,-90,180,90`, tipo: 'KMZ' },
            { nom_capa: capaWMS.nom_capa, link: `${url}SHAPE-ZIP`, tipo: 'SHAPE' }
        ];
        capaWMS.download = download;
        setCapasVisualizadas([...capasVisualizadas, capaWMS])
        referenciaMapa.addLayer(capaWMS.layer)
    }


    //Para guardar los atributos
    const [atributos, setAtributos] = useState([]);
    //Para mostrar el modal de atributos
    const [showModalAtributos, setShowModalAtributos] = useState(false)
    //Para asignar atributos
    const muestraAtributos = (capa) => {
        setAtributos([capa.features, capa.nom_capa])
        setShowModalAtributos(true)
    }

    //Para eliminar capas
    const eliminaCapa = (capa) => {
        referenciaMapa.removeLayer(capa.layer)
        let arrTemp = capasVisualizadas.filter(capaArr => capaArr.nom_capa != capa.nom_capa)
        setCapasVisualizadas(arrTemp);
    }

    //Funcion para cambiar el estado del checkbox
    const cambiaCheckbox = ({ target }) => {
        //Hace copia a otro arreglo para volver a sobreescribir capasVisualizadas
        let capasVisualisadasActualizado = capasVisualizadas.map((valor) => {
            //Si es igual a la entidad que se envia, se cambia el checkbox
            if (valor.nom_capa == target.value) {
                //Si esta habilitado se desabilita, de manera igual en caso contrario
                if (valor.habilitado) {
                    valor.habilitado = false;
                    referenciaMapa.removeLayer(valor.layer);
                    return valor;
                } else {
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
        setCapasVisualizadas(capasVisualisadasActualizado);
    }

    //Cambia la transparencia de las capas
    const transparenciaCapas = ({ target }) => {
        //Hace copia a otro arreglo para volver a sobreescribir capasVisualizadas
        let capasVisualisadasActualizado = capasVisualizadas.map((valor) => {
            //Si es igual a la entidad que se envia, se cambia la transparencia
            if (valor.nom_capa == target.name) {
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
        setCapasVisualizadas(capasVisualisadasActualizado);
    }

    //Cambia la escala de la visualización de las capas
    const zoomMinMax = ({ target }) => {
        let capasVisualisadasActualizado = capasVisualizadas.map((valor) => {
            //Si es igual a la entidad que se envia, se cambia el zoom
            if (valor.nom_capa == target.name) {
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
        setCapasVisualizadas(capasVisualisadasActualizado);
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

    //Para mostrar menu lateral de mapas
    const [menuLateral, setMenuLateral] = useState(false);
    //Para mostrar collapse de mapas
    const [openCapasCollapse, setOpenCapasCollapse] = useState(true);
    const [openRasgosCollapse, setOpenRasgosCollapse] = useState(true);

    //Para exportar en CSV la información de rasgos
    var csvData = []
    var csvFileName = '';
    //Añade los valores al archivo
    function addToExportWithPivot(rasgosObtenidos) {
        generateFileName(function () {
            let csvData_ = [];
            let csvContent = [];
            if (rasgosObtenidos[0]) {
                csvData_.push(Object.keys(rasgosObtenidos[0]))
                rasgosObtenidos.map(rasgo => {
                    csvContent = [];
                    Object.keys(rasgo).map(item => {
                        csvContent.push(rasgo[item]);
                    })
                    csvData_.push(csvContent);
                });
                csvData = csvData_;
            }
        });
    }
    //Asigna los valores a los archivos
    function generateFileName(success) {
        let f = new Date();
        let fileName = '';
        fileName = 'InformacionDeRasgos-';
        fileName += (f.getDate() < 10 ? '0' : '') + f.getDate() + (f.getMonth() < 10 ? '0' : '') + (f.getMonth() + 1) + f.getFullYear() + f.getHours() + f.getMinutes() + f.getSeconds();
        csvFileName = fileName + '.csv';
        success();
    }

    //Para personalizar las flechitas de los collapse
    function CustomToggle({ children, eventKey }) {
        let actualEventKey = useContext(AccordionContext);
        let esActualEventKey = actualEventKey === eventKey;
        const llamaEventKey = useAccordionToggle(eventKey);
        return (
            <Button onClick={llamaEventKey} variant="link">
                <FontAwesomeIcon icon={esActualEventKey ? faAngleRight : faAngleDown} />
            </Button>
        )
    }

    if (typeof window !== 'undefined') {
        $('body').addClass("analisis-geografico-modales");
    }
    //Funcionalidad de minimizar el modal
    function minimizaModal(e) {
        let modalCompleto = $(e.target).closest(".modal")
        $(modalCompleto).toggleClass("modal-min");
        if ($(modalCompleto).hasClass("modal-min")) {
            $(modalCompleto).find(".modal-content").removeClass("modal-redimensionable");
            $(modalCompleto).find(".modal-header").css("pointer-events", "none")
        } else {
            $(modalCompleto).find(".modal-content").addClass("modal-redimensionable");
            $(modalCompleto).find(".modal-header").css("pointer-events", "initial")
        }
    }

    //Para agregar la funcionalidad de mover modal
    function DraggableModalDialog(props) {
        return (
            <Draggable handle=".modal-header"><ModalDialog  {...props} /></Draggable>
        )
    }

    const [showModalAgregarCapas, setShowModalAgregarCapas] = useState(false)
    function handleShowModalAgregarCapas() {
        setShowModalAgregarCapas(true);
        setAvisoBusquedaCapas("");
        setCapasBusqueda([]);
    }

    const [showModalSimbologia, setShowModalSimbologia] = useState(false);
    function remueveTabindexModalMovible() {
        $('.modal-analisis').removeAttr("tabindex");
    }
    const handleShowModalSimbologia = () => {
        setShowModalSimbologia(true);
        setTimeout(() => {
            remueveTabindexModalMovible();
        }, 1000)
    }

    //Para las descargas
    const [show, setShow] = useState(false);
    const [datosModal, setDatosModal] = useState(
        {
            title: '',
            body: ''
        }
    );
    const [fileUpload, setFileUpload] = useState();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    function renderModalDownload(items) {
        setDatosModal({
            title: `Descarga de ${items[0].nom_capa}`,
            body: <ul>
                {
                    items.map((item, index) => (
                        <li key={index} className="tw-text-titulo tw-font-bold" type="disc">
                            <a className="tw-text-black" href={
                                item.tipo == 'GeoJSON' ?
                                    `data:text/json;charset=utf-8,${encodeURIComponent(item.link)}` :
                                    item.link
                            } download={
                                item.tipo == 'GeoJSON' ?
                                    `${item.nom_capa}.json` :
                                    `${item.nom_capa}`
                            }>{item.tipo}</a>
                        </li>
                    ))
                }
            </ul>,
            redireccion: null,
            nombreBoton: 'Cerrar'
        });
        handleShow();
    }

    function processInputFile(event) {
        var fileType = event.target.files[0].name;
        fileType = fileType.substring(fileType.indexOf('.') + 1);
        switch (fileType) {
            case 'json':
                var fileReader = new FileReader();
                fileReader.readAsText(event.target.files[0], "UTF-8");
                fileReader.onload = loaded => {
                    setFileUpload({ data: JSON.parse(loaded.target.result), type: fileType });
                };
                break;
            case 'kml':
                var fileReader = new FileReader();
                fileReader.readAsText(event.target.files[0], "UTF-8");
                fileReader.onload = loaded => {
                    setFileUpload({ data: loaded.target.result, type: fileType });
                };
                break;
            case 'kmz':
                var fileReader = new FileReader();
                fileReader.readAsArrayBuffer(event.target.files[0]);
                fileReader.onload = loaded => {
                    var JSZip = require("jszip");
                    var zipped = new JSZip();
                    zipped.loadAsync(loaded.currentTarget.result).then(unzippedFiles => {
                        Object.keys(unzippedFiles.files).map(key => {
                            if (key.includes('kml')) {
                                unzippedFiles.files[key].async("string").then(content => {
                                    setFileUpload({ data: content, type: 'kml' });
                                })
                            }
                        })
                    });
                };
                break;
            case 'zip':
                var fileReader = new FileReader();
                fileReader.readAsArrayBuffer(event.target.files[0]);
                fileReader.onload = loaded => {
                    shpjs(loaded.currentTarget.result).then(function (result) {
                        setFileUpload({ data: result, type: 'json' });
                    });
                };
                break;
            default:
                setDatosModal({
                    title: 'Error!!!',
                    body: 'Archivo no soportado',
                    redireccion: null,
                    nombreBoton: 'Cerrar'
                });
                handleShow();
                break;
        }
    }

    function changeMainLayer(layer) {
    }


    const [valoresSubtemasDatos, setValoresSubtemasDatos] = useState(false)
    const temaDato = () => {
        setValoresSubtemasDatos(true)
    }
    var tituloConsultas = 'Consultas<br />prediseñadas'

    return (
        <>
            <ModalComponent
                show={show}
                datos={datosModal}
                onHide={handleClose}
                onClick={handleClose}
            />

            <Modal show={showModalAgregarCapas} onHide={() => setShowModalAgregarCapas(!showModalAgregarCapas)}
                keyboard={false} className="modal-analisis" contentClassName="modal-redimensionable">
                <Modal.Header closeButton >
                    <Modal.Title><b>Agregar</b></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Tabs defaultActiveKey="sedatu">
                        <Tab eventKey="sedatu" title="Capa">
                            <Form className="tw-mt-4 tw-mb-4" onSubmit={handleSubmitMetadatos(buscaMetadatos)}>
                                <Form.Group controlId="titulo">
                                    <Form.Label>Título de la capa</Form.Label>
                                    <Form.Control type="text" name="titulo" ref={registraMetadatos} />
                                </Form.Group>
                                <Form.Group controlId="palabrasClave">
                                    <Form.Label>Palabras clave</Form.Label>
                                    <Form.Control name="palabrasClave" ref={registraMetadatos} />
                                </Form.Group>
                                <Form.Group controlId="tema">
                                    <Form.Label>Tema</Form.Label>
                                    <Form.Control name="tema" ref={registraMetadatos} />
                                </Form.Group>
                                <Form.Group controlId="subtema">
                                    <Form.Label>Subtema</Form.Label>
                                    <Form.Control name="subtema" ref={registraMetadatos} />
                                </Form.Group>
                                <button className="btn-analisis" type="submit">BUSCAR</button>
                            </Form>
                            {
                                capasBusqueda.length != 0 &&
                                capasBusqueda.map((value, index) => (
                                    <a onClick={() => agregaCapaBusqueda(value)} key={index} className="tw-cursor-pointer tw-block">
                                        {value.titulo}
                                    </a>
                                ))
                            }
                            {
                                avisoBusquedaCapas &&
                                (
                                    <p>{avisoBusquedaCapas}</p>
                                )
                            }
                        </Tab>
                        <Tab eventKey="servicios" title="Servicio">
                            <Form className="tw-mt-4 tw-mb-4" onSubmit={handleAgregaServicio(agregaServicio)}>
                                <Form.Group controlId="urlServicio">
                                    <Form.Label>URL</Form.Label>
                                    <Form.Control type="url" name="urlServicio" ref={registraServicio} />
                                    <Form.Text muted>Agregue una URL de la siguiente manera "https://www.dominio.com/ows"</Form.Text>
                                </Form.Group>
                                <button className="btn-analisis" type="submit">CONSULTAR</button>
                            </Form>
                            {
                                guardaServicio.length != 0 &&
                                <>
                                    <Typeahead
                                        id="agregaServicioCapa"
                                        labelKey={(valores) => `${valores["Title"]}`}
                                        options={guardaServicio[0]}
                                        placeholder="Selecciona una capa"
                                        onChange={agregaCapaServicio}
                                        defaultValue=""
                                        clearButton
                                        paginationText="Desplegar más resultados"
                                        emptyLabel="No se encontraron resultados"
                                    />
                                </>
                            }
                            {
                                avisoServicio != "" && (
                                    <p className="tw-mt-4">{avisoServicio}</p>
                                )
                            }
                        </Tab>
                        <Tab eventKey="datos" title="Datos">
                            <Form className="tw-mt-4">
                                <Form.Group controlId="temas">
                                    <Form.Label>Temas</Form.Label>
                                    <Form.Control onChange={temaDato} as="select">
                                        <option value=""></option>
                                        <option>Tema 1</option>
                                        <option>Tema 2</option>
                                        <option>Tema 3</option>
                                        <option>Tema 4</option>
                                        <option>Tema 5</option>
                                    </Form.Control>
                                </Form.Group>
                                {
                                    valoresSubtemasDatos == true &&
                                    <Form.Group controlId="subtemas">
                                        <Form.Label>Subtemas</Form.Label>
                                        <Form.Control as="select">
                                            <option value=""></option>
                                            <option>Subtema 1</option>
                                            <option>Subtema 2</option>
                                            <option>Subtema 3</option>
                                            <option>Subtema 4</option>
                                            <option>Subtema 5</option>
                                        </Form.Control>
                                    </Form.Group>
                                }
                                <button className="btn-analisis" type="submit">CONSULTAR</button>
                            </Form>
                        </Tab>
                        <Tab eventKey="consultas" title={<>Consultas<br />prediseñadas</>}></Tab>
                    </Tabs>
                </Modal.Body>
            </Modal>

            <Modal dialogAs={DraggableModalDialog} show={showModalSimbologia} backdrop={false} keyboard={false} contentClassName="modal-redimensionable"
                onHide={() => setShowModalSimbologia(!showModalSimbologia)} className="tw-pointer-events-none modal-analisis modal-simbologia">
                <Modal.Header className="tw-cursor-pointer" closeButton>
                    <Modal.Title><b>Simbología</b></Modal.Title>
                    <button className="boton-minimizar-modal" onClick={(e) => minimizaModal(e)}>
                        {/* <img className="icono-minimizar tw-w-4" src="/images/analisis/window-minimize-regular.svg" /> */}
                        <FontAwesomeIcon icon={faWindowRestore} />
                    </button>
                </Modal.Header>
                <Modal.Body>
                    {
                        capasVisualizadas.map((capa, index) => {
                            if (capa.habilitado) {
                                if (capa.tipo == "geojson") {
                                    return (
                                        <div key={index}>
                                            <p><b>{capa.nom_capa}</b></p>
                                            <img src={capa.simbologia} alt="" />
                                            <br></br>
                                            <br></br>
                                        </div>
                                    )
                                }
                                if (capa.tipo == "wms") {
                                    return (
                                        <div key={index}>
                                            <p><b>{capa.nom_capa}</b></p>
                                            <img src={capa.simbologia}></img>
                                            <br></br>
                                            <br></br>
                                        </div>
                                    )
                                }
                            }
                        })
                    }
                </Modal.Body>
            </Modal>

            <Modal dialogAs={DraggableModalDialog} show={showModalAtributos} backdrop={false} keyboard={false} contentClassName="modal-redimensionable"
                onHide={() => setShowModalAtributos(!showModalAtributos)} className="tw-pointer-events-none modal-analisis modal-atributos">
                <Modal.Header className="tw-cursor-pointer" closeButton >
                    <Modal.Title><b>Atributos</b></Modal.Title>
                    <button className="boton-minimizar-modal" onClick={(e) => minimizaModal(e)}>
                        <FontAwesomeIcon icon={faWindowRestore} />
                    </button>
                </Modal.Header>
                <Modal.Body className="tw-overflow-y-auto">
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr className="tw-text-center">
                                <th colSpan="5">{atributos.length != 0 && atributos[1]}</th>
                            </tr>
                            <tr>
                                <th>fid</th>
                                <th>CVEGEO</th>
                                <th>CVE_ENT</th>
                                <th>CVE_MUN</th>
                                <th>NOMGEO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                atributos.length != 0 &&
                                atributos[0].map((value, index) => (
                                    <tr key={index}>
                                        <td>{value.properties.fid}</td>
                                        <td>{value.properties.CVEGEO}</td>
                                        <td>{value.properties.CVE_ENT}</td>
                                        <td>{value.properties.CVE_MUN}</td>
                                        <td>{value.properties.NOMGEO}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>

            <div className="contenedor-menu-lateral">
                <div className={menuLateral ? "tw-w-96 menu-lateral" : "tw-w-0 menu-lateral"}>
                    <Card>
                        <Card.Header>
                            <div className="row">
                                <div className="col-9">
                                    <b>Información de rasgos</b>
                                    <Button onClick={() => setOpenRasgosCollapse(!openRasgosCollapse)} variant="link">
                                        <FontAwesomeIcon icon={openRasgosCollapse ? faAngleDown : faAngleRight} />
                                    </Button>
                                </div>
                                {
                                    rasgos[0] &&
                                    <div className="col-3">
                                        {
                                            addToExportWithPivot(rasgos)
                                        }
                                        <CSVLink data={csvData} filename={csvFileName}>
                                            <FontAwesomeIcon size="2x" icon={faFileCsv} />
                                        </CSVLink>
                                    </div>
                                }
                            </div>
                        </Card.Header>
                    </Card>
                    <Collapse in={openRasgosCollapse}>
                        <div>
                            {
                                rasgos.map((valor, index) => (
                                    <Accordion key={index}>
                                        <Card>
                                            <Card.Header className="tw-flex tw-justify-between tw-items-baseline">
                                                {valor["NOMGEO"]}
                                                <CustomToggle eventKey={index.toString()} />
                                            </Card.Header>
                                            <Accordion.Collapse eventKey={index.toString()}>
                                                <Table striped bordered hover>
                                                    <thead>
                                                        <tr>
                                                            <th key={index} colSpan="2" className="tw-text-center">{valor["nombre_capa"]}</th>
                                                        </tr>
                                                        <tr>
                                                            <th>Valor</th>
                                                            <th>Descripción</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            Object.keys(valor).map((key, indexKey) => {
                                                                if (key !== "nombre_capa") {
                                                                    return (
                                                                        <tr key={indexKey}>
                                                                            <td>{key}</td>
                                                                            <td>{valor[key]}</td>
                                                                        </tr>
                                                                    )
                                                                }
                                                            })
                                                        }
                                                    </tbody>
                                                </Table>
                                            </Accordion.Collapse>
                                        </Card>
                                    </Accordion>
                                ))
                            }
                        </div>
                    </Collapse>
                    <Card>
                        <Card.Header>
                            <b>Capas</b>
                            <Button onClick={() => setOpenCapasCollapse(!openCapasCollapse)} variant="link">
                                <FontAwesomeIcon icon={openCapasCollapse ? faAngleDown : faAngleRight} />
                            </Button>
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
                                                <DraggableDnd key={capa.nom_capa} draggableId={capa.nom_capa} index={index}>
                                                    {(provided) => (
                                                        <Card {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                            <Card.Header className="tw-flex tw-justify-between tw-items-baseline">
                                                                <Form.Group>
                                                                    <Form.Check type="checkbox" inline defaultChecked={capa.habilitado} label={capa.nom_capa} onChange={(event) => cambiaCheckbox(event)} value={capa.nom_capa} />
                                                                </Form.Group>
                                                                {/* <OverlayTrigger overlay={<Tooltip>Capa activa/inactiva</Tooltip>}>
                                                                    <Button onClick={() => setMainLayer(capa.cveEnt)} variant="link">
                                                                        <FontAwesomeIcon icon={faDotCircle} />
                                                                    </Button>
                                                                </OverlayTrigger> */}
                                                                {
                                                                    capa.tipo === "geojson" &&
                                                                    <Button onClick={() => muestraAtributos(capa)} variant="link">
                                                                        <FontAwesomeIcon icon={faTable} />
                                                                    </Button>
                                                                }
                                                                <Button onClick={() => eliminaCapa(capa)} variant="link">
                                                                    <FontAwesomeIcon icon={faTrash} />
                                                                </Button>
                                                                <CustomToggle eventKey={capa.nom_capa} />
                                                            </Card.Header>
                                                            <Accordion.Collapse eventKey={capa.nom_capa}>
                                                                <Card.Body>
                                                                    <Form.Group>
                                                                        <Form.Label>Transparencia</Form.Label>
                                                                        <div className="tw-flex">
                                                                            <span className="tw-mr-6">+</span>
                                                                            <Form.Control custom type="range" min="0" step="0.1" max="1" defaultValue="1" name={capa.nom_capa} onChange={(event) => transparenciaCapas(event)} />
                                                                            <span className="tw-ml-6">-</span>
                                                                        </div>
                                                                    </Form.Group>
                                                                    {capa.tipo == "wms" &&
                                                                        (
                                                                            <div className="row">
                                                                                <Form.Group className="col-6">
                                                                                    <Form.Label>Zoom mínimo</Form.Label>
                                                                                    <Form.Control defaultValue="0" as="select" onChange={(event) => zoomMinMax(event)} name={capa.nom_capa} data-zoom="min">
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
                                                                                    <Form.Control defaultValue="18" as="select" onChange={(event) => zoomMinMax(event)} name={capa.nom_capa} data-zoom="max">
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
                                                                    {
                                                                        capa.download != undefined && (
                                                                            <>
                                                                                <hr />
                                                                                <div className="d-flex justify-content-center">
                                                                                    {
                                                                                        <a className="tw-text-titulo tw-font-bold" style={{ cursor: 'pointer' }} onClick={() => (renderModalDownload(capa.download))}>
                                                                                            <OverlayTrigger overlay={<Tooltip>{`Descargar (${capa.download.length} disponible(s))`}</Tooltip>}>
                                                                                                <FontAwesomeIcon className="tw-px-1" size="2x" icon={faDownload} />
                                                                                            </OverlayTrigger>
                                                                                        </a>
                                                                                    }
                                                                                </div>
                                                                            </>
                                                                        )
                                                                    }
                                                                </Card.Body>
                                                            </Accordion.Collapse>
                                                        </Card>
                                                    )}
                                                </DraggableDnd>
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
                    <FontAwesomeIcon className="tw-cursor-pointer" icon={menuLateral ? faCaretLeft : faCaretRight} />
                </button>
            </div>

            <div className="div-herramientas-contenedor">
                <OverlayTrigger overlay={<Tooltip>Simbología</Tooltip>}>
                    <button className="botones-barra-mapa" onClick={handleShowModalSimbologia}>
                        <FontAwesomeIcon icon={faImages}></FontAwesomeIcon>
                    </button>
                </OverlayTrigger>
                <OverlayTrigger overlay={<Tooltip>Agregar capas</Tooltip>}>
                    <button className="botones-barra-mapa" onClick={handleShowModalAgregarCapas}>
                        <img src="/images/analisis/agregar-capas.png" alt="Agregar capas" className="tw-w-5" />
                    </button>
                </OverlayTrigger>
                <OverlayTrigger overlay={<Tooltip>Agregar archivo</Tooltip>}>
                    <label htmlFor={`uploadFIleButton${props.botones == false && `Espejo`}`} className="tw-mb-0 tw-cursor-pointer">
                        <button className="botones-barra-mapa tw-pointer-events-none">
                            <input type="file" name="file" onChange={(e) => processInputFile(e)} id={`uploadFIleButton${props.botones == false && `Espejo`}`} hidden />
                            <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>
                        </button>
                    </label>

                </OverlayTrigger>
            </div>
            {
                props.botones == true
                    ?
                    <Map fileUpload={fileUpload} referencia={capturaReferenciaMapa} datos={capasVisualizadas} />
                    :
                    <MapEspejo fileUpload={fileUpload} referencia={capturaReferenciaMapa} datos={capasVisualizadas}
                        referenciaAnalisis={props.referenciaAnalisis} />

            }

        </>
    )
}

export default React.memo(ContenedorMapaAnalisis)