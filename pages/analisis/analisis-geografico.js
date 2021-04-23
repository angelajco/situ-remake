import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { Form, Modal, Button, OverlayTrigger, Tooltip, Card, ListGroup, Accordion } from 'react-bootstrap'
import { DragDropContext, Droppable, Draggable, resetServerContext } from 'react-beautiful-dnd'
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faDownload, faSave, faEdit, faCheck, faPlus, faAngleDown } from '@fortawesome/free-solid-svg-icons'

import dynamic from 'next/dynamic'
import $ from 'jquery'

import catalogoEntidades from "../../shared/jsons/entidades.json";

import Cookies from 'universal-cookie'
const cookies = new Cookies()

//Importa dinámicamente el mapa
const Map = dynamic(
    () => import('../../components/Map'),
    {
        loading: () => <p>El mapa está cargando</p>,
        ssr: false
    }
)

export default function AnalisisGeografico() {

    //Cuando se renderiza el lado del servidor (SSR). Garantiza que el estado del contexto no persista en varias representaciones en el servidor, lo que provocaría discrepancias en las marcas de cliente / servidor después de que se presenten varias solicitudes en el servidor
    resetServerContext();

    //Acciones del formulario
    const { register, handleSubmit } = useForm();
    const { register: register1, handleSubmit: handleSubmit1 } = useForm();

    //Para guardar las capas que se van a mostrar
    const [capasVisualizadas, setCapasVisualizadas] = useState([])
    //Para guardar los datos de las capas
    const [datosCapasBackEnd, setDatosCapasBackEnd] = useState([])

    //Para guardar las capas que se van a mostrar
    const [capasVisualizadasEspejo, setCapasVisualizadasEspejo] = useState([])
    //Para guardar la columna de la capa espejo
    const [dobleMapa, setDobleMapa] = useState("col-12")

    //Estados para el modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //Pantalla dividida
    const [pantallaDividida, setPantallaDividida] = useState(false)

    useEffect(() => {
        fetch(`${process.env.ruta}/wa0/lista_capas01`)
            .then(res => res.json())
            .then(
                (data) => construyeCatalogo(data),
                (error) => console.log(error)
            )

    }, [])

    //Al seleccionar y añadir una entidad para el mapa original
    const onSubmit = (data) => {
        let indice = parseInt(data.entidad)
        let capa = datosCapasBackEnd[indice]

        if (capa.tipo == "filtrada") {
            const owsrootUrl = capa.url;
            const defaultParameters1 = {
                service: 'WFS',
                version: '2.0',
                request: 'GetFeature',
                //sedatu:
                typeName: capa.capa,
                outputFormat: 'text/javascript',
                format_options: 'callback:getJson',
                cql_filter: capa.filtro_entidad + "=" + "'" + capa.valor_filtro + "'"
            };
            var parameters1 = L.Util.extend(defaultParameters1);
            var url = owsrootUrl + L.Util.getParamString(parameters1);
            //Hace la petición para traer los datos de la entidad
            $.ajax({
                jsonpCallback: 'getJson',
                url: url,
                dataType: 'jsonp',
                success: function (response) {
                    if (capasVisualizadas.some(capaVisual => capaVisual.num_capa === capa.indice)) {
                        return;
                    }
                    else {
                        response["num_capa"] = capa.indice;
                        response["nom_capa"] = capa.titulo;
                        response["habilitado"] = true;
                        response['tipo'] = "geojson";
                        response['estilos'] = { 'transparencia': 1 };
                        setCapasVisualizadas([...capasVisualizadas, response])
                    }
                }
            });
        }
        else {
            if (capasVisualizadas.some(capaVisual => capaVisual.num_capa === capa.indice)) {
                return;
            }
            else {
                const capaWMS = {};
                //Se guardan los datos de la capa
                capaWMS["attribution"] = "No disponible"
                capaWMS["url"] = capa.url
                capaWMS["layers"] = capa.capa
                capaWMS["format"] = "image/png"
                capaWMS["transparent"] = "true"
                capaWMS["tipo"] = "wms"
                capaWMS["nom_capa"] = capa.titulo;
                capaWMS["num_capa"] = capa.indice;
                capaWMS["habilitado"] = true;
                capaWMS["estilos"] = { 'transparencia': 1 };
                capaWMS["zoomMinimo"] = 0;
                capaWMS["zoomMaximo"] = 18;
                capaWMS["leyenda"] = capa.leyenda;

                setCapasVisualizadas([...capasVisualizadas, capaWMS])
            }
        }
    }

    //Al seleccionar y añadir una entidad para el mapa original
    const onSubmitEspejo = (data) => {
        let indice = parseInt(data.entidad)
        let capa = datosCapasBackEnd[indice]

        if (capa.tipo == "filtrada") {
            const owsrootUrl = capa.url;
            const defaultParameters1 = {
                service: 'WFS',
                version: '2.0',
                request: 'GetFeature',
                //sedatu:
                typeName: capa.capa,
                outputFormat: 'text/javascript',
                format_options: 'callback:getJson',
                cql_filter: capa.filtro_entidad + "=" + "'" + capa.valor_filtro + "'"
            };
            var parameters1 = L.Util.extend(defaultParameters1);
            var url = owsrootUrl + L.Util.getParamString(parameters1);
            //Hace la petición para traer los datos de la entidad
            $.ajax({
                jsonpCallback: 'getJson',
                url: url,
                dataType: 'jsonp',
                success: function (response) {
                    if (capasVisualizadasEspejo.some(capaVisual => capaVisual.num_capa === capa.indice)) {
                        return;
                    }
                    else {
                        response["num_capa"] = capa.indice;
                        response["nom_capa"] = capa.titulo;
                        response["habilitado"] = true;
                        response['tipo'] = "geojson";
                        response['estilos'] = { 'transparencia': 1 };
                        setCapasVisualizadasEspejo([...capasVisualizadasEspejo, response])
                    }
                }
            });
        }
        else {
            if (capasVisualizadasEspejo.some(capaVisual => capaVisual.num_capa === capa.indice)) {
                return;
            }
            else {
                const capaWMS = {};
                //Se guardan los datos de la capa
                capaWMS["attribution"] = "No disponible"
                capaWMS["url"] = capa.url
                capaWMS["layers"] = capa.capa
                capaWMS["format"] = "image/png"
                capaWMS["transparent"] = "true"
                capaWMS["tipo"] = "wms"
                capaWMS["nom_capa"] = capa.titulo;
                capaWMS["num_capa"] = capa.indice;
                capaWMS["habilitado"] = true;
                capaWMS["estilos"] = { 'transparencia': 1 };
                capaWMS["zoomMinimo"] = 0;
                capaWMS["zoomMaximo"] = 18;
                capaWMS["leyenda"] = capa.leyenda;
                setCapasVisualizadasEspejo([...capasVisualizadasEspejo, capaWMS])

            }
        }
    }

    //Funcion para cambiar el estado del checkbox
    const cambiaCheckbox = ({ target }, mapa) => {
        let mapaBase;
        if (mapa == 0) {
            mapaBase = capasVisualizadas;
        } else if (mapa == 1) {
            mapaBase = capasVisualizadasEspejo;
        }
        //Hace copia a otro arreglo para volver a sobreescribir capasVisualizadas
        let capasVisualisadasActualizado = mapaBase.map((valor) => {
            //Si es igual a la entidad que se envia, se cambia el checkbox
            if (valor.num_capa == target.value) {
                //Si esta habilitado se desabilita, de manera igual en caso contrario
                if (valor.habilitado) {
                    valor.habilitado = false;
                    return valor;
                }
                else {
                    valor.habilitado = true;
                    return valor;
                }
            }
            //Si no es igual a la entidad que se envia, se envia con los mismos valores
            else {
                return valor;
            }
        });
        if (mapa == 0) {
            setCapasVisualizadas(capasVisualisadasActualizado);
        } else if (mapa == 1) {
            setCapasVisualizadasEspejo(capasVisualisadasActualizado);
        }
    }

    const [valorTransparencia, setValorTransparencia] = useState(1)
    const transparenciaCapas = ({ target }, mapa) => {
        let mapaBase;
        if (mapa == 0) {
            mapaBase = capasVisualizadas;
        } else if (mapa == 1) {
            mapaBase = capasVisualizadasEspejo;
        }
        //Hace copia a otro arreglo para volver a sobreescribir capasVisualizadas
        let capasVisualisadasActualizado = mapaBase.map((valor) => {
            //Si es igual a la entidad que se envia, se cambia la transparencia
            if (valor.num_capa == target.name) {
                valor.estilos.transparencia = target.value
                return valor;
            }
            // Si no es igual a la entidad que se envia, se envia con los mismos valores
            else {
                return valor;
            }
        });
        if (mapa == 0) {
            setCapasVisualizadas(capasVisualisadasActualizado);
        } else if (mapa == 1) {
            setCapasVisualizadasEspejo(capasVisualisadasActualizado);
        }
    }

    const zoomMinMax = ({ target }, mapa) => {
        let mapaBase;
        if (mapa == 0) {
            mapaBase = capasVisualizadas;
        } else if (mapa == 1) {
            mapaBase = capasVisualizadasEspejo;
        }
        let capasVisualisadasActualizado = mapaBase.map((valor) => {
            //Si es igual a la entidad que se envia, se cambia el zoom
            if (valor.num_capa == target.name) {
                if (target.dataset.zoom == "min") {
                    valor.zoomMinimo = target.value
                } else if (target.dataset.zoom == "max") {
                    valor.zoomMaximo = target.value
                }
                return valor;
            }
            // Si no es igual a la entidad que se envia, se envia con los mismos valores
            else {
                return valor;
            }
        });
        if (mapa == 0) {
            setCapasVisualizadas(capasVisualisadasActualizado);
        } else if (mapa == 1) {
            setCapasVisualizadasEspejo(capasVisualisadasActualizado)
        }
    }

    //Funcion para ordenar los nuevos datos
    function handleOnDragEnd(result) {
        // Si el destino existe, esto es para evitar cuando se arrastra fuera del contenedor
        if (!result.destination) {
            return
        }
        // Se crea una copia de capasVisualizadas
        let items = Array.from(capasVisualizadas)
        // Lo eliminamos de acuerdo al index que le pasa
        let [reorderedItem] = items.splice(result.source.index, 1)
        // Se usa destination.index para agregar ese valor a su nuevo destino
        items.splice(result.destination.index, 0, reorderedItem)
        // Actualizamos datos entidades
        setCapasVisualizadas(items)
    }

    function handleOnDragEndEspejo(result) {
        if (!result.destination) {
            return
        }
        let items = Array.from(capasVisualizadasEspejo)
        let [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)
        setCapasVisualizadasEspejo(items)
    }

    function construyeCatalogo(capasBackEnd) {
        //Para guardar la información de las capas que viene desde el backend, sirve como arreglo temporal
        var catalogoCapas = [];
        //Para guardar las capas que sean de entidades
        let capaEstatal = null;
        capasBackEnd["catalogo"].map(value => {
            // Si el valor es igual a la capa de entidades
            if (value.titulo == "Limite Municipal") {
                capaEstatal = value;
                return;
            }
        })
        if (capaEstatal != null) {
            for (let i = 0; i < 32; i++) {
                let capa = {};
                capa.titulo = "Municipios de " + catalogoEntidades[i].entidad;
                capa.url = capaEstatal.url;
                capa.capa = capaEstatal.capa;
                capa.filtro_entidad = capaEstatal.filtro_entidad;
                capa.tipo = "filtrada";
                capa.valor_filtro = catalogoEntidades[i].id;
                capa.wfs = capaEstatal.wfs;
                capa.wms = capaEstatal.wms;
                capa.indice = catalogoCapas.length;
                catalogoCapas.push(capa);
            }
        }
        //Se recorre otra vez el arreglo de capas de back end para ahora agregar todas las capas Wms
        capasBackEnd["catalogo"].map(value => {
            if (value.titulo != "Limite Municipal") {
                value.tipo = "mosaico"
                value.indice = catalogoCapas.length;
                catalogoCapas.push(value)
            }
        })
        //Se agrega a datos capas que es el arreglo que se va a recorrer para mostrar en el input
        setDatosCapasBackEnd(catalogoCapas);
    }

    function dividirPantalla() {
        if (pantallaDividida == true) {
            setPantallaDividida(false)
            setDobleMapa("col-12")
        } else {
            setPantallaDividida(true)
            setDobleMapa("col-6")
        }
    }

    function agregarCapas() {
        setShow(true);
    }

    //Mapa original
    const [nombreMapa, setNombreMapa] = useState("Titulo del mapa")
    const [muestraEditarNombreMapa, setmuestraEditarNombreMapa] = useState(true)
    //Mapa espejo
    const [nombreMapaEspejo, setNombreMapaEspejo] = useState("Titulo del mapa")
    const [muestraEditarNombreMapaEspejo, setmuestraEditarNombreMapaEspejo] = useState(true)

    function cambiaNombreMapa(e, mapa) {
        if (mapa == 0) {
            setNombreMapa(e.target.value)
        } else if (mapa == 1) {
            setNombreMapaEspejo(e.target.value)
        }

    }

    function menuContextual(e, data) {
        console.log(e);
    }

    function consultar() {
        console.log("consultar");
        handleClose();
    }

    function agregar() {
        console.log("agregar");
        handleClose();
    }

    function limpiar() {
        console.log("limpiar");
        handleClose();
    }

    // const { createSliderWithTooltip } = Slider;
    // const Range = createSliderWithTooltip(Slider.Range);
    // const { Handle } = Slider;

    // const handle = props => {
    //     const { value, dragging, index, ...restProps } = props;
    //     return (
    //         <SliderTooltip
    //             prefixCls="rc-slider-tooltip"
    //             overlay={`${value} %`}
    //             visible={dragging}
    //             placement="top"
    //             key={index}
    //         >
    //             <Handle value={value} {...restProps} />
    //         </SliderTooltip>
    //     );
    // };

    return (
        <>


            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Búsqueda de capas</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Listas:</p>
                    <ul>
                        <li>Temática</li>
                        <li>Cobertura territorial</li>
                        <ul>
                            <li>Estado</li>
                            <li>Municipio</li>
                            <li>Localidad</li>
                            <li>Colonia</li>
                            <li>Clave catastral</li>
                            <li>SUN</li>
                            <li>Zona metropolitana</li>
                            <li>AGEB</li>
                        </ul>
                    </ul>
                    <p>Filtros</p>
                    <ul>
                        <li>Metadatos</li>
                    </ul>
                    <p>Tabla</p>
                    <p>
                        <label>
                            <input type="checkbox" value="a" />
                        Resultado de la búsqueda
                    </label>
                    </p>
                    <p>
                        <label>
                            <input type="checkbox" value="b" />
                        Capas a agregar
                    </label>
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={consultar}>Consultar</Button>
                    <Button variant="primary" onClick={agregar}>Agregar capas</Button>
                    <Button variant="primary" onClick={limpiar}>Limpiar campos</Button>
                </Modal.Footer>
            </Modal>

            {/* <ContextMenuTrigger id="same_unique_identifier">
                <div className="well">Right click to see the menu</div>
            </ContextMenuTrigger>

            <ContextMenu id="same_unique_identifier">
                <MenuItem data={{ foo: 'bar' }} onClick={menuContextual}>
                    ContextMenu Item 1
                    </MenuItem>
                <MenuItem data={{ foo: 'bar' }} onClick={menuContextual}>
                    ContextMenu Item 2
                    </MenuItem>
                <MenuItem divider />
                <MenuItem data={{ foo: 'bar' }} onClick={menuContextual}>
                    ContextMenu Item 3
                    </MenuItem>
            </ContextMenu> */}

            <div className="main">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <button className="btn-analisis" onClick={dividirPantalla}>Pantalla dividida</button>
                        </div>

                        <div className={dobleMapa}>
                            <div className="row">
                                <div className="col-12 tw-text-center">
                                    <p>
                                        {nombreMapa}
                                        <OverlayTrigger overlay={<Tooltip>Editar nombre</Tooltip>}>
                                            <FontAwesomeIcon className="tw-ml-4 tw-cursor-pointer" onClick={() => setmuestraEditarNombreMapa(false)} icon={faEdit}></FontAwesomeIcon>
                                        </OverlayTrigger>
                                    </p>
                                    <input type="text" hidden={muestraEditarNombreMapa} onChange={(event) => cambiaNombreMapa(event, 0)} value={nombreMapa}></input>
                                    <OverlayTrigger overlay={<Tooltip>Finalizar edición</Tooltip>}>
                                        <FontAwesomeIcon className="tw-ml-4 tw-cursor-pointer" hidden={muestraEditarNombreMapa} onClick={() => setmuestraEditarNombreMapa(true)} icon={faCheck}></FontAwesomeIcon>
                                    </OverlayTrigger>
                                </div>

                                <div className="col-6">
                                    <p>Capas</p>
                                    <Form className="row" onSubmit={handleSubmit(onSubmit)}>
                                        <Form.Group className="col-9 tw-mb-0" controlId="entidad">
                                            {/* <Form.Label className="tw-font-bold">Capas</Form.Label> */}
                                            <Form.Control as="select" name="entidad" required ref={register}>
                                                <option value=""></option>
                                                {
                                                    datosCapasBackEnd.map((value, index) => {
                                                        return (
                                                            <option key={index} value={value.indice}>{value.titulo}</option>
                                                        )
                                                    })
                                                }
                                            </Form.Control>
                                        </Form.Group>
                                        <button className="btn-analisis col-3" type="submit">AGREGAR
                                        </button>
                                    </Form>
                                </div>

                                <div className="col-12 tw-mt-8">
                                    <Accordion>
                                        <Card>
                                            <Card.Header className="tw-pointer-events-none">Capas</Card.Header>
                                        </Card>
                                        {/* onDragEnd se ejecuta cuando alguien deje de arrastrar un elemento */}
                                        <DragDropContext onDragEnd={handleOnDragEnd}>
                                            <Droppable droppableId="entidades">
                                                {(provided) => (
                                                    // La referencia es para acceder al elemento html, droppableProps permite realizar un seguimiento de los cambios
                                                    <div {...provided.droppableProps} ref={provided.innerRef}> {
                                                        capasVisualizadas.map((capa, index) => (
                                                            <Draggable key={capa.num_capa} draggableId={capa.nom_capa} index={index}>
                                                                {(provided) => (
                                                                    <Card {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                                        <Card.Header>
                                                                            <Accordion.Toggle as={Button} variant="link" eventKey={capa.num_capa.toString()}>
                                                                                <FontAwesomeIcon icon={faAngleDown} />
                                                                            </Accordion.Toggle>
                                                                            <Form.Group className="tw-inline-block">
                                                                                <Form.Check type="checkbox" defaultChecked={capa.habilitado} label={capa.nom_capa} onChange={(event) => cambiaCheckbox(event, 0)} value={capa.num_capa} />
                                                                            </Form.Group>
                                                                        </Card.Header>
                                                                        <Accordion.Collapse eventKey={capa.num_capa.toString()}>
                                                                            <Card.Body>
                                                                                <Form.Group>
                                                                                    <Form.Label>Transparencia</Form.Label>
                                                                                    <div className="tw-flex">
                                                                                        <span className="tw-mr-6">+</span>
                                                                                        <Form.Control custom type="range" min="0" step="0.1" max="1" defaultValue="1" name={capa.num_capa} onChange={(event) => transparenciaCapas(event, 0)} />
                                                                                        <span className="tw-ml-6">-</span>
                                                                                    </div>
                                                                                </Form.Group>
                                                                                {capa.tipo == "wms" &&
                                                                                    (
                                                                                        <div className="row">
                                                                                            <Form.Group className="col-6">
                                                                                                <Form.Label>Escala minima</Form.Label>
                                                                                                <Form.Control defaultValue="0" as="select" onChange={(event) => zoomMinMax(event, 0)} name={capa.num_capa} data-zoom="min">
                                                                                                    <option value="0">1:10000 KM</option>
                                                                                                    <option value="1">1:5000 KM</option>
                                                                                                    <option value="2">1:2000 KM</option>
                                                                                                    <option value="3">1:1000 KM</option>
                                                                                                    <option value="4">1:500 KM</option>
                                                                                                    <option value="5">1:300 KM</option>
                                                                                                    <option value="6">1:200 KM</option>
                                                                                                    <option value="7">1:100 KM</option>
                                                                                                    <option value="8">1:50 KM</option>
                                                                                                    <option value="9">1:20 KM</option>
                                                                                                    <option value="10">1:10 KM</option>
                                                                                                    <option value="11">1:5 KM</option>
                                                                                                    <option value="12">1:3 KM</option>
                                                                                                    <option value="13">1:1 KM</option>
                                                                                                    <option value="14">1:500 M</option>
                                                                                                    <option value="15">1:300 M</option>
                                                                                                    <option value="16">1:200 M</option>
                                                                                                    <option value="17">1:100 M</option>
                                                                                                    <option value="18">1:50 M</option>
                                                                                                </Form.Control>
                                                                                            </Form.Group>
                                                                                            <Form.Group className="col-6">
                                                                                                <Form.Label>Escala maxima</Form.Label>
                                                                                                <Form.Control defaultValue="18" as="select" onChange={(event) => zoomMinMax(event, 0)} name={capa.num_capa} data-zoom="max">
                                                                                                    <option value="0">1:10000 KM</option>
                                                                                                    <option value="1">1:5000 KM</option>
                                                                                                    <option value="2">1:2000 KM</option>
                                                                                                    <option value="3">1:1000 KM</option>
                                                                                                    <option value="4">1:500 KM</option>
                                                                                                    <option value="5">1:300 KM</option>
                                                                                                    <option value="6">1:200 KM</option>
                                                                                                    <option value="7">1:100 KM</option>
                                                                                                    <option value="8">1:50 KM</option>
                                                                                                    <option value="9">1:20 KM</option>
                                                                                                    <option value="10">1:10 KM</option>
                                                                                                    <option value="11">1:5 KM</option>
                                                                                                    <option value="12">1:3 KM</option>
                                                                                                    <option value="13">1:1 KM</option>
                                                                                                    <option value="14">1:500 M</option>
                                                                                                    <option value="15">1:300 M</option>
                                                                                                    <option value="16">1:200 M</option>
                                                                                                    <option value="17">1:100 M</option>
                                                                                                    <option value="18">1:50 M</option>
                                                                                                </Form.Control>
                                                                                            </Form.Group>
                                                                                        </div>
                                                                                    )}
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                )}
                                                            </Draggable>
                                                        ))
                                                    }
                                                        {/* Se usa para llenar el espacio que ocupaba el elemento que estamos arrastrando */}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </DragDropContext>
                                    </Accordion>
                                </div>



                                <div className="col-12 tw-mt-8">
                                    <div className="tw-mb-4 tw-inline-block">
                                        {/* <OverlayTrigger overlay={<Tooltip>Agregar capas</Tooltip>}>
                                            <FontAwesomeIcon className="tw-cursor-pointer tw-mr-5 tw-text-3xl" onClick={agregarCapas} icon={faPlus}></FontAwesomeIcon>
                                        </OverlayTrigger>
                                        <OverlayTrigger overlay={<Tooltip>Subir información</Tooltip>}>
                                            <FontAwesomeIcon className="tw-cursor-pointer tw-mr-5 tw-text-3xl" icon={faUpload}></FontAwesomeIcon>
                                        </OverlayTrigger>
                                        <OverlayTrigger overlay={<Tooltip>Descargar información</Tooltip>}>
                                            <FontAwesomeIcon className="tw-cursor-pointer tw-mr-5 tw-text-3xl" icon={faDownload}></FontAwesomeIcon>
                                        </OverlayTrigger>
                                        <OverlayTrigger overlay={<Tooltip>Guardar información</Tooltip>}>
                                            <FontAwesomeIcon className="tw-cursor-pointer tw-mr-5 tw-text-3xl" icon={faSave}></FontAwesomeIcon>
                                        </OverlayTrigger> */}
                                    </div>
                                    <Map datos={capasVisualizadas} botones={true} />

                                </div>
                            </div>
                        </div>

                        {
                            pantallaDividida &&
                            <div className="col-6">
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
                                        <Form onSubmit={handleSubmit1(onSubmitEspejo)}>
                                            <Form.Group controlId="entidad">
                                                <Form.Label className="tw-text-red-600">Capas</Form.Label>
                                                <Form.Control as="select" name="entidad" required ref={register1}>
                                                    <option value=""></option>
                                                    {
                                                        datosCapasBackEnd.map((value, index) => {
                                                            return (
                                                                <option key={index} value={value.indice}>{value.titulo}</option>
                                                            )
                                                        })
                                                    }
                                                </Form.Control>
                                            </Form.Group>
                                            <input type="submit" value="Agregar" />
                                        </Form>
                                    </div>
                                    <div className="col-12 tw-mt-8">
                                        <Card>
                                            <Card.Header>Capas</Card.Header>
                                            <DragDropContext onDragEnd={handleOnDragEndEspejo}>
                                                <Droppable droppableId="entidades-espejo">
                                                    {(provided) => (
                                                        <ListGroup {...provided.droppableProps} ref={provided.innerRef}> {
                                                            capasVisualizadasEspejo.map((capa, index) => (
                                                                <Draggable key={capa.num_capa} draggableId={capa.nom_capa + " espejo"} index={index}>
                                                                    {(provided) => (
                                                                        <ListGroup.Item {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                                            <div className="row">
                                                                                <Form.Group className="col-6">
                                                                                    <Form.Check type="checkbox" defaultChecked={capa.habilitado} label={capa.nom_capa} onChange={(event) => cambiaCheckbox(event, 1)} value={capa.num_capa} />
                                                                                </Form.Group>
                                                                                <Form.Group className="col-6">
                                                                                    <Form.Label>Transparencia</Form.Label>
                                                                                    <div className="tw-flex">
                                                                                        <span className="tw-mr-6">+</span>
                                                                                        <Form.Control custom type="range" min="0" step="0.1" max="1" defaultValue="1" name={capa.num_capa} onChange={(event) => transparenciaCapas(event, 1)} />
                                                                                        <span className="tw-ml-6">-</span>
                                                                                    </div>
                                                                                </Form.Group>
                                                                                {capa.tipo == "wms" &&
                                                                                    (
                                                                                        <>
                                                                                            <Form.Group className="col-6">
                                                                                                <Form.Label>Escala minima</Form.Label>
                                                                                                <Form.Control defaultValue="0" as="select" onChange={(event) => zoomMinMax(event, 1)} name={capa.num_capa} data-zoom="min">
                                                                                                    <option value="0">1:10000 KM</option>
                                                                                                    <option value="1">1:5000 KM</option>
                                                                                                    <option value="2">1:2000 KM</option>
                                                                                                    <option value="3">1:1000 KM</option>
                                                                                                    <option value="4">1:500 KM</option>
                                                                                                    <option value="5">1:300 KM</option>
                                                                                                    <option value="6">1:200 KM</option>
                                                                                                    <option value="7">1:100 KM</option>
                                                                                                    <option value="8">1:50 KM</option>
                                                                                                    <option value="9">1:20 KM</option>
                                                                                                    <option value="10">1:10 KM</option>
                                                                                                    <option value="11">1:5 KM</option>
                                                                                                    <option value="12">1:3 KM</option>
                                                                                                    <option value="13">1:1 KM</option>
                                                                                                    <option value="14">1:500 M</option>
                                                                                                    <option value="15">1:300 M</option>
                                                                                                    <option value="16">1:200 M</option>
                                                                                                    <option value="17">1:100 M</option>
                                                                                                    <option value="18">1:50 M</option>
                                                                                                </Form.Control>
                                                                                            </Form.Group>
                                                                                            <Form.Group className="col-6">
                                                                                                <Form.Label>Escala maxima</Form.Label>
                                                                                                <Form.Control defaultValue="18" as="select" onChange={(event) => zoomMinMax(event, 1)} name={capa.num_capa} data-zoom="max" data-mapa="1">
                                                                                                    <option value="0">1:10000 KM</option>
                                                                                                    <option value="1">1:5000 KM</option>
                                                                                                    <option value="2">1:2000 KM</option>
                                                                                                    <option value="3">1:1000 KM</option>
                                                                                                    <option value="4">1:500 KM</option>
                                                                                                    <option value="5">1:300 KM</option>
                                                                                                    <option value="6">1:200 KM</option>
                                                                                                    <option value="7">1:100 KM</option>
                                                                                                    <option value="8">1:50 KM</option>
                                                                                                    <option value="9">1:20 KM</option>
                                                                                                    <option value="10">1:10 KM</option>
                                                                                                    <option value="11">1:5 KM</option>
                                                                                                    <option value="12">1:3 KM</option>
                                                                                                    <option value="13">1:1 KM</option>
                                                                                                    <option value="14">1:500 M</option>
                                                                                                    <option value="15">1:300 M</option>
                                                                                                    <option value="16">1:200 M</option>
                                                                                                    <option value="17">1:100 M</option>
                                                                                                    <option value="18">1:50 M</option>
                                                                                                </Form.Control>
                                                                                            </Form.Group>
                                                                                        </>
                                                                                    )}
                                                                            </div>
                                                                        </ListGroup.Item>
                                                                    )}
                                                                </Draggable>
                                                            ))
                                                        }
                                                            {provided.placeholder}
                                                        </ListGroup>
                                                    )}
                                                </Droppable>
                                            </DragDropContext>
                                        </Card>
                                    </div>
                                    <div className="col-12 tw-mt-8">
                                        <Map datos={capasVisualizadasEspejo} />
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}