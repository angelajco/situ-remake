import { useRef, useState, useEffect } from "react"
import { Form, Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useForm } from "react-hook-form"
import { useRouter } from 'next/router'

import axios from 'axios'
import ModalComponent from '../../components/ModalComponent'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

export default function RestablecerContrasena() {

    const [email, setEmail] = useState(null)
    const router = useRouter()

    const [muestraForm, setMuestraForm] = useState(false)
    const [muestraError, setMuestraError] = useState("")

    useEffect(() => {
        if (router.query['permalink'] != undefined) {
            var config = {
                method: 'get',
                url: 'http://172.16.117.11/wa/publico/restorePassword',
                params: {
                    permalink: router.query['permalink']
                },
            };

            axios(config)
                .then(function (response) {
                    setEmail(response.data["message-subject"])
                    setMuestraForm(true)
                })
                .catch(function (error) {
                    console.log(error)
                    setMuestraError(error.response.data)
                });
        }
        else {
            setMuestraForm(false)
        }

    }, [router.query['permalink']])

    console.log(muestraError)

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
    const refContrasena = useRef();
    refContrasena.current = watch("password", "");

    //Funcion a ejecutar al darle el boton de recuperar contraseña
    const onSubmit = async (data) => {
        data['email'] = email;

        var config = {
            method: 'post',
            url: 'http://172.16.117.11/wa/publico/newPassword',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });


        //cambiamos show a true
        handleShow();
        //Datos a enviar al modal si el usuario es incorrecto
        setDatosModal({
            title: 'Resultado del proceso',
            body: 'Su contraseña fue restablecida con éxito.',
            redireccion: '/inicio-sesion'
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
            <ModalComponent
                show={show}
                datos={datosModal}
                onHide={handleClose}
                onClick={handleClose}
            />

            <div className="container tw-my-12">
                <div className="row shadow">

                    <div className="col-6 tw-text-center">
                        <div className="tw-p-12">
                            <img src="/images/logo.png" alt="logo" className="img-fluid" />
                        </div>
                    </div>

                    <div className="col-6 tw-bg-inst-gris-claro tw-p-12">
                        <h1 className="titulo-h1">RESTABLECER CONTRASEÑA</h1>
                        {
                            muestraForm ?
                                (
                                    <>
                                        <p>Ingrese y rectifique su nueva contraseña</p>

                                        <Form onSubmit={handleSubmit(onSubmit)}>
                                            <Form.Group controlId="password">
                                                <Form.Label className="tw-text-red-600">
                                                    Contraseña&nbsp;
                                    <OverlayTrigger placement="right" overlay={renderTooltip}>
                                                        <FontAwesomeIcon icon={faQuestionCircle} />
                                                    </OverlayTrigger>
                                                </Form.Label>
                                                <Form.Control name="password" type="text" required
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
                                                {errors.password && errors.password.message}
                                            </Form.Group>
                                            <Form.Group controlId="confPassword">
                                                <Form.Label className="tw-text-red-600">Confirmar contraseña</Form.Label>
                                                <Form.Control name="confPassword" type="text" required
                                                    ref={
                                                        register({
                                                            validate: value =>
                                                                value === refContrasena.current || "Las contraseñas no coinciden"
                                                        })
                                                    }
                                                />
                                                {errors.confPassword && errors.confPassword.message}
                                            </Form.Group>
                                            <input type="submit" />
                                        </Form>
                                    </>
                                )
                                :
                                muestraError ?
                                    <div>
                                        {muestraError['message-subject']}
                                    </div>
                                    :
                                    <div>No tiene permisos para ver esta página.</div>
                        }
                    </div>

                </div>
            </div>


        </>
    )
}