import React from 'react'
import { Container } from 'react-bootstrap'
import ContenedorCD from '../components/ContenedorCD';

export default function construccion() {
  return (
    <main>
      <Container>
        <div className="tw-py-8">
          <div className="tw-flex tw-justify-center">
            <ContenedorCD></ContenedorCD>
          </div>
        </div>
      </Container>
    </main>
  )
}
