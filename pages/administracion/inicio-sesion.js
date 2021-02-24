import { useState } from "react";
import { Form, InputGroup, Button } from 'react-bootstrap'
import { useForm } from "react-hook-form";
import axios from 'axios'

import Link from 'next/link'
import ModalComponent from '../../components/ModalComponent';
import Head from 'next/head'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

// Para guardar valiables de estado (token, nombre, apellido)
import Cookies from 'universal-cookie'
import Router from "next/router";
const cookies = new Cookies()

export default function InicioSesion() {

    //Datos para el modal
    const [show, setShow] = useState(false);
    const [datosModal, setDatosModal] = useState(
        {
            title: '',
            body: ''
        }
    );

    //Mostrar ocultar contraseña
    const [passwordShown, setPasswordShown] = useState(false);
    const handleClickPass = () => {
        setPasswordShown(passwordShown ? false : true);
    };

    //Estados para mostrar el modal
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //Para construir el formulario
    const { register, handleSubmit } = useForm();

    //Funcion a ejecutar al darle el boton de iniciar sesion
    const onSubmit = async (data) => {
        //Conexion con la api, donde verifica que los campos existan
        var config = {
            method: 'post',
            url: 'http://172.16.117.11/wa/publico/login',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            //Si se logro la conexion
            .then(function (response) {
                //Usuario encontrado
                if (response.data.token == undefined) {
                    handleShow();
                    setDatosModal({
                        title: response.data['message-subject'],
                        body: response.data['message']
                    })
                }
                else {
                    // Se agrega la cookie
                    cookies.set('SessionToken', response.data.token, { path: "/" })
                    //Se redirecciona
                    Router.push("/")
                }
            })
            .catch(function (error) {
                console.log(error);
                if (error.response) {
                    handleShow();
                    setDatosModal({
                        title: error.response.data['message-subject'],
                        body: error.response.data['message']
                    })
                }
                else {
                    handleShow();
                    setDatosModal({
                        title: "Conexión no establecida",
                        body: "El tiempo de respuesta se ha agotado, favor de intentar más tarde."
                    })
                }
            })

    }

    return (
        <>
            <Head>
                <title>Inicio de sesión</title>
            </Head>
            <ModalComponent
                show={show}
                datos={datosModal}
                onHide={handleClose}
                onClick={handleClose}
            />

            <main>
                <div className="container tw-my-12">
                    <div className="row shadow">

                        <div className="col-6 tw-text-center">
                            <div className="tw-p-12">
                                <img src="/images/logo.png" alt="logo" className="img-fluid"/>
                            </div>
                        </div>

                        <div className="col-6 tw-bg-inst-gris-claro tw-p-12">
                            <h1 className="titulo-h1">Inicio de sesión</h1>


                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Form.Group controlId="email">
                                    <Form.Control name="email" type="email" required ref={register} placeholder="Correo electrónico" />
                                </Form.Group>
                                <Form.Group>
                                    <InputGroup>
                                        <Form.Control name="password" id="password" className="pass-form-registro" type={passwordShown ? "text" : "password"} ref={register} placeholder="Contraseña" />
                                        <InputGroup.Append onClick={handleClickPass} className="tw-cursor-pointer">
                                            <InputGroup.Text>
                                                {passwordShown ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                                            </InputGroup.Text>
                                        </InputGroup.Append>
                                    </InputGroup>
                                </Form.Group>

                                <Link href="/administracion/registro-usuario">
                                    <a className="tw-block tw-text-inst-verde-claro">Crear cuenta</a>
                                </Link>
                                <Link href="/administracion/olvide-contrasena">
                                    <a className="tw-block tw-text-inst-verde-claro">Olvide mi contraseña</a>
                                </Link>
                                <div className="tw-text-center tw-pt-6">
                                    <Button variant="outline-secondary" className="tw-bg-white tw-rounded-full" type="submit">INICIAR SESIÓN</Button>
                                </div>
                            </Form>
                        </div>

                    </div>
                </div>
            </main>
        </>
    )
}