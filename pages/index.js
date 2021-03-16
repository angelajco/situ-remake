import Head from 'next/head'
import { Carousel, Container, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt, faHandPointRight } from '@fortawesome/free-solid-svg-icons'
import {  useEffect } from 'react'


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
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="/images/index/slidesHome10.jpg"
                    alt="Third slide"
                  />
                </Carousel.Item>
              </Carousel>
            </div>
          </section>
        </Container>
        <section className="tw-flex tw-my-10">
          <div className="sm:tw-hidden">
            <img
              src="/images/index/foto_izq.jpg"
              alt="imagen de una avenida"
            />
          </div>
          <div className="tw-mx-5">
            <div>
              <h2 className="tw-text-center tw-my-8 tw-font-bold">Lo más destacado</h2>
              <div className="tw-flex tw-justify-between tw-flex-wrap tw-my-8">
                <div className="tw-w-4/12 sm:tw-w-full tw-pt-10">
                  <FontAwesomeIcon icon={faMapMarkerAlt} size="2x" />
                  <h3 className="tw-text-2xl tw-font-bold">Lorem ipsum dolor sit amet</h3>
                  <p className="tw-pr-8">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris venenatis finibus diam, a sodales nunc sollicitudin at.</p>
                  <FontAwesomeIcon icon={faHandPointRight} size="lg" />
                </div>
                <div className="tw-w-4/12 sm:tw-w-full tw-pt-10">
                  <FontAwesomeIcon icon={faMapMarkerAlt} size="2x" />
                  <h3 className="tw-text-2xl tw-font-bold">Lorem ipsum dolor sit amet</h3>
                  <p className="tw-pr-8">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris venenatis finibus diam, a sodales nunc sollicitudin at.</p>
                  <FontAwesomeIcon icon={faHandPointRight} size="lg" />
                </div>
                <div className="tw-w-4/12 sm:tw-w-full tw-pt-10">
                  <FontAwesomeIcon icon={faMapMarkerAlt} size="2x" />
                  <h3 className="tw-text-2xl tw-font-bold">Lorem ipsum dolor sit amet</h3>
                  <p className="tw-pr-8">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris venenatis finibus diam, a sodales nunc sollicitudin at.</p>
                  <FontAwesomeIcon icon={faHandPointRight} size="lg" />
                </div>
              </div>
            </div>
            <div>
              <h2 className="tw-text-center tw-my-8 tw-font-bold">Comunicados</h2>
              <div className="tw-flex tw-justify-between tw-flex-wrap tw-my-8">
                <div className="tw-w-4/12 sm:tw-w-full tw-pt-10">
                  <FontAwesomeIcon icon={faMapMarkerAlt} size="2x" />
                  <h3 className="tw-text-2xl tw-font-bold">Lorem ipsum dolor sit amet</h3>
                  <p className="tw-pr-8">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris venenatis finibus diam, a sodales nunc sollicitudin at.</p>
                  <FontAwesomeIcon icon={faHandPointRight} size="lg" />
                </div>
                <div className="tw-w-4/12 sm:tw-w-full tw-pt-10">
                  <FontAwesomeIcon icon={faMapMarkerAlt} size="2x" />
                  <h3 className="tw-text-2xl tw-font-bold">Lorem ipsum dolor sit amet</h3>
                  <p className="tw-pr-8">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris venenatis finibus diam, a sodales nunc sollicitudin at.</p>
                  <FontAwesomeIcon icon={faHandPointRight} size="lg" />
                </div>
                <div className="tw-w-4/12 sm:tw-w-full tw-pt-10">
                  <FontAwesomeIcon icon={faMapMarkerAlt} size="2x" />
                  <h3 className="tw-text-2xl tw-font-bold">Lorem ipsum dolor sit amet</h3>
                  <p className="tw-pr-8">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris venenatis finibus diam, a sodales nunc sollicitudin at.</p>
                  <FontAwesomeIcon icon={faHandPointRight} size="lg" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="tw-text-center">
          <h2 className="tw-text-center tw-mb-8 tw-font-bold">Sitios de interés</h2>
        </section>
        <section className="tw-pb-10">
          <Container>
            <div className="tw-grid tw-grid-rows-3 tw-grid-flow-col tw-gap-2 sm:tw-flex sm:tw-flex-wrap">
              <div className="tw-row-span-3 tw-py-60 sm:tw-w-full sm:tw-py-20 tw-cursor-pointer bg-curvas-1">
                <h2 className="tw-px-5">SISTEMA NACIONAL DE INFORMACIÓN ESTADÍSTICA Y GEOGRÁFICA</h2>
              </div>
              <div className="tw-col-span-2 sm:tw-w-full tw-cursor-pointer bg-curvas-2">
                <h2 className="tw-p-5 tw-text-white">REGISTRO AGRARIO NACIONAL</h2>
              </div>
              <div className="tw-row-span-2 sm:tw-w-full tw-cursor-pointer bg-curvas-3">
                <h2 className="tw-p-5 tw-text-white">SISTEMA DE INFORMACIÓN GEOESPACIAL DEL CATASTRO RURAL</h2>
              </div>
              <div className="tw-row-span-2 sm:tw-w-full tw-cursor-pointer bg-curvas-4">
                <h2 className="tw-p-5">DATOS ABIERTOS</h2>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  )
}
