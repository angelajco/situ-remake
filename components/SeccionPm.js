import React, {useState} from 'react'
// import MapPlaneacion from './MapPlaneacion'
import dynamic from 'next/dynamic'
import Tabular from './Tabular'

export default function SeccionPm(props) {
  const { seccion } = props

  const [refresca, setRefresca] = useState(0)

  const cambia = () => {
    console.log('Refrescando SeccionPM', refresca)
    setRefresca(refresca+1)
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
  console.log('Componente PM', seccion)

  return (
    <section className="tw-my-6">
      {
        console.log('Refresca', seccion.titulo, refresca)
      }
      <h3 className="tw-mb-6">{seccion.tituloSeccion()}</h3>
      {
        (seccion.tipo === 'mapaBase')
          ?
          <MapPlaneacion />
          :
          <>
            {
              (seccion.contenedores.length > 0)
              ?
              seccion.contenedores.map((contenedor, index)=> (
                  <div key={index} style={contenedor.EstilosCSSReact()} >
                    {
                    (contenedor.titulo !== null)
                      ?
                      <h4>{contenedor.titulo}</h4>
                      :
                      null
                    }
                    {
                    (contenedor.contenido.tipoComponente ?? 'nada' === 'Tabular')
                      ?
                        <>
                        {console.log('Desplegando tabular')}
                        <Tabular tabular = {contenedor.contenido} />
                        </>
                      :
                        <h1>No hay contenido</h1>
                    }
                  </div>
                ))
              :
              null
            }
          </>
      }
    </section>
  )
}
