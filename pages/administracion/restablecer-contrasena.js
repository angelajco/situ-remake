import { useRef, useState, useEffect } from "react"
import { Form, Button, OverlayTrigger, Tooltip, InputGroup } from 'react-bootstrap'
import { useForm } from "react-hook-form"
import { useRouter } from 'next/router'

import axios from 'axios'
import ModalComponent from '../../components/ModalComponent'
import Loader from '../../components/Loader'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

export default function RestablecerContrasena() {

    //Mostrar ocultar contraseña
    const [passwordShown, setPasswordShown] = useState(false);
    const [confPasswordShown, setConfPasswordShown] = useState(false);
    const handleClickPass = () => {
        setPasswordShown(passwordShown ? false : true);
    };
    const handleClickConfPass = () => {
        setConfPasswordShown(confPasswordShown ? false : true);
    }

    const [email, setEmail] = useState(null)
    const router = useRouter()

    const [muestraForm, setMuestraForm] = useState(false)
    const [muestraError, setMuestraError] = useState("")

    useEffect(() => {
        if (router.query['permalink'] != undefined) {
            var config = {
                method: 'get',
                url: `${process.env.ruta}/wa/publico/restorePassword`,
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
    }, [router.query['permalink']])

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
            url: `${process.env.ruta}/wa/publico/newPassword`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                if (response.data["message-type"] == 3) {
                    //Datos a enviar al modal si el usuario es incorrecto
                    setDatosModal({
                        title: response.data["message-subject"],
                        body: response.data["message"],
                        redireccion: '/inicio-sesion'
                    })
                    //cambiamos show a true
                    handleShow();
                } else {
                    //Datos a enviar al modal si el usuario es incorrecto
                    setDatosModal({
                        title: response.data["message-subject"],
                        body: response.data["message"],
                    })
                    handleShow();
                }
            })
            .catch(function (error) {
                setDatosModal({
                    title: "Conexión no establecida",
                    body: "El tiempo de respuesta se ha agotado, favor de intentar más tarde."
                })
                handleShow();
            });
    }

    //Renderiza el tooltip
    const renderTooltip = (props) => (
        <Tooltip className="tooltip-pass" id="button-tooltip" {...props}>
            <div>Al menos un número</div>
            <div>De mínimo 8 caracteres</div>
            <div>No debe contener más de 2 números consecutivos repetidos</div>
            <div>Al menos una letra mayúscula</div>
            <div>No debe contener más de 2 números sucesivos (123…)</div>
            <div>Al menos un carácter especial - ! @ # $ / () {"{ }"} = . , ; :</div>
        </Tooltip>
    );

    //Para mostrar el Loader
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setCargando(false);
        }, 3000);

        return () => clearTimeout(timeout);
    }, []);

    function evalPass(e) {
        const evalContrasena = watch("password");
        let regExp = /^(?=.*\d)(?=.*[-!@#$/(){}=.,;:])(?=.*[A-Z])(?=.*[a-z])(?!.*[+^"'´%&¿?*~|\\])(?!.*(012|123|234|345|456|567|678|789))(?!.*(000|111|222|333|444|555|666|777|888|999))\S{8,}$/;
        if(evalContrasena.length === 0) {
            document.getElementById("error-pass").hidden = true;
        } else {
            if(!regExp.test(evalContrasena) || evalContrasena.length < 8) {
                document.getElementById("error-pass").hidden = false;
            } else {
                document.getElementById("error-pass").hidden = true;
            }
        }
        if(document.getElementById('confirmar_contrasena').value.length > 0) {
            if(evalContrasena !== document.getElementById('confirmar_contrasena').value) {
                document.getElementById("error-conf-pass").hidden = false;
            } else {
                document.getElementById("error-conf-pass").hidden = true;
            }
        } else {
            document.getElementById("error-conf-pass").hidden = true;
        }
    }

    return (
        <>
            <ModalComponent
                show={show}
                datos={datosModal}
                onHide={handleClose}
                onClick={handleClose}
            />

            {
                cargando ?
                    <Loader />
                    :
                    <main>
                        <div className="container tw-my-12">
                            <div className="row shadow">

                                <div className="col-12 col-md-6 tw-text-center">
                                    <div className="tw-p-12">
                                        <img src="/images/logo.png" alt="logo" className="img-fluid" />
                                    </div>
                                </div>

                                <div className="col-12 col-md-6 tw-p-12 tw-bg-guia-grisf6">
                                    <h1 className="titulo-h1">Restablecer contraseña</h1>
                                    {
                                        muestraForm ?
                                            (
                                                <>
                                                    <Form onSubmit={handleSubmit(onSubmit)}>

                                                        <Form.Group>
                                                            <label htmlFor="contrasena" className="tw-text-red-600">
                                                                <OverlayTrigger placement="right" overlay={renderTooltip}>
                                                                    <FontAwesomeIcon icon={faQuestionCircle} />
                                                                </OverlayTrigger>
                                                                <span className="tw-text-sm">
                                                                    &nbsp;Condiciones para contraseña
                                                            </span>
                                                            </label>
                                                            <InputGroup>
                                                                <Form.Control name="password" required className="pass-form-registro" placeholder="Crear contraseña *"
                                                                    type={passwordShown ? "text" : "password"} onBlur={evalPass}
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
                                                                <InputGroup.Append onClick={handleClickPass} className="tw-cursor-pointer">
                                                                    <InputGroup.Text>
                                                                        {passwordShown ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                                                                    </InputGroup.Text>
                                                                </InputGroup.Append>
                                                            </InputGroup>
                                                            <p id ="error-pass" className="tw-text-red-600" hidden={true}>Contrase&ntilde;a incorrecta</p>
                                                        </Form.Group>

                                                        <Form.Group>
                                                            <InputGroup>
                                                                <Form.Control name="confPassword" id="confirmar_contrasena" required className="pass-form-registro" placeholder="Confirmar contraseña *"
                                                                    type={confPasswordShown ? "text" : "password"} onBlur={evalPass}
                                                                    ref={
                                                                        register({
                                                                            validate: value =>
                                                                                value === refContrasena.current || "Las contraseñas no coinciden"
                                                                        })
                                                                    }
                                                                />
                                                                <InputGroup.Append onClick={handleClickConfPass} className="tw-cursor-pointer">
                                                                    <InputGroup.Text>
                                                                        {confPasswordShown ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                                                                    </InputGroup.Text>
                                                                </InputGroup.Append>
                                                            </InputGroup>
                                                            <p id ="error-conf-pass" className="tw-text-red-600" hidden={true}>Las contrase&ntilde;as no coinciden</p>
                                                        </Form.Group>

                                                        <div className="tw-text-center tw-pt-6">
                                                            <Button variant="outline-secondary" className="btn-admin" type="submit">ENVIAR</Button>
                                                        </div>
                                                    </Form>
                                                </>
                                            )
                                            :
                                            (
                                                <div className="mensajes-admin">
                                                    {muestraError ?
                                                        muestraError['message-subject']
                                                        :
                                                        "No tiene permisos para ver esta página."
                                                    }
                                                </div>
                                            )
                                    }
                                </div>

                            </div>
                        </div>
                    </main>
            }
        </>
    )
}