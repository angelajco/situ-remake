import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'

//Importa dinámicamente el mapa
const Map = dynamic(
    () => import('../components/Map'),
    {
        loading: () => <p>El mapa está cargando</p>,
        ssr: false
    }
)

function ContenedorMapaAnalisis(props) {
    return (
        <>
            <Map referencia={props.referencia} botones={props.botones} datos={props.datos}/>
        </>
    )
}

export default React.memo(ContenedorMapaAnalisis)