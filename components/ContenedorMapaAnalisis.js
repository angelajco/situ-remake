import React, { useState, useEffect, useContext, Fragment } from 'react';
import { Controller, useForm } from "react-hook-form";
import { Form, Button, OverlayTrigger, Tooltip, Card, Accordion, Collapse, Table, AccordionContext, useAccordionToggle, Modal, Tabs, Tab } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages, faAngleDown, faCaretLeft, faFileCsv, faAngleRight, faTrash, faTable, faDownload, faCaretRight, faUpload, faInfoCircle, faHandPaper, faFilePdf, faCheckCircle, faDotCircle } from '@fortawesome/free-solid-svg-icons';
import { faWindowRestore } from '@fortawesome/free-regular-svg-icons';
import { DragDropContext, Droppable, Draggable as DraggableDnd, resetServerContext } from 'react-beautiful-dnd';
import { CSVLink } from "react-csv";
import { Typeahead } from 'react-bootstrap-typeahead';

import * as toPdf from '@react-pdf/renderer';
import * as htmlToImage from 'html-to-image';
import * as turf from '@turf/turf';

import $ from 'jquery';
import Draggable from 'react-draggable';
import ModalDialog from 'react-bootstrap/ModalDialog';
import dynamic from 'next/dynamic';
import shpjs from 'shpjs';
import xml2js from 'xml2js'
import xpath from 'xml2js-xpath'
// import omnivore from '@mapbox/leaflet-omnivore'


import 'react-bootstrap-typeahead/css/Typeahead.css';

import ModalAnalisis from './ModalAnalisis'
import catalogoEntidades from "../shared/jsons/entidades.json";

var referenciaMapa = null;

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

var sincronizaA;
var sincronizaB;

