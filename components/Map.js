import Head from 'next/head'

import { MapContainer, TileLayer, GeoJSON, WMSTileLayer, ScaleControl, LayersControl, useMapEvents, useMap, FeatureGroup } from 'react-leaflet'
import { useState, useEffect } from 'react'
import { OverlayTrigger, Table, Tooltip } from 'react-bootstrap'
import { EditControl } from 'react-leaflet-draw'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUndo, faRedo, faImages } from '@fortawesome/free-solid-svg-icons'

import Popout from 'react-popout'
import L from 'leaflet'

//Si no es necesario cargar los marcadores
// import "leaflet/dist/leaflet.css"

import 'leaflet-fullscreen/dist/Leaflet.fullscreen.css'
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js'

import 'leaflet-draw/dist/leaflet.draw.css'

const { BaseLayer } = LayersControl;

var _timeline = {
    history: [],
    current: [],
    future: []
};

function useTimeline() {

    const [state, setState] = useState([]);
    const historyLimit = -6

    function _canUndo() {
        return _timeline.history.length > 1;
    }

    function _canRedo() {
        return _timeline.future.length > 0;
    }

    const canUndo = _canUndo();
    const canRedo = _canRedo();

    const splitLast = arr => {
        // split the last item from an array and return a tupple of [rest, last]
        const length = arr.length;
        const lastItem = arr[length - 1];
        const restOfArr = arr.slice(0, length - 1);
        return [restOfArr, lastItem];
    };

    const sliceEnd = (arr, size) => {
        // slice array from to end by size
        const startIndex = arr.length < size ? 0 : size;
        const trimmedArr = arr.slice(startIndex, arr.length);
        return trimmedArr;
    };

    const update = (value) => {
        const { history, current } = _timeline;
        const limitedHistory = sliceEnd(history, historyLimit);
        _timeline = {
            history: [...limitedHistory, current],
            current: value,
            future: []
        };
        setState(_timeline.current);
    };

    const undo = () => {
        const { history, current, future } = _timeline;
        const [restOfArr, lastItem] = splitLast(history);
        _timeline = {
            history: restOfArr,
            current: lastItem,
            future: [...future, current]
        };
        setState(_timeline.current);
    };

    const redo = () => {
        const { history, current, future } = _timeline;
        const [restOfArr, lastItem] = splitLast(future);
        _timeline = {
            history: [...history, current],
            current: lastItem,
            future: restOfArr
        };
        setState(_timeline.current);
    };

    useEffect(() => {
        update([
            {
                centroUndoRedo: { lat: 23.26825996870948, lng: -102.88361673036671 },
                zoomUndoRedo: 5
            }
        ]);
    }, [])

    return [state, { canUndo, canRedo, update, undo, redo }];
}

const Map = (props) => {
    //Centro y zoom del mapa
    var centroInicial = [23.26825996870948, -102.88361673036671];
    var acercamientoInicial = 5;

    //Para guardar los rasgos
    const [rasgos, setRasgos] = useState([])
    function onEachFeature(feature = {}, layer) {
        layer.on('click', function () {
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
    const [todos, { canUndo, canRedo, update, undo, redo }] = useTimeline();
    //Para undo-redo
    const [registraMovimiento, setRegistraMovimiento] = useState(true)
    const [mapaReferencia, setmapaReferencia] = useState(null);
    function MapaMovimientoUndoRedo({ target }) {
        setRegistraMovimiento(false);
        if (target.name === 'undo') {
            undo();
            let estadoActual = _timeline.current[_timeline.current.length - 1];
            let estadoActualLatLng = estadoActual.centroUndoRedo;
            let estadoActualZoom = estadoActual.zoomUndoRedo;
            mapaReferencia.setView(estadoActualLatLng, estadoActualZoom);
        }
        else if (target.name === 'redo') {
            redo();
            let estadoActual = _timeline.current[_timeline.current.length - 1];
            let estadoActualLatLng = estadoActual.centroUndoRedo;
            let estadoActualZoom = estadoActual.zoomUndoRedo;
            mapaReferencia.setView(estadoActualLatLng, estadoActualZoom);
        }
    }

    function ControlMovimiento() {
        const [coordenadas, setCoordenadas] = useState("")
        const [tipoCoordenada, setTipoCoordenada] = useState(1)
        const mapa = useMap()

        const mapaEventos = useMapEvents({
            moveend() {
                let centroUndoRedo = mapaEventos.getCenter();
                let zoomUndoRedo = mapaEventos.getZoom();
                if (registraMovimiento == true) {
                    const nextTodos = [...todos, { centroUndoRedo, zoomUndoRedo }];
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

    /*Estados para ventana de leyendas*/
    const [ventana, setVentana] = useState(false)
    const popupVentana = (tipo) => {
        if (tipo == 1) {
            setVentana(true);
        }
        else {
            setVentana(false)
        }
    }

    return (
        <>
            {ventana &&
                <Popout title='Simbología' onClosing={() => popupVentana(2)}>
                    <p>Simbología</p>
                    {
                        props.datos.map((capa, index) => {
                            if (capa.habilitado) {
                                if (capa.tipo == "wms") {
                                    return (
                                        <div key={index}>
                                            <img src={capa.leyenda}></img>
                                            <br></br>
                                        </div>
                                    )
                                }
                            }
                        })
                    }
                </Popout>
            }

            <Head>
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
                    integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin="" />
                <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossorigin="anonymous" />
            </Head>
            <div className="tw-mb-4 tw-inline-block">
                {props.botones == true &&
                    <>
                        <OverlayTrigger rootClose overlay={<Tooltip>Vista anterior</Tooltip>}>
                            <button disabled={!canUndo} className="tw-border-transparent tw-bg-transparent tw-mr-5" name="undo" onClick={MapaMovimientoUndoRedo}>
                                <FontAwesomeIcon className="tw-pointer-events-none tw-text-3xl" icon={faUndo} />
                            </button>
                        </OverlayTrigger>
                        <OverlayTrigger rootClose overlay={<Tooltip>Vista posterior</Tooltip>}>
                            <button disabled={!canRedo} className="tw-border-transparent tw-bg-transparent tw-mr-5" name="redo" onClick={MapaMovimientoUndoRedo}>
                                <FontAwesomeIcon className="tw-pointer-events-none tw-text-3xl" icon={faRedo}></FontAwesomeIcon>
                            </button>
                        </OverlayTrigger>
                    </>
                }
                <OverlayTrigger overlay={<Tooltip>Leyendas</Tooltip>}>
                    <FontAwesomeIcon className="tw-cursor-pointer tw-mr-5 tw-text-3xl" onClick={() => popupVentana(1)} icon={faImages}></FontAwesomeIcon>
                </OverlayTrigger>
            </div>

            <MapContainer whenCreated={setmapaReferencia} fullscreenControl={true} center={centroInicial} zoom={acercamientoInicial} scrollWheelZoom={true} style={{ height: 400, width: "100%" }}>

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