import { useState } from 'react'
import { MapContainer, TileLayer, GeoJSON, ScaleControl, useMap } from 'react-leaflet';

//Si no es necesario cargar los marcadores
import "leaflet/dist/leaflet.css"

//import 'leaflet-fullscreen/dist/leaflet.fullscreen.css'
//import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js'
import 'leaflet-zoombox/L.Control.ZoomBox.css'
import './leaflet.scalefactor.js'
import './L.Control.BetterScale.js'
import './L.Grid.js'
import CapasMapa from './CapasMapa'

const MapaImpresion = (props) => {

    const { seccion } = props
    const { capas } = props
    const { estilos } = props
    const { forma } = props

    const [refresca, setRefresca] = useState(0)

    const cambia = () => {
        setRefresca(refresca + 1)
        console.log('Valor de iteracion: ', refresca)
    }

    if (seccion != null) {
        seccion.refrescarContenido = cambia
    }
    var L2 = {}
    var mapaBase = null
    var capa;
    var estilo;
    var encontradaC;

    function capturaL(mapa, objeto) {
        L2 = objeto
        mapaBase = mapa
        if (mapaBase.configurado) {

        } else {
            let capa0 = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
            });
            mapaBase.addLayer(capa0);
            L.control.betterscale().addTo(mapaBase);
            L.control.scalefactor().addTo(mapaBase);
            var north = L.control({ position: "topright" });
            north.onAdd = () => {
                const div = L.DomUtil.create("div", "leaflet-rose leaflet-control");
                div.innerHTML = '<img src="/images/analisis/arrows/default.svg">'
                return div;
            };
            north.addTo(mapaBase);
            L.grid().addTo(mapaBase);
            //verificamos el numero de capas en el mapa original 

            capas.forEach(element => {
                capa = element;
                encontradaC = buscarSimbologia(capa.nom_capa);
                //console.log(encontradaC);

                if (encontradaC == -1 || encontradaC == undefined) {
                    if (capa.features[0].geometry.type == 'MultiPolygon') {

                        let cap1 = L.geoJson(capa, {
                            style: capa.layer.options.style
                        });
                        mapaBase.addLayer(cap1);

                    }
                    if (capa.features[0].geometry.type == 'Point') {
                        let cap1 = L.geoJSON(capa, {
                            pointToLayer: function (feature, latlng) {
                                return L.circleMarker(latlng, {
                                    radius: 5,
                                    fillColor: '#FF7777',
                                    color: '#FF0000',
                                    weight: 1,
                                    opacity: 1,
                                    fillOpacity: 0.8
                                });

                            }
                        });
                        mapaBase.addLayer(cap1);
                    }
                    if (capa.features[0].geometry.type == 'MultiLineString') {
                        function estilosL(feature) {
                            return {
                                color: '#FF7777',
                                weight: 1,
                                opacity: 0.7
                            };
                        }

                        let cap1 = L.geoJSON(capa, { style: estilosL })
                        mapaBase.addLayer(cap1);
                    }
                } else {
                    if (capa.features[0].geometry.type == 'MultiPolygon') {
                        estilo = estilos[encontradaC];
                        let cap1 = L.geoJson(capa, {
                            style: style6
                        });
                        mapaBase.addLayer(cap1);

                    }
                    if (capa.features[0].geometry.type == 'Point') {
                        estilo = estilos[encontradaC];
                        //console.log(estilo);
                        let cap1 = L.geoJSON(capa, {
                            pointToLayer: function (feature, latlng) {
                                var propertyValue = feature.properties[estilo.varSeleccionada];
                                var aux1 = estilo.simbologia.getSimbologia(propertyValue);
                                return L.circleMarker(latlng, {
                                    radius: aux1.radius,
                                    fillColor: aux1.colorFill,
                                    color: aux1.colorBorde,
                                    weight: aux1.anchoBorde,
                                    opacity: 1,
                                    fillOpacity: 0.8
                                });

                            }
                        });
                        mapaBase.addLayer(cap1);
                    }
                    if (capa.features[0].geometry.type == 'MultiLineString') {
                        estilo = estilos[encontradaC];
                        function estilosL(feature) {
                            var propertyValue = feature.properties[estilo.varSeleccionada];
                            var myFillColor = estilo.simbologia.getSimbologia(propertyValue);
                            //console.log(myFillColor);
                            return {
                                color: myFillColor.colorFill,
                                weight: myFillColor.anchoBorde,
                                opacity: myFillColor.opacity
                            };
                        }

                        let cap1 = L.geoJSON(capa, { style: estilosL })
                        mapaBase.addLayer(cap1);
                    }
                }
            });
            mapaBase.configurado = true;

        }

    }
    function style6(feature) {

        let opciones = estilo.simbologia.getSimbologia(feature.properties[estilo.varSeleccionada]);
        return {
            fillColor: opciones.colorFill,
            weight: opciones.anchoBorde,
            opacity: 1,
            color: opciones.colorBorde,
            dashArray: '1',
            fillOpacity: opciones.fillOpacity
        };
    }

    function buscarSimbologia(nombreCapa) {
        if (estilos.length > 0) {
            for (let index = 0; index < estilos.length; index++) {
                //console.log(estilos[index]);
                if (estilos[index].name == nombreCapa) {
                    return index;
                }
            }
        } else {
            return -1;
        }
    }


    //
    return (
        <>
            {
                forma == 'Horizontal' ? (
                    <MapContainer center={[23.380964227121666, -99.16353656125003]} zoom={5} scrollWheelZoom={true} style={{ height: "97%", width: "100%" }} >
                        <CapasMapa seccion={seccion} cl={capturaL} />
                    </MapContainer>
                ) : (
                    forma == 'Vertical' && (
                        <MapContainer center={[23.380964227121666, -99.16353656125003]} zoom={5} scrollWheelZoom={true} style={{ height: 700, width: 900 }} >
                            <CapasMapa seccion={seccion} cl={capturaL} />
                        </MapContainer>
                    )
                )
            }
        </>
    )
}

export default MapaImpresion
