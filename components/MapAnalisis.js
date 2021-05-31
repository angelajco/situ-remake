import Head from 'next/head'
import React, { useState, useEffect, useContext } from 'react'

import { MapContainer, ScaleControl, LayersControl, TileLayer, useMap, ZoomControl, FeatureGroup, useMapEvents, GeoJSON } from 'react-leaflet'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import ReactLeafletKml from 'react-leaflet-kml';

const { BaseLayer } = LayersControl;
import { EditControl } from 'react-leaflet-draw'

import referenciaMapaContext from '../contexts/ContenedorMapaContext'



//Si no es necesario cargar los marcadores
// import "leaflet/dist/leaflet.css"
//FullScreen
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.css'
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js'
//Leaflet draw
import 'leaflet-draw/dist/leaflet.draw.css'
//Leaflet zoomboz
import 'leaflet-zoombox'
import 'leaflet-zoombox/L.Control.ZoomBox.css'
//Leaflet easybutton
import 'leaflet-easybutton/src/easy-button.css'
import 'leaflet-easybutton/src/easy-button.js'
//Funcion del timeline undo redo
var registraMovimiento = true;
var _timeline = {
    history: [],
    current: [],
    future: []
};
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

L.Personal = L.Handler.extend({
    addHooks: function () {
        console.log("estoy en addHook")
        console.log(this, "this")
        L.DomEvent.on(document, 'mousedown', this._onMouseDown, this);
    },

    removeHooks: function () {
        L.DomEvent.off(document, 'mousedown', this._onMouseDown, this);
    },

    _onMouseDown: function (e) {
        this._startPoint = this._map.mouseEventToContainerPoint(e);
        L.DomEvent.on(document, {
            mousemove: this._onMouseMove,
            mouseup: this._onMouseUp,
        }, this);
        console.log("estoy en down", this._startPoint)
    },

    _onMouseMove: function (e) {
        this._point = this._map.mouseEventToContainerPoint(e);
        let bounds = new L.Bounds(this._point, this._startPoint);
        // create an orange rectangle
        console.log("estoy en mouve", bounds)
    },

    _finish: function () {
        L.DomEvent.off(document, {
            mousemove: this._onMouseMove,
            mouseup: this._onMouseUp,
        }, this);
    },

    _onMouseUp: function (e) {
        this._finish();

        let boundsDos = new L.LatLngBounds(
            this._map.containerPointToLatLng(this._startPoint),
            this._map.containerPointToLatLng(this._point)
        );
        L.rectangle(boundsDos, { color: "#ff7800", weight: 1 }).addTo(this._map);
        console.log("estoy en up", boundsDos)
    },
});

L.Map.addInitHook('addHandler', 'personal', L.Personal);

