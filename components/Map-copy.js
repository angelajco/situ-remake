import Head from 'next/head'
import React from 'react'

import { useState } from 'react'

import { MapContainer, ScaleControl, LayersControl, TileLayer } from 'react-leaflet'
const { BaseLayer } = LayersControl;

//Si no es necesario cargar los marcadores
// import "leaflet/dist/leaflet.css"

import 'leaflet-fullscreen/dist/Leaflet.fullscreen.css'
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js'

import 'leaflet-draw/dist/leaflet.draw.css'

const Map = (props) => {
    // console.log("se renderiza mpa copy");
    
    const [mapaReferencia, setmapaReferencia] = useState(null);
    props.referencia(mapaReferencia);


    //Centro y zoom del mapa
    var centroInicial = [23.26825996870948, -102.88361673036671];
    var acercamientoInicial = 5;

    return (
        <>
            <Head>
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
                    integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin="" />
            </Head>
            <MapContainer whenCreated={setmapaReferencia} fullscreenControl={true} center={centroInicial} zoom={acercamientoInicial} scrollWheelZoom={true} style={{ height: 400, width: "100%" }}>
                <ScaleControl maxWidth="100" />
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
            </MapContainer>
        </>
    )
}

export default Map