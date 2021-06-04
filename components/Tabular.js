import React, { useState } from 'react'

export default function Tabular(props) {

  const { tabular } = props

  const [refrescaTabular, setRefrescaTabular] = useState(0)

  const cambia = () => {
    setRefrescaTabular(refrescaTabular + 1)
  }

  // const a = [[1,2,3],[4,5,6],[7,8,9]]
  const contenidoFormateado = []
  const contenidoTabla = tabular.contenidoTabla()

  for (let index2 = 0; index2 < contenidoTabla.length; index2++) {
    const element = contenidoTabla[index2];
    for (let index = 0; index < tabular.columnas.length; index++) {
      let tipo = tabular.formatoColumna(index)
      contenidoFormateado.push(
        {
          valor: tipo != 'varchar' ? new Intl.NumberFormat('en-US').format(element[index]) : element,
          clases: 'border border-green-600 tw-px-2 text-right'
        }
      );
    }
  }

  tabular.refrescarContenido = cambia

  return (
    <>
      {
        // console.log('Desplegando Tabular ciclo', refrescaTabular, 'DAtos displonibles', tabular.datosDisponibles)
      }
      {
        (tabular.datosDisponibles)
          ?
          <div className="table-responsive">
            <table className="tw-w-full table-hover">
              <thead className="tw-bg-titulo" >
                <tr>
                  {
                    tabular.columnas.map((encabezado, index) => (
                      <th className="tw-px-2 tw-text-white text-center" key={index}>{tabular.encabezadoColumna(encabezado)}</th>
                    ))
                  }
                </tr>
              </thead>
              <tbody>
                {
                  tabular.contenidoTabla().map((item, index) => (
                    <tr key={index}>
                      {
                        contenidoFormateado.map((item2, index2) => (
                          <td className={item2.clases} key={index2}>{item2.valor}</td>
                        ))
                      }
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
          :
          null
      }
    </>
  )
}
