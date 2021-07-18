import React, { useState, useEffect } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit } from '@fortawesome/free-solid-svg-icons';

import 'leaflet/dist/leaflet.css';

import ContenedorMapaAnalisis from '../../../components/ContenedorMapaAnalisis'
import ConsultaDinamica from '../../../components/ConsultaDinamica'
import ContextoMapasProvider from '../../../context/contextoMapasProvider'
import ContextoFeature from '../../../context/contextoFeatureGroupDibujadas'

export default function estadisticas() {

    const [mapName, setMapName] = useState("Titulo mapa");
    const [isEditMapName, setEditMapName] = useState(true);
    const [isMapVisible, setMapVisible] = useState(false);
    const [entityObject, setEntityObject] = useState();
    const [spaceData, setSpaceData] = useState();
    const [mapState, setMapState] = useState();

    function changeMapName(e) {
        setMapName(e.target.value)
    }

    function changeMapState(visible, data) {
        setSpaceData(data)
        setMapVisible(visible);
        setLayesAdded(layesAdded + 1);
        referenciaMapa._onResize();
    }

    var referenciaMapa = null;
    function capturaReferenciaMapa(mapa) {
        referenciaMapa = mapa;
    }

    useEffect(() => {
        if(mapState) {
            if(mapState.entityObject.length > 0){
                setMapVisible(mapState.isMapVisible);
                setSpaceData(mapState.spaceData);
                setEntityObject(mapState.entityObject);
                referenciaMapa._onResize();
            }
        }
    }, [mapState]);
    
    return (
        <>
            <section className="container-fluid custom-max-width custom-mx-b-1">
                <div className="row">
                    <ConsultaDinamica mapState={setMapState}/>
                </div>
                <div className={`row ${isMapVisible == false && "esconde-mapa"}`}>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 custom-mx-t-1 col-mapa tw-pt-6">
                        <div className="row">
                            <div className="col-12 tw-text-center">
                                <p>
                                    {mapName}
                                    <OverlayTrigger overlay={<Tooltip>Editar nombre</Tooltip>}>
                                        <FontAwesomeIcon className="tw-ml-4 tw-cursor-pointer" onClick={() => setEditMapName(false)} icon={faEdit} />
                                    </OverlayTrigger>
                                </p>
                                <input type="text" hidden={isEditMapName} onChange={(event) => changeMapName(event)} value={mapName}></input>
                                <OverlayTrigger overlay={<Tooltip>Finalizar edición</Tooltip>}>
                                    <FontAwesomeIcon className="tw-ml-4 tw-cursor-pointer" hidden={isEditMapName} onClick={() => setEditMapName(true)} icon={faCheck}></FontAwesomeIcon>
                                </OverlayTrigger>
                            </div>
                            <div className="col-12 tw-mt-8">
                                <ContextoMapasProvider>
                                    <ContextoFeature>
                                        <ContenedorMapaAnalisis botones={true} referenciaAnalisis={capturaReferenciaMapa} referenciaEntidad={entityObject} informacionEspacial={spaceData}/>
                                    </ContextoFeature>
                                </ContextoMapasProvider>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}