import React from 'react'
import { Container } from 'react-bootstrap'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Menu from '../components/Menu'

export default function construccion() {
  return (
    <main>
      <Header />
      <Menu />
        <Container>
          <div className="tw-py-8">
            <div className="tw-flex tw-justify-center">
            <img src="/images/index/construccion.jpeg" alt="figura de una parsona de la construccion trabajando" />
            </div>
          </div>
        </Container>
      <Footer />
    </main>
  )
}
