import { MapContainer, TileLayer, GeoJSON, WMSTileLayer, ScaleControl } from 'react-leaflet'
import { useState } from 'react'
import { Table } from 'react-bootstrap'

//Si no es necesario cargar los marcadores
import "leaflet/dist/leaflet.css"

import 'leaflet-fullscreen/dist/Leaflet.fullscreen.css'
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js'

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

            <p>Rasgos</p>
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