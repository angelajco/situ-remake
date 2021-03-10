import { parse } from 'postcss';
import React, { useState, useRef, useEffect } from 'react'
import { Form } from 'react-bootstrap'
import { useForm } from "react-hook-form";
import SeccionPm from '../../components/SeccionPm'
import $ from 'jquery'

// import L from "leaflet";
// Aqui van las clases afuera de la funcion export para que solo se ejecuten una sola vez
var capaReceptora = null
var mapaBase = null

function municipioElegidoPorUsuario() {
  return nucleo.claveMun
}

function recibeJSONcapa(datos) {
  if (datos != null) {
    capaReceptora.geoJson = datos
  }
  // nucleo.modelo.generaCapasLeaflet()
  // disparaRefrescaMapa()
}

var disparaRefrescaMapa = null
var L2 = {}

function capaArecibir(cual) {
  capaReceptora = cual;
}

function capturaL(objeto) {
  L2 = objeto
  console.log('Capturando L', objeto)
  if (!(nucleo.modelo.contextos[nucleo.modelo.contextos.length - 1].capasCargadas)) {
    nucleo.modelo.iniciaDescargaGeoJson()
  }
}


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
        this.modelo.indCapas = -1
        this.modelo.cargaAsincronaDatosCapas()
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

  actualizaDatos(idEnt, nombreEntidad, idMun, nombreMun) {
    this.claveEnt = idEnt;
    this.nombreEnt = nombreEntidad;
    this.claveMun = idMun;
    this.nombreMun = nombreMun;
    if (this.modelo != null) {
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

  resuelveVariable(variable) {
    this.modelo.resuelveVariable(variable)
  }

} // Fin de la clase Nucleo

class ModeloContenido {
  constructor(xmlDoc, padre) {
    this.titulo = ''
    this.secciones = []
    this.nucleo = padre
    this.tablas = []
    this.variables = []
    this.paraCalculo = []
    this.indTabla = -1
    this.indCapas = -1
    this.capas = []
    this.datosCapasCargados = false
    this.contadorModelo = 0
    this.contextos = []

    if (xmlDoc === null || xmlDoc.documentElement === null) {
      return
    }

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
      } else if (nodos[i].nodeName === 'variables') {
        for (let j = 0; j < nodos[i].childNodes.length; j++) {
          if (nodos[i].childNodes[j].nodeName === 'variable') {
            let nuevo = new Variable(nodos[i].childNodes[j])
            this.variables.push(nuevo)
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
    this.indTabla = -1
    this.contadorModelo++

    let contexto = {
      id: this.contadorModelo,
      tablasCargadas: false,
      capasCargadas: false,
    }

    this.contextos.push(contexto)
    this.cargaAsincrona()
  }

  encabezadoColumna(identificador) {
    let idTabla = null
    let columna = ''

    if (identificador.includes('.')) {
      let partes = identificador.split('.')
      idTabla = partes[0]
      columna = partes[1]
    } else {
      return ''
    }

    for (let index = 0; index < this.tablas.length; index++) {
      if (idTabla === this.tablas[index].id) {
        for (let i = 0; i < this.tablas[index].columnas.length; i++) {
          if (this.tablas[index].columnas[i].id === columna) {
            return this.tablas[index].columnas[i].encabezado ?? this.tablas[index].columnas[i].nombre
          }
        }
      }
    }
  }

  yaTengoDatos() {
    for (let index = 0; index < this.variables.length; index++) {
      this.variables[index].calcula(this)
    }

    for (let index = 0; index < this.secciones.length; index++) {
      this.secciones[index].contenedores.forEach(contenedor => {
        if (contenedor.contenido.tipoComponente === 'Tabular') {
          let tabular = contenedor.contenido
          tabular.datosDisponibles = true
          for (let index = 0; index < this.tablas.length; index++) {
            if (tabular.columnas[0].indexOf(this.tablas[index].id) === 0) {
              tabular.indiceTabla = index
              break
            }
          }
          tabular.refrescarContenido()
        } else if (contenedor.contenido.tipoComponente === 'Grafica') {
          contenedor.contenido.calcula(this)
        }
      });
    }

  } // metodo ya tengo datos

  resolverVariable(variable) {
    if (variable.includes('.')) {
      let idTabla = null
      let columna = ''
      let partes = variable.split('.')
      idTabla = partes[0]
      columna = partes[1]
      console.log('REsolviendo variable: ', variable)

      for (let index = 0; index < this.tablas.length; index++) {
        if (idTabla === this.tablas[index].id) {

          console.log('Tabla ubicada: ', this.tablas[index].id, this.tablas[index].datos, this.nucleo.claveMun)

          for (let i = 0; i < this.tablas[index].columnas.length; i++) {
            if (this.tablas[index].columnas[i].id === columna) {
              if (this.tablas[index].datos.length > 0) {
                if (this.tablas[index].columnas[i].tipo.includes('int')) {
                  return parseInt(this.tablas[index].datos[0][i])
                }
                return this.tablas[index].datos[0][i]
              }
              return null
            }
          }
        }
      }
    } else if (variable[0] == '@') {
      let id = variable.substr(1, variable.length - 1)
      for (let index = 0; index < this.variables.length; index++) {

        if (this.variables[index].nombre == id) {
          return this.variables[index].valor
        }

      }
    } else if (variable == 'claveEnt') {
      return this.nucleo.claveEnt
    } else if (variable == 'claveMun') {
      return this.nucleo.claveMun
    }
    else {
      return null
    }
  }

  cargaAsincrona() {
    this.indTabla++
    if (this.indTabla == 0) {
      console.log('Iniciando carga tablas ', this.contadorModelo)
    }
    if (this.indTabla < this.tablas.length) {
      this.tablas[this.indTabla].cargaDatos()
      return
    }

    this.contextos[this.contextos.length - 1].tablasCargadas = true

    this.indCapas = -1
    // this.cargaAsincronaDatosCapas()
    console.log('Carga de tablas concluida: ', this.contadorModelo)
    this.yaTengoDatos()
    // this.iniciaDescargaGeoJson()
    // this.descargaAsincronaGeoJson()
  }

  cargaAsincronaDatosCapas() {
    // identificar seccion que contiene el mapa (Esta seccion se considera solo un mapa por pagina)
    this.datosCapasCargados = true
    if (this.indCapas == -1) {
      for (let index = 0; index < this.secciones.length; index++) {
        if (this.secciones[index].tipo === 'mapaBase') {
          this.seccionMapa = this.secciones[index]
        }
      }
    }

    this.indCapas++

    if (this.indCapas < this.seccionMapa.capas.length) {
      this.seccionMapa.capas[this.indCapas].cargaDatosCapa(this);
    } else {
      this.indCapas = -1;
    }
  }

  iniciaDescargaGeoJson() {
    this.indCapas = -1
    this.descargaAsincronaGeoJson()
  }

  descargaAsincronaGeoJson() {

    this.indCapas++
    if (this.indCapas == 0) {
      console.log('Iniciando descarga de geoJson ', this.contadorModelo)
    }

    if (this.indCapas < this.seccionMapa.capas.length) {
      this.seccionMapa.capas[this.indCapas].descargaGeoJson(this)
    } else {
      console.log('Carga de capas terminada: ', this.contadorModelo)
      this.contextos[this.contextos.length - 1].capasCargadas = true
      this.seccionMapa.refrescarContenido();
    }
  }
} // Modelo Contenido

class SeccionModelo {

  constructor(nodoXml, nucleo) {
    this.ID = ''
    this.claseCSS = ''
    this.titulo = ''
    this.nucleo = nucleo
    this.tipo = ''
    this.contenedores = []
    this.refrescarContenido = null
    this.capas = []

    if (nodoXml === null || nodoXml.childNodes === null) {
      return
    }

    this.ID = nodoXml.getAttribute('id')
    this.tipo = nodoXml.getAttribute('tipo')

    for (let index = 0; index < nodoXml.childNodes.length; index++) {
      if (nodoXml.childNodes[index].nodeName === 'titulo') {
        this.titulo = nodoXml.childNodes[index].firstChild.nodeValue
      } else if (nodoXml.childNodes[index].nodeName === 'contenedor') {
        let nuevo = new Contenedor(nodoXml.childNodes[index], this.nucleo)
        this.contenedores.push(nuevo)
      } else if (nodoXml.childNodes[index].nodeName === 'capas') {
        for (let index2 = 0; index2 < nodoXml.childNodes[index].childNodes.length; index2++) {
          if (nodoXml.childNodes[index].childNodes[index2].nodeName === 'capa') {
            let nueva = new CapaSimple(nodoXml.childNodes[index].childNodes[index2], nucleo);

            this.capas.push(nueva);
          }
        }
      }
    }
  }

  tituloSeccion() {
    return this.nucleo.traduceVariable(this.titulo)
  }

  reiniciaDatos() {
    for (let index = 0; index < this.contenedores.length; index++) {
      this.contenedores[index].reiniciaDatos()
    }
    for (let index = 0; index < this.capas.length; index++) {
      this.capas[index].reiniciaDatos()
    }
  }

} // SECCION MODELO

// Tabla datos
class TablaDatos {

  constructor(nodo, padre) {
    this.configuracion = null
    this.nucleo = padre
    this.columnas = null
    this.datos = []
    this.tituloTabla = ''
    this.etiquetaID = null
    this.errorCarga = false

    if (nodo === null || nodo.firstChild === null) {
      return
    }
    this.id = nodo.getAttribute('id')
    let def = new DefinicionTabla(nodo)
    this.configuracion = def
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
        this.tablaPadre.nucleo.modelo.cargaAsincrona()
      } else if (req.status >= 400) {
        this.errorCarga = true
        this.tablaPadre.nucleo.modelo.cargaAsincrona()
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
    if (id.includes('.')) {
      let partes = id.split('.')
      if (partes[0] != this.id) {
        return -1
      }
      id = partes[1]
    }

    for (let index = 0; index < this.columnas.length; index++) {
      if (this.columnas[index].id === id) {
        return index
      }
    }
    return -1
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
} //Clase Definicion Tabla

class Contenedor {

  constructor(nodoXml, padre) {
    this.ancho = '100%'
    this.titulo = ''
    this.contenido = new ContenidoBase()
    this.padre = padre

    if (nodoXml === null || nodoXml.childNodes === null) {
      return
    }
    this.ancho = nodoXml.getAttribute('ancho') ?? '100%'
    for (let index = 0; index < nodoXml.childNodes.length; index++) {
      if (nodoXml.childNodes[index].nodeName === 'titulo') {
        this.titulo = nodoXml.childNodes[index].firstChild.nodeValue
      } else if (nodoXml.childNodes[index].nodeName === 'tabular') {
        this.contenido = new DespliegueTabular(nodoXml.childNodes[index], this.padre)
      } else if (nodoXml.childNodes[index].nodeName === 'grafica') {
        let nuevo = new Grafica(nodoXml.childNodes[index], padre)
        this.contenido = nuevo

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
    if (this.contenido != null) {
      this.contenido.reiniciaDatos()
    }
  }

} // clase Contenedor

class ContenidoBase {
  constructor() {
    this.tipoComponente = 'Básico'
  }
  reiniciaDatos() {
  }
} // clase contenido Base

class DespliegueTabular {

  constructor(nodoXml, padre) {
    // super.constructor()
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
    let salida = []
    let posCol = []


    let tope = (this.nucleo.modelo.tablas[this.indiceTabla].datos ?? []).length

    if (tope === 0) {
      return salida
    }
    for (let index = 0; index < this.columnas.length; index++) {
      let pos = this.nucleo.modelo.tablas[this.indiceTabla].indiceColumna(this.columnas[index])
      if (pos != null) {
        posCol.push(pos)
      }
    }
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
  }

}// clase Tabular

class Variable {

  constructor(nodoXml) {
    this.nombre = ''
    this.valor = null
    this.etiqueta = ''
    this.formula = []

    if (nodoXml == null || nodoXml.childNodes == null) {
      return
    }
    this.nombre = nodoXml.getAttribute('id')
    this.etiqueta = nodoXml.getAttribute('etiqueta')

    let formula = []
    let formulacion = nodoXml.firstChild.nodeValue
    let palabra = ''
    let car = ''

    function agregarVariable() {
      if (palabra != '') {
        formula.push({ 'tipo': 'variable', 'valor': palabra.trim() })
        palabra = ''
      }
    }

    for (let index = 0; index < formulacion.length; index++) {
      car = formulacion[index]

      if (car == '+' || car == '-') {
        agregarVariable()
        formula.push({ 'tipo': 'operador', 'valor': car })
      } else if (car >= ' ') {
        palabra = palabra + car
      }
    }

    agregarVariable()
    this.formula = formula
  }

  calcula(modelo) {
    this.valor = null
    let calculado = null
    let operador = null

    for (let index = 0; index < this.formula.length; index++) {
      if (this.formula[index].tipo == 'operador') {
        operador = this.formula[index].valor
      } else if (this.formula[index].tipo == 'variable') {
        let valor = modelo.resolverVariable(this.formula[index].valor)

        if (valor == null) {
          this.valor = null
          return
        }


        if (calculado == null) {
          calculado = valor
        } else if (operador == '+') {
          calculado = calculado + valor
        } else if (operador == '-') {
          calculado = calculado - valor
        }

      }
    }
    this.valor = calculado

  }
} //Clase variable

class DatoGrafica {

  constructor(nodoXml) {
    this.etiqueta = ''
    this.valor = null
    this.definicion = null
    this.color = 'red'

    if (nodoXml == null || nodoXml.nodeName == null) {
      return
    }

    this.etiqueta = nodoXml.getAttribute('etiqueta')
    this.definicion = new Formulacion(nodoXml.getAttribute('valor'))
    this.color = nodoXml.getAttribute('color')
  }

  calcula(modelo) {
    this.definicion.calcula(modelo)
    this.valor = this.definicion.valor
  }

}// Clase Dato Grafica

class Grafica {

  constructor(nodoXml, padre) {
    this.datos = []
    this.nombre = ''
    this.tipo = "pay"
    this.ancho = '350'
    this.alto = '350'
    this.radioExterno = '150'
    this.nucleo = padre
    this.tipoComponente = 'Grafica'
    this.datosDisponibles = false
    this.refrescarContenido = null

    if (nodoXml == null || nodoXml.childNodes == null) {
      return
    }
    this.nombre = nodoXml.getAttribute('id')
    this.tipo = nodoXml.getAttribute('tipo') ?? this.tipo
    this.ancho = nodoXml.getAttribute('ancho') ?? this.ancho
    this.alto = nodoXml.getAttribute('alto') ?? this.alto
    this.radioExterno = nodoXml.getAttribute('radioExterno') ?? this.radioExterno

    for (let index = 0; index < nodoXml.childNodes.length; index++) {
      if (nodoXml.childNodes[index].nodeName === 'dato') {
        let nuevo = new DatoGrafica(nodoXml.childNodes[index])
        this.datos.push(nuevo)
      }
    }

  }

  reiniciaDatos() {
    for (let index = 0; index < this.datos.length; index++) {
      this.datos[index].valor = null
    }
  }

  calcula(modelo) {
    for (let index = 0; index < this.datos.length; index++) {

      this.datos[index].calcula(modelo)
    }
    this.datosDisponibles = true
    this.refrescarContenido()
  }

  generaDatos() {

    let salida = []

    for (let index = 0; index < this.datos.length; index++) {
      let dato = { name: this.datos[index].etiqueta, value: this.datos[index].valor }
      salida.push(dato)
    }
    return salida
  }

  tablaColores() {
    let salida = []

    for (let index = 0; index < this.datos.length; index++) {
      salida.push(this.datos[index].color)
    }
    return salida
  }

} // Clase Grafica

class Formulacion {

  constructor(cadena) {
    this.formula = []
    this.valor = null

    let formula = []
    let palabra = ''
    let car = ''

    function agregarVariable() {
      if (palabra != '') {
        formula.push({ 'tipo': 'variable', 'valor': palabra.trim() })
        palabra = ''
      }
    }

    for (let index = 0; index < cadena.length; index++) {
      car = cadena[index]

      if (car == '+' || car == '-') {
        agregarVariable()
        formula.push({ 'tipo': 'operador', 'valor': car })
      } else if (car >= ' ') {
        palabra = palabra + car
      }
    }

    agregarVariable()
    this.formula = formula
  }

  calcula(modelo) {
    this.valor = null
    let calculado = null
    let operador = null

    for (let index = 0; index < this.formula.length; index++) {
      if (this.formula[index].tipo == 'operador') {
        operador = this.formula[index].valor
      } else if (this.formula[index].tipo == 'variable') {
        let valor = modelo.resolverVariable(this.formula[index].valor)

        if (valor == null) {
          this.valor = null
          return
        }



        if (calculado == null) {
          calculado = valor
        } else if (operador == '+') {
          calculado = calculado + valor
        } else if (operador == '-') {
          calculado = calculado - valor
        }

      }
    }
    this.valor = calculado

  }


} // Clase Formulacion

class CapaSimple {

  constructor(nodoXML, nucleo) {
    this.idCapa = "0";
    this.filtro = "";
    this.titulo = "";
    this.simbologia = null;
    this.configuracion = null;
    this.layer = null;
    this.nucleo = nucleo;
    this.marcaExt = false;
    this.geoJson = null;

    if (nodoXML.nodeName != "capa") {
      return
    }
    this.idCapa = nodoXML.getAttribute("id");
    this.filtro = nodoXML.getAttribute("filtro");
    this.marcaExt = nodoXML.getAttribute("marcaExt") == 'si';
    this.titulo = nodoXML.getAttribute("titulo")

    for (let i = 0; i < nodoXML.childNodes.length; i++) {
      if (nodoXML.childNodes[i].nodeName == "simbologia") {

        let preSimbol = nodoXML.childNodes[i].firstChild.wholeText;
        //document.getElementById("vista").value=nodoXML.childNodes[i].data;
        this.simbologia = eval(preSimbol);
        //this.simbologia=eval(nodoXML.firstChild.data);
      }
    }
  }

  cargaDatosCapa(modelo) {
    //Obtener del servidor los datos de la capa
    //Preparar la llamada para el servicio
    var req = new XMLHttpRequest();
    req.cliente = this;
    req.modelo = modelo;

    req.open("GET", "http://172.16.117.11/wa0/lista_capas02.php?id=" + this.idCapa, true);
    req.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded');

    req.onreadystatechange = function () {
      if (req.readyState == 4 && req.status == 200) {
        //aqui obtienes la respuesta de tu peticion
        this.cliente.configuracion = JSON.parse(req.responseText);
        this.modelo.cargaAsincronaDatosCapas();
      } else if (req.status >= 400) {
        console.log("Error en el servidor", req);
        this.modelo.cargaAsincronaDatosCapas();
      }
    }
    req.send();
  } //cargaDatosCapa

  descargaGeoJson(modelo) {
    //Obtener del geo-servidor el contenido de la capa
    //Preparar la llamada para el servicio
    var req = new XMLHttpRequest();
    req.cliente = this;
    req.modelo = modelo;

    //outputFormat=json&format_options=callback:loadThis

    //Procesar el filtro de la capa si lo hubiese
    let elFiltro = "";
    if (this.filtro > "") {
      //Recorrer para buscar variables
      let variables = [];
      let variable = ""
      let precedente = ""
      let enVariable = false;
      for (let j = 0; j < this.filtro.length; j++) {
        let car = this.filtro[j];
        if (car == "@") {
          enVariable = true
        } else if (enVariable && (car == "," || car == "." || car == ":" || car == "=" || car == ">" || car == "<" || car == "'" || car == "\"")) {
          variables.push({ precedente: precedente, variable: variable });
          variable = ""
          precedente = ""
          if (car == "'" || car == '"') {
            precedente = car;
          }
        } else if (enVariable) {
          variable = variable + car;
        } else {
          precedente = precedente + car;
        }
      }
      if (precedente != "" || variable != "") {
        variables.push({ precedente: precedente, variable: variable });
      }
      //Construir el filtro=
      for (let i = 0; i < variables.length; i++) {
        if (variables[i].precedente > "") {
          elFiltro = elFiltro + variables[i].precedente
        }
        if (variables[i].variable != "") {
          elFiltro = elFiltro + modelo.resolverVariable(variables[i].variable);
        }
      }
    }

    let parametrosLL = {
      service: 'WFS',
      version: '2.0',
      request: 'GetFeature',
      typeName: this.configuracion.capa,
      outputFormat: 'text/javascript',
      format_options: 'callback:getJson',
    };
    if (elFiltro != "") {
      parametrosLL.cql_filter = elFiltro;
    }

    //format_options: 'callback:recibeJSONcapa',

    var parameters1 = L2.Util.extend(parametrosLL);
    var paramURL = L2.Util.getParamString(parameters1);

    //Hacer petición AJAX
    capaArecibir(this);
    $.ajax({
      jsonpCallback: 'getJson',
      url: this.configuracion.url + paramURL,
      dataType: 'jsonp',
      capa: this,
      success: function (response) {
        this.capa.geoJson = response
        this.capa.nucleo.modelo.descargaAsincronaGeoJson()
      }
    });
  } //generaCapaLeaflet

  reiniciaDatos() {
    this.geoJson = null
  }
} //Clase Capa Simple


recibeJSONcapa(null)

// creando un nuevo objeto nucleo
let nucleo = new Nucleo()
// haciendo la peticion al modelo XML
nucleo.descargaModelo(`${process.env.ruta}/demos/modelos/MetaModeloHPM_01.xml`)


// Funcion de React
export default function index() {

  // Hooks para rederizar estados y municipios
  const [entidades, setEntidades] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  // Hook oculto para que que el cambio se haga en tiempo real
  const [contador, setContador] = useState(0)

  const { register, watch } = useForm();

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

    nucleo.actualizaDatos(refEntidad.current, nombreEntidad, refMunicipio.current, nombreMun)

    setSecciones(nucleo.modelo.secciones)
    setContador(contador + 1)

  }

  return (
    <>
      <div>
        <div className="tw-mx-8 tw-mt-8 tw-relative tw-w-80">
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
      </div>
      <div className="invisible">{contador}</div>
      <div className="tw-container tw-mx-8">
        {
          secciones.map((seccion, index) => (
            <SeccionPm key={index} seccion={seccion} cl={capturaL} />
          ))
        }
      </div>
      <div className="tw-pb-40">
      </div>
    </>
  )
}
