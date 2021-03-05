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
      for (let index = 0; index < palabras.length; index++) {
        let c = palabras[index].substr(-1)
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
  }

  reiniciaDatos() {
    for (let index = 0; index < this.tablas.length; index++) {
      this.tablas[index].reinicia()
    }

    for (let index = 0; index < this.secciones.length; index++) {
      this.secciones[index].reiniciaDatos()
    }

  }

  cargaInformacion() {
    for (let index = 0; index < this.tablas.length; index++) {
      this.tablas[index].cargaDatos()
    }
  }

  encabezadoColumna(identificador) {
    for (let index = 0; index < this.tablas.length; index++) {
      for (let i = 0; i < this.tablas[index].columnas.length; i++) {
        if (this.tablas[index].columnas[i].id === identificador) {
          return this.tablas[index].columnas[i].encabezado ?? this.tablas[index].columnas[i].nombre
        }
      }
    }
  }

  yaTengoDatos(tabla) {
    for (let index = 0; index < this.secciones.length; index++) {
      this.secciones[index].contenedores.forEach(contenedor => {
        if (contenedor.contenido.tipoComponente === 'Tabular') {
          for (let index = 0; index < contenedor.contenido.columnas.length; index++) {
            if (contenedor.contenido.columnas[index].includes(tabla.etiquetaID)) {
              contenedor.contenido.datosDisponibles = true
              contenedor.contenido.indiceTabla = index
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

  reiniciaDatos() {
    console.log('Reiniciando seccion')
    for (let index = 0; index < this.contenedores.length; index++) {
      this.contenedores[index].reiniciaDatos()
    }

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
  }
  reinicia() {
    this.columnas = null
    this.datosDisponibles = false
    this.datos = []
  }
  
  cargaDatos() {
    let filtro = `${this.configuracion.filtroMun}='${this.nucleo.claveMun}'`
    let cuerpo = { etiqFunc: this.configuracion.etiqueta, columnas: this.configuracion.columnas, filtro: filtro }
    let req = new XMLHttpRequest();
    
    // console.log('cargando datos para', this.nucleo.claveMun)

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
        this.tablaPadre.nucleo.yaTengoDatos(this.tablaPadre)
      }
    }
    req.send('parametros=' + JSON.stringify(cuerpo));

  }

  obtenCelda(fila, id) {

    if (fila <= datos.length) {
      for (let index = 0; index < this.columnas.length; index++) {
        if (this.columnas[index].id === id) {
          return this.datos[fila][index]
        }
        return null
      }
    }
    return null
  }

  indiceColumna(id) {
    for (let index = 0; index < this.columnas.length; index++) {
      if (this.columnas[index].id === id) {
        // console.log('Columna encontrada', index)
        return index
      }
    }
    return null
  }

} // Clase Tabla Datos

class DefinicionTabla {

  constructor(nodo) {
    this.etiqueta = nodo.getAttribute('etiqueta')
    this.filtroMun = nodo.getAttribute('fltroMun')
    this.columnas = []
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
      } else if (nodoXml.childNodes[index].nodeName === 'tabular') {
        this.contenido = new DespliegueTabular(nodoXml.childNodes[index], this.padre)
      }
    }

  }

  EstilosCSSReact() {
    return {
      width: this.ancho,
      backgroundColor: 'white',
    }
  }

  reiniciaDatos() {
    console.log('Reiniciar contenedor')
    if (this.contenido !== null) {
      this.contenido.reiniciaDatos()
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

  contenidoTabla() {
    // console.log('Conenido tabla', this.indiceTabla)

    let salida = []
    let posCol = []
    let tope = (this.nucleo.modelo.tablas[this.indiceTabla].datos ?? []).length

    if (tope === 0) {
      return salida
    }

    for (let index = 0; index < this.columnas.length; index++) {
      let pos = this.nucleo.modelo.tablas[this.indiceTabla].indiceColumna(this.columnas[index])
      if (pos !== null) {
        posCol.push(pos)
      }
    }

    // console.log('mapa', posCol)

    for (let index = 0; index < tope; index++) {
      let fila = []
      for (let i = 0; i < this.columnas.length; i++) {
        fila.push(this.nucleo.modelo.tablas[this.indiceTabla].datos[index][posCol[i]])
      }
      salida.push(fila)
    }
    return salida
  }

  reiniciaDatos() {
    this.datosDisponibles = false
    console.log("Reiniciando Tabular")
  }

}// clase Tabular


// creando un nuevo objeto nucleo
let nucleo = new Nucleo()
// haciendo la peticion al modelo XML
nucleo.descargaModelo(`${process.env.ruta}/demos/modelos/MetaModeloHPM_01.xml`)

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

  useEffect(() => {
    fetch(`${process.env.ruta}/wa/publico/catEntidades`)
      .then(res => res.json())
      .then(
        (data) => setEntidades(data),
        (error) => console.log(error)
      )
  }, [])

  useEffect(() => {
    fetch(`${process.env.ruta}/wa/publico/catMunicipios`)
      .then(res => res.json())
      .then(
        (data) => setMunicipios(data),
        (error) => console.log(error)
      )
  }, [])

  const [secciones, setSecciones] = useState([])

  function desplegarDatos() {

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
