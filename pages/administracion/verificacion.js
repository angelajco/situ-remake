import { useRouter } from 'next/router'

import axios from 'axios'
import { useEffect, useState } from 'react'

import {Button} from 'react-bootstrap'

import ModalComponent from '../../components/ModalComponent';

export default function Verificacion() {
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

  //Para ver la URL
  const router = useRouter()

  //Para guardar los mensajes que vienen del API
  const [datosPeticion, setDatosPeticion] = useState([])

  //Para guardar el correo
  const [correo, setCorreo] = useState()

  //Para guardar los mensajes del front
  var mensaje = [];

  useEffect(() => {
    if (router.query['permalink'] !== undefined) {

      var config = {
        method: 'get',
        url: `${process.env.ruta}/wa/publico/verifyEmail`,
        params: {
          permalink: router.query['permalink']
        },
      };

      axios(config)
        .then(function (response) {
          if (response.data['message-type'] == 1) {
            setCorreo(response.data['message-subject'])
          }
          setDatosPeticion(response.data);
        })
        .catch(function (error) {
          console.log(error.response)
          mensaje['message'] = "El tiempo de respuesta se ha agotado, favor de intentar más tarde."
          setDatosPeticion(mensaje)
        });
    }
    else {
      mensaje['message'] = "No tiene permisos para ver esta página."
      setDatosPeticion(mensaje)
    }

  }, [router.query['permalink']])

  const reenviaCorreo = () => {

    const correoDatos = { 'email': correo }

    var config = {
      method: 'post',
      url: `${process.env.ruta}/wa/publico/sendNewEmail`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: correoDatos
    };

    axios(config)
      .then(function (response) {
        handleShow();
        setDatosModal({
          title: response.data['message-subject'],
          body: response.data['message']
        })
      })
      .catch(function (error) {
        console.log(error)
        handleShow();
        setDatosModal({
          title: "Conexión no establecida",
          body: "El tiempo de respuesta se ha agotado, favor de intentar más tarde."
        })
      })
  }

  return (
    <>
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
              <h1 className="titulo-h1">Verificación de correo electrónico</h1>
              <div className="mensajes-admin">
                {
                  datosPeticion['message-type'] == 1
                    ?
                    (
                      <>
                        {datosPeticion['message']}
                        <div className="tw-pt-6">
                          <Button variant="outline-secondary" className="btn-admin" onClick={reenviaCorreo}>REENVIAR CORREO</Button>
                        </div>
                      </>
                    )
                    :
                    datosPeticion['message']
                }
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  )
}