import dynamic from 'next/dynamic'
import React from 'react'

function ContenedorMapaAnalisis(props) {
    // console.log("se renderiza contenedor mapa analisis");
    //Importa dinámicamente el mapa
    const Map = dynamic(
        () => import('../components/Map-copy'),
        {
            loading: () => <p>El mapa está cargando</p>,
            ssr: false
        }
    )

    return (
        <>
            <Map referencia={props.referencia}/>
        </>
    )
}

export default React.memo(ContenedorMapaAnalisis)