import { MapContainer, TileLayer, GeoJSON, WMSTileLayer, ScaleControl, LayersControl, useMapEvents, useMap, FeatureGroup } from 'react-leaflet'
import L from 'leaflet'
import { useState, useRef, useEffect, useCallback } from 'react'
import { Table } from 'react-bootstrap'
import Head from 'next/head'
import { EditControl } from 'react-leaflet-draw'

//Si no es necesario cargar los marcadores
// import "leaflet/dist/leaflet.css"

import 'leaflet-fullscreen/dist/Leaflet.fullscreen.css'
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js'

import 'leaflet-draw/dist/leaflet.draw.css'

const { BaseLayer } = LayersControl;

import createUndoRedo from "../helpers/index";
import Logs from "../helpers/Logs";

var estadoActual;
var estadoActualLatLng;
var estadoActualZoom;

function useTimeline() {
    const timelineRef = useRef(new createUndoRedo());
    const [state, setState] = useState(timelineRef.current.current);
    // console.log(state, "state de timeline");
    const update = (value) => {
        // console.log(value, "value del update")
        const nextState = timelineRef.current.update(value);
        // console.log("timeline update", timelineRef.current.current)
        setState(nextState);
    };

    const undo = () => {
        const nextState = timelineRef.current.undo();
        setState(nextState);

        // estadoActual = timelineRef.current.current[timelineRef.current.current.length - 1];
        // console.log(estadoActual, "zoom actual de undo");
        // estadoActualLatLng = estadoActual.centroUndoRedo;
        // estadoActualZoom = estadoActual.zoomUndoRedo;
        // estadoActualZoom = estadoActual;
        // console.log("timeline undo", timelineRef.current.current)
    };

    const redo = () => {
        const nextState = timelineRef.current.redo();
        setState(nextState);
    };

    return [state, { ...timelineRef.current, update, undo, redo }];
}

const Map = (props) => {
    const [coordenadas, setCoordenadas] = useState("")
    const [tipoCoordenada, setTipoCoordenada] = useState(1)

    let centroUndoRedo = {}
    let zoomUndoRedo = 0;

    //Centro y zoom del mapa
    var centroInicial = [23.26825996870948, -102.88361673036671];
    var acercamientoInicial = 5;

    const [centro, setCentro] = useState(centroInicial)
    const [acercamiento, setAcercamiento] = useState(acercamientoInicial)

    //Para guardar los rasgos
    const [rasgos, setRasgos] = useState([])
    function onEachFeature(feature = {}, layer) {
        layer.on('click', function () {
            console.log("agregado")
            setRasgos([feature.properties])
        })
    }

    //estilos del mapa, se puede enviar como funcion o como objeto
    //como funcion
    function estilos(estilos) {
        return {
            color: "#FF0000",
            fillColor: "#FF7777",
            opacity: estilos.transparencia,
            fillOpacity: estilos.transparencia
        }
    }
    //como objeto
    // const estilos = {
    //     fillColor: "#FF0000",
    // }

    //Para manejar los estados del undo-redo
    const [todos, { timeline, canUndo, canRedo, update, undo, redo }] = useTimeline();
    //Valores para undo-redo
    // const [valorUndoRedo, setValorUndoRedo] = useState({ centroUndoRedo: centroInicial, zoomUndoRedo: acercamiento })
    const [valorUndoRedo, setValorUndoRedo] = useState(acercamiento)

    useEffect(() => {
        // update([]);
        // update([5]);
    }, [])

    const [registraMovimiento, setRegistraMovimiento] = useState(true)
    //Para undo-redo
    const [mapaReferencia, setmapaReferencia] = useState(null);
    function MapaMovimientoUndoRedo({ target }) {
        if (target.name === 'undo') {
            // console.log("timeline undo antes", timeline)
            undo();
            // console.log("timeline undo despues", timeline)

            estadoActualZoom = _timeline
            console.log(estadoActualZoom, "zoom de current undo");

            setRegistraMovimiento(false);
            // mapaReferencia.setView(estadoActualLatLng, estadoActualZoom);
            // mapaReferencia.setView(centroInicial, estadoActualZoom);
        }
        else {
            redo();
            setRegistraMovimiento(false);
            estadoActualZoom = timeline.current[timeline.current.length - 1]
            console.log(estadoActualZoom, "zoom de current redo");
            // mapaReferencia.setView(centroInicial, estadoActualZoom);
        }
    }

    function ControlMovimiento() {
        const mapa = useMap()

        const mapaEventos = useMapEvents({
            moveend() {
                centroUndoRedo = mapaEventos.getCenter();
                zoomUndoRedo = mapaEventos.getZoom();
                console.log(zoomUndoRedo, 'zoom-actual de moveend')
                if (registraMovimiento == true) {
                    // setValorUndoRedo({ centroUndoRedo, zoomUndoRedo });
                    // setValorUndoRedo(zoomUndoRedo);
                    // console.log("valorUndoRedo va guardando uno atrasado", valorUndoRedo);
                    const nextTodos = [...todos, zoomUndoRedo];
                    // console.log("nextTodos es la variable donde se guardan los valores", nextTodos)
                    update(nextTodos);
                }
                setRegistraMovimiento(true)
            },
            mousemove(e) {
                if (tipoCoordenada == 1) {
                    setCoordenadas(e.latlng)
                }
                else if (tipoCoordenada == 2) {
                    const metros = mapa.project(e.latlng).divideBy(256);
                    setCoordenadas(metros)
                }
                else {
                    let lat = e.latlng.lat;
                    let latGrado = Math.floor(lat);
                    let latMinuto = Math.floor((lat - latGrado) * 60);
                    let latSegundo = Math.floor((lat - latGrado - (latMinuto / 60)) * 3600);
                    let latGradoMinutoSegundo = latGrado + "°" + latMinuto + "'" + latSegundo + "''";

                    let lng = e.latlng.lng;
                    let lngGrado = Math.floor(lng);
                    let lngMinuto = Math.floor((lng - lngGrado) * 60);
                    let lngSegundo = Math.floor((lng - lngGrado - (lngMinuto / 60)) * 3600);
                    let lngGradoMinutoSegundo = lngGrado + "°" + lngMinuto + "'" + lngSegundo + "''";

                    let gradoMinutosSegundos = "LatLng(" + latGradoMinutoSegundo + "," + lngGradoMinutoSegundo + ")";
                    setCoordenadas(gradoMinutosSegundos);
                }

            }
        })

        useEffect(() => {
            const leyendaCoordenadas = L.control({ position: "bottomleft" });
            leyendaCoordenadas.onAdd = () => {
                const divCoordenadas = L.DomUtil.create("div", "coordenadas");
                divCoordenadas.innerHTML = coordenadas
                return divCoordenadas;
            };
            leyendaCoordenadas.addTo(mapa);
            return () => leyendaCoordenadas.remove();
        }, [coordenadas]);

        useEffect(() => {
            const botones = L.control({ position: "bottomleft" });
            botones.onAdd = () => {
                const botonVistaCompleta = L.DomUtil.create("div", "leaflet-vista-completa leaflet-bar leaflet-control");
                botonVistaCompleta.innerHTML = "<a href='#' title='Vista completa'></a>"
                L.DomEvent
                    .addListener(botonVistaCompleta, 'click', L.DomEvent.stopPropagation)
                    .addListener(botonVistaCompleta, 'click', L.DomEvent.preventDefault)
                    .addListener(botonVistaCompleta, 'click', function () {
                        mapa.setView(centroInicial, acercamientoInicial)
                    });


                return botonVistaCompleta;
            };

            const botones2 = L.control({ position: "bottomleft" });
            botones2.onAdd = () => {
                const botonCambiaCoordenadas = L.DomUtil.create("div", "cambia-coordenadas");
                botonCambiaCoordenadas.innerHTML = "<select> <option value='1'>Grados decimales</option> <option value='2'>Metros</option> <option value='3'>Grados, minutos y segundos</option> </select>"
                L.DomEvent
                    .addListener(botonCambiaCoordenadas, 'change', function (e) {
                        if (e.target.value == 1) {
                            setTipoCoordenada(1);
                        }
                        else if (e.target.value == 2) {
                            setTipoCoordenada(2);
                        } else {
                            setTipoCoordenada(3);
                        }
                    });


                return botonCambiaCoordenadas;
            }

            botones.addTo(mapa);
            botones2.addTo(mapa);
            return () => {
                botones.remove();
                botones2.remove();
            }
        }, []);

        return null;
    }

    return (
        <>
            <Head>
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
                    integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin="" />
            </Head>

            <button disabled={!canUndo} name="undo" onClick={MapaMovimientoUndoRedo}>
                undo
            </button>
            <button disabled={!canRedo} name="redo" onClick={MapaMovimientoUndoRedo}>
                redo
            </button>

            <MapContainer whenCreated={setmapaReferencia} fullscreenControl={true} center={centro} zoom={acercamiento} scrollWheelZoom={true} style={{ height: 400, width: "100%" }}>

                <ScaleControl maxWidth="100" />
                <ControlMovimiento />

                <LayersControl>
                    <BaseLayer checked name="Mapa base">
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </BaseLayer>
                    <BaseLayer name="Mapa NASA">
                        <TileLayer
                            url="https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default//EPSG3857_500m/{z}/{y}/{x}.jpeg"
                            attribution="© NASA Blue Marble, image service by OpenGeo"
                        />
                    </BaseLayer>
                    <BaseLayer name="Google">
                        <TileLayer
                            url="http://www.google.cn/maps/vt?lyrs=s,h@189&gl=cn&x={x}&y={y}&z={z}"
                            attribution="Google"
                            opacity="1"
                        />
                    </BaseLayer>
                </LayersControl>

                {/* <FeatureGroup>
                    <EditControl
                        position='topright'
                        draw={{
                            rectangle: false,
                            circle: false,
                            circlemarker: false,
                        }}
                    >
                    </EditControl>
                </FeatureGroup> */}

                {
                    props.datos.map((capa, index) => {
                        if (capa.habilitado) {
                            if (capa.tipo == "geojson") {
                                return (
                                    <GeoJSON key={index} data={capa} style={() => estilos(capa.estilos)} onEachFeature={onEachFeature} />
                                )
                            }
                            if (capa.tipo == "wms") {
                                return (
                                    <WMSTileLayer key={index} attribution={capa.attribution} url={capa.url} layers={capa.layers} format={capa.format} transparent={capa.transparent} opacity={capa.estilos.transparencia} minZoom={capa.zoomMinimo} maxZoom={capa.zoomMaximo} />
                                )
                            }

                        }
                    })
                }
            </MapContainer>

            <div className="logs row">
                <div className="col-3">

                    <Logs title="history" items={timeline.history} />
                </div>
                <div className="col-3">

                    <Logs title="current" items={timeline.current} />
                </div>
                <div className="col-3">

                    <Logs title="future" items={timeline.future} />
                </div>
            </div>



            {rasgos &&
                rasgos.map((valor, index) => (
                    <Table className="tw-mt-8" striped bordered hover key={index}>
                        <thead>
                            <tr>
                                <th colSpan="5" className="tw-text-center">Información de rasgos</th>
                            </tr>
                            <tr>
                                {
                                    Object.keys(valor).map((key, indexKey) => (
                                        <th key={indexKey}>{key}</th>
                                    ))
                                }
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{valor.fid}</td>
                                <td>{valor.CVEGEO}</td>
                                <td>{valor.CVE_ENT}</td>
                                <td>{valor.CVE_MUN}</td>
                                <td>{valor.NOMGEO}</td>
                            </tr>
                        </tbody>
                    </Table>
                ))
            }
        </>
    )
}

export default Map