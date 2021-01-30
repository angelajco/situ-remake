import Footer from '../components/Footer'
import Header from '../components/Header'
import Menu from '../components/Menu'

import { Carousel, Container } from 'react-bootstrap'

export default function Home() {
  return (
    <>
      <Header/>
      <Menu/>
      <main>
        <section>
          <Carousel>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/images/index/slider.jpg"
                alt="First slide"
              />
              <Carousel.Caption>
                <h3>Datos en el Territorio</h3>
                <p>Es una plataforma digital que organiza, actualiza y difunde la información e indicadores sobre el ordenamiento territorial y el desarrollo urbano en México.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/images/index/slider.jpg"
                alt="second slide"
              />
              <Carousel.Caption>
                <h3>Imagen 2</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/images/index/slider.jpg"
                alt="Third slide"
              />

              <Carousel.Caption>
                <h3>Imagen 3</h3>
                <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </section>
        <section>
          <Container>
            <div className="tw-flex tw-justify-between tw-flex-wrap">
              <div className="tw-w-4/12 md:tw-w-full">
                <p>Se pondran en marcha proyectos en más de 40 localidades.</p>
              </div>
              <div className="tw-w-4/12 md:tw-w-full">
                <p>Ya estan en construcción alrededor de 120 obras de infraestructutra.</p>
              </div>
              <div className="tw-w-4/12 md:tw-w-full">
                <p>CONCANACO firmó pacto con SEDATU para el sector vivienda.</p>
              </div>
            </div>
          </Container>
        </section>
        <section>
          <div className="tw-flex tw-justify-between tw-flex-wrap">
            <div className="tw-w-4/12 md:tw-w-full">
              SUBCARRUSEL
            </div>
            <div className="tw-w-8/12 md:tw-w-full">
              <h2>COMUNICADOS</h2>
              <div className="tw-flex tw-justify-between tw-flex-wrap">
                <div className="tw-w-6/12 md:tw-w-full">
                  <p>Cartografía para detectar patrones de contagio COVID 19.</p>
                  <p>12 de enero 2021</p>
                </div>
                <div className="tw-w-6/12 md:tw-w-full">
                  <p>Actualización de la plataforma Cartográfica.</p>
                  <p>12 de enero 2021</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="tw-text-center">
          <h2>SITIOS DE INTERÉS</h2>
          <p>Conoce los sitios web que proporcionan Información Territorial</p>
        </section>
        <section className="tw-pb-10">
          <Container>
            <div className="tw-grid tw-grid-rows-3 md:tw-grid-rows-4 tw-grid-flow-col md:tw-grid-cols-1 tw-gap-2">
              <div className="tw-row-span-3 md:tw-col-span-1 tw-bg-yellow-500">
                <h2>Mapa digital de México</h2>
              </div>
              <div className="tw-col-span-2 md:tw-col-span-1 tw-bg-blue-500">
                <h2>The National Map</h2>
              </div>
              <div className="tw-row-span-2 tw-col-span-1 md:tw-col-span-1 tw-bg-green-500">
                <h2>Geoportal</h2>
              </div>
              <div className="tw-row-span-2 tw-col-span-1 md:tw-col-span-1 tw-bg-red-500">
                <h2>Visor Urbano</h2>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer/>
    </>
  )
}
