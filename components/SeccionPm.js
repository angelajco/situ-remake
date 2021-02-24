import React from 'react'
// import MapPlaneacion from './MapPlaneacion'
import dynamic from 'next/dynamic'

export default function SeccionPm(props) {
  const { seccion } = props

  //Importa dinámicamente el mapa
  const MapPlaneacion = dynamic(
    () => import('./MapPlaneacion'),
    {
      loading: () => <p>El mapa está cargando</p>,
      ssr: false
    }
  )


  return (
    <section className="tw-my-6">
      <h3 className="tw-mb-6">{seccion.tituloSeccion()}</h3>
      {
        (seccion.tipo === 'mapaBase')
          ?
          <MapPlaneacion />
          :
          ''
      }
    </section>
  )
}
