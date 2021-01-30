import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { useState, useEffect } from 'react'
import Head from 'next/head'

//Si no es necesario cargar los marcadores
import "leaflet/dist/leaflet.css"

const Map = (props) => {
    const [datosGeoJson, setDatosGeoJson] = useState(null)

    useEffect(() => {
        if (props.datos) {
            console.log("hola")
            setDatosGeoJson(props.datos);
        }
    }, [])

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
            <Head>
                {/*En caso de usar Marker cargar esta libreria y comentar la primera */}
                {/* <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
                    integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin="" /> */}
                {/* <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js" integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==" crossorigin=""></script> */}
                <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
                    integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
                    crossorigin=""></script>
            </Head>
            <MapContainer center={[19.380964227121666, -99.16353656125003]} zoom={6} scrollWheelZoom={false} style={{ height: 400, width: "100%" }}>
                {datosGeoJson &&
                    <GeoJSON data={datosGeoJson} style={estilos} />
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