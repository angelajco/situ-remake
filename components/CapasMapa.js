import React, { useRef, useEffect } from 'react'
import { GeoJSON, useMap } from 'react-leaflet'

export default function CapasMapa(props) {

  const ref = useRef()

  const { seccion } = props

  let capaAgregada = null

  const map = useMap()
  console.log('Capa agregada')

  map.on('layeradd', () => {
    console.log('Evento LAYER ADD')
  })
  // const map = useMap()
  // function capaAgregada() {
  //   console.log('Seagrego capa al map')
  // }

  // map.layeradd = capaAgregada

  function MyComponent() {
    const map = useMap()
    const capa = useRef()

    if (capaAgregada != null && capaAgregada.marcaExt) {

    }
    // .current.getBounds()

    // useEffect(() => {
    //   setTimeout(function(){ console.log('Capa agregada UseEffect ', capa)}, 5000)
    // }, [])

    return <GeoJSON data={capaAgregada.geoJson} style={capaAgregada.simbologia} />
  }

  let referenciasCapa = []

  for (let index = 0; index < seccion.capas.length; index++) {
    referenciasCapa.push(useRef(seccion.capas[index].titulo))
  }

  useEffect(() => {
    console.log('Mapa ', map)
    console.log('Referencias Capa ', referenciasCapa)
    for (let index = 0; index < seccion.capas.length; index++) {
      if (seccion.capas[index].marcaExt) {
        let capa = referenciasCapa[index].current.leafletElement
        if (capa != undefined) {
          map.fitBounds(capa.getBounds())
        }
        return
      }
      // referenciasCapa.push(useRef(seccion.capas[index].titulo))
    }
  }, [referenciasCapa, seccion, map])

  return (
    <>
      {
        seccion.capas.map((capa, index) => {
          if (capa.geoJson != null) {
            capaAgregada = capa
            return (
              <>
                {/* <GeoJSON key={index} data={capa.geoJson} style={capa.simbologia} ref={referenciasCapa[index]} /> */}
                <MyComponent />
              </>
            )
          } else {
            return ''
          }
        })
      }
    </>
  )
}
