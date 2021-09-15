import Head from 'next/head'
import React, { useState, useEffect, useContext } from 'react'

import { MapContainer, ScaleControl, LayersControl, TileLayer, useMap, ZoomControl, FeatureGroup, useMapEvents, WMSTileLayer } from 'react-leaflet'

const { BaseLayer } = LayersControl;
import { EditControl } from 'react-leaflet-draw'

import 'leaflet'
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css'
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-zoombox'
import 'leaflet-zoombox/L.Control.ZoomBox.css'
import 'leaflet-kml'
import 'leaflet-easyprint'

import { ContextoCreado } from '../context/contextoMapasProvider'

var mueveOtroMapa = true;

export default function Map(props) {
    const valoresContexto = useContext(ContextoCreado)
    //Para guardar la referencia al mapa cuando se crea
    const [mapaReferencia, setmapaReferencia] = useState(null);
    props.referencia(mapaReferencia);
    props.referenciaAnalisis(mapaReferencia);

    //Para guardar las referencias del mapa    
    useEffect(() => {
        if (mapaReferencia != undefined) {
            var north = L.control({ position: "topleft" });
            north.onAdd = () => {
                const div = L.DomUtil.create("div", "leaflet-rose leaflet-control");
                div.innerHTML = '<img src="/images/analisis/arrows/default.svg">'
                return div;
            };
            north.addTo(mapaReferencia);

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

    //Centro y zoom del mapa
    var centroInicial = [24.26825996870948, -102.88361673036671];
    var acercamientoInicial = 5;

    useEffect(() => {
        let lDrLo = L.drawLocal;
        lDrLo.draw.toolbar.buttons.polyline = "Dibujar una linea"
        lDrLo.draw.toolbar.buttons.polygon = "Dibujar un poligono"
        lDrLo.draw.toolbar.buttons.marker = "Dibujar un marcador"
        lDrLo.draw.toolbar.buttons.rectangle = "Dibujar un rectangulo";
        lDrLo.draw.handlers.rectangle.tooltip.start = "Mantener clic y arrastrar para dibujar";
        lDrLo.draw.handlers.circle.tooltip.start = "Mantener clic y arrastrar para identificar capas";
        lDrLo.draw.handlers.circle.radius = "Radio";
        lDrLo.draw.handlers.simpleshape.tooltip.end = "Dejar de hacer clic para finalizar";
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
    }, [])

    useEffect(() => {
        if (mapaReferencia != undefined) {
            if (props.mapeo == true) {
                mapaReferencia.dragging.enable();
                mapaReferencia.eachLayer(function (layer) {
                    if (layer instanceof L.GeoJSON) {
                        if(layer.options.hasOwnProperty("interactiva")){
                            mapaReferencia.removeLayer(layer)
                            layer.setStyle({interactive: false})
                            mapaReferencia.addLayer(layer)
                        }
                    }
                });
            } else {
                mapaReferencia.dragging.disable();
                mapaReferencia.eachLayer(function (layer) {
                    if (layer instanceof L.GeoJSON) {
                        if(layer.options.hasOwnProperty("interactiva")){
                            mapaReferencia.removeLayer(layer)
                            layer.setStyle({interactive: true})
                            mapaReferencia.addLayer(layer)
                        }
                    }
                });
            }
        }
    }, [props.mapeo, mapaReferencia])

    useEffect(() => {
        if (valoresContexto.valoresMapa.centro != null) {
            mueveOtroMapa = false
            mapaReferencia.setView(valoresContexto.valoresMapa.centro, valoresContexto.valoresMapa.zoom)
        }
    }, [valoresContexto.valoresMapa])

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
            moveend(e) {
                let centroUndoRedo = mapaEventos.getCenter();
                let zoomUndoRedo = mapaEventos.getZoom();
                if (mueveOtroMapa == true) {
                    valoresContexto.setValoresMapaEspejo({ centro: centroUndoRedo, zoom: zoomUndoRedo})
                }
                mueveOtroMapa = true;
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

    return (
        <>
            <div className="div-herramientas-mapa">
                <select onChange={(e) => cambiaTipoCoordenada(e)} className="tw-mr-5 select-cambia-coordenadas">
                    <option value='1'>Grados decimales</option>
                    <option value='2'>Metros</option>
                    <option value='3'>Grados, minutos y segundos</option>
                </select>
            </div>

            <MapContainer id="id-export-Map" whenCreated={setmapaReferencia} center={centroInicial} zoom={acercamientoInicial} scrollWheelZoom={true} style={{ height: 500, width: "100%" }} minZoom={5} zoomControl={false} doubleClickZoom={false}>
                <ScaleControl maxWidth="100" />
                <ZoomControl position="bottomright" zoomInTitle="Acercar" zoomOutTitle="Alejar" />

                <LayersControl>
                    <BaseLayer checked name="INEGI">
                        <WMSTileLayer
                            url="http://gaiamapas.inegi.org.mx/mdmCache/service/wms?" layers="MapaBaseTopograficov61_consombreado"
                        />
                    </BaseLayer>
                    <BaseLayer name="Open street map">
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </BaseLayer>
                </LayersControl>
                <FeatureGroup>
                    <EditControl
                        position='topright'
                        draw={{
                            circlemarker: false,
                        }}
                    >
                    </EditControl>
                </FeatureGroup>
                <ControlMovimiento />
            </MapContainer>
        </>
    )
}