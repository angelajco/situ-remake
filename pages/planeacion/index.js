import { useState } from 'react';
import { Form } from 'react-bootstrap'
// import $ from 'jquery'

export default function index() {

  // States
  // const [titulo, setTitulo] = useState('')
  // const [secciones, setSecciones] = useState([])

  class Nucleo {
    constructor() {
      // Recibir el modelo
      this.modelo = null;
      // La peticion se hizo y el modelo es valido
      this.modeloValido = false;
      // La peticion se hizo con un resultado exitoso o no exitoso
      this.modeloCargado = false;

      this.claveMun = '00000';

      this.nombreMun = 'sin nombre'
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
          console.log(xmlDoc)
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
      console.log(this.modelo)
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
      return
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
      return { __html: `<h3>${this.nucleo.traduceVariable(this.titulo)}</h3>` }
    }

  }

  const nucleo = new Nucleo()
  nucleo.descargaModelo('http://172.16.117.11/demos/modelos/MetaModeloHPM_01.xml')
  // console.log(secciones)

  // Para el titulo
  const [tituloModelo, setTituloModelo] = useState('')

  //Para las secciones
  const [seccionesModelo, setSeccionesModelo] = useState([])

  function desplegarDatos() {
    // console.log(nucleo.modeloCargado)
    // console.log(nucleo.modelo.titulo)
    setTituloModelo(nucleo.modelo.titulo)

    let dummy = []

    for (let i = 0; i < nucleo.modelo.secciones.length; i++) {
      dummy.push(nucleo.modelo.secciones[i].render())
    }

    console.log(dummy)
    setSeccionesModelo(dummy)
  }

  // console.log(seccionesModelo)

  return (
    <>
      <div className="tw-flex tw-mx-5 tw-my-8">
        <section className="tw-w-1/2">
          AQUI VA EL MAPA
        </section>
        <section className="tw-w-1/2">
          <div>
            <Form.Group controlId="id_entidad">
              <Form.Label className="tw-text-red-600">Entidad</Form.Label>
              <Form.Control as="select" name="id_entidad">
                <option value=""></option>
                {/* {entidades.map((value, index) => (
                  <option key={index} value={value.id_entidades}>
                    {value.nombre_entidad}
                  </option>
                ))} */}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="id_municipio">
              <Form.Label className="tw-text-red-600">Municipio base</Form.Label>
              <Form.Control as="select" name="id_municipio">
                {/* <option value=""></option>
                {
                  municipios.filter(mun => mun.cve_ent == refEntidad.current).map((munFiltrado, index) => (
                    <option key={index} value={munFiltrado.id_municipios}>
                      {munFiltrado.nombre_municipio}
                    </option>
                  )
                  )
                } */}
              </Form.Control>
              <button onClick={desplegarDatos} >Enviar</button>
            </Form.Group>
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
