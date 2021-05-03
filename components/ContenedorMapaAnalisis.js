import dynamic from 'next/dynamic'
import React, { useEffect, useState, useReducer, createContext, useContext } from 'react'

import ContenedorMapaContext from '../contexts/ContenedorMapaContext'
import UndoRedoContext from '../contexts/UndoRedoContext'

import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImages, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import Popout from 'react-popout'

const Map = dynamic(
    () => import('../components/historico/Map Analisis v1'),
    // () => import('./MapAnalisis'),
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

//Funcion del timeline undo redo
// var registraMovimiento = true;
// var _timeline = {
//     history: [],
//     current: [],
//     future: []
// };
// function useTimeline() {
//     const [state, setState] = useState([]);
//     const historyLimit = -5
//     function _canUndo() {
//         return _timeline.history.length > 1;
//     }
//     function _canRedo() {
//         return _timeline.future.length > 0;
//     }
//     const canUndo = _canUndo();
//     const canRedo = _canRedo();
//     const splitLast = arr => {
//         // split the last item from an array and return a tupple of [rest, last]
//         const length = arr.length;
//         const lastItem = arr[length - 1];
//         const restOfArr = arr.slice(0, length - 1);
//         return [restOfArr, lastItem];
//     };
//     const sliceEnd = (arr, size) => {
//         // slice array from to end by size
//         const startIndex = arr.length < size ? 0 : size;
//         const trimmedArr = arr.slice(startIndex, arr.length);
//         return trimmedArr;
//     };
//     const update = (value) => {
//         const { history, current } = _timeline;
//         const limitedHistory = sliceEnd(history, historyLimit);
//         _timeline = {
//             history: [...limitedHistory, current],
//             current: value,
//             future: []
//         };
//         setState(_timeline.current);
//     };
//     const undo = () => {
//         const { history, current, future } = _timeline;
//         const [restOfArr, lastItem] = splitLast(history);
//         _timeline = {
//             history: restOfArr,
//             current: lastItem,
//             future: [...future, current]
//         };
//         setState(_timeline.current);
//     };
//     const redo = () => {
//         const { history, current, future } = _timeline;
//         const [restOfArr, lastItem] = splitLast(future);
//         _timeline = {
//             history: [...history, current],
//             current: lastItem,
//             future: restOfArr
//         };
//         setState(_timeline.current);
//     };
//     return [state, { canUndo, canRedo, update, undo, redo }];
// }

function ContenedorMapaAnalisis(props) {

    // useEffect(() => {
    //     update([{
    //         centroUndoRedo: { lat: 23.26825996870948, lng: -102.88361673036671 },
    //         zoomUndoRedo: 5
    //     }]);
    // }, [])

    // const [todos, { canUndo, canRedo, update, undo, redo }] = useTimeline();
    // function MapaMovimientoUndoRedo({ target }) {
    //     if (props.botones == true) {
    //         registraMovimiento = false;
    //         if (target.name === 'undo') {
    //             if (_timeline.history.length > 1) {
    //                 undo();
    //                 let estadoActual = _timeline.current[_timeline.current.length - 1];
    //                 let estadoActualLatLng = estadoActual.centroUndoRedo;
    //                 let estadoActualZoom = estadoActual.zoomUndoRedo;
    //                 refMapaContenedor.setView(estadoActualLatLng, estadoActualZoom);
    //             }
    //         }
    //         else if (target.name === 'redo') {
    //             if (_timeline.future.length > 0) {
    //                 redo();
    //                 let estadoActual = _timeline.current[_timeline.current.length - 1];
    //                 let estadoActualLatLng = estadoActual.centroUndoRedo;
    //                 let estadoActualZoom = estadoActual.zoomUndoRedo;
    //                 refMapaContenedor.setView(estadoActualLatLng, estadoActualZoom);
    //             }
    //         }
    //     }
    // }

    // const [refMapContState, setRefMapContState] = useState(false)
    // function cambiaTipoCoordenada({ target }) {
    //     if (target.value == 1) {
    //         tipoCoordenadaGlobal = 1;
    //     }
    //     else if (target.value == 2) {
    //         tipoCoordenadaGlobal = 2;
    //     } else {
    //         tipoCoordenadaGlobal = 3;
    //     }
    //     controlaContexto()
    // }

    // useEffect(() => {
    //     if (refMapContState == true) {
    //         if (props.botones == true) {
    //             refMapaContenedor.on('moveend', function () {
    //                 let centroUndoRedo = refMapaContenedor.getCenter();
    //                 let zoomUndoRedo = refMapaContenedor.getZoom();
    //                 if (registraMovimiento == true) {
    //                     const nextTodos = [...todos, { centroUndoRedo, zoomUndoRedo }];
    //                     update(nextTodos);
    //                 }
    //                 registraMovimiento = true;
    //                 zoomGlobal = zoomUndoRedo;
    //                 controlaContexto();
    //             })
    //         }
    //     }
    // }, [refMapContState])

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

    // /*Estados para ventana de simbología*/
    // const [ventana, setVentana] = useState(false)


    return (
        <>
            {/* {ventana &&
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
            } */}

            {/* <ContenedorMapaContext.Provider value={estadoCaptura}> */}
                <Map referencia={props.referencia} botones={props.botones} datos={props.datos} />
            {/* </ContenedorMapaContext.Provider> */}


            {/* <div className="tw-bg-gray-200 tw-border-solid tw-border-1 tw-border-gray-300 tw-text-right" >
                <select onChange={(e) => cambiaTipoCoordenada(e)} className="tw-mr-5">
                    <option value='1'>Grados decimales</option>
                    <option value='2'>Metros</option>
                    <option value='3'>Grados, minutos y segundos</option>
                </select>
                {
                    props.botones == true &&
                    <>
                        <OverlayTrigger rootClose overlay={<Tooltip>Vista anterior</Tooltip>}>
                            <button disabled={!canUndo} className="tw-border-transparent tw-bg-transparent tw-mr-5 tw-border-none" name="undo" onClick={MapaMovimientoUndoRedo}>
                                <FontAwesomeIcon className="tw-pointer-events-none tw-text-3xl" icon={faArrowLeft} />
                            </button>
                        </OverlayTrigger>
                        <OverlayTrigger rootClose overlay={<Tooltip>Vista posterior</Tooltip>}>
                            <button disabled={!canRedo} className="tw-border-transparent tw-bg-transparent tw-mr-5 tw-border-none" name="redo" onClick={MapaMovimientoUndoRedo}>
                                <FontAwesomeIcon className="tw-pointer-events-none tw-text-3xl" icon={faArrowRight}></FontAwesomeIcon>
                            </button>
                        </OverlayTrigger>
                    </>
                }
                <OverlayTrigger overlay={<Tooltip>Simbología</Tooltip>}>
                    <FontAwesomeIcon className="tw-cursor-pointer tw-mr-5 tw-text-3xl tw-mt-2" onClick={() => setVentana(!ventana)} icon={faImages}></FontAwesomeIcon>
                </OverlayTrigger>
            </div > */}

        </>
    )
}

export default ContenedorMapaAnalisis