import { MapContainer, TileLayer, GeoJSON, WMSTileLayer } from 'react-leaflet'
// import { useState, useEffect } from 'react'

//Si no es necesario cargar los marcadores
import "leaflet/dist/leaflet.css"

const Map = (props) => {
    // const [datosGeoJson, setDatosGeoJson] = useState([])

    // useEffect(() => {
    //     if (props.datos != null) {
    //         const capasMostrar = props.datos.map(capa => {
    //             if (capa.habilitado) {
    //                 return capa;
    //             }
    //             else {
    //                 return {};
    //             }
    //         })

    //         console.log(capasMostrar)
    //         setDatosGeoJson(capasMostrar)
    //     }
    // }, [])

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

    console.log(props.datos)

    return (
        <>
            <MapContainer center={[19.380964227121666, -99.16353656125003]} zoom={6} scrollWheelZoom={false} style={{ height: 400, width: "100%" }}>
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
                            if(capa.tipo == "geojson"){
                                return (
                                    <GeoJSON data={capa} style={estilos} key={index} />
                                )
                            }
                            if(capa.tipo == "wms"){
                                return (
                                    <WMSTileLayer attribution={capa.attribution} url={capa.url} layers={capa.layers} format={capa.format} transparent={capa.transparent} />
                                )
                            }
                            
                        }
                    })
                }
            </MapContainer>
        </>
    )
}

export default Map