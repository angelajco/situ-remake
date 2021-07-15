import React from 'react'
import { Container } from 'react-bootstrap'
import ContenedorCD from '../../components/ContenedorCD';

export default function construccion() {
  return (
    <main>
      <Container>
        <div className="tw-py-8">
          <div className="tw-flex tw-justify-center">
            <div className="col-sm-12 col-12 col-md-12 col-lg-12">
              <ContenedorCD></ContenedorCD>
            </div>
          </div>
        </div>
      </Container>
    </main>
  )
}