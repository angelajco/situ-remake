import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { Form } from 'react-bootstrap'
import { DragDropContext, Droppable, Draggable, resetServerContext } from 'react-beautiful-dnd'

import dynamic from 'next/dynamic'
import axios from 'axios'
import $ from 'jquery'

import Router from 'next/router'

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

    //Para guardar los datos del geojson
    const [datosEntidades, setDatosEntidades] = useState([])
    //Para guardar los datos de la capa
    const [datosCapasWms, setDatosCapasWms] = useState([])

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
                (data) => setDatosCapasWms(data),
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
        var split = data.entidad.split("|");
        //Parametros para hacer una peticion a la IDE
        const numEntidad = split[0];
        const nombreEntidad = split[1];

        //Si es la capa
        if (numEntidad > 32) {
            //Arreglo para guardar los datos de la capa
            const capaWMS = {};
            //Se guardan los datos de la capa
            capaWMS["attribution"] = 'Localidades Urbanas (Miguel Angel Ferrer Martinez)'
            capaWMS["url"] = "https://ide.sedatu.gob.mx:8080/ows"
            capaWMS["layers"] = "geonode:inegi_00l_ua_4326"
            capaWMS["format"] = "image/png"
            capaWMS["transparent"] = "true"
            capaWMS["tipo"] = "wms"
            capaWMS["nom_entidad"] = nombreEntidad;
            capaWMS["num_entidad"] = numEntidad;
            capaWMS["habilitado"] = true;
            capaWMS["filtro"] = "CVE_ENT=30"

            setDatosEntidades([...datosEntidades, capaWMS])
        }
        //Es una entidad
        else {
            const owsrootUrl = 'https://ide.sedatu.gob.mx:8080/ows';
            const defaultParameters1 = {
                service: 'WFS',
                version: '2.0',
                request: 'GetFeature',
                //sedatu:
                typeName: 'geonode:inegi_00mun_4326',
                outputFormat: 'text/javascript',
                format_options: 'callback:getJson',
                cql_filter: 'CVE_ENT=' + numEntidad
            };
            console.log(defaultParameters1);
            var parameters1 = L.Util.extend(defaultParameters1);
            var url = owsrootUrl + L.Util.getParamString(parameters1);
            //Hace la petición para traer los datos de la entidad
            $.ajax({
                jsonpCallback: 'getJson',
                url: url,
                dataType: 'jsonp',
                success: function (response) {
                    response["num_entidad"] = numEntidad;
                    response["nom_entidad"] = nombreEntidad;
                    response["habilitado"] = true;
                    response['tipo'] = "geojson";

                    if (datosEntidades.some(ent => ent.num_entidad === numEntidad)) {
                        return;
                    }
                    else {
                        //Se envian los datos a mapa para que los procese como geojson
                        setDatosEntidades([
                            ...datosEntidades,
                            response
                        ])
                    }
                }
            });
        }
    }

    //Funcion para cambiar el estado del checkbox
    const cambiaCheckbox = (event) => {
        const numeroEntidadChecked = event.target.value;
        //Hace copia a otro arreglo para volver a sobreescribir datosEntidades
        const datosEntidadesActualizado = datosEntidades.map((valor) => {
            //Si es igual a la entidad que se envia, se cambia el checkbox
            if (valor.num_entidad == numeroEntidadChecked) {
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
        setDatosEntidades(datosEntidadesActualizado);
    }

    //Funcion para ordenar los nuevos datos
    function handleOnDragEnd(result) {
        // Si el destino existe, esto es para evitar cuando se arrastra fuera del contenedor
        if (!result.destination) {
            return
        }
        // Se crea una copia de datosEntidades
        const items = Array.from(datosEntidades)
        // Lo eliminamos de acuerdo al index que le pasa
        const [reorderedItem] = items.splice(result.source.index, 1)
        // Se usa destination.index para agregar ese valor a su nuevo destino
        items.splice(result.destination.index, 0, reorderedItem)
        // Actualizamos datos entidades
        setDatosEntidades(items)
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
                                                <option value="24|San Luis Potosí">San Luis Potosí</option>
                                                <option value="26|Sonora">Sonora</option>
                                                <option value="27|Tabasco">Tabasco</option>
                                                <option value="33|Localidades urbanas">Localidades urbanas</option>
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
                                                        datosEntidades.map((capa, index) => (
                                                            <Draggable key={capa.num_entidad} draggableId={capa.num_entidad} index={index}>
                                                                {(provided) => (
                                                                    <Form.Group {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                                        <Form.Check type="checkbox" defaultChecked={capa.habilitado} label={capa.nom_entidad} onChange={cambiaCheckbox} value={capa.num_entidad} />
                                                                    </Form.Group>
                                                                )}
                                                            </Draggable>
                                                        )
                                                        )}
                                                    {/* Se usa para llenar el espacio que ocupaba el elemento que estamos arrastrando */}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </DragDropContext>
                                </div>
                                <div className="col-12">
                                    <Map datos={datosEntidades} />
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