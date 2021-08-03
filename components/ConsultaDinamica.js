import React, { useState, useEffect } from 'react';
import { Accordion, Card, Form, FormControl, Modal, OverlayTrigger, Tooltip, Table, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faWindowRestore } from '@fortawesome/free-regular-svg-icons';

import $ from 'jquery';
import Draggable from 'react-draggable';
import ModalDialog from 'react-bootstrap/ModalDialog';

import Loader from './Loader'
import ModalComponent from './ModalComponent'
import GenericTable from './genericos/GenericTable';

export default function ConsultaDinamica(props) {

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
    const [operators, setOperators] = useState([
        {title: 'Igual a', value: '='},
        {title: 'Distinto a', value: '!='},
        {title: 'Mayor a', value: '>'},
        {title: 'Mayor igual a', value: '>='},
        {title: 'Menor a', value: '<'},
        {title: 'Menor igual a', value: '<='},
        {title: 'Entre', value: 'BETWEEN'},
        // {title: 'Cualquiera que no esté en', value: 'NOT IN'},
        // {title: 'Cualquiera que esté en', value: 'IN'}
    ])
    const [statisticalProducts, setStatisticalProducts] = useState([]);
    const [statisticalProduct, setStatisticalProduct] = useState();
    const [entities, setEntities] = useState([]);
    const [tawns, setTawns] = useState([]);
    const [localities, setLocalities] = useState([]);
    const [entity, setEntity] = useState();
    const [entityObject, setEntityObject] = useState([]);
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
    const [isShowAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [filtersAdded, setFiltersAdded] = useState([]);
    const [agregationFilters, setAgregationFilters] = useState([]);
    const [layesAdded, setLayesAdded] = useState(0);
    const [isMapVisible, setMapVisible] = useState(false);
    const [spaceData, setSpaceData] = useState();
    const [finalTables, setFinalTables] = useState([]);
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
                var name = entities.find(finded => finded.id_entidades == entity).nombre_entidad;
                var id = entity;
                if(statisticalProduct && statisticalProduct.nivel_desagregacion == 'Estatal' && isNacional == 1) {
                    setAgregationFilters([...agregationFilters, {id: id, name: name}])
                }
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
                var name = tawns.find(finded => finded.cve_mun == tawn).nombre_mun;
                var id = tawn;
                if(statisticalProduct && statisticalProduct.nivel_desagregacion == 'Municipal' && isNacional == 1) {
                    setAgregationFilters([...agregationFilters, {id: id, name: name}])
                }
                setLocalities(data);
                setIsLoading(false);
            } else {
                renderModal(error)
            }
        });
    }, [tawn]);

    useEffect(() => {
        setIsLoading(true);
        if(localities.length > 0) {
            // console.log('localities: ', localities);
            var name = localities.find(finded => finded.Codigo == locality).Nombre;
            var id = locality;
            if(statisticalProduct && statisticalProduct.nivel_desagregacion == 'Localidad' && isNacional == 1) {
                setAgregationFilters([...agregationFilters, {id: id, name: name}])
            }
            setIsLoading(false);
        }
    }, [locality]);

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

    useEffect(() => {
        if(isMapVisible == true) {
            if(spaceData.filters && spaceData.filters.length > 0) {
                var tmpArray = [];
                spaceData.filters.map(filter => {
                    var entity_ = entities.find(ent => ent.id_entidades == filter.id);
                    var tawn_ = tawns.find(taw => taw.cve_mun == filter.id);
                    var locality_ = localities.find(loc => loc.Codigo == filter.id);
                    if(locality_ != null) {
                        tmpArray.push({entity: locality_, capa: 6});
                        setEntityObject(tmpArray);
                    } else if(tawn_ != null) {
                        tawn_.cve_mun = `${entity}${tawn_.cve_mun}`;
                        tmpArray.push({entity: tawn_, capa: 3});
                        setEntityObject(tmpArray);
                    } else {
                        tmpArray.push({entity: entity_, capa: 2});
                        setEntityObject(tmpArray);
                    }});
            } else {
                setEntityObject(['nacional']);
            }
        }
    }, [layesAdded]);

    useEffect(() => {
        if(agregationFilters.length > 15) {
            renderModal('Solo se pueden agregar 15 elementos');
            var tmpArray = [];
            agregationFilters.map((filter, index) => {
                if(index <= 4)
                    tmpArray.push(filter);
            });
            setAgregationFilters(tmpArray);
        }
    }, [agregationFilters]);

    useEffect(() => {
        if(entityObject) {
            props.mapState({
                spaceData: spaceData,
                isMapVisible: isMapVisible,
                entityObject: entityObject
            });
        }
    }, [entityObject]);

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
        var levelValue;
        var args = `?etiquetaFuncional=${statisticalProduct.etiqueta_funcional}&nivel=${statisticalProduct.nivel_desagregacion}&nivelagregacion=${statisticalProduct.nivel_desagregacion}`;
        if(isNacional == 0) {
            if (statisticalProduct.nivel_desagregacion == 'Estatal') {
                levelValue = statisticalProduct.col_entidad;
                entities.map((entity) => {
                    args = `${args}&clave=${entity.id_entidades}`;
                });
                args = `${args}&valorNivel=${levelValue}`;
            } else if (statisticalProduct.nivel_desagregacion == 'Municipal') {
                levelValue = statisticalProduct.col_municipal;
                tawns.map((tawn) => {
                    args = `${args}&clave=${tawn.cve_mun}`;
                });
                args = `${args}&valorNivel=${levelValue}`;
            } else if (statisticalProduct.nivel_desagregacion == 'Localidad') {
                levelValue = statisticalProduct.col_localidad;
                localities.map((locality) => {
                    args = `${args}&clave=${locality.Codigo}`;
                });
                args = `${args}&valorNivel=${levelValue}`;
            }
        } else {
            if(statisticalProduct.nivel_desagregacion == 'Estatal') {
                levelValue = statisticalProduct.col_entidad;
                agregationFilters.map(filter => {
                    args = `${args}&clave=${filter.id}`;
                });
                args = `${args}&valorNivel=${levelValue}`;
            } else if(statisticalProduct.nivel_desagregacion == 'Municipal') {
                levelValue = statisticalProduct.col_municipal;
                agregationFilters.map(filter => {
                    args = `${args}&clave=${entity}${filter.id}`;
                });
                args = `${args}&valorNivel=${levelValue}`;
            } else if(statisticalProduct.nivel_desagregacion == 'Localidad') {
                levelValue = statisticalProduct.col_localidad;
                agregationFilters.map(filter => {
                    args = `${args}&clave=${entity}${tawn}${filter.id}`;
                });
                args = `${args}&valorNivel=${levelValue}`;
            }
        }
        columnsSelected.map((column) => {
            if(column.id != levelValue)
                args = `${args}&idcolumnas=${column.id}`;
        });
        var filters = '';
        filtersAdded.map((filter, index) => {
            filters = `${filters}${index != 0 ? ` AND ` : ``}@${filter.columna} ${filter.operacion} ${filter.valor}${filter.operacion == `BETWEEN` ? ` ${filter.valor2}` : ``}`;
        });
        args = `${args}${filters.length > 0 ? `&cadenaFiltros=${filters}`: ``}`;
        getTableData(args, function(data, error) {
            if(data && data.mensaje != 'Error') {
                data.nombreTabla = `Consulta Dínamica ${tableData.length + 1} - ${statisticalProduct.nombre} (${statisticalProduct.descripcion})`;
                setTableData([...tableData, {title: data.nombreTabla, type: 'table', data: data, level: statisticalProduct.nivel_desagregacion,  index: tableData.length, checked: false, filters: agregationFilters}]);
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

    function addFilterField(event) {
        var newFilter = {};
        newFilter.columna = event.target.value;
        columns.filter(column => column.id == newFilter.columna).map(filtered => newFilter.encabezado = filtered.encabezado);
        newFilter.operacion = '';
        newFilter.valor = '';
        newFilter.valor2 = '';
        newFilter.accion = '';
        setFiltersAdded([...filtersAdded, newFilter]);
    }

    function addfilterOperator(event, index) {
        var tmpArray = [];
        filtersAdded.map((filter, index_) => {
            if(index == index_)
                filter.operacion = event.target.value;
            tmpArray.push(filter)
        });
        setFiltersAdded(tmpArray);
    }

    function addfilterValue(event, index, second) {
        var tmpArray = [];
        var tmpValue = '';
        filtersAdded.map((filter, index_) => {
            if(index == index_) {
                if(second == true) {
                    tmpValue = `AND ${event.target.value}`;
                    filter.valor2 = tmpValue;
                } else {
                    tmpValue = `${event.target.value}`;
                    filter.valor = tmpValue;
                }
            }
            tmpArray.push(filter)
        });
        setFiltersAdded(tmpArray);
    }

    function removeFilter(index) {
        var tmpArray = [];
        filtersAdded.map(added => tmpArray.push(added));
        tmpArray.splice(index, 1);
        setFiltersAdded(tmpArray);
    }

    function restartFilters() {
        setColumns([]);
        setColumnsSelected([]);
        setFiltersAdded([]);
        setAgregationFilters([]);
        setEntity();
        setTawn();
        setLocality();
    }

    function removeAgregation(index) {
        var tmpArray = [];
        agregationFilters.map(added => tmpArray.push(added));
        tmpArray.splice(index, 1);
        setAgregationFilters(tmpArray);
    }

    function changeMapState(visible, data) {
        setSpaceData(data)
        setMapVisible(visible);
        setLayesAdded(layesAdded + 1);
        // referenciaMapa._onResize();
    }

    function createTable(indexes) {
        var tmpObject;
        indexes.map(index => {
            if(index == 0) {
                tmpObject = {
                    checked: tableData[index].checked,
                    data: tableData[index].data,
                    index: tableData.length,
                    level: tableData[index].level,
                    title: `Consulta dinámica - ${tableData.length + 1} - Unión`,
                    type: tableData[index].type,
                    filters: tableData[index].filters
                };
                tmpObject.data.nombreTabla = tmpObject.title;
            } else {
                tableData[index].data.columnas.map((column, index__) => {
                    var column_ = [column[0], column[1], column[2], index];
                    tmpObject.data.columnas.push(column_);
                });
                tmpObject.data.datos.map((tmpData, index_) => {
                    tableData[index].data.datos.map(data => {
                        if(tmpData[0] == data[0]) {
                            data.map(mapped => {
                                tmpObject.data.datos[index_].push(mapped);
                            });
                        }
                    });
                });
                setTableData([...tableData, tmpObject]);
            }
        });
        console.log('tmpObject:', tmpObject);
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
                                    tableData &&
                                        tableData.map((table, index) => (
                                            <GenericTable key={index} table={table} index={index} showMap={changeMapState} allTables={tableData} createTable={createTable}/>
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
                                            Opciones
                                        </h4>
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body className="custom-card-body">
                                            {
                                                errors.isStatisticalProductsError || statisticalProducts == null ?
                                                <h4 className="text-center">
                                                    La informaci&oacute;n no est&aacute; disponible
                                                </h4> :
                                                <div className="row">
                                                    <div className="col-12">
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
                                                                    <Form className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 tw-p-0 my-auto text-center">
                                                                        <Form.Check custom type="checkbox" inline className="mb-3 my-auto"
                                                                            onChange={(event) => applySelectionType(event)}
                                                                            label='Seleccionar todo/nada' id={`columns-check`}
                                                                            checked={columns.length > 0 && columns.length == columnsSelected.length}/>
                                                                    </Form>
                                                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 tw-p-0 text-center">
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
                                                    <div className="col-12">
                                                        {
                                                            errors.isStatisticalProductsError || errors.isAggregationLevelsError || errors.isColumnsError ?
                                                                <h4 className="text-center">
                                                                    La informaci&oacute;n no est&aacute; disponible
                                                                </h4> :
                                                                columns.length > 0 &&
                                                                <Form.Group className="row tw-mb-0">
                                                                    <div className="col-12 tw-mb-2 p-0">
                                                                        <div className="row">
                                                                            <div className="tw-mb-2 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12">
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
                                                                            <div className="tw-mb-2 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12">
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
                                                                            <div className="tw-mb-2 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12">
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
                                                                            <div className="tw-mb-2 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12">
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
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-12 tw-mb-2 p-0 table-responsive" style={{maxHeight: '90px'}}>
                                                                        {
                                                                            agregationFilters && agregationFilters.length > 0 &&
                                                                                <Table striped hover>
                                                                                    <tbody>
                                                                                        {
                                                                                            agregationFilters &&
                                                                                            agregationFilters.map((item, index) => (
                                                                                                <tr key={index}>
                                                                                                    <td>
                                                                                                        {item.name}
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        <OverlayTrigger overlay={<Tooltip>Eliminar filtro</Tooltip>}>
                                                                                                            <FontAwesomeIcon className="tw-ml-4 tw-cursor-pointer"
                                                                                                                onClick={() => removeAgregation(index)}
                                                                                                                icon={faTrash} />
                                                                                                        </OverlayTrigger>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            ))
                                                                                        }
                                                                                    </tbody>
                                                                                </Table>
                                                                        }
                                                                    </div>
                                                                </Form.Group>
                                                        }
                                                        {
                                                            isShowAdvancedFilters == true &&
                                                                <div className="row">
                                                                    <Card className="custom-card-body col-12">
                                                                        <div className="row tw-p-0 mb-2">
                                                                            <Form.Group className="col-12 tw-p-0 my-auto tw-mt-2">
                                                                                <Form.Control as="select" onChange={(event) => addFilterField(event)}>
                                                                                    <option value='' hidden>Agregar filtro</option>
                                                                                    {
                                                                                        columnsSelected.map((item, index) => (
                                                                                            <option key={index} value={item.id}>{item.encabezado}</option>
                                                                                        ))
                                                                                    }
                                                                                </Form.Control>
                                                                            </Form.Group>
                                                                        </div>
                                                                    </Card>
                                                                        {
                                                                            filtersAdded.length > 0 &&
                                                                                <div className="col-12 tw-p-0 mt-1">
                                                                                    <Table striped hover>
                                                                                        <tbody>
                                                                                            {
                                                                                                filtersAdded.map((content, index) => (
                                                                                                    <tr key={index}>
                                                                                                        <td>{content.encabezado}</td>
                                                                                                        <td>
                                                                                                            <Form.Group className="tw-p-0 my-auto tw-mt-2">
                                                                                                                <Form.Control as="select"
                                                                                                                    onChange={(event) => addfilterOperator(event, index)}
                                                                                                                    >
                                                                                                                    <option value='' hidden>Operación</option>
                                                                                                                    {
                                                                                                                        operators.map((item, index) => (
                                                                                                                            <option key={index} value={item.value}>{item.title}</option>
                                                                                                                        ))
                                                                                                                    }
                                                                                                                </Form.Control>
                                                                                                            </Form.Group>
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            {
                                                                                                                content.operacion.length > 0 &&
                                                                                                                    <InputGroup className="tw-p-0 my-auto tw-mt-2">
                                                                                                                        <FormControl
                                                                                                                            onKeyUp={(event) => addfilterValue(event, index, false)}
                                                                                                                            placeholder="Valor"
                                                                                                                            aria-label="Valor"
                                                                                                                            aria-describedby="basic-addon2"
                                                                                                                        />
                                                                                                                    </InputGroup>
                                                                                                            }
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            {
                                                                                                                content.operacion == 'BETWEEN' &&
                                                                                                                    <InputGroup className="tw-p-0 my-auto tw-mt-2">
                                                                                                                        <FormControl
                                                                                                                            onKeyUp={(event) => addfilterValue(event, index, true)}
                                                                                                                            placeholder="Valor 2"
                                                                                                                            aria-label="Valor 2"
                                                                                                                            aria-describedby="basic-addon2"
                                                                                                                        />
                                                                                                                    </InputGroup>
                                                                                                            }
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            <OverlayTrigger overlay={<Tooltip>Eliminar filtro</Tooltip>}>
                                                                                                                <FontAwesomeIcon className="tw-ml-4 tw-cursor-pointer"
                                                                                                                    onClick={() => removeFilter(index)}
                                                                                                                    icon={faTrash} />
                                                                                                            </OverlayTrigger>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                ))
                                                                                            }
                                                                                        </tbody>
                                                                                    </Table>
                                                                                </div>
                                                                        }
                                                                </div>
                                                        }
                                                        {
                                                            columns.length > 0 &&
                                                            <div className="row">
                                                                <div className={`tw-p-0 tw-my-2 text-center ${props.analisis ? "col-12" : "col-xl-4 col-lg-4 col-md-6 col-sm-12 col-xs-12"}`}>
                                                                    <OverlayTrigger overlay={<Tooltip>Agregar filtros avanzados</Tooltip>}>
                                                                        <button className="btn-analisis"
                                                                            onClick={() => setShowAdvancedFilters(!isShowAdvancedFilters)}
                                                                            >Filtros</button>
                                                                    </OverlayTrigger>
                                                                </div>
                                                                <div className={`tw-p-0 tw-my-2 text-center ${props.analisis ? "col-12" : "col-xl-4 col-lg-4 col-md-6 col-sm-12 col-xs-12"}`}>
                                                                    <OverlayTrigger overlay={<Tooltip>Agregar tabular</Tooltip>}>
                                                                        <button className="btn-analisis" onClick={() => getStatiticalProductInformation()}>Agregar</button>
                                                                    </OverlayTrigger>
                                                                </div>
                                                                <div className={`tw-p-0 tw-my-2 text-center ${props.analisis ? "col-12" : "col-xl-4 col-lg-4 col-md-6 col-sm-12 col-xs-12"}`}>
                                                                    <OverlayTrigger overlay={<Tooltip>Mostrar tabulares</Tooltip>}>
                                                                        <button className="btn-analisis" disabled={tableData.length == 0} onClick={() => handleShowTablesModal()}>Tabulares</button>
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
            </section>
        </>
    )
}