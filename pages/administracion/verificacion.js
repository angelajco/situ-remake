import { useState } from 'react'
import Link from 'next/link'
import Modal from '../../components/ModalComponent';
import Header from '../../components/Header'
import Menu from '../../components/Menu'
import Footer from '../../components/Footer'

export default function verificacion() {

  //Datos para el modal
  const [show, setShow] = useState(false);
  const [datosModal, setDatosModal] = useState(
    {
      title: '',
      body: ''
    }
  );

  //Estados para mostrar el modal
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  //A donde va a mandar el modal a darle aceptar
  const redireccion = () => {
    return window.location.href = "/"
  }

  const muestraModal = () => {
    handleShow();
    setDatosModal({
      title: 'Verificación de correo',
      body: 'Su correo se ha verificado'
    })
  }

  return (
    <>

      <Header />
      <Menu />

      <section className="container tw-text-center">
        <h1>Verificacion de usuario</h1>
        <div>
          <a className="tw-cursor-pointer" onClick={() => muestraModal()}>Click para verificar su cuenta</a>
          <ul className="tw-flex tw-justify-center tw-mt-6">
            <li className="tw-bg-green-900 tw-mx-5 tw-rounded">
              <Link href="/">
                <a className="tw-text-white tw-px-4 tw-py-2">Página de inicio</a>
              </Link>
            </li>
            <li className="tw-bg-green-900 tw-mx-5 tw-rounded">
              <Link href="/inicio-sesion">
                <a className="tw-text-white tw-px-4 tw-py-2">Iniciar sesión</a>
              </Link>
            </li>
          </ul>

          <Modal
            show={show}
            datos={datosModal}
            onHide={handleClose}
            onClick={handleClose}
            redireccion={redireccion}
          />

        </div>
      </section>

      <Footer />
    </>
  )
}
