import { useState } from "react";
import { Form, InputGroup, Button } from 'react-bootstrap'
import { useForm } from "react-hook-form";

import Link from 'next/link'
import Head from 'next/head'
import Router from "next/router";
import ModalComponent from '../../components/ModalComponent';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

import { loginUser, useAuthState, useAuthDispatch } from '../../context';

export default function InicioSesion() {
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

	const dispatch = useAuthDispatch();
	const { loading } = useAuthState();

    //Funcion a ejecutar al darle el boton de iniciar sesion
    const onSubmit = async (data) => {
        let response = await loginUser(dispatch, { username:data.username, password:data.password });
        if (!response.username) {
            handleShow();
            setDatosModal({
                    title: response.data['message-subject'],
                    body: response.data['message']
                });
        } else{
            Router.push("/");
        };
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
                                    <Form.Control name="username" type="email" required ref={register} placeholder="Correo electrónico" />
                                </Form.Group>
                                <Form.Group>
                                    <InputGroup>
                                        <Form.Control name="password" id="password" className="pass-form-registro" type={passwordShown ? "text" : "password"} placeholder="Contraseña" required ref={register} autoComplete="on" disabled={loading} />
                                        <InputGroup.Append onClick={handleClickPass} className="tw-cursor-pointer">
                                            <InputGroup.Text disabled={loading}>
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
                                    <Button variant="outline-secondary" className="btn-admin" type="submit" disabled={loading}>INICIAR SESIÓN</Button>
                                </div>
                            </Form>
                        </div>

                    </div>
                </div>
            </main>
        </>
    )
}