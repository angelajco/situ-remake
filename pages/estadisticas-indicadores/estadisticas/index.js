import React, { useState, useRef, useEffect } from 'react'

import { useForm } from "react-hook-form"

import { Accordion, Card, Form } from 'react-bootstrap'

import Loader from '../../../components/Loader'
import ModalComponent from '../../../components/ModalComponent'

export default function index() {

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
    const [isLoading, setIsLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [isFiltersActive, setIsFiltersActive] = useState(false);
    const [datosModal, setDatosModal] = useState(
        {
            title: '',
            body: ''
        }
    );
    const [errors, setErrors] = useState({
        isStatisticalProductsError: false,
        isAggregationLevelsError: false,
        isAdvanceFiltersError: false
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
        // setIsLoading(true);
        // getEntities(function(data, error) {
        //     if(data) {
        //         setEntities(data);
        //         setIsLoading(false);
        //     } else {
        //         renderModal(error)
        //     }
        // });
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
      fetch(`${process.env.ruta}/wa/publico/catEntidades`)
        .then(res => res.json())
        .then(
            (data) => {
                setStatisticalProducts(aggregationLevels);
                setIsLoading(false);
                console.log('aggregation: ', refAggragationLevel)
            }, 
            (error) => {
                setErrors({
                    isStatisticalProductsError: true,
                    isAggregationLevelsError: errors.isAggregationLevelsError
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
    }, [])

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
                                            Productos Estad&iacute;sticos
                                        </h4>
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body>
                                            {
                                                errors.isStatisticalProductsError ?
                                                <h4 className="text-center">
                                                    La informaci&oacute;n no est&aacute; disponible
                                                </h4> :
                                                <Form.Group className="row" onChange={(event) => applyStatisticalProducts(event)}>
                                                    {
                                                        statisticalProducts.map((item, index) => (
                                                            <div key={index} className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12 custom-mx-b-1">
                                                                <Form.Check name="statisticalProducts" id={`radio-${index}`} type="radio" inline value={item.id} label={item.value}/>
                                                            </div>
                                                        ))
                                                    }
                                                </Form.Group>
                                            }
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Accordion.Toggle as={Card.Header} eventKey="1">
                                        <h4 className="text-center">
                                            Filtros
                                        </h4>
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="1">
                                        <Card.Body>
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