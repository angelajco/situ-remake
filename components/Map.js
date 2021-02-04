import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { useState, useEffect } from 'react'

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

    return (
        <>
            <MapContainer center={[19.380964227121666, -99.16353656125003]} zoom={6} scrollWheelZoom={false} style={{ height: 400, width: "100%" }}>
                {/* {datosGeoJson &&
                    <GeoJSON data={datosGeoJson} style={estilos} />
                } */}
                {
                    props.datos.map((capa, index) => {
                        if (capa.habilitado) {
                            return (
                                <GeoJSON data={capa} style={estilos} key={index} />
                            )
                        }
                    })
                }
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
        </>
    )
}

export default Map