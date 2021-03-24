import { MapContainer, TileLayer, GeoJSON, WMSTileLayer, ScaleControl, LayersControl, useMapEvents, useMap } from 'react-leaflet'
import { useState, useRef, useEffect } from 'react'
import { Table } from 'react-bootstrap'
import Head from 'next/head'

// import Control from 'react-leaflet-control'

//Si no es necesario cargar los marcadores
import "leaflet/dist/leaflet.css"

import 'leaflet-fullscreen/dist/Leaflet.fullscreen.css'
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js'

import TextPath from 'react-leaflet-textpath';
import { Control } from 'leaflet'
const { BaseLayer } = LayersControl;

const Map = (props) => {
    //Para guardar los rasgos
    const [rasgos, setRasgos] = useState([])
    function onEachFeature(feature = {}, layer) {
        layer.on('click', function (e) {
            setRasgos([e.target.feature.properties])
        })
    }

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

    function ControlMovimiento() {
        
        const [coordinadas, setCoordinadas] = useState("")
        const mapa = useMap()
        
        const map = useMapEvents({
            moveend() {
                var centro = map.getCenter();
                var zoom = map.getZoom();
                console.log("drag", centro);
                console.log("zoom", zoom);
            },
            mousemove(e) {
                setCoordinadas(e.latlng)
            }
        })

        // console.log("cord", coordinadas);

        useEffect(() => {
            const legend = L.control({ position: "bottomleft" });

            legend.onAdd = () => {
                const div = L.DomUtil.create("div", "legend");
                div.innerHTML = coordinadas
                return div;
            };

            legend.addTo(mapa);

            return () => legend.remove();
        }, [coordinadas]);

        return null;
    }

    return (
        <>
            <Head>
                {/* <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
                    integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="crossorigin="" /> */}
            </Head>

            <MapContainer fullscreenControl={true} center={[19.380964227121666, -99.16353656125003]} zoom={6} scrollWheelZoom={false} style={{ height: 400, width: "100%" }}>

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
                {
                    props.datos.map((capa, index) => {
                        if (capa.habilitado) {
                            if (capa.tipo == "geojson") {
                                return (
                                    <GeoJSON key={index} data={capa} style={estilos} onEachFeature={onEachFeature} />
                                )
                            }
                            if (capa.tipo == "wms") {
                                return (
                                    <WMSTileLayer key={index} attribution={capa.attribution} url={capa.url} layers={capa.layers} format={capa.format} transparent={capa.transparent} />
                                )
                            }

                        }
                    })
                }
            </MapContainer>

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