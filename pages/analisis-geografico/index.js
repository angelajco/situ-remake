
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import Menu from '../../components/Menu'

import { useState } from "react"
import { useForm } from "react-hook-form";
import { Form } from 'react-bootstrap'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import dynamic from 'next/dynamic'
import $ from 'jquery'

export default function AnalisisGeografico() {

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
        $.ajax({
            jsonpCallback: 'getJson',
            url: url,
            dataType: 'jsonp',
            success: function (response) {
                response["num_entidad"] = numEntidad;
                response["nom_entidad"] = nombreEntidad;
                response["habilitado"] = true;

                if (datosEntidades.some(ent => ent.num_entidad === numEntidad)) {
                    return;
                }
                else {
                    //se envian los datos a mapa para que los procese como geojson
                    setDatosEntidades([
                        ...datosEntidades,
                        response
                    ])
                }
            }
        });
    }

    const cambiaCheckbox = (event) => {
        const numeroEntidadChecked = event.target.value;

        const datosEntidadesActualizado = datosEntidades.map((valor) => {
            if (valor.num_entidad == numeroEntidadChecked) {
                if (valor.habilitado) {
                    valor.habilitado = false;
                    return valor;
                }
                else {
                    valor.habilitado = true;
                    return valor;
                }
            }
            return valor;
        });
        setDatosEntidades(datosEntidadesActualizado);
    }

    function handleOnDragEnd(result) {
        if (!result.destination) return
        const items = Array.from(datosEntidades)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)
        setDatosEntidades(items)
    }

    return (
        <>
            <Header />
            <Menu />

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
            <Footer />
        </>
    )
}
