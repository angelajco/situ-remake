import React, { useState, useRef, useEffect } from 'react'
import { useForm } from "react-hook-form"
import { Accordion, Card, Form, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft, faAngleDoubleRight, faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons';

import Loader from '../../../components/Loader'
import ModalComponent from '../../../components/ModalComponent'

export default function estadisticas() {

    const aggregationLevels = [
        {
            id: 'nacional',
            value: 'Nacional'
        },
        {
            id: 'estatal',
            value: 'Estatal'
        },
        {
            id: 'municipal',
            value: 'Municipal'
        },
        // {
        //     id: 'localidad',
        //     value: 'Localidad'
        // }
    ];
    const [statisticalProducts, setStatisticalProducts] = useState([]);
    const [entities, setEntities] = useState([]);
    const [tawns, setTawns] = useState([]);
    const [localities, setLocalities] = useState([]);
    const [columns, setColumns] = useState([]);
    const [columnsSelected, setColumnsSelected] = useState([]);
    const [columnsAdded, setColumnsAdded] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [isFiltersActive, setIsFiltersActive] = useState(false);
    const [isSelectedTypeDisabled, setSelectedTypeDisabled] = useState(true)
    const [selectionType, setSelectionType] = useState();
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
        isColumnsError: false
    });

    const { register, watch } = useForm();

    let refStatisticalProducts = '';
    const refAggragationLevel = useRef();
    refAggragationLevel.current = watch("aggregationType", "");
    const refEntity = useRef();
    refEntity.current = watch("entities", "");
    const refTawn = useRef();
    refTawn.current = watch("tawns", "");
    const refLocalities = useRef();
    refLocalities.current = watch("localities", "");

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function applyStatisticalProducts(event) {
        refStatisticalProducts = event.target.value;
        setIsFiltersActive(true)
        setIsLoading(true);
        getColumns(refStatisticalProducts, function(data, error) {
            restartFilters();
            if(data) {
                fetchColumns(data.resultado, function(array) {
                    setColumns(array);
                    setIsLoading(false);
                    setSelectedTypeDisabled(false);
                });
            } else {
                renderModal(error)
            }
        });
    }

    function applySelectionType(event) {
        setSelectionType(parseInt(event.target.value))
    }

    function applyAggregation() {
        setIsLoading(true);
        getEntities(function(data, error) {
            if(data) {
                setEntities(data);
                setTawns(null);
                setIsLoading(false);
            } else {
                renderModal(error)
            }
        });
    }

    function applyEntities() {
        setIsLoading(true);
        getTawns(function(data, error) {
            if(data) {
                setTawns(data);
                setIsLoading(false);
            } else {
                renderModal(error)
            }
        });
    }

    function applyTawns() {
        setIsLoading(true);
        getLocalities(function(data, error) {
            if(data) {
                setLocalities(data);
                setIsLoading(false);
            } else {
                renderModal(error)
            }
        });
    }

    function getEntities(response) {
        fetch(`${process.env.ruta}/wa/publico/catEntidades`)
        .then(res => res.json())
        .then(
            (data) => response(data, null),
            (error) => response(null, error)
        );
    }

    function getTawns(response) {
        fetch(`${process.env.ruta}/wa/publico/catMunicipios`)
        .then(res => res.json())
        .then(
            (data) => response(data, null),
            (error) => response(null, error)
        );
    }

    function getLocalities(response) {
        fetch(`${process.env.ruta}/wa/publico/catLocalidades?id_entidad=${refEntity.current}`)
        .then(res => res.json())
        .then(
            (data) => response(data, null),
            (error) => response(null, error)
        );
    }

    function getColumns(arg, response) {
        fetch(`${process.env.ruta}/wa/publico/obtenerColumnas/${arg}`)
        .then(res => res.json())
        .then(
            (data) => response(data, null),
            (error) => {
                setErrors({
                    isStatisticalProductsError: errors.isStatisticalProductsError,
                    isAggregationLevelsError: errors.isAggregationLevelsError,
                    isAdvanceFiltersError: errors.isAdvanceFiltersError,
                    isColumnsError: true
                });
                response(null, error)
            }
        );
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

    useEffect(() => {
      fetch(`${process.env.ruta}/wa/publico/obtenerTablas`)
        .then(res => res.json())
        .then(
            (data) => {
                setStatisticalProducts(data.resultado);
                setIsLoading(false);
                console.log('aggregation: ', refAggragationLevel)
            }, 
            (error) => {
                setErrors({
                    isStatisticalProductsError: true,
                    isAggregationLevelsError: errors.isAggregationLevelsError,
                    isAdvanceFiltersError: errors.isAdvanceFiltersError,
                    isColumnsError: errors.isColumnsError
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
            case 3://TODO revisar selección inversa
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
            break;
            default:
            break;
        }
    }, [selectionType]);

    useEffect(() => {
        console.log('columnsSelected: ', columnsSelected);
    }, [columnsSelected]);

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
        });
        if(array[event.target.value].checked == true) {
            setColumnsSelected([...columnsSelected, array[event.target.value]]);
        } else {
            var column = array[event.target.value].columna;
            array = [];
            columnsSelected.filter(selected => selected.columna != column).map(checked => {
                array.push(checked);
            });
            setColumnsSelected(array);
        }
    }

    function restartFilters() {
        setColumnsAdded([]);
        setColumns([]);
        setColumnsSelected([]);
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
                <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 custom-mx-t-1">
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
                                                            <Form.Group className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 tw-p-0">
                                                                <Form.Control as="select" onChange={(event) => applyStatisticalProducts(event)}>
                                                                    <option value='' hidden>Productos Estad&iacute;sticos</option>
                                                                    {
                                                                        statisticalProducts.map((item, index) => (
                                                                            <option key={index} value={item.nombre_tabla}>{item.nombre}</option>
                                                                        ))
                                                                    }
                                                                </Form.Control>
                                                            </Form.Group>
                                                            <Form.Group className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 tw-p-0">
                                                                <Form.Control as="select" disabled={isSelectedTypeDisabled} onChange={(event) => applySelectionType(event)}>
                                                                    <option value='' hidden>Tipo de selecci&oacute;n</option>
                                                                    <option value='1'>Todo</option>
                                                                    <option value='2'>Nada</option>
                                                                    <option value='3'>Invertir selecci&oacute;n</option>
                                                                </Form.Control>
                                                            </Form.Group>
                                                        </div>
                                                        {
                                                            errors.isColumnsError ?
                                                            <h4 className="text-center">
                                                                La informaci&oacute;n no est&aacute; disponible
                                                            </h4> :
                                                            <div className="row tw-mb-2">
                                                                {
                                                                    columns.length > 0 &&
                                                                        <div className="col-12 tw-p-0">
                                                                            <Card className="custom-card-body">
                                                                                <div className="row">
                                                                                    <h6 className="text-center w-100">Columnas</h6>
                                                                                </div>
                                                                                <div className="row content-columns">
                                                                                    <Form>
                                                                                        {
                                                                                            columns.map((item, index) => (
                                                                                                <Form.Check key={index} custom type="checkbox" inline className="mb-3" onChange={(event) => columnsSelected_(event)}
                                                                                                    checked={item.checked} value={index} label={item.columna} id={`column-${index}`}/>
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
                                                </div>
                                            }
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Accordion.Toggle as={Card.Header} eventKey="1">
                                        <h4 className="text-center">
                                            Opciones
                                        </h4>
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="1">
                                        <Card.Body className="custom-card-body">
                                            {
                                                errors.isStatisticalProductsError ?
                                                <h4 className="text-center">
                                                    La informaci&oacute;n no est&aacute; disponible
                                                </h4> :
                                                <div className="row">
                                                    <div className="col-6">
                                                    </div>
                                                </div>
                                                // <Form.Group className="row" onChange={(event) => applyStatisticalProducts(event)}>
                                                //     {
                                                //         columns.map((item, index) => (
                                                //             <div key={index} className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12 custom-mx-b-1">
                                                //                 <Form.Check name={`columns${index}`} id={`radio-columns-${index}`} type="radio" inline value={item.columna} label={item.columna}/>
                                                //             </div>
                                                //         ))
                                                //     }
                                                // </Form.Group>
                                            }
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Accordion.Toggle as={Card.Header} eventKey="2">
                                        <h4 className="text-center">
                                            Filtros
                                        </h4>
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="2">
                                        <Card.Body className="custom-card-body">
                                            {
                                                isFiltersActive ?
                                                errors.isStatisticalProductsError || errors.isAggregationLevelsError ?
                                                <h4 className="text-center">
                                                    La informaci&oacute;n no est&aacute; disponible
                                                </h4> :
                                                <Form.Group className="row">
                                                    <Form.Label className="col-12">
                                                        <h5 className="text-center">
                                                            Agregaci&oacute;n
                                                        </h5>
                                                    </Form.Label>
                                                    <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-xs-12 custom-mx-b-1">
                                                        <Form.Control as="select" name="aggregationType" ref={register} onChange={() => applyAggregation()}>
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
                                                    <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-xs-12 custom-mx-b-1">
                                                        <Form.Control as="select" name="entities" ref={register} onChange={() => applyEntities()}>
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
                                                    <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-xs-12 custom-mx-b-1">
                                                        <Form.Control as="select" name="tawns"  ref={register} onChange={() => applyTawns()}>
                                                            <option value="" hidden>Municipio</option>
                                                            {/* <option value="">-</option> */}
                                                            {
                                                                tawns ?
                                                                tawns.filter(tawn => tawn.cve_ent == refEntity.current).map((item, index) => (
                                                                    <option key={index} value={item.cve_mun}>
                                                                        {
                                                                            item.nombre_municipio
                                                                        }
                                                                    </option>
                                                                )) :
                                                                ''
                                                            }
                                                        </Form.Control>
                                                    </div>
                                                    {/* <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12 custom-mx-b-1">
                                                        <Form.Control as="select" name="localities" ref={register}>
                                                            <option value="" hidden>Localidad</option>
                                                            {
                                                                localities ? 
                                                                    localities.filter(locality => locality.cve_mun == refTawn.current).map((item, index) => (
                                                                        <option key={index} value={item.id_localidad}>
                                                                            {
                                                                                item.nombre_localidad
                                                                            }
                                                                        </option>
                                                                    )) :
                                                                    ''
                                                            }
                                                        </Form.Control>
                                                    </div> */}
                                                </Form.Group> :
                                                <h4 className="text-center">
                                                    Debes seleccionar un producto estad&iacute;stico para poder aplicar filtros
                                                </h4>
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