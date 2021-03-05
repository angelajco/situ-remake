import { useRef, useState } from "react";
import { Form, Button } from 'react-bootstrap'
import { useForm } from "react-hook-form";

import axios from 'axios'

import ModalComponent from '../../components/ModalComponent';

export default function OlvideContrasena() {

    //Datos para el modal
    const [show, setShow] = useState(false);
    const [datosModal, setDatosModal] = useState(
        {
            title: '',
            body: ''
        }
    );

    //Estados para mostrar el modal
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //Para construir el formulario
    const { register, handleSubmit, errors } = useForm();

    //a donde va a mandar el modal a darle aceptar
    const redireccion = () => {
        return window.location.href = "/administracion/inicio-sesion"
    }

    const onSubmit = async (data) => {
        var config = {
            method: 'post',
            url: `${process.env.ruta}/wa/publico/recoverPassword`,
            headers: {
                "Content-Type": "application/json"
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                if (response.data['message-type'] == 3) {
                    //Datos a enviar al modal si el usuario es incorrecto
                    setDatosModal({
                        title: response.data["message-subject"],
                        body: 'Se ha enviado un correo a ' + data.email + ' para recuperar tu contraseña'
                    })
                } else {
                    setDatosModal({
                        title: response.data["message-subject"],
                        body: response.data['message']
                    })
                }
                //cambiamos show a true para mostrar el modal
                handleShow();
            })
            .catch(function (error) {
                //cambiamos show a true
                handleShow();
                //Datos a enviar al modal si el usuario es incorrecto
                setDatosModal({
                    title: 'Recuperar contraseña',
                    body: 'No se ha podido enviar el correo a la dirección ' + refEmail + 'verifique de nuevo'
                })
            });
    }

    return (
        <>
            <ModalComponent
                show={show}
                datos={datosModal}
                onHide={handleClose}
                onClick={handleClose}
                redireccion={redireccion} />

            <div className="container tw-my-12">
                <div className="row shadow">

                    <div className="col-12 col-md-6 tw-text-center">
                        <div className="tw-p-12">
                            <img src="/images/logo.png" alt="logo" className="img-fluid" />
                        </div>
                    </div>

                    <div className="col-12 col-md-6 tw-p-12 tw-bg-guia-grisf6">
                        <h1 className="titulo-h1">Olvide mi contraseña</h1>

                        <Form onSubmit={handleSubmit(onSubmit)}>

                            <Form.Group controlId="email">
                                <Form.Control name="email" type="email" required placeholder="Correo electrónico"
                                    ref={
                                        register({
                                            pattern:
                                            {
                                                value: /^([a-z]+[0-9_-]*)+(\.[a-z0-9_-]+)*@([a-z0-9]+\.)+[a-z]+$/i,
                                                message: "Correo incorrecto"
                                            }
                                        })
                                    } />
                                <p>{errors.email && errors.email.message}</p>
                            </Form.Group>

                            <div className="tw-text-center tw-pt-6">
                                <Button variant="outline-secondary" className="btn-admin" type="submit">
                                    Recuperar mi contraseña </Button>
                            </div>

                        </Form>

                    </div>
                </div>
            </div>
        </>
    )
}
