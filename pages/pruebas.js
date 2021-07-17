import React from 'react'
import { Container } from 'react-bootstrap'
import { useEffect, useState } from "react"
import { Modal, Button } from 'react-bootstrap'
//import Draggable, { DraggableCore } from "react-draggable";
import { ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Draggable from 'react-draggable';
import ModalDialog from 'react-bootstrap/ModalDialog';




export default function construccion() {

  const [show, setShow] = useState(false);
  const [showModalB, setShowModalB] = useState(false)

  const handleClose = () => setShowModalB(false);
  const handleShow = () => setShowModalB(true);

  //Para agregar la funcionalidad de mover modal
  function DraggableModalDialog(props) {
    //console.log(props);
    return (
      <Draggable handle=".modal-header"><ModalDialog  {...props} /></Draggable>
    )
  }



  return (
    <main>
      <Container>
        <div className="tw-py-8">
          <div className="tw-flex tw-justify-center">

            <Button variant="primary" onClick={handleShow}>
              Launch demo modal
            </Button>

           
              <Modal show={showModalB} onHide={() => setShowModalB(!showModalB)} dialogAs={DraggableModalDialog}
                keyboard={false} className="modal-analisis" contentClassName="modal-redimensionable">
                <Modal.Header closeButton >
                  <Modal.Title><b>Busqueda</b></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>Prueba de modal</p>
                </Modal.Body>
              </Modal >







            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
              </Modal.Header>
              <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>




          </div>
        </div>
      </Container>
    </main>
  )
}
