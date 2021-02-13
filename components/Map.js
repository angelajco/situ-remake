import { MapContainer, TileLayer, GeoJSON, WMSTileLayer, ScaleControl, Popup } from 'react-leaflet'
import { useState, useRef, useEffect } from 'react'

//Si no es necesario cargar los marcadores
import "leaflet/dist/leaflet.css"

import 'leaflet-fullscreen/dist/Leaflet.fullscreen.css'
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js'

const Map = (props) => {
    const [rasgos, setRasgos] = useState([])
    //estilos del mapa, se puede enviar como funcion o como objeto
    //como funcion
    function estilos() {
        return {
            color: "#FF0000",
        }
    }
    //como objeto
    // const estilos = {
    //     fillColor: "#FF0000",
    // }

    const arreglo = [];

    function onEachFeature(feature = {}, layer) {
        const { properties = {} } = feature;
        const { NOMGEO } = properties
        if (!NOMGEO) return
        // console.log(NOMGEO)
        layer.bindPopup(`<p>${NOMGEO}</p>`);

        arreglo.push(NOMGEO);

        useEffect(() => {
            setRasgos([
                ...rasgos,
                arreglo
            ])
        }, [])
    }

    // useEffect()
    // console.log(arreglo)
    console.log(rasgos)
    return (
        <>
            <MapContainer fullscreenControl={true} center={[19.380964227121666, -99.16353656125003]} zoom={6} scrollWheelZoom={false} style={{ height: 400, width: "100%" }}>
                <ScaleControl maxWidth="500" />
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* {datosGeoJson &&
                    <GeoJSON data={datosGeoJson} style={estilos} />
                } */}
                {
                    props.datos.map((capa, index) => {
                        if (capa.habilitado) {
                            if (capa.tipo == "geojson") {
                                return (
                                    <GeoJSON data={capa} style={estilos} key={index} onEachFeature={onEachFeature} />
                                )
                            }
                            if (capa.tipo == "wms") {
                                return (
                                    <WMSTileLayer attribution={capa.attribution} url={capa.url} layers={capa.layers} format={capa.format} transparent={capa.transparent} />
                                )
                            }

                        }
                    })
                }
            </MapContainer>

            <p>Rasgos</p>
            <div>
                {
                    rasgos.map(valor => {
                        return (
                            <p>{ valor }</p>
                        )
                    })
                }
            </div>
        </>
    )
}

export default Map