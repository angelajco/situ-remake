import React, { useState } from 'react'
// import MapPlaneacion from './MapPlaneacion'
import dynamic from 'next/dynamic'
import Tabular from './Tabular'
import GraficaPM from './GraficaPM'

export default function SeccionPm(props) {

  const { seccion } = props

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
          <MapPlaneacion />
          :
          <div className="tw-flex tw-w-full">
            {
              (seccion.contenedores.length > 0)
                ?
                seccion.contenedores.map((contenedor, index) => (
                  <div key={index} style={contenedor.EstilosCSSReact()} >
                    {
                      (contenedor.titulo !== null)
                        ?
                        <h4 className="tw-mb-6 tw-text-center">{contenedor.titulo}</h4>
                        :
                        null
                    }
                    {
                      (contenedor.contenido.tipoComponente ?? 'nada' === 'Tabular')
                        ?
                        <>
                          {console.log('Desplegando tabular')}
                          <Tabular tabular={contenedor.contenido} />
                        </>
                        :
                          (contenedor.contenido.tipoComponente ?? 'nada' === 'Grafica')
                          ?
                            <>
                            {console.log('desplegando grafica')}
                            <h1>Estoy poniendo una grafica</h1>
                            {/* <GraficaPM grafica = {contenedor.contenido} /> */}
                            </>
                          :
                            <h1>No hay contenido</h1>
                    }
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
