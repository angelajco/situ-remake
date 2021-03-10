import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { Form } from 'react-bootstrap'
import { DragDropContext, Droppable, Draggable, resetServerContext } from 'react-beautiful-dnd'

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

    // Estado para guardar el web token que se pide a la API
    const [tokenSesion, setTokenSesion] = useState(false)
    // Guarda el token que viene en la cookie para verificar que la tenga
    const tokenCookie = cookies.get('SessionToken')


    //Importar dinamicamente el loader
    const Loader = dynamic(() => import('../../components/Loader'));

    //Acciones del formulario
    const { register, handleSubmit } = useForm();

    //Para guardar las capas que se van a mostrar
    const [capasVisualizadas, setCapasVisualizadas] = useState([])
    //Para guardar los datos de la capas
    const [datosCapas, setDatosCapas] = useState([])

    useEffect(() => {
        if (tokenCookie != undefined) {
            // Configuracion para verificar el token
            var config = {
                method: 'get',
                url: `${process.env.ruta}/wa/prot/acceso`,
                headers: {
                    'Authorization': `Bearer ${tokenCookie}`
                },
            };
            axios(config)
                .then(function (response) {
                    setTokenSesion(response.data['success-boolean'])
                })
                .catch(function (error) {
                    console.log(error)
                    cookies.remove('SessionToken', { path: "/" })
                    Router.push("/administracion/inicio-sesion")
                })
        }
        else {
            Router.push('/administracion/inicio-sesion')
        }

        fetch(`${process.env.ruta}/wa0/lista_capas01`)
            .then(res => res.json())
            .then(
                (data) => construyeCatalogo(data),
                (error) => console.log(error)
            )

    }, [tokenCookie])

    //Importa dinámicamente el mapa
    const Map = dynamic(
        () => import('../../components/Map'),
        {
            loading: () => <p>El mapa está cargando</p>,
            ssr: false
        }
    )

    //Al seleccionar y añadir una entidad
    const onSubmit = (data) => {
        let indice = parseInt(data.entidad)
        let capa = datosCapas[indice]

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
                    console.log(capasVisualizadas)
                    if (capasVisualizadas.some(capaVisual => capaVisual.num_capa === capa.indice)) {
                        return;
                    }
                    else {
                        response["num_capa"] = capa.indice;
                        response["nom_capa"] = capa.titulo;
                        response["habilitado"] = true;
                        response['tipo'] = "geojson";

                        //Se envian los datos a mapa para que los procese como geojson
                        setCapasVisualizadas([
                            ...capasVisualizadas,
                            response
                        ])
                    }
                }
            });
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

            setCapasVisualizadas([...capasVisualizadas, capaWMS])
        }
    }

    //Funcion para cambiar el estado del checkbox
    const cambiaCheckbox = (event) => {
        const numeroEntidadChecked = event.target.value;
        //Hace copia a otro arreglo para volver a sobreescribir capasVisualizadas
        const capazVisualisadasActualizado = capasVisualizadas.map((valor) => {
            //Si es igual a la entidad que se envia, se cambia el checkbox
            if (valor.num_capa == numeroEntidadChecked) {
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
        setCapasVisualizadas(capazVisualisadasActualizado);
    }

    //Funcion para ordenar los nuevos datos
    function handleOnDragEnd(result) {
        // Si el destino existe, esto es para evitar cuando se arrastra fuera del contenedor
        if (!result.destination) {
            return
        }
        // Se crea una copia de capasVisualizadas
        const items = Array.from(capasVisualizadas)
        // Lo eliminamos de acuerdo al index que le pasa
        const [reorderedItem] = items.splice(result.source.index, 1)
        // Se usa destination.index para agregar ese valor a su nuevo destino
        items.splice(result.destination.index, 0, reorderedItem)
        // Actualizamos datos entidades
        setCapasVisualizadas(items)
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
        setDatosCapas(catalogoCapas);
    }

    return (
        <>
            {
                tokenSesion
                    ?
                    (
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <div>Informacion de rasgos</div>
                                    <Form onSubmit={handleSubmit(onSubmit)}>
                                        <Form.Group controlId="entidad">
                                            <Form.Label className="tw-text-red-600">Entidad</Form.Label>
                                            <Form.Control as="select" name="entidad" required ref={register}>
                                                <option value=""></option>
                                                {
                                                    datosCapas.map((value, index) => {
                                                        return (
                                                            <option key={index} value={value.indice}>{value.titulo}</option>
                                                        )
                                                    })
                                                }
                                            </Form.Control>
                                        </Form.Group>
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
                                                                    <Form.Group {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                                        <Form.Check type="checkbox" defaultChecked={capa.habilitado} label={capa.nom_capa} onChange={cambiaCheckbox} value={capa.num_capa} />
                                                                    </Form.Group>
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
                                    <Map datos={capasVisualizadas} />
                                </div>
                            </div>
                        </div>
                    )
                    :
                    (typeof window !== 'undefined') &&
                    (
                        <Loader />
                    )
            }
        </>
    )
}