import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ModalComponent from './ModalComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faDownload, faEye, faArrowLeft, faArrowRight, faFileCsv, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { Form, Modal, Button, Table, Tabs, Tab } from 'react-bootstrap';
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useForm } from "react-hook-form";
import Draggable from 'react-draggable';
import ModalDialog from 'react-bootstrap/ModalDialog';
import Select from 'react-select';
import dataPub from '../shared/jsons/publicaciones.json'
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import { faWindowRestore } from '@fortawesome/free-regular-svg-icons';
import $ from 'jquery';

import Cookies from 'universal-cookie'
import { useAuthState } from '../context';
const cookies = new Cookies();
var csrfToken;



function PaginationComponent(props) {
  const userDetails = useAuthState().user;
  csrfToken = userDetails.csrfToken;
  //console.log(userDetails.id);

  const url_bus = props.informacion;
  const leyenda = props.consulta;
  const totalD = props.total;
  let pag = props.pagina;


  //const usuarioCookie = cookies.get('Usuario')
  const usuarioI = userDetails.id;

  //Datos para crear el form
  const { register, handleSubmit, watch, clearErrors, setError, errors } = useForm();
  const [tarchivo, setTarchivo] = useState(null);
  const [fileUrl, setFileUrl] = useState('images/consulta/miniaturaD.png');
  const [imgportada, setImgPortada] = useState(null);
  const [longitud, setLongitud] = useState(0);
  const [showModalMeta, setShowModalMeta] = useState(false);
  const [detalles, setDetalles] = useState([]);

  const tarchivos = [
    { value: '1', label: 'Documento' },
    { value: '2', label: 'Enlace' }
  ];

  useEffect(() => {
    if (url_bus.length != longitud) {
      setCurrentPage(1);
    }
  });

  const descargaDoc = async (e) => {
    var doc = new jsPDF();
    var fecha, hora;
    var hoy = new Date();
    if (hoy.getMonth() < 10) {
      fecha = hoy.getDate() + '-0' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear();
    } else {
      fecha = hoy.getDate() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear();
    }
    if (hoy.getMinutes() < 10) {
      hora = hoy.getHours() + ':0' + hoy.getMinutes();
    } else {
      hora = hoy.getHours() + ':' + hoy.getMinutes();
    }
    setTimeout(() => {
      var items = filtrarJson(data);
      var img = new Image();
      img.onload = function () {
        var dataURI = getBase64Image(img);
        return dataURI;
      }
      img.src = "/images/consulta/encabezado.jpg";
      setTimeout(() => {
        //console.log("4 Segundo esperado")
      }, 4000);
      /// codigo para generar pdf 
      const columns = Object.keys(items[0]);
      columns[0] = "Titulo/Nombre";
      columns[1] = "Fecha de Publicación";
      columns[2] = "Tipo";
      columns[3] = "Tema 1";
      columns[4] = "Tema 2";
      var result = [];
      items.forEach(element => {
        result.push(Object.values(element));
      });


      autoTable(doc, {
        columns,
        body: result,
        margin: { top: 65 }, theme: 'grid',
        styles: { fontSize: 9 },
        didDrawPage: function (data) {
          //header
          doc.addImage(img.onload(), 'JPEG', 5, 5, 195, 30);
          setTimeout(() => {
            //console.log("4 Segundo esperado")
          }, 1000);
          doc.setFontSize(10);
          if (userDetails.nombre != null) {
            doc.text(20, 43, "Nombre Usuario: " + userDetails.nombre);
          } else {
            doc.text(20, 43, "Nombre Usuario: INVITADO");
          }
          doc.text(140, 43, "FECHA:  " + fecha + "    HORA: " + hora);
          //doc.setFontType("bold");
          doc.setFontSize(13);
          var con1 = leyenda.split(',');
          doc.text(65, 53, con1[0]);

          if (con1.length > 1) {
            doc.setFontSize(8);
            doc.text(20, 58, con1[1]);
          }
          doc.setFontSize(10);
          //doc.setFontType("normal");
          doc.text(20, 63, "Total de documentos: " + result.length);
        }
      });
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        doc.save('Consulta-Documental');
      } else {
        doc.save('Consulta-Documental');
      }

    }, 1000);


  }

  function preCargaPDF() {
    setTimeout(() => {
      var hoy = new Date();
      var fecha = hoy.getDate() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear();
      var hora = hoy.getHours() + ':' + hoy.getMinutes();
      var img = new Image();
      img.onload = function () {
        var dataURI = getBase64Image(img);
        setTimeout(() => {
          //console.log("4 Segundo esperado")
        }, 4000);
        return dataURI;
      }
      img.src = "/images/consulta/encabezado.jpg";
      /// codigo para generar pdf 
      const columns = []
      var result = [];
      var doc = new jsPDF();
      var header = function (data) {
        doc.addImage(img.onload(), 'JPEG', 5, 5, 195, 30);
        doc.setFontSize(10);
        if (userDetails.nombre != null) {
          doc.text(20, 43, "Nombre Usuario: " + userDetails.nombre);
        } else {
          doc.text(20, 43, "Nombre Usuario: INVITADO");
        }
        doc.text(140, 43, "FECHA:  " + fecha + "    HORA: " + hora);
        doc.setFontSize(13);
        doc.text(75, 53, "CONSULTA DOCUMENTAL");
        doc.setFontSize(9);
        //doc.text(20, 60, "Total de documentos: " + items.length);
      };
      doc.output('datauristring');
    }, 4000);
  }

  const actBitacora = async (cod) => {
    if (userDetails.id != undefined) {
      //codigo para actualizar la botacora cuendo se descarge un documento 
      const res = await fetch(`${process.env.ruta}/wa/publico/bitacoraDocumento?id_usuario=${usuarioI}&id_documento=${cod}`);
      const datos0 = await res.json();
    } else {
      const res = await fetch(`${process.env.ruta}/wa/publico/bitacoraDocumento?id_usuario=58&id_documento=${cod}`);
      const datos0 = await res.json();
    }
  }

  const descargarCVS = async (e) => {
    //codigo para descargar el archivo csv
    var fecha, hora;
    var hoy = new Date();
    if (hoy.getMonth() < 10) {
      fecha = hoy.getDate() + '-0' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear();
    } else {
      fecha = hoy.getDate() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear();
    }
    if (hoy.getMinutes() < 10) {
      hora = hoy.getHours() + ':0' + hoy.getMinutes();
    } else {
      hora = hoy.getHours() + ':' + hoy.getMinutes();
    }
    var con1 = leyenda.split(',');
    var items = filtrarJson(data);
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(items[0]);
    let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    header[0] = "Titulo/Nombre";
    header[1] = "Fecha de Publicación";
    header[2] = "Tipo";
    header[3] = "Tema 1";
    header[4] = "Tema 2";
    csv.unshift(header.join(','));
    csv.unshift("Total de Documentos: " + items.length);
    if (con1.length > 1) {
      csv.unshift(con1[1]);
    } else {
      csv.unshift(leyenda);
    }
    //csv.unshift(leyenda);
    csv.unshift("FECHA:  " + fecha + "    HORA: " + hora);
    if (userDetails.nombre != null) {
      csv.unshift("Nombre Usuario: " + userDetails.nombre);
    } else {
      csv.unshift("Nombre Usuario: INVITADO");
    }
    csv = csv.join('\r\n');
    //Download the file as CSV
    var downloadLink = document.createElement("a");
    var blob = new Blob(["\ufeff", csv, { type: "txt/csv" }]);
    var url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = "Consulta-Documental.csv";  //Name the file here
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

  }

  //funcion para convertir la imgen en jpeg
  function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/jpeg");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }



  function filtrarJson(d) {
    //funcion para filtrar el json y generar el pdf y csv
    let vec = [];
    d.forEach(element => {
      let js = {};
      js.Titulo = element.nombre;
      //js.Autor = element.autor;
      //js.Pais = element.pais;
      js.Fecha = element.ano_publicacion + "-" + element.mes_publicacion + "-" + element.dia_publicacion;
      js.Clasificacion = element.tipo;
      js.Tema1 = element.tema1;
      js.Tema2 = element.tema2;
      js.Fuente = element.instancia;
      //js.Cobertura = element.nivel_cobertura;
      //js.Formato = element.formato;
      //js.Archivo = element.url_origen;
      vec.push(js);
    });
    return vec;
  }

  const tipoA = e => {
    if (e == null) {
      setTarchivo("");
    } else {
      setTarchivo(e.value);
    }
  }

  //Funcionalidad de minimizar el modal
  function minimizaModal(e) {
    let modalCompleto = $(e.target).closest(".modal")
    $(modalCompleto).toggleClass("modal-min");
    if ($(modalCompleto).hasClass("modal-min")) {
      $(modalCompleto).find(".modal-content").removeClass("modal-redimensionable");
      $(modalCompleto).find(".modal-header").css("pointer-events", "none")
    } else {
      $(modalCompleto).find(".modal-content").addClass("modal-redimensionable");
      $(modalCompleto).find(".modal-header").css("pointer-events", "initial")
    }
  }

  //const actBitacora = async (cod)
  const mostraMetadatos = async (id) => {
    //console.log(id);
    const res = await fetch(`${process.env.ruta}/wa/publico/consultaDocumento?search=id:${id}`);
    const datos = await res.json();
    //console.log(datos[0]);
    setDetalles(datos[0]);
    setShowModalMeta(!showModalMeta);
  }

  const renderData = data => {
    return (
      <> <ModalComponent
        show={show}
        datos={datosModal}
        onHide={handleClose}
        onClick={handleClose}
      />

        <Modal dialogAs={DraggableModalDialog} show={showModalMeta} backdrop={false} keyboard={false} contentClassName="modal-redimensionableConsulta1"
          onHide={() => setShowModalMeta(!showModalMeta)} className="tw-pointer-events-none modal-analisis">
          <Modal.Header className="tw-cursor-pointer modal-movible" closeButton>
            <Modal.Title><b>Metadatos del Documento de documento</b></Modal.Title>
            <button className="boton-minimizar-modal" onClick={(e) => minimizaModal(e)}>
              <FontAwesomeIcon icon={faWindowRestore} />
            </button>
          </Modal.Header>
          <Modal.Body className="modal-movible">
            <div>
              <div className="row">
                <div className="col-3 col-md-3 col-lg-3 text-center">
                  {
                    detalles.miniatura != null ? (
                      <img src={`${process.env.ruta}/recursos/docs/miniaturas/${detalles.miniatura}`} alt='Miniatura' className='img-fluid' />
                    ) : (
                      <img src='/images/consulta/publicacion-situ.png' alt='Miniatura' className='img-fluid' />
                    )
                  }
                </div>
                <div className="col-9 col-md-9 col-lg-9">

                  <p> <b>Nombre:</b> {detalles.nombre}</p>
                  <p> <b>Descripción: </b>{detalles.descripcion}</p>
                  <p> <b>Alias: </b>{detalles.alias}</p>
                  <p> <b>Nombre de Origen del Archivo: </b>{detalles.nombre_archivo}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-md-12 col-lg-12">

                  <p><b>URL Origen: </b><a href={detalles.url_origen} target="_blank" onClick={() => actBitacora(detalles.id_metadato_documento)}> {detalles.url_origen} </a></p>

                </div>
              </div>
              <div className="row">
                <div className="col-6 col-md-6 col-lg-6">
                  <p> <b>Tipo/Clasificación: </b>{detalles.tipo}</p>
                  <p> <b>Tema Principal: </b>{detalles.tema1}</p>
                  <p> <b>Tema Secundario: </b>{detalles.tema2}</p>
                  <p> <b>Nivel de Cobertura: </b>{detalles.nivel_cobertura}</p>
                  <p> <b>Clave de Entidad: </b>{detalles.nivel_cobertura}</p>
                  <p> <b>Clave Municipal: </b>{detalles.nivel_cobertura}</p>
                  <p> <b>Primer Autor(a): </b>{detalles.autor}</p>
                  <p> <b>Segundo Autor(a): </b>{detalles.autor2}</p>
                  <p> <b>Tercer Autor(a): </b>{detalles.autor3}</p>
                  <p> <b>Primera Institución: </b>{detalles.instancia1}</p>
                  <p> <b>Segunda Institución: </b>{detalles.instancia2}</p>
                  <p> <b>Tercera Institución: </b>{detalles.instancia3}</p>
                  <p> <b>Conjunto de datos: </b>{detalles.tratamiento_publicacion}</p>
                  <p> <b>Editorial: </b>{detalles.editorial}</p>
                  <p> <b>Edición: </b>{detalles.edicion}</p>
                </div>
                <div className="col-6 col-md-6 col-lg-6">
                  <p> <b>ISBN: </b>{detalles.tipo}</p>
                  <p> <b>Año de Publicación: </b>{detalles.tema1}</p>
                  <p> <b>Mes de Publicación: </b>{detalles.tema2}</p>
                  <p> <b>Día de Publicacióna: </b>{detalles.nivel_cobertura}</p>
                  <p> <b>Vigencia: </b>{detalles.nivel_cobertura}</p>
                  <p> <b>Documento Actualizado: </b>{detalles.nivel_cobertura}</p>
                  <p> <b>Fecha de Actualización: </b>{detalles.autor}</p>
                  <p> <b>Periodo de Vigencia Inicial: </b>{detalles.autor2}</p>
                  <p> <b>Periodo de Vigencia Final: </b>{detalles.autor3}</p>
                  <p> <b>Armonizado a la LGAHOTDU: </b>{detalles.armonizado_lgahotdu}</p>
                  <p> <b>Formato del Documento: </b>{detalles.formato}</p>
                  <p> <b>País del Documento: </b>{detalles.pais}</p>
                  <p> <b>Idioma del Documento: </b>{detalles.idioma}</p>
                  <p> <b>Número de páginas : </b>{detalles.paginas}</p>
                  <p> <b>Palabras Clave : </b>{detalles.palabrasclave}</p>
                </div>
              </div>


            </div >
          </Modal.Body>
        </Modal>

        {
          <table className="t1 table table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Portada</th>
                <th className="celda">Titulo/Nombre</th>
                <th>Fecha/Año  de Publicación</th>
                <th>Fuente/Instancia</th>
              </tr>
            </thead>
            <tbody>
              {
                data.map((todo) => {
                  //console.log(todo); download="Archivo.pdf"
                  return (
                    <tr key={todo.id_metadato_documento}>
                      <td>
                        <OverlayTrigger overlay={<Tooltip>Descargar</Tooltip>}>
                          {
                            todo.miniatura != null ? (
                              <a href={todo.url_origen} target="_blank" onClick={() => actBitacora(todo.id_metadato_documento)}>
                                <img src={`${process.env.ruta}/recursos/docs/miniaturas/${todo.miniatura}`} alt='Miniatura' className='card-img-top' width="93px" height="130px" />
                              </a>
                            ) : (
                              <a href={todo.url_origen} target="_blank" onClick={() => actBitacora(todo.id_metadato_documento)}>
                                <img src='/images/consulta/miniaturaD.png' alt='Miniatura' className='card-img-top' width="93px" height="130px" />
                              </a>
                            )
                            //setShowModalMeta metadatosModal(todo.id_metadato_documento)
                          }
                        </OverlayTrigger>
                      </td>
                      <td>
                        <OverlayTrigger overlay={<Tooltip>Ver Detalle</Tooltip>}>
                          <p className="enlaceD"><a onClick={() => mostraMetadatos(todo.id_metadato_documento)}>{todo.nombre}</a></p>
                        </OverlayTrigger>
                      </td>
                      <td>
                        {todo.mes_publicacion == null ? (
                          <p>{todo.ano_publicacion}</p>
                        ) : (
                          todo.dia_publicacion == null ? (
                            <p>{todo.ano_publicacion}-{todo.mes_publicacion}</p>
                          ) : (
                            <p>{todo.ano_publicacion}-{todo.mes_publicacion}-{todo.dia_publicacion}</p>
                          )
                        )}
                      </td>
                      <td>
                        <p>{todo.instancia}</p>
                      </td>
                    </tr>
                  )
                }) //termiina funcion map
              }
            </tbody>
          </table>

        }
      </>
    )
  }


  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPages, setItemsPerPages] = useState(6);

  const [pageNumberLimit, setPageNumberLimit] = useState(7);
  const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(7);
  const [minPageNumberLimit, setminPageNumberLimit] = useState(0);

  const [datosModal, setDatosModal] = useState({});
  const [show, setShow] = useState(false);
  const [showCargaD, setShowCargaD] = useState(false);
  const [showReporte, setShowReporte] = useState(false);
  //Estados para mostrar el modal
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);


  //const onSubmit = async (data) =>
  const metadatosModal = async (cod) => {
    //console.log(cod);
    //setCodigo(cod);
    const res = await fetch(`${process.env.ruta}/wa/publico/consultaDocumento?search=id:${cod}`);
    const datos = await res.json();
    cookies.set('consulta', datos);
    let imga = `${process.env.ruta}/recursos/docs/miniaturas/${datos[0].miniatura}`;
    //console.log(imga); {`diets/${item.id}`}

    const cuerpo =
      <div>
        <div className="row">
          <div className="col-8 col-md-8 col-lg-8"></div>
          <div className="col-2 align-self-end">
            {
              //usuarioCookie != null && ( 'images/consulta/publicacion-situ.png' datos[0].miniatura
              <a download="Archivo.pdf" href={datos[0].url_origen} target="_blank">
                <button type="button" className="btn btn-light" onClick={() => actBitacora(cod)}>Descargar</button>
              </a>
              // )
            }
          </div>
        </div>
        <div className="row">
          {
            datos[0].miniatura != null ? (
              ///recursos/docs/miniaturas/
              <div className="col-3">
                <img src={imga} alt='Miniatura' className="img-responsive" width="115px" height="158px" />
              </div>
            ) : (
              <div className="col-3">
                <img src='/images/consulta/miniaturaD.png' alt='Miniatura' className="img-responsive" />
              </div>
            )}
          <div className="col-7">
            <p><b>{datos[0].nombre}</b><br></br>{datos[0].autor}</p>
          </div>
        </div>
        <br></br>
        <div className="row">
          <div className="col-12">
            <p><b>Descripción:</b><br></br> {datos[0].descripcion}</p>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <p><b>{datos[0].pais}</b> &nbsp;&nbsp;&nbsp;&nbsp;{datos[0].ano_publicacion}</p>
            <p>Tipo de documento:&nbsp;<b>{datos[0].tipo}</b></p>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-12 col-lg-12">
            <p>Tema 1:&nbsp;<b>{datos[0].tema1}</b></p>
            <p>Tema 2:&nbsp;<b>{datos[0].tema2}</b></p>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-12 col-lg-12">

            <Link href="/consulta-documental/consulta-metadatos">
              <a target="_blank"><p>Metadatos Completos</p></a>
            </Link>
          </div>
        </div>

      </div >
      ;

    setDatosModal(
      {
        title: 'Información de documento',
        body: cuerpo,
        nombreBoton: 'Cerrar'
      }
    )
    setShow(true)
  }

  //Para agregar la funcionalidad de mover modal
  function DraggableModalDialog(props) {
    return (
      <Draggable handle=".modal-header"><ModalDialog  {...props} /></Draggable>
    )
  }

  const handleonClick = () => {
    setCurrentPage(Number(event.target.id));
  }

  const pages = [];
  for (let i = 0; i <= Math.ceil(data.length / itemsPerPages); i++) {
    pages.push(i);
  }

  const indexOfLastItem = currentPage * itemsPerPages;
  const indexOfFirstItem = indexOfLastItem - itemsPerPages;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const renderPageNumbers = pages.map(number => {
    if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
      return (
        <li
          key={number}
          id={number}
          onClick={handleonClick}
          className={currentPage == number ? "active" : null}>
          {number}
        </li>
      )
    } else {
      return null;
    }
  });

  useEffect(() => {
    preCargaPDF();
    setData(url_bus);
    setLongitud(url_bus.length);
  });

  const handleNextbtn = () => {
    setCurrentPage(currentPage + 1);
    if (currentPage + 1 > maxPageNumberLimit) {
      setmaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
  }


  const handlePrevbtn = () => {
    setCurrentPage(currentPage - 1);
    if ((currentPage - 1) % pageNumberLimit == 0) {
      setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
  }


  let pageIncrementBtn = null;
  if (pages.length > maxPageNumberLimit) {
    pageIncrementBtn = <li onClick={handleNextbtn}> &hellip;</li>;
  }

  let pageDecrementBtn = null;
  if (minPageNumberLimit >= 1) {
    pageDecrementBtn = <li onClick={handlePrevbtn}> &hellip;</li>;
  }

  const MuestraCarga = e => {
    setShowCargaD(!showCargaD);
    setFileUrl('/images/consulta/miniaturaD.png');
  }

  const MuestraDescarga = e => {
    setShowReporte(!showReporte);
    preCargaPDF();
  }

  function processImage(event) {
    const imageFile = event.target.files[0];
    const imageUrl = URL.createObjectURL(imageFile);
    setFileUrl(imageUrl);
    setImgPortada(imageFile)
  }

  const onSubmitP = async (data) => {
    //se mandan los datos a bd
    data.portada = imgportada;
    //console.log(data);
    setFileUrl(null);
  }


  return <>
    <div className="row">
      {renderData(currentItems)}
    </div>
    <div className="row">
      <div className="col-4">
        {
          totalD != 0 ? (
            <p><b className="number-cd">{totalD}</b> Resultados en el sistema</p>
          ) : (
            <p><b className="number-cd">{data.length}</b> Resultados en el sistema</p>
          )
        }
      </div>
      <div className="col-5 col-md-5 col-lg-5">
        <ul className="pageNumbers">
          <li>
            <button onClick={handlePrevbtn}
              disabled={currentPage == 1 ? true : false}
            >
              <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
            </button>
          </li>
          {pageDecrementBtn}
          {renderPageNumbers}
          {pageIncrementBtn}
          <li>
            <button onClick={handleNextbtn}
              disabled={currentPage == pages[pages.length - 1] ? true : false}
            >
              <FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon>
            </button>
          </li>
        </ul>
      </div>

      <div className="col-1 text-center">
        <OverlayTrigger overlay={<Tooltip>{`Exportar Consulta a CSV`}</Tooltip>}>
          <Button onClick={descargarCVS} variant="link">
            <FontAwesomeIcon size="3x" icon={faFileCsv} />
          </Button>
        </OverlayTrigger>
      </div>
      <div className="col-1 text-center">
        <OverlayTrigger overlay={<Tooltip>{`Exportar Consulta a PDF`}</Tooltip>}>
          <Button onClick={descargaDoc} variant="link">
            <FontAwesomeIcon size="3x" icon={faFilePdf} />
          </Button>
        </OverlayTrigger>
      </div>
      <div className="col-1 text-center">
        {
          userDetails.id != undefined && (
            <OverlayTrigger overlay={<Tooltip>{`Registrar Documento`}</Tooltip>}>
              <Link href="/consulta-documental/registro">
                <Button variant="link">
                  <FontAwesomeIcon size="3x" icon={faUpload} />
                </Button>
              </Link>
            </OverlayTrigger>
          )
        }
      </div>
    </div>
    <br></br>
  </>;
}

export default PaginationComponent;
