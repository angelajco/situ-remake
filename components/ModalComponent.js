import { Modal, Button } from 'react-bootstrap';

export default function ModalComponent(props) {

     //A donde va a mandar el modal a darle aceptar en caso de que haya un direccionamiento
     const redireccion = (valor) => {
          return window.location.href = valor;
     }

     return (        
          <>
               <Modal show={props.show} onHide={() => props.onHide()}>
                    {
                         (props.datos.ruta != undefined) ?
                              <Modal.Header>
                                   <Modal.Title>
                                        {props.datos.title}
                                   </Modal.Title>
                              </Modal.Header>
                              :
                              <Modal.Header closeButton>
                                   <Modal.Title>
                                        {props.datos.title}
                                   </Modal.Title>
                              </Modal.Header>
                    }

                    <Modal.Body>
                         {props.datos.body}
                    </Modal.Body>

                    <Modal.Footer>
                         {
                              //Verifica si existen una redireccion, en caso contrario solo cierra el modal
                              (props.datos.ruta != undefined) ?
                                   <Button variant="primary" onClick={() => redireccion(props.datos.ruta)}>Ruta</Button> :
                                   <Button variant="primary" onClick={() => props.onClick()}>Aceptar</Button>
                         }
                    </Modal.Footer>
               </Modal>
          </>
     )
}