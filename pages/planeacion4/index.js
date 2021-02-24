import React, { useState, useRef } from 'react'
import { Form } from 'react-bootstrap'
import { useForm } from "react-hook-form";
import SeccionPm from '../../components/SeccionPm'
// Aqui van las clases afuera de la funcion export para que solo se ejecuten una sola vez
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
    for (let i = 0; i < nodos.length; i++) {
      if (nodos[i].nodeName == 'titulo') {
        this.titulo = nodos[i].firstChild.nodeValue
      }
      if (nodos[i].nodeName === 'secciones') {
        for (let j = 0; j < nodos[i].childNodes.length; j++) {
          if (nodos[i].childNodes[j].nodeName === 'seccion') {
            let nuevo = new SeccionModelo(nodos[i].childNodes[j], this.nucleo)
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

  tituloSeccion() {
    return this.nucleo.traduceVariable(this.titulo)
  }

  render() {
    let salida = `<h3>${this.nucleo.traduceVariable(this.titulo)}</h3>`
    if (this.tipo === 'mapaBase') {
      salida = salida + `<div id="map">Mapa aqui</div>`
    }
    return { __html: salida }
  }
}

// creando un nuevo objeto nucleo
var nucleo = new Nucleo()
// haciendo la peticion al modelo XML
nucleo.descargaModelo(`${process.env.ruta}/demos/modelos/MetaModeloHPM_01.xml`)

var listaEntidades = false
var listaMunicipios = false

export default function index() {

  // Hooks para rederizar estados y municipios
  const [entidades, setEntidades] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  // Hook oculto para que que el cambio se haga en tiempo real
  const [contador, setContador] = useState(0)

  const { register, handleSubmit, watch, clearErrors, setError, errors } = useForm();

  const refEntidad = useRef();
  refEntidad.current = watch("id_entidad", "");
  const refMunicipio = useRef();
  refMunicipio.current = watch("id_municipio", "");

  //Entidades
  if (!listaEntidades) {
    fetch(`${process.env.ruta}/wa/publico/catEntidades`)
      .then(res => res.json())
      .then(
        (data) => setEntidades(data),
        (error) => console.log(error)
      )
    listaEntidades = true
  }

  // Municipios
  if (!listaMunicipios) {
    fetch(`${process.env.ruta}/wa/publico/catMunicipios`)
      .then(res => res.json())
      .then(
        (data) => setMunicipios(data),
        (error) => console.log(error)
      )
    listaMunicipios = true
  }

  const [secciones, setSecciones] = useState([])


  function desplegarDatos() {
    console.log('Desplegando datos para', refMunicipio.current)
    let nombreMun = ''
    municipios.filter(mun => mun.id_municipios == refMunicipio.current).map((munFiltrado, index) => (
      nombreMun = munFiltrado.nombre_municipio
    ))
    nucleo.actualizaDatos(refMunicipio.current, nombreMun)
    setSecciones(nucleo.modelo.secciones)
    setContador(contador + 1)
  }

  return (
    <>
      <div className="tw-container tw-mx-8 tw-mt-8">
        <Form.Group controlId="id_entidad">
          <Form.Control as="select" name="id_entidad" required ref={register}>
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
        <button onClick={desplegarDatos}>Enviar</button>
      </div>
      <div className="invisible">{contador}</div>
      <div className="tw-container tw-mx-8">
        {
          secciones.map((seccion, index) => (
            <SeccionPm key={index} seccion={seccion} />
          ))
        }
      </div>
    </>
  )
}