function ContenedorMapaAnalisis(props) {

    const [zIndexCapas, setZIndex] = useState(0)
    const [numeroIndex, setNumeroIndex] = useState(300);
    //Obten referencia del mapa
    const [capturoReferenciaMapa, setCapturoReferenciaMapa] = useState(false)
    function capturaReferenciaMapa(mapa, objeto) {
        referenciaMapa = mapa;
        if (referenciaMapa != null) {
            setTimeout(() => {
                setCapturoReferenciaMapa(true);
            }, 300)
        }
    }

    // const [listaMunicipios, setListaMunicipios] = useState([])
    //Para saber si hubo una conexión con la base de datos
    const [conexionEndPointGetCapas, setConexionEndPointGetCapas] = useState(false);
    useEffect(() => {
        //Datos para construir el catalogo
        fetch(`${process.env.ruta}/wa/publico/getCapas/`)
            .then(res => res.json())
            .then(
                (data) => {
                    construyeCatalogoTemas(data);
                    setConexionEndPointGetCapas(true);
                },
                (error) => console.log(error)
            )
    }, [])

    useEffect(() => {
        if (capturoReferenciaMapa == true) {
            setPolygonDrawer(new L.Draw.Circle(referenciaMapa));
            //Cuando se dibuja algo en el mapa
            referenciaMapa.on('draw:created', function (e) {
                let layerDibujada = e.layer;
                let circlepoly;
                if (e.layerType !== 'polyline' && e.layerType !== "marker") {
                    if (e.layerType === "circle") {
                        var d2r = Math.PI / 180;
                        var r2d = 180 / Math.PI;
                        //circulo
                        var earthsradius = 6379000;
                        var points = 999;
                        var rlat = (layerDibujada.options.radius / earthsradius) * r2d;
                        var rlng = rlat / Math.cos(layerDibujada._latlng.lat * d2r);
                        var extp = new Array();
                        for (var i = 0; i < points + 1; i++) {
                            var theta = Math.PI * (i / (points / 2));
                            var ex = layerDibujada._latlng.lng + (rlng * Math.cos(theta));
                            var ey = layerDibujada._latlng.lat + (rlat * Math.sin(theta));
                            extp.push(new L.LatLng(ey, ex));
                        }
                        circlepoly = new L.Polygon(extp);
                        referenciaMapa.removeLayer(layerDibujada);
                    }

                    let capasIntersectadas = [];
                    let capasIntersectadasParaIdentificarSeparadas = [];
                    referenciaMapa.eachLayer(function (layer) {
                        if (layer instanceof L.GeoJSON) {
                            let tempCapasIdentificadasMismaCapa = []
                            layer.eachLayer(function (layerConFeatures) {
                                let seIntersectan;
                                seIntersectan = turf.intersect(layerConFeatures.toGeoJSON(), circlepoly ? circlepoly.toGeoJSON() : layerDibujada.toGeoJSON())
                                if (seIntersectan != null) {
                                    if (circlepoly) {
                                        //Arreglo temporal que se limpia cada vez que entra en una nueva capa Padre
                                        //La cual guardara las capas identificadas de manera independiente
                                        tempCapasIdentificadasMismaCapa.push(layerConFeatures.feature)
                                    } else {
                                        //Se guardan todos los features en el mismo arreglo
                                        capasIntersectadas.push(layerConFeatures.feature)
                                    }
                                }
                            })
                            //Si es identificar, vamos agregando las capas separadas
                            if (tempCapasIdentificadasMismaCapa.length != 0) {
                                capasIntersectadasParaIdentificarSeparadas.push(tempCapasIdentificadasMismaCapa)
                            }
                        }
                    });
                    //Si para rasgos hubo interseccion o para capas identificar
                    if (capasIntersectadas.length != 0 || capasIntersectadasParaIdentificarSeparadas.length != 0) {
                        if (circlepoly) {
                            // setCapasIdentificadas(capasIntersectadasParaIdentificarSeparadas)
                            //Se guardan para despues indentificarse
                            setSavedToIdentify(capasIntersectadasParaIdentificarSeparadas)
                        } else {
                            setRasgos(capasIntersectadas);
                        }
                    }
                }
            });
        }
    }, [capturoReferenciaMapa])

    //Variables para guardar los datos de las capas, metadatos de la api
    const [arregloCapasBackEnd, setArregloCapasBackEnd] = useState([])
    //Para guardar los TEMAS de metadatos
    const [listaMetadatosTemasCapasBackEnd, setListaMetadatosTemasCapasBackEnd] = useState([])
    //Para guardar los SUBTEMAS de metadatos
    const [listaMetadatosSubtemasCapasBackEnd, setListaMetadatosSubtemasCapasBackEnd] = useState([])
    //Para guardar los titulos de los metadatos en busqueda basica
    const [listaMetadatosTitulosCapasBackEnd, setListaMetadatosTitulosCapasBackEnd] = useState([])

    //Para traer los temas de los metadatos de primera instancia, asi como las palabras clave
    function construyeCatalogoTemas(metadatosCapasApi) {
        setArregloCapasBackEnd(metadatosCapasApi)
        let listaTemas = [];
        let listaPalabras = [];
        metadatosCapasApi.map(value => {
            if (value.tema) {
                listaTemas.push(value.tema)
            }
        })
        //Guarda los temas que se van a presentar al usuario
        let uniqueTemas = [...new Set(listaTemas)];
        let temasConSeleccion = [];
        uniqueTemas.map((value, index) => {
            if (index == 0) {
                temasConSeleccion.push({ titulo: value, seleccionado: true })
            }
            else {
                temasConSeleccion.push({ titulo: value, seleccionado: false })
            }
        })
        setListaMetadatosTemasCapasBackEnd(temasConSeleccion)

        //Asigna el primer valor por default de los temas para mostrar los subtemas
        let listaSubtemas = metadatosCapasApi.filter(metadato => metadato.tema == temasConSeleccion[0].titulo).map(metadato => metadato["subtema"]);
        let uniqueSubtemas = [...new Set(listaSubtemas)]
        let subtemasConSeleccion = [];
        uniqueSubtemas.map((value, index) => {
            if (index == 0) {
                subtemasConSeleccion.push({ titulo: value, seleccionado: true })
            }
            else {
                subtemasConSeleccion.push({ titulo: value, seleccionado: false })
            }
        })
        setListaMetadatosSubtemasCapasBackEnd(subtemasConSeleccion)
        //Asigna el primer valor para los titulos
        let listaTitulos = metadatosCapasApi.filter(metadato => metadato.subtema == subtemasConSeleccion[0].titulo);
        setListaMetadatosTitulosCapasBackEnd(listaTitulos)
    }

    //Funcion que construye los subtemas al escoger un tema
    function construyeCatalogoSubtemas(tema) {
        //Para ocultar los titulos al escoger un tema
        setListaMetadatosTitulosCapasBackEnd([])
        //Para ocultar los botones de como montar la capa
        setBotonesAgregaCapaIdeWFSWMS([])
        //Para volver a seleccionar el tema que se ha escogido
        listaMetadatosTemasCapasBackEnd.map(valor => {
            if (valor.titulo == tema) {
                valor.seleccionado = true
            } else {
                valor.seleccionado = false
            }
        })
        setListaMetadatosTemasCapasBackEnd(listaMetadatosTemasCapasBackEnd)
        //Para mostrar los subtemas
        let listaSubtemas = arregloCapasBackEnd.filter(metadato => metadato.tema == tema).map(metadato => metadato["subtema"]);
        let uniqueSubtemas = [...new Set(listaSubtemas)]
        let subtemasConSeleccion = [];
        uniqueSubtemas.map((value, index) => {
            subtemasConSeleccion.push({ titulo: value, seleccionado: false })
        })
        setListaMetadatosSubtemasCapasBackEnd(subtemasConSeleccion)
    }

    //Función que construye los titulos al escoger un subtema
    function contruyeCatalogoTitulo(subtema) {
        //Para ocultar los titulos al escoger un subtema
        setListaMetadatosTitulosCapasBackEnd([])
        //Para ocultar los botones de como montar la capa
        setBotonesAgregaCapaIdeWFSWMS([])
        //Para mostrar los subtemas
        listaMetadatosSubtemasCapasBackEnd.map(valor => {
            if (valor.titulo == subtema) {
                valor.seleccionado = true
            } else {
                valor.seleccionado = false
            }
        })
        setListaMetadatosSubtemasCapasBackEnd(listaMetadatosSubtemasCapasBackEnd)
        //Para mostrar los titulos
        let listaTitulos = arregloCapasBackEnd.filter(metadato => metadato.subtema == subtema);
        setTimeout(() => {
            setListaMetadatosTitulosCapasBackEnd(listaTitulos)
        }, 500)
    }

    //Para cuando se requiere que sea nacional
    const construyeNacionalCapa = (capaFusion) => {
        let capaNacional = {};
        capaNacional.titulo = capaFusion.titulo + " - Nacional";
        capaNacional.url = capaFusion.url;
        capaNacional.capa = capaFusion.nombre_capa;
        capaNacional.filtro_entidad = capaFusion.filtro_entidad;
        capaNacional.tipo = "wfs";
        capaNacional.wfs = capaFusion.wfs;
        capaNacional.wms = capaFusion.wms;
        capaNacional.opcion = 0;
        capaNacional.estilos = {
            color: "#0000FF",
            fillColor: "#7777FF",
            opacity: "1",
            fillOpacity: "1"
        }
        //Para los alias de los atributos
        capaNacional["id_capa"] = capaFusion.id_capa
        agregaCapaWFS(capaNacional)
    }

    //Para cuando se agrega una entidad
    const construyeEntidadCapa = (capaFusion, entidad) => {
        if (entidad != undefined) {
            let capaEntidad = {};
            capaEntidad.titulo = capaFusion.titulo + " - " + entidad.entidad;
            capaEntidad.url = capaFusion.url;
            capaEntidad.capa = capaFusion.nombre_capa;
            capaEntidad.filtro_entidad = capaFusion.filtro_entidad;
            capaEntidad.tipo = "wfs";
            capaEntidad.valor_filtro = entidad.id;
            capaEntidad.wfs = capaFusion.wfs;
            capaEntidad.wms = capaFusion.wms;
            capaEntidad.opcion = 5;
            capaEntidad.estilos = {
                color: "#FF0000",
                fillColor: "#FF7777",
                opacity: "1",
                fillOpacity: "1"
            }
            //Para los alias de los atributos
            capaEntidad["id_capa"] = capaFusion.id_capa
            agregaCapaWFS(capaEntidad)
        }
    }

    //Para la busqueda avanzada, mostrar o no
    const [busquedaAvanzada, setBusquedaAvanzada] = useState(false)
    function cambiaBusquedaAvanzada() {
        setBusquedaAvanzada(!busquedaAvanzada)
        //busqueda general
        setBotonesAgregaCapaIdeWFSWMS([])
        //busqueda avanzada
        setListaMetadatosTitulosBusquedaAvanzada([])
    }
    //Para guardar los titulos de los metadatos en busqueda avanzada
    const [listaMetadatosTitulosBusquedaAvanzada, setListaMetadatosTitulosBusquedaAvanzada] = useState([])
    //Para buscar los metadatos de la capa
    const { register: registraMetadatos, handleSubmit: handleSubmitMetadatos, errors: errorsMetadatos, setError: setErrorMetadatos } = useForm();
    const busquedaAvanzadaMetadatos = (data) => {
        setListaMetadatosTitulosBusquedaAvanzada([])
        let capasId = [];
        let capasArr = [];
        arregloCapasBackEnd.map(value => {
            if (value["descripcion"].includes(data.palabra)) {
                capasId.push(value["id_capa"])
            }
            if (value["titulo"].includes(data.palabra)) {
                capasId.push(value["id_capa"])
            }
            if (value["palabras_clave"].includes(data.palabra)) {
                capasId.push(value["id_capa"])
            }
        });

        if (capasId.length != 0) {
            let unique = [...new Set(capasId)]
            unique.map(value => {
                let capaBack = arregloCapasBackEnd.filter(capasBack => capasBack["id_capa"] == value)
                capasArr.push(...capaBack)
            })
            setListaMetadatosTitulosBusquedaAvanzada(capasArr)
        } else {
            setErrorMetadatos("palabra", { message: "No se encontró una coincidencia con esta palabra" })
        }
    }

    //Para buscar los metadatos de la capa
    const { register: registraAgregaCapa, handleSubmit: handleAgregaCapa, control: controlAgregaCapa, errors: erroresAgregaCapa, setError: setErrorAgregaCapa } = useForm();
    const submitAgregaCapa = (data) => {
        let capa = JSON.parse(data.capa);
        if (capa.filtro_minimo == "0") {
            if (data.entidadAgregar != undefined && data.entidadAgregar.length != 0) {
                construyeEntidadCapa(capa, data.entidadAgregar[0])
            } else {
                construyeNacionalCapa(capa)
            }
        } else if (capa.filtro_minimo == "5") {
            if (data.entidadAgregar.length != 0) {
                construyeEntidadCapa(capa, data.entidadAgregar[0])
            } else {
                setErrorAgregaCapa("entidadAgregar", {
                    message: "Debes seleccionar una entidad"
                })
            }
        }
    }

    //Muestra los botones de mosaico o elementos
    const [botonesAgregaCapaIdeWFSWMS, setBotonesAgregaCapaIdeWFSWMS] = useState([false, null])
    //Checa si se tienen que mostrar los botones de mosaico o elementos o no
    const agregaCapaBusquedaIde = (e) => {
        let capaIde = JSON.parse(e.target.value)
        setBotonesAgregaCapaIdeWFSWMS([])
        setBotonesAgregaCapaIdeWFSWMS([true, capaIde])
    }

    //Para crear la simbologia de las capas WMS
    const creaSVG = (nombreCapa, estilos) => {
        var creaSVG = `<svg height='20' xmlns='http://www.w3.org/2000/svg'><rect x='0' y='0' width='15' height='15' fill='${estilos.fillColor}' stroke='${estilos.color}' strokeWidth='2'></rect><text x='20' y='15' width='200' height='200' fontSize='12.5' fontWeight='500' font-family='Montserrat, sans-serif'>${nombreCapa}</text></svg>`
        var DOMURL = self.URL || self.webkitURL || self;
        var svg = new Blob([creaSVG], { type: "image/svg+xml;charset=utf-8" });
        var url = DOMURL.createObjectURL(svg);
        return url;
    }

    //Para guardar las capas que se van a mostrar
    const [capasVisualizadas, setCapasVisualizadas] = useState([]);
    //Para guardar los rasgos
    const [rasgos, setRasgos] = useState([])

    //Para agregar un servicio de otra identidad
    const [guardaServicio, setGuardaServicio] = useState([])
    const { register: registraServicio, handleSubmit: handleAgregaServicio, errors: errorsServicio, setError: setErrorServicio } = useForm();
    const agregaServicio = (data) => {
        setGuardaServicio([])
        // https://ide.sedatu.gob.mx:8080/ows?service=wms&version=1.1.1&request=GetCapabilities
        let req = new XMLHttpRequest();
        req.open("GET", `${data.urlServicio}?service=WMS&request=GetCapabilities`);
        req.send();
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    xml2js.parseString(req.response, (err, result) => {
                        if (err) {
                            setErrorServicio("urlServicio", { message: "El servicio no está disponible o agrego una URL erronea, favor de verificar" })
                        } else {
                            let matches = xpath.find(result, "//Layer/Layer/@opaque");
                            if (matches.length != 0) {
                                setGuardaServicio([matches, data.urlServicio]);
                            }
                            else {
                                setErrorServicio("urlServicio", { message: "El servicio no está disponible o agrego una URL erronea, favor de verificar" })
                            }
                        }
                    })
                }
                else {
                    setErrorServicio("urlServicio", { message: "El servicio no está disponible o agrego una URL erronea, favor de verificar" })
                }
            }
        }
    }

    //Para agregar capas WMS, ya sea de la ide o de un servicio
    const agregaCapaWMS = (capa, fuente) => {
        setShowModalAgregarCapas(false);
        if (capasVisualizadas.some(capaVisual => capaVisual.nom_capa === capa.titulo)) {
            setDatosModalAnalisis({
                title: "Capa existente",
                body: "La capa ya se ha agregado anteriormente"
            });
            setShowModalAnalisis(true);
            return;
        } else {
            let capaWMS = {};
            capaWMS["attribution"] = "No disponible"
            capaWMS["transparent"] = "true"
            capaWMS["tipo"] = "wms"
            capaWMS["habilitado"] = true;
            capaWMS["transparencia"] = 1;
            capaWMS["zoomMinimo"] = 5;
            capaWMS["zoomMaximo"] = 18;
            //fuente = 0, proviene de la IDE
            //fuente = 1, proviene de un servicio
            if (fuente == 0) {
                capaWMS["url"] = capa.url
                capaWMS["layers"] = capa["nombre_capa"]
                capaWMS["format"] = capa.wms
                capaWMS["nom_capa"] = capa.titulo;
                capaWMS['simbologia'] = capa["leyenda_simb"];
                let url = `https://ide.sedatu.gob.mx:8080/wfs?request=GetFeature&service=WFS&version=1.0.0&typeName=${capaWMS.layers}&outputFormat=`
                let download = [
                    { nom_capa: capaWMS.nom_capa, link: `${url}KML`, tipo: 'KML' },
                    { nom_capa: capaWMS.nom_capa, link: `https://ide.sedatu.gob.mx:8080/ows?service=WMS&request=GetMap&version=1.1.1&format=application/vnd.google-earth.kmz+XML&width=1024&height=1024&layers=${capaWMS.layers}&bbox=-180,-90,180,90`, tipo: 'KMZ' },
                    { nom_capa: capaWMS.nom_capa, link: `${url}SHAPE-ZIP`, tipo: 'SHAPE' }
                ];
                capaWMS.download = download;
            } else if (fuente == 1) {
                capaWMS["url"] = guardaServicio[1]
                capaWMS["layers"] = capa[0].Name[0]
                capaWMS["format"] = "image/png"
                capaWMS["nom_capa"] = capa[0].Title[0];
                capaWMS['simbologia'] = capa[0].Style[0]["LegendURL"][0]["OnlineResource"][0]["$"]["xlink:href"];
            }
            setZIndex(zIndexCapas + 1)
            referenciaMapa.createPane(`${zIndexCapas}`)
            referenciaMapa.getPane(`${zIndexCapas}`).style.zIndex = numeroIndex + capasVisualizadas.length;
            let layer = L.tileLayer.wms(capaWMS.url, {
                layers: capaWMS.layers,
                format: capaWMS.format,
                transparent: capaWMS.transparent,
                attribution: capaWMS.attribution,
                opacity: capaWMS.transparencia,
                minZoom: capaWMS.zoomMinimo,
                maxZoom: capaWMS.zoomMaximo,
                pane: `${zIndexCapas}`
            })
            capaWMS["layer"] = layer;
            referenciaMapa.addLayer(capaWMS.layer)
            // setCapasVisualizadas([...capasVisualizadas, capaWMS]);
            setCapasVisualizadas([capaWMS, ...capasVisualizadas]);
            setDatosModalAnalisis({
                title: "Capa agregada",
                body: "La capa se ha agregado con exito"
            });
            setShowModalAnalisis(true);
        }
    }


    const agregaCapaWFS = (capaFiltrada) => {
        setShowModalAgregarCapas(false);
        if (capasVisualizadas.some(capaVisual => capaVisual.nom_capa === capaFiltrada.titulo)) {
            setDatosModalAnalisis({
                title: "Capa existente",
                body: "La capa ya se ha agregado anteriormente"
            })
            setShowModalAnalisis(true);
            return;
        }
        else {
            let defaultParameters = {
                service: 'WFS',
                version: '2.0',
                request: 'GetFeature',
                typeName: capaFiltrada.capa,
                outputFormat: 'text/javascript',
                format_options: 'callback:getJson',
            }
            if (capaFiltrada.opcion == "0") {
                //La agregará como nacional
            } else if (capaFiltrada.opcion == "5") {
                //La agregara como municipio
                defaultParameters.cql_filter = capaFiltrada.filtro_entidad + "=" + "'" + capaFiltrada.valor_filtro + "'";
            }
            var parameters = L.Util.extend(defaultParameters);
            var url = capaFiltrada.url + L.Util.getParamString(parameters);
            //Hace la petición para traer los datos de la entidad
            $.ajax({
                jsonpCallback: 'getJson',
                url: url,
                dataType: 'jsonp',
                success: function (response) {
                    response["nom_capa"] = capaFiltrada.titulo;
                    response["habilitado"] = true;
                    response['tipo'] = capaFiltrada.tipo;
                    response['transparencia'] = 1;
                    response['simbologia'] = creaSVG(capaFiltrada.titulo, capaFiltrada.estilos)
                    response.download = [{ nom_capa: response.nom_capa, link: JSON.stringify(response), tipo: 'GeoJSON' }];
                    response.isActive = false;
                    setZIndex(zIndexCapas + 1)
                    referenciaMapa.createPane(`${zIndexCapas}`)
                    referenciaMapa.getPane(`${zIndexCapas}`).style.zIndex = numeroIndex + capasVisualizadas.length;
                    let layer = L.geoJSON(response, {
                        pane: `${zIndexCapas}`,
                        style: capaFiltrada.estilos,
                        nombre: response["nom_capa"],
                        onEachFeature: function (feature = {}, layerPadre) {
                            feature["nombre_capa"] = layerPadre.options["nombre"];
                            fetch(`${process.env.ruta}/wa0/atributos_capa01?id=${capaFiltrada["id_capa"]}`)
                                .then(res => res.json())
                                .then(
                                    (data) => {
                                        Object.keys(feature.properties).map(key => {
                                            let nuevoAlias = data.columnas.find(columna => columna.columna == key).alias
                                            if (nuevoAlias !== "") {
                                                let keyTemp = feature.properties[key]
                                                delete feature.properties[key]
                                                feature.properties[nuevoAlias] = keyTemp
                                            }
                                        })
                                        layerPadre.on('click', function () {
                                            setRasgos([feature]);
                                        })
                                    },
                                    () => {
                                        layerPadre.on('click', function () {
                                            setRasgos([feature]);
                                        })
                                    }
                                )
                        }
                    });
                    response['layer'] = layer;
                    setCapasVisualizadas([response, ...capasVisualizadas])
                    referenciaMapa.addLayer(response.layer);
                    setDatosModalAnalisis({
                        title: "Capa agregada",
                        body: "La capa se ha agregado con exito"
                    });
                    setShowModalAnalisis(true);
                }
            });
        }
    }

    //Para guardar los atributos
    const [atributos, setAtributos] = useState([]);
    //Para mostrar el modal de atributos
    const [showModalAtributos, setShowModalAtributos] = useState(false)
    //Para asignar atributos
    function muestraAtributos(capa) {
        setAtributos(capa.features)
        setShowModalAtributos(true)
    }

    //Para eliminar capas
    const eliminaCapa = (capa) => {
        referenciaMapa.removeLayer(capa.layer)
        let arrTemp = capasVisualizadas.filter(capaArr => capaArr.nom_capa != capa.nom_capa)
        //Para reordenar el z index de las capas
        arrTemp.map((valor, index) => {
            referenciaMapa.getPane(valor.layer.options.pane).style.zIndex = numeroIndex + arrTemp.length - index - 1;;
        })
        setCapasVisualizadas(arrTemp);

        let paneRemove = referenciaMapa.getPane(capa.layer.options.pane)
        paneRemove.remove();
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
                valor.transparencia = target.value;
                if (valor.tipo == "wfs" || valor.tipo == "kml" || valor.tipo == 'json') {
                    valor.layer.setStyle({ opacity: valor.transparencia, fillOpacity: valor.transparencia })
                }
                else if (valor.tipo == "wms") {
                    valor.layer.setOpacity(valor.transparencia)
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

        //Para reordenar el z index de las capas
        items.map((valor, index) => {
            referenciaMapa.getPane(valor.layer.options.pane).style.zIndex = numeroIndex + items.length - index - 1;
        })

        // Actualizamos datos entidades
        setCapasVisualizadas(items)
    }

    //Para mostrar menu lateral de mapas
    const [menuLateral, setMenuLateral] = useState(false);
    //Para mostrar collapse de mapas
    const [openCapasCollapse, setOpenCapasCollapse] = useState(true);
    const [openRasgosCollapse, setOpenRasgosCollapse] = useState(true);

    //Para exportar en CSV la información de rasgos
    var [csvData, setCsvData] = useState([]);
    //Para exportar en CSV la información de los rasgos identificados
    var [csvDataIdentificados, setCsvDataIdentificados] = useState([]);
    const [csvFileName, setCsvFileName] = useState('');
    //Añade los valores al archivo
    function addToExportWithPivot(rasgosObtenidos, fuenteProveniente) {
        generateFileName(function () {
            let csvData_ = [];
            let csvContent = [];
            let id = "";
            if (rasgosObtenidos.length != 0) {
                rasgosObtenidos.map((rasgo, index) => {
                    if (rasgo.nombre_capa != id) {
                        if (index != 0) {
                            csvData_.push([])
                        }
                        id = rasgo.nombre_capa
                        var encabezados = Object.keys(rasgo.properties)
                        encabezados.push("nombre_capa")
                        csvData_.push(encabezados)
                    }
                    csvContent = [];
                    Object.keys(rasgo.properties).map(item => {
                        csvContent.push(rasgo.properties[item]);
                    })
                    csvContent.push(rasgo.nombre_capa)
                    csvData_.push(csvContent);
                });
                if(fuenteProveniente == 0){
                    //proviene de rasgos
                    setCsvData(csvData_);
                } else if(fuenteProveniente == 1){
                    //proviene de capas identificadas
                    setCsvDataIdentificados(csvData_)
                }
            }
        });
    }
    //Asigna los valores a los archivos
    function generateFileName(success) {
        let f = new Date();
        let fileName = '';
        fileName = 'InformacionDeRasgos-';
        fileName += (f.getDate() < 10 ? '0' : '') + f.getDate() + (f.getMonth() < 10 ? '0' : '') + (f.getMonth() + 1) + f.getFullYear() + f.getHours() + f.getMinutes() + f.getSeconds();
        setCsvFileName(fileName);
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
        /////////////////Capas de la IDE
        //Busqueda basica
        //Busqueda avanzada
        setListaMetadatosTitulosBusquedaAvanzada([])
        //Busqueda general
        setBusquedaAvanzada(false)
        setBotonesAgregaCapaIdeWFSWMS([])
        //////////////////Capas de servicio
        setGuardaServicio([]);

        setShowModalAgregarCapas(true);
    }

    function remueveTabindexModalMovible() {
        $('.modal-analisis').removeAttr("tabindex");
    }
    const [showModalSimbologia, setShowModalSimbologia] = useState(false);
    const handleShowModalSimbologia = () => {
        setShowModalSimbologia(true);
        setTimeout(() => {
            remueveTabindexModalMovible();
        }, 1000)
    }

    const [showModalIdentify, setShowModalIdentify] = useState(false);
    const handleShowModalIdentify = () => {
        setShowModalIdentify(true);
        setTimeout(() => {
            remueveTabindexModalMovible();
        });
    }

    //Modal general que no se minimiza ni se expande
    const [showModalAnalisis, setShowModalAnalisis] = useState(false);
    const handleCloseModalAnalisis = () => setShowModalAnalisis(false);
    const [datosModalAnalisis, setDatosModalAnalisis] = useState(
        {
            title: '',
            body: ''
        }
    );

    //Para pintar modal de descargas
    function renderModalDownload(items) {
        setDatosModalAnalisis({
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
        });
        setShowModalAnalisis(true);
    }

    const [identifyOption, setIdentifyOption] = useState();
    const [pdfContent, setPdfcontent] = useState();

    //Para agregar capas json al mapa cuando se sube un archivo
    const agregaFileJsonCapa = (capaFile, nombreFile) => {
        let nombreTemp = nombreFile.split(".")[0] + ` - ${(nombreFile.split(".")[1]).toUpperCase()} Cargada`;
        if (capasVisualizadas.some(capaVisual => capaVisual.nom_capa === nombreTemp)) {
            setDatosModalAnalisis({
                title: "Capa existente",
                body: "La capa ya se ha agregado anteriormente"
            });
            setShowModalAnalisis(true);
            return;
        } else {
            let capaJson = {}
            capaJson["nom_capa"] = nombreTemp;
            capaJson["habilitado"] = true;
            capaJson['tipo'] = "json";
            capaJson['transparencia'] = 1;
            capaJson.estilos = {
                color: "#FFFFFF",
                fillColor: "#000000",
                opacity: "1",
                fillOpacity: "1"
            }
            capaJson['simbologia'] = creaSVG(nombreFile.split(".")[0], capaJson.estilos)
            // capaJson.isActive = false;
            capaJson["features"] = capaFile.features;
            setZIndex(zIndexCapas + 1)
            referenciaMapa.createPane(`${zIndexCapas}`)
            referenciaMapa.getPane(`${zIndexCapas}`).style.zIndex = numeroIndex + capasVisualizadas.length;
            let layer = L.geoJSON(capaFile, {
                pane: `${zIndexCapas}`,
                style: capaJson.estilos,
                nombre: capaJson["nom_capa"],
                interactive: false,
                // onEachFeature: function (feature = {}, layerPadre) {
                //     layerPadre.on('click', function () {
                //         feature.properties["nombre_capa"] = layerPadre.options["nombre"];
                //         setRasgos([feature.properties]);
                //     })
                // }
            });
            capaJson['layer'] = layer;
            setCapasVisualizadas([capaJson, ...capasVisualizadas])
            referenciaMapa.addLayer(layer);
            setDatosModalAnalisis({
                title: "Capa agregada",
                body: "La capa se ha agregado con exito"
            });
            setShowModalAnalisis(true);
        }
    }

    //Cuando se agrega una capa kml o kmz cuando se sube un archivo
    const agregaFileKML = (capa, nombreFile) => {
        let nombreTemp = nombreFile.split(".")[0] + ` - ${(nombreFile.split(".")[1]).toUpperCase()} Cargada`;
        if (capasVisualizadas.some(capaVisual => capaVisual.nom_capa === nombreTemp)) {
            setDatosModalAnalisis({
                title: "Capa existente",
                body: "La capa ya se ha agregado anteriormente"
            });
            setShowModalAnalisis(true);
            return;
        } else {
            let capaKml = {};
            capaKml["nom_capa"] = nombreTemp;
            capaKml["habilitado"] = true;
            capaKml['transparencia'] = 1;
            capaKml['tipo'] = "kml";
            capaKml.estilos = {
                color: "#00FFFF",
                fillColor: "#007777",
                opacity: "1",
                fillOpacity: "1",
            }
            capaKml['simbologia'] = creaSVG(nombreFile.split(".")[0], capaKml.estilos)
            setZIndex(zIndexCapas + 1)
            referenciaMapa.createPane(`${zIndexCapas}`)
            referenciaMapa.getPane(`${zIndexCapas}`).style.zIndex = numeroIndex + capasVisualizadas.length;
            /* Si se usa KML */
            let parser = new DOMParser();
            let kml = parser.parseFromString(capa, 'text/xml');
            let layer = new L.KML(kml);
            layer.setStyle({ pane: `${zIndexCapas}`, ...capaKml.estilos, interactive: false })
            //Para poder borrar el pane
            layer.options = { pane: `${zIndexCapas}` }
            /* Si se usa omnivore */
            // let customLayer = L.geoJson(null, { pane: `${zIndexCapas}` });
            // let conpane = omnivore.kml.parse(capa, null, customLayer)
            /***************************/
            capaKml['layer'] = layer;

            setCapasVisualizadas([capaKml, ...capasVisualizadas])
            referenciaMapa.addLayer(layer)
            setDatosModalAnalisis({
                title: "Capa agregada",
                body: "La capa se ha agregado con exito"
            });
            setShowModalAnalisis(true);
        }
    }

    //Para subir archivos
    function processInputFile(event) {
        var fileType = event.target.files[0].name;
        fileType = fileType.substring(fileType.indexOf('.') + 1);
        switch (fileType) {
            case 'json':
                var fileReader = new FileReader();
                fileReader.readAsText(event.target.files[0], "UTF-8");
                fileReader.onload = loaded => {
                    // setFileUpload({ data: JSON.parse(loaded.target.result), type: fileType });
                    agregaFileJsonCapa(JSON.parse(loaded.target.result), event.target.files[0].name)
                };
                break;
            case 'kml':
                var fileReader = new FileReader();
                fileReader.readAsText(event.target.files[0], "UTF-8");
                fileReader.onload = loaded => {
                    // setFileUpload({ data: loaded.target.result, type: fileType });
                    agregaFileKML(loaded.target.result, event.target.files[0].name)
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
                                    // setFileUpload({ data: content, type: 'kml' });
                                    agregaFileKML(content, event.target.files[0].name)
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
                        // setFileUpload({ data: result, type: 'json' });
                        agregaFileJsonCapa(result, event.target.files[0].name);
                    });
                };
                break;
            default:
                setDatosModalAnalisis({
                    title: '¡Error!',
                    body: 'Archivo no soportado',
                });
                setShowModalAnalisis(true)
                break;
        }
    }

    const { register: registraIdentify, handleSubmit: handleSubmitIdentify, errors: errorsIdentify, setError: setErrorIdenfity } = useForm();
    const identificaCapa = (data) => {
        if (savedToIdentify.length != 0) {
            if (data.seleccion == "1") {
                setMuestraTablasCapasIdentificadas(savedToIdentify)
                prepareDataToExport(savedToIdentify, function (data) {
                    addToExportWithPivot(data, 1);
                    // generatePdf(savedToIdentify.length, function() {
                    //     console.log('pdfOk!!!');
                    //     console.log('pdfDocument!!!', pdfDocument);
                    // });
                });
            } else if (data.seleccion == "2") {
                getTopLayer(function (index) {
                    setSelectedToIdentify([savedToIdentify[index]]);
                    prepareDataToExport([savedToIdentify[savedToIdentify.length - 1]], function (data) {
                        addToExportWithPivot(data);
                        // generatePdf(1, function() {
                        //     console.log('pdfOk!!!');
                        //     console.log('pdfDocument!!!', pdfDocument);
                        // });
                    });
                });
            } else if (data.seleccion == "3") {
                includeActiveLayer(function (index, isActive) {
                    setSelectedToIdentify(isActive == true ? [savedToIdentify[index]] : []);
                    prepareDataToExport(isActive == true ? [savedToIdentify[index]] : [], function (data) {
                        addToExportWithPivot(data);
                        // generatePdf(1, function() {
                        //     console.log('pdfOk!!!');
                        //     console.log('pdfDocument!!!', pdfDocument);
                        // });
                    });
                });
            }
        } else {
            console.log("No se ha seleccionado nada")
        }
    }


    //Para activar o desactivar cursor para identificar las capas
    const [isIdentifyActive, setIdentify] = useState(false);
    //Para mostrar las capas identificadas
    const [muestraTablasCapasIdentificadas, setMuestraTablasCapasIdentificadas] = useState([])
    //Para guardar los datos de las capas a indentificar despues de seleccionar el tipo de seleccion
    const [savedToIdentify, setSavedToIdentify] = useState([]);


    //Valor del select para el identify
    const [selectedToIdentify, setSelectedToIdentify] = useState([]);

    //Para activar o desactivar el poligono (circulo) para dibujar
    const [polygonDrawer, setPolygonDrawer] = useState();
    useEffect(() => {
        if (polygonDrawer) {
            if (isIdentifyActive == true) {
                //Abre el modal de identificar
                handleShowModalIdentify();
                //activa la opcion de dibujar
                polygonDrawer.enable();
            } else {
                //Desactiva la opción de dibujar
                polygonDrawer.disable();
            }
        }
    }, [isIdentifyActive]);

    /************************************A BORRAR************************************/
    // function changeIdentifyType() {
    //     switch (parseInt(identifyOption)) {
    //         case 1:
    //             setSelectedToIdentify(savedToIdentify);
    //             prepareDataToExport(savedToIdentify, function (data) {
    //                 addToExportWithPivot(data);
    //                 // generatePdf(savedToIdentify.length, function() {
    //                 //     console.log('pdfOk!!!');
    //                 //     console.log('pdfDocument!!!', pdfDocument);
    //                 // });
    //             });
    //             break;
    //         case 2:
    //             getTopLayer(function (index) {
    //                 setSelectedToIdentify([savedToIdentify[index]]);
    //                 prepareDataToExport([savedToIdentify[savedToIdentify.length - 1]], function (data) {
    //                     addToExportWithPivot(data);
    //                     // generatePdf(1, function() {
    //                     //     console.log('pdfOk!!!');
    //                     //     console.log('pdfDocument!!!', pdfDocument);
    //                     // });
    //                 });
    //             });
    //             break;
    //         case 3:
    //             includeActiveLayer(function (index, isActive) {
    //                 setSelectedToIdentify(isActive == true ? [savedToIdentify[index]] : []);
    //                 prepareDataToExport(isActive == true ? [savedToIdentify[index]] : [], function (data) {
    //                     addToExportWithPivot(data);
    //                     // generatePdf(1, function() {
    //                     //     console.log('pdfOk!!!');
    //                     //     console.log('pdfDocument!!!', pdfDocument);
    //                     // });
    //                 });
    //             });
    //             break;
    //         default:
    //             console.log('parseInt(identifyOption): ', parseInt(identifyOption))
    //             break;
    //     }
    // }

    function includeActiveLayer(success) {
        var isActive = false;
        var index;
        capasVisualizadas.filter(displayed => displayed.isActive == true).map((active) => {
            savedToIdentify.map((saved, index_) => {
                if (saved.layer == active.nom_capa) {
                    index = index_;
                    isActive = true;
                }
            });
        });
        success(index, isActive);
    }


    function getTopLayer(success) {
        var index;
        var topLayer = capasVisualizadas[0];
        savedToIdentify[0].map((saved, index_) => {
            if (saved.layer == topLayer.nom_capa) {
                index = index_;
            }
        });
        success(index);
    }

    //Funcion que prepara los datos de las capas identificadas para exportar en csv
    function prepareDataToExport(data, success) {
        var tempArray = [];
        data.map(capasSeparadas => {
            capasSeparadas.map(feature => {
                tempArray.push(feature)
            })
        })
        success(tempArray);
    }

    //Funcion para activar la capa como activa
    function enableLayer(index) {
        var tempArray = [];
        capasVisualizadas.map((capa, index_) => {
            capa.isActive = (index == index_);
            tempArray.push(capa);
        });
        setCapasVisualizadas(tempArray);
    }

    const [pdfDocument, setPdfDocument] = useState(<toPdf.Document></toPdf.Document>);
    const styles = toPdf.StyleSheet.create({
        page: {
            // flexDirection: 'row',
            backgroundColor: '#FFFFFF'
        },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 1
        }
    });

    function generatePdf(length, success) {
        var nodeMap = document.getElementById('id-export-Map');
        htmlToImage.toPng(nodeMap).then(function (dataUrlMap) {
            setTimeout(() => {
                generateTables(length, function (tables) {
                    setPdfDocument(//TODO revisar los errores del catch
                        <toPdf.Document>
                            <toPdf.Page size="A4" style={styles.page} wrap>
                                <toPdf.View style={styles.section}>
                                    <toPdf.Text>MAPA</toPdf.Text>
                                    <toPdf.Image src={dataUrlMap} />
                                </toPdf.View>
                                <toPdf.View style={styles.section}>
                                    <toPdf.Text>INFORMACIÓN DE RASGOS</toPdf.Text>
                                    {
                                        tables.map((table) => {
                                            <toPdf.Image src={table} />
                                        })
                                    }
                                </toPdf.View>
                            </toPdf.Page>
                        </toPdf.Document>
                    );
                    success();
                });
            }, 3000);
        }).catch(function (error) {
            console.log('errorMap: ', error);
            setDatosModalAnalisis({
                title: '¡Error!',
                body: 'No se pudó generar el contenido del PDF (mapa)',
            });
            setShowModalAnalisis(true)
        });
    }

    function generateTables(length, success) {
        var tables = [];
        for (var index = 0; index < length; index++) {
            var nodeTables = document.getElementById(`identify-table-${index}`);
            htmlToImage.toPng(nodeTables).then(function (dataUrlTables) {
                var img = new Image();
                img.src = dataUrlTables;
                document.body.appendChild(img);
                tables.push(dataUrlTables)
            }).catch(function (error) {
                console.log('errorTables: ', error);
                setDatosModalAnalisis({
                    title: '¡Error!',
                    body: 'No se pudó generar el contenido del PDF (tablas)',
                });
                setShowModalAnalisis(true)
            });
        }
        success(tables);
    }

    // useEffect(() => {
    //     if(selectedToIdentify.length > 0) {
    //         var nodeMap = document.getElementById('id-export-Map');
    //         htmlToImage.toPng(nodeMap).then(function (dataUrlMap) {
    //             setTimeout(() => {
    //                 generateTables(selectedToIdentify.length, function(tables) {
    //                     setPdfDocument(//TODO revisar los errores del catch
    //                         <toPdf.Document> 
    //                             <toPdf.Page size="A4" style={styles.page} wrap>
    //                                 <toPdf.View style={styles.section}>
    //                                     <toPdf.Text>MAPA</toPdf.Text>
    //                                     <toPdf.Image src={dataUrlMap}/>
    //                                 </toPdf.View>
    //                                 <toPdf.View style={styles.section}>
    //                                     <toPdf.Text>INFORMACIÓN DE RASGOS</toPdf.Text>
    //                                     {
    //                                         tables.map((table) => {
    //                                             <toPdf.Image src={table}/>
    //                                         })
    //                                     }
    //                                 </toPdf.View>
    //                             </toPdf.Page>
    //                         </toPdf.Document>
    //                     );
    //                 });
    //                 console.log('pdfOk!!!');
    //             }, 3000);
    //         }).catch(function (error) {
    //             console.log('errorMap: ', error);
    //             setDatosModalAnalisis({
    //                 title: '¡Error!',
    //                 body: 'No se pudó generar el contenido del PDF (mapa)',
    //             });
    //             setShowModalAnalisis(true)
    //         });
    //     }
    // }, [selectedToIdentify]);

    function generatePdf(items, success) {
        var nodeMap = document.getElementById('id-export-Map');
        var content;
        htmlToImage.toPng(nodeMap).then(function (dataUrlMap) {
            content =
                <toPdf.View style={styles.section}>
                    <toPdf.Text>MAPA</toPdf.Text>
                    <toPdf.Image src={dataUrlMap} />
                </toPdf.View>;
            console.log('items: ', items)
            items.map((item, index) => {
                var nodeTable = document.getElementById(`identify-table-${index}`);
                htmlToImage.toPng(nodeTable).then(function (dataUrlTables) {
                    var img = new Image();
                    img.src = dataUrlTables;
                    document.body.appendChild(img);
                    // content = content + 
                    //     <toPdf.View style={styles.section}>
                    //         <toPdf.Text>INFORMACIÓN DE RASGOS</toPdf.Text>
                    //         <toPdf.Image src={dataUrlTables}/>
                    //     </toPdf.View>;
                }).catch(function (error) {
                    console.log('errorTables: ', error);
                    setDatosModalAnalisis({
                        title: '¡Error!',
                        body: 'No se pudó generar el contenido del PDF',
                    });
                    setShowModalAnalisis(true)
                });
            });
            setPdfDocument(//TODO revisar los errores del catch
                <toPdf.Document>
                    <toPdf.Page size="A4" style={styles.page} wrap>
                        {content}
                    </toPdf.Page>
                </toPdf.Document>
            );
            success();
        }).catch(function (error) {
            setDatosModalAnalisis({
                title: '¡Error!',
                body: 'No se pudó generar el contenido del PDF',
            });
            setShowModalAnalisis(true)
        });
    }

    //Datos
    const [valoresSubtemasDatos, setValoresSubtemasDatos] = useState(false)
    const [valoresTablasDatos, setValoresTablasDatos] = useState(false)
    const temaDato = () => {
        setValoresSubtemasDatos(true)
    }
    const subtemaDatos = () => {
        setValoresTablasDatos(true)
    }

    //Consultas prediseñadas
    const [valoresConsultaConsultas, setValoresConsultaConsultas] = useState(false)
    const temaConsultas = () => {
        setValoresConsultaConsultas(true)
    }

    useEffect(() => {
        if (rasgos.length != 0) {
            addToExportWithPivot(rasgos, 0)
        }
    }, [rasgos]);

    //Para el movimiento de los dos mapas
    function enlaceMapa(tag, funcion) {
        if (tag == 'A') {
            sincronizaA = funcion
        } else {
            sincronizaB = funcion
        }
    }
    const sincronizaMapa = (tag, zoom, centro) => {
        if (tag == 'A') {
            sincronizaB(zoom, centro)
        } else {
            sincronizaA(zoom, centro)
        }
    }

    return (
        <>
            <ModalAnalisis
                show={showModalAnalisis}
                datos={datosModalAnalisis}
                onHide={handleCloseModalAnalisis}
            />

            <ModalAnalisis
                show={showModalAnalisis}
                datos={datosModalAnalisis}
                onHide={handleCloseModalAnalisis}
            />

            <ModalAnalisis
                show={showModalAnalisis}
                datos={datosModalAnalisis}
                onHide={handleCloseModalAnalisis}
            />

            <Modal show={showModalAgregarCapas} onHide={() => setShowModalAgregarCapas(!showModalAgregarCapas)}
                keyboard={false} className="modal-analisis" contentClassName="modal-redimensionable">
                <Modal.Header closeButton >
                    <Modal.Title><b>Agregar</b></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Tabs defaultActiveKey="sedatu">
                        <Tab eventKey="sedatu" title="Capa">
                            {
                                [
                                    conexionEndPointGetCapas == true ? (
                                        <Fragment key="1">
                                            <Button variant="link" onClick={cambiaBusquedaAvanzada}>{busquedaAvanzada == false ? "Búsqueda avanzada" : "Búsqueda básica"}</Button>
                                            {
                                                busquedaAvanzada == false ? (
                                                    <>
                                                        <p className="tw-mt-4"><b>Escoge un tema</b></p>
                                                        <div className="tw-flex tw-flex-wrap tw-justify-around">
                                                            {
                                                                listaMetadatosTemasCapasBackEnd.map((value, index) => (
                                                                    value.seleccionado ?
                                                                        <Button className="tw-mb-4 tw-border tw-border-black" variant="light" key={index} onClick={() => construyeCatalogoSubtemas(value.titulo)}>{value.titulo}</Button>
                                                                        :
                                                                        <Button className="tw-mb-4" variant="light" key={index} onClick={() => construyeCatalogoSubtemas(value.titulo)}>{value.titulo}</Button>
                                                                ))
                                                            }
                                                        </div>
                                                        <p><b>Escoge un subtema</b></p>
                                                        <div className="row">
                                                            <div className="col-6">
                                                                {
                                                                    listaMetadatosSubtemasCapasBackEnd.map((value, index) => (
                                                                        value.seleccionado ?
                                                                            <Button className="tw-block tw-mb-4 tw-border tw-border-black" variant="light" key={index} onClick={() => contruyeCatalogoTitulo(value.titulo)}>{value.titulo}</Button>
                                                                            :
                                                                            <Button className="tw-block tw-mb-4" variant="light" key={index} onClick={() => contruyeCatalogoTitulo(value.titulo)}>{value.titulo}</Button>
                                                                    ))
                                                                }
                                                            </div>
                                                            {
                                                                listaMetadatosTitulosCapasBackEnd.length != 0 && (
                                                                    <div className="col-6">
                                                                        <Form>
                                                                            <Form.Group controlId="lista-capas">
                                                                                <Form.Label>Selecciona una capa</Form.Label>
                                                                                <Form.Control custom as="select" htmlSize={listaMetadatosTitulosCapasBackEnd.length + 1} onChange={(e) => agregaCapaBusquedaIde(e)}>
                                                                                    {
                                                                                        listaMetadatosTitulosCapasBackEnd.map((valor, index) => (
                                                                                            <option key={index} value={JSON.stringify(valor)}>{valor.titulo}</option>
                                                                                        ))
                                                                                    }
                                                                                </Form.Control>
                                                                            </Form.Group>
                                                                        </Form>
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Form className="tw-mt-4 tw-mb-4" onSubmit={handleSubmitMetadatos(busquedaAvanzadaMetadatos)}>
                                                            <Form.Group controlId="palabra">
                                                                <Form.Label>Escribe la palabra a buscar</Form.Label>
                                                                <Form.Control type="text" name="palabra" required ref={registraMetadatos} />
                                                                {errorsMetadatos.palabra && <p className="tw-mt-4 tw-text-red-600">{errorsMetadatos.palabra.message}</p>}
                                                            </Form.Group>
                                                            <button className="btn-analisis" type="submit">BUSCAR</button>
                                                        </Form>
                                                        {
                                                            listaMetadatosTitulosBusquedaAvanzada.length != 0 && (
                                                                <Form key="2">
                                                                    <Form.Group controlId="lista-capas-metadatos">
                                                                        <Form.Label>Selecciona una capa</Form.Label>
                                                                        <Form.Control as="select" htmlSize={listaMetadatosTitulosBusquedaAvanzada.length + 1} custom onChange={(e) => agregaCapaBusquedaIde(e)}>
                                                                            {
                                                                                listaMetadatosTitulosBusquedaAvanzada.map((valor, index) => (
                                                                                    <option key={index} value={JSON.stringify(valor)}>{valor.titulo}</option>
                                                                                ))
                                                                            }
                                                                        </Form.Control>
                                                                    </Form.Group>
                                                                </Form>
                                                            )
                                                        }
                                                    </>
                                                )
                                            }
                                        </Fragment>
                                    ) : (
                                        <p key="2" className="tw-mt-4">Ha ocurrido un error, intente más tarde.</p>
                                    ),
                                    botonesAgregaCapaIdeWFSWMS[0] == true &&
                                    (
                                        <Form key="3" className="tw-mt-4" onSubmit={handleAgregaCapa(submitAgregaCapa)}>
                                            <p>Selecciona como quieres agregar esta capa</p>
                                            <input type="hidden" value={JSON.stringify(botonesAgregaCapaIdeWFSWMS[1])} name="capa" ref={registraAgregaCapa}></input>
                                            {
                                                botonesAgregaCapaIdeWFSWMS[1]["filtro_entidad"] != "" && (
                                                    <Form.Group>
                                                        <Controller
                                                            as={Typeahead}
                                                            control={controlAgregaCapa}
                                                            options={catalogoEntidades}
                                                            labelKey="entidad"
                                                            id="entidadesListado"
                                                            name="entidadAgregar"
                                                            defaultValue=""
                                                            placeholder="Selecciona una entidad"
                                                            clearButton
                                                            emptyLabel="No se encontraron resultados"
                                                        />
                                                        {
                                                            erroresAgregaCapa.entidadAgregar && <p className="tw-mt-4 tw-text-red-600">{erroresAgregaCapa.entidadAgregar.message}</p>
                                                        }
                                                    </Form.Group>
                                                )
                                            }
                                            <div className="tw-flex tw-flex-wrap tw-justify-around tw-mt-4">
                                                <Button variant="light" type="button" onClick={() => agregaCapaWMS(botonesAgregaCapaIdeWFSWMS[1], 0)}>Mosaico</Button>
                                                {
                                                    botonesAgregaCapaIdeWFSWMS[1].wfs != "" && (
                                                        <Button variant="light" type="submit">Elementos</Button>
                                                    )
                                                }
                                            </div>
                                        </Form>
                                    )
                                ]
                            }
                        </Tab>
                        <Tab eventKey="servicios" title="Servicio">
                            <Form className="tw-mt-4 tw-mb-4" onSubmit={handleAgregaServicio(agregaServicio)}>
                                <Form.Group controlId="urlServicio">
                                    <Form.Label>URL</Form.Label>
                                    <Form.Control type="url" name="urlServicio" ref={registraServicio} />
                                    <Form.Text muted>Agregue una URL de la siguiente manera "https://www.dominio.com/ows"</Form.Text>
                                    {errorsServicio.urlServicio && <p className="tw-mt-4 tw-text-red-600">{errorsServicio.urlServicio.message}</p>}
                                </Form.Group>
                                <button className="btn-analisis" type="submit">CONSULTAR</button>
                            </Form>
                            {
                                guardaServicio.length != 0 &&
                                <Form>
                                    <Form.Group>
                                        <Typeahead
                                            id="agregaServicioCapa"
                                            labelKey={(valores) => `${valores["Title"]}`}
                                            options={guardaServicio[0]}
                                            placeholder="Selecciona una capa"
                                            onChange={(servicio) => agregaCapaWMS(servicio, 1)}
                                            defaultValue=""
                                            clearButton
                                            paginationText="Desplegar más resultados"
                                            emptyLabel="No se encontraron resultados"
                                        />
                                    </Form.Group>
                                </Form>
                            }
                        </Tab>
                        <Tab eventKey="datos" title="Datos">
                            <Form className="tw-mt-4">
                                <Form.Group controlId="temasDatos">
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
                                    <Form.Group controlId="subtemasDatos">
                                        <Form.Label>Subtemas</Form.Label>
                                        <Form.Control onChange={subtemaDatos} as="select">
                                            <option value=""></option>
                                            <option>Subtema 1</option>
                                            <option>Subtema 2</option>
                                            <option>Subtema 3</option>
                                            <option>Subtema 4</option>
                                            <option>Subtema 5</option>
                                        </Form.Control>
                                    </Form.Group>
                                }
                                {
                                    valoresTablasDatos == true &&
                                    <Form.Group controlId="tablasDatos">
                                        <Form.Label>Tablas</Form.Label>
                                        <Form.Control as="select">
                                            <option value=""></option>
                                            <option>Tabla 1</option>
                                            <option>Tabla 2</option>
                                            <option>Tabla 3</option>
                                            <option>Tabla 4</option>
                                            <option>Tabla 5</option>
                                        </Form.Control>
                                    </Form.Group>
                                }
                                <button className="btn-analisis" type="submit">CONSULTAR</button>
                            </Form>
                        </Tab>
                        <Tab eventKey="consultas" title={<>Consultas<br />prediseñadas</>}>
                            <Form className="tw-mt-4">
                                <Form.Group controlId="temasConsultas">
                                    <Form.Label>Temas</Form.Label>
                                    <Form.Control onChange={temaConsultas} as="select">
                                        <option value=""></option>
                                        <option>Tema 1</option>
                                        <option>Tema 2</option>
                                        <option>Tema 3</option>
                                        <option>Tema 4</option>
                                        <option>Tema 5</option>
                                    </Form.Control>
                                </Form.Group>
                                {
                                    valoresConsultaConsultas == true &&
                                    <Form.Group controlId="consultaConsultas">
                                        <Form.Label>Consulta</Form.Label>
                                        <Form.Control as="select">
                                            <option value=""></option>
                                            <option>Consulta 1</option>
                                            <option>Consulta 2</option>
                                            <option>Consulta 3</option>
                                            <option>Consulta 4</option>
                                            <option>Consulta 5</option>
                                        </Form.Control>
                                    </Form.Group>
                                }
                            </Form>
                        </Tab>
                    </Tabs>
                </Modal.Body>
            </Modal >

            <Modal dialogAs={DraggableModalDialog} show={showModalSimbologia} backdrop={false} keyboard={false} contentClassName="modal-redimensionable"
                onHide={() => setShowModalSimbologia(!showModalSimbologia)} className="tw-pointer-events-none modal-analisis">
                <Modal.Header className="tw-cursor-pointer" closeButton>
                    <Modal.Title><b>Simbología</b></Modal.Title>
                    <button className="boton-minimizar-modal" onClick={(e) => minimizaModal(e)}>
                        {/* <img className="icono-minimizar tw-w-4" src="/images/analisis/window-minimize-regular.svg" /> */}
                        <FontAwesomeIcon icon={faWindowRestore} />
                    </button>
                </Modal.Header>
                <Modal.Body>
                    {
                        capasVisualizadas.map((capa, index) => (
                            capa.habilitado && (
                                <div key={index}>
                                    <p><b>{capa.nom_capa}</b></p>
                                    {
                                        capa.tipo == "wms" ? (
                                            <img src={capa.simbologia}></img>
                                        ) : (
                                            <img className="w-100" src={capa.simbologia}></img>
                                        )
                                    }
                                    <br></br>
                                    <br></br>
                                </div>
                            )
                        ))
                    }
                </Modal.Body>
            </Modal>

            <Modal dialogAs={DraggableModalDialog} show={showModalAtributos} backdrop={false} keyboard={false} contentClassName="modal-redimensionable"
                onHide={() => setShowModalAtributos(!showModalAtributos)} className="tw-pointer-events-none modal-analisis">
                <Modal.Header className="tw-cursor-pointer" closeButton >
                    <Modal.Title><b>Atributos</b></Modal.Title>
                    <button className="boton-minimizar-modal" onClick={(e) => minimizaModal(e)}>
                        <FontAwesomeIcon icon={faWindowRestore} />
                    </button>
                </Modal.Header>
                <Modal.Body>
                    {
                        atributos.length != 0 && (
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr className="tw-text-center">
                                        <th colSpan={Object.keys(atributos[0].properties).length}>{atributos[0].nombre_capa}</th>
                                    </tr>
                                    <tr>
                                        {
                                            Object.keys(atributos[0].properties).map((valueKey, indexKey) => {
                                                return (
                                                    <th key={indexKey}>{valueKey}</th>
                                                )
                                            })
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        atributos.map((value, index) => (
                                            <tr key={index}>
                                                {
                                                    Object.keys(value.properties).map((valueKey, indexKey) => {
                                                        return (
                                                            <td key={indexKey}>{value.properties[valueKey]}</td>
                                                        )
                                                    })
                                                }
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        )
                    }
                </Modal.Body>
            </Modal>

            <Modal dialogAs={DraggableModalDialog} show={showModalIdentify} backdrop={false} keyboard={false} contentClassName="modal-redimensionable"
                onHide={() => setShowModalIdentify(false)} className="tw-pointer-events-none modal-analisis">
                <Modal.Header className="tw-cursor-pointer" closeButton>
                    <Modal.Title><b>Identificar</b></Modal.Title>
                    <button className="boton-minimizar-modal" onClick={(e) => minimizaModal(e)}>
                        <FontAwesomeIcon icon={faWindowRestore} />
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitIdentify(identificaCapa)} className="row">
                        <Form.Group className="col-6">
                            <Form.Control as="select" name="seleccion" required ref={registraIdentify}>
                                <option value='' hidden>Aplicar a:</option>
                                <option value='1'>Todas</option>
                                <option value='2'>Superior</option>
                                <option value='3'>Activa</option>
                            </Form.Control>
                        </Form.Group>
                        <div className="col-6 tw-text-center">
                            <button className="btn-analisis" type="submit">APLICAR</button>
                        </div>
                    </Form>
                    {
                        muestraTablasCapasIdentificadas.length != 0 && (
                            <>
                                <div className="custom-modal-body">
                                    <div id="identify-tables">
                                        {
                                            muestraTablasCapasIdentificadas.map((selected, index) => (
                                                <div id={`identify-table-${index}`} key={index}>
                                                    <Table striped bordered hover>
                                                        <thead>
                                                            <tr className="tw-text-center">
                                                                <th colSpan={Object.keys(selected[0].properties).length}>{selected[0].nombre_capa}</th>
                                                            </tr>
                                                            <tr>
                                                                {
                                                                    Object.keys(selected[0].properties).map((header, index1) => (
                                                                        <th key={index1}>{header}</th>
                                                                    ))
                                                                }
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                selected.map((valorFeature, index2) => (
                                                                    <tr key={index2}>
                                                                        {
                                                                            Object.keys(valorFeature.properties).map((header_, index3) => (
                                                                                <td key={index3}>{valorFeature.properties[header_]}</td>
                                                                            ))
                                                                        }
                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            )
                                            )
                                        }
                                    </div>
                                </div>
                                <div className="custom-mx-t-1">
                                    <div className="d-flex justify-content-around">
                                        <OverlayTrigger overlay={<Tooltip>{`Exportar CSV`}</Tooltip>}>
                                            <CSVLink data={csvDataIdentificados} filename={`${csvFileName}.csv`}>
                                                <FontAwesomeIcon className="tw-text-titulo" size="4x" icon={faFileCsv} />
                                            </CSVLink>
                                        </OverlayTrigger>
                                        {/* <OverlayTrigger overlay={<Tooltip>{`Exportar PDF`}</Tooltip>}>
                                    <toPdf.PDFDownloadLink id="download-pdf" document={pdfDocument} fileName={`${csvFileName}.pdf`}>
                                        {
                                            ({ blob, url, loading, error }) =>
                                                loading ?
                                                    <FontAwesomeIcon className="tw-text-titulo" size="4x" icon={faFilePdf} /> :
                                                    <FontAwesomeIcon className="tw-text-titulo" size="4x" icon={faFilePdf} />
                                        }
                                    </toPdf.PDFDownloadLink>
                                </OverlayTrigger> */}
                                    </div>
                                </div>
                            </>
                        )
                    }
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
                                    rasgos.length != 0 &&
                                    <div className="col-3">
                                        <CSVLink data={csvData} filename={`${csvFileName}.csv`}>
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
                                                {valor["nombre_capa"]}
                                                <CustomToggle eventKey={index.toString()} />
                                            </Card.Header>
                                            <Accordion.Collapse eventKey={index.toString()}>
                                                <Table striped bordered hover>
                                                    <thead>
                                                        <tr>
                                                            <th key={index} colSpan="2" className="tw-text-center">{valor["id"]}</th>
                                                        </tr>
                                                        <tr>
                                                            <th>Valor</th>
                                                            <th>Descripción</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            Object.keys(valor.properties).map((key, indexKey) => (
                                                                <tr key={indexKey}>
                                                                    <td>{key}</td>
                                                                    <td>{valor.properties[key]}</td>
                                                                </tr>
                                                            ))
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
                                                                {
                                                                    [
                                                                        capa.isActive != undefined && (
                                                                            <OverlayTrigger key="1" overlay={<Tooltip>Establecer como activa</Tooltip>}>
                                                                                <Button onClick={() => enableLayer(index)} variant="link">
                                                                                    <FontAwesomeIcon icon={capa.isActive ? faCheckCircle : faDotCircle} />
                                                                                </Button>
                                                                            </OverlayTrigger>
                                                                        ),
                                                                        capa.tipo === "wfs" && (
                                                                            <Button key="2" onClick={() => muestraAtributos(capa)} variant="link">
                                                                                <FontAwesomeIcon icon={faTable} />
                                                                            </Button>
                                                                        )
                                                                    ]
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
                                                                        capa.download && (
                                                                            <>
                                                                                <hr />
                                                                                <div className="d-flex justify-content-center">
                                                                                    {
                                                                                        <a className="tw-text-titulo tw-font-bold tw-cursor-pointer" onClick={() => renderModalDownload(capa.download)}>
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
                <OverlayTrigger rootClose overlay={<Tooltip>Simbología</Tooltip>}>
                    <button className="botones-barra-mapa" onClick={handleShowModalSimbologia}>
                        <FontAwesomeIcon icon={faImages}></FontAwesomeIcon>
                    </button>
                </OverlayTrigger>
                <OverlayTrigger rootClose overlay={<Tooltip>Agregar capas</Tooltip>}>
                    <button className="botones-barra-mapa" onClick={handleShowModalAgregarCapas}>
                        <img src="/images/analisis/agregar-capas.png" alt="Agregar capas" className="tw-w-5" />
                    </button>
                </OverlayTrigger>
                <OverlayTrigger rootClose overlay={<Tooltip>Agregar archivo</Tooltip>}>
                    <label htmlFor={`uploadFIleButton${props.botones == false && `Espejo`}`} className="tw-mb-0 tw-cursor-pointer">
                        <button className="botones-barra-mapa tw-pointer-events-none">
                            <input type="file" name="file" onChange={(e) => processInputFile(e)} onClick={(e) => e.target.value = null} id={`uploadFIleButton${props.botones == false && `Espejo`}`} hidden />
                            <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>
                        </button>
                    </label>
                </OverlayTrigger>
                <OverlayTrigger rootClose overlay={<Tooltip>Identificar</Tooltip>}>
                    <button className="botones-barra-mapa" onClick={() => setIdentify(true)}>
                        <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>
                    </button>
                </OverlayTrigger>
                <OverlayTrigger rootClose overlay={<Tooltip>Paneo</Tooltip>}>
                    <button className="botones-barra-mapa" onClick={() => setIdentify(false)}>
                        <FontAwesomeIcon icon={faHandPaper}></FontAwesomeIcon>
                    </button>
                </OverlayTrigger>
            </div>
            {
                props.botones == true
                    ?
                    <Map referencia={capturaReferenciaMapa} funcionEnlace={enlaceMapa} sincronizaMapa={sincronizaMapa}
                        referenciaAnalisis={props.referenciaAnalisis}
                    />
                    :
                    <MapEspejo referencia={capturaReferenciaMapa} funcionEnlace={enlaceMapa} sincronizaMapa={sincronizaMapa}
                        referenciaAnalisis={props.referenciaAnalisis} />
            }
        </>
    )
}

export default React.memo(ContenedorMapaAnalisis)