import { useRef, useState } from "react";
import { Form, Navbar, Container, Nav } from 'react-bootstrap'
import { useForm } from "react-hook-form";
import axios from 'axios'

import Link from 'next/link'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import ModalComponent from '../../components/ModalComponent';
import Head from 'next/head'

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

    //Para construir el formulario
    const { register, handleSubmit, watch, errors } = useForm();

    //Watch ve los cambios en los inputs cuando se modifican
    const refEmail = useRef();
    refEmail.current = watch("correo", "");
    const refContrasena = useRef();
    refContrasena.current = watch("contrasena", "");

    //Funcion a ejecutar al darle el boton de iniciar sesion
    const onSubmit = async () => {
        //conexion con la api, donde verifica que los campos existan
        axios.get(`http://172.16.117.11/wa/catInstituto`, {
            params: {
                email: refEmail.current,
                contrasena: refContrasena.current
            }
        })
            //si se logro la conexion
            .then(response => {
                console.log(response.data);
                //usuario encontrado
                if (response.data.length > 0) {
                    console.log("exito2");
                    // window.location.href = "/"
                }
                //usuario no encontrado
                else {
                    //cambiamos show a true
                    handleShow();
                    //Datos a enviar al modal si el usuario es incorrecto
                    setDatosModal({
                        title: 'Información incorrecta',
                        body: 'La información ingresada es incorrecta, favor de verificar'
                    })
                }
            })
            //no se logro la conexion
            .catch(error => {
                console.log("no se logro la conexion")
                console.log(error);
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
                onClick={handleClose} />

            <Header />
            <Navbar bg="light" expand="lg" className="tw-text-center">
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mx-auto">
                            <Link href="/">
                                <a className="tw-px-10">INICIO</a>
                            </Link>
                            <Link href="#">
                                <a className="tw-px-10">PLANEACIÓN<br />MUNICIPAL</a>
                            </Link>
                            <Link href="#">
                                <a className="tw-px-10">ANÁLISIS<br />GEOGRÁFICO</a>
                            </Link>
                            <Link href="#">
                                <a className="tw-px-10">INDICADORES<br />ESTADÍSTICOS</a>
                            </Link>
                            <Link href="#">
                                <a className="tw-px-10">CONSULTA<br />DOCUMENTAL</a>
                            </Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <main>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <p className="tw-text-center">Bienvenido</p>
                            <p className="tw-text-justify">El Sistema de Información Territorial y Urbana <b>(SITU)</b> se concibe como una herramienta que permite recopilar, organizar, integrar, difundir y actualizar la información geográfica documental así como indicadores sobre el ordenamiento territorial agrario, el desarrollo urbano y vivienda de México.</p>
                            <p className="tw-text-justify">El SITU se integrá por información e indicadores generados por los tres órdenes del gobierno, instancias de gobernanza metropolitana, así como otros registros e inventario del territorio derivados de actividades científicas, academicas o de cualquier índole en materia de ordenamiento territorial y desarrollo urbano.</p>

                            <div className="m-auto cuadro-login">
                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <Form.Group controlId="correo">
                                        <Form.Label className="">Correo electrónico</Form.Label>
                                        <Form.Control name="correo" type="email" required ref={register} />
                                    </Form.Group>
                                    <Form.Group controlId="contrasena">
                                        <Form.Label className="">Contraseña</Form.Label>
                                        <Form.Control name="contrasena" type="password" placeholder="" required ref={register} />
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
                                            <input className="tw-float-right" type="submit" />
                                        </div>
                                    </div>
                                </Form>
                            </div>

                        </div>
                    </div>
                </div>

            </main>

            <Footer />

        </>
    )
}