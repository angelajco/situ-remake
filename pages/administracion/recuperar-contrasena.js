import { useRef, useState } from "react";
import { Form, Button } from 'react-bootstrap'
import { useForm } from "react-hook-form";

import Footer from '../../components/Footer'
import Header from '../../components/Header'
import Menu from '../../components/Menu'
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
    refEmail.current = watch("correo", "");

    //a donde va a mandar el modal a darle aceptar
    const redireccion = () =>{
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

            <Header />
            <Menu />
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Form.Group controlId="email">
                                <Form.Label className="tw-text-red-600">Correo electrónico</Form.Label>
                                <Form.Control name="correo" type="email" placeholder="" required ref={register} />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Recuperar mi contraseña
                                </Button>
                        </Form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
