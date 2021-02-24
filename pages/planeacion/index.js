import { useEffect, useState, useRef } from 'react';
import { Form } from 'react-bootstrap'
import { useForm } from "react-hook-form";
import Head from 'next/head'
import dynamic from 'next/dynamic'
// import Router, { useRouter } from 'next/router'

export default function index() {

  //Importa dinámicamente el mapa
  const Map = dynamic(
    () => import('../../components/MapPlaneacion'),
    {
      loading: () => <p>El mapa está cargando</p>,
      ssr: false
    }
  )

  //Para ver la URL
  // const router = useRouter()
  // let  municipio = router.query.id_municipio
  // let entidad = router.query.id_entidad
  // let  municipio = '00000'
  // let entidad = 'sin nombre'
  // console.log(refEntidad.current)
  // console.log(refMunicipio.current)
  // Para el formulario
  const { register, handleSubmit, watch, clearErrors, setError, errors } = useForm();
  
  const refEntidad = useRef();
  refEntidad.current = watch("id_entidad", "");
  const refMunicipio = useRef();
  refMunicipio.current = watch("id_municipio", "");
  // municipio = refMunicipio.current
  console.log(refEntidad.current)
  console.log(refMunicipio.current)

  // console.log(entidades)
  // console.log(municipios)

  class Nucleo {
    constructor() {
      // Recibir el modelo
      this.modelo = null;
      // La peticion se hizo y el modelo es valido
      this.modeloValido = false;
      // La peticion se hizo con un resultado exitoso o no exitoso
      this.modeloCargado = false;

      this.claveMun = '';

      this.nombreMun = '';
    }

    descargaModelo(rutaXml) {

      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };

      fetch(rutaXml, requestOptions)
        .then(response => response.text())
        .then(result => {
          let parser = new DOMParser();
          let xmlDoc = parser.parseFromString(result, "text/xml")
          // console.log(xmlDoc)
          this.procesaModelo(xmlDoc)
        })
        .catch(error => {
          console.log('Error en el modelo')
          console.log('error', error)
        });
    }

    procesaModelo(xmlDoc) {
      this.modelo = new ModeloContenido(xmlDoc, this)
      this.modeloCargado = true;
      this.modeloValido = true;
      // console.log(this.modelo)
    }

    traduceVariable(cadena) {

      if (cadena.includes('@')) {
        let palabras = cadena.split(' ')
        let salida = ' '

        for (let index = 0; index < palabras.length; index++) {

          if (palabras[index].charAt(0) === '@') {

            if (palabras[index] === '@claveMun') {
              salida = salida + this.claveMun + ' '
            } else if (palabras[index] === '@nombreMun') {
              salida = salida + this.nombreMun + ' '
            }

          } else {
            salida = salida + palabras[index] + ' '
          }
        }
        return salida
      } else {
        return cadena
      }
    }
    
    actualizaDatos(idMun, nombreMun) {
      this.claveMun = idMun;
      this.nombreMun = nombreMun;
    }

  }

  class ModeloContenido {

    constructor(xmlDoc, padre) {
      this.titulo = ''
      this.secciones = []
      this.nucleo = padre

      let nodos = xmlDoc.documentElement.childNodes
      // console.log('Constructor')
      for (let i = 0; i < nodos.length; i++) {
        if (nodos[i].nodeName == 'titulo') {
          // console.log(nodos[i].firstChild.nodeValue)
          this.titulo = nodos[i].firstChild.nodeValue
          // console.log(this.titulo)
          // setTitulo(this.titulo)
        }
        if (nodos[i].nodeName === 'secciones') {
          for (let j = 0; j < nodos[i].childNodes.length; j++) {
            if (nodos[i].childNodes[j].nodeName === 'seccion') {
              // console.log(nodos[i].childNodes[j])
              let nuevo = new SeccionModelo(nodos[i].childNodes[j], this.nucleo)
              // console.log(nuevo)
              this.secciones.push(nuevo)
            }
          }
        }
      }
    }
  }

  class SeccionModelo {
    constructor(nodoXml, nucleo) {
      this.ID = nodoXml.getAttribute('id')
      this.claseCSS = ''
      this.titulo = ''
      this.nucleo = nucleo
      this.tipo = nodoXml.getAttribute('tipo')
      for (let index = 0; index < nodoXml.childNodes.length; index++) {
        if (nodoXml.childNodes[index].nodeName === 'titulo') {
          this.titulo = nodoXml.childNodes[index].firstChild.nodeValue
        }
      }
    }

    render() {
      let salida = `<h3>${this.nucleo.traduceVariable(this.titulo)}</h3>`
      if (this.tipo==='mapaBase') {
        salida = salida + `<div id="map">Mapa aqui</div>`
      }
      return { __html: salida }
    }

  }

  const nucleo = new Nucleo()
  nucleo.descargaModelo('http://172.16.117.11/demos/modelos/MetaModeloHPM_01.xml')
  // console.log(secciones)

  // Para el titulo
  const [tituloModelo, setTituloModelo] = useState('')

  //Para las secciones
  const [seccionesModelo, setSeccionesModelo] = useState([])

  // Para desplegar el mapa
  const [ponerMapa, setPonerMapa] = useState(false)

  function desplegarDatos() {
    // console.log(nucleo.modeloCargado)
    // console.log(nucleo.modelo.titulo)
    // console.log(municipios)
    console.log('Antes del ref municipios')
    console.log(refMunicipio.current)
    municipios.filter(mun => mun.id_municipios == refMunicipio.current).map((munFiltrado, index) => ( 
      nucleo.actualizaDatos(munFiltrado.id_municipios, munFiltrado.nombre_municipio)
    ))

    setTituloModelo(nucleo.modelo.titulo)
    setPonerMapa(true)

    let dummy = []

    for (let i = 0; i < nucleo.modelo.secciones.length; i++) {
      dummy.push(nucleo.modelo.secciones[i].render())
    }

    // console.log(dummy)
    setSeccionesModelo(dummy)
  }

  const [entidades, setEntidades] = useState([]);
  const [municipios, setMunicipios] = useState([]);

  useEffect(() => {
    //Entidades
    fetch("http://172.16.117.11/wa/publico/catEntidades")
      .then(res => res.json())
      .then(
        (data) => setEntidades(data),
        (error) => console.log(error)
      )
  }, [])

  const municipoCambio = () => {
    //Municipios
    fetch("http://172.16.117.11/wa/publico/catMunicipios")
      .then(res => res.json())
      .then(
        (data) => setMunicipios(data),
        (error) => console.log(error)
      )
  }

  // console.log(entidades)
  console.log(municipios)
  // console.log(router.query)
  // console.log(router.query.id_municipio)
  // console.log(router.query.id_entidad)

  return (
    <>
      <Head>
        <title>Planeación Municipal</title>
      </Head>
      <div className="tw-flex tw-mx-5 tw-my-8">
        <section className="tw-w-full">
          <div>
            <Form onSubmit={handleSubmit(desplegarDatos)}>
              <Form.Group controlId="id_entidad">
                <Form.Control as="select" name="id_entidad" required ref={register} onChange={municipoCambio}>
                  <option value="" hidden>Entidad</option>
                  {entidades.map((value, index) => (
                    <option key={index} value={value.id_entidades}>
                      {value.nombre_entidad}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="id_municipio">
                <Form.Control as="select" name="id_municipio" required ref={register}>
                  <option value="" hidden>Municipio</option>
                  {
                    municipios.filter(mun => mun.cve_ent == refEntidad.current).map((munFiltrado, index) => (
                      <option key={index} value={munFiltrado.id_municipios}>
                        {munFiltrado.nombre_municipio}
                      </option>
                    )
                    )
                  }
                </Form.Control>
              </Form.Group>
              <input type="submit" value="Enviar" />
              {/* <input type="submit" value="Enviar" onClick={desplegarDatos}/> */}
            </Form>
          </div>
          <section className="tw-mt-5">
            {
              (nucleo !== null)
                ?
                (nucleo.modeloValido === true)
                  ?
                  <p>Elija un municipio por favor</p>
                  :
                  <>
                    <div className="tw-my-5">
                      <h1 className="tw-text-3xl">{tituloModelo}</h1>
                    </div>
                    <div className="tw-my-5">
                      {
                        seccionesModelo.map((indice, index) => (
                          <div className="tw-my-5 tw-text-2xl" key={index} dangerouslySetInnerHTML={indice} />
                        ))
                      }
                    </div>
                  </>
                :
                <h2>No hay nucleo</h2>
            }
          </section>
        </section>
      </div>
    </>
  )
}
