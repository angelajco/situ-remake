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
                              <Modal.Header className="tw-bg-inst-verdec tw-text-white">
                                   <Modal.Title>
                                        {props.datos.title}
                                   </Modal.Title>
                              </Modal.Header>
                              :
                              <Modal.Header className="tw-bg-inst-verdec tw-text-white" closeButton>
                                   <Modal.Title>
                                        {props.datos.title}
                                   </Modal.Title>
                              </Modal.Header>
                    }

                    <Modal.Body>
                         {props.datos.body}
                    </Modal.Body>

                    <Modal.Footer className="tw-border-none">
                         {
                              //Verifica si existen una redireccion, en caso contrario solo cierra el modal
                              (props.datos.ruta != undefined) ?
                                   <Button variant="outline-danger" onClick={() => redireccion(props.datos.ruta)}>Aceptar</Button> :
                                   <Button variant="outline-danger" onClick={() => props.onClick()}>Aceptar</Button>
                         }
                    </Modal.Footer>
               </Modal>
          </>
     )
}