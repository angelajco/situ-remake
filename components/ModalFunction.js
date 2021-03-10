import { Modal, Button } from 'react-bootstrap';

export default function ModalFunction(props) {
     return (
          <>
               <Modal show={props.show} onHide={() => props.onHide()} backdrop="static" keyboard={false}>
                    <Modal.Header className="tw-bg-inst-verdec tw-text-white">
                         <Modal.Title>
                              {props.datos.title}
                         </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                         {props.datos.body}
                    </Modal.Body>

                    <Modal.Footer className="tw-border-none">
                         <Button variant="secondary" onClick={() => props.onClick()}>Cancelar</Button>
                         <Button variant="outline-danger" onClick={() => props.funcion(props.datos.id)}>Aceptar</Button>
                    </Modal.Footer>
               </Modal>
          </>
     )
}