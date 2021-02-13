import { useState } from "react";
import { Form, InputGroup } from 'react-bootstrap'
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
            url: 'http://172.16.117.11/wa/login',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        axios(config)
            //Si se logro la conexion
            .then(function (response) {
                //Usuario encontrado
                //Se agrega la cookie
                cookies.set('SessionToken', response.data.token, { path: "/" })
                //Se redirecciona
                Router.push("/analisis-geografico")
            })
            .catch(function (error) {
                handleShow();
                setDatosModal({
                    title: 'Información incorrecta',
                    body: 'La información ingresada es incorrecta, favor de verificar'
                })
                console.log(error)
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
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div>
                                <p className="tw-text-center">Bienvenido</p>
                                <p className="tw-text-justify">El Sistema de Información Territorial y Urbana <b>(SITU)</b> se concibe como una herramienta que permite recopilar, organizar, integrar, difundir y actualizar la información geográfica documental así como indicadores sobre el ordenamiento territorial agrario, el desarrollo urbano y vivienda de México.</p>
                                <p className="tw-text-justify">El SITU se integrá por información e indicadores generados por los tres órdenes del gobierno, instancias de gobernanza metropolitana, así como otros registros e inventario del territorio derivados de actividades científicas, academicas o de cualquier índole en materia de ordenamiento territorial y desarrollo urbano.</p>
                            </div>
                            <div className="m-auto cuadro-login">
                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <Form.Group controlId="email">
                                        <Form.Label className="">Correo electrónico</Form.Label>
                                        <Form.Control name="email" type="email" required ref={register} />
                                    </Form.Group>
                                    <Form.Group>
                                        <label htmlFor="password">Contraseña</label>
                                        <InputGroup>
                                            <Form.Control name="password" id="password" className="pass-form-registro" type={passwordShown ? "text" : "password"} ref={register} />
                                            <InputGroup.Append onClick={handleClickPass} className="tw-cursor-pointer">
                                                <InputGroup.Text>
                                                    {passwordShown ? <FontAwesomeIcon icon={faEyeSlash}/> : <FontAwesomeIcon icon={faEye} />}
                                                </InputGroup.Text>
                                            </InputGroup.Append>
                                        </InputGroup>
                                    </Form.Group>
                                    <div className="row">
                                        <div className="col-6">
                                            <Link href="/administracion/registro-usuario">
                                                <a className="tw-block">Crear una cuenta</a>
                                            </Link>
                                            <Link href="/administracion/recuperar-contrasena">
                                                <a>¿Olvidaste tu contraseña?</a>
                                            </Link>
                                        </div>
                                        <div className="col-6">
                                            <input className="tw-float-right" type="submit" value="Iniciar sesión" />
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}