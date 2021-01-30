
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import Menu from '../../components/Menu'

import { useState } from "react"
import { useForm } from "react-hook-form";
import { Form } from 'react-bootstrap'

import dynamic from 'next/dynamic'
import $ from 'jquery'

export default function AnalisisGeografico() {

    const Map = dynamic(
        () => import('../../components/Map'),
        {
            loading: () => <p>El mapa está cargando</p>,
            ssr: false
        }
    )

    const { register, handleSubmit, watch, errors } = useForm();

    const [datosEntidades, setDatosEntidades] = useState(null)

    const onSubmit = (data) => {
        const entidad = data.entidad;

        const owsrootUrl = 'https://ide.sedatu.gob.mx:8080/ows';

        const defaultParameters1 = {
            service: 'WFS',
            version: '2.0',
            request: 'GetFeature',
            //sedatu:
            typeName: 'geonode:inegi_00mun_4326',
            outputFormat: 'text/javascript',
            format_options: 'callback:getJson',
            cql_filter: 'CVE_ENT=' + entidad
        };

        var parameters1 = L.Util.extend(defaultParameters1);
        var url = owsrootUrl + L.Util.getParamString(parameters1);

        $.ajax({
            jsonpCallback: 'getJson',
            url: url,
            dataType: 'jsonp',
            success: function (response) {
                setDatosEntidades(response)
            }
        });

        setDatosEntidades(null)
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
                                    <option value="24">San Luis Potosí</option>
                                    <option value="26">Sonora</option>
                                    <option value="27">Tabasco</option>
                                </Form.Control>
                            </Form.Group>
                            <input type="submit" />
                        </Form>

                        <div>Capas</div>
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
