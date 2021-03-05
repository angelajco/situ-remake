import React from 'react'
import GraficaPM from './GraficaPM';
import Tabular from './Tabular';

export default function ContenedorPM(props) {
  
  const {contenido} = props

  console.log('Desplegando componente', contenido.tipoComponente)

  switch (contenido.tipoComponente) {
    case "Tabular":
      return <Tabular tabular = {contenido} />;
    case "Grafica":
      return <GraficaPM grafica = {contenido} />;
    default:
      return <p>Contenido no definido</p>;
  }

}
