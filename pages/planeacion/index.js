import { useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import axios from 'axios'
// import $ from 'jquery'

export default function index() {

  const [state, setState] = useState()
  // const [stateSecciones, setStateSecciones] = useState([])

  class Nucleo {
    constructor() {
      // Recibir el modelo
      this.modelo = null;
      // La peticion se hizo y el modelo es valido
      this.modeloValido = false;
      // La peticion se hizo con un resultado exitoso o no exitoso
      this.modeloCargado = false;
    }

    descargaModelo(rutaXml) {
      let config = {
        method: 'get',
        url: rutaXml,
        headers: {},
        // hacer referencia al objeto nucleo
        padre: this,
      };

      axios(config)
        .then(function (response) {
          let parser = new DOMParser();
          // console.log(parser)
          let xmlDoc = parser.parseFromString(response.data, "text/xml");

          if (xmlDoc.documentElement.nodeName === 'MetaModeloHPM') {
            config.padre.procesaModelo(xmlDoc)
          } else {
            return
          }
        })
        .catch(function (error) {
          config.padre.modeloCargado = true;
        });
    }

    procesaModelo(xmlDoc) {
      this.modelo = new ModeloContenido(xmlDoc)
    }
  }

  class ModeloContenido {
    constructor(xmlDoc) {
      this.titulo = ''
      this.secciones = []
      let nodos = xmlDoc.documentElement.childNodes
      // console.log(nodos)
      for (let i = 0; i < nodos.length; i++) {
        if (nodos[i].nodeName == 'titulo') {
          // console.log(nodos[i].firstChild.nodeValue)
          this.titulo = nodos[i].firstChild.nodeValue
          // console.log(this.titulo)
          setState(this.titulo)
        } else if (nodos[i].nodeName === 'secciones') {
          // console.log('recorriendo secciones')
          // let secciones = nodos[i].childNodes
          console.log(nodos[i])
          for (let j = 0; j < nodos[i].childNodes.length; j++) {
            // console.log(j + ':' + nodos[i].childNodes[j].nodeName)
            if (nodos[i].childNodes[j].nodeName === 'seccion') {
              let nuevo = new SeccionModelo(nodos[i].childNodes[j])
              console.log('seccion agregada')
              this.secciones.push(nuevo)
            }
          }
        }
      }
    }
  }

  class SeccionModelo {
    constructor(nodoXml) {
      this.ID = nodoXml.getAtributte('id')
      this.claseCSS = ''
      this.titulo = ''
      this.tipo = nodoXml.getAtributte('tipo')
      for (let index = 0; index < nodoXml.childNodes.length; index++) {
        if (nodoXml.childNodes[index].nodeName === 'titulo') {
          this.titulo = nodoXml.childNodes[index].firstChild.nodeValue
        }
      }
    }

    // render() {
      // let cadena = '<div><h2>' + this.titulo + '</h2></div>'
    //   return {__html: cadena}
    // }
  }


  const nucleo = new Nucleo()
  nucleo.descargaModelo('http://172.16.117.11/demos/modelos/MetaModeloHPM_01.xml')
  // setState(nucleo)

  // console.log(nucleo)

  return (
    <>
      <div>
        <section>
          <div>
            combo
            combo
          <button>CARGAR</button>
          </div>
          <div>
              <h2>{state}</h2>
          </div>
        </section>
      </div>
    </>
  )
}
