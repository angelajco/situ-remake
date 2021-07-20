import React, { useState, useEffect, useContext, Fragment, createRef, useRef, useMemo } from 'react';
import { Controller, useForm } from "react-hook-form";
import { Form, Button, OverlayTrigger, Tooltip, Card, Accordion, Collapse, Table, AccordionContext, useAccordionToggle, Modal, Tabs, Tab } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaintBrush, faImages, faAngleDown, faCaretLeft, faFileCsv, faAngleRight, faTrash, faTable, faDownload, faCaretRight, faUpload, faInfoCircle, faHandPaper, faFilePdf, faCheckCircle, faDotCircle, faSquare, faCircle, faDrawPolygon, faGripLines, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
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

//Son algunos elementos para la funcionalidad de simbologia
import randomColor from 'randomcolor';
import Sim from './SimbologiaCapa';
import coloresPaletta from "../shared/jsons/colores.json";
import coloresJ from "../shared/jsons/ColoresSelect.json";
import TablaSimbologia from './TablaSimbologia';
import TablaLib from './TablaLibre';

import { ContextoCreadoFeature } from '../context/contextoFeatureGroupDibujadas'

import ConsultaDinamica from './ConsultaDinamica'

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
//son algunas variables para Simbologia
var jsonSimbologia = [];
var simbologiaF = {};
var colorB = [];
var omisionColor;

