import React, {useState} from 'react'

export default function Tabular(props) {
  
  const { tabular } = props
  
  const [refrescaTabular, setRefrescaTabular] = useState(0)

  const cambia = () => {
    setRefrescaTabular(refrescaTabular+1)
  }

  tabular.refrescarContenido = cambia

  return (
    <>
    {console.log('Desplegando Tabular ciclo', refrescaTabular, 'DAtos displonibles', tabular.datosDisponibles)}
    {
      (tabular.datosDisponibles)
        ?
        <table>
          <thead>
            <tr>
              {
                tabular.columnas.map((encabezado, index) => (
                  <th key={index}>{tabular.encabezadoColumna(encabezado)}</th>
                ))
              }
            </tr>
          </thead>
          <tbody>
            <p>1</p>
          </tbody>
        </table>
        :
        null
      }
      </>
  )
}
