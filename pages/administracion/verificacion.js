import Router, { useRouter } from 'next/router'

import axios from 'axios'
import { useEffect, useState } from 'react'

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
        url: 'http://172.16.117.11/wa/publico/verifyEmail',
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

    const correoTemp = { 'email': 'vodka@maildrop.ccf' }
    console.log(correoTemp)

    var config = {
      method: 'post',
      url: 'http://172.16.117.11/wa/publico/sendNewEmail',
      headers: {
        'Content-Type': 'application/json'
      },
      data: correoTemp
    };

    console.log(config)

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
        <div className="container tw-text-center">
          <div className="row">
            <div className="col-12">
              {
                datosPeticion['message-type'] == 1
                  ?
                  (
                    <>
                      {datosPeticion['message']}
                      <button onClick={reenviaCorreo}> Reenviar correo</button>
                    </>
                  )
                  :
                  datosPeticion['message']
              }
            </div>
          </div>
        </div>
      </main>
    </>
  )
}