import React, { useState } from 'react'
// import MapPlaneacion from './MapPlaneacion'
import dynamic from 'next/dynamic'
import ContenedorPM from './ContenedorPM'

  //Importa dinámicamente el mapa
  let MapPlaneacion = null;
  let municipio = null;

export default function SeccionPm(props) {
  const { seccion } = props
  const { cl } = props

  if(municipio != seccion.nucleo.claveMun) {
    municipio = seccion.nucleo.claveMun;
    MapPlaneacion = dynamic(
      () => import('./MapPlaneacion'),
      {
        loading: () => <p>El mapa está cargando</p>,
        ssr: false
      }
    )
  }

  // console.log('Seccion PM props', cl)
  // console.log('Seccion PM', capturaL)

  const [refresca, setRefresca] = useState(0)

  const cambia = () => {
    // console.log('Refrescando SeccionPM', refresca)
    setRefresca(refresca + 1)
  }

  seccion.refrescarContenido = cambia
  // console.log('Componente PM', seccion)


  return (
    <section className="row">
      {
        // console.log('Refresca', seccion.titulo, refresca)
      }
      <h3 className="col-12 tw-text-center">{seccion.tituloSeccion()}</h3>
      {
        (seccion.tipo === 'mapaBase')
          ?
          <div className="col-12">
            <MapPlaneacion seccion={seccion} cl={cl} />
          </div>
          :
          <div className="container-fluid">
            <div className="row">
              {
                (seccion.contenedores.length > 0)
                  ?
                  seccion.contenedores.map((contenedor, index) => (
                    <div key={index} className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12 tw-my-5">
                      <div className="card">
                        <div className="card-body">
                          <div className="row justify-content-center">
                            {
                              (contenedor.titulo !== null)
                                ?
                                <h5 className="col-12 tw-text-center tw-py-2">{contenedor.titulo}</h5>
                                :
                                null
                            }
                            <ContenedorPM contenido = {contenedor.contenido} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                  :
                  null
              }
            </div>
          </div>
      }
    </section>
  )
}
