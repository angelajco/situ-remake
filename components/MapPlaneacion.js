import { MapContainer, TileLayer, ScaleControl } from 'react-leaflet'

//Si no es necesario cargar los marcadores
import "leaflet/dist/leaflet.css"
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.css'
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js'

const MapPlaneacion = () => {
  return (
    <>
      <MapContainer fullscreenControl={true} center={[23.380964227121666, -99.16353656125003]} zoom={5} scrollWheelZoom={false} style={{ height: 400, width: "100%" }}>
        <ScaleControl maxWidth="500" />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </>
  )
}

export default MapPlaneacion