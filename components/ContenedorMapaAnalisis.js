import dynamic from 'next/dynamic'
import React, { useState, useEffect } from 'react'

import ContenedorMapaContext from '../contexts/ContenedorMapaContext'

import { OverlayTrigger, Tooltip, Modal, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImages, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import Popout from 'react-popout'

import $ from 'jquery'

// const elementClosest = require('element-closest');

// var refMapaContenedor = null;
var objetoLContenedor = null
var refMapaContenedor = null

const Map = dynamic(
    () => import('./MapAnalisis'),
    {
        loading: () => <p>El mapa está cargando</p>,
        ssr: false
    }
)

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

    function minimizaModal(e) {
        let modalCompleto = $(e.target).closest(".modal-simbologia")
        $(modalCompleto).toggleClass("modal-min")
    }

    const [showModalSimbologia, setShowModalSimbologia] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    if(typeof window != null){
        $(document.body).addClass("analisis-geografico-modales");
    }


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

            <div className="div-herramientas-contenedor">
                <OverlayTrigger overlay={<Tooltip>Simbología</Tooltip>}>
                    <FontAwesomeIcon className="tw-cursor-pointer tw-mr-5 tw-text-3xl iconos-barra-mapa" onClick={() => setShowModalSimbologia(!showModalSimbologia)} icon={faImages}></FontAwesomeIcon>
                </OverlayTrigger>
            </div>

            <Modal show={showModalSimbologia} onHide={() => setShowModalSimbologia(!showModalSimbologia)} backdrop={false} keyboard={false} className="tw-pointer-events-none modal-simbologia">
                <Modal.Header closeButton>
                    <Modal.Title><b>Simbología</b></Modal.Title>
                    <button onClick={minimizaModal}>Minimizar</button>
                </Modal.Header>
                <Modal.Body>
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
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ContenedorMapaAnalisis