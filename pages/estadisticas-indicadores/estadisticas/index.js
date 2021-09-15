import React, { useState, useEffect } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit } from '@fortawesome/free-solid-svg-icons';

import ContenedorMapaAnalisis from '../../../components/ContenedorMapaAnalisis'
import ConsultaDinamica from '../../../components/ConsultaDinamica'
import ContextoMapasProvider from '../../../context/contextoMapasProvider'
import ContextoFeature from '../../../context/contextoFeatureGroupDibujadas'
import GenericTable from '../../../components/genericos/GenericTable';

export default function estadisticas() {

    const [mapName, setMapName] = useState("Titulo mapa");
    const [isEditMapName, setEditMapName] = useState(true);
    const [isMapVisible, setMapVisible] = useState(false);
    const [entityObject, setEntityObject] = useState();
    const [spaceData, setSpaceData] = useState();
    const [mapState, setMapState] = useState();
    const [chartState, setChartState] = useState();
    const [tables, setTables] = useState([]);

    var referenciaMapa = null;

    function changeMapName(e) {
        setMapName(e.target.value)
    }
    function capturaReferenciaMapa(mapa) {
        referenciaMapa = mapa;
    }

    function changeMapState(visible, data, entityObject_) {
        // setSpaceData(data)
        // setMapVisible(visible);
        // setLayesAdded(layesAdded + 1);
        // setMapState({
        //     spaceData: data,
        //     isMapVisible: visible,
        //     entityObject: entityObject
        // });
        setMapVisible(visible);
        setSpaceData(data);
        setEntityObject(entityObject_);
        referenciaMapa._onResize();
    }

    function createTable(indexes) {
        console.log('tables: ', tables);
        console.log('indexes: ', indexes);
        var tmpObject;
        indexes.map((index, index___) => {
            if(index___ == 0) {
                tmpObject = {
                    checked: tables[index].checked,
                    // data: tables[index].data,
                    data: {
                        nombreTabla: '',
                        columnas: [],
                        datos: []
                    },
                    index: tables.length,
                    level: tables[index].level,
                    title: `Consulta dinámica - ${tables.length + 1} - Unión`,
                    type: tables[index].type,
                    filters: tables[index].filters
                };
                tmpObject.data.nombreTabla = tmpObject.title;
                tables[index].data.columnas.map(column => {
                    tmpObject.data.columnas.push(column);
                })
                tables[index].data.datos.map(data => {
                    tmpObject.data.datos.push(data);
                })
            } else {
                tables[index].data.columnas.map((column, index__) => {
                    var column_ = [column[0], column[1], column[2], index];
                    tmpObject.data.columnas.push(column_);
                });
                tmpObject.data.datos.map((tmpData, index_) => {
                    tables[index].data.datos.map(data => {
                        if(tmpData[0] == data[0]) {
                            data.map(mapped => {
                                tmpObject.data.datos[index_].push(mapped);
                            });
                        }
                    });
                });
                console.log('tmpObject: ', tmpObject);
                setTables([...tables, tmpObject]);
            }
        });
    }

    useEffect(() => {
        if (chartState) {
            // console.log('chartState: ', chartState);
            setTables([...tables, chartState]);
        }
    }, [chartState]);

    // useEffect(() => {
    //     console.log('tables: ', tables);
    // }, [tables]);

    return (
        <>
            <section className="container-fluid custom-max-width custom-mx-b-1">
                <div className="row">
                    <ConsultaDinamica chartState={setChartState}/>
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
                                        <ContenedorMapaAnalisis botones={true} referenciaAnalisis={capturaReferenciaMapa} referenciaEntidad={entityObject} informacionEspacial={spaceData} />
                                    </ContextoFeature>
                                </ContextoMapasProvider>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row custom-max-width">
                    {
                        (tables && tables.length > 0) &&
                            tables.map((table, index) => (
                                <GenericTable key={index} table={table} index={index} showMap={changeMapState} allTables={tables} createTable={createTable}/>
                            ))
                    }
                </div>
            </section>
        </>
    )
}