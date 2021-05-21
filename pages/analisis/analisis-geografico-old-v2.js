import { useEffect, useState, useContext } from "react"
import { Controller, useForm } from "react-hook-form";
import { Form, Button, OverlayTrigger, Tooltip, Card, Accordion, Collapse, Table, AccordionContext, useAccordionToggle, Modal } from 'react-bootstrap'
import { DragDropContext, Droppable, Draggable, resetServerContext } from 'react-beautiful-dnd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faCheck, faAngleDown, faCaretLeft, faFileCsv, faAngleRight, faTrash, faTable, faDownload, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { faSquare } from '@fortawesome/free-regular-svg-icons'
import { CSVLink } from "react-csv";
import { Typeahead } from 'react-bootstrap-typeahead';

import 'react-bootstrap-typeahead/css/Typeahead.css';

import ContenedorMapaAnalisis from '../../components/ContenedorMapaAnalisis'
import ModalComponent from '../../components/ModalComponent'

import catalogoEntidades from "../../shared/jsons/entidades.json";

import $ from 'jquery'
import leafletPip from '@mapbox/leaflet-pip/leaflet-pip'
import * as turf from '@turf/turf'

//Obten referencia del mapa
var referenciaMapa = null;
function capturaReferenciaMapa(mapa) {
    referenciaMapa = mapa;
}

var referenciaMapaEspejo = null;
function capturaReferenciaMapaEspejo(mapa) {
    referenciaMapaEspejo = mapa;
}

// var csvData = []
// var csvDataEspejo = [];
// var csvFileName = '';
// var csvFileNameEspejo = '';

