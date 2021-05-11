import Head from 'next/head'
import dynamic from 'next/dynamic'
import React, { useState, useEffect } from 'react'

import ContenedorMapaContext from '../contexts/ContenedorMapaContext'

import { OverlayTrigger, Tooltip, Modal, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImages } from '@fortawesome/free-solid-svg-icons'
import { faWindowMaximize, faWindowMinimize } from '@fortawesome/free-regular-svg-icons'

import $ from 'jquery'

import Draggable from 'react-draggable'; // Both at the same time
import ModalDialog from 'react-bootstrap/ModalDialog';

import ReactModal from 'react-modal-resizable-draggable';

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

const MapEspejo = dynamic(
    () => import('./MapAnalisisEspejo'),
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

    function minimizaModal(e) {
        let modalCompleto = $(e.target).closest(".modal")
        $(modalCompleto).toggleClass("modal-min");
        if ($(modalCompleto).hasClass("modal-min")) {
            $(modalCompleto).find(".modal-content").removeClass("modal-redimensionable");
            $(modalCompleto).find(".modal-header").css("pointer-events", "none")
            setIconoMinimizarSimbologia(true);

        } else {
            $(modalCompleto).find(".modal-content").addClass("modal-redimensionable");
            $(modalCompleto).find(".modal-header").css("pointer-events", "initial")
            setIconoMinimizarSimbologia(false);
        }
    }

    const [showModalSimbologia, setShowModalSimbologia] = useState(false);
    const [iconoMinimizarSimbologia, setIconoMinimizarSimbologia] = useState(false)

    function DraggableModalDialog(props) {
        return (
            <Draggable handle=".modal-header"><ModalDialog className="modal-drag" {...props} /></Draggable>
        )
    }

    if (typeof window !== 'undefined') {
        $('body').addClass("analisis-geografico-modales");
    }

    return (
        <>
            <div className="div-herramientas-contenedor">
                <OverlayTrigger overlay={<Tooltip>Simbología</Tooltip>}>
                    <button className="botones-barra-mapa" onClick={() => setShowModalSimbologia(!showModalSimbologia)}>
                        <FontAwesomeIcon icon={faImages}></FontAwesomeIcon>
                    </button>
                </OverlayTrigger>
            </div>

            {/* <ContenedorMapaContext.Provider value={estadoCaptura}> */}
            {
                props.botones == true
                ?
                <Map referencia={props.referencia} datos={props.datos} />
                :
                <MapEspejo referencia={props.referencia} datos={props.datos} />
            }
            {/* </ContenedorMapaContext.Provider> */}

            <Modal dialogAs={DraggableModalDialog} show={showModalSimbologia} onHide={() => setShowModalSimbologia(!showModalSimbologia)} backdrop={false} keyboard={false} className="tw-pointer-events-none modal-simbologia" contentClassName="modal-redimensionable">
                <Modal.Header className="tw-cursor-pointer" closeButton >
                    <Modal.Title><b>Simbología</b></Modal.Title>
                    <button className="boton-minimizar-modal" onClick={minimizaModal}>
                        <FontAwesomeIcon icon={iconoMinimizarSimbologia ? faWindowMaximize : faWindowMinimize} />
                    </button>
                </Modal.Header>
                <Modal.Body>
                    {
                        props.datos.map((capa, index) => {
                            if (capa.habilitado) {
                                if (capa.tipo == "geojson") {
                                    return (
                                        <div key={index}>
                                            <p><b>{capa.nom_capa}</b></p>
                                            <img src={capa.simbologia} alt="" />
                                            <br></br>
                                            <br></br>
                                        </div>
                                    )
                                }
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