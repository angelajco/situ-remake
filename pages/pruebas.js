import React from 'react'
import { Container } from 'react-bootstrap'
import { useEffect, useState } from "react"
import { Modal, Button } from 'react-bootstrap'
import Draggable, { DraggableCore } from "react-draggable";
import { ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import ContenedorCD1 from '../components/ContenedorCD';
import {OverlayTrigger, Tooltip} from 'react-bootstrap'


export default function construccion() {

  return (
    <main>
      <Container>
        <ContenedorCD1></ContenedorCD1>
      </Container>
    </main>
  )
}