function ContenedorMapaAnalisis(props) {
    //------------------Betty-------------------------------
    //variables utilizadas para simbologia 
    //Funciones y variables para cambios de estilos
    var [valorEstilos, setValorEstilos] = useState()
    var [color, setColorFill] = useState('#FF7777')
    var [colorFill, setColorFill] = useState('#FF7777')
    var [colorborder, setColorBorder] = useState('#FF0000')
    /**PRUEBAS**/
    var [showModalEstilos, setShowModalEstilos] = useState(false)
    var [capaSeleccionada, setCapaSeleccionada] = useState(null)
    var [rango, setRango] = useState("")
    var [valoresCampo, setValoresCampo] = useState([])
    var [tipoTrata, setTipoTrata] = useState()
    var [tipoDiv, setTipoDiv] = useState(null)
    var [nomAtributos, setNomAtributos] = useState([])
    var [varSeleccionada, setVarSeleccionada] = useState(-1)
    var [auxSelect, setAuxSelect] = useState([])
    var [cuantil, setCuantil] = useState()
    var [tipoColor, setTipoColor] = useState()
    const [rangoAux, setRangoAux] = useState(null);
    const [intervalo, setIntervalo] = useState(null);
    let [varutil, setVarUtil] = useState();

    const trata = [
        { value: '1', label: 'Libre' },
        { value: '2', label: 'Valores unicos' },
        { value: '4', label: 'Cuantiles' },
        { value: '3', label: 'Rangos Equidistantes' },
        { value: '5', label: 'Rompimientos Naturales Jenks' }
    ];

    const cuantil1 = [
        { value: '1', label: 'Cuartiles' },
        { value: '2', label: 'Quintiles' },
        { value: '3', label: 'Deciles' }
    ];


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
        console.log('capaFusion: ', capaFusion);
        let capaNacional = {};
        capaNacional.titulo = capaFusion.titulo + " - Nacional";
        capaNacional.url = capaFusion.url;
        capaNacional.capa = capaFusion.nombre_capa;
        capaNacional.filtro_entidad = capaFusion.filtro_entidad;
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

    function testRef() {
        console.log('testRef');
    }

    //Para cuando se agrega una entidad
    const construyeEntidadCapa = (capaFusion, entidad) => {
        if (entidad != undefined) {
            let capaEntidad = {};
            capaEntidad.titulo = capaFusion.titulo + " - " + entidad.entidad;
            capaEntidad.url = capaFusion.url;
            capaEntidad.capa = capaFusion.nombre_capa;
            capaEntidad.filtro_entidad = capaFusion.filtro_entidad;
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
            capaWMS["format"] = "image/png"
            //fuente = 0, proviene de la IDE
            //fuente = 1, proviene de un servicio
            if (fuente == 0) {
                capaWMS["url"] = capa.url
                capaWMS["layers"] = capa["nombre_capa"]
                capaWMS["nom_capa"] = capa.titulo;
                capaWMS['simbologia'] = capa["leyenda_simb"];
                capaWMS["idCapaBack"] = capa["id_capa"]
                capaWMS['filtroMinimo'] = capa.filtro_minimo
                if (capa.wfs !== "") {
                    let url = `https://ide.sedatu.gob.mx:8080/wfs?request=GetFeature&service=WFS&version=1.0.0&typeName=${capaWMS.layers}&outputFormat=`
                    let download = [
                        { nom_capa: capaWMS.nom_capa, link: `${url}KML`, tipo: 'KML' },
                        { nom_capa: capaWMS.nom_capa, link: `https://ide.sedatu.gob.mx:8080/ows?service=WMS&request=GetMap&version=1.1.1&format=application/vnd.google-earth.kmz+XML&width=1024&height=1024&layers=${capaWMS.layers}&bbox=-180,-90,180,90`, tipo: 'KMZ' },
                        { nom_capa: capaWMS.nom_capa, link: `${url}SHAPE-ZIP`, tipo: 'SHAPE' }
                    ];
                    capaWMS.download = download;
                }
            } else if (fuente == 1) {
                capaWMS["url"] = guardaServicio[1]
                capaWMS["layers"] = capa[0].Name[0]
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
            let filtroDescarga = "";
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
                filtroDescarga = '&cql_filter=' + defaultParameters.cql_filter;
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
                    response['tipo'] = "wfs";
                    response['transparencia'] = 1;
                    response['simbologia'] = creaSVG(capaFiltrada.titulo, capaFiltrada.estilos)
                    response["idCapaBack"] = capaFiltrada["id_capa"]

                    let urlDescarga = `https://ide.sedatu.gob.mx:8080/wfs?request=GetFeature&service=WFS&version=1.0.0&typeName=${capaFiltrada.capa}${filtroDescarga}&outputFormat=`

                    response.download = [
                        { nom_capa: response.nom_capa, link: JSON.stringify(response), tipo: 'GeoJSON' },
                        { nom_capa: response.nom_capa, link: `${urlDescarga}KML`, tipo: 'KML' },
                        { nom_capa: response.nom_capa, link: `https://ide.sedatu.gob.mx:8080/ows?service=WMS&request=GetMap&version=1.1.1&format=application/vnd.google-earth.kmz+XML&width=1024&height=1024&layers=${capaFiltrada.capa}${filtroDescarga}&bbox=-180,-90,180,90`, tipo: 'KMZ' },
                        { nom_capa: response.nom_capa, link: `${urlDescarga}SHAPE-ZIP`, tipo: 'SHAPE' }
                    ];

                    response.isActive = false;
                    setZIndex(zIndexCapas + 1)
                    referenciaMapa.createPane(`${zIndexCapas}`)
                    referenciaMapa.getPane(`${zIndexCapas}`).style.zIndex = numeroIndex + capasVisualizadas.length;
                    obtenAliasFuncion(capaFiltrada["id_capa"], function (resultado) {
                        let layer = L.geoJSON(response, {
                            pane: `${zIndexCapas}`,
                            style: capaFiltrada.estilos,
                            nombre: response["nom_capa"],
                            onEachFeature: function (feature = {}, layerPadre) {
                                feature["nombre_capa"] = layerPadre.options["nombre"];
                                if (resultado !== null) {
                                    var current = capaFiltrada.valor_filtro == 2 ? `${feature.properties['CVE_ENT']}` : capaFiltrada.valor_filtro == 3 ? `${feature.properties['CVE_MUN']}` : `${feature.properties['CVE_ENT']}`;
                                    Object.keys(feature.properties).map(key => {
                                        let nuevoAlias = resultado.columnas.find(columna => columna.columna == key).alias
                                        if (nuevoAlias !== "") {
                                            let keyTemp = feature.properties[key]
                                            delete feature.properties[key]
                                            feature.properties[nuevoAlias] = keyTemp
                                        }
                                    })
                                    // console.log('dataToProps: ', props.informacionEspacial);
                                    if(props.informacionEspacial) {
                                        props.informacionEspacial.datos.map((data, index) => {
                                            if(layerPadre.options["nombre"].includes('Nacional')) {
                                                if(data[0] == current) {
                                                    props.informacionEspacial.columnas.filter(columna => columna[2] == true).map((column, index_) => {
                                                        feature.properties[column[1]] = data[column[3]];
                                                    })
                                                }
                                            } else {
                                                props.informacionEspacial.columnas.filter(columna => columna[2] == true).map((column, index_) => {
                                                    feature.properties[column[1]] = data[column[3]];
                                                })
                                            }
                                        })
                                        setDataToProps();
                                    }
                                }
                                layerPadre.on('click', function () {
                                    setRasgos([feature]);
                                })
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
                    })
                }
            });
        }
    }

    function obtenAliasFuncion(idCapa, resultado) {
        fetch(`${process.env.ruta}/wa0/atributos_capa01?id=${idCapa}`)
            .then(res => res.json())
            .then(
                (data) => resultado(data),
                (error) => resultado(null)
            );
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

        //esto es para eliminar los datos de memoria
        let index;
        for (let i = 0; i < jsonSimbologia.length; i++) {
            if (jsonSimbologia[i].name == capa.nom_capa) {
                // console.log(capa.nom_capa);
                index = i;
            }
        }
        jsonSimbologia.splice(index, 1);



    }



    //////////////////////////////////////Aqui empieza el codigo para cambiar la simbologia del

    ///---------------------Betty1--------------------------------------
    //aqui empiezan los codigos para simbologia
    const [simboAux, setSimboAux] = useState({});
    const cambioEstilos = (capa) => {
        let band = false;
        //con este metodo verificamos la capa seleccionada 
        //y si es wfs se puede editar
        if (capa.tipo == 'wfs' || capa.tipo == 'json') {
            //setAtributos([capa.features, capa.nom_capa])
            setCapaSeleccionada(capa);
            setShowModalEstilos(true)
            if (atributos != null) {
                setNomAtributos(Object.keys(capa.features[0].properties))
                setAuxSelect(Object.keys(capa.features[0].properties))
            }
            //buscamos la capa en el Json de configuracion 
            for (let i = 0; i < jsonSimbologia.length; i++) {
                if (jsonSimbologia[i].name == capa.nom_capa) {
                    setTipoTrata(jsonSimbologia[i].tipoTrata);
                    setCuantil(jsonSimbologia[i].cuantil);
                    setValorEstilos(jsonSimbologia[i].valorEstilos);
                    setVarSeleccionada(jsonSimbologia[i].varSeleccionada);
                    setTipoDiv(jsonSimbologia[i].tipoDiv);
                    setRango(jsonSimbologia[i].rango);
                    if (valorEstilos == 1) {
                        setRango("");
                        setSimboAux(jsonSimbologia[i]);
                        setIntervalo(null);
                    } else {
                        setIntervalo(jsonSimbologia[i].intervalo);
                    }
                    simbologiaF = jsonSimbologia[i].simbologia;
                    setNomAtributos(jsonSimbologia[i].nomAtributos);
                } else {
                    band = true;
                }
            }
            if (jsonSimbologia.length == 0) {
                band = true;
            }

            if (band == true) {
                setTipoTrata(null);
                setCuantil(null);
                setRango("");
                setValorEstilos(null);
                setVarSeleccionada(-1);
                setTipoDiv(null);
                simbologiaF = {};
                setTipoTrata(null);
                setNomAtributos([]);
                setVarUtil(null);
                setTipoColor(null);
            }
            setShowModalEstilos(true)
        } else {
            setShowModalEstilos(false)
        }
    }

    const [colorOmision, setColorOmision] = useState('#000000');
    function cambioColorO(e) {

        setColorOmision(e.target.value)
        omisionColor = e.target.value;
    }

    function generarT() {
        let tab = document.getElementById("tablaR");
        if (tab != null) {
            tab.innerHTML = '';
            tab.innerHTML += simbologiaF.tablahtml(1);
        }

    }


    const handleChangeCuantil = selectedOption => {
        let opt;
        if (selectedOption[0] != null) {
            opt = selectedOption[0]['value'];
            setCuantil(selectedOption);
            // console.log(opt);
        } else {
            setCuantil(selectedOption);
            opt = -1;
        }
        //funcion para cambiar el tipo de division cantil, quintil, decil 

        if (opt == 1) {
            setTipoDiv("Cuartiles")
            tipoDiv = "Cuartiles";
            //console.log("Selecciono Cuartiles")
        } else {
            if (opt == 3) {
                setTipoDiv("Deciles")
                tipoDiv = "Deciles";
                //console.log("Selecciono Deciles")
            } else {
                if (opt == 2) {
                    setTipoDiv("Quintiles")
                    tipoDiv = "Quintiles";
                    //console.log("Quintiles")
                }
            }
        }
    }

    const handleChangeColores = selectedOption => {

        let op;
        //console.log(selectedOption)
        if (selectedOption[0] != null) {
            op = selectedOption[0]['value'];
            //setTipoColor(selectedOption);
            colorB = coloresPaletta[op].colores;
            aplicarEstilo();
            setTipoColor(selectedOption)
        } else {
            setTipoColor(selectedOption)
            op = -1;
        }


    }


    const handleChangeEstilo = selectedOption => {
        var option;
        if (selectedOption[0] != null) {
            option = selectedOption[0]['value'];
            setTipoTrata(selectedOption);
            //console.log(option);
        } else {
            setTipoTrata(selectedOption);
            option = -1;
        }

        nomAtributos = auxSelect;
        let nomAux = [];
        var aux = capaSeleccionada.features[0].properties
        setValorEstilos(option)
        if (option == '1') {
            let nomAux = [];
            tipoTrata = 'Libre'
            //se obtienen los nombres de variables a utilizar en este tipo de filtro number
            if (nomAux.length > 0) {
                nomAux.splice(0, nomAux.length);
            }

            for (let i = 0; i < nomAtributos.length; i++) {
                let json1 = {};
                var aux1 = typeof (aux[nomAtributos[i]]);
                if (aux1 == 'number') {
                    json1.value = i;
                    json1.label = nomAtributos[i]
                    nomAux.push(json1);
                }
            }
            //console.log(nomAux);
            setNomAtributos(nomAux);
            nomAtributos = nomAux;
            //console.log(nomAtributos);

        }
        if (option == '2') {
            let nomAux = [];
            //setTipoTrata("Valores Unicos")
            tipoTrata = 'Valores Unicos';
            if (nomAux.length > 0) {
                nomAux.splice(0, nomAux.length);
            }
            for (let i = 0; i < nomAtributos.length; i++) {
                let json1 = {};
                var aux1 = typeof (aux[nomAtributos[i]]);
                if (aux1 == 'string') {
                    json1.value = i;
                    json1.label = nomAtributos[i]
                    nomAux.push(json1);
                }
            }
            //setNomAtributos(nomAux);

            setNomAtributos(nomAux);
            nomAtributos = nomAux;
            //console.log(nomAtributos);

        }
        if (option == '3') {
            //setTipoTrata("Rangos Equidistantes")
            tipoTrata = 'Rangos Equidistantes';
            //se obtienen los nombres de variables a utilizar en este tipo de filtro number
            if (nomAux.length > 0) {
                nomAux.splice(0, nomAux.length);
            }
            for (let i = 0; i < nomAtributos.length; i++) {
                let json1 = {};
                var aux1 = typeof (aux[nomAtributos[i]]);
                if (aux1 == 'number') {
                    json1.value = i;
                    json1.label = nomAtributos[i]
                    nomAux.push(json1);
                }
            }
            setNomAtributos(nomAux);

        }
        if (option == '4') {
            //setTipoTrata("Cuantiles")
            tipoTrata = 'Cuantiles';
            if (nomAux.length > 0) {
                nomAux.splice(0, nomAux.length);
            }
            for (let i = 0; i < nomAtributos.length; i++) {
                let json1 = {};
                var aux1 = typeof (aux[nomAtributos[i]]);
                if (aux1 == 'number') {
                    json1.value = i;
                    json1.label = nomAtributos[i]
                    nomAux.push(json1);
                }
            }
            setNomAtributos(nomAux);
        }
        if (option == '5') {
            //setTipoTrata("Rompimientos Naturales de Jenks")
            tipoTrata = 'Rompimientos Naturales de Jenks';
            if (nomAux.length > 0) {
                nomAux.splice(0, nomAux.length);
            }
            for (let i = 0; i < nomAtributos.length; i++) {
                let json1 = {};
                var aux1 = typeof (aux[nomAtributos[i]]);
                if (aux1 == 'number') {
                    json1.value = i;
                    json1.label = nomAtributos[i]
                    nomAux.push(json1);
                }
            }
            setNomAtributos(nomAux);

        }

    };

    //funcion que captura el valor de numero de intervalos
    function cambioRango(rang) {
        rango = rang.target.value;
        setRango(rang.target.value);
    }

    //funcion que captura el valor de numero de intervalos
    //cuando es estilo libre


    function cambioRango1(rang) {
        setRangoAux(rang.target.value);
        setIntervalo(rang.target.value)
        simbologiaF = {};
        //generarTabla(rang.target.value);

    }

    //funcion para guardar el atributo sobre el que se va a trabajar 
    function campoUtilizado(campo) {

        if (campo[0] != undefined) {
            setVarUtil(campo);
            // console.log(campo[0].label + " "+campo[0].value );
            let aux2 = campo[0].label;
            varSeleccionada = campo[0].label;
            setVarSeleccionada(campo[0].label);
            //setAuxSelect(nomAtributos[campo])

            let valores = [];
            for (var i = 0; i < capaSeleccionada.features.length; i++) {
                var aux = capaSeleccionada.features[i].properties;
                // console.log(nomAtributos[aux2].label);
                if (capaSeleccionada.tipo == 'json') {

                }
                valores.push(aux[aux2]);

            }
            valores.sort(function (a, b) {
                return a - b;
            });
            // console.log(valores);
            valoresCampo = valores;
            setValoresCampo(valores);
            //console.log(nomAtributos[campo]);
            if (valorEstilos == 2) {
                aplicarEstilo();
            }
        } else {
            setVarUtil();
        }
    }

    function generarTabla(num) {
        // Obtener la referencia del elemento body
        var body = document.getElementById("tablaI");
        body.innerHTML = '';

        // Crea un elemento <table> y un elemento <tbody>
        var tabla = document.createElement("table");
        var tblBody = document.createElement("tbody");

        var tblhead = document.createElement("thead");
        var h1 = document.createElement("tr");

        var textoCelda = document.createTextNode("Valor Inicial");
        var celda = document.createElement("th");
        celda.appendChild(textoCelda);
        h1.appendChild(celda);
        tblhead.appendChild(h1);

        var celda1 = document.createElement("th");
        var textoCelda1 = document.createTextNode("Valor Final");
        celda1.appendChild(textoCelda1);
        h1.appendChild(celda1);
        tblhead.appendChild(h1);

        var celda1 = document.createElement("th");
        var textoCelda1 = document.createTextNode("Leyenda");
        celda1.appendChild(textoCelda1);
        h1.appendChild(celda1);
        tblhead.appendChild(h1);

        var celda1 = document.createElement("th");
        var textoCelda1 = document.createTextNode("Color");
        celda1.appendChild(textoCelda1);
        h1.appendChild(celda1);
        tblhead.appendChild(h1);

        var celda1 = document.createElement("th");
        var textoCelda1 = document.createTextNode("Borde");
        celda1.appendChild(textoCelda1);
        h1.appendChild(celda1);
        tblhead.appendChild(h1);


        tabla.appendChild(tblhead);
        let num1 = 0;
        // Crea las celdas
        for (var i = 0; i < num; i++) {
            // Crea las hileras de la tabla
            var hilera = document.createElement("tr");

            for (var j = 0; j < 5; j++) {
                // Crea un elemento <td> y un nodo de texto, haz que el nodo de
                // texto sea el contenido de <td>, ubica el elemento <td> al final
                // de la hilera de la tabla
                let celda = document.createElement("td");
                let input = document.createElement("input");
                if (j == 3 || j == 4) {
                    //var input = document.createElement("input");
                    input.setAttribute("type", "color");
                    input.setAttribute("id", "" + num1);
                } else {
                    input.setAttribute("type", "text");
                    input.setAttribute("id", "" + num1);
                    input.setAttribute('size', '7');
                }
                if (j == 5) {
                    input.setAttribute('size', '7');
                    input.setAttribute("type", "number");
                }
                num1++;

                celda.appendChild(input);
                hilera.appendChild(celda);
            }

            // agrega la hilera al final de la tabla (al final del elemento tblbody)
            tblBody.appendChild(hilera);
        }
        // posiciona el <tbody> debajo del elemento <table>
        tabla.appendChild(tblBody);
        // appends <table> into <body>
        body.appendChild(tabla);
        // modifica el atributo "border" de la tabla y lo fija a "2";
        tabla.setAttribute("class", "table-wrapper-scroll-y my-custom-scrollbar");
        tabla.setAttribute("id", "tab");

    }

    function shuffle(arr) {
        var i,
            j,
            temp;
        for (i = arr.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;
    };



    //funcion para aplicar el estilo
    function aplicarEstilo() {
        if (capaSeleccionada.tipo == 'wfs' || capaSeleccionada.tipo == 'json') {
            //console.log(valoresCampo);
            //verificamos que la capa se a wfs para poder editarla
            if (valorEstilos == 4) {
                if (tipoDiv == "Cuartiles") {
                    let colores = [];
                    let au1;
                    let sim1 = new Sim();
                    //generamos los colores apartir del seleccionado por el usuari0
                    if (colores.length > 0) {
                        colores.splice(0, colores.length);
                    }
                    colores = shuffle(colorB);
                    if (capaSeleccionada.features[0].geometry.type == 'Point') {
                        au1 = sim1.generaCuantiles(4, valoresCampo, colores, "Cuartil ", "#000000", 1, 5, 0);
                    }
                    if (capaSeleccionada.features[0].geometry.type == 'MultiLineString') {
                        au1 = sim1.generaCuantiles(4, valoresCampo, colores, "Cuartil ", "#000000", 1, 5, 1);
                    }
                    if (capaSeleccionada.features[0].geometry.type == 'MultiPolygon') {
                        au1 = sim1.generaCuantiles(4, valoresCampo, colores, "Cuartil ", "#000000", 1, 5, 2);
                    }
                    simbologiaF = au1;
                    setRangoAux(4);
                    sim1 = null;
                    //se deben guardar todas las configuraciones de la capa
                }//termina el estilo del cuartil

                if (tipoDiv == "Deciles") {
                    let colores = [];
                    let sim1 = new Sim();
                    let au1;
                    //generamos los colores apartir del seleccionado por el usuari0
                    if (colores.length > 0) {
                        colores.splice(0, colores.length);
                    }
                    colores = shuffle(colorB);//colores = randomColor({ count: 10, hue: colorFill });
                    //au1 = sim1.generaCuantiles(10, valoresCampo, colores, "Decil ", "#000000", 1, 5, 0);

                    if (capaSeleccionada.features[0].geometry.type == 'Point') {
                        au1 = sim1.generaCuantiles(10, valoresCampo, colores, "Decil ", "#000000", 1, 5, 0);
                    }
                    if (capaSeleccionada.features[0].geometry.type == 'MultiLineString') {
                        au1 = sim1.generaCuantiles(10, valoresCampo, colores, "Decil ", "#000000", 1, 5, 1);
                    }
                    if (capaSeleccionada.features[0].geometry.type == 'MultiPolygon') {
                        au1 = sim1.generaCuantiles(10, valoresCampo, colores, "Decil ", "#000000", 1, 5, 2);
                    }

                    setRangoAux(10);
                    simbologiaF = au1;
                    sim1 = null;
                    //se deben guardar todas las configuraciones de la capa
                }//se termina el estilo del decil
                if (tipoDiv == "Quintiles") {
                    let colores = [];
                    let sim1 = new Sim();
                    let au1;
                    //generamos los colores apartir del seleccionado por el usuari0
                    if (colores.length > 0) {
                        colores.splice(0, colores.length);
                    }
                    colores = shuffle(colorB);//colores = randomColor({ count: 5, hue: colorFill });

                    if (capaSeleccionada.features[0].geometry.type == 'Point') {
                        au1 = sim1.generaCuantiles(5, valoresCampo, colores, "Quintil ", "#000000", 1, 5, 0);
                    }
                    if (capaSeleccionada.features[0].geometry.type == 'MultiLineString') {
                        au1 = sim1.generaCuantiles(5, valoresCampo, colores, "Quintil ", "#000000", 1, 5, 1);
                    }
                    if (capaSeleccionada.features[0].geometry.type == 'MultiPolygon') {
                        au1 = sim1.generaCuantiles(5, valoresCampo, colores, "Quintil ", "#000000", 1, 5, 2);
                    }
                    // console.log(au1);
                    setRangoAux(5);
                    simbologiaF = au1;
                    //se aplica el estilo a la capa 
                    sim1 = null;
                    //se deben guardar todas las configuraciones de la capa
                }//termina opcion de Quintiles

            }
            if (valorEstilos == 1) {
                //codigo para implementar simbologia libre
                var layer = capaSeleccionada.layer;
                let lib = [];
                let json1;
                let rango1 = rangoAux;
                let auxI = 0;
                for (let i = 0; i < rango1; i++) { //ciclo para recorrer las filas del
                    for (let j = 0; j < 6; j++) {//ciclo que controla las columnas de la tabla 
                        let aux = document.getElementById(auxI);
                        //console.log(aux);
                        if (aux == null) {

                        } else {
                            if (aux.tagName == 'INPUT') {
                                lib.push(aux.value);
                            } else {
                                lib.push(aux.textContent);
                            }
                        }
                        auxI++;
                    }//termina for columnas
                }//termina for filas 
                let linea;
                if (capaSeleccionada.features[0].geometry.type == 'Point') {
                    linea = 0;
                }
                if (capaSeleccionada.features[0].geometry.type == 'MultiLineString') {
                    linea = 1;
                }
                if (capaSeleccionada.features[0].geometry.type == 'MultiPolygon') {
                    linea = 2;
                }
                let sim1 = new Sim();
                for (let i = 0; i < lib.length; i += 7) {
                    sim1.agregaRango(0, lib[i], lib[i + 1], lib[i + 3], lib[i + 2], lib[i + 4], lib[i + 5], lib[i + 6], linea);
                }

                simbologiaF = sim1;

                //codigo para mandar el color dependiendo del rango
                var layer = capaSeleccionada.layer;
                function restyleLayerL(propertyName) {
                    layer.eachLayer(function (featureInstanceLayer) {

                        var propertyValue = featureInstanceLayer.feature.properties[propertyName];
                        var myFillColor = sim1.getSimbologia(propertyValue);
                        //console.log(myFillColor);
                        if (myFillColor.tipo === 'default') {
                            featureInstanceLayer.setStyle({
                                fillColor: omisionColor,
                                color: colorOmision,
                                fillOpacity: myFillColor.fillOpacity,
                                weight: myFillColor.anchoBorde
                            });
                        } else {
                            featureInstanceLayer.setStyle({
                                fillColor: myFillColor.colorFill,
                                color: myFillColor.colorBorde,
                                fillOpacity: myFillColor.fillOpacity,
                                weight: myFillColor.anchoBorde
                            });
                        }

                    });
                }

                //se guarda la configuracion de la capa
                json1 = {};
                let bnd = false;
                if (jsonSimbologia.length != 0) {
                    for (let i = 0; i < jsonSimbologia.length; i++) {
                        if (jsonSimbologia[i].name == capaSeleccionada.nom_capa) {
                            console.log("se actualiza informacion");
                            jsonSimbologia[i].nomVariable = nomAtributos[varSeleccionada];
                            jsonSimbologia[i].varSeleccionada = varSeleccionada;
                            jsonSimbologia[i].simbologia = simbologiaF;
                            jsonSimbologia[i].valorEstilos = valorEstilos;
                            jsonSimbologia[i].tipoDiv = tipoDiv;
                            jsonSimbologia[i].tipoTrata = tipoTrata;
                            jsonSimbologia[i].rango = rango;
                            jsonSimbologia[i].intervalo = intervalo;
                            jsonSimbologia[i].cuantil = cuantil;
                            jsonSimbologia[i].nomAtributos = nomAtributos;
                        } else {
                            bnd = true;
                            //quiere decir que es una capa nueva
                        }
                    }
                } else {
                    json1.name = capaSeleccionada.nom_capa
                    json1.capa = capaSeleccionada;
                    json1.nomVariable = nomAtributos[varSeleccionada];
                    json1.varSeleccionada = varSeleccionada;
                    json1.simbologia = simbologiaF;
                    json1.valorEstilos = valorEstilos;
                    json1.tipoDiv = tipoDiv;
                    json1.tipoTrata = tipoTrata;
                    json1.rango = rango;
                    json1.intervalo = intervalo;
                    json1.cuantil = cuantil;
                    json1.nomAtributos = nomAtributos;
                    jsonSimbologia.push(json1);
                }

                if (bnd == true) {
                    json1.name = capaSeleccionada.nom_capa
                    json1.capa = capaSeleccionada;
                    json1.nomVariable = nomAtributos[varSeleccionada];
                    json1.varSeleccionada = varSeleccionada;
                    json1.simbologia = simbologiaF;
                    json1.valorEstilos = valorEstilos;
                    json1.tipoDiv = tipoDiv;
                    json1.tipoTrata = tipoTrata;
                    json1.rango = rango;
                    json1.intervalo = intervalo;
                    json1.cuantil = cuantil;
                    json1.nomAtributos = nomAtributos;
                    jsonSimbologia.push(json1);
                }
                //valores.push(aux[nomAtributos[aux2].label]);

                restyleLayerL(varutil[0].label);

                sim1 = null;
                setRango(null);
                setIntervalo(null);
                //se deben guardar todas las configuraciones de la capa
            }//termina estilo Libre

            //opcion para rangos equidistantes
            if (valorEstilos == 3) {
                // console.log("Rangos Equidistantes");
                var numRangos = rango;
                let limitesmay = [];
                let limitesmen = [];
                let colores = [];


                //se generan los colores para mostrar
                if (colores.length > 0) {
                    colores.splice(0, colores.length);
                }
                colores = shuffle(colorB);
                //colores = randomColor({ count: 10, hue: colorFill });
                //se ordena el array de valores
                valoresCampo.sort(function (a, b) { return a - b });

                var min = valoresCampo[0];
                var max = valoresCampo[valoresCampo.length - 1];
                var r = max - min;
                var d = (r + 1) / numRangos;
                limitesmen[0] = min;
                limitesmay[0] = min + d;
                for (let i = 1; i < numRangos; i++) {
                    limitesmay[i] = limitesmay[i - 1] + (d);
                    limitesmen[i] = limitesmay[i - 1];
                }
                let linea;
                if (capaSeleccionada.features[0].geometry.type == 'Point') {
                    linea = 0;
                }
                if (capaSeleccionada.features[0].geometry.type == 'MultiLineString') {
                    linea = 1;
                }
                if (capaSeleccionada.features[0].geometry.type == 'MultiPolygon') {
                    linea = 2;
                }

                let sim1 = new Sim();
                for (let i = 0; i < limitesmen.length; i++) {
                    sim1.agregaRango(0, Math.round(limitesmen[i]), Math.round(limitesmay[i]), colores[i], "Rango " + (i + 1), "#000000", 1, 5, linea);
                }

                simbologiaF = sim1;
                setRangoAux(numRangos);

                sim1 = null;
                //se deben guardar todas las configuraciones de la capa
            }

            if (valorEstilos == 2) {
                //se selecciono valores unicos 
                let unicos = [];
                let colores = [];
                let sim1 = new Sim();
                if (unicos.length > 0) {
                    unicos.splice(0, unicos.length);
                }
                //este codigo elimina los valores repetidos de una array dejando solo uno de cada uno 
                unicos = valoresCampo.reduce((acc, item) => {
                    if (!acc.includes(item)) {
                        acc.push(item);
                    }
                    return acc;
                }, [])

                if (colores.length > 0) {
                    colores.splice(0, colores.length);
                }
                for (let i = 0; i < unicos.length; i++) {
                    colores.push("#" + ((1 << 24) * Math.random() | 0).toString(16));
                }
                //colores = randomColor({ count: unicos.length, hue: colorFill });

                let linea;
                if (capaSeleccionada.features[0].geometry.type == 'Point') {
                    linea = 0;
                }
                if (capaSeleccionada.features[0].geometry.type == 'MultiLineString') {
                    linea = 1;
                }
                if (capaSeleccionada.features[0].geometry.type == 'MultiPolygon') {
                    linea = 2;
                }
                for (let i = 0; i < unicos.length; i++) {
                    sim1.agregaRango(0, unicos[i], 0, colores[i], unicos[i], "#000000", 1, 5, linea);
                }

                simbologiaF = sim1;
                setRangoAux(unicos.length);

                sim1 = null;

            }//termina opcion valores unicos
            if (valorEstilos == 5) {
                //opcion para rupturas Naturales
               
                let colores = [];
                let au1;
                let sim = new Sim();
                let aux22 = jenks(valoresCampo, 5);
             
                //generamos los colores apartir del seleccionado por el usuari0
                if (colores.length > 0) {
                    colores.splice(0, colores.length);
                }
                colores = shuffle(colorB);
                if (capaSeleccionada.features[0].geometry.type == 'Point') {
                    for (let i = 0; i < aux22.length - 1; i++) {
                        sim.agregaRango(0, aux22[i], aux22[i + 1], colores[i], "Clase " + (i+1), "#000000", 1, 5, 0);
                    }
                }
                if (capaSeleccionada.features[0].geometry.type == 'MultiLineString') {
                    for (let i = 0; i < aux22.length - 1; i++) {
                        sim.agregaRango(0, aux22[i], aux22[i + 1], colores[i], "Clase " + (i+1), "#000000", 1, 5, 1);
                    }
                }
                if (capaSeleccionada.features[0].geometry.type == 'MultiPolygon') {
                    for (let i = 0; i < aux22.length - 1; i++) {
                        sim.agregaRango(0, aux22[i], aux22[i + 1], colores[i], "Clase " + (i+1), "#000000", 1, 5, 2);
                    }
                }


                simbologiaF = sim;
                setRangoAux(5);

                sim = null;
            }//termina Rupturas naturales
        }

    }

    function leerTabla(aux) {
        if (aux == 0) {
            //cuando es estilo libre
            //funcion que actualiza la tabla de simbologia
            if ($('#tablaR').is(':empty') == false) {
                let actuali = [];
                //indica previsualizacion y requiere actualizar simbologia
                var table = document.getElementById('tablaR');
                let cells = table.getElementsByTagName('tr');
                for (let i = 0, len = cells.length; i < len; i++) {
                    let fila = cells[i].getElementsByTagName('td');
                    for (let j = 0; j < fila.length; j++) {
                        //console.log(fila[j].innerText);
                        actuali.push(fila[j].children[0].value);
                    }
                }
                //console.log(actuali);
                return actuali;
            }
        } else {
            //funcion que actualiza la tabla de simbologia
            if ($('#tablaR').is(':empty') == false) {
                //Betty7
                let actuali = [];
                let rango1 = rangoAux;
                let auxI = 0;
                for (let i = 0; i < rango1; i++) { //ciclo para recorrer las filas del
                    for (let j = 0; j < 8; j++) {//ciclo que controla las columnas de la tabla 
                        let aux = document.getElementById(auxI);
                        //console.log(aux);
                        if (aux == null) {

                        } else {
                            if (aux.tagName == 'INPUT') {
                                actuali.push(aux.value);
                            } else {
                                actuali.push(aux.textContent);
                            }
                        }
                        auxI++;
                    }//termina for columnas
                }//termina for filas 

                //se actualizaron los datos de los intervalos
                let sim1 = new Sim();
                for (let i = 0; i < actuali.length; i += 8) {
                    sim1.agregaRango(0, actuali[i], actuali[i + 1], actuali[i + 3], actuali[i + 2], actuali[i + 4], actuali[i + 5], actuali[i + 6], actuali[i + 7]);
                }

                simbologiaF = sim1;
                //console.log(simbologiaF);

            }
        }


    }

    function aplicaEstiloF() {

        leerTabla();
        //console.log(varutil[0].label);
        //codigo para mandar el color dependiendo del rango
        var layer = capaSeleccionada.layer;
        if (capaSeleccionada.features[0].geometry.type == 'Point') {
            //estilo para capas tipo punto
            let capa1 = capaSeleccionada;
            //console.log(capa1);
            var layeraux = L.geoJSON(capa1, {
                pointToLayer: function (feature, latlng) {
                    //console.log(feature.properties[nomAtributos[varSeleccionada]]);

                    var propertyValue = feature.properties[varutil[0].label];
                    var aux1 = simbologiaF.getSimbologia(propertyValue);
                    //console.log(aux1);
                    return L.circleMarker(latlng, {
                        radius: aux1.radius,
                        fillColor: aux1.colorFill,
                        color: aux1.colorBorde,
                        weight: aux1.anchoBorde,
                        opacity: 1,
                        fillOpacity: 0.8
                    });

                }
            }).addTo(referenciaMapa);

            referenciaMapa.removeLayer(capaSeleccionada.layer);
            capaSeleccionada.layer = null;
            capaSeleccionada.layer = layeraux;

        }

        if (capaSeleccionada.features[0].geometry.type == 'MultiLineString') {
            //estilo para lineas
            let capa1 = capaSeleccionada;

            function estilosL(feature) {
                var propertyValue = feature.properties[varutil[0].label];
                var myFillColor = simbologiaF.getSimbologia(propertyValue);
                // console.log(myFillColor);
                return {
                    color: myFillColor.colorFill,
                    weight: myFillColor.anchoBorde,
                    opacity: myFillColor.opacity
                };
            }

            var layeraux = L.geoJSON(capa1, { style: estilosL }).addTo(referenciaMapa);

            referenciaMapa.removeLayer(capaSeleccionada.layer);
            capaSeleccionada.layer = null;
            capaSeleccionada.layer = layeraux;

        }

        function restyleLayerL(propertyName) {
            //layer.eachLayer(pointToLayer);
            layer.eachLayer(function (featureInstanceLayer) {
                //console.log(featureInstanceLayer.feature.geometry.type);
                if (featureInstanceLayer.feature.geometry.type == 'MultiPolygon') {
                    //se aplica estilo para poligonos
                    var propertyValue = featureInstanceLayer.feature.properties[propertyName];
                    var myFillColor = simbologiaF.getSimbologia(propertyValue);
                    if (myFillColor.tipo === 'default') {
                        featureInstanceLayer.setStyle({
                            fillColor: omisionColor,
                            color: colorOmision,
                            fillOpacity: myFillColor.fillOpacity,
                            weight: myFillColor.anchoBorde
                        });
                    } else {
                        featureInstanceLayer.setStyle({
                            fillColor: myFillColor.colorFill,
                            color: myFillColor.colorBorde,
                            fillOpacity: myFillColor.fillOpacity,
                            weight: myFillColor.anchoBorde
                        });
                    }
                }
            });
        }




        //se guarda la configuracion de la capa
        let json1 = {};
        let bnd = false;
        if (jsonSimbologia.length != 0) {
            for (let i = 0; i < jsonSimbologia.length; i++) {
                if (jsonSimbologia[i].name == capaSeleccionada.nom_capa) {
                    jsonSimbologia[i].nomVariable = nomAtributos[varSeleccionada];
                    jsonSimbologia[i].varSeleccionada = varSeleccionada;
                    jsonSimbologia[i].simbologia = simbologiaF;
                    jsonSimbologia[i].valorEstilos = valorEstilos;
                    jsonSimbologia[i].tipoDiv = tipoDiv;
                    jsonSimbologia[i].tipoTrata = tipoTrata;
                    jsonSimbologia[i].rango = rango;
                    jsonSimbologia[i].intervalo = intervalo;
                    jsonSimbologia[i].cuantil = cuantil;
                    jsonSimbologia[i].nomAtributos = nomAtributos;

                } else {
                    bnd = true;
                    //quiere decir que es una capa nueva
                }
            }
        } else {
            json1.name = capaSeleccionada.nom_capa
            json1.capa = capaSeleccionada;
            json1.nomVariable = nomAtributos[varSeleccionada];
            json1.varSeleccionada = varSeleccionada;
            json1.simbologia = simbologiaF;
            json1.valorEstilos = valorEstilos;
            json1.tipoDiv = tipoDiv;
            json1.tipoTrata = tipoTrata;
            json1.rango = rango;
            json1.intervalo = intervalo;
            json1.cuantil = cuantil;
            json1.nomAtributos = nomAtributos;
            jsonSimbologia.push(json1);
        }

        if (bnd == true) {
            json1.name = capaSeleccionada.nom_capa
            json1.capa = capaSeleccionada;
            json1.nomVariable = nomAtributos[varSeleccionada];
            json1.varSeleccionada = varSeleccionada;
            json1.simbologia = simbologiaF;
            json1.valorEstilos = valorEstilos;
            json1.tipoDiv = tipoDiv;
            json1.tipoTrata = tipoTrata;
            json1.rango = rango;
            json1.intervalo = intervalo;
            json1.cuantil = cuantil;
            json1.nomAtributos = nomAtributos;
            jsonSimbologia.push(json1);
        }

        //se aplica el estilo a la capa 
        restyleLayerL(varutil[0].label);
        //simbologiaF = {};
        //console.log(jsonSimbologia);

    }
    function jenksMatrices(data, n_classes) {
        // in the original implementation, these matrices are referred to
        // as `LC` and `OP`
        //
        // * lower_class_limits (LC): optimal lower class limits
        // * variance_combinations (OP): optimal variance combinations for all classes
        var lower_class_limits = [],
            variance_combinations = [],
            // loop counters
            i,
            j,
            // the variance, as computed at each step in the calculation
            variance = 0;

        // Initialize and fill each matrix with zeroes
        for (i = 0; i < data.length + 1; i++) {
            var tmp1 = [],
                tmp2 = [];
            for (j = 0; j < n_classes + 1; j++) {
                tmp1.push(0);
                tmp2.push(0);
            }
            lower_class_limits.push(tmp1);
            variance_combinations.push(tmp2);
        }

        for (i = 1; i < n_classes + 1; i++) {
            lower_class_limits[1][i] = 1;
            variance_combinations[1][i] = 0;
            // in the original implementation, 9999999 is used but
            // since Javascript has `Infinity`, we use that.
            for (j = 2; j < data.length + 1; j++) {
                variance_combinations[j][i] = Infinity;
            }
        }

        for (var l = 2; l < data.length + 1; l++) {
            // `SZ` originally. this is the sum of the values seen thus
            // far when calculating variance.
            var sum = 0,
                // `ZSQ` originally. the sum of squares of values seen
                // thus far
                sum_squares = 0,
                // `WT` originally. This is the number of
                w = 0,
                // `IV` originally
                i4 = 0;

            // in several instances, you could say `Math.pow(x, 2)`
            // instead of `x * x`, but this is slower in some browsers
            // introduces an unnecessary concept.
            for (var m = 1; m < l + 1; m++) {
                // `III` originally
                var lower_class_limit = l - m + 1,
                    val = data[lower_class_limit - 1];

                // here we're estimating variance for each potential classing
                // of the data, for each potential number of classes. `w`
                // is the number of data points considered so far.
                w++;

                // increase the current sum and sum-of-squares
                sum += val;
                sum_squares += val * val;

                // the variance at this point in the sequence is the difference
                // between the sum of squares and the total x 2, over the number
                // of samples.
                variance = sum_squares - (sum * sum) / w;

                i4 = lower_class_limit - 1;

                if (i4 !== 0) {
                    for (j = 2; j < n_classes + 1; j++) {
                        if (
                            variance_combinations[l][j] >=
                            variance + variance_combinations[i4][j - 1]
                        ) {
                            lower_class_limits[l][j] = lower_class_limit;
                            variance_combinations[l][j] =
                                variance + variance_combinations[i4][j - 1];
                        }
                    }
                }
            }

            lower_class_limits[l][1] = 1;
            variance_combinations[l][1] = variance;
        }

        return {
            lower_class_limits: lower_class_limits,
            variance_combinations: variance_combinations,
        };
    }

    function jenks(data, n_classes) {
        // sort data in numerical order
        data = data.slice().sort(function (a, b) {
            return a - b;
        });

        // get our basic matrices
        var matrices = jenksMatrices(data, n_classes),
            // we only need lower class limits here
            lower_class_limits = matrices.lower_class_limits,
            k = data.length - 1,
            kclass = [],
            countNum = n_classes;

        // the calculation of classes will never include the upper and
        // lower bounds, so we need to explicitly set them
        kclass[n_classes] = data[data.length - 1];
        kclass[0] = data[0];

        // the lower_class_limits matrix is used as indexes into itself
        // here: the `k` variable is reused in each iteration.
        while (countNum > 1) {
            kclass[countNum - 1] = data[lower_class_limits[k][countNum] - 2];
            k = lower_class_limits[k][countNum] - 1;
            countNum--;
        }

        return kclass;
    }

    ///////////////////////////////////Termina el codigo para cambiar la simbologia


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
                if (fuenteProveniente == 0) {
                    //proviene de rasgos
                    setCsvData(csvData_);
                } else if (fuenteProveniente == 1) {
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


    function ajaxJson(nomLayers, nombre, entidad) {
        let filtroPeticion = ""
        let url = `https://ide.sedatu.gob.mx:8080/ows?service=WFS&version=2.0&request=GetFeature&typeName=${nomLayers}&outputFormat=text/javascript&format_options=callback:getJson`
        if (entidad != undefined) {
            filtroPeticion = '&cql_filter=CVE_ENT=' + "'" + entidad[0].id + "'";
            url = url + filtroPeticion;
            nombre = nombre + " - " + entidad[0].entidad + " (GeoJson)"
        } else {
            nombre = nombre + " (GeoJson)"
        }
        $.ajax({
            jsonpCallback: 'getJson',
            url: url,
            dataType: 'jsonp',
            success: function (response) {
                setShowModalJson(false)
                setDatosModalAnalisis({
                    title: `Descarga lista`,
                    body:
                        <ul>
                            <li>
                                <a className="tw-font-bold tw-text-black"
                                    href={`data:text/json;charset=utf-8, ${encodeURIComponent(JSON.stringify(response))}`}
                                    download={`${nombre}.json`}>GeoJson generado</a>
                            </li>
                        </ul >
                    ,
                });
                setShowModalAnalisis(true);
            }
        })
    }
    const { register: agregaJson, handleSubmit: handleAgregaJson, control: controlJson, errors: errorsJson, setError: setErrorJson } = useForm();

    function submitAgregaJson(data) {
        if (data.filtro == "0") {
            if (data.entidadJson != undefined && data.entidadJson.length != 0) {
                ajaxJson(data.layers, data.nombre, data.entidadJson)
            } else {
                ajaxJson(data.layers, data.nombre)
            }
        } else if (data.filtro == "5") {
            if (data.entidadJson != undefined && data.entidadJson.length != 0) {
                ajaxJson(data.layers, data.nombre, data.entidadJson)
            } else {
                setErrorJson("entidadJson", {
                    message: "Debes seleccionar una entidad"
                })
            }
        }
    }

    //Para las descargas como Json
    const [capaJson, setCapaJson] = useState([])
    const [showModalJson, setShowModalJson] = useState(false)

    function descargaWmsComoWms(capa) {
        setShowModalAnalisis(false)
        setCapaJson(capa)
        setShowModalJson(true)
    }

    //Para pintar modal de descargas
    function renderModalDownload(capa) {
        let items = capa.download;
        setDatosModalAnalisis({
            title: `Descarga de ${items[0].nom_capa}`,
            body: <ul>
                {
                    [
                        capa.tipo == "wms" && (
                            <li key="1">
                                <a className="tw-font-bold tw-text-black tw-cursor-pointer" onClick={() => descargaWmsComoWms(capa)}>
                                    Procesar descarga como GeoJson
                                </a>
                            </li>
                        ),
                        items.map((item, index) => (
                            <li key={index}>
                                <a className="tw-font-bold tw-text-black" href={
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
                    ]
                }
            </ul >,
        });
        setShowModalAnalisis(true);
    }

    const [identifyOption, setIdentifyOption] = useState();
    const [pdfContent, setPdfcontent] = useState();

    //Para agregar capas json al mapa cuando se sube un archivo
    const agregaFileJsonCapa = (capaFile, nombreFile) => {
        var MarkerOptions = {
            radius: 5,
            fillColor: colorFill,
            color: color,
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };

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
                color: colorborder,
                fillColor: colorFill,
                opacity: 1,
                fillOpacity: 1,
                radius: 8,
                weight: 1
            }
            capaJson['simbologia'] = creaSVG(nombreFile.split(".")[0], capaJson.estilos)
            // capaJson.isActive = false;
            capaJson["features"] = capaFile.features;
            setZIndex(zIndexCapas + 1)
            referenciaMapa.createPane(`${zIndexCapas}`)
            referenciaMapa.getPane(`${zIndexCapas}`).style.zIndex = numeroIndex + capasVisualizadas.length;
            let layer = L.geoJSON(capaFile, {
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, MarkerOptions)
                },
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

    const [avisoNoSeleccion, setAvisoNoSeleccion] = useState("")

    const { register: registraIdentify, handleSubmit: handleSubmitIdentify, errors: errorsIdentify, setError: setErrorIdenfity } = useForm();
    const identificaCapa = (data) => {
        setMuestraTablasCapasIdentificadas([]);
        setAvisoNoSeleccion("")
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
                getTopLayer(function (arrayFeatures) {
                    if (arrayFeatures.length != 0) {
                        setMuestraTablasCapasIdentificadas([arrayFeatures])
                        prepareDataToExport([arrayFeatures], function (data) {
                            addToExportWithPivot(data, 1);
                            // generatePdf(1, function() {
                            //     console.log('pdfOk!!!');
                            //     console.log('pdfDocument!!!', pdfDocument);
                            // });
                        });
                    }
                });
            } else if (data.seleccion == "3") {
                includeActiveLayer(function (arrayFeatures) {
                    if (arrayFeatures.length != 0) {
                        setMuestraTablasCapasIdentificadas([arrayFeatures])
                        prepareDataToExport([arrayFeatures], function (data) {
                            addToExportWithPivot(data, 1);
                            // generatePdf(1, function() {
                            //     console.log('pdfOk!!!');
                            //     console.log('pdfDocument!!!', pdfDocument);
                            // });
                        });
                    }
                });
            }
        } else {
            setAvisoNoSeleccion("No se ha hecho ninguna selección")
        }
    }

    //Para mostrar las capas identificadas
    const [muestraTablasCapasIdentificadas, setMuestraTablasCapasIdentificadas] = useState([])
    //Para guardar los datos de las capas a indentificar despues de seleccionar el tipo de seleccion
    const [savedToIdentify, setSavedToIdentify] = useState([]);

    function includeActiveLayer(success) {
        let capaActiva = capasVisualizadas.find(displayed => displayed.isActive == true);
        var tempArray = []
        let tempFeaturesArray = []
        if (capaActiva != undefined && capaActiva.length != 0) {
            savedToIdentify.map(capasSeparadas => {
                capasSeparadas.map(feature => {
                    tempArray.push(feature)
                })
            })
            //Para guardar los features en un solo array
            tempArray.map(saved => {
                if (saved.nombre_capa == capaActiva.nom_capa) {
                    tempFeaturesArray.push(saved)
                }
            });
        }
        success(tempFeaturesArray);
    }

    //Obtiene la capa superior para la comparación de la identificación
    function getTopLayer(success) {
        var tempArray = []
        savedToIdentify.map(capasSeparadas => {
            capasSeparadas.map(feature => {
                tempArray.push(feature)
            })
        })
        //Para guardar los features en un solo array
        let tempFeaturesArray = []
        var capasWFS = capasVisualizadas.filter(capa => capa.tipo == "wfs");
        tempArray.map((valorSaved) => {
            if (valorSaved.nombre_capa == capasWFS[0].nom_capa) {
                tempFeaturesArray.push(valorSaved)
            }
        })
        success(tempFeaturesArray);
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

    useEffect(() => {
        if (props.referenciaEntidad) {
            refFunction(props.referenciaEntidad);
        }
    }, [props.referenciaEntidad]);

    function refFunction(referenciaEntidad) {
        var layers = [];
        referenciaEntidad.map(referencia => {
            var capa = arregloCapasBackEnd.find(elemento => elemento.id_capa == referencia.capa);
            setDataToProps(props.informacionEspacial);
            if (referencia != 'nacional') {
                var entidad = { id: (referencia.capa == 2 ? referencia.entity.id_entidades : referencia.capa == 3 ? referencia.entity.cve_mun : referencia.entity.Codigo), entidad: (referencia.capa == 2 ? referencia.entity.nombre_entidad : referencia.capa == 3 ? referencia.entity.nombre_mun : referencia.entity.Nombre) };
                capa.filtro_entidad = referencia.capa == 3 ? capa.filtro_municipio : capa.filtro_entidad;
                layers.push({capa: capa, entidad: entidad})
            } else {
                capa = arregloCapasBackEnd.find(elemento => elemento.id_capa == '2');
                capa.titulo = props.informacionEspacial.nombreTabla;
                construyeNacionalCapa(capa);
            }
        });
        construyeEntidadCapaCB(layers)
    }
    
    function construyeEntidadCapaCB(layers) {
        if (layers.length && layers[0].entidad != undefined) {
            let capaEntidad = {};
            capaEntidad.valor_filtro = '(';
            layers.map((layer, index) => {
                capaEntidad.valor_filtro = `${capaEntidad.valor_filtro}'${layer.entidad.id}'${layers.length == index + 1 ? ')' : ','}`;
            });
            capaEntidad.titulo = props.informacionEspacial.nombreTabla;
            capaEntidad.url = layers[0].capa.url;
            capaEntidad.capa = layers[0].capa.nombre_capa;
            capaEntidad.filtro_entidad = layers[0].capa.filtro_entidad;
            capaEntidad.wfs = layers[0].capa.wfs;
            capaEntidad.wms = layers[0].capa.wms;
            capaEntidad.opcion = 5;
            capaEntidad.estilos = {
                color: "#3366FF",
                fillColor: "#66CCFF",
                opacity: "1",
                fillOpacity: "1"
            }
            capaEntidad["id_capa"] = layers[0].capa.id_capa
            agregaCapaWFSCB(capaEntidad);
        }
    }

    function agregaCapaWFSCB(capaFiltrada){
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
            let filtroDescarga = "";
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
                defaultParameters.cql_filter = capaFiltrada.filtro_entidad + " IN" + capaFiltrada.valor_filtro;
                filtroDescarga = '&cql_filter=' + defaultParameters.cql_filter;
            }
            var parameters = L.Util.extend(defaultParameters);
            var url = capaFiltrada.url + L.Util.getParamString(parameters);
            console.log(url, "url")
            //Hace la petición para traer los datos de la entidad
            $.ajax({
                jsonpCallback: 'getJson',
                url: url,
                dataType: 'jsonp',
                success: function (response) {
                    response["nom_capa"] = capaFiltrada.titulo;
                    response["habilitado"] = true;
                    response['tipo'] = "wfs";
                    response['transparencia'] = 1;
                    response['simbologia'] = creaSVG(capaFiltrada.titulo, capaFiltrada.estilos)
                    response["idCapaBack"] = capaFiltrada["id_capa"]

                    let urlDescarga = `https://ide.sedatu.gob.mx:8080/wfs?request=GetFeature&service=WFS&version=1.0.0&typeName=${capaFiltrada.capa}${filtroDescarga}&outputFormat=`

                    response.download = [
                        { nom_capa: response.nom_capa, link: JSON.stringify(response), tipo: 'GeoJSON' },
                        { nom_capa: response.nom_capa, link: `${urlDescarga}KML`, tipo: 'KML' },
                        { nom_capa: response.nom_capa, link: `https://ide.sedatu.gob.mx:8080/ows?service=WMS&request=GetMap&version=1.1.1&format=application/vnd.google-earth.kmz+XML&width=1024&height=1024&layers=${capaFiltrada.capa}${filtroDescarga}&bbox=-180,-90,180,90`, tipo: 'KMZ' },
                        { nom_capa: response.nom_capa, link: `${urlDescarga}SHAPE-ZIP`, tipo: 'SHAPE' }
                    ];

                    response.isActive = false;
                    setZIndex(zIndexCapas + 1)
                    referenciaMapa.createPane(`${zIndexCapas}`)
                    referenciaMapa.getPane(`${zIndexCapas}`).style.zIndex = numeroIndex + capasVisualizadas.length;
                    obtenAliasFuncion(capaFiltrada["id_capa"], function (resultado) {
                        let layer = L.geoJSON(response, {
                            pane: `${zIndexCapas}`,
                            style: capaFiltrada.estilos,
                            nombre: response["nom_capa"],
                            onEachFeature: function (feature = {}, layerPadre) {
                                feature["nombre_capa"] = layerPadre.options["nombre"];
                                if (resultado !== null) {
                                    var current = capaFiltrada.id_capa == "2" ? `${feature.properties['CVE_ENT']}` : capaFiltrada.id_capa == "3" ? `${feature.properties['CVE_ENT']}${feature.properties['CVE_MUN']}` : `${feature.properties['CVE_ENT']}`;
                                    Object.keys(feature.properties).map(key => {
                                        let nuevoAlias = resultado.columnas.find(columna => columna.columna == key).alias
                                        if (nuevoAlias !== "") {
                                            let keyTemp = feature.properties[key]
                                            delete feature.properties[key]
                                            feature.properties[nuevoAlias] = keyTemp
                                        }
                                    })
                                    if(props.informacionEspacial) {
                                        props.informacionEspacial.datos.map((data, index) => {
                                                if(data[0] == current) {
                                                    props.informacionEspacial.columnas.filter(columna => columna[2] == true).map((column, index_) => {
                                                        feature.properties[column[1]] = data[column[3]];
                                                    })
                                                }
                                        })
                                        setDataToProps();
                                    }
                                }
                                layerPadre.on('click', function () {
                                    setRasgos([feature]);
                                })
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
                    })
                }
            });
        }
    }

    function buscarCapa(nombre) {
        for (let index = 0; index < jsonSimbologia.length; index++) {
            if (jsonSimbologia[index].name == nombre) {
                return index;
            }
        }
    }
    const [dataToProps, setDataToProps] = useState();

    // useEffect(() => {
    //     if (props.informacionEspacial != undefined) {
    //         setDataToProps(props.informacionEspacial);
    //     }
    // }, [props.informacionEspacial]);

    //Para mostrar las capas dibujadas
    const [modalCapasDibujadas, setModalCapasDibujadas] = useState();
    const [layersDibujadas, setLayersDibujadas] = useState([]);

    var arregloLayers = [];
    var iRectangulo = 0;
    var iCirculo = 0;
    var iPoligono = 0;
    var iLinea = 0;
    var iMarcador = 0;
    var iOtro = 0;

    const procesaDibujo = (dibujo) => {
        if (dibujo.layerType == "rectangle") {
            iRectangulo = iRectangulo + 1;
            dibujo.tipo = 0
            dibujo.nombre = `Rectangulo ${iRectangulo}`
        } else if (dibujo.layerType == "circle") {
            iCirculo = iCirculo + 1;
            dibujo.tipo = 1
            dibujo.nombre = `Circulo ${iCirculo}`
        } else if (dibujo.layerType == "polygon") {
            iPoligono = iPoligono + 1;
            dibujo.tipo = 2
            dibujo.nombre = `Poligono ${iPoligono}`
        } else if (dibujo.layerType == "polyline") {
            iLinea = iLinea + 1;
            dibujo.tipo = 3
            dibujo.nombre = `Linea ${iLinea}`
        } else if (dibujo.layerType == "marker") {
            iMarcador = iMarcador + 1;
            dibujo.tipo = 4
            dibujo.nombre = `Marcador ${iMarcador}`
        } else {
            iOtro = iOtro + 1;
            dibujo.tipo = 5
            dibujo.nombre = `Otra figura ${iOtro}`
        }
        dibujo.id = dibujo.layer._leaflet_id;
        dibujo.habilitado = true;
        arregloLayers.push(dibujo)
        setLayersDibujadas(arregloLayers)
    }

    const eliminaDibujo = (dibujo) => {
        let idArreglo = []
        for (var i in dibujo.layers._layers) {
            idArreglo.push(dibujo.layers._layers[i]._leaflet_id);
        }
        let nuevoArr = arregloLayers.filter(valor => !idArreglo.includes(valor.id))
        let arrDeleted = arregloLayers.filter(valor => idArreglo.includes(valor.id))
        arrDeleted.map(valor => {
            if(valor.tipo == 3 || valor.tipo == 4){
                if(valor.buffer){
                    referenciaMapa.removeLayer(valor.buffer)
                }
            }
        });
        arregloLayers = nuevoArr;
        setLayersDibujadas(arregloLayers)
    }

    useEffect(() => {
        if (capturoReferenciaMapa == true) {
            //Cuando se dibuja algo en el mapa
            referenciaMapa.on('draw:created', function (e) {
                procesaDibujo(e)
            });

            referenciaMapa.on('draw:deleted', function (e) {
                eliminaDibujo(e)
            });
        }
    }, [capturoReferenciaMapa])

    function checkCapaDibujada(figuraDibujada) {
        let capasDibujadasTemporal = layersDibujadas.map((valor) => {
            if (valor.nombre == figuraDibujada.nombre) {
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
            else {
                return valor;
            }
        });
        setLayersDibujadas(capasDibujadasTemporal);
    }

    const [checkedAll, setCheckedAll] = useState(true);

    function checkAllCapasDibujadas(e) {
        if (checkedAll == true) {
            setCheckedAll(false);
        } else {
            setCheckedAll(true);
        }
        let capasDibujadasTemporal = layersDibujadas.map((valor) => {
            if (e.target.checked == true) {
                valor.habilitado = true;
                referenciaMapa.addLayer(valor.layer);
                return valor;
            } else {
                valor.habilitado = false;
                referenciaMapa.removeLayer(valor.layer)
                return valor;
            }
        });
        setLayersDibujadas(capasDibujadasTemporal)
        setModalCapasDibujadas(false);
    }

    function obtenRasgosIdenCapaDib(figura) {
        let layerDibujada = figura.layer;
        let layerTipo = figura.layerType;
        let circlepoly;
        if (layerTipo === "circle") {
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
        }

        //Para rasgos
        let capasIntersectadas = [];
        //Para identificar
        let capasIntersectadasParaIdentificarSeparadas = [];
        referenciaMapa.eachLayer(function (layer) {
            if (layer instanceof L.GeoJSON) {
                //Para saber si no es un buffer, ya que estos se agregan como GeoJson
                if (!layer.options.hasOwnProperty("buffer")) {
                    //Arreglo temporal que se limpia cada vez que entra en una nueva capa Padre, para identificar
                    let tempCapasIdentificadasMismaCapa = []
                    layer.eachLayer(function (layerConFeatures) {
                        let seIntersectan;
                        seIntersectan = turf.intersect(layerConFeatures.toGeoJSON(), circlepoly ? circlepoly.toGeoJSON() : layerDibujada.toGeoJSON())
                        if (seIntersectan != null) {
                            if (circlepoly) {
                                //Guarda las capas identificadas de manera independiente
                                tempCapasIdentificadasMismaCapa.push(layerConFeatures.feature)
                            } else {
                                //Se guardan todos los features en el mismo arreglo, que se enviaran a rasgos
                                capasIntersectadas.push(layerConFeatures.feature)
                            }
                        }
                    })
                    //Si es identificar, vamos agregando las capas separadas en el arreglo
                    if (tempCapasIdentificadasMismaCapa.length != 0) {
                        capasIntersectadasParaIdentificarSeparadas.push(tempCapasIdentificadasMismaCapa)
                    }
                }
            }
        });
        //Si para rasgos hubo interseccion o para capas identificar
        if (capasIntersectadas.length != 0 || capasIntersectadasParaIdentificarSeparadas.length != 0) {
            if (circlepoly) {
                //Se guardan para despues indentificarse
                setSavedToIdentify(capasIntersectadasParaIdentificarSeparadas)
                handleShowModalIdentify();
            } else {
                setRasgos(capasIntersectadas);
            }
        }
        setModalCapasDibujadas(false);
    }

    function acercarAlejarCapaDib(figura, tipo) {
        let layer = figura.layer;
        if (tipo == 0) {
            referenciaMapa.fitBounds(layer.getBounds())
        } else if (tipo == 1) {
            let zoom = referenciaMapa.getZoom();
            let centro = layer.getBounds().getCenter();
            if (zoom == 5) {
                referenciaMapa.setView([centro.lat, centro.lng], 5)
            } else if (zoom == 6) {
                zoom = zoom - 1;
                referenciaMapa.setView([centro.lat, centro.lng], zoom)
            } else if (zoom >= 7) {
                zoom = zoom - 2
                referenciaMapa.setView([centro.lat, centro.lng], zoom)
            }
        }
        setModalCapasDibujadas(false);
    }

    function obtenDistanciaCapaDib(figura) {
        let layer = figura.layer;
        let distance = 0;
        let length = layer.getLatLngs().length;
        for (var i = 1; i < length; i++) {
            distance += layer.getLatLngs()[i].distanceTo(layer.getLatLngs()[i - 1]);
        }
        layer.bindTooltip(`<p class="text-center">Distancia:</p>
        <p>${new Intl.NumberFormat('en-US').format((distance / 1000))} km</p>
        <p>${new Intl.NumberFormat('en-US').format((distance))} m</p>`,
            { permanent: false, direction: "center" }).openTooltip()
        setModalCapasDibujadas(false);
    }

    function obtenAreaCapaDib(figura) {
        let layer = figura.layer;
        let area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
        layer.bindTooltip(`<p class="text-center">Área:</p><p>${new Intl.NumberFormat('en-US').format((area / 10000))} ha</p>
        <p>${new Intl.NumberFormat('en-US').format((area / 1000000))} km<sup>2</sup></p>
        <p>${new Intl.NumberFormat('en-US').format((area / 1000))} m<sup>2</sup></p>`,
            { permanent: false, direction: "center" }).openTooltip()
        setModalCapasDibujadas(false);
    }

    //Para el grupo de capas donde se guardan los dibujos
    const valorContextoFeature = useContext(ContextoCreadoFeature)

    function tamañoBuffer(e) {
        e.preventDefault();
        let padre = e.target
        let idTemp = $(padre).children(".idFigura");
        let id = idTemp[0].value;
        let tamanoTemp = $(padre).find(".tamano");
        let tamano = tamanoTemp[0].value;
        let figuraPosicion = layersDibujadas.findIndex(x => x.id == id);
        let figura = layersDibujadas[figuraPosicion]

        // let grupo = valorContextoFeature.valorFeature;
        let buffer = null;
        if (figura.buffer) {
            referenciaMapa.removeLayer(figura.buffer)
        }
        if (figura.layerType == "polyline") {
            let latLngs = figura.layer.getLatLngs();
            let arrayLatLngs = []
            for (var i in latLngs) {
                arrayLatLngs.push([latLngs[i].lng, latLngs[i].lat]);
            }
            let lineaString = turf.lineString(arrayLatLngs);
            buffer = turf.buffer(lineaString, tamano);
        } else if (figura.layerType == "marker") {
            let point = turf.point([figura.layer._latlng.lng, figura.layer._latlng.lat]);
            buffer = turf.buffer(point, tamano);
        }

        var bufferedLayer = L.geoJSON(buffer, { interactive: false });
        bufferedLayer.setZIndex = 0;
        bufferedLayer.options.buffer = true
        referenciaMapa.addLayer(bufferedLayer)
        // bufferedLayer.addTo(grupo);
        figura.buffer = bufferedLayer;

        let capasIntersectadas = []
        referenciaMapa.eachLayer(function (layer) {
            if (layer instanceof L.GeoJSON) {
                if (!layer.options.hasOwnProperty("buffer")) {
                    layer.eachLayer(function (layerConFeatures) {
                        let seIntersectan;
                        seIntersectan = turf.intersect(layerConFeatures.toGeoJSON(), buffer)
                        if (seIntersectan != null) {
                            capasIntersectadas.push(layerConFeatures.feature)
                        }
                    })
                }
            }
        });
        if (capasIntersectadas.length != 0) {
            setRasgos(capasIntersectadas);
        }
        setModalCapasDibujadas(false);
    }


    const handleClose = () => setShowModalEstilos(!showModalEstilos);

    const [mapState, setMapState] = useState();
    const [spaceData, setSpaceData] = useState();
    const [entityObject, setEntityObject] = useState();

    useEffect(() => {
        if(mapState) {
            if(mapState.entityObject.length > 0){
                props.setInformacionEspacial(mapState.spaceData);
                props.setReferenciaEntidad(mapState.entityObject);
            }
        }
    }, [mapState]);

    return (
        <>
            <ModalAnalisis
                show={showModalAnalisis}
                datos={datosModalAnalisis}
                onHide={handleCloseModalAnalisis}
            />

            {/* <Modal dialogAs={DraggableModalDialog} show={modalCapasDibujadas} onHide={() => setModalCapasDibujadas(!modalCapasDibujadas)}
                keyboard={false} backdrop="static" className="modal-analisis" contentClassName="modal-redimensionable" className="tw-pointer-events-none modal-analisis"> */}
            <Modal show={modalCapasDibujadas} onHide={() => setModalCapasDibujadas(!modalCapasDibujadas)}
                keyboard={false} backdrop="static" contentClassName="modal-redimensionable" className="tw-pointer-events-none modal-analisis">
                <Modal.Header className="tw-cursor-pointer" closeButton>
                    <Modal.Title>
                        Capas dibujadas
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        [
                            layersDibujadas.length != 0 && (
                                <Form key="0">
                                    <Form.Group controlId="checkAll">
                                        <Form.Check type="checkbox" label="Seleccionar todos" defaultChecked={checkedAll} onChange={(e) => checkAllCapasDibujadas(e)} />
                                    </Form.Group>
                                </Form>
                            ),
                            layersDibujadas.map((layer, index) => (
                                <div key={index} className="tw-mb-8">
                                    <Form className="tw-mb-2">
                                        <Form.Check>
                                            <Form.Check.Input type="checkbox" defaultChecked={layer.habilitado} onChange={() => checkCapaDibujada(layer)} />
                                            <Form.Check.Label>
                                                <span>{layer.nombre}&nbsp;</span>
                                                {
                                                    layer.tipo == 0 ? (
                                                        <FontAwesomeIcon size="1x" icon={faSquare} />
                                                    ) : layer.tipo == 1 ? (
                                                        <FontAwesomeIcon size="1x" icon={faCircle} />
                                                    ) : layer.tipo == 2 ? (
                                                        <FontAwesomeIcon size="1x" icon={faDrawPolygon} />
                                                    ) : layer.tipo == 3 ? (
                                                        <FontAwesomeIcon size="1x" icon={faGripLines} />
                                                    ) : layer.tipo == 4 && (
                                                        <FontAwesomeIcon size="1x" icon={faMapMarkerAlt} />
                                                    )
                                                }
                                            </Form.Check.Label>
                                        </Form.Check>
                                    </Form>
                                    <div>
                                        {
                                            (layer.tipo == 3 || layer.tipo == 4) && (
                                                <Form onSubmit={tamañoBuffer} className="tw-text-center formulario">
                                                    <input type="hidden" value={layer.id} className="idFigura" />
                                                    <Form.Group controlId="tamano" className="tw-mb-0">
                                                        <Form.Control name="tamano" className="tamano" type="number" step="any" required min={0.001} max={2000} placeholder="Ingresa un número entre 0.001 y 2000" />
                                                        <Form.Text className="text-muted">
                                                            El valor ingresado estára en kilometros
                                                        </Form.Text>
                                                    </Form.Group>
                                                    <Button type="submit" variant="light">Obtener buffer</Button>
                                                </Form>
                                            )
                                        }
                                    </div>
                                    <div className="tw-flex tw-justify-between tw-flex-wrap tw-mt-4">
                                        {
                                            [
                                                layer.tipo == 0 && (
                                                    <Button onClick={() => acercarAlejarCapaDib(layer, 0)} key="1" variant="light">Acercar</Button>
                                                ),
                                                layer.tipo == 0 && (
                                                    <Button onClick={() => acercarAlejarCapaDib(layer, 1)} key="2" variant="light">Alejar</Button>
                                                ),
                                                (layer.tipo == 0 || layer.tipo == 2) && (
                                                    <Button onClick={() => obtenRasgosIdenCapaDib(layer)} key="3" variant="light">Obtener rasgos</Button>
                                                ),
                                                (layer.tipo == 0 || layer.tipo == 2) && (
                                                    <Button onClick={() => obtenAreaCapaDib(layer)} key="4" variant="light">Obtener área</Button>
                                                ),
                                                layer.tipo == 3 && (
                                                    <Button onClick={() => obtenDistanciaCapaDib(layer)} key="5" variant="light">Obtener distancia</Button>
                                                ),
                                                layer.tipo == 1 && (
                                                    <Button onClick={() => obtenRasgosIdenCapaDib(layer)} key="6" variant="light">Identificar</Button>
                                                ),
                                                // (layer.tipo == 3 || layer.tipo == 4) && (
                                                //     <Button onClick={() => obtenerBuffer(layer)} key="7" variant="light">Obtener buffer</Button>
                                                // )
                                            ]
                                        }
                                    </div>
                                </div>
                            ))
                        ]
                    }
                </Modal.Body>
            </Modal>

            <Modal show={showModalJson} onHide={() => setShowModalJson(!showModalJson)} keyboard={false} backdrop="static" className="modal-analisis">
                {
                    capaJson.length != 0 && (
                        <>
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    {`Descarga de ${capaJson.nom_capa}`}
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form onSubmit={handleAgregaJson(submitAgregaJson)}>
                                    {
                                        capaJson.filtroMinimo == 0 ? (
                                            <p>Selecciona una entidad si quieres filtrar la capa</p>
                                        ) : (
                                            <p>Selecciona una entidad para filtrar la capa</p>
                                        )
                                    }
                                    <input type="hidden" value={capaJson.filtroMinimo} name="filtro" ref={agregaJson}></input>
                                    <input type="hidden" value={capaJson.layers} name="layers" ref={agregaJson}></input>
                                    <input type="hidden" value={capaJson.nom_capa} name="nombre" ref={agregaJson}></input>
                                    <Form.Group>
                                        <Controller
                                            as={Typeahead}
                                            control={controlJson}
                                            options={catalogoEntidades}
                                            labelKey="entidad"
                                            id="entidadJson"
                                            name="entidadJson"
                                            defaultValue=""
                                            placeholder="Selecciona una entidad"
                                            clearButton
                                            emptyLabel="No se encontraron resultados"
                                            className="tw-mb-4"
                                        />
                                        <div className="tw-text-center">
                                            {
                                                errorsJson.entidadJson && <p className="tw-text-red-600">{errorsJson.entidadJson.message}</p>
                                            }
                                            <Button variant="light" type="submit">Agregar</Button>
                                        </div>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                        </>
                    )
                }
            </Modal>

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
                        {
                            (props.setReferenciaEntidad && props.setInformacionEspacial) &&
                                <Tab eventKey="datos" title="Datos">
                                    <ConsultaDinamica mapState={setMapState}/>
                                    {/* <Form className="tw-mt-4">
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
                                    </Form> */}
                                </Tab>
                        }
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
                                            buscarCapa(capa.nom_capa) != undefined ? (
                                                <div dangerouslySetInnerHTML={{ __html: jsonSimbologia[buscarCapa(capa.nom_capa)].simbologia.tablaSimbologia() }} ></div>
                                            ) : (
                                                <img className="w-100" src={capa.simbologia}></img>
                                            )

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

            <Modal dialogAs={DraggableModalDialog} show={showModalEstilos} backdrop={false} keyboard={false} contentClassName="modal-redimensionable"
                onHide={handleClose} className="tw-pointer-events-none modal-analisis">
                <Modal.Header className="tw-cursor-pointer" closeButton >
                    <Modal.Title><b>Simbología</b></Modal.Title>
                    <button className="boton-minimizar-modal" onClick={(e) => minimizaModal(e)}>
                        <FontAwesomeIcon icon={faWindowRestore} />
                    </button>
                </Modal.Header>
                <Modal.Body className="tw-overflow-y-auto">
                    {/* inicia el cuerpo del modal de estilo />  BettyE*/}
                    {
                        capaSeleccionada == null ? (
                            //no se ha seleccionaado capa para edicion
                            <div className="row text-center">
                                <h1>Esta capa no puede editarse</h1>
                            </div>
                        ) : (
                            capaSeleccionada.tipo == "wfs" || capaSeleccionada.tipo == "json" ? (
                                //la capa puede editarse por el formato de origen
                                <Form id="cuerpo">
                                    <Form.Group controlId="tratamiento" className="col-10">
                                        <Form.Label>Tipo de tratamiento</Form.Label>
                                        <Typeahead
                                            id="tratamiento1"
                                            labelKey={"label"}
                                            options={trata}
                                            onChange={handleChangeEstilo}
                                            selected={tipoTrata}
                                            placeholder="Selecciona una opcion"
                                            clearButton
                                        />
                                    </Form.Group>
                                    {
                                        valorEstilos != null && (
                                            valorEstilos == 1 ? (
                                                //estilo libre 
                                                <div className="col-12">
                                                    <div className="row">
                                                        <Form.Group controlId="variable1" className="col-10">
                                                            <Form.Label>Variable a Utilizar</Form.Label>
                                                            {/*
                                                            <Form.Control as="select" htmlSize={nomAtributos.length + 1} custom onChange={(e) => campoUtilizado(e.target.value)}>
                                                                {
                                                                    nomAtributos.map((valor, index) => (
                                                                        <option key={index} value={valor}>{valor}</option>
                                                                    ))
                                                                }
                                                            </Form.Control>
                                                            */}
                                                            <Typeahead
                                                                id="variableUtil1"
                                                                labelKey={'label'}
                                                                options={nomAtributos}
                                                                placeholder="Selecciona una Variable"
                                                                onChange={(e) => campoUtilizado(e)}
                                                                selected={varutil}
                                                                clearButton
                                                            />
                                                            {/*
                                                                    <Form.Control onChange={(e) => campoUtilizado(e.target.value)} as="select">
                                                                        <option value="">Selecciona una opción</option>
                                                                    nomAtributos.map((aux, index) => <option key={aux} value={index}>{aux}</option>)
                                                                    </Form.Control>
                                                                */  }
                                                        </Form.Group>
                                                        <br></br>
                                                        <Form.Group controlId="intervalos1" className="col-10">
                                                            <Form.Label>Número de Intervalos</Form.Label>
                                                            <Form.Control type="number" value={intervalo} onChange={(e) => cambioRango1(e)} min="0" />
                                                        </Form.Group>
                                                        <br></br>
                                                        <div className="col-9">
                                                            <p><b>Simbologia por Omisión</b></p>
                                                        </div>
                                                        <div className="col-3">
                                                            <Form.Control type="color" value={colorOmision} onChange={(e) => cambioColorO(e)} />
                                                        </div>
                                                        <div id="tablaI">
                                                            <TablaLib rango={intervalo}></TablaLib>
                                                        </div>
                                                        <br></br>
                                                    </div>
                                                    <div className="row" id="contenedorT">
                                                        <TablaSimbologia info={simbologiaF} />

                                                    </div>
                                                    <div className="row align-items-center">
                                                        <Button className="btn btn-primary" onClick={aplicarEstilo}>Aplicar Estilo </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                valorEstilos == 4 ? (
                                                    //cuantiles
                                                    <div className="col-12">
                                                        <div className="row">
                                                            <Form.Group controlId="tratamiento2" className="col-10">
                                                                <Form.Label>División</Form.Label>
                                                                <Typeahead
                                                                    id="cuantiles"
                                                                    labelKey={"label"}
                                                                    options={cuantil1}
                                                                    onChange={handleChangeCuantil}
                                                                    selected={cuantil}
                                                                    placeholder="Selecciona una opcion"
                                                                    clearButton
                                                                />
                                                            </Form.Group>
                                                            <br></br>
                                                            <Form.Group controlId="variable2" className="col-10">
                                                                <Form.Label>Variable a Utilizar</Form.Label>
                                                                <Typeahead
                                                                    id="variableUtil2"
                                                                    labelKey={'label'}
                                                                    options={nomAtributos}
                                                                    placeholder="Selecciona una Variable"
                                                                    onChange={(e) => campoUtilizado(e)}
                                                                    selected={varutil}
                                                                    clearButton
                                                                />
                                                                {/*
                                                                <Form.Control onChange={(e) => campoUtilizado(e.target.value)} as="select">
                                                                    <option value="">Selecciona una opción</option>
                                                                    {
                                                                        nomAtributos.map((aux, index) => <option key={aux} value={index}>{aux}</option>)
                                                                    }
                                                                </Form.Control>
                                                                */}
                                                            </Form.Group>
                                                            <br></br>
                                                            <Form.Group controlId="coloresB" className="col-10">
                                                                <Form.Label>Color Base</Form.Label>
                                                                <Typeahead
                                                                    id="colores1"
                                                                    labelKey={"label"}
                                                                    options={coloresJ}
                                                                    onChange={handleChangeColores}
                                                                    selected={tipoColor}
                                                                    placeholder="Selecciona una opcion"
                                                                    clearButton
                                                                />
                                                            </Form.Group>
                                                            <br></br>
                                                            <br></br>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-8">
                                                                <p><b>Simbologia por Omisión</b></p>
                                                            </div>
                                                            <div className="col-3">
                                                                <Form.Control type="color" value={colorOmision} onChange={(e) => cambioColorO(e)} />
                                                            </div>
                                                        </div>
                                                        <div className="row" id="contenedorT">
                                                            <TablaSimbologia info={simbologiaF} />
                                                        </div>
                                                        <div className="row text-center">
                                                            <div className="col-6">
                                                                <Button className="btn btn-primary" onClick={generarT}>Previsualizar </Button>
                                                            </div>
                                                            <div className="col-6">
                                                                <Button className="btn btn-primary" onClick={aplicaEstiloF}>Aplicar Estilo </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    valorEstilos == 3 ? (
                                                        //Rangos Equidistantes
                                                        <div className="col-12">
                                                            <div className="row">
                                                                <Form.Group controlId="intervalos2" className="col-10">
                                                                    <Form.Label>Número de Intervalos</Form.Label>
                                                                    <Form.Control type="text" value={rango} onChange={(e) => cambioRango(e)} />
                                                                </Form.Group>
                                                                <br></br>
                                                                <Form.Group controlId="variable3" className="col-10">
                                                                    <Form.Label>Variable a Utilizar</Form.Label>
                                                                    <Typeahead
                                                                        id="variableUtil3"
                                                                        labelKey={'label'}
                                                                        options={nomAtributos}
                                                                        placeholder="Selecciona una Variable"
                                                                        onChange={(e) => campoUtilizado(e)}
                                                                        selected={varutil}
                                                                        clearButton
                                                                    />
                                                                    {/*
                                                                    <Form.Control onChange={(e) => campoUtilizado(e.target.value)} as="select">
                                                                        <option value="">Selecciona una opción</option>
                                                                        {
                                                                            nomAtributos.map((aux, index) => <option key={aux} value={index}>{aux}</option>)
                                                                        }
                                                                    </Form.Control>
                                                                    */}
                                                                </Form.Group>
                                                                <br></br>
                                                                <Form.Group controlId="coloresB" className="col-10">
                                                                    <Form.Label>Color Base</Form.Label>
                                                                    <Typeahead
                                                                        id="colore1"
                                                                        labelKey={"label"}
                                                                        options={coloresJ}
                                                                        onChange={handleChangeColores}
                                                                        selected={tipoColor}
                                                                        placeholder="Selecciona una opcion"
                                                                        clearButton
                                                                    />
                                                                </Form.Group>
                                                                <br></br>
                                                                <br></br>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-8">
                                                                    <p><b>Simbologia por Omisión</b></p>
                                                                </div>
                                                                <div className="col-3">
                                                                    <Form.Control type="color" value={colorOmision} onChange={(e) => cambioColorO(e)} />
                                                                </div>
                                                            </div>
                                                            <div className="row" id="contenedorT">
                                                                <TablaSimbologia info={simbologiaF} />
                                                            </div>
                                                            <div className="row text-center">
                                                                <div className="col-6">
                                                                    <Button className="btn btn-primary" onClick={generarT}>Previsualizar </Button>
                                                                </div>
                                                                <div className="col-6">
                                                                    <Button className="btn btn-primary" onClick={aplicaEstiloF}>Aplicar Estilo </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        valorEstilos == 2 ? (
                                                            //valores unicos
                                                            <div className="col-12">
                                                                <div className="row">
                                                                    <Form.Group controlId="variable3" className="col-10">
                                                                        <Form.Label>Variable a Utilizar</Form.Label>
                                                                        <Typeahead
                                                                            id="variableUtil"
                                                                            labelKey={'label'}
                                                                            options={nomAtributos}
                                                                            placeholder="Selecciona una Variable"
                                                                            onChange={(e) => campoUtilizado(e)}
                                                                            selected={varutil}
                                                                            clearButton
                                                                        />
                                                                        {/*
                                                                        <Form.Control onChange={(e) => campoUtilizado(e.target.value)} as="select">
                                                                            <option value="">Selecciona una opción</option>
                                                                            {
                                                                                nomAtributos.map((aux, index) => <option key={aux} value={index}>{aux}</option>)
                                                                            }
                                                                        </Form.Control>
                                                                        */}
                                                                    </Form.Group>
                                                                    <br></br>
                                                                    <br></br>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-8">
                                                                        <p><b>Simbologia por Omisión</b></p>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <Form.Control type="color" value={colorOmision} onChange={(e) => cambioColorO(e)} />
                                                                    </div>
                                                                </div>
                                                                <div className="row" id="contenedorT">
                                                                    <TablaSimbologia info={simbologiaF} />
                                                                    <div id="tablaR"></div>
                                                                </div>
                                                                <div className="row text-center">
                                                                    <div className="col-6">
                                                                        <Button className="btn btn-primary" onClick={generarT}>Previsualizar </Button>
                                                                    </div>
                                                                    <div className="col-6">
                                                                        <Button className="btn btn-primary" onClick={aplicaEstiloF}>Aplicar Estilo </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            valorEstilos == 5 ? (
                                                                <div className="col-12">
                                                                    <div className="row">
                                                                        <Form.Group controlId="variable4" className="col-10">
                                                                            <Form.Label>Variable a Utilizar</Form.Label>
                                                                            <Typeahead
                                                                                id="variableUtil"
                                                                                labelKey={'label'}
                                                                                options={nomAtributos}
                                                                                placeholder="Selecciona una Variable"
                                                                                onChange={(e) => campoUtilizado(e)}
                                                                                selected={varutil}
                                                                                clearButton
                                                                            />
                                                                        </Form.Group>
                                                                        <br></br>
                                                                        <br></br>
                                                                        <br></br>
                                                                        <Form.Group controlId="coloresB" className="col-10">
                                                                            <Form.Label>Color Base</Form.Label>
                                                                            <Typeahead
                                                                                id="colores1"
                                                                                labelKey={"label"}
                                                                                options={coloresJ}
                                                                                onChange={handleChangeColores}
                                                                                selected={tipoColor}
                                                                                placeholder="Selecciona una opcion"
                                                                                clearButton
                                                                            />
                                                                        </Form.Group>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-8">
                                                                            <p><b>Simbologia por Omisión</b></p>
                                                                        </div>
                                                                        <div className="col-3">
                                                                            <Form.Control type="color" value={colorOmision} onChange={(e) => cambioColorO(e)} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="row" id="contenedorT">
                                                                        <TablaSimbologia info={simbologiaF} />
                                                                        <div id="tablaR"></div>
                                                                    </div>
                                                                    <div className="row text-center">
                                                                        <div className="col-6">
                                                                            <Button className="btn btn-primary" onClick={generarT}>Previsualizar </Button>
                                                                        </div>
                                                                        <div className="col-6">
                                                                            <Button className="btn btn-primary" onClick={aplicaEstiloF}>Aplicar Estilo </Button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <p></p>
                                                            )
                                                        )
                                                    )
                                                )
                                            )
                                        )
                                    }
                                </Form>
                            ) : (
                                //la capa no puede editarse por el formato de origen 
                                <h1>No puede editarse</h1>
                            )
                        )
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
                        {
                            avisoNoSeleccion != "" && (
                                <div className="col-12">{avisoNoSeleccion}</div>
                            )
                        }
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
                                                                {
                                                                    capa.tipo === "wfs" || capa.tipo === 'json' ? (
                                                                        <Button onClick={() => cambioEstilos(capa)} variant="link">
                                                                            <FontAwesomeIcon icon={faPaintBrush} />
                                                                        </Button>) : (<div></div>)
                                                                }

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
                                                                                        <a className="tw-text-titulo tw-font-bold tw-cursor-pointer" onClick={() => renderModalDownload(capa)}>
                                                                                            <OverlayTrigger overlay={<Tooltip>{`Descargar capas`}</Tooltip>}>
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
                {/* <OverlayTrigger rootClose overlay={<Tooltip>Identificar</Tooltip>}> */}
                {/* <button className="botones-barra-mapa" onClick={() => setIdentify(true)}> */}
                {/* <button className="botones-barra-mapa" onClick={handleShowModalIdentify}>
                        <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>
                    </button>
                </OverlayTrigger> */}
                {/* <OverlayTrigger rootClose overlay={<Tooltip>Paneo</Tooltip>}>
                    <button className="botones-barra-mapa" onClick={() => setIdentify(false)}>
                        <FontAwesomeIcon icon={faHandPaper}></FontAwesomeIcon>
                    </button>
                </OverlayTrigger> */}
                <OverlayTrigger rootClose overlay={<Tooltip>Capas dibujadas</Tooltip>}>
                    <button className="botones-barra-mapa" onClick={() => setModalCapasDibujadas(true)}>
                        <img src="/images/analisis/capas_dib.png" alt="Capas dibujadas" className="tw-w-5" />
                    </button>
                </OverlayTrigger>
            </div>

            {
                props.botones == true
                    ?
                    <Map referencia={capturaReferenciaMapa} referenciaAnalisis={props.referenciaAnalisis} />
                    :
                    <MapEspejo referencia={capturaReferenciaMapa} referenciaAnalisis={props.referenciaAnalisis} />
            }
        </>
    )
}

export default React.memo(ContenedorMapaAnalisis)