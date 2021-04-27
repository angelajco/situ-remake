import Head from 'next/head'
import React, { useState, useEffect, useRef } from 'react'

import { MapContainer, ScaleControl, LayersControl, TileLayer, useMap, useMapEvents, ZoomControl, FeatureGroup } from 'react-leaflet'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImages, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { EditControl } from 'react-leaflet-draw'
import Popout from 'react-popout'

const { BaseLayer } = LayersControl;
//Si no es necesario cargar los marcadores
// import "leaflet/dist/leaflet.css"

import 'leaflet-fullscreen/dist/Leaflet.fullscreen.css'
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js'
import 'leaflet-draw/dist/leaflet.draw.css'

var _timeline = {
    history: [],
    current: [],
    future: []
};

//Funcion del timeline undo redo
var registraMovimiento = true;
function useTimeline() {

    const [state, setState] = useState([]);
    const historyLimit = -5

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

    return [state, { canUndo, canRedo, update, undo, redo }];
}

export default function Map(props) {
    //Para guardar las referencias del mapa    
    const [mapaReferencia, setmapaReferencia] = useState(null);
    props.referencia(mapaReferencia);

    //Centro y zoom del mapa
    var centroInicial = [24.26825996870948, -102.88361673036671];
    var acercamientoInicial = 5;

    useEffect(() => {

        if (mapaReferencia != null) {
            
            mapaReferencia.addControl(new L.Control.Fullscreen(
                {
                    title: {
                        false: 'Ver pantalla completa',
                        true: 'Salir de pantalla completa'
                    },
                    position: "bottomright"
                }
            ));

            // L.easyPrint({
            //     title: 'Imprimir',
            //     position: 'topleft',
            //     sizeModes: ['A4Portrait', 'A4Landscape']
            // }).addTo(mapaReferencia);

        }
    }, [mapaReferencia])

    useEffect(() => {
        L.drawLocal.draw.toolbar.buttons.polyline = "Dibujar una linea"
        L.drawLocal.draw.toolbar.buttons.polygon = "Dibujar un poligono"
        L.drawLocal.draw.toolbar.buttons.marker = "Dibujar un marcador"
        L.drawLocal.draw.handlers.polyline.error = "<strong>¡Error:</strong> las esquinas de la forma no se pueden cruzar!"
        L.drawLocal.draw.toolbar.actions.title = "Cancelar dibujo"
        L.drawLocal.draw.toolbar.actions.text = "Cancelar"
        L.drawLocal.draw.toolbar.finish.title = "Finalizar dibujo"
        L.drawLocal.draw.toolbar.finish.text = "Finalizar"
        L.drawLocal.draw.toolbar.undo.title = "Borrar último punto dibujado"
        L.drawLocal.draw.toolbar.undo.text = "Borrar último punto"
        L.drawLocal.draw.handlers.marker.tooltip.start = "Clic en el mapa para poner un marcador."
        L.drawLocal.draw.handlers.polygon.tooltip.start = "Clic para empezar a dibujar una forma."
        L.drawLocal.draw.handlers.polygon.tooltip.cont = "Clic para continuar dibujando la forma."
        L.drawLocal.draw.handlers.polygon.tooltip.end = "Clic en el primer punto para cerrar esta forma."
        L.drawLocal.draw.handlers.polyline.tooltip.start = "Clic para empezar a dibujar una linea."
        L.drawLocal.draw.handlers.polyline.tooltip.cont = "Clic para continuar dibujando la linea."
        L.drawLocal.draw.handlers.polyline.tooltip.end = "Clic en el último punto para finalizar la linea."
        L.drawLocal.edit.toolbar.actions.save.title = "Guardar cambios"
        L.drawLocal.edit.toolbar.actions.save.text = "Guardar"
        L.drawLocal.edit.toolbar.actions.cancel.title = "Cancelar edición, descartar todos los cambios"
        L.drawLocal.edit.toolbar.actions.cancel.text = "Cancelar"
        L.drawLocal.edit.toolbar.actions.clearAll.title = "Limpiar todas las capas"
        L.drawLocal.edit.toolbar.actions.clearAll.text = "Limpiar todo"
        L.drawLocal.edit.toolbar.buttons.edit = "Editar capas"
        L.drawLocal.edit.toolbar.buttons.editDisabled = "No hay capas para editar"
        L.drawLocal.edit.toolbar.buttons.remove = "Borrar capas"
        L.drawLocal.edit.toolbar.buttons.removeDisabled = "No hay capas para borrar"
        L.drawLocal.edit.handlers.edit.tooltip.text = "Arrastre controladores o marcadores para editar carecaterísticas."
        L.drawLocal.edit.handlers.edit.tooltip.subtext = "Clic en cancelar para deshacer los cambios"
        L.drawLocal.edit.handlers.remove.tooltip.text = "Click en la figura para borrarla."

        update([
            {
                centroUndoRedo: { lat: 23.26825996870948, lng: -102.88361673036671 },
                zoomUndoRedo: 5
            }
        ]);
    }, [])

    const [todos, { canUndo, canRedo, update, undo, redo }] = useTimeline();
    function MapaMovimientoUndoRedo({ target }) {
        registraMovimiento = false;
        if (target.name === 'undo') {
            if (_timeline.history.length > 1) {
                undo();
                let estadoActual = _timeline.current[_timeline.current.length - 1];
                let estadoActualLatLng = estadoActual.centroUndoRedo;
                let estadoActualZoom = estadoActual.zoomUndoRedo;
                mapaReferencia.setView(estadoActualLatLng, estadoActualZoom);
            }
        }
        else if (target.name === 'redo') {
            if (_timeline.future.length > 0) {
                redo();
                let estadoActual = _timeline.current[_timeline.current.length - 1];
                let estadoActualLatLng = estadoActual.centroUndoRedo;
                let estadoActualZoom = estadoActual.zoomUndoRedo;
                mapaReferencia.setView(estadoActualLatLng, estadoActualZoom);
            }
        }
    }

    const [tipoCoordenada, setTipoCoordenada] = useState(1)
    function ControlMovimiento() {

        const [coordenadas, setCoordenadas] = useState("")
        const mapa = useMap()
        const mapaEventos = useMapEvents({
            moveend() {
                let centroUndoRedo = mapaEventos.getCenter();
                let zoomUndoRedo = mapaEventos.getZoom();
                if (registraMovimiento == true) {
                    const nextTodos = [...todos, { centroUndoRedo, zoomUndoRedo }];
                    update(nextTodos);
                }
                registraMovimiento = true;
            },
            mousemove(e) {
                if (tipoCoordenada == 1) {
                    let latlng = {};
                    latlng["lat"] = e.latlng.lat.toFixed(3)
                    latlng["lng"] = e.latlng.lng.toFixed(3)
                    let latlngString = "LatLng(" + latlng["lat"] + "," + latlng["lng"] + ")"
                    setCoordenadas(latlngString)
                }
                else if (tipoCoordenada == 2) {
                    let metros = L.CRS.EPSG3857.project(e.latlng);
                    let metrosString = "LatLng(" + metros.x.toFixed(3) + "," + metros.y.toFixed(3) + ")"
                    setCoordenadas(metrosString)
                }
                else {
                    let lat = e.latlng.lat;
                    let latGrado = Math.trunc(lat);
                    let latMinuto = Math.trunc((Math.abs(lat) - Math.abs(latGrado)) * 60);
                    let latSegundo = (Math.abs(lat) - Math.abs(latGrado) - (latMinuto / 60)) * 3600;
                    let latGradoMinutoSegundo = latGrado + "°" + latMinuto + "'" + latSegundo.toFixed(2) + "''";

                    let lng = e.latlng.lng;
                    let lngGrado = Math.trunc(lng);
                    let lngMinuto = Math.trunc((Math.abs(lng) - Math.abs(lngGrado)) * 60);
                    let lngSegundo = (Math.abs(lng) - Math.abs(lngGrado) - (lngMinuto / 60)) * 3600;
                    let lngGradoMinutoSegundo = lngGrado + "°" + lngMinuto + "'" + lngSegundo.toFixed(2) + "''";

                    let gradoMinutosSegundos = "LatLng(" + latGradoMinutoSegundo + "," + lngGradoMinutoSegundo + ")";
                    setCoordenadas(gradoMinutosSegundos);
                }

            }
        })

        useEffect(() => {
            const leyendaCoordenadas = L.control({ position: "bottomleft" });
            leyendaCoordenadas.onAdd = () => {
                const divCoordenadas = L.DomUtil.create("div", "coordenadas");
                divCoordenadas.innerHTML = coordenadas + " " + "Zoom:&nbsp" + mapa.getZoom();
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
            botones.addTo(mapa);
            return () => {
                botones.remove();
            }
        }, []);

        return null;
    }

    function cambiaTipoCoordenada({ target }) {
        if (target.value == 1) {
            setTipoCoordenada(1);
        }
        else if (target.value == 2) {
            setTipoCoordenada(2);
        } else {
            setTipoCoordenada(3);
        }
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
            <Head>
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
                    integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin="" />
            </Head>

            {ventana &&
                <Popout title='Simbología' onClosing={() => popupVentana(2)}>
                    <h3><b>Simbología</b></h3>
                    {
                        props.datos.map((capa, index) => {
                            if (capa.habilitado) {
                                console.log(capa);
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
                </Popout>
            }


            <MapContainer whenCreated={setmapaReferencia} center={centroInicial} zoom={acercamientoInicial} scrollWheelZoom={true} style={{ height: 500, width: "100%" }} minZoom={5} zoomControl={false} >
                <ScaleControl maxWidth="100" />
                <ZoomControl position="bottomright" zoomInTitle="Acercar" zoomOutTitle="Alejar" />

                <LayersControl>
                    <BaseLayer checked name="Open street map">
                        <TileLayer
                            className="tilelayer-base"
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </BaseLayer>
                    <BaseLayer name="Google">
                        <TileLayer
                            className="tilelayer-base"
                            attribution="Google"
                            url="http://www.google.cn/maps/vt?lyrs=s,h@189&gl=cn&x={x}&y={y}&z={z}"
                        />
                    </BaseLayer>
                </LayersControl>
                <ControlMovimiento />
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
            </MapContainer>

            <div className="tw-bg-gray-200 tw-border-solid tw-border-1 tw-border-gray-300 tw-text-right">
                <select onChange={(e) => cambiaTipoCoordenada(e)} className="tw-mr-5">
                    <option value='1'>Grados decimales</option>
                    <option value='2'>Metros</option>
                    <option value='3'>Grados, minutos y segundos</option>
                </select>
                {props.botones == true &&
                    <>
                        <OverlayTrigger rootClose overlay={<Tooltip>Vista anterior</Tooltip>}>
                            <button disabled={!canUndo} className="tw-border-transparent tw-bg-transparent tw-mr-5 tw-border-none" name="undo" onClick={MapaMovimientoUndoRedo}>
                                <FontAwesomeIcon className="tw-pointer-events-none tw-text-3xl" icon={faArrowLeft} />
                            </button>
                        </OverlayTrigger>
                        <OverlayTrigger rootClose overlay={<Tooltip>Vista posterior</Tooltip>}>
                            <button disabled={!canRedo} className="tw-border-transparent tw-bg-transparent tw-mr-5 tw-border-none" name="redo" onClick={MapaMovimientoUndoRedo}>
                                <FontAwesomeIcon className="tw-pointer-events-none tw-text-3xl" icon={faArrowRight}></FontAwesomeIcon>
                            </button>
                        </OverlayTrigger>
                    </>
                }
                <OverlayTrigger overlay={<Tooltip>Simbología</Tooltip>}>
                    <FontAwesomeIcon className="tw-cursor-pointer tw-mr-5 tw-text-3xl tw-mt-2" onClick={() => popupVentana(1)} icon={faImages}></FontAwesomeIcon>
                </OverlayTrigger>
            </div>

        </>
    )
}