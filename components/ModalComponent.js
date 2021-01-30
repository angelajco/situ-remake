import { Modal, Button } from 'react-bootstrap';

export default function ModalComponent(props) {
     return (
          <>
               <Modal show={props.show} onHide={() => props.onHide()}>
                    <Modal.Header closeButton>
                         <Modal.Title>
                              {props.datos.title}
                         </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                         {props.datos.body}
                    </Modal.Body>

                    <Modal.Footer>
                         {
                              //Verifica si existen una redireccion, en caso contrario solo cierra el modal
                              (props.redireccion != undefined) ?
                                   <Button variant="primary" onClick={() => props.redireccion()}  >Aceptar</Button> :
                                   <Button variant="primary" onClick={() => props.onClick()}  >Aceptar</Button>
                         }
                    </Modal.Footer>

               </Modal>
          </ >
     )
}