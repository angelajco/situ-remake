import React, { useState, useEffect } from 'react'
import { Accordion, Card, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit } from '@fortawesome/free-solid-svg-icons';
import { faWindowRestore } from '@fortawesome/free-regular-svg-icons';

import $ from 'jquery';
import Draggable from 'react-draggable';
import ModalDialog from 'react-bootstrap/ModalDialog';

import Loader from '../../../components/Loader'
import ModalComponent from '../../../components/ModalComponent'
import GenericTable from '../../../components/genericos/GenericTable';
import ContenedorMapaAnalisis from '../../../components/ContenedorMapaAnalisis'

export default function estadisticas() {

    const aggregationLevels = [
        {
            id: 0,
            value: 'Nacional'
        },
        {
            id: 1,
            value: 'Otro'
        }
    ];
    const [statisticalProducts, setStatisticalProducts] = useState([]);
    const [statisticalProduct, setStatisticalProduct] = useState();
    const [entities, setEntities] = useState([]);
    const [tawns, setTawns] = useState([]);
    const [localities, setLocalities] = useState([]);
    const [entity, setEntity] = useState();
    const [tawn, setTawn] = useState();
    const [locality, setLocality] = useState();
    const [columns, setColumns] = useState([]);
    const [columnsSelected, setColumnsSelected] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [showTablesModal, setShowTablesModal] = useState(false);
    const [isNacional, setNacional] = useState(0);
    const [selectionType, setSelectionType] = useState();
    const [tableData, setTableData] = useState([]);
    const [mapName, setMapName] = useState("Titulo mapa")
    const [isEditMapName, setEditMapName] = useState(true)
    const [datosModal, setDatosModal] = useState(
        {
            title: '',
            body: ''
        }
    );
    const [errors, setErrors] = useState({
        isStatisticalProductsError: false,
        isAggregationLevelsError: false,
        isAdvanceFiltersError: false,
        isColumnsError: false,
        isTableDateError: false
    });
    const handleShowTablesModal = () => {
        setShowTablesModal(true);
        setTimeout(() => {
            remueveTabindexModalMovible();
        });
    }
    function remueveTabindexModalMovible() {
        $('.modal-analisis').removeAttr("tabindex");
    }
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    if (typeof window !== 'undefined') {
        $('body').addClass("analisis-geografico-modales");
    }

    useEffect(() => {
      fetch(`${process.env.ruta}/wa/publico/obtenerTablas`)
        .then(res => res.json())
        .then(
            (data) => {
                setStatisticalProducts(data.resultado);
                setIsLoading(false);
            }, 
            (error) => {
                setErrors({
                    isStatisticalProductsError: true,
                    isAggregationLevelsError: errors.isAggregationLevelsError,
                    isAdvanceFiltersError: errors.isAdvanceFiltersError,
                    isColumnsError: errors.isColumnsError,
                    isTableDateError: errors.isTableDateError
                });
                setDatosModal({
                    title: 'Ocurrió un error al obtener la información',
                    body: `${error}`,
                    redireccion: null,
                    nombreBoton: 'Cerrar'
                });
                renderModal(error);
            }
        )
    }, []);

    useEffect(() => {
        setIsLoading(true);
        getColumns(function(data, error) {
            restartFilters();
            if(data) {
                fetchColumns(data.resultado, function(array) {
                    setColumns(array);
                    setIsLoading(false);
                });
            } else {
                renderModal(error)
            }
        });
    }, [statisticalProduct]);

    useEffect(() => {
        setIsLoading(true);
        getTawns(function(data, error) {
            if(data) {
                setTawns(data);
                setIsLoading(false);
            } else {
                renderModal(error)
            }
        });
    }, [entity]);

    useEffect(() => {
        setIsLoading(true);
        getLocalities(function(data, error) {
            if(data) {
                setLocalities(data);
                setIsLoading(false);
            } else {
                renderModal(error)
            }
        });
    }, [tawn]);

    useEffect(() => {
        switch(selectionType) {
            case 1:
                var array = [];
                columns.map(item => {
                    item.checked = true;
                    array.push(item);
                });
                fetchColumns(array, function(columns_) {
                    var array_ = [];
                    setColumns(columns_);
                    columns_.filter(column => column.checked == true).map(filtered => {
                        array_.push(filtered);
                    });
                    setColumnsSelected(array);
                });
            break;
            case 2:
                var array = [];
                columns.map(item => {
                    item.checked = false;
                    array.push(item);
                });
                fetchColumns(array, function(columns_) {
                    var array_ = [];
                    setColumns(columns_);
                    setColumnsSelected([]);
                });
            break;
            case 3:
                var array = [];
                columns.map(item => {
                    item.checked = !item.checked;
                    array.push(item);
                });
                fetchColumns(array, function(columns_) {
                    var array_ = [];
                    setColumns(columns_);
                    var selected = columns_.filter(column => column.checked == true);
                    if(selected.length > 0) {
                        selected.map(filtered => {
                            array_.push(filtered);
                        });
                        setColumnsSelected(array_);
                    } else {
                        setColumnsSelected([]);
                    }
                });
                setSelectionType(0);
            break;
            default:
            break;
        }
    }, [selectionType]);

    function getEntities(response) {
        fetch(`${process.env.ruta}/wa/publico/catEntidades`)
        .then(res => res.json())
        .then(
            (data) => response(data, null),
            (error) => response(null, error)
        );
    }

    function getTawns(response) {
        if(entity) {
            fetch(`${process.env.ruta}/wa/publico/getMunicipioPorEntidad/${entity}`)
            .then(res => res.json())
            .then(
                (data) => response(data, null),
                (error) => response(null, error)
            );
        }
    }

    function getLocalities(response) {
        if(tawn) {
            fetch(`${process.env.ruta}/wa/publico/getLocalidad/${tawn}/${entity}`)
            .then(res => res.json())
            .then(
                (data) => response(data, null),
                (error) => response(null, error)
            );
        }
    }

    function getColumns(response) {
        if(statisticalProduct) {
            fetch(`${process.env.ruta}/wa/publico/obtenerColumnas/${statisticalProduct.etiqueta_funcional}`)
            .then(res => res.json())
            .then(
                (data) => response(data, null),
                (error) => {
                    setErrors({
                        isStatisticalProductsError: errors.isStatisticalProductsError,
                        isAggregationLevelsError: errors.isAggregationLevelsError,
                        isAdvanceFiltersError: errors.isAdvanceFiltersError,
                        isColumnsError: true,
                        isTableDateError: errors.isTableDateError
                    });
                    response(null, error)
                }
            );
        }
    }

    function getTableData(arg, response) {
        fetch(`${process.env.ruta}/wa/publico/obtenerInformacion${arg}`)
        .then(res => res.json())
        .then(
            (data) => response(data, null),
            (error) => {
                setErrors({
                    isStatisticalProductsError: errors.isStatisticalProductsError,
                    isAggregationLevelsError: errors.isAggregationLevelsError,
                    isAdvanceFiltersError: errors.isAdvanceFiltersError,
                    isColumnsError: errors.isColumnsError,
                    isTableDateError: true
                });
                response(null, error)
            }
        );
    }

    function applyStatisticalProducts(event) {
        setNacional(0);
        applyAggregation(function() {
            statisticalProducts.filter(product => product.etiqueta_funcional == event.target.value).map(element => {
                setStatisticalProduct(element);
            });
        });
    }

    function getStatiticalProductInformation() {
        setIsLoading(true);
        var args = `?etiquetaFuncional=${statisticalProduct.etiqueta_funcional}&nivel=${statisticalProduct.nivel_desagregacion}&nivelagregacion=${statisticalProduct.nivel_desagregacion}`;
        if(isNacional == 0) {
            if (statisticalProduct.nivel_desagregacion == 'Estatal') {
                entities.map((entity) => {
                    args = `${args}&clave=${entity.id_entidades}`;
                });
                args = `${args}&valorNivel=${statisticalProduct.col_entidad}`;
                
            } else if (statisticalProduct.nivel_desagregacion == 'Municipal') {
                tawns.map((tawn) => {
                    args = `${args}&clave=${tawn.cve_mun}`;
                });
                args = `${args}&valorNivel=${statisticalProduct.col_municipal}`;
            } else if (statisticalProduct.nivel_desagregacion == 'Localidad') {
                localities.map((locality) => {
                    args = `${args}&clave=${locality.Codigo}`;
                });
                args = `${args}&valorNivel=${statisticalProduct.col_localidad}`;
            }
        } else {
            if(statisticalProduct.nivel_desagregacion == 'Estatal') {
                args = `${args}&clave=${entity}`;
                args = `${args}&valorNivel=${statisticalProduct.col_entidad}`;
            } else if(statisticalProduct.nivel_desagregacion == 'Municipal') {
                args = `${args}&clave=${tawn}`;
                args = `${args}&valorNivel=${statisticalProduct.col_municipal}`;
            } else if(statisticalProduct.nivel_desagregacion == 'Localidad') {
                args = `${args}&clave=${locality}`;
                args = `${args}&valorNivel=${statisticalProduct.col_localidad}`;
            }
        }
        columnsSelected.map((column) => {
            args = `${args}&idcolumnas=${column.id}`;
        });
        getTableData(args, function(data, error) {
            if(data && data.mensaje != 'Error') {
                setTableData([...tableData, {title: `${statisticalProduct.nombre} (${statisticalProduct.descripcion})`, type: 'table', data: data.resultado}]);
                setIsLoading(false);
            } else {
                renderModal('La información no está disponible.')
            }
        });
    }

    function applySelectionType(event) {
        setSelectionType(parseInt(event.target.checked == true ? 1 : 2));
    }

    function applyAggregation(success) {
        getEntities(function(data, error) {
            if(data) {
                setEntities(data);
                setTawns(null);
                setIsLoading(false);
                success();
            } else {
                renderModal(error)
            }
        });
    }

    function renderModal(error) {
        if(error) {
            setIsLoading(false);
            setDatosModal({
                title: 'Ocurrió un error al obtener la información',
                body: `${error}`,
                redireccion: null,
                nombreBoton: 'Cerrar'
            });
        } else {
            setIsLoading(false);
            setDatosModal({
                title: 'Ocurrión un error al obtener la información',
                body: 'Favor de comunicarlo al área correspondiente.',
                redireccion: null,
                nombreBoton: 'Cerrar'
            });
        }
        setIsLoading(false);
        handleShow();
    }

    function fetchColumns(data, success) {
        var array = [];
        data.map((element, index) => {
            array.push(element);
            array[index].checked = data[index].checked ? data[index].checked : false;
        });
        success(array);
    }

    function columnsSelected_(event) {
        var array = columns;
        array[event.target.value].checked = event.target.checked;
        fetchColumns(array, function(columns_) {
            setColumns(columns_)
            if(array[event.target.value].checked == true) {
                setColumnsSelected([...columnsSelected, array[event.target.value]]);
            } else {
                setColumnsSelected(columns.filter(column => column.checked == true));
            }
        });
    }
    
    function minimizaModal(e) {
        let modalCompleto = $(e.target).closest(".modal")
        $(modalCompleto).toggleClass("modal-min");
        if ($(modalCompleto).hasClass("modal-min")) {
            $(modalCompleto).find(".modal-content").removeClass("modal-redimensionable");
            $(modalCompleto).find(".modal-header").css("pointer-events", "none")
        } else {
            $(modalCompleto).find(".modal-content").addClass("modal-redimensionable");
            $(modalCompleto).find(".modal-header").css("pointer-events", "initial")
        }
    }
    
    function DraggableModalDialog(props) {
        return (
            <Draggable handle=".modal-header"><ModalDialog  {...props} /></Draggable>
        )
    }

    function restartFilters() {
        setColumns([]);
        setColumnsSelected([]);
    }

    function changeMapName(e) {
        setMapName(e.target.value)
    }

    return (
        <>
            {
                isLoading ?
                    <Loader/> :
                    ''
            }
            <section className="container-fluid custom-max-width custom-mx-b-1">
                <ModalComponent
                    show={show}
                    datos={datosModal}
                    onHide={handleClose}
                    onClick={handleClose}
                />
                <Modal dialogAs={DraggableModalDialog} show={showTablesModal} backdrop={false} keyboard={false} contentClassName="modal-redimensionable modal-identify"
                    onHide={() => setShowTablesModal(false)} className="tw-pointer-events-none modal-analisis">
                    <Modal.Header className="tw-cursor-pointer" closeButton>
                        <Modal.Title><b>Tabulares</b></Modal.Title>
                        <button className="boton-minimizar-modal" onClick={(e) => minimizaModal(e)}>
                            <FontAwesomeIcon icon={faWindowRestore} />
                        </button>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-12 custom-mx-t-1 custom-h-450 table-responsive">
                                {
                                    (tableData && tableData.length > 0) &&
                                        tableData.map((table, index) => (
                                            <GenericTable key={index} table={table} index={index}/>
                                        ))
                                }
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
                <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 custom-mx-t-1 tw-px-0">
                        <div className="row justify-content-center tw-mx-1">
                            <Accordion defaultActiveKey="0" className="w-100">
                                <Card>
                                    <Accordion.Toggle as={Card.Header} eventKey="0">
                                        <h4 className="text-center">
                                            Filtros
                                        </h4>
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body className="custom-card-body">
                                            {
                                                errors.isStatisticalProductsError ?
                                                <h4 className="text-center">
                                                    La informaci&oacute;n no est&aacute; disponible
                                                </h4> :
                                                <div className="row">
                                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                        <div className="row tw-p-0">
                                                            <Form.Group className="col-12 tw-p-0 my-auto tw-mt-2">
                                                                <Form.Control as="select" onChange={(event) => applyStatisticalProducts(event)}>
                                                                    <option value='' hidden>Productos Estad&iacute;sticos</option>
                                                                    {
                                                                        statisticalProducts.map((item, index) => (
                                                                            <option key={index} value={item.etiqueta_funcional}>{item.nombre}</option>
                                                                        ))
                                                                    }
                                                                </Form.Control>
                                                            </Form.Group>
                                                        </div>
                                                        {
                                                            columns.length > 0 &&
                                                                <div className="row tw-mt-2 mx-auto">
                                                                    <Form className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 tw-p-0 my-auto">
                                                                        <Form.Check custom type="checkbox" inline className="mb-3 my-auto"
                                                                            onChange={(event) => applySelectionType(event)}
                                                                            label='Seleccionar todo/nada' id={`columns-check`}
                                                                            checked={columns.length > 0 && columns.length == columnsSelected.length}/>
                                                                    </Form>
                                                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 tw-p-0">
                                                                        <button className="btn-analisis" onClick={() => setSelectionType(3)}>Invertir selecci&oacute;n</button>
                                                                    </div>
                                                                </div>
                                                        }
                                                        {
                                                            errors.isColumnsError ?
                                                            <h4 className="text-center tw-mt-2">
                                                                La informaci&oacute;n no est&aacute; disponible
                                                            </h4> :
                                                            <div className="row tw-mb-2">
                                                                {
                                                                    columns.length > 0 &&
                                                                        <div className="col-12 tw-mt-2 tw-p-0">
                                                                            <Card className="custom-card-body">
                                                                                <div className="row">
                                                                                    <h6 className="text-center w-100">Columnas</h6>
                                                                                </div>
                                                                                <div className="row content-columns">
                                                                                    <Form>
                                                                                        {
                                                                                            columns.map((item, index) => (
                                                                                                <Form.Check key={index} custom type="checkbox" inline className="mb-3" onChange={(event) => columnsSelected_(event)}
                                                                                                    checked={item.checked} value={index} label={item.encabezado.length > 0 ? item.encabezado : item.id} id={`column-${index}`}/>
                                                                                            ))
                                                                                        }
                                                                                    </Form>
                                                                                </div>
                                                                            </Card>
                                                                        </div>
                                                                }
                                                            </div>
                                                        }
                                                    </div>
                                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                        {
                                                            errors.isStatisticalProductsError || errors.isAggregationLevelsError || errors.isColumnsError ?
                                                                <h4 className="text-center">
                                                                    La informaci&oacute;n no est&aacute; disponible
                                                                </h4> :
                                                                columns.length > 0 &&
                                                                <Form.Group className="row tw-mb-0">
                                                                    <div className="col-12 tw-mt-2">
                                                                        <Form.Control as="select" name="aggregationType" onChange={(event) => setNacional(parseInt(event.target.value))}>
                                                                            {
                                                                                aggregationLevels.map((item, index) => (
                                                                                    <option key={index} value={item.id}>
                                                                                        {
                                                                                            item.value
                                                                                        }
                                                                                    </option>
                                                                                ))
                                                                            }
                                                                        </Form.Control>
                                                                    </div>
                                                                    <div className="col-12 tw-mt-2">
                                                                        <Form.Control as="select" name="entities" onChange={(event) => setEntity(event.target.value)} disabled={statisticalProduct.nivel_desagregacion == 'Nacional' || isNacional == 0}>
                                                                            <option value="" hidden>Entidad</option>
                                                                            {
                                                                                entities ?
                                                                                    entities.map((item, index) => (
                                                                                        <option key={index} value={item.id_entidades}>
                                                                                            {
                                                                                                item.nombre_entidad
                                                                                            }
                                                                                        </option>
                                                                                    )) :
                                                                                    ''
                                                                            }
                                                                        </Form.Control>
                                                                    </div>
                                                                    <div className="col-12 tw-mt-2">
                                                                        <Form.Control as="select" name="tawns" onChange={(event) => setTawn(event.target.value)} disabled={statisticalProduct.nivel_desagregacion == 'Estatal' || isNacional == 0}>
                                                                            <option value="" hidden>Municipio</option>
                                                                            {
                                                                                tawns ?
                                                                                tawns.map((item, index) => (
                                                                                    <option key={index} value={item.cve_mun}>
                                                                                        {
                                                                                            item.nombre_mun
                                                                                        }
                                                                                    </option>
                                                                                )) :
                                                                                ''
                                                                            }
                                                                        </Form.Control>
                                                                    </div>
                                                                    <div className="col-12 tw-mt-2">
                                                                        <Form.Control as="select" name="localities" onChange={(event) => setLocality(event.target.value)} disabled={statisticalProduct.nivel_desagregacion != 'Localidad' || isNacional == 0}>
                                                                            <option value="" hidden>Localidad</option>
                                                                            {
                                                                                localities ? 
                                                                                    localities.map((item, index) => (
                                                                                        <option key={index} value={item.Codigo}>
                                                                                            {
                                                                                                item.Nombre
                                                                                            }
                                                                                        </option>
                                                                                    )) :
                                                                                    ''
                                                                            }
                                                                        </Form.Control>
                                                                    </div>
                                                                </Form.Group>
                                                        }
                                                        {
                                                            columns.length > 0 &&
                                                            <div className="row">
                                                                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-xs-12 tw-p-0 tw-my-2 text-center">
                                                                    <OverlayTrigger overlay={<Tooltip>Agregar tabular</Tooltip>}>
                                                                        <button className="btn-analisis" onClick={() => getStatiticalProductInformation()}>Agregar</button>
                                                                    </OverlayTrigger>
                                                                </div>
                                                                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-xs-12 tw-p-0 tw-my-2 text-center">
                                                                    <OverlayTrigger overlay={<Tooltip>Mostrar tabulares</Tooltip>}>
                                                                        <button className="btn-analisis" disabled={tableData.length == 0} onClick={() => handleShowTablesModal()}>Tabulares</button>
                                                                    </OverlayTrigger>
                                                                </div>
                                                                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-xs-12 tw-p-0 tw-my-2 text-center">
                                                                    <OverlayTrigger overlay={<Tooltip>Mostrar gr&aacute;ficas</Tooltip>}>
                                                                        <button className="btn-analisis" disabled={tableData.length == 0}
                                                                            // onClick={() => getStatiticalProductInformation()}
                                                                            >Gr&aacute;ficas</button>
                                                                    </OverlayTrigger>
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            }
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </div>
                    </div>
                </div>
                <div className="row">
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
                                <ContenedorMapaAnalisis botones={true} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}