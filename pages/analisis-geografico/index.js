import Footer from '../../components/Footer'
import Header from '../../components/Header'
import Menu from '../../components/Menu'
import axios from 'axios'
import { useState } from "react"
import { useForm } from "react-hook-form";
import { Form, Container } from 'react-bootstrap'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import dynamic from 'next/dynamic'
import $ from 'jquery'

import Cookies from 'universal-cookie'
const cookies = new Cookies()

export default function AnalisisGeografico() {

    // Estado para guardar el token
    const [tokenSesion, setTokenSesion] = useState(false)
    const token = cookies.get('SessionToken')

    // Configuracion para verificar el token
    var config = {
        method: 'get',
        url: 'http://172.16.117.11:8080/SITU-API-1.0/acceso',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    };
    axios(config)
        .then(response => response.data)
        .then(
            (datosSesion) => {
                setTokenSesion(datosSesion['success-boolean'])
            },
            (error) => {
                console.log(error)
                cookies.remove('SessionToken', { path: "/" })
                window.location.href = "/"
            }
        )

    //Importa dinamicamente el mapa
    const Map = dynamic(
        () => import('../../components/Map'),
        {
            loading: () => <p>El mapa está cargando</p>,
            ssr: false
        }
    )

    //Acciones del formulario
    const { register, handleSubmit } = useForm();

    //Para guardar los datos del geojson
    const [datosEntidades, setDatosEntidades] = useState([])

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
        if (!result.destination) {
            return
        }
        const items = Array.from(datosEntidades)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)
        setDatosEntidades(items)
    }

    return (
        <>
            <Header />
            <Menu />
            {
                tokenSesion
                    ?
                    <>
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
                                    <DragDropContext onDragEnd={handleOnDragEnd}>
                                        <Droppable droppableId="entidades">
                                            {(provided) => (
                                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                                    {
                                                        datosEntidades.map((capa, index) => (
                                                            <Draggable key={capa.nom_entidad} draggableId={capa.nom_entidad} index={index}>
                                                                {(provided) => (
                                                                    <Form.Group {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                                        <Form.Check type="checkbox" defaultChecked={capa.habilitado} label={capa.nom_entidad} onChange={cambiaCheckbox} value={capa.num_entidad} />
                                                                    </Form.Group>
                                                                )}
                                                            </Draggable>
                                                        )
                                                        )}
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
                    </>
                    :
                    (typeof window !== 'undefined') &&
                    <>
                        <Container>
                            <div className="tw-py-20">
                                <div className="tw-border tw-bg-inst-verde-fuerte tw-shadow tw-rounded-md tw-p-4 tw-max-w-sm tw-w-full tw-mx-auto">
                                    <div className="tw-animate-pulse tw-flex tw-space-x-4">
                                        <div className="tw-rounded-full tw-bg-inst-dorado tw-h-12 tw-w-12"></div>
                                        <div className="tw-flex-1 tw-space-y-4 tw-py-1">
                                            <div className="tw-h-4 tw-bg-inst-verde-fuerte tw-rounded tw-w-3/4"></div>
                                            <div className="tw-space-y-2">
                                                <div className="tw-h-4 tw-bg-inst-dorado tw-rounded"></div>
                                            </div>
                                            <div className="tw-h-4 tw-bg-inst-dorado tw-rounded tw-w-5/6"></div>
                                        </div>
                                    </div>
                                    <p>hola</p>
                                </div>
                            </div>
                        </Container>
                    </>
            }
            <Footer />
        </>
    )
}