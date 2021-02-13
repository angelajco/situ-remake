import { useRef, useState, useEffect } from "react";
import { Form, OverlayTrigger, Tooltip, InputGroup } from 'react-bootstrap'
import { useForm } from "react-hook-form";
import axios from 'axios'

import Head from 'next/head'
import ModalComponent from '../../components/ModalComponent';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

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

    //Validar correo
    const validarNivel = () => {
        if (refRol.current == "1" || refRol.current == "2") {
            //Se crea una bandera para validar los errores
            var banderaCorreo = true;
            setBotonDesabilitar(true);
            //Se recorre el arreglo de correos para validarlo con el correo que se escribio
            correos.map(valCorreo => {
                //Expresion regular
                var expReg = new RegExp("\\b" + valCorreo.dominio_correo + "\\b", 'gi')
                const validacionCorreo = refEmail.current.match(expReg);
                //Si el correo existe dentro del arreglo
                if (validacionCorreo != null) {
                    banderaCorreo = false;
                    setBotonDesabilitar(false);
                }
            })
            //La bandera no cambio y se pone error
            if (banderaCorreo == true) {
                setError("id_rol", {
                    message: "El correo no corresponde al nivel seleccionado"
                });
            }
            //La bandera cambio y se quita error
            else {
                clearErrors("id_rol");
            }
        }
        //Si existe algun error lo limpia y activa el boton en caso de que se cambie de rol
        else {
            clearErrors("id_rol");
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

    //Watch ve en tiempo real lo que tienen los inputs
    const refContrasena = useRef();
    refContrasena.current = watch("contrasena", "");
    const refEmail = useRef();
    refEmail.current = watch("email", "");
    const refEntidad = useRef();
    refEntidad.current = watch("id_entidad", "");
    const refRol = useRef();
    refRol.current = watch("id_rol", "")

    //Funcion a ejecutar al darle el boton de iniciar sesion
    const onSubmit = async (data) => {
        //Envio de informacion
        let datosFormulario = JSON.stringify(data);
        let config = {
            method: "post",
            url: "http://172.16.117.11/wa/createUser",
            headers: {
                "Content-Type": "application/json"
            },
            data: datosFormulario
        };

        axios(config)
            .then(function (response) {
                if (response.data["success-boolean"]) {
                    //Registro exitoso
                    //Datos a enviar al modal si el usuario es correcto
                    setDatosModal({
                        title: 'Registro correcto',
                        body: 'Para terminar el registro de la cuenta, hemos enviado un correo a ' + refEmail.current + ' para verificar su cuenta de correo electrónico',
                        ruta: "/administracion/inicio-sesion"
                    })
                    //Cambiamos el modal de show a true
                    handleShow();
                }
            })
            .catch(function (error) {
                //Registro no exitoso
                //Cambiamos el modal de show a true
                handleShow();
                //Datos a enviar al modal si el usuario es incorrecto
                setDatosModal({
                    title: 'Registro incorrecto',
                    body: 'Favor de verificar la información',
                    ruta: '/'
                });
            });
    }

    //Fechas para año de nacimiento
    const fechaActual = new Date().getFullYear();
    const fechaMinima = fechaActual - 100;
    const fechaMaxima = fechaActual - 15;

    //Estados para guardar los catalogos
    const [institutos, setInstitutos] = useState([]);
    const [entidades, setEntidades] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [ambitos, setAmbitos] = useState([]);
    const [correos, setCorreos] = useState([]);

    useEffect(() => {

        //Institutos
        fetch("http://172.16.117.11/wa/catInstitutos")
            .then(res => res.json())
            .then(
                (data) => setInstitutos(data),
                (error) => console.log(error)
            )

        //Entidades
        fetch("http://172.16.117.11/wa/catEntidades")
            .then(res => res.json())
            .then(
                (data) => setEntidades(data),
                (error) => console.log(error)
            )

        //Roles
        fetch("http://172.16.117.11/wa/catRoles")
            .then(res => res.json())
            .then(
                (data) => setRoles(data),
                (error) => console.log(error)
            )

        //Ambitos
        fetch("http://172.16.117.11/wa/catAmbito")
            .then(res => res.json())
            .then(
                (data) => setAmbitos(data),
                (error) => console.log(error)
            )

        //Correos
        fetch("http://172.16.117.11/wa/catDominios")
            .then(res => res.json())
            .then(
                (data) => setCorreos(data),
                (error) => console.log(error)
            )

    }, []);

    const municipoCambio = () => {
        //Municipios
        fetch("http://172.16.117.11/wa/catMunicipios")
            .then(res => res.json())
            .then(
                (data) => setMunicipios(data),
                (error) => console.log(error)
            )
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

            <div className="container tw-flex tw-justify-center tw-mt-4">
                <div className="row">
                    <div className="col-12">
                        <img src="/images/administracion/500.png"></img>
                    </div>
                </div>
            </div>

            <div className="container">
                <p className="tw-text-center tw-mt-8 tw-font-bold">REGISTRO DE USUARIO</p>
                <Form onSubmit={handleSubmit(onSubmit)} className="row">

                    {/* <div className="g-recaptcha" data-sitekey="YOURSITEKEY"></div> */}

                    <Form.Group controlId="nombre" className="col-12">
                        <Form.Label className="tw-text-red-600">Nombre</Form.Label>
                        <Form.Control name="nombre" type="text" required ref={
                            register({
                                pattern:
                                {
                                    value: /^[a-záéíóúñ]+(\s?[a-záéíóúñ])*$/i,
                                    message: "Nombre incorrecto"
                                }
                            })
                        } />
                        <p>{errors.nombre && errors.nombre.message}</p>
                    </Form.Group>

                    <Form.Group controlId="apellido_paterno" className="col-6">
                        <Form.Label className="tw-text-red-600">Apellido 1</Form.Label>
                        <Form.Control name="apellido_paterno" type="text" required ref={
                            register({
                                pattern:
                                {
                                    value: /^[a-záéíóúñ]+(\s?[a-záéíóúñ])*$/i,
                                    message: "Apellido incorrecto"
                                }
                            })
                        }
                        />
                    </Form.Group>

                    <Form.Group controlId="apellido_materno" className="col-6">
                        <Form.Label>Apellido 2</Form.Label>
                        <Form.Control name="apellido_materno" type="text" ref={
                            register({
                                pattern:
                                {
                                    value: /^[a-záéíóúñ]+(\s?[a-záéíóúñ])*$/i,
                                    message: "Apellido incorrecto"
                                }
                            })
                        }
                        />
                    </Form.Group>

                    <Form.Group controlId="anio_nacimiento" className="col-6">
                        <Form.Label>Año de nacimiento ({fechaMinima}-{fechaMaxima})</Form.Label>
                        <Form.Control name="anio_nacimiento" type="number" pattern="[0-9]*" ref={register} min={fechaMinima} max={fechaMaxima} />
                        <p>{errors.anio_nacimiento && errors.anio_nacimiento.message}</p>
                    </Form.Group>

                    <Form.Group controlId="email" className="col-6">
                        <Form.Label className="tw-text-red-600">Correo electrónico</Form.Label>
                        <Form.Control name="email" type="email" required onChange={validarNivel} ref={
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

                    <Form.Group className="col-6">
                        <label htmlFor="contrasena" className="tw-text-red-600">Contraseña&nbsp;
                            <OverlayTrigger placement="right" overlay={renderTooltip}>
                                <i className="far fa-question-circle"></i>
                            </OverlayTrigger>
                        </label>
                        <InputGroup>
                            <Form.Control name="contrasena" required id="contrasena" className="pass-form-registro"
                                type={passwordShown ? "text" : "password"}
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
                        <p>{errors.contrasena && errors.contrasena.message}</p>
                    </Form.Group>

                    <Form.Group className="col-6">
                        <label htmlFor="confirmar_contrasena" className="tw-text-red-600">Confirmar contraseña</label>
                        <InputGroup>
                            <Form.Control name="confirmar_contrasena" id="confirmar_contrasena" required className="pass-form-registro"
                                type={confPasswordShown ? "text" : "password"}
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
                        <p>{errors.confirmar_contrasena && errors.confirmar_contrasena.message}</p>
                    </Form.Group>

                    <Form.Group controlId="celular" className="col-6">
                        <Form.Label>Número de teléfono</Form.Label>
                        <Form.Control name="celular" type="number" pattern="[0-9]*{10}" ref={register} />
                        <p>{errors.celular && errors.celular.message}</p>
                    </Form.Group>

                    <Form.Group controlId="id_instituto" className="col-6">
                        <Form.Label className="tw-text-red-600">Institución u organismo en el que labora</Form.Label>
                        <Form.Control as="select" name="id_instituto" required ref={register}>
                            <option value=""></option>
                            {institutos.map((value, index) => (
                                <option key={index} value={value.id_instituto}>
                                    {value.nombre_instituto}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="id_entidad" className="col-6">
                        <Form.Label className="tw-text-red-600">Entidad</Form.Label>
                        <Form.Control as="select" name="id_entidad" required ref={register} onChange={municipoCambio}>
                            <option value=""></option>
                            {entidades.map((value, index) => (
                                <option key={index} value={value.id_entidades}>
                                    {value.nombre_entidad}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="id_municipio" className="col-6">
                        <Form.Label className="tw-text-red-600">Municipio base</Form.Label>
                        <Form.Control as="select" name="id_municipio" required ref={register}>
                            <option value=""></option>
                            {
                                municipios.filter(mun => mun.cve_ent == refEntidad.current).map((munFiltrado, index) => (
                                    <option key={index} value={munFiltrado.id_municipios}>
                                        {munFiltrado.nombre_municipio}
                                    </option>
                                )
                                )
                            }
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="id_rol" className="col-6">
                        <Form.Label className="tw-text-red-600">Nivel de usuario solicitado</Form.Label>
                        <Form.Control as="select" name="id_rol" required onChange={validarNivel} ref={register}>
                            <option value=""></option>
                            {roles.map((value, index) => (
                                <option key={index} value={value.id_rol}>
                                    {value.rol}
                                </option>
                            ))}
                        </Form.Control>
                        <p>{errors.id_rol && errors.id_rol.message}</p>
                    </Form.Group>

                    <Form.Group controlId="id_ambito_actuacion" className="col-6">
                        <Form.Label className="tw-text-red-600">Ámbito de actuación</Form.Label>
                        <Form.Control as="select" name="id_ambito_actuacion" required ref={register}>
                            <option value=""></option>
                            {ambitos.map((value, index) => (
                                <option key={index} value={value.id_ambito_actuacion}>
                                    {value.ambito_actuacion}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <input className="col-6" type="submit" disabled={botonDesabilitar} />
                </Form>
            </div>
        </>
    )
}