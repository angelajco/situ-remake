import { useState } from "react"
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faCheck } from '@fortawesome/free-solid-svg-icons'

import ContenedorMapaAnalisis from '../../components/ContenedorMapaAnalisis'
import ContextoMapasProvider from '../../context/contextoMapasProvider'
import ContextoFeature from '../../context/contextoFeatureGroupDibujadas'

var referenciaMapaEspejoAnalisis = null;
function capturaReferenciaMapaEspejo(mapa) {
    referenciaMapaEspejoAnalisis = mapa;
}

var referenciaMapa = null;
function capturaReferenciaMapa(mapa) {
    referenciaMapa = mapa;
}

export default function AnalisisGeografico() {
    //Para guardar la columna de la capa espejo
    const [dobleMapa, setDobleMapa] = useState("col-12")
    const [pantallaDividida, setPantallaDividida] = useState(false);

    function dividirPantalla() {
        if (pantallaDividida == true) {
            setPantallaDividida(false);
            setDobleMapa("col-12");
            referenciaMapa._onResize();
        } else {
            setPantallaDividida(true)
            setDobleMapa("col-6");
            referenciaMapa._onResize();
            referenciaMapaEspejoAnalisis._onResize();
        }
    }

    //Nombres para mapas
    //Mapa original
    const [nombreMapa, setNombreMapa] = useState("Titulo mapa")
    const [muestraEditarNombreMapa, setmuestraEditarNombreMapa] = useState(true)
    //Mapa espejo
    const [nombreMapaEspejo, setNombreMapaEspejo] = useState("Titulo mapa")
    const [muestraEditarNombreMapaEspejo, setmuestraEditarNombreMapaEspejo] = useState(true)
    //Para datos
    const [entityObject, setEntityObject] = useState();
    const [spaceData, setSpaceData] = useState();
    const [entityObjectEspejo, setEntityObjectEspejo] = useState();
    const [spaceDataEspejo, setSpaceDataEspejo] = useState();

    function cambiaNombreMapa(e, mapa) {
        if (mapa == 0) {
            setNombreMapa(e.target.value)
        } else if (mapa == 1) {
            setNombreMapaEspejo(e.target.value)
        }

    }

    return (
        <>
            <div className="main tw-mb-12">
                <div className="container">
                    <div className="row">
                        <ContextoMapasProvider>
                            <ContextoFeature>
                                <div className={`${dobleMapa} col-mapa tw-pt-6`}>
                                    <div className="row">
                                        <div className="col-12 tw-text-center">
                                            <p>
                                                {nombreMapa}
                                                <OverlayTrigger overlay={<Tooltip>Editar nombre</Tooltip>}>
                                                    <FontAwesomeIcon className="tw-ml-4 tw-cursor-pointer" onClick={() => setmuestraEditarNombreMapa(false)} icon={faEdit} />
                                                </OverlayTrigger>
                                            </p>
                                            <input type="text" hidden={muestraEditarNombreMapa} onChange={(event) => cambiaNombreMapa(event, 0)} value={nombreMapa} id="nombremapa"></input>
                                            <OverlayTrigger overlay={<Tooltip>Finalizar edición</Tooltip>}>
                                                <FontAwesomeIcon className="tw-ml-4 tw-cursor-pointer" hidden={muestraEditarNombreMapa} onClick={() => setmuestraEditarNombreMapa(true)} icon={faCheck}></FontAwesomeIcon>
                                            </OverlayTrigger>
                                        </div>

                                        <div className="col-12">
                                            <ContenedorMapaAnalisis botones={true} referenciaAnalisis={capturaReferenciaMapa} referenciaEntidad={entityObject} informacionEspacial={spaceData} setReferenciaEntidad={setEntityObject} setInformacionEspacial={setSpaceData} btnDividirPantallaDisplay={'normal'} btnDividirPantallaOnClick={dividirPantalla}/>
                                        </div>
                                    </div>
                                </div>

                                <div className={`col-6 col-mapa tw-pt-6 ${pantallaDividida == false && "esconde-mapa"}`}>
                                    <div className="row">
                                        <div className="col-12 tw-text-center">
                                            <p>
                                                {nombreMapaEspejo}
                                                <OverlayTrigger overlay={<Tooltip>Editar nombre</Tooltip>}>
                                                    <FontAwesomeIcon className="tw-ml-4 tw-cursor-pointer" onClick={() => setmuestraEditarNombreMapaEspejo(false)} icon={faEdit}></FontAwesomeIcon>
                                                </OverlayTrigger>
                                            </p>
                                            <input type="text" hidden={muestraEditarNombreMapaEspejo} onChange={(event) => cambiaNombreMapa(event, 1)} value={nombreMapaEspejo}></input>
                                            <OverlayTrigger overlay={<Tooltip>Finalizar edición</Tooltip>}>
                                                <FontAwesomeIcon className="tw-ml-4 tw-cursor-pointer" hidden={muestraEditarNombreMapaEspejo} onClick={() => setmuestraEditarNombreMapaEspejo(true)} icon={faCheck}></FontAwesomeIcon>
                                            </OverlayTrigger>
                                        </div>

                                        <div className="col-12">
                                            <ContenedorMapaAnalisis botones={false} referenciaAnalisis={capturaReferenciaMapaEspejo} referenciaEntidad={entityObjectEspejo} informacionEspacial={spaceDataEspejo} setReferenciaEntidad={setEntityObjectEspejo} setInformacionEspacial={setSpaceDataEspejo} btnDividirPantallaDisplay={'none'} btnDividirPantallaOnClick={dividirPantalla}/>
                                        </div>
                                    </div>
                                </div>
                            </ContextoFeature>
                        </ContextoMapasProvider>
                    </div>
                </div>
            </div>

        </>
    )
}