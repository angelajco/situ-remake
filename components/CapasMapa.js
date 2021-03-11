import React from 'react'
import { useMap } from 'react-leaflet'

/****
 * Este Componenete solo sirve para tener una referencia al mapa
 * ***IMPORTANTE******
 * *** */

export default function CapasMapa(props) {


  const { seccion } = props
  const { cl } = props

  const map = useMap()

  cl(map, L)
  // const map = useMap()
  // function capaAgregada() {
  //   console.log('Seagrego capa al map')
  // }

  // map.layeradd = capaAgregada

  // function MyComponent() {
  //   const map = useMap()
  //   const capa = useRef()

  //   if (capaAgregada != null && capaAgregada.marcaExt) {

  //   }
  //   current.getBounds()

  //   useEffect(() => {
  //     setTimeout(function(){ console.log('Capa agregada UseEffect ', capa)}, 5000)
  //   }, [])

  //   return <GeoJSON data={capaAgregada.geoJson} style={capaAgregada.simbologia} />
  // }

  return (
    <>
    </>
  )
}
