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

function useTimeline() {
    const timelineRef = useRef(new createUndoRedo());
    const [state, setState] = useState(timelineRef.current.current);

    const update = (value) => {
        const nextState = timelineRef.current.update(value);
        setState(nextState);
    };

    const undo = () => {
        const nextState = timelineRef.current.undo();
        setState(nextState);
    };

    const redo = () => {
        const nextState = timelineRef.current.redo();
        setState(nextState);
    };

    return [state, { ...timelineRef.current, update, undo, redo }];
}

const Map = (props) => {
    //Centro y zoom del mapa
    var centroInicial = [23.26825996870948, -102.88361673036671];
    var acercamientoInicial = 5;
    const [centro, setCentro] = useState(centroInicial)
    const [acercamiento, setAcercamiento] = useState(acercamientoInicial)

    //Valores para undo-redo
    const [valorUndoRedo, setValorUndoRedo] = useState([centroInicial, acercamientoInicial])

    //Para guardar los rasgos
    const [rasgos, setRasgos] = useState([])
    function onEachFeature(feature = {}, layer) {
        layer.on('click', function (e) {
            setRasgos([e.target.feature.properties])
        })
    }

    //estilos del mapa, se puede enviar como funcion o como objeto
    //como funcion
    function estilos(estilos) {
        return {
            color: "#FF0000",
            opacity: estilos.transparencia,
            fillOpacity: estilos.transparencia
        }
    }
    //como objeto
    // const estilos = {
    //     fillColor: "#FF0000",
    // }

    function UndoRedoMapa() {
        return null
    }

    function ControlMovimiento() {
        const [coordenadas, setCoordenadas] = useState("")
        const [tipoCoordenada, setTipoCoordenada] = useState(1)
        const mapa = useMap()

        const mapaEventos = useMapEvents({
            moveend() {
                let centroUndoRedo = mapaEventos.getCenter();
                let zoomUndoRedo = mapaEventos.getZoom();
                setValorUndoRedo([zoomUndoRedo, centroUndoRedo]);
                const newTodo = valorUndoRedo;
                const nextTodos = [...todos, newTodo];
                update(nextTodos);
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
                const botonVistaCompleta = L.DomUtil.create("button", "boton-vista-completa");
                botonVistaCompleta.innerHTML = "Vista completa"
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

    //Para undo-redo
    const [todos, { timeline, canUndo, canRedo, update, undo, redo }] = useTimeline();
    const onValueChange = ({ target }) => setValue(target.value);

    const undoRedo = useCallback(
        ({ target }) => {
            target.name === "undo" ? undo() : redo();
        },
        [undo, redo]
    );

    return (
        <>
            <Head>
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
                    integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin="" />
            </Head>

            <button disabled={!canUndo} name="undo" onClick={undoRedo}>
                undo
            </button>
            <button disabled={!canRedo} name="redo" onClick={undoRedo}>
                redo
            </button>

            <MapContainer fullscreenControl={true} center={centro} zoom={acercamiento} scrollWheelZoom={false} style={{ height: 400, width: "100%" }}>

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

                <FeatureGroup>
                    <EditControl
                        position='topright'
                        draw={{
                            rectangle: false,
                            circle: false,
                            circlemarker: false,
                        }}
                    >
                    </EditControl>
                </FeatureGroup>

                {
                    props.datos.map((capa, index) => {
                        if (capa.habilitado) {
                            if (capa.tipo == "geojson") {
                                return (
                                    <GeoJSON key={index} data={capa} style={() => estilos(capa.estilos)} onEachFeature={onEachFeature} minZoom="4" />
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

            <div className="logs">
                <Logs title="history" items={timeline.history} />
                <Logs title="future" items={timeline.future} />
            </div>

            <p>Información de rasgos</p>
            <div>
                {rasgos &&
                    rasgos.map((valor, index) => {
                        return (
                            <Table striped bordered hover key={index}>
                                <thead>
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
                        )
                    })
                }
            </div>
        </>
    )
}

export default Map