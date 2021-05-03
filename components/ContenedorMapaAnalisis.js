import dynamic from 'next/dynamic'
import React, { useEffect, useState, useReducer, createContext, useContext } from 'react'

import ContenedorMapaContext from '../contexts/ContenedorMapaContext'
import UndoRedoContext from '../contexts/UndoRedoContext'

import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImages, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import Popout from 'react-popout'

const Map = dynamic(
    () => import('./MapAnalisis'),
    {
        loading: () => <p>El mapa está cargando</p>,
        ssr: false
    }
)

// var refMapaContenedor = null;
var objetoLContenedor = null
var refMapaContenedor = null

//Variables para pasar al contexto
var zoomGlobal;
var tipoCoordenadaGlobal = 1;

function ContenedorMapaAnalisis(props) {

        // const [estadoCaptura, setEstadoCaptura] = useState({ tipoCoord: tipoCoordenadaGlobal, referenciaMapa: captura })

    // function controlaContexto() {
    //     console.log(props);
    //     setEstadoCaptura(
    //         { tipoCoord: tipoCoordenadaGlobal, zoom: zoomGlobal }
    //     );
    // }

    //Para capturar la referencia al mapa    
    // function captura() {
    //     refMapaContenedor = estadoCaptura.refMap;
    //     objetoLContenedor = estadoCaptura.objL
    //     setRefMapContState(true);
    //     console.log("captura");
    // }

    /*Estados para ventana de simbología*/
    const [ventana, setVentana] = useState(false)


    return (
        <>
            {ventana &&
                <Popout title='Simbología' onClosing={() => setVentana(!ventana)}>
                    <h3><b>Simbología</b></h3>
                    {
                        props.datos.map((capa, index) => {
                            if (capa.habilitado) {
                                if (capa.tipo == "wms") {
                                    return (
                                        <div key={index}>
                                            <p><b>{capa.nom_capa}</b></p>
                                            <img src={capa.simbologia}></img>
                                            <br></br>
                                            <br></br>
                                        </div>
                                    )
                                }
                            }
                        })
                    }
                </Popout>
            }

            {/* <ContenedorMapaContext.Provider value={estadoCaptura}> */}
                <Map referencia={props.referencia} botones={props.botones} datos={props.datos} />
            {/* </ContenedorMapaContext.Provider> */}

        </>
    )
}

export default ContenedorMapaAnalisis