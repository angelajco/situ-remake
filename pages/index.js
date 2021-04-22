import Head from 'next/head'
import { Carousel, Container, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt, faHandPointRight } from '@fortawesome/free-solid-svg-icons'
import {  useEffect } from 'react'

let classes = 'tw-text-black hover:tw-text-black hover:tw-no-underline tw-cursor-pointer'

export default function Home() {
  return (
    <>
      <Head>
        <title>SITU</title>
      </Head>
      
      <main>
        <section className="situ-index">
          <img src="/images/index/foto_aerea.jpg" className="tw-w-full" alt="Sistema de Información Territorial y Urbana SITU"/>
        </section>
        <section className="container-fluid custom-max-width custom-mx-t-2">
          <p className="custom-inst-text">
            Bienvenidos al Sistema de Informaci&oacute;n Territorial y Urbana (<b>SITU</b>): Datos en Territorio. Una plataforma que contribuye a transparentar la informaci&oacute;n para el dise&ntilde;o e implementaci&oacute;n de políticas p&uacute;blicas y mejorar la vinculaci&oacute;n de los tres &oacute;rdenes de gobierno en materia de Ordenamiento Territorial, Desarrollo Agrario, Desarrollo Urbano, Suelo y Vivienda.
          </p>
          <p className="custom-inst-text">
            El SITU es un sistema p&uacute;blico, dise&ntilde;ado para almacenar, organizar, sistematizar, procesar, actualizar y difundir la informaci&oacute;n geogr&aacute;fica, documental, estad&iacute;stica e indicadores sobre los instrumentos y procesos de ordenamiento territorial, desarrollo urbano, gobernanza metropolitana, desarrollo agrario, vivienda, catastro y otros temas relacionados con el desarrollo territorial.
            {/* El SITU es un sistema p&uacute;blico, dise&ntilde;ado para almacenar, organizar, sistematizar, procesar, actualizar y difundir la informaci&oacute;n geogr&aacute;fica, documental, estad&iacute;stica e indicadores sobre los instrumentos y procesos de ordenamiento territorial, desarrollo urbano, gobernanza metropolitana, desarrollo agrario, vivienda, catastro y otros temas relacionados con el territorio, que permitan facilitar y detonar la planeaci&oacute;n territorial a nivel municipal , as&iacute; como constituir un acervo de los principales informes y documentos relevantes derivados de actividades cient&iacute;ficas, acad&eacute;micas, trabajos t&eacute;cnicos o de cualquier &iacute;ndole en materia de ordenamiento territorial y desarrollo urbano. */}
          </p>
          <p className="custom-inst-text">
            A trav&eacute;s del uso de sus m&oacute;dulos se busca facilitar y detonar la planeaci&oacute;n territorial a nivel municipal , as&iacute; como constituir un acervo de los principales informes y documentos relevantes derivados de actividades cient&iacute;ficas, acad&eacute;micas, trabajos t&eacute;cnicos o de cualquier índole en materia de ordenamiento territorial y desarrollo urbano.
          </p>
        </section>
        <div className="interesting-sites">
          <section className="container-fluid custom-max-width custom-mx-t-2 custom-px-t-1">
            <h2 className="tw-text-titulo text-center ">
              <b>
                SITIOS DE INTER&Eacute;S
              </b>
            </h2>
            <section className="container-fluid custom-mx-t-1">
              <div className="row ">
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12 custom-mx-b-1">
                  <a href="https://www.snieg.mx/" target="_blank" className={classes}>
                    <div className="row justify-content-center">
                      <img src="/images/index/cuad1.jpg" className="interesting-sites-images"/>
                    </div>
                    <div className="row justify-content-center">
                      <h5>
                        <b>
                          SNIEG
                        </b>
                      </h5>
                      <small className="text-center w-100">
                        SISTEMA NACIONAL DE INFORMACI&Oacute;N ESTAD&Iacute;STICA Y GEOGR&Aacute;FICA
                      </small>
                    </div>
                  </a>
                </div>
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12 custom-mx-b-1">
                  <a href="http://gaia.inegi.org.mx/" target="_blank" className={classes}>
                    <div className="row justify-content-center">
                      <img src="/images/index/cuad2.jpg" className="interesting-sites-images"/>
                    </div>
                    <div className="row justify-content-center">
                      <h5>
                        <b>
                          GAIA
                        </b>
                      </h5>
                      <small className="text-center w-100">
                        MAPA DIGITAL DE M&Eacute;XICO
                      </small>
                    </div>
                  </a>
                </div>
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12 custom-mx-b-1">
                  <a href="https://sig.ran.gob.mx/acceso.php" target="_blank" className={classes}>
                    <div className="row justify-content-center">
                      <img src="/images/index/cuad3.jpg" className="interesting-sites-images"/>
                    </div>
                    <div className="row justify-content-center">
                      <h5>
                        <b>
                          SIG
                        </b>
                      </h5>
                      <small className="text-center w-100">
                        SISTEMA DE INFORMACI&Oacute;N GEOESPACIAL DEL CATASTRO RURAL
                      </small>
                    </div>
                  </a>
                </div>
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12 custom-mx-b-1">
                  <a href="https://iieg.gob.mx/" target="_blank" className={classes}>
                    <div className="row justify-content-center">
                      <img src="/images/index/cuad4.jpg" className="interesting-sites-images"/>
                    </div>
                    <div className="row justify-content-center">
                      <h5>
                        <b>
                          IIEG
                        </b>
                      </h5>
                      <small className="text-center w-100">
                        INSTITUTO DE INFORMACI&Oacute;N ESTAD&Iacute;STICA Y GEOGR&Aacute;FICA DE JALISCO
                      </small>
                    </div>
                  </a>
                </div>
              </div>
            </section>
          </section>
        </div>
      </main>
    </>
  )
}
