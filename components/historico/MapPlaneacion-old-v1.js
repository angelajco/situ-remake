import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON, ScaleControl } from 'react-leaflet'

//Si no es necesario cargar los marcadores
import "leaflet/dist/leaflet.css"
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css'
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js'
import CapasMapa from './CapasMapa'

const MapPlaneacion = (props) => {

  const { seccion } = props
  const { cl } = props

  cl(L)

  const [refresca, setRefresca] = useState(0)

  const cambia = () => {
    setRefresca(refresca + 1)
    console.log('VAlor de iteracion: ', refresca)
  }

  if (seccion != null) {
    seccion.refrescarContenido = cambia
  }

  useEffect(() => {
    console.log('Despliegue mapa terminado', seccion.capas)
  }, [seccion])

  return (
    <>
      <MapContainer fullscreenControl={true} center={[23.380964227121666, -99.16353656125003]} zoom={5} scrollWheelZoom={false} style={{ height: 400, width: "100%" }} >
        <ScaleControl maxWidth="500" />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {
          <CapasMapa seccion={seccion} />
        }
      </MapContainer>
    </>
  )
}

export default MapPlaneacion