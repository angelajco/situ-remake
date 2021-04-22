import { useState, useEffect } from "react";
import { Form, InputGroup, Button } from 'react-bootstrap'
import { useForm } from "react-hook-form";
import axios from 'axios'

import Link from 'next/link'
import Head from 'next/head'
import Router from "next/router";
import ModalComponent from '../../components/ModalComponent';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

// Para guardar valiables de estado (token, nombre, apellido)
import Cookies from 'universal-cookie'
const cookies = new Cookies()


export default function InicioSesion() {
    console.log("objeto Leaflet", L);
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

    //Mostrar ocultar contraseña
    const [passwordShown, setPasswordShown] = useState(false);
    const handleClickPass = () => {
        setPasswordShown(passwordShown ? false : true);
    };

    //Para construir el formulario
    const { register, handleSubmit } = useForm();

    //Funcion a ejecutar al darle el boton de iniciar sesion
    const onSubmit = async (data) => {
        //Conexion con la api, donde verifica que los campos existan
        var config = {
            method: 'post',
            url: `${process.env.ruta}/wa/publico/login`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            //Si se logro la conexion
            .then(function (response) {
                //Usuario encontrado
                if (response.data.jwtResponse == undefined) {
                    handleShow();
                    setDatosModal({
                        title: response.data['message-subject'],
                        body: response.data['message']
                    })
                }
                else {
                    // Se agrega la cookie
                    cookies.set('SessionToken', response.data.jwtResponse['token'], { path: "/" })
                    cookies.set('RolUsuario', response.data.messager, { path: "/" })
                    cookies.set('EstatusUsuario', response.data.messagee, { path: "/" })
                    cookies.set('Usuario', response.data.nameUser, { path: "/" })
                    //Se redirecciona
                    Router.push("/")
                }
            })
            .catch(function (error) {
                console.log(error);
                if (error.response) {
                    setDatosModal({
                        title: error.response.data['message-subject'],
                        body: error.response.data['message']
                    })
                    handleShow();
                }
                else {
                    setDatosModal({
                        title: "Conexión no establecida",
                        body: "El tiempo de respuesta se ha agotado, favor de intentar más tarde."
                    })
                    handleShow();
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

                        <div className="col-12 col-md-6 tw-text-center">
                            <div className="tw-p-12">
                                <img src="/images/logo.png" alt="logo" className="img-fluid" />
                            </div>
                        </div>

                        <div className="col-12 col-md-6 tw-p-12 tw-bg-guia-grisf6">
                            <h1 className="titulo-h1">Inicio de sesión</h1>


                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Form.Group controlId="email">
                                    <Form.Control name="email" type="email" required ref={register} placeholder="Correo electrónico" />
                                </Form.Group>
                                <Form.Group>
                                    <InputGroup>
                                        <Form.Control name="password" id="password" className="pass-form-registro" type={passwordShown ? "text" : "password"} placeholder="Contraseña" required ref={register} autoComplete="on" />
                                        <InputGroup.Append onClick={handleClickPass} className="tw-cursor-pointer">
                                            <InputGroup.Text>
                                                {passwordShown ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                                            </InputGroup.Text>
                                        </InputGroup.Append>
                                    </InputGroup>
                                </Form.Group>

                                <Link href="/administracion/registro-usuario" locale="en">
                                    <a className="tw-block tw-text-inst-verdec hover:tw-text-inst-verdef">Crear cuenta</a>
                                </Link>
                                <Link href="/administracion/olvide-contrasena">
                                    <a className="tw-block tw-text-inst-verdec hover:tw-text-inst-verdef">Olvide mi contraseña</a>
                                </Link>
                                <div className="tw-text-center tw-pt-6">
                                    <Button variant="outline-secondary" className="btn-admin" type="submit">INICIAR SESIÓN</Button>
                                </div>
                            </Form>
                        </div>

                    </div>
                </div>
            </main>
        </>
    )
}