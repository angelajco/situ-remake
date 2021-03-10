import React, { useState } from 'react'
// import MapPlaneacion from './MapPlaneacion'
import dynamic from 'next/dynamic'
import ContenedorPM from './ContenedorPM'

export default function SeccionPm(props) {

  

  const { seccion } = props
  const { cl } = props

  // console.log('Seccion PM props', cl)
  // console.log('Seccion PM', capturaL)

  const [refresca, setRefresca] = useState(0)

  const cambia = () => {
    // console.log('Refrescando SeccionPM', refresca)
    setRefresca(refresca + 1)
  }

  //Importa dinámicamente el mapa
  const MapPlaneacion = dynamic(
    () => import('./MapPlaneacion'),
    {
      loading: () => <p>El mapa está cargando</p>,
      ssr: false
    }
  )

  seccion.refrescarContenido = cambia
  // console.log('Componente PM', seccion)


  return (
    <section className="tw-my-6 tw-bg-gray-300">
      {
        // console.log('Refresca', seccion.titulo, refresca)
      }
      <h3 className="tw-mb-6 tw-text-center">{seccion.tituloSeccion()}</h3>
      {
        (seccion.tipo === 'mapaBase')
          ?
          <MapPlaneacion seccion={seccion} cl={cl} />
          :
          <div className="tw-flex tw-w-full tw-justify-between tw-flex-wrap">
            {
              (seccion.contenedores.length > 0)
                ?
                seccion.contenedores.map((contenedor, index) => (
                  <div key={index} className="tw-px-6">
                    {
                      (contenedor.titulo !== null)
                        ?
                        <h4 className="tw-mb-6 tw-text-center">{contenedor.titulo}</h4>
                        :
                        null
                    }
                    <ContenedorPM contenido = {contenedor.contenido} />
                  </div>
                ))
                :
                null
            }
          </div>
      }
    </section>
  )
}
