import Head from 'next/head'
import { Carousel, Container } from 'react-bootstrap'

export default function Home() {
  return (
    <>
      <Head>
        <title>SITU</title>
      </Head>
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
            <h2 className="tw-text-center tw-my-8 tw-font-bold">LO MÁS DESTACADO</h2>
            <div className="tw-flex tw-justify-between tw-flex-wrap tw-my-8">
              <div className="tw-w-4/12 md:tw-w-full tw-py-20 tw-bg-gray-200">
                <p className="tw-text-lg tw-px-5 tw-font-bold">Se pondran en marcha proyectos en más de 40 localidades.</p>
              </div>
              <div className="tw-w-4/12 md:tw-w-full tw-py-20">
                <p className="tw-text-lg tw-px-5 tw-font-bold">Ya estan en construcción alrededor de 120 obras de infraestructutra.</p>
              </div>
              <div className="tw-w-4/12 md:tw-w-full tw-py-20">
                <p className="tw-text-lg tw-px-5 tw-font-bold">CONCANACO firmó pacto con SEDATU para el sector vivienda.</p>
              </div>
            </div>
          </Container>
        </section>
        <section>
          <div className="tw-flex tw-justify-between tw-flex-wrap">
            <div className="tw-w-4/12 md:tw-w-full">
              <Carousel>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="/images/index/sliderSecundario.jpg"
                    alt="First slide"
                  />
                  <Carousel.Caption>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="/images/index/sliderSecundario.jpg"
                    alt="second slide"
                  />
                  <Carousel.Caption>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="/images/index/sliderSecundario.jpg"
                    alt="Third slide"
                  />
                  <Carousel.Caption>
                    <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
            </div>
            <div className="tw-w-8/12 md:tw-w-full tw-px-5 tw-bg-gray-200">
              <h2 className="tw-text-center tw-my-8 tw-font-bold">COMUNICADOS</h2>
              <div className="tw-flex tw-justify-between tw-flex-wrap">
                <div className="tw-w-6/12 md:tw-w-full tw-px-5 ">
                  <p className="tw-text-lg tw-px-5 tw-font-bold">Cartografía para detectar patrones de contagio COVID 19.</p>
                  <p className="tw-text-lg tw-px-5 tw-font-bold">12 de enero 2021</p>
                  <a href="#" className="tw-px-5 tw-font-semibold">Comunicado</a>
                </div>
                <div className="tw-w-6/12 md:tw-w-full tw-px-5">
                  <p className="tw-text-lg tw-px-5 tw-font-bold">Actualización de la plataforma Cartográfica.</p>
                  <p className="tw-text-lg tw-px-5 tw-font-bold">12 de enero 2021</p>
                  <a href="#" className="tw-px-5 tw-font-semibold">Comunicado</a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="tw-text-center">
          <h2 className="tw-text-center tw-mt-8 tw-mb-2 tw-font-bold">SITIOS DE INTERÉS</h2>
          <p className="tw-text-center tw-text-lg tw-px-5 tw-mb-8 tw-font-semibold">Conoce los sitios web que proporcionan Información Territorial</p>
        </section>
        <section className="tw-pb-10">
          <Container>
            <div className="tw-grid tw-grid-rows-3 tw-grid-flow-col tw-gap-2 md:tw-flex md:tw-flex-wrap">

              <div className="tw-row-span-3 tw-py-60 md:tw-w-full md:tw-py-20 tw-bg-yellow-700 tw-cursor-pointer">
                <h2 className="tw-px-5 tw-text-white">Mapa digital de México</h2>
                <p className="tw-p-5 tw-text-white tw-text-lg tw-font-bold">INEGI</p>
              </div>

              <div className="tw-col-span-2 md:tw-w-full tw-bg-green-500 tw-cursor-pointer">
                <h2 className="tw-p-5 tw-text-white">The National Map</h2>
                <p className="tw-p-5 tw-text-white tw-text-lg tw-font-bold">USGS</p>
              </div>

              <div className="tw-row-span-2 md:tw-w-full tw-bg-blue-500 tw-cursor-pointer">
                <h2 className="tw-p-5 tw-text-white">Geoportal</h2>
                <p className="tw-p-5 tw-text-white tw-text-lg tw-font-bold">CHILE</p>
              </div>

              <div className="tw-row-span-2 md:tw-w-full tw-bg-yellow-400 tw-cursor-pointer">
                <h2 className="tw-p-5 tw-text-white">Visor Urbano</h2>
                <p className="tw-p-5 tw-text-white tw-text-lg tw-font-bold">JALISCO</p>
              </div>

            </div>
          </Container>
        </section>
      </main>
    </>
  )
}