export default function AnalisisGeografico() {

    useEffect(() => {
        fetch(`${process.env.ruta}/wa0/lista_capas01`)
            .then(res => res.json())
            .then(
                (data) => construyeCatalogo(data),
                (error) => console.log(error)
            )
    }, [])

    useEffect(() => {
        setTimeout(() => {
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
                            // if (e.layerType === "marker") {
                            //     let resultsMarker = leafletPip.pointInLayer([puntos.lng, puntos.lat], layer)
                            //     setRasgosDibujo([resultsMarker[0].feature.properties])
                            // }
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

            referenciaMapaEspejo.on('draw:created', function (e) {
                let layerDibujada = e.layer;
                let puntos = null;
                if (e.layerType === "marker") {
                    puntos = layerDibujada.getLatLng();
                } else {
                    puntos = layerDibujada.getLatLngs()
                }
                let capasIntersectadas = [];
                referenciaMapaEspejo.eachLayer(function (layer) {
                    if (e.layerType !== 'polyline') {
                        if (layer instanceof L.GeoJSON) {
                            // if (e.layerType === "marker") {
                            //     let resultsMarker = leafletPip.pointInLayer([puntos.lng, puntos.lat], layer)
                            //     setRasgosDibujo([resultsMarker[0].feature.properties])
                            // }
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
                    setRasgosEspejo(capasIntersectadas);
                }
            });

        }, 3000)
    }, [])

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
            referenciaMapaEspejo._onResize();
            setDobleMapa("col-6");
            // setDobleMapaVista("col-12");
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
    const [capasVisualizadasEspejo, setCapasVisualizadasEspejo] = useState([]);
    //Estilos de los geojson
    const estilos = {
        color: "#FF0000",
        fillColor: "#FF7777",
        opacity: "1",
        fillOpacity: "1"
    }
    //Para guardar los rasgos
    const [rasgos, setRasgos] = useState([])
    const [rasgosEspejo, setRasgosEspejo] = useState([])
    //Acciones del formulario
    const { register, handleSubmit, control, errors } = useForm();
    //Al seleccionar y añadir una entidad para los mapas
    const onSubmit = (data, e) => {
        let mapaBase = e.target.dataset.tipo;
        let arregloBase = null;
        // let datoForm = null;
        let capa = data.capaAgregar[0];
        if (mapaBase == 0) {
            arregloBase = capasVisualizadas;
            // datoForm = data.capaMapa;
        } else if (mapaBase == 1) {
            arregloBase = capasVisualizadasEspejo;
            // datoForm = data.capaEspejo;
        }
        // let indice = parseInt(datoForm)
        // console.log(indice, "indice")
        // let capa = datosCapasBackEnd[indice]
        if (arregloBase.some(capaVisual => capaVisual.num_capa === capa.indice)) {
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
                                    if (mapaBase == 0) {
                                        setRasgos([feature.properties])
                                    } else if (mapaBase == 1) {
                                        setRasgosEspejo([feature.properties])
                                    }
                                })
                            }
                        });
                        response['layer'] = layer;
                        response['simbologia'] = creaSVG(capa.titulo)
                        response.download = [{num_capa: response.num_capa, nom_capa: response.nom_capa, link: download, tipo: 'GeoJSON'}];
                        if (mapaBase == 0) {
                            setCapasVisualizadas([...capasVisualizadas, response])
                            referenciaMapa.addLayer(response.layer)
                        } else if (mapaBase == 1) {
                            setCapasVisualizadasEspejo([...capasVisualizadasEspejo, response])
                            referenciaMapaEspejo.addLayer(response.layer)
                        }
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
                capaWMS['simbologia'] = capa.leyenda;

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
                var url = `https://ide.sedatu.gob.mx:8080/wfs?request=GetFeature&service=WFS&version=1.0.0&typeName=${capaWMS.layer.wmsParams.layers}&outputFormat=`
                var download = [
                    {num_capa: capaWMS.num_capa, nom_capa: capaWMS.nom_capa, link: `${url}KML`, tipo: 'KML'},
                    {num_capa: capaWMS.num_capa, nom_capa: capaWMS.nom_capa, link: `https://ide.sedatu.gob.mx:8080/ows?service=WMS&request=GetMap&version=1.1.1&format=application/vnd.google-earth.kmz+XML&width=1024&height=1024&layers=${capaWMS.layer.wmsParams.layers}&bbox=-180,-90,180,90`, tipo: 'KMZ'},
                    {num_capa: capaWMS.num_capa, nom_capa: capaWMS.nom_capa, link: `${url}SHAPE-ZIP`, tipo: 'SHAPE'}
                ];
                capaWMS.download = download;
                if (mapaBase == 0) {
                    setCapasVisualizadas([...capasVisualizadas, capaWMS])
                    referenciaMapa.addLayer(capaWMS.layer)
                } else if (mapaBase == 1) {
                    setCapasVisualizadasEspejo([...capasVisualizadasEspejo, capaWMS])
                    referenciaMapaEspejo.addLayer(capaWMS.layer)
                }
            }
        }
    }

    //Para guardar los atributos
    const [atributos, setAtributos] = useState([]);
    const [atributosEspejo, setAtributosEspejo] = useState([]);
    //Para mostrar el modal de atributos
    const [showModalAtributos, setShowModalAtributos] = useState(false)
    const [showModalAtributosEspejo, setShowModalAtributosEspejo] = useState(false)
    //Para asignar atributos
    const muestraAtributos = (capa, mapa) => {
        if (mapa == 0) {
            setAtributos([capa.features, capa.nom_capa])
            if (showModalAtributos == false) {
                setShowModalAtributos(true)
            }
        } else if (mapa == 1) {
            setAtributosEspejo([capa.features, capa.nom_capa])
            if (showModalAtributosEspejo == false) {
                setShowModalAtributosEspejo(true)
            }
        }
    }

    //Para eliminar capas
    const eliminaCapa = (capa, mapa) => {
        let arrCapasBase;
        let refMap
        if (mapa == 0) {
            arrCapasBase = capasVisualizadas;
            refMap = referenciaMapa;
        } else if (mapa == 1) {
            arrCapasBase = capasVisualizadasEspejo
            refMap = referenciaMapaEspejo;
        }
        refMap.removeLayer(capa.layer)
        let arrTemp = arrCapasBase.filter(capaArr => capaArr.num_capa != capa.num_capa)
        if (mapa == 0) {
            setCapasVisualizadas(arrTemp);
        } else if (mapa == 1) {
            setCapasVisualizadasEspejo(arrTemp);
        }
    }

    //Funcion para cambiar el estado del checkbox
    const cambiaCheckbox = ({ target }, mapa) => {
        let arrCapasBase;
        let refMap;
        if (mapa == 0) {
            arrCapasBase = capasVisualizadas;
            refMap = referenciaMapa;
        } else if (mapa == 1) {
            arrCapasBase = capasVisualizadasEspejo;
            refMap = referenciaMapaEspejo;
        }
        //Hace copia a otro arreglo para volver a sobreescribir capasVisualizadas
        let capasVisualisadasActualizado = arrCapasBase.map((valor) => {
            //Si es igual a la entidad que se envia, se cambia el checkbox
            if (valor.num_capa == target.value) {
                //Si esta habilitado se desabilita, de manera igual en caso contrario
                if (valor.habilitado) {
                    valor.habilitado = false;
                    refMap.removeLayer(valor.layer);
                    return valor;
                } else {
                    valor.habilitado = true;
                    refMap.addLayer(valor.layer)
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
        let arrCapasBase;
        if (mapa == 0) {
            arrCapasBase = capasVisualizadas;
        } else if (mapa == 1) {
            arrCapasBase = capasVisualizadasEspejo;
        }
        //Hace copia a otro arreglo para volver a sobreescribir capasVisualizadas
        let capasVisualisadasActualizado = arrCapasBase.map((valor) => {
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
        let arrCapasBase;
        let refMap;
        if (mapa == 0) {
            arrCapasBase = capasVisualizadas;
            refMap = referenciaMapa;
        } else if (mapa == 1) {
            arrCapasBase = capasVisualizadasEspejo;
            refMap = referenciaMapaEspejo;
        }
        let capasVisualisadasActualizado = arrCapasBase.map((valor) => {
            //Si es igual a la entidad que se envia, se cambia el zoom
            if (valor.num_capa == target.name) {
                if (target.dataset.zoom == "min") {
                    valor.zoomMinimo = target.value
                    valor.layer.options.minZoom = valor.zoomMinimo;
                } else if (target.dataset.zoom == "max") {
                    valor.zoomMaximo = target.value
                    valor.layer.options.maxZoom = valor.zoomMaximo;
                }
                refMap.removeLayer(valor.layer)
                refMap.addLayer(valor.layer)
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

    //Para exportar en CSV la información de rasgos
    var csvData = []
    var csvDataEspejo = [];
    var csvFileName = '';
    var csvFileNameEspejo = '';
    //Añade los valores al archivo
    function addToExportWithPivot(rasgosObtenidos, mapa) {
        generateFileName(mapa, function () {
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
                if (mapa == 0) {
                    csvData = csvData_;
                } else if (mapa == 1) {
                    csvDataEspejo = csvData_;
                }
            }
        });
    }
    //Asigna los valores a los archivos
    function generateFileName(option, success) {
        let f = new Date();
        let fileName = '';
        fileName = 'InformacionDeRasgos-';
        fileName += (f.getDate() < 10 ? '0' : '') + f.getDate() + (f.getMonth() < 10 ? '0' : '') + (f.getMonth() + 1) + f.getFullYear() + f.getHours() + f.getMinutes() + f.getSeconds();
        fileName += '-' + option;
        switch (option) {
            case 0:
                csvFileName = fileName + '.csv';
                break;
            case 1:
                csvFileNameEspejo = fileName + '.csv';
                break;
            default:
                csvFileName = 'export.csv';
                csvFileNameEspejo = 'export.csv';
                break;
        }
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

    const [showModalAgregarCapas, setShowModalAgregarCapas] = useState(false)
    const [showModalAgregarCapasEspejo, setShowModalAgregarCapasEspejo] = useState(false)

    const [show, setShow] = useState(false);
    const [datosModal, setDatosModal] = useState(
        {
            title: '',
            body: ''
        }
    );
    const [fileUpload, setFileUpload] = useState([]);
    const [fileUploadEspejo, setFileUploadEspejo] = useState([]);
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
                                item.tipo == 'GeoJSON'?
                                    `data:text/json;charset=utf-8,${encodeURIComponent(item.link)}` :
                                    item.link
                            } download={
                                item.tipo == 'GeoJSON'?
                                    `${item.num_capa}_${item.nom_capa}.json` :
                                    `${item.num_capa}_${item.nom_capa}`
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

    function processInputFile(event, option) {
        var fileType = event.target.files[0].name;
        fileType = fileType.substring(fileType.indexOf('.') + 1);
        switch (fileType) {
            case 'json':
                var fileReader = new FileReader();
                fileReader.readAsText(event.target.files[0], "UTF-8");
                fileReader.onload = loaded => {
                    if (option === 0)
                        setFileUpload([...fileUpload, {data: JSON.parse(loaded.target.result), type: fileType}]);
                    else
                        setFileUploadEspejo([...fileUploadEspejo, {data: JSON.parse(loaded.target.result), type: fileType}]);
                };
            break;
            case 'kml':
                var fileReader = new FileReader();
                fileReader.readAsText(event.target.files[0], "UTF-8");
                fileReader.onload = loaded => {
                    if (option === 0)
                        setFileUpload([...fileUpload, {data: loaded.target.result, type: fileType}]);
                    else
                        setFileUploadEspejo([...fileUploadEspejo, {data: loaded.target.result, type: fileType}]);
                };
            break;
            case 'kmz':
                setDatosModal({
                    title: 'En construcción',
                    body: 'Funcionalidad en construcción',
                    redireccion: null,
                    nombreBoton: 'Cerrar'
                });
                handleShow();
            break;
            // case 'zip':
            //     var fileReader = new FileReader();
            //     fileReader.readAsDataURL(event.target.files[0]);//ArrayBuffer(event.target.files[0]);
            //     fileReader.onload = loaded => {
            //         if (option === 0) {
            //             setFileUpload([...fileUpload, {data: loaded, type: fileType}]);
            //         } else {
            //             setFileUploadEspejo([...fileUploadEspejo, {data: loaded, type: fileType}]);
            //         }
            //     };
            // break;
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
                    <Modal.Title><b>Agrega capas</b></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(onSubmit)} data-tipo={0}>
                        <Controller
                            as={Typeahead}
                            control={control}
                            options={datosCapasBackEnd}
                            labelKey="titulo"
                            id="buscadorCapas"
                            name="capaAgregar"
                            rules={{ required: true }}
                            defaultValue=""
                            filterBy={["tipo"]}
                            placeholder="Escoge o escribe una capa"
                            clearButton
                            emptyLabel="No se encontraron resultados"
                        />
                        {errors.capaAgregar && <p className="tw-text-red-600">Este campo es obligatorio</p>}
                        <button className="tw-mt-6 btn-analisis" type="submit">AGREGAR</button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showModalAgregarCapasEspejo} onHide={() => setShowModalAgregarCapasEspejo(!showModalAgregarCapasEspejo)}
                keyboard={false} className="modal-analisis" contentClassName="modal-redimensionable">
                <Modal.Header closeButton >
                    <Modal.Title><b>Agrega capas</b></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(onSubmit)} data-tipo={1}>
                        <Controller
                            as={Typeahead}
                            control={control}
                            options={datosCapasBackEnd}
                            labelKey="titulo"
                            id="buscadorCapasEspejo"
                            name="capaAgregar"
                            rules={{ required: true }}
                            defaultValue=""
                            filterBy={["tipo"]}
                            placeholder="Escoge o escribe una capa"
                            clearButton
                            emptyLabel="No se encontraron resultados"
                        />
                        {errors.capaAgregar && <p className="tw-text-red-600">Este campo es obligatorio</p>}
                        <button className="tw-mt-6 btn-analisis" type="submit">AGREGAR</button>
                    </Form>
                </Modal.Body>
            </Modal>

            <div className="main tw-mb-12">
                <div className="container">
                    <div className="row">
                        <div className="col-12 tw-mb-6">
                            <button className="btn-dividir-pantalla" onClick={dividirPantalla}>
                                <img src="/images/analisis/pantalla-dividida.png" title="Pantalla dividida"></img>
                            </button>
                        </div>

                        <div className={`${dobleMapa} col-mapa tw-pt-6`}>
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
                                    <button className="botones-barra-mapa tw-py-1" onClick={() => setShowModalAgregarCapas(true)}>
                                        <img src="/images/analisis/agregar-capas.png" alt="Agregar capas" />
                                    </button>

                                </div>
                                <div className={dobleMapaVista}>
                                    <input type="file" name="file" onChange={(e) => processInputFile(e, 0)} id="uploadFIleButton"/>
                                    <label className="btn-analisis uploadFIleButtonLabel"  htmlFor="uploadFIleButton">Cargar archivo</label>
                                </div>
                                <div className="col-12 tw-mt-8">
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
                                                                    addToExportWithPivot(rasgos, 0)
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
                                                                        <Draggable key={capa.num_capa} draggableId={capa.nom_capa} index={index}>
                                                                            {(provided) => (
                                                                                <Card {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                                                    <Card.Header className="tw-flex tw-justify-between tw-items-baseline">
                                                                                        <Form.Group>
                                                                                            <Form.Check type="checkbox" defaultChecked={capa.habilitado} label={capa.nom_capa} onChange={(event) => cambiaCheckbox(event, 0)} value={capa.num_capa} />
                                                                                        </Form.Group>
                                                                                        {
                                                                                            capa.tipo === "geojson" &&
                                                                                            <Button onClick={() => muestraAtributos(capa, 0)} variant="link">
                                                                                                <FontAwesomeIcon icon={faTable} />
                                                                                            </Button>
                                                                                        }
                                                                                        <Button onClick={() => eliminaCapa(capa, 0)} variant="link">
                                                                                            <FontAwesomeIcon icon={faTrash} />
                                                                                        </Button>
                                                                                        <CustomToggle eventKey={capa.num_capa.toString()} />
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
                                                                                                <hr/>
                                                                                                <div className="row container-fluid d-flex justify-content-center">
                                                                                                    {
                                                                                                        <a className="tw-text-titulo tw-font-bold" style={{cursor: 'pointer'}} onClick={() => (renderModalDownload(capa.download))}>
                                                                                                            <OverlayTrigger overlay={<Tooltip>{`Descargar (${capa.download.length} disponible(s))`}</Tooltip>}>
                                                                                                                <FontAwesomeIcon className="tw-px-1" size="2x" icon={faDownload} />
                                                                                                            </OverlayTrigger>
                                                                                                        </a>
                                                                                                    }
                                                                                                </div>
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
                                            <FontAwesomeIcon className="tw-cursor-pointer" icon={menuLateral ? faCaretLeft : faCaretRight} />
                                        </button>
                                    </div>
                                    <ContenedorMapaAnalisis referencia={capturaReferenciaMapa} botones={true} datos={capasVisualizadas}
                                        datosAtributos={atributos}
                                        modalAtributos={showModalAtributos}
                                        setModalAtributos={setShowModalAtributos}
                                        fileUpload={fileUpload} />
                                </div>
                            </div>
                        </div>

                        <div className={`col-6 col-mapa tw-pt-6 ${pantallaDividida == false && "esconde-mapa"}`}>
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
                                    <button className="botones-barra-mapa tw-py-1" onClick={() => setShowModalAgregarCapasEspejo(true)}>
                                        <img src="/images/analisis/agregar-capas.png" alt="Agregar capas" />
                                    </button>
                                </div>
                                <div className={dobleMapaVista}>
                                    <input type="file" name="file" onChange={(e) => processInputFile(e, 1)} id="uploadFIleButtonEspejo" hidden/>
                                    <label className="btn-analisis uploadFIleButtonLabel"  htmlFor="uploadFIleButtonEspejo">Cargar archivo</label>
                                </div>

                                <div className="col-12 tw-mt-8">
                                    <div className="contenedor-menu-lateral">
                                        <div className={menuLateralEspejo ? "tw-w-96 menu-lateral" : "tw-w-0 menu-lateral"}>
                                            <Card>
                                                <Card.Header>
                                                    <div className="row">
                                                        <div className="col-9">
                                                            <b>Información de rasgos</b>
                                                            <Button onClick={() => setOpenRasgosCollapseEspejo(!openRasgosCollapseEspejo)} variant="link">
                                                                <FontAwesomeIcon icon={openRasgosCollapseEspejo ? faAngleDown : faAngleRight} />
                                                            </Button>
                                                        </div>
                                                        {
                                                            rasgosEspejo[0] &&
                                                            <div className="col-3">
                                                                {
                                                                    addToExportWithPivot(rasgosEspejo, 1)
                                                                }
                                                                <CSVLink data={csvDataEspejo} filename={csvFileNameEspejo}>
                                                                    <FontAwesomeIcon size="2x" icon={faFileCsv} />
                                                                </CSVLink>
                                                            </div>
                                                        }
                                                    </div>
                                                </Card.Header>
                                            </Card><Collapse in={openRasgosCollapseEspejo}>
                                                <div>
                                                    {
                                                        rasgosEspejo.map((valor, index) => (
                                                            <Accordion key={index}>
                                                                <Card>
                                                                    <Card.Header variant="link" className="tw-flex tw-justify-between tw-items-baseline" eventKey={index.toString()}>
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
                                                    <Button onClick={() => setOpenCapasCollapseEspejo(!openCapasCollapseEspejo)} variant="link">
                                                        <FontAwesomeIcon icon={openCapasCollapseEspejo ? faAngleDown : faAngleRight} />
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
                                                                                    <Card.Header className="tw-flex tw-justify-between tw-items-baseline">
                                                                                        <Form.Group className="tw-inline-block">
                                                                                            <Form.Check type="checkbox" defaultChecked={capa.habilitado} label={capa.nom_capa} onChange={(event) => cambiaCheckbox(event, 1)} value={capa.num_capa} />
                                                                                        </Form.Group>
                                                                                        {
                                                                                            capa.tipo === "geojson" &&
                                                                                            <Button onClick={() => muestraAtributos(capa, 1)} variant="link">
                                                                                                <FontAwesomeIcon icon={faTable} />
                                                                                            </Button>
                                                                                        }
                                                                                        <Button onClick={() => eliminaCapa(capa, 1)} variant="link">
                                                                                            <FontAwesomeIcon icon={faTrash} />
                                                                                        </Button>
                                                                                        <CustomToggle eventKey={capa.num_capa.toString()} />
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
                                                                                                <hr/>
                                                                                                <div className="row container-fluid d-flex justify-content-center">
                                                                                                    {
                                                                                                        <a className="tw-text-titulo tw-font-bold" style={{cursor: 'pointer'}} onClick={() => (renderModalDownload(capa.download))}>
                                                                                                            <OverlayTrigger overlay={<Tooltip>{`Descargar (${capa.download.length} disponible(s))`}</Tooltip>}>
                                                                                                                <FontAwesomeIcon className="tw-px-1" size="2x" icon={faDownload} />
                                                                                                            </OverlayTrigger>
                                                                                                        </a>
                                                                                                    }
                                                                                                </div>
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
                                    <ContenedorMapaAnalisis referencia={capturaReferenciaMapaEspejo} botones={false} datos={capasVisualizadasEspejo}
                                        datosAtributos={atributosEspejo}
                                        modalAtributos={showModalAtributosEspejo}
                                        setModalAtributos={setShowModalAtributosEspejo}
                                        fileUpload={fileUploadEspejo} />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </>
    )
}