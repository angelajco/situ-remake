import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { Form, Modal, Button } from 'react-bootstrap'
import { DragDropContext, Droppable, Draggable, resetServerContext } from 'react-beautiful-dnd'
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

import Router from 'next/router'
import dynamic from 'next/dynamic'
import axios from 'axios'
import $ from 'jquery'

import catalogoEntidades from "../../shared/jsons/entidades.json";

import Cookies from 'universal-cookie'
const cookies = new Cookies()

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

    //Importa dinámicamente el mapa
    const Map = dynamic(
        () => import('../../components/Map'),
        {
            loading: () => <p>El mapa está cargando</p>,
            ssr: false
        }
    )

    const MapEspejo = dynamic(
        () => import('../../components/Map'),
        {
            loading: () => <p>El mapa está cargando</p>,
            ssr: false
        }
    )

    //Al seleccionar y añadir una entidad para el mapa original
    const onSubmit = (data) => {
        console.log("submitOrigianl", data);
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
                setCapasVisualizadas([...capasVisualizadas, capaWMS])
            }
        }
    }

    //Al seleccionar y añadir una entidad para el mapa original
    const onSubmitEspejo = (data) => {
        console.log("submitEspejo", data);
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
        let capazVisualisadasActualizado = mapaBase.map((valor) => {
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
            setCapasVisualizadas(capazVisualisadasActualizado);
        } else if (mapa == 1) {
            setCapasVisualizadasEspejo(capazVisualisadasActualizado);
        }
    }

    const transparenciaCapas = ({ target }, mapa) => {
        let mapaBase;
        if (mapa == 0) {
            mapaBase = capasVisualizadas;
        } else if (mapa == 1) {
            mapaBase = capasVisualizadasEspejo;
        }
        //Hace copia a otro arreglo para volver a sobreescribir capasVisualizadas
        let capazVisualisadasActualizado = mapaBase.map((valor) => {
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
            setCapasVisualizadas(capazVisualisadasActualizado);
        } else if (mapa == 1) {
            setCapasVisualizadasEspejo(capazVisualisadasActualizado);
        }
    }

    const zoomMinMax = ({ target }) => {
        let capazVisualisadasActualizado = capasVisualizadas.map((valor) => {
            //Si es igual a la entidad que se envia, se cambia el zoom
            if (valor.num_capa == target.name) {
                if (target.dataset.zoom == 0) {
                    valor.zoomMinimo = target.value
                } else {
                    valor.zoomMaximo = target.value
                }
                return valor;
            }
            // Si no es igual a la entidad que se envia, se envia con los mismos valores
            else {
                return valor;
            }
        });
        setCapasVisualizadas(capazVisualisadasActualizado);
    }

    //Funcion para ordenar los nuevos datos
    function handleOnDragEnd(result) {
        console.log(result);
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
        console.log("espejo");
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
    const [nombreMapa, setNombreMapa] = useState("Titulo mapa")
    const [muestraEditarNombreMapa, setmuestraEditarNombreMapa] = useState(true)
    //Mapa espejo
    const [nombreMapaEspejo, setNombreMapaEspejo] = useState("Titulo mapa")
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
                    <Button variant="primary" onClick={limpiar}>Limpiar camps</Button>
                </Modal.Footer>
            </Modal>



            <ContextMenuTrigger id="same_unique_identifier">
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
            </ContextMenu>


            <div className="main">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <button onClick={dividirPantalla}>Pantalla dividida</button>
                        </div>
                        <div className={dobleMapa}>
                            <div className="row">
                                <div className="col-12">
                                    <Form onSubmit={handleSubmit(onSubmit)}>
                                        <Form.Group controlId="entidad">
                                            <Form.Label className="tw-text-red-600">Entidad</Form.Label>
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
                                        <input type="hidden" name="mapa" value={0} ref={register} />
                                        <input type="submit" />
                                    </Form>
                                </div>
                                <div className="col-12">
                                    <p>Capas</p>
                                    {/* onDragEnd se ejecuta cuando alguien deje de arrastrar un elemento */}
                                    <DragDropContext onDragEnd={handleOnDragEnd}>
                                        <Droppable droppableId="entidades">
                                            {(provided) => (
                                                // La referencia es para acceder al elemento html, droppableProps permite realizar un seguimiento de los cambios
                                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                                    {
                                                        capasVisualizadas.map((capa, index) => (
                                                            <Draggable key={capa.num_capa} draggableId={capa.nom_capa} index={index}>
                                                                {(provided) => (
                                                                    <>
                                                                        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} className="row">
                                                                            <Form.Group className="col-6">
                                                                                <Form.Check type="checkbox" defaultChecked={capa.habilitado} label={capa.nom_capa} onChange={(event) => cambiaCheckbox(event, 0)} value={capa.num_capa} />
                                                                            </Form.Group>
                                                                            <Form.Group className="col-6">
                                                                                <Form.Label>Transparencia</Form.Label>
                                                                                <Form.Control type="range" min="0" step="0.1" max="1" defaultValue="1" name={capa.num_capa} onChange={(event) => transparenciaCapas(event, 0)} />
                                                                            </Form.Group>
                                                                            {capa.tipo == "wms" &&
                                                                                (
                                                                                    <>
                                                                                        <Form.Group className="col-6">
                                                                                            <Form.Label>Zoom minimo</Form.Label>
                                                                                            <Form.Control type="range" min="0" step="1" max="18" defaultValue="0" name={capa.num_capa} data-zoom="0" onChange={zoomMinMax} />
                                                                                        </Form.Group>
                                                                                        <Form.Group className="col-6">
                                                                                            <Form.Label>Zoom máximo</Form.Label>
                                                                                            <Form.Control type="range" min="0" step="1" max="18" defaultValue="18" name={capa.num_capa} data-zoom="1" onChange={zoomMinMax} />
                                                                                        </Form.Group>
                                                                                    </>
                                                                                )}
                                                                        </div>
                                                                    </>
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
                                </div>
                                <div className="col-12">
                                    <p>{nombreMapa}</p>
                                    <div>
                                        <button onClick={agregarCapas}>Agregar Capas (botón “+”)</button>
                                        <button onClick={() => setmuestraEditarNombreMapa(false)}>Edición (nombre mapa)</button>
                                        <input type="text" hidden={muestraEditarNombreMapa} onChange={(event) => cambiaNombreMapa(event, 0)} value={nombreMapa}></input>
                                        <button hidden={muestraEditarNombreMapa} onClick={() => setmuestraEditarNombreMapa(true)}>Finalizar edición</button>
                                        <button>Cargar información.</button>
                                        <button>Descargar información.</button>
                                        <button>Guardar proyecto.</button>
                                        <button>Análisis espacial simple.</button>
                                        <button>Sistema de coordenadas</button>
                                        <button>Vista anterior</button>
                                        <button>Vista posterior</button>
                                    </div>
                                    <Map datos={capasVisualizadas} />
                                </div>
                            </div>
                        </div>

                        {
                            pantallaDividida &&
                            (
                                <>
                                    <div className="col-6">
                                        <div className="row">
                                            <div className="col-12">
                                                <Form onSubmit={handleSubmit1(onSubmitEspejo)}>
                                                    <Form.Group controlId="entidad">
                                                        <Form.Label className="tw-text-red-600">Entidad</Form.Label>
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
                                                    <input type="hidden" name="mapa" value={1} ref={register1} />
                                                    <input type="submit" />
                                                </Form>
                                            </div>
                                            <div className="col-12">
                                                <p>Capas</p>
                                                <DragDropContext onDragEnd={handleOnDragEndEspejo}>
                                                    <Droppable droppableId="entidades-espejo">
                                                        {(provided) => (
                                                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                                                {
                                                                    capasVisualizadasEspejo.map((capa, index) => (
                                                                        <Draggable key={capa.num_capa} draggableId={capa.nom_capa + " espejo"} index={index}>
                                                                            {(provided) => (
                                                                                <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} className="row">
                                                                                    <Form.Group className="col-6">
                                                                                        <Form.Check type="checkbox" defaultChecked={capa.habilitado} label={capa.nom_capa} onChange={(event) => cambiaCheckbox(event, 1)} value={capa.num_capa} />
                                                                                    </Form.Group>
                                                                                    {/* <Form.Group className="col-6">
                                                                                        <Form.Label>Transparencia</Form.Label>
                                                                                        <Form.Control type="range" min="0" step="0.1" max="1" defaultValue="1" name={capa.num_capa} onChange={(event) => transparenciaCapas(event, 1)}/>
                                                                                    </Form.Group>
                                                                                    {capa.tipo == "wms" &&
                                                                                        (
                                                                                            <>
                                                                                                <Form.Group className="col-6">
                                                                                                    <Form.Label>Zoom minimo</Form.Label>
                                                                                                    <Form.Control type="range" min="0" step="1" max="18" defaultValue="0" name={capa.num_capa} data-zoom="0" onChange={zoomMinMax} />
                                                                                                </Form.Group>
                                                                                                <Form.Group className="col-6">
                                                                                                    <Form.Label>Zoom máximo</Form.Label>
                                                                                                    <Form.Control type="range" min="0" step="1" max="18" defaultValue="18" name={capa.num_capa} data-zoom="1" onChange={zoomMinMax} />
                                                                                                </Form.Group>
                                                                                            </>
                                                                                        )} */}
                                                                                </div>
                                                                            )}
                                                                        </Draggable>
                                                                    ))
                                                                }
                                                                {provided.placeholder}
                                                            </div>
                                                        )}
                                                    </Droppable>
                                                </DragDropContext>
                                            </div>
                                            <div className="col-12">
                                                <p>{nombreMapaEspejo}</p>
                                                <div>
                                                    <button onClick={agregarCapas}>Agregar Capas (botón “+”)</button>
                                                    <button onClick={() => setmuestraEditarNombreMapaEspejo(false)}>Edición (nombre mapa)</button>
                                                    <input type="text" hidden={muestraEditarNombreMapaEspejo} onChange={(event) => cambiaNombreMapa(event, 1)} value={nombreMapaEspejo}></input>
                                                    <button hidden={muestraEditarNombreMapaEspejo} onClick={() => setmuestraEditarNombreMapaEspejo(true)}>Finalizar edición</button>
                                                    <button>Cargar información.</button>
                                                    <button>Descargar información.</button>
                                                    <button>Guardar proyecto.</button>
                                                    <button>Análisis espacial simple.</button>
                                                    <button>Sistema de coordenadas</button>
                                                    <button>Vista anterior</button>
                                                    <button>Vista posterior</button>
                                                </div>
                                                <MapEspejo datos={capasVisualizadasEspejo} />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}