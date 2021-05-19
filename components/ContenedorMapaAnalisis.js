import Head from 'next/head'
import dynamic from 'next/dynamic'
import React, { useState, useEffect } from 'react'

import ContenedorMapaContext from '../contexts/ContenedorMapaContext'

import { OverlayTrigger, Tooltip, Modal, Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImages } from '@fortawesome/free-solid-svg-icons'
import { faWindowMaximize, faWindowMinimize, faWindowRestore } from '@fortawesome/free-regular-svg-icons'

import $ from 'jquery'

import Draggable from 'react-draggable'; // Both at the same time
import ModalDialog from 'react-bootstrap/ModalDialog';

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
        // console.log(props);
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

    function minimizaModal(e, modal) {
        // let modalCompleto;
        // if(modal == 0){
        //     modalCompleto = $(e.target).closest(".modal-simbologia")
        // } else if(modal == 1){
        //     modalCompleto = $(e.target).closest(".modal-atributos")
        // }
        let modalCompleto = $(e.target).closest(".modal")
        $(modalCompleto).toggleClass("modal-min");
        // let iconoMinimizar = $(modalCompleto).find(".icono-minimizar");
        if ($(modalCompleto).hasClass("modal-min")) {
            console.log("tiene la clase modal");
            $(modalCompleto).find(".modal-content").removeClass("modal-redimensionable");
            $(modalCompleto).find(".modal-header").css("pointer-events", "none")
            // $(iconoMinimizar).attr("src", "/images/analisis/window-maximize-regular.svg");
        } else {
            // $(iconoMinimizar).attr("src", "/images/analisis/window-minimize-regular.svg");
            $(modalCompleto).find(".modal-content").addClass("modal-redimensionable");
            $(modalCompleto).find(".modal-header").css("pointer-events", "initial")
        }
    }

    const [showModalSimbologia, setShowModalSimbologia] = useState(false);

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
                    <button className="botones-barra-mapa" onClick={() => setShowModalSimbologia(true)}>
                        <FontAwesomeIcon icon={faImages}></FontAwesomeIcon>
                    </button>
                </OverlayTrigger>
            </div>

            {/* <ContenedorMapaContext.Provider value={estadoCaptura}> */}
            {
                props.botones == true
                    ?
                    <Map referencia={props.referencia} datos={props.datos} fileUpload={props.fileUpload}/>
                    :
                    <MapEspejo referencia={props.referencia} datos={props.datos} fileUpload={props.fileUpload}/>
            }
            {/* </ContenedorMapaContext.Provider> */}

            <Modal dialogAs={DraggableModalDialog} show={showModalSimbologia} onHide={() => setShowModalSimbologia(!showModalSimbologia)} backdrop={false} keyboard={false} className="tw-pointer-events-none modal-analisis modal-simbologia" contentClassName="modal-redimensionable">
                <Modal.Header className="tw-cursor-pointer" closeButton >
                    <Modal.Title><b>Simbología</b></Modal.Title>
                    <button className="boton-minimizar-modal" onClick={(e) => minimizaModal(e, 0)}>
                        {/* <img className="icono-minimizar tw-w-4" src="/images/analisis/window-minimize-regular.svg" /> */}
                        <FontAwesomeIcon icon={faWindowRestore}/>
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

            <Modal dialogAs={DraggableModalDialog} show={props.modalAtributos} backdrop={false} keyboard={false} onHide={() => props.setModalAtributos(!props.modalAtributos)} className="tw-pointer-events-none modal-analisis modal-atributos" contentClassName="modal-redimensionable">
                <Modal.Header className="tw-cursor-pointer" closeButton >
                    <Modal.Title><b>Atributos</b></Modal.Title>
                    <button className="boton-minimizar-modal" onClick={(e) => minimizaModal(e, 1)}>
                        {/* <img className="icono-minimizar tw-w-4" src="/images/analisis/window-minimize-regular.svg" /> */}
                        <FontAwesomeIcon icon={faWindowRestore}/>
                    </button>
                </Modal.Header>
                <Modal.Body className="tw-overflow-y-auto">
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>fid</th>
                                <th>CVEGEO</th>
                                <th>CVE_ENT</th>
                                <th>CVE_MUN</th>
                                <th>NOMGEO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                props.datosAtributos.map((value, index) => (
                                    <tr key={index}>
                                        <td>{value.properties.fid}</td>
                                        <td>{value.properties.CVEGEO}</td>
                                        <td>{value.properties.CVE_ENT}</td>
                                        <td>{value.properties.CVE_MUN}</td>
                                        <td>{value.properties.NOMGEO}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default React.memo(ContenedorMapaAnalisis)