export default function Map(props) {
    //Para guardar la referencia al mapa cuando se crea
    const [mapaReferencia, setmapaReferencia] = useState(null);
    //Contexto para pasar al contenedor del mapa
    const refMapContext = useContext(referenciaMapaContext)
    props.referencia(mapaReferencia);

    //Para guardar el grupo de capas de dibujo
    var capasDib = null;

    const [loadedFiles, setLoadedFiles] = useState([]);
    useEffect(() => {
        if (props.fileUpload)
            setLoadedFiles([...loadedFiles, props.fileUpload]);
    }, [props.fileUpload]);

    //Para guardar las referencias del mapa    
    useEffect(() => {
        if (mapaReferencia != undefined) {
            // refMapContext.refMap = mapaReferencia;
            // refMapContext.objL = L;
            // refMapContext.referenciaMapa();

            mapaReferencia.addControl(new L.Control.Fullscreen(
                {
                    title: {
                        false: 'Ver pantalla completa',
                        true: 'Salir de pantalla completa'
                    },
                    position: "bottomright"
                }
            ));

            var options = {
                modal: true,
                title: "Acercar a un área determinada"
            };
            var control = L.control.zoomBox(options);
            mapaReferencia.addControl(control);

            // L.easyPrint({
            //     title: 'Imprimir',
            //     position: 'topleft',
            //     sizeModes: ['A4Portrait', 'A4Landscape']
            // }).addTo(mapaReferencia);

            L.easyButton('<img src="/images/analisis/lupa_negativa.png" width=25px height=25px>', function (btn, map) {
                map.dragging.disable();
                map.personal.addHooks();
                // map.boxZoom.addHooks();
            }).addTo(mapaReferencia);
        }
    }, [mapaReferencia])

    function generatePolygon(bounds, result) {
        var polyBounds = [];
        bounds.map((item) => (
            item.map((subitem) => (
                // polyBounds.push([subitem.lat, subitem.lng])
                polyBounds.push([Math.floor(subitem.lat), Math.floor(subitem.lng)])
            ))
        ));
        polyBounds[polyBounds.length - 1] = [Math.floor(bounds[0][0].lat), Math.floor(bounds[0][0].lng)]
        result(polyBounds);
    }

    //Centro y zoom del mapa
    var centroInicial = [24.26825996870948, -102.88361673036671];
    var acercamientoInicial = 5;

    useEffect(() => {
        let lDrLo = L.drawLocal;
        lDrLo.draw.toolbar.buttons.polyline = "Dibujar una linea"
        lDrLo.draw.toolbar.buttons.polygon = "Dibujar un poligono"
        lDrLo.draw.toolbar.buttons.marker = "Dibujar un marcador"
        lDrLo.draw.toolbar.buttons.rectangle = "Dibujar un rectangulo";
        lDrLo.draw.handlers.rectangle.tooltip.start = "Mantener click y arrastrar para dibujar";
        lDrLo.draw.handlers.simpleshape.tooltip.end = "Dejar de hacer click para mostrar el dibujo";
        lDrLo.draw.handlers.polyline.error = "<strong>¡Error:</strong> las esquinas de la forma no se pueden cruzar!"
        lDrLo.draw.toolbar.actions.title = "Cancelar dibujo"
        lDrLo.draw.toolbar.actions.text = "Cancelar"
        lDrLo.draw.toolbar.finish.title = "Finalizar dibujo"
        lDrLo.draw.toolbar.finish.text = "Finalizar"
        lDrLo.draw.toolbar.undo.title = "Borrar último punto dibujado"
        lDrLo.draw.toolbar.undo.text = "Borrar último punto"
        lDrLo.draw.handlers.marker.tooltip.start = "Clic en el mapa para poner un marcador"
        lDrLo.draw.handlers.polygon.tooltip.start = "Clic para empezar a dibujar una forma"
        lDrLo.draw.handlers.polygon.tooltip.cont = "Clic para continuar dibujando la forma"
        lDrLo.draw.handlers.polygon.tooltip.end = "Clic en el primer punto para cerrar esta forma"
        lDrLo.draw.handlers.polyline.tooltip.start = "Clic para empezar a dibujar una linea"
        lDrLo.draw.handlers.polyline.tooltip.cont = "Clic para continuar dibujando la linea"
        lDrLo.draw.handlers.polyline.tooltip.end = "Clic en el último punto para finalizar la linea"
        lDrLo.edit.toolbar.actions.save.title = "Guardar cambios"
        lDrLo.edit.toolbar.actions.save.text = "Guardar"
        lDrLo.edit.toolbar.actions.cancel.title = "Cancelar edición, descartar todos los cambios"
        lDrLo.edit.toolbar.actions.cancel.text = "Cancelar"
        lDrLo.edit.toolbar.actions.clearAll.title = "Limpiar todo"
        lDrLo.edit.toolbar.actions.clearAll.text = "Limpiar todo"
        lDrLo.edit.toolbar.buttons.edit = "Editar polígonos"
        lDrLo.edit.toolbar.buttons.editDisabled = "No hay elementos para editar"
        lDrLo.edit.toolbar.buttons.remove = "Limpiar mapa"
        lDrLo.edit.toolbar.buttons.removeDisabled = "No hay elementos para eliminar"
        lDrLo.edit.handlers.edit.tooltip.text = "Arrastre controladores o marcadores para editar características"
        lDrLo.edit.handlers.edit.tooltip.subtext = "Clic en cancelar para deshacer los cambios"
        lDrLo.edit.handlers.remove.tooltip.text = "Clic en la figura para borrarla"

        update([
            {
                centroUndoRedo: { lat: 24.26825996870948, lng: -102.88361673036671 },
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

    function ControlMovimiento() {
        const [coordenadas, setCoordenadas] = useState("")
        const mapa = useMap();
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

    //Para obtener el grupo de los dibujos
    function grupoDibujos(e) {
        capasDib = e;
    }

    //Cuando se dibuja sobre el mapa
    function Dibujos() {
        let mapaDibujos = useMap();
        mapaDibujos.on('draw:created', function (e) {
            var type = e.layerType,
                layer = e.layer;
            if (type === 'polyline') {
                var distance = 0;
                length = layer.getLatLngs().length;
                for (var i = 1; i < length; i++) {
                    distance += layer.getLatLngs()[i].distanceTo(layer.getLatLngs()[i - 1]);
                }
                layer.bindTooltip(`<p class="text-center">Distancia:</p><p>${new Intl.NumberFormat('en-US').format((distance / 1000))} km</p><p>${new Intl.NumberFormat('en-US').format((distance))} m</p>`, { permanent: false, direction: "center" }).openTooltip()
            } else if (type !== 'marker') {
                var area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
                layer.bindTooltip(`<p class="text-center">Área:</p><p>${new Intl.NumberFormat('en-US').format((area / 10000))} ha</p><p>${new Intl.NumberFormat('en-US').format((area / 1000000))} km<sup>2</sup></p><p>${new Intl.NumberFormat('en-US').format((area / 1000))} m<sup>2</sup></p>`, { permanent: false, direction: "center" }).openTooltip()
            }
        });

        mapaDibujos.on('draw:edited', function (e) {
            var layers = e.layers;
            layers.eachLayer(function (layer) {
                if (layer instanceof L.Polyline && !(layer instanceof L.rectangle) && !(layer instanceof L.Polygon)) {
                    var distance = 0;
                    length = layer.getLatLngs().length;
                    for (var i = 1; i < length; i++) {
                        distance += layer.getLatLngs()[i].distanceTo(layer.getLatLngs()[i - 1]);
                    }
                    layer.bindTooltip(`<p class="text-center">Distancia:</p><p>${new Intl.NumberFormat('en-US').format((distance / 1000))} km</p><p>${new Intl.NumberFormat('en-US').format((distance))} m</p>`, { permanent: false, direction: "center" }).openTooltip()
                } else if (!(layer instanceof L.Marker)) {
                    var area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
                    console.log('latlngs: ', layer.getLatLngs())
                    layer.bindTooltip(`<p class="text-center">Área:</p><p>${new Intl.NumberFormat('en-US').format((area / 10000))} ha</p><p>${new Intl.NumberFormat('en-US').format((area / 1000000))} km<sup>2</sup></p><p>${new Intl.NumberFormat('en-US').format((area / 1000))} m<sup>2</sup></p>`, { permanent: false, direction: "center" }).openTooltip()
                }
            });
        });

        return null;
    }

    return (
        <>
            <Head>
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
                    integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin="" />
            </Head>

            <div className="div-herramientas-mapa">
                <select onChange={(e) => cambiaTipoCoordenada(e)} className="tw-mr-5 select-cambia-coordenadas">
                    <option value='1'>Grados decimales</option>
                    <option value='2'>Metros</option>
                    <option value='3'>Grados, minutos y segundos</option>
                </select>
                <OverlayTrigger rootClose overlay={<Tooltip>Vista anterior</Tooltip>}>
                    <button disabled={!canUndo} className="botones-barra-mapa" name="undo" onClick={MapaMovimientoUndoRedo}>
                        <FontAwesomeIcon className="tw-pointer-events-none" icon={faChevronLeft} />
                    </button>
                </OverlayTrigger>
                <OverlayTrigger rootClose overlay={<Tooltip>Vista posterior</Tooltip>}>
                    <button disabled={!canRedo} className="botones-barra-mapa" name="redo" onClick={MapaMovimientoUndoRedo}>
                        <FontAwesomeIcon className="tw-pointer-events-none" icon={faChevronRight} />
                    </button>
                </OverlayTrigger>
            </div>

            <MapContainer whenCreated={setmapaReferencia} center={centroInicial} zoom={acercamientoInicial} scrollWheelZoom={true} style={{ height: 500, width: "100%" }} minZoom={0} zoomControl={false}>
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
                <FeatureGroup ref={(e) => grupoDibujos(e)}>
                    <EditControl
                        position='topright'
                        draw={{
                            rectangle: true,
                            circle: false,
                            circlemarker: false,
                        }}
                    >
                    </EditControl>
                </FeatureGroup>
                <Dibujos />
                <ControlMovimiento />
                {
                    loadedFiles.length > 0 && (
                        loadedFiles.map((file, index) =>
                            file.type == 'json' ? (
                                <GeoJSON key={index}
                                    data={file.data}
                                />
                            ) :
                                file.type == 'kml' ? (
                                    <ReactLeafletKml key={index}
                                        kml={new DOMParser().parseFromString(file.data, 'text/xml')} />
                                ) :
                                    ''
                        )
                    )
                }
            </MapContainer>

        </>
    )
}
