import { useRef, useState, useEffect } from "react";
import { Form, OverlayTrigger, Tooltip, InputGroup, Button } from 'react-bootstrap'
import { useForm } from "react-hook-form";
import axios from 'axios'

import Head from 'next/head'
import ModalComponent from '../../components/ModalComponent';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faQuestionCircle,  faUserCircle } from '@fortawesome/free-solid-svg-icons'

export default function Registro() {

    //Datos para crear el form
    const { register, handleSubmit, watch, clearErrors, setError, errors } = useForm();

    //Boton submit
    const [botonDesabilitar, setBotonDesabilitar] = useState(false);

    //Datos para el modal
    const [show, setShow] = useState(false);
    const [datosModal, setDatosModal] = useState(
        {
            title: '',
            body: '',
            ruta: undefined
        }
    );

    //Estados para mostrar el modal
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);


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

    //Watch ve en tiempo real lo que tienen los inputs
    const refContrasena = watch("contrasena", "");
    const refEntidad = watch("id_entidad", "");



    //Validar correo
    const validarNivel = () => {
        const refEmail = watch("email", "");

        const refRol = watch("roles")
        if (refRol == "EQUIPO_TECNICO" || refRol == "FUNCIONARIO_SEDATU") {
            //Se crea una bandera para validar los errores
            var banderaCorreo = true;
            setBotonDesabilitar(true);
            //Se recorre el arreglo de correos para validarlo con el correo que se escribio
            correos.map(valCorreo => {
                //Expresion regular
                var expReg = new RegExp("\\b" + valCorreo.dominio_correo + "\\b", 'gi')
                const validacionCorreo = refEmail.match(expReg);
                //Si el correo existe dentro del arreglo
                if (validacionCorreo != null) {
                    banderaCorreo = false;
                    setBotonDesabilitar(false);
                }
            })
            //La bandera no cambio y se pone error
            if (banderaCorreo == true) {
                setError("roles", {
                    message: "El correo no corresponde al nivel seleccionado"
                });
            }
            //La bandera cambio y se quita error
            else {
                clearErrors("roles");
            }
        }
        //Si existe algun error lo limpia y activa el boton en caso de que se cambie de rol
        else {
            clearErrors("roles");
            setBotonDesabilitar(false);
        }
    }

    //Mostrar ocultar contraseña
    const [passwordShown, setPasswordShown] = useState(false);
    const [confPasswordShown, setConfPasswordShown] = useState(false);
    const handleClickPass = () => {
        setPasswordShown(passwordShown ? false : true);
    };
    const handleClickConfPass = () => {
        setConfPasswordShown(confPasswordShown ? false : true);
    }

    const [captchaState, setCaptchaState] = useState({ source: null });

    const reloadCaptcha = async(event)=>{
        let config = {
            method: "get",
            url: `${process.env.ruta}/wa/publico/captcha.png`,
            headers: {
                "gx-cp-fn": "true"
            },
            responseType: 'arraybuffer',
            withCredentials: true
        };

        axios(config)
            .then(function (response) {
                const base64 = btoa(
                    new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte),'',),
                  );
                setCaptchaState({ source: "data:;base64," + base64 });
            });
    }

    //Funcion a ejecutar al darle el boton de iniciar sesion
    const onSubmit = async (data) => {
        let emailSubmit = watch("email", "");

        const emailDescompuesto = emailSubmit.split("@");
        const despuesArroba = emailDescompuesto[1];
        const splitted2 = despuesArroba.split(".");
        const parte1 = splitted2[0];
        const parte2 = splitted2[1];

        if (parte1 === parte2) {
            setError("email", {
                message: "No se permiten correos electronicos con dos palabras iguales"
            });
        }
        else {
            //Envio de informacion
            data["roles"] = [{idRol:data.roles}];
            let datosFormulario = JSON.stringify(data);
            let config = {
                method: "post",
                url: `${process.env.ruta}/wa/publico/createUser`,
                headers: {
                    "Content-Type": "application/json"
                },
                data: datosFormulario,
                withCredentials: true
            };

            axios(config)
                .then(function (response) {
                    if (response.data["message-type"] == 1) {
                        //Registro exitoso
                        //Datos a enviar al modal si el usuario es correcto
                        setDatosModal({
                            title: 'Registro correcto',
                            body: 'Para terminar el registro de la cuenta, hemos enviado un correo a ' + data.email + ' para verificar su cuenta de correo electrónico',
                            ruta: "/administracion/inicio-sesion"
                        })
                    }
                    else {
                        setDatosModal({
                            title: response.data["message-subject"],
                            body: response.data['message']
                        })
                    }
                    //Cambiamos el modal de show a true
                    handleShow();
                })
                .catch(function (error) {
                    //Registro no exitoso
                    console.log(error)
                    //Datos a enviar al modal si el usuario es incorrecto
                    setDatosModal({
                        title: 'Registro incorrecto',
                        body: 'Favor de verificar la información',
                    });
                    //Cambiamos el modal de show a true
                    handleShow();
                });
        }
    }

    //Fechas para año de nacimiento
    const fechaActual = new Date().getFullYear();
    const fechaMinima = (fechaActual - 100) + "-01-01";
    const fechaMaxima = (fechaActual - 15) + "-12-31";

    //Cambia el tipo del input de fecha
    const cambiarTipoFecha = (event) => {
        event.target.type = "date"
    }

    //Verifica si ha sido borrada y la pone por default
    const verificarFecha = (event) => {
        if (event.target.value == "") {
            event.target.value = ""
            event.target.type = "text"
        }
    }

    //Estados para guardar los catalogos
    const [generos, setGeneros] = useState([]);
    const [entidades, setEntidades] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [ambitos, setAmbitos] = useState([]);
    const [correos, setCorreos] = useState([]);

    useEffect(() => {
        //Institutos
        fetch(`${process.env.ruta}/wa/publico/catGeneros`)
            .then(res => res.json())
            .then(
                (data) => setGeneros(data),
                (error) => console.log(error)
            )

        //Entidades
        fetch(`${process.env.ruta}/wa/publico/catEntidades`)
            .then(res => res.json())
            .then(
                (data) => setEntidades(data),
                (error) => console.log(error)
            )

        //Roles
        fetch(`${process.env.ruta}/wa/publico/catRoles`)
            .then(res => res.json())
            .then(
                (data) => setRoles(data.filter(rol => rol.publico === true)),
                (error) => console.log(error)
            )

        //Ambitos
        fetch(`${process.env.ruta}/wa/publico/catAmbito`)
            .then(res => res.json())
            .then(
                (data) => setAmbitos(data),
                (error) => console.log(error)
            )

        //Correos
        fetch(`${process.env.ruta}/wa/publico/catDominios`)
            .then(res => res.json())
            .then(
                (data) => setCorreos(data),
                (error) => console.log(error)
            )

    }, []);

    const municipoCambio = () => {
        //Municipios
        fetch(`${process.env.ruta}/wa/publico/catMunicipios`)
            .then(res => res.json())
            .then(
                (data) => setMunicipios(data),
                (error) => console.log(error)
            )
    }

    function evalPass(e) {
        const evalContrasena = watch("contrasena");
        let regExp = /^(?=.*\d)(?=.*[-!@#$/(){}=.,;:])(?=.*[A-Z])(?=.*[a-z])(?!.*[+^"'´%&¿?*~|\\])(?!.*(012|123|234|345|456|567|678|789))(?!.*(000|111|222|333|444|555|666|777|888|999))\S{8,}$/;
        if (evalContrasena.length === 0) {
            document.getElementById("error-pass").hidden = true;
        } else {
            if (!regExp.test(evalContrasena) || evalContrasena.length < 8) {
                document.getElementById("error-pass").hidden = false;
            } else {
                document.getElementById("error-pass").hidden = true;
            }
        }
        if (document.getElementById('confirmar_contrasena').value.length > 0) {
            if (evalContrasena !== document.getElementById('confirmar_contrasena').value) {
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
            <Head>
                <title>Registro de usuario</title>
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
                            <h1 className="titulo-h1">Registro de persona usuaria</h1>
                            <Form onSubmit={handleSubmit(onSubmit)}>

                                <Form.Group controlId="nombre">
                                    <Form.Control name="nombre" type="text" required placeholder="Nombre(s) *"
                                        ref={
                                            register({
                                                maxLength: {
                                                    value: 30,
                                                    message: 'Longitud máxima 30 caracteres',
                                                },
                                                pattern:
                                                {
                                                    value: /^[a-záéíóúñ]+(\s?[a-záéíóúñ])*$/i,
                                                    message: "Nombre incorrecto"
                                                }
                                            })
                                        } />
                                    <p className="tw-text-red-600">{errors.nombre && errors.nombre.message}</p>
                                </Form.Group>

                                <Form.Group controlId="apellido_paterno">
                                    <Form.Control name="apellido_paterno" type="text" required placeholder="Apellido 1 *"
                                        ref={
                                            register({
                                                maxLength: {
                                                    value: 30,
                                                    message: 'Longitud máxima 30 caracteres',
                                                },
                                                pattern:
                                                {
                                                    value: /^[a-záéíóúñ]+(\s?[a-záéíóúñ])*$/i,
                                                    message: "Apellido incorrecto"
                                                }
                                            })
                                        }
                                    />
                                    <p className="tw-text-red-600">{errors.apellido_paterno && errors.apellido_paterno.message}</p>
                                </Form.Group>

                                <Form.Group controlId="apellido_materno">
                                    <Form.Control name="apellido_materno" type="text" placeholder="Apellido 2"
                                        ref={
                                            register({
                                                maxLength: {
                                                    value: 30,
                                                    message: 'Longitud máxima 30 caracteres',
                                                },
                                                pattern:
                                                {
                                                    value: /^[a-záéíóúñ]+(\s?[a-záéíóúñ])*$/i,
                                                    message: "Apellido incorrecto"
                                                }
                                            })
                                        }
                                    />
                                    <p className="tw-text-red-600">{errors.apellido_materno && errors.apellido_materno.message}</p>
                                </Form.Group>

                                <Form.Group controlId="id_genero">
                                    <Form.Control as="select" name="id_genero" ref={register}>
                                        <option value="">Género con el que te identificas</option>
                                        {generos.map((value, index) => (
                                            <option key={index} value={value.id_genero}>
                                                {value.genero}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId="fecha_nacimiento">
                                    <Form.Control name="fecha_nacimiento" type="text" placeholder="Fecha de nacimiento **" ref={register} min={fechaMinima} max={fechaMaxima} onFocus={cambiarTipoFecha} onBlur={verificarFecha} />
                                </Form.Group>

                                <Form.Group controlId="email">
                                    <Form.Control name="email" type="email" required onChange={validarNivel} placeholder="Correo electrónico *"
                                        ref={
                                            register({
                                                maxLength: {
                                                    value: 250,
                                                    message: 'Longitud máxima 250 caracteres',
                                                },
                                                pattern:
                                                {
                                                    value: /^([a-z]+[0-9_-]*)+(\.[a-z0-9_-]+)*@([a-z0-9]+\.)+[a-z][a-z]+$/i,
                                                    message: "Correo incorrecto"
                                                }
                                            })
                                        } />
                                    <p className="tw-text-red-600">{errors.email && errors.email.message}</p>
                                </Form.Group>

                                <Form.Group controlId="celular">
                                    <Form.Control name="celular" type="text" placeholder="Número de teléfono" ref={
                                        register({
                                            pattern: {
                                                value: /^[0-9]{10}$/,
                                                message: "Solo campo númerico, de 10 caracteres"
                                            }
                                        })
                                    } />
                                    <p className="tw-text-red-600">{errors.celular && errors.celular.message}</p>
                                </Form.Group>

                                <Form.Group controlId="instituto">
                                    <Form.Control name="instituto" type="text" placeholder="Institución u organismo de adscripción **" ref={
                                        register({
                                            maxLength: {
                                                value: 250,
                                                message: 'Longitud máxima 30 caracteres',
                                            },
                                            pattern:
                                            {
                                                value: /^[a-záéíóúñ0-9]+(\s?[a-záéíóúñ0-9])*$/i,
                                                message: "Instituto incorrecto"
                                            }
                                        })
                                    } />
                                    <p className="tw-text-red-600">{errors.instituto && errors.instituto.message}</p>
                                </Form.Group>

                                <Form.Group controlId="id_entidad">
                                    <Form.Control as="select" name="id_entidad" ref={register} onChange={municipoCambio}>
                                        <option value="">Entidad **</option>
                                        {entidades.map((value, index) => (
                                            <option key={index} value={value.id_entidades}>
                                                {value.nombre_entidad}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId="id_municipio">
                                    <Form.Control as="select" name="id_municipio" ref={register}>
                                        <option value="">Municipio **</option>
                                        {
                                            municipios.filter(mun => mun.cve_ent == refEntidad).map((munFiltrado, index) => (
                                                <option key={index} value={munFiltrado.id_municipios}>
                                                    {munFiltrado.nombre_municipio}
                                                </option>
                                            ))
                                        }
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId="roles">
                                    <Form.Control as="select" name="roles" required onChange={validarNivel} ref={register}>
                                        <option value="" hidden>Perfil de persona usuaria *</option>
                                        {
                                            roles.map((value, index) => (
                                                <option key={index} value={value.idRol}>
                                                    {value.descripcion}
                                                </option>
                                            ))
                                        }
                                    </Form.Control>
                                    <p className="tw-text-red-600">{errors.roles && errors.roles.message}</p>
                                </Form.Group>

                                <Form.Group controlId="id_ambito_actuacion">
                                    <Form.Control as="select" name="id_ambito_actuacion" ref={register}>
                                        <option value="">Ámbito de competencia **</option>
                                        {
                                            ambitos.map((value, index) => (
                                                <option key={index} value={value.id_ambito_actuacion}>
                                                    {value.ambito_actuacion}
                                                </option>
                                            ))
                                        }
                                    </Form.Control>
                                </Form.Group>

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
                                        <Form.Control name="contrasena" required id="contrasena" className="pass-form-registro" placeholder="Crear contraseña *"
                                            type={passwordShown ? "text" : "password"} onBlur={evalPass}
                                            ref={
                                                register({
                                                    minLength: {
                                                        value: 8,
                                                        message: 'Longitud minima 8 caracteres',
                                                    },
                                                    pattern:
                                                    {
                                                        value: /^(?=.*\d)(?=.*[-!@#$/(){}=.,;:])(?=.*[A-Z])(?=.*[a-z])(?!.*[+^"'´%&¿?*~|\\])(?!.*(012|123|234|345|456|567|678|789))(?!.*(000|111|222|333|444|555|666|777|888|999))\S{8,}$/,
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
                                    <p id="error-pass" className="tw-text-red-600" hidden={true}>Contrase&ntilde;a incorrecta</p>
                                </Form.Group>

                                <Form.Group>
                                    <InputGroup>
                                        <Form.Control name="confirmar_contrasena" className="pass-form-registro" id="confirmar_contrasena" required placeholder="Confirmar contraseña *"
                                            type={confPasswordShown ? "text" : "password"} onBlur={evalPass}
                                            ref={
                                                register({
                                                    validate: value =>
                                                        value === refContrasena || "Las contraseñas no coinciden"
                                                })
                                            }
                                        />
                                        <InputGroup.Append onClick={handleClickConfPass} className="tw-cursor-pointer">
                                            <InputGroup.Text>
                                                {confPasswordShown ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                                            </InputGroup.Text>
                                        </InputGroup.Append>
                                    </InputGroup>
                                    <p id="error-conf-pass" className="tw-text-red-600" hidden={true}>Las contrase&ntilde;as no coinciden</p>
                                </Form.Group>

                                <Form.Group controlId="captcha">
                                    <img id="captcha" src={captchaState.source? captchaState.source: (process.env.ruta + "/wa/publico/captcha.png")} />&nbsp;<Button variant="outline-secondary" type="button" onClick={reloadCaptcha}><img src="/images/reload.png" width="32" alt="Cambiar" /></Button>
                                </Form.Group>
                                <Form.Group controlId="captcha">
                                    <Form.Control name="captcha" type="text" placeholder="Captcha *" ref={
                                        register({
                                            required: {
                                                value: true, 
                                                message: 'Captcha es requerido'
                                                }
                                            })
                                    } />
                                    <p className="tw-text-red-600">{errors.captcha && errors.captcha.message}</p>
                                </Form.Group>

                                <Form.Group controlId="terminos">
                                    <Form.Check type="checkbox" required feedback="Acepta los términos y condiciones" feedbackTooltip label={
                                        <a href="https://www.gob.mx/terminos" target="_blank" className="tw-text-inst-verdec hover:tw-text-inst-verdef">He leído y acepto los Términos y Condiciones</a>
                                    } />
                                </Form.Group>

                                <Form.Group controlId="privacidad">
                                    <Form.Check type="checkbox" required feedback="Acepta el aviso de privacidad" feedbackTooltip label={
                                        <a href="https://www.gob.mx/terminos" target="_blank" className="tw-text-inst-verdec hover:tw-text-inst-verdef">He leído y acepto Aviso de Privacidad</a>
                                    } />
                                </Form.Group>

                                <p className="tw-text-inst-verdec">S/* Campo libre</p>
                                <p className="tw-text-inst-verdec">* Campo obligatorio</p>
                                <p className="tw-text-inst-verdec">** Campo sugerido</p>

                                <div className="tw-text-center tw-pt-6">
                                    <Button variant="outline-secondary" className="btn-admin" type="submit" disabled={botonDesabilitar}>REGISTRAR</Button>
                                </div>
                            </Form>
                        </div>

                    </div>
                </div>
            </main>
        </>
    )
}