import {useState} from 'react'
import Link from 'next/link'
import Modal from 'react-bootstrap/Modal';

export default function verificacion() {
  const [smShow, setSmShow] = useState(false);
  return (
    <section className="container tw-text-center">
      <h1>Verificacion de usuario</h1>
      <div>
        <a className="tw-cursor-pointer" onClick={() => setSmShow(true)}>Click para verificar su cuenta</a>
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
            size="sm"
            show={smShow}
            onHide={() => setSmShow(false)}
            aria-labelledby="example-modal-sizes-title-sm"
          >
            <Modal.Body className="tw-bg-green-900 tw-text-white tw-rounded">Su correo se a verificado</Modal.Body>
          </Modal>
        </div>
    </section>
  )
}
