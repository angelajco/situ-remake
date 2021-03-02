import React, { useState, useRef, useEffect } from 'react'
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

    this.nombreEnt = '';
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
      let salida = ''
      let final = ''
      // console.log(palabras)
      for (let index = 0; index < palabras.length; index++) {
        let c = palabras[index].substr(-1)
        // console.log(c)
        final = ''
        if (c === ',' || c === '.' || c === ':' || c === ';' || c === '>' || c === '-' || c === '_') {
          final = c
          palabras[index] = palabras[index].substr(0, palabras[index].length - 1)
        }
        if (palabras[index].charAt(0) === '@') {
          if (palabras[index] === '@claveMun') {
            salida = salida + this.claveMun + final + ' '
          } else if (palabras[index] === '@nombreMun') {
            salida = salida + this.nombreMun + final + ' '
          } else if (palabras[index] === '@nombreEnt') {
            salida = salida + this.nombreEnt + final + ' '
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

  actualizaDatos(nombreEntidad, idMun, nombreMun) {
    this.nombreEnt = nombreEntidad;
    this.claveMun = idMun;
    this.nombreMun = nombreMun;
    if (this.modelo !== null) {
      this.modelo.reiniciaDatos()
      this.modelo.cargaInformacion()
    }
  }

  encabezadoColumna(identificador) {
    return this.modelo.encabezadoColumna(identificador)
  }

  yaTengoDatos(tabla) {
    this.modelo.yaTengoDatos(tabla)
  }

} // Fin de la clase Nucleo

class ModeloContenido {
  constructor(xmlDoc, padre) {
    this.titulo = ''
    this.secciones = []
    this.nucleo = padre
    this.tablas = []

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
      else if (nodos[i].nodeName === 'tablas') {
        for (let j = 0; j < nodos[i].childNodes.length; j++) {
          if (nodos[i].childNodes[j].nodeName === 'tabla') {
            let nuevo = new TablaDatos(nodos[i].childNodes[j], this.nucleo)
            this.tablas.push(nuevo)
          }
        }
      }
    }
    console.log(this.tablas)
  }

  reiniciaDatos() {
    for (let index = 0; index < this.tablas.length; index++) {
      this.tablas[index].reinicia()
    }
  }

  cargaInformacion() {
    for (let index = 0; index < this.tablas.length; index++) {
      this.tablas[index].cargaDatos()
    }
  }

  encabezadoColumna(identificador) {
    for (let index = 0; index < this.tablas.length; index++) {
      console.log('buscando columna en tabla', this.tablas[index])
      for (let i = 0; i < this.tablas[index].columnas.length; i++) {
        if (this.tablas[index].columnas[i].id === identificador) {
          return this.tablas[index].columnas[i].encabezado ?? this.tablas[index].columnas[i].nombre
        }
      }
    }
  }

  yaTengoDatos(tabla) {

    console.log('Ya tengo datos modelo,', tabla)

    for (let index = 0; index < this.secciones.length; index++) {
      this.secciones[index].contenedores.forEach(contenedor => {
        if (contenedor.contenido.tipoComponente === 'Tabular') {

          for (let index = 0; index <  contenedor.contenido.columnas.length; index++) {
            if (contenedor.contenido.columnas[index].includes(tabla.etiquetaID)) {
              contenedor.contenido.datosDisponibles = true
              console.log('Refescando tabular', contenedor.contenido)
              contenedor.contenido.refrescarContenido()
              return
            }
          }

        }
      });
    }

  }

} // Modelo Contenido

class SeccionModelo {
  constructor(nodoXml, nucleo) {
    this.ID = nodoXml.getAttribute('id')
    this.claseCSS = ''
    this.titulo = ''
    this.nucleo = nucleo
    this.tipo = nodoXml.getAttribute('tipo')
    this.contenedores = []
    this.refrescarContenido = null

    for (let index = 0; index < nodoXml.childNodes.length; index++) {
      if (nodoXml.childNodes[index].nodeName === 'titulo') {
        this.titulo = nodoXml.childNodes[index].firstChild.nodeValue
      } else if (nodoXml.childNodes[index].nodeName === 'contenedor') {

        let nuevo = new Contenedor(nodoXml.childNodes[index], this.nucleo)
        this.contenedores.push(nuevo)

      }
    }
  }

  tituloSeccion() {
    return this.nucleo.traduceVariable(this.titulo)
  }

} // SECCION MODELO

// Tabla datos
class TablaDatos {

  constructor(nodo, padre) {
    this.configuracion = new DefinicionTabla(nodo)
    this.nucleo = padre
    this.columnas = null
    this.datos = []
    this.tituloTabla = ''
    this.etiquetaID = null
    console.log('el padre es', this.nucleo)
  }
  
  reinicia() {
    this.columnas = null
    this.datos = []
  }

  cargaDatos() {
    let filtro = `${this.configuracion.filtroMun}='${this.nucleo.claveMun}'`

    let cuerpo = { etiqFunc: this.configuracion.etiqueta, columnas: this.configuracion.columnas, filtro: filtro }
    console.log('parametro de consulta', cuerpo)

    let req = new XMLHttpRequest();
    
    req.tablaPadre = this

    req.open("POST", "http://172.16.117.11/wa0/cons_catalogada", true);
    req.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded');

    req.onreadystatechange = function () {
      if (req.readyState == 4 && req.status == 200) {
        //aqui obtienes la respuesta de tu peticion
        // alert(req.responseText);
        let respuesta = JSON.parse(req.responseText)
        this.tablaPadre.tituloTabla = respuesta.nombreTabla
        this.tablaPadre.columnas = respuesta.columnas
        this.tablaPadre.datos = respuesta.datos
        this.tablaPadre.etiquetaID = respuesta.etiqFunc
        // console.log('Listo para avisar a nucleo', this, this.nucleo)
        this.tablaPadre.nucleo.yaTengoDatos(this.tablaPadre)
      }
    }
    req.send('parametros=' + JSON.stringify(cuerpo));

  }

}

class DefinicionTabla {

  constructor(nodo) {
    console.log(nodo)
    this.etiqueta = nodo.getAttribute('etiqueta')
    this.filtroMun = nodo.getAttribute('fltroMun')
    this.columnas = []
    console.log('contructor definicion', nodo.firstChild.nodeName)
    for (let i = 0; i < nodo.childNodes.length; i++) {
      if (nodo.childNodes[i].nodeName === 'columnas') {
        for (let index = 0; index < nodo.childNodes[i].childNodes.length; index++) {
          if (nodo.childNodes[i].childNodes[index].nodeName === 'columna') {
            this.columnas.push(nodo.childNodes[i].childNodes[index].firstChild.nodeValue)
          }
        }
      }
    }
  }
}

class Contenedor {

  constructor(nodoXml, padre) {
    this.ancho = nodoXml.getAttribute('ancho') ?? '100%'
    this.titulo = ''
    this.contenido = null
    this.padre = padre

    for (let index = 0; index < nodoXml.childNodes.length; index++) {
      if (nodoXml.childNodes[index].nodeName === 'titulo') {
        this.titulo = nodoXml.childNodes[index].firstChild.nodeValue
      }else if(nodoXml.childNodes[index].nodeName === 'tabular') {
        this.contenido = new DespliegueTabular(nodoXml.childNodes[index], this.padre)
        console.log('tabular detectado', this.contenido)
      }
    }

  }

  EstilosCSSReact() {

    return {
      width: this.ancho,
      backgroundColor: 'red',
    }
  }

} // clase Contenedor

class DespliegueTabular {

  constructor(nodoXml, padre) {
    this.tipoComponente = 'Tabular'
    this.columnas = []
    this.nucleo = padre
    this.datosDisponibles = false

    for (let index = 0; index < nodoXml.childNodes.length; index++) {
      if (nodoXml.childNodes[index].nodeName === 'columnas') {
        
        for (let i = 0; i < nodoXml.childNodes[index].childNodes.length; i++) {
          if (nodoXml.childNodes[index].childNodes[i].nodeName === 'columna') {
            this.columnas.push(nodoXml.childNodes[index].childNodes[i].firstChild.nodeValue)
          }
        }
        
      }
    } 
  }

  encabezadoColumna(identificador) {
    return this.nucleo.encabezadoColumna(identificador)
  }
}// clase tabular


// creando un nuevo objeto nucleo
let nucleo = new Nucleo()
// haciendo la peticion al modelo XML
nucleo.descargaModelo(`${process.env.ruta}/demos/modelos/MetaModeloHPM_01.xml`)

// let listaEntidades = false
// let listaMunicipios = false
// console.log(listaEntidades, 'Antes de la funcion entidades')
// console.log(listaMunicipios, 'Antes de la funcion municipios')

export default function index() {

  // Hooks para rederizar estados y municipios
  const [entidades, setEntidades] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  // Hook oculto para que que el cambio se haga en tiempo real
  const [contador, setContador] = useState(0)
  // console.log(entidades)
  const { register, handleSubmit, watch, clearErrors, setError, errors } = useForm();

  const refEntidad = useRef();
  refEntidad.current = watch("id_entidad", "");
  const refMunicipio = useRef();
  refMunicipio.current = watch("id_municipio", "");
  // console.log(refEntidad)
  //Entidades
  // if (!listaEntidades) {
  //   fetch(`${process.env.ruta}/wa/publico/catEntidades`)
  //     .then(res => res.json())
  //     .then(
  //       (data) => setEntidades(data),
  //       (error) => console.log(error)
  //     )
  //   listaEntidades = true
  // }
  useEffect(() => {
    fetch(`${process.env.ruta}/wa/publico/catEntidades`)
      .then(res => res.json())
      .then(
        (data) => setEntidades(data),
        (error) => console.log(error)
      )
  }, [])

  // Municipios
  // if (!listaMunicipios) {
  //   fetch(`${process.env.ruta}/wa/publico/catMunicipios`)
  //     .then(res => res.json())
  //     .then(
  //       (data) => setMunicipios(data),
  //       (error) => console.log(error)
  //     )
  //   listaMunicipios = true
  // }
  useEffect(() => {
    fetch(`${process.env.ruta}/wa/publico/catMunicipios`)
      .then(res => res.json())
      .then(
        (data) => setMunicipios(data),
        (error) => console.log(error)
      )
  }, [])

  // console.log(listaEntidades, 'despues de la funcion entidades')
  // console.log(listaMunicipios, 'despues de la funcion municipios')

  const [secciones, setSecciones] = useState([])

  // const [tablas, setTablas] = useState([])

  // const [columnas, setColumnas] = useState([])

  // console.log(columnas)

  function desplegarDatos() {
    // console.log('Desplegando datos para', refMunicipio.current)
    let nombreMun = ''
    municipios.filter(mun => mun.id_municipios == refMunicipio.current).map((munFiltrado, index) => (
      nombreMun = munFiltrado.nombre_municipio
    ))
    let nombreEntidad = ''
    entidades.map((entidad, index) => {
      if (entidad.id_entidades === refEntidad.current) {
        nombreEntidad = entidad.nombre_entidad
      }
    })
    nucleo.actualizaDatos(nombreEntidad, refMunicipio.current, nombreMun)
    setSecciones(nucleo.modelo.secciones)
    // setColumnas(nucleo.modelo.columnas)
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
      <div>
        
      </div>
    </>
  )
}
