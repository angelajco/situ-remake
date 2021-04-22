import dynamic from 'next/dynamic';
import React, { useState, useRef, useEffect } from 'react'

import { useForm } from "react-hook-form";

import { Form, Dropdown, MenuItem, DropdownButton } from 'react-bootstrap';

import GenericChart from '../../components/GenericChart';
import GenericTable from '../../components/GenericTable';

export default function index() {
    
    let chartContent = {
        name: "Instrumentos de planeación", 
        type: "barra",
        color: "#276C6F",
        heigth: 100,
        width: 100,
        angle: 0,
        margin: {
            top: 20,
            right: 30,
            left: 20,
            bottom: 5
        },
        data: [
            {
                name: "Estatales",
                value: 54.7,
                representation: "percentage"
            },
            {
                name: "Municipales",
                value: 17,
                representation: "percentage"
            }
        ]
    };
    let tableContent ={
        type: "table",
        data: [
            {
                id: "01",
                entidad: "Aguascalientes",
                poblacion_total: 0,
                hombres: 0,
                mujeres: 0
            },
            {
                id: "02",
                entidad: "Baja California",
                poblacion_total: 0,
                hombres: 0,
                mujeres: 0
            },
            {
                id: "03",
                entidad: "Baja California Sur",
                poblacion_total: 0,
                hombres: 0,
                mujeres: 0
            },
            {
                id: "04",
                entidad: "Campeche",
                poblacion_total: 0,
                hombres: 0,
                mujeres: 0
            },
            {
                id: "05",
                entidad: "Coahuila",
                poblacion_total: 0,
                hombres: 0,
                mujeres: 0
            },
            {
                id: "06",
                entidad: "Colima",
                poblacion_total: 0,
                hombres: 0,
                mujeres: 0
            },
            {
                id: "07",
                entidad: "Chiapas",
                poblacion_total: 0,
                hombres: 0,
                mujeres: 0
            },
            {
                id: "08",
                entidad: "Chihuahua",
                poblacion_total: 0,
                hombres: 0,
                mujeres: 0
            },
            {
                id: "09",
                entidad: "Ciudad de México",
                poblacion_total: 0,
                hombres: 0,
                mujeres: 0
            },
            {
                id: "10",
                entidad: "Durango",
                poblacion_total: 0,
                hombres: 0,
                mujeres: 0
            },
            {
                id: "11",
                entidad: "Guanajuato",
                poblacion_total: 0,
                hombres: 0,
                mujeres: 0
            },
            {
                id: "12",
                entidad: "Guerrero",
                poblacion_total: 0,
                hombres: 0,
                mujeres: 0
            },
            {
                id: "13",
                entidad: "Hidalgo",
                poblacion_total: 0,
                hombres: 0,
                mujeres: 0
            },
            {
                id: "14",
                entidad: "Jalisco",
                poblacion_total: 0,
                hombres: 0,
                mujeres: 0
            },
            {
                id: "15",
                entidad: "México",
                poblacion_total: 0,
                hombres: 0,
                mujeres: 0
            },
            {
                id: "16",
                entidad: "Michoacan",
                poblacion_total: 0,
                hombres: 0,
                mujeres: 0
            },
            {
                id: "17",
                entidad: "Morelos",
                poblacion_total: 0,
                hombres: 0,
                mujeres: 0
            },
            {
                id: "18",
                entidad: "Nayarit",
                poblacion_total: 0,
                hombres: 0,
                mujeres: 0
            },
            {
                id: "19",
                entidad: "Nuevo León",
                poblacion_total: 0,
                hombres: 0,
                mujeres: 0
            },
            {
                id: "20",
                entidad: "Oaxaca",
                poblacion_total: 0,
                hombres: 0,
                mujeres: 0
            },
            {
                id: "21",
                entidad: "Puebla",
                poblacion_total: 0,
                hombres: 0,
                mujeres: 0
            },
            {
                id: "22",
                entidad: "Queretaro",
                poblacion_total: 0,
                hombres: 0,
                mujeres: 0
            },
            {
                id: "23",
                entidad: "Quintana Roo",
                poblacion_total: 0,
                hombres: 0,
                mujeres: 0
            },
            {
                id: "24",
                entidad: "San Luis Potosi",
                poblacion_total: 0,
                hombres: 0,
                mujeres: 0
            },
            {
                id: "25",
                entidad: "Sinaloa",
                poblacion_total: 0,
                hombres: 0,
                mujeres: 0
            },
            {
                id: "26",
                entidad: "Sonora",
                poblacion_total: 0,
                hombres: 0,
                mujeres: 0
            },
            {
                id: "27",
                entidad: "Tabasco",
                poblacion_total: 0,
                hombres: 0,
                mujeres: 0
            },
            {
                id: "28",
                entidad: "Tamaulipas",
                poblacion_total: 0,
                hombres: 0,
                mujeres: 0
            },
            {
                id: "29",
                entidad: "Tlaxcala",
                poblacion_total: 0,
                hombres: 0,
                mujeres: 0
            },
            {
                id: "30",
                entidad: "Veracruz",
                poblacion_total: 0,
                hombres: 0,
                mujeres: 0
            },
            {
                id: "31",
                entidad: "Yucatán",
                poblacion_total: 0,
                hombres: 0,
                mujeres: 0
            },
            {
                id: "32",
                entidad: "Zacatecas",
                poblacion_total: 0,
                hombres: 0,
                mujeres: 0
            }
        ]
    };
    let mapContent = {
        configuration: {
            size: {
                height: 450,
                width: "100%"
            },
            zoom: 5,
            scrollWheelZoom:false
        },
        data: {
            center: [24.1969953,-102.8199341]
        }
    };
    let basedTableChartContent = {
        name: "Especificación de tabla", 
        type: "barra",
        color: "#276C6F",
        heigth: 250,
        width: 100,
        angle: -90,
        anchor: "end",
        margin:{
            top: 20,
            right: 30,
            left: 20,
            bottom: 75
        },
        data: []
    };

    let totalPopulation;
    let woman;
    let man;

    let filters = {
        aggregation: '',
        chartColumn: '',
        chartType: '',
        mapColumn: ''
    };

    const { register, watch } = useForm();
    
    const refChartColumn = useRef();
    refChartColumn.current = watch("idChartColumn", "");

    const GenericMap = dynamic(
        () => import('../../components/GenericMap'),
        {
            loading: () => <p>El mapa está cargando</p>,
            ssr: false
        }
    )

    function prepareData(success) {
        totalPopulation = 0;
        woman = 0;
        man = 0;
        filters.aggregation = 'Nacional';
        filters.chartColumn = Object.keys(tableContent.data[0])[2];
        filters.chartType = 'barra';
        filters.mapColumn = Object.keys(tableContent.data[0])[2];
        for(var i = 0; i < tableContent.data.length; i ++) {
            let data = tableContent.data[i];
            var women = Math.floor(Math.random() * 100000);
            var men = Math.floor(Math.random() * 100000);
            tableContent.data[i].mujeres = women;
            tableContent.data[i].hombres = men;
            tableContent.data[i].poblacion_total = women + men;
            basedTableChartContent.data.push({
                name: data.entidad,
                value: data[filters.chartColumn],
                representation: "integer"
            })
            woman += data.mujeres;
            man += data.hombres;
        };
        totalPopulation = woman + man;
        success(
        {
            totalPopulation,
            woman,
            man
        });
    }

    return (
        <>
            {
                prepareData(function(res) {
                    totalPopulation = res.totalPopulation;
                    woman = res.woman;
                    man = res.man;
                    basedTableChartContent.type = filters.chartType;
                })
            }
            <section className="container-fluid custom-max-width custom-mx-b-1">
                <div className="row">
                    <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 custom-mx-t-1">
                        <div className="row justify-content-center tw-mx-1">
                            <h4 className="tw-text-inst-dorado">
                                Poblaci&oacute;n
                            </h4>
                        </div>
                        <div className="row justify-content-center tw-mx-1 main-statics-amounts">
                            <h4 className="text-center">
                                {totalPopulation}
                            </h4>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 custom-mx-t-1">
                        <div className="row justify-content-center tw-mx-1">
                            <h4 className="tw-text-inst-dorado">
                                Mujeres
                            </h4>
                        </div>
                        <div className="row justify-content-center tw-mx-1 main-statics-amounts">
                            <h4 className="text-center">
                                {woman}
                            </h4>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 custom-mx-t-1">
                        <div className="row justify-content-center tw-mx-1">
                            <h4 className="tw-text-inst-dorado">
                                Hombres
                            </h4>
                        </div>
                        <div className="row justify-content-center tw-mx-1 main-statics-amounts">
                            <h4 className="text-center">
                                {man}
                            </h4>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-xs-12 custom-mx-t-1">
                        <div className="row justify-content-center tw-mx-1">
                            <h4 className="tw-text-titulo">
                                Marginaci&oacute;n
                            </h4>
                        </div>
                        <div className="row justify-content-center tw-mx-1 main-statics-leves">
                            <h4>
                                MEDIA
                            </h4>
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-xs-12 custom-mx-t-1">
                        <div className="row justify-content-center tw-mx-1">
                            <h4 className="tw-text-titulo">
                                Rezago social
                            </h4>
                        </div>
                        <div className="row justify-content-center tw-mx-1 main-statics-leves">
                            <h4>
                                MEDIO
                            </h4>
                        </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12">
                        <div className="row">
                            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-xs-12 custom-mx-t-1">
                            <h4 className="tw-text-titulo text-center">
                                Instrumentos de Planeaci&oacute;n
                            </h4>
                            </div>
                            <div className="col-xl-8 col-lg-8 col-md-6 col-sm-12 col-xs-12 custom-mx-t-1">
                                <div className="row justify-content-center tw-mx-1">
                                    <GenericChart chart={chartContent} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12">
                        <div className="row justify-content-center custom-mx-t-1 custom-h-450 table-responsive">
                            <GenericTable table={tableContent} />
                        </div>
                        <div className="row">
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 custom-mx-t-1">
                                <div className="row justify-content-center tw-mx-1">
                                    <Dropdown className="w-100">
                                        <Dropdown.Toggle className="w-100" variant="light" id="aggregationLevelDropdown">
                                            Nivel de agregaci&oacute;n
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="w-100">
                                            <Dropdown.Item  key="0">Nacional</Dropdown.Item>
                                            <Dropdown.Item  key="1">Estatal</Dropdown.Item>
                                            <Dropdown.Item  key="2">Municipal</Dropdown.Item>
                                            <Dropdown.Item  key="3">Local</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 custom-mx-t-1">
                                <div className="row justify-content-center tw-mx-1">
                                    <Form.Group controlId="idChartColumn" className="w-100">
                                        <Form.Control as="select" name="idChartColumn" ref={register}>
                                            <option value="" hidden>Columna a graficar</option>
                                            {
                                                Object.keys(tableContent.data[0]).map((value, index) => (
                                                    value !== 'id' && tableContent.data[0][value].constructor.name !== "String" ?
                                                        <option key={index} value={value}>
                                                            {
                                                                value
                                                            }
                                                        </option> :
                                                    ''
                                                ))
                                            }
                                        </Form.Control>
                                    </Form.Group>
                                    {/* <Dropdown className="w-100">
                                        <Dropdown.Toggle className="w-100" variant="light" id="chartColumnDropdown">
                                            Columna a graficar
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="w-100">
                                            {
                                                Object.keys(tableContent.data[0]).map((column, index) => (
                                                    column !== 'id' && tableContent.data[0][column].constructor.name !== "String" ?
                                                    <Dropdown.Item onClick={evalChartColumn} key={index}>{column}</Dropdown.Item> :
                                                    ''
                                                ))
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown> */}
                                </div>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 custom-mx-t-1">
                                <div className="row justify-content-center tw-mx-1">
                                    <Dropdown className="w-100">
                                        <Dropdown.Toggle className="w-100" variant="light" id="chartTypeDropdown">
                                            Tipo de gr&aacute;fica
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="w-100">
                                            <Dropdown.Item key="0">Barras</Dropdown.Item>
                                            <Dropdown.Item key="1">Pay</Dropdown.Item>
                                            <Dropdown.Item key="2">Radar</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 custom-mx-t-1">
                                <div className="row justify-content-center tw-mx-1">
                                    <Dropdown className="w-100">
                                        <Dropdown.Toggle className="w-100" variant="light" id="mapColumnDropdown">
                                            Columna para mapa
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="w-100">
                                            {
                                                Object.keys(tableContent.data[0]).map((column, index) => (
                                                    column !== 'id' && tableContent.data[0][column].constructor.name !== "String" ?
                                                    <Dropdown.Item href={"#/action-" + index} key={index}>{column}</Dropdown.Item> :
                                                    ''
                                                ))
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12">
                        <div className="row justify-content-center custom-mx-t-1">
                            <GenericMap map={mapContent} />
                        </div>
                        <div className="row justify-content-center custom-mx-t-1">
                            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12">
                                <h4 className="text-center">
                                    Descarga CSV
                                </h4>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12">
                                <h4 className="text-center">
                                    Descarga PDF
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center custom-mx-t-1">
                    <h4>
                        {refChartColumn.current.toUpperCase()}
                    </h4>
                </div>
                <div className="row justify-content-center">
                    <GenericChart chart={basedTableChartContent} />
                </div>
            </section>
        </>
    )
}