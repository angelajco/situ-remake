import { useRef, useState } from "react";
import { Form, Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useForm } from "react-hook-form";

import Header from '../../components/Header'
import Menu from '../../components/Menu'
import Footer from '../../components/Footer'
import ModalComponent from '../../components/ModalComponent';

export default function ReestablecerContrasena() {

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
    const { register, handleSubmit, watch, errors } = useForm();
    //Watch ve los cambios en los inputs cuando se modifican
    const refEmail = useRef();
    refEmail.current = watch("correo", "");
    const refContrasena = useRef();
    refContrasena.current = watch("contrasena", "");
    //A donde va a mandar el modal a darle aceptar
    const redireccion = () => {
        return window.location.href = "/inicio-sesion"
    }
    //Funcion a ejecutar al darle el boton de iniciar sesion
    const onSubmit = async () => {
        //cambiamos show a true
        handleShow();
        //Datos a enviar al modal si el usuario es incorrecto
        setDatosModal({
            title: 'Resultado del proceso',
            body: 'Su contraseña fue restablecida con éxito.'
        })
    }

    //Renderiza el tooltip
    const renderTooltip = (props) => (
        <Tooltip className="tooltip-pass" id="button-tooltip" {...props}>
            <ul>
                <li>Al menos un número</li>
                <li>De mínimo 8 caracteres</li>
                <li>No debe contener más de 2 números consecutivos repetidos</li>
                <li>Al menos una letra mayúscula</li>
                <li>No debe contener más de 2 números sucesivos (123…)</li>
                <li>Al menos un carácter especial - ! @ # $ / () {"{ }"} = . , ; :</li>
            </ul>
        </Tooltip>
    );

    return (
        <>
            <Header />
            <Menu />

            <ModalComponent
                show={show}
                datos={datosModal}
                onHide={handleClose}
                onClick={handleClose}
                redireccion={redireccion} />

            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <p>Ingrese y rectifique su nueva contraseña</p>

                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Form.Group controlId="contrasena">
                                <Form.Label className="tw-text-red-600">
                                    Contraseña&nbsp;
                                    <OverlayTrigger placement="right" overlay={renderTooltip}>
                                        <i className="far fa-question-circle"></i>
                                    </OverlayTrigger>
                                </Form.Label>
                                <Form.Control name="contrasena" type="text" required
                                    ref={
                                        register({
                                            minLength: {
                                                value: 8,
                                                message: 'Longitud minima 8 caracteres',
                                            },
                                            pattern:
                                            {
                                                value: /^(?=.*\d)(?=.*[-!@#$/(){}=.,;:])(?=.*[A-Z])(?=.*[a-z])(?!.*(012|123|234|345|456|567|678|789))(?!.*(000|111|222|333|444|555|666|777|888|999)).*\S{8,}$/i,
                                                message: "Contraseña incorrecta"
                                            }
                                        })
                                    }
                                />
                                {errors.contrasena && errors.contrasena.message}
                            </Form.Group>
                            <Form.Group controlId="confirmarcontra">
                                <Form.Label className="tw-text-red-600">Confirmar contraseña</Form.Label>
                                <Form.Control name="confirmarcontra" type="text" required
                                    ref={
                                        register({
                                            validate: value =>
                                                value === refContrasena.current || "Las contraseñas no coinciden"
                                        })
                                    }
                                />
                                {errors.confirmarcontra && errors.confirmarcontra.message}
                            </Form.Group>
                            <input type="submit" />

                        </Form>
                    </div>
                </div>
            </div>

            <Footer />

        </>
    )
}