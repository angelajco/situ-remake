import React, { useState } from 'react'

export default function Tabular(props) {

  const { tabular } = props

  const [refrescaTabular, setRefrescaTabular] = useState(0)

  const cambia = () => {
    setRefrescaTabular(refrescaTabular + 1)
  }

  tabular.refrescarContenido = cambia

  // const a = [[1,2,3],[4,5,6],[7,8,9]]

  return (
    <>
      {
        // console.log('Desplegando Tabular ciclo', refrescaTabular, 'DAtos displonibles', tabular.datosDisponibles)
      }
      {
        (tabular.datosDisponibles)
          ?
          <table className="tw-border-separate tw-border tw-border-green-800">
            <thead className="tw-bg-gray-400" >
              <tr>
                {
                  tabular.columnas.map((encabezado, index) => (
                    <th className="border border-green-600" key={index}>{tabular.encabezadoColumna(encabezado)}</th>
                  ))
                }
              </tr>
            </thead>
            <tbody>
              {
                tabular.contenidoTabla().map((item, index) => (
                  <tr key={index}>
                    {
                      item.map((item2, index2) => (
                        <td className="border border-green-600" key={index2}>{item2}</td>
                      ))
                    }
                  </tr>
                ))
              }
            </tbody>
          </table>
          :
          null
      }
    </>
  )
}
