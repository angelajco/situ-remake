import Head from 'next/head'
import React, { useState, useEffect, useContext } from 'react'

import { MapContainer, ScaleControl, LayersControl, TileLayer, useMap, ZoomControl, FeatureGroup, useMapEvents } from 'react-leaflet'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

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


export default function Map(props) {
    //Para guardar la referencia al mapa cuando se crea
    const [mapaReferencia, setmapaReferencia] = useState(null);
    //Contexto para pasar al contenedor del mapa
    const refMapContext = useContext(referenciaMapaContext)
    props.referencia(mapaReferencia);

    //Para guardar el grupo de capas de dibujo
    var capasDib = null;

    //Para guardar las referencias del mapa    
    useEffect(() => {
        if (mapaReferencia != null) {
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
        lDrLo.draw.handlers.marker.tooltip.start = "Clic en el mapa para poner un marcador."
        lDrLo.draw.handlers.polygon.tooltip.start = "Clic para empezar a dibujar una forma."
        lDrLo.draw.handlers.polygon.tooltip.cont = "Clic para continuar dibujando la forma."
        lDrLo.draw.handlers.polygon.tooltip.end = "Clic en el primer punto para cerrar esta forma."
        lDrLo.draw.handlers.polyline.tooltip.start = "Clic para empezar a dibujar una linea."
        lDrLo.draw.handlers.polyline.tooltip.cont = "Clic para continuar dibujando la linea."
        lDrLo.draw.handlers.polyline.tooltip.end = "Clic en el último punto para finalizar la linea."
        lDrLo.edit.toolbar.actions.save.title = "Guardar cambios"
        lDrLo.edit.toolbar.actions.save.text = "Guardar"
        lDrLo.edit.toolbar.actions.cancel.title = "Cancelar edición, descartar todos los cambios"
        lDrLo.edit.toolbar.actions.cancel.text = "Cancelar"
        lDrLo.edit.toolbar.actions.clearAll.title = "Limpiar todas las capas"
        lDrLo.edit.toolbar.actions.clearAll.text = "Limpiar todo"
        lDrLo.edit.toolbar.buttons.edit = "Editar capas"
        lDrLo.edit.toolbar.buttons.editDisabled = "No hay capas para editar"
        lDrLo.edit.toolbar.buttons.remove = "Borrar capas"
        lDrLo.edit.toolbar.buttons.removeDisabled = "No hay capas para borrar"
        lDrLo.edit.handlers.edit.tooltip.text = "Arrastre controladores o marcadores para editar carecaterísticas."
        lDrLo.edit.handlers.edit.tooltip.subtext = "Clic en cancelar para deshacer los cambios"
        lDrLo.edit.handlers.remove.tooltip.text = "Click en la figura para borrarla."
    }, [])

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
                layer.bindTooltip(`<p class="text-center">Distacia:</p><p>${new Intl.NumberFormat('en-US').format((distance / 1000))} km</p><p>${new Intl.NumberFormat('en-US').format((distance))} m</p>`, { permanent: false, direction: "center" }).openTooltip()
            } else if (type !== 'marker') {
                var area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
                // generatePolygon(layer.getLatLngs(), function(result) {
                //     console.log('polyBounds: ', result);
                //     console.log('turf.area: ', Turf.area(Turf.polygon([result])));
                // });
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
                    layer.bindTooltip(`<p class="text-center">Distacia:</p><p>${new Intl.NumberFormat('en-US').format((distance / 1000))} km</p><p>${new Intl.NumberFormat('en-US').format((distance))} m</p>`, { permanent: false, direction: "center" }).openTooltip()
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
            </div>

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
            </MapContainer>

        </>
    )
}