import { useRef, useState } from "react";
import { Form, Button } from 'react-bootstrap'
import { useForm } from "react-hook-form";

import ModalComponent from '../../components/ModalComponent';

export default function RecuperarContrasena() {

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

    //Watch ve los cambios del input correo
    const refEmail = useRef();
    refEmail.current = watch("email", "");

    //a donde va a mandar el modal a darle aceptar
    const redireccion = () => {
        return window.location.href = "/administracion/inicio-sesion"
    }

    const onSubmit = async () => {
        //cambiamos show a true
        handleShow();
        //Datos a enviar al modal si el usuario es incorrecto
        setDatosModal({
            title: 'Recuperar contraseña',
            body: 'Se ha enviado un correo a ' + refEmail.current + ' para recuperar tu contraseña'
        })
    }

    return (
        <>
            <ModalComponent
                show={show}
                datos={datosModal}
                onHide={handleClose}
                onClick={handleClose}
                redireccion={redireccion} />

            <div className="container">
                <div className="row">
                    <div className="col-12">

                        <Form onSubmit={handleSubmit(onSubmit)}>

                            <Form.Group controlId="email">
                                <Form.Label>Correo electrónico</Form.Label>
                                <Form.Control name="email" type="email" required ref={
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

                            <Button variant="primary" type="submit">
                                Recuperar mi contraseña
                                </Button>

                        </Form>

                    </div>
                </div>
            </div>
        </>
    )
}
