import dynamic from 'next/dynamic';

import { Dropdown, MenuItem, DropdownButton } from 'react-bootstrap';

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
                poblacion_total: Math.floor(Math.random() * 100000),
                hombres: Math.floor(Math.random() * 100000),
                mujeres: Math.floor(Math.random() * 100000)
            },
            {
                id: "02",
                entidad: "Baja California",
                poblacion_total: Math.floor(Math.random() * 100000),
                hombres: Math.floor(Math.random() * 100000),
                mujeres: Math.floor(Math.random() * 100000)
            },
            {
                id: "03",
                entidad: "Baja California Sur",
                poblacion_total: Math.floor(Math.random() * 100000),
                hombres: Math.floor(Math.random() * 100000),
                mujeres: Math.floor(Math.random() * 100000)
            },
            {
                id: "04",
                entidad: "Campeche",
                poblacion_total: Math.floor(Math.random() * 100000),
                hombres: Math.floor(Math.random() * 100000),
                mujeres: Math.floor(Math.random() * 100000)
            },
            {
                id: "05",
                entidad: "Coahuila",
                poblacion_total: Math.floor(Math.random() * 100000),
                hombres: Math.floor(Math.random() * 100000),
                mujeres: Math.floor(Math.random() * 100000)
            },
            {
                id: "06",
                entidad: "Colima",
                poblacion_total: Math.floor(Math.random() * 100000),
                hombres: Math.floor(Math.random() * 100000),
                mujeres: Math.floor(Math.random() * 100000)
            },
            {
                id: "07",
                entidad: "Chiapas",
                poblacion_total: Math.floor(Math.random() * 100000),
                hombres: Math.floor(Math.random() * 100000),
                mujeres: Math.floor(Math.random() * 100000)
            },
            {
                id: "08",
                entidad: "Chihuahua",
                poblacion_total: Math.floor(Math.random() * 100000),
                hombres: Math.floor(Math.random() * 100000),
                mujeres: Math.floor(Math.random() * 100000)
            },
            {
                id: "09",
                entidad: "Ciudad de México",
                poblacion_total: Math.floor(Math.random() * 100000),
                hombres: Math.floor(Math.random() * 100000),
                mujeres: Math.floor(Math.random() * 100000)
            },
            {
                id: "10",
                entidad: "Durango",
                poblacion_total: Math.floor(Math.random() * 100000),
                hombres: Math.floor(Math.random() * 100000),
                mujeres: Math.floor(Math.random() * 100000)
            },
            {
                id: "11",
                entidad: "Guanajuato",
                poblacion_total: Math.floor(Math.random() * 100000),
                hombres: Math.floor(Math.random() * 100000),
                mujeres: Math.floor(Math.random() * 100000)
            },
            {
                id: "12",
                entidad: "Guerrero",
                poblacion_total: Math.floor(Math.random() * 100000),
                hombres: Math.floor(Math.random() * 100000),
                mujeres: Math.floor(Math.random() * 100000)
            },
            {
                id: "13",
                entidad: "Hidalgo",
                poblacion_total: Math.floor(Math.random() * 100000),
                hombres: Math.floor(Math.random() * 100000),
                mujeres: Math.floor(Math.random() * 100000)
            },
            {
                id: "14",
                entidad: "Jalisco",
                poblacion_total: Math.floor(Math.random() * 100000),
                hombres: Math.floor(Math.random() * 100000),
                mujeres: Math.floor(Math.random() * 100000)
            },
            {
                id: "15",
                entidad: "México",
                poblacion_total: Math.floor(Math.random() * 100000),
                hombres: Math.floor(Math.random() * 100000),
                mujeres: Math.floor(Math.random() * 100000)
            },
            {
                id: "16",
                entidad: "Michoacan",
                poblacion_total: Math.floor(Math.random() * 100000),
                hombres: Math.floor(Math.random() * 100000),
                mujeres: Math.floor(Math.random() * 100000)
            },
            {
                id: "17",
                entidad: "Morelos",
                poblacion_total: Math.floor(Math.random() * 100000),
                hombres: Math.floor(Math.random() * 100000),
                mujeres: Math.floor(Math.random() * 100000)
            },
            {
                id: "18",
                entidad: "Nayarit",
                poblacion_total: Math.floor(Math.random() * 100000),
                hombres: Math.floor(Math.random() * 100000),
                mujeres: Math.floor(Math.random() * 100000)
            },
            {
                id: "19",
                entidad: "Nuevo León",
                poblacion_total: Math.floor(Math.random() * 100000),
                hombres: Math.floor(Math.random() * 100000),
                mujeres: Math.floor(Math.random() * 100000)
            },
            {
                id: "20",
                entidad: "Oaxaca",
                poblacion_total: Math.floor(Math.random() * 100000),
                hombres: Math.floor(Math.random() * 100000),
                mujeres: Math.floor(Math.random() * 100000)
            },
            {
                id: "21",
                entidad: "Puebla",
                poblacion_total: Math.floor(Math.random() * 100000),
                hombres: Math.floor(Math.random() * 100000),
                mujeres: Math.floor(Math.random() * 100000)
            },
            {
                id: "22",
                entidad: "Queretaro",
                poblacion_total: Math.floor(Math.random() * 100000),
                hombres: Math.floor(Math.random() * 100000),
                mujeres: Math.floor(Math.random() * 100000)
            },
            {
                id: "23",
                entidad: "Quintana Roo",
                poblacion_total: Math.floor(Math.random() * 100000),
                hombres: Math.floor(Math.random() * 100000),
                mujeres: Math.floor(Math.random() * 100000)
            },
            {
                id: "24",
                entidad: "San Luis Potosi",
                poblacion_total: Math.floor(Math.random() * 100000),
                hombres: Math.floor(Math.random() * 100000),
                mujeres: Math.floor(Math.random() * 100000)
            },
            {
                id: "25",
                entidad: "Sinaloa",
                poblacion_total: Math.floor(Math.random() * 100000),
                hombres: Math.floor(Math.random() * 100000),
                mujeres: Math.floor(Math.random() * 100000)
            },
            {
                id: "26",
                entidad: "Sonora",
                poblacion_total: Math.floor(Math.random() * 100000),
                hombres: Math.floor(Math.random() * 100000),
                mujeres: Math.floor(Math.random() * 100000)
            },
            {
                id: "27",
                entidad: "Tabasco",
                poblacion_total: Math.floor(Math.random() * 100000),
                hombres: Math.floor(Math.random() * 100000),
                mujeres: Math.floor(Math.random() * 100000)
            },
            {
                id: "28",
                entidad: "Tamaulipas",
                poblacion_total: Math.floor(Math.random() * 100000),
                hombres: Math.floor(Math.random() * 100000),
                mujeres: Math.floor(Math.random() * 100000)
            },
            {
                id: "29",
                entidad: "Tlaxcala",
                poblacion_total: Math.floor(Math.random() * 100000),
                hombres: Math.floor(Math.random() * 100000),
                mujeres: Math.floor(Math.random() * 100000)
            },
            {
                id: "30",
                entidad: "Veracruz",
                poblacion_total: Math.floor(Math.random() * 100000),
                hombres: Math.floor(Math.random() * 100000),
                mujeres: Math.floor(Math.random() * 100000)
            },
            {
                id: "31",
                entidad: "Yucatán",
                poblacion_total: Math.floor(Math.random() * 100000),
                hombres: Math.floor(Math.random() * 100000),
                mujeres: Math.floor(Math.random() * 100000)
            },
            {
                id: "32",
                entidad: "Zacatecas",
                poblacion_total: Math.floor(Math.random() * 100000),
                hombres: Math.floor(Math.random() * 100000),
                mujeres: Math.floor(Math.random() * 100000)
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
        data: []
    };

    const GenericMap = dynamic(
        () => import('../../components/GenericMap'),
        {
            loading: () => <p>El mapa está cargando</p>,
            ssr: false
        }
    )

    function prepareData() {
        tableContent.data.map((data) => (
            basedTableChartContent.data.push({
                name: data.entidad,
                value: data['poblacion_total'],
                representation: "integer"
            })
        ))
    }

    return (
        <>
            <section className="container-fluid custom-max-width custom-mx-b-1">
                <div className="row">
                    <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 custom-mx-t-1">
                        <div className="row justify-content-center tw-mx-1">
                            <h4 className="tw-text-inst-dorado">
                                Poblaci&oacute;n
                            </h4>
                        </div>
                        <div className="row justify-content-center tw-mx-1 main-statics-amounts">
                            <h6 className="text-center">
                                100'000,000
                            </h6>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 custom-mx-t-1">
                        <div className="row justify-content-center tw-mx-1">
                            <h4 className="tw-text-inst-dorado">
                                Mujeres
                            </h4>
                        </div>
                        <div className="row justify-content-center tw-mx-1 main-statics-amounts">
                            <h6 className="text-center">
                                52'000,000
                            </h6>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 custom-mx-t-1">
                        <div className="row justify-content-center tw-mx-1">
                            <h4 className="tw-text-inst-dorado">
                                Hombres
                            </h4>
                        </div>
                        <div className="row justify-content-center tw-mx-1 main-statics-amounts">
                            <h6 className="text-center">
                                48'000,000
                            </h6>
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
                            <h6>
                                MEDIA
                            </h6>
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-xs-12 custom-mx-t-1">
                        <div className="row justify-content-center tw-mx-1">
                            <h4 className="tw-text-titulo">
                                Rezago social
                            </h4>
                        </div>
                        <div className="row justify-content-center tw-mx-1 main-statics-leves">
                            <h6>
                                MEDIO
                            </h6>
                        </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12">
                        <div className="row">
                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 custom-mx-t-1">
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
                            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-xs-12 custom-mx-t-1">
                                <div className="row justify-content-center tw-mx-1">
                                    <Dropdown>
                                        <Dropdown.Toggle variant="light" id="chartColumnDropdown">
                                            Columna a graficar
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
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
                            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-xs-12 custom-mx-t-1">
                                <div className="row justify-content-center tw-mx-1">
                                    <Dropdown>
                                        <Dropdown.Toggle variant="light" id="chartTypeDropdown">
                                            Tipo de gr&aacute;fica
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item key="0">Barras</Dropdown.Item>
                                            <Dropdown.Item key="1">Pay</Dropdown.Item>
                                            <Dropdown.Item key="2">Radar</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-xs-12 custom-mx-t-1">
                                <div className="row justify-content-center tw-mx-1">
                                    <Dropdown>
                                        <Dropdown.Toggle variant="light" id="mapColumnDropdown">
                                            Columna a graficar
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
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
                                <h6 className="text-center">
                                    Descarga CSV
                                </h6>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12">
                                <h6 className="text-center">
                                    Descarga PDF
                                </h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center custom-mx-t-1">
                    {
                        prepareData()
                    }
                    <GenericChart chart={basedTableChartContent} />
                </div>
            </section>
        </>
    )
}