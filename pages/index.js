import Head from 'next/head'
import { Carousel, Container, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt, faHandPointRight } from '@fortawesome/free-solid-svg-icons'
import {  useEffect } from 'react'

let classes = 'tw-text-white hover:tw-text-white hover:tw-no-underline'

export default function Home() {
  return (
    <>
      <Head>
        <title>SITU</title>
      </Head>
      
      <main>
        <Container>
          <section className="tw-flex sm:tw-flex-wrap tw-w-full tw-mt-12">
            <div className="tw-mx-5 sm:tw-mx-0 sm:tw-mb-10">
              <img
                src="/images/logo.png"
                alt="logo SITUs"
              />
            </div>
            <div>
              <Carousel indicators={false} >
              <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="/images/index/slidesHome10.jpg"
                    alt="Third slide"
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="/images/index/slidesHome1.jpg"
                    alt="First slide"
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="/images/index/slidesHome2.jpg"
                    alt="second slide"
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="/images/index/slidesHome3.jpg"
                    alt="Third slide"
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="/images/index/slidesHome4.jpg"
                    alt="Third slide"
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="/images/index/slidesHome5.jpg"
                    alt="Third slide"
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="/images/index/slidesHome6.jpg"
                    alt="Third slide"
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="/images/index/slidesHome7.jpg"
                    alt="Third slide"
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="/images/index/slidesHome8.jpg"
                    alt="Third slide"
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="/images/index/slidesHome9.jpg"
                    alt="Third slide"
                  />
                </Carousel.Item>
              </Carousel>
            </div>
          </section>
        </Container>
          <section className="tw-text-center tw-my-10">
            <h2 className="tw-text-center tw-mb-8 tw-font-bold">Sitios de interés</h2>
          </section>
          <section className="tw-pb-10">
            <Container>
              <div className="tw-grid tw-grid-rows-3 tw-grid-flow-col tw-gap-2 sm:tw-flex sm:tw-flex-wrap">
                <a href="https://www.snieg.mx/" target="_blank" className={classes + " tw-row-span-3 tw-py-60 sm:tw-w-full sm:tw-py-20 tw-cursor-pointer bg-curvas-1"}>
                  <h2 className="tw-px-5">SISTEMA NACIONAL DE INFORMACI&Oacute;N ESTAD&Iacute;STICA Y GEOGR&Aacute;FICA</h2>
                </a>
                <a href="http://gaia.inegi.org.mx/" target="_blank" className={classes + " tw-col-span-2 sm:tw-w-full tw-cursor-pointer bg-curvas-2"}>
                  <h2 className="tw-p-5 tw-text-white">MAPA DIGITAL DE M&Eacute;XICO</h2>
                </a>
                <a href="https://sig.ran.gob.mx/acceso.php" target="_blank" className={classes + " tw-row-span-2 sm:tw-w-full tw-cursor-pointer bg-curvas-3"}>
                  <h2 className="tw-p-5 tw-text-white">SISTEMA DE INFORMACI&Oacute;N GEOESPACIAL DEL CATASTRO RURAL</h2>
                </a>
                <a href="https://www.datos.gob.mx/" target="_blank" className={classes + " tw-row-span-2 sm:tw-w-full tw-cursor-pointer bg-curvas-4"}>
                  <h2 className="tw-p-5">INSTITUTO NACIONAL DE INFORMACI&Oacute;N  ESTAD&Iacute;STICA Y GEOGR&Aacute;FICA DE JALISCO</h2>
                </a>
              </div>
          </Container>
        </section>
      </main>
    </>
  )
}
