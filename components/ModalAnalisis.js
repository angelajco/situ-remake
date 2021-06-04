import { Modal } from 'react-bootstrap';

export default function ModalComponent(props) {
     return (
          <>
               <Modal show={props.show} onHide={() => props.onHide()} keyboard={false} backdrop="static" className="modal-analisis">
                    <Modal.Header closeButton>
                         <Modal.Title>
                              {props.datos.title}
                         </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                         {props.datos.body}
                    </Modal.Body>
               </Modal>
          </>
     )
}