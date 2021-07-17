import { useState } from 'react'
import { MapContainer, TileLayer, GeoJSON, ScaleControl, useMap } from 'react-leaflet'

//Si no es necesario cargar los marcadores
import "leaflet/dist/leaflet.css"
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css'
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js'
import CapasMapa from './CapasMapa'

const MapPlaneacion = (props) => {

  const { seccion } = props
  const { cl } = props

  // cl(L)

  const [refresca, setRefresca] = useState(0)

  const cambia = () => {
    setRefresca(refresca + 1)
    console.log('Valor de iteracion: ', refresca)
  }

  if (seccion != null) {
    seccion.refrescarContenido = cambia
  }

  return (
    <>
      <MapContainer fullscreenControl={true} center={[23.380964227121666, -99.16353656125003]} zoom={5} scrollWheelZoom={false} style={{ height: 650, width: "100%" }} >
        <ScaleControl maxWidth="500" />
        {/* <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        /> */}
        <CapasMapa seccion={seccion} cl={cl} />
      </MapContainer>
    </>
  )
}

export default MapPlaneacion
