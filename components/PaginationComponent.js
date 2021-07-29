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
import dataPub from '../shared/jsons/publicaciones.json';
//import { Button, Form, OverlayTrigger, Tooltip, Tab, Row, Col, Nav } from 'react-bootstrap'
//import datosP from '../shared/jsons/Datos.json';
import jsPDF from 'jspdf';
import jpt from 'jspdf-autotable';
import Cookies from 'universal-cookie'
const cookies = new Cookies()


function PaginationComponent(props) {

  const url_bus = props.informacion;

  const usuarioCookie = cookies.get('Usuario')
  const usuarioI = cookies.get('IDU')

  //Datos para crear el form
  const { register, handleSubmit, watch, clearErrors, setError, errors } = useForm();
  const [tarchivo, setTarchivo] = useState(null);
  const [fileUrl, setFileUrl] = useState('images/consulta/publicacion-situ.png');
  const [imgportada, setImgPortada] = useState(null);

  const tarchivos = [
    { value: '1', label: 'Documento' },
    { value: '2', label: 'Enlace' }
  ];


  const descargaDoc = async (e) => {
    preCargaPDF();
    var hoy = new Date();
    var fecha = hoy.getDate() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear();
    var hora = hoy.getHours() + ':' + hoy.getMinutes();
    var items = filtrarJson(data);
    var img = new Image();
    img.onload = function () {
      var dataURI = getBase64Image(img);
      return dataURI;
    }
    img.src = "images/consulta/encabezado.jpg";
    /// codigo para generar pdf 
    const columns = Object.keys(items[0]);
    var result = [];
    items.forEach(element => {
      result.push(Object.values(element));
    });
    var doc = new jsPDF(); jpt;

    var header = function (data) {
      doc.addImage(img.onload(), 'JPEG', 5, 5, 195, 30);
      doc.setFontSize(10);
      doc.text(20, 43, "Nombre Usuario: " + usuarioCookie);
      doc.text(140, 43, "FECHA:  " + fecha + "    HORA: " + hora);
      //doc.setFontType("bold");
      doc.setFontSize(13);
      doc.text(75, 53, "CONSULTA DOCUMENTAL");
      doc.setFontSize(10);
      //doc.setFontType("normal");
      doc.text(20, 60, "Total de documentos: " + items.length);
      doc.setFontSize(9);
    };

    doc.autoTable(columns, result, {
      margin: { top: 65 }, theme: 'grid', beforePageContent: header,
      columnStyles: {
        0: { columnWidth: 30 },
        1: { columnWidth: 20 },
        2: { columnWidth: 20 },
        3: { columnWidth: 14 },
        4: { columnWidth: 25 },
        5: { columnWidth: 24 },
        6: { columnWidth: 23 },
        7: { columnWidth: 28 },
      }
    });


  /*  if (usuarioCookie != null) {
      doc.autoTable(columns, result, {
        margin: { top: 65 }, theme: 'grid', beforePageContent: header,
        columnStyles: {
          0: { columnWidth: 30 },
          1: { columnWidth: 20 },
          2: { columnWidth: 20 },
          3: { columnWidth: 15 },
          4: { columnWidth: 25 },
          5: { columnWidth: 24 },
          6: { columnWidth: 20 },
          7: { columnWidth: 28 },
        }
      });
    } else {
      doc.autoTable(columns, result, {
        margin: { top: 65 }, theme: 'grid', beforePageContent: header,
        columnStyles: {
          0: { columnWidth: 25 },
          1: { columnWidth: 25 },
          2: { columnWidth: 25 },
          3: { columnWidth: 18 },
          4: { columnWidth: 28 },
          5: { columnWidth: 25 },
          6: { columnWidth: 30 },
        }
      });
    }*/

    let string = doc.output('datauristring');

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      doc.save('Consulta-Documental');
    } else {
      doc.save('Consulta-Documental');
    }

  }

  function preCargaPDF() {
    var hoy = new Date();
    var fecha = hoy.getDate() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear();
    var hora = hoy.getHours() + ':' + hoy.getMinutes();
    var img = new Image();
    img.onload = function () {
      var dataURI = getBase64Image(img);
      return dataURI;
    }
    img.src = "images/consulta/encabezado.jpg";
    /// codigo para generar pdf 
    const columns = []
    var result = [];
    var doc = new jsPDF(); jpt;
    var header = function (data) {
      doc.addImage(img.onload(), 'JPEG', 5, 5, 195, 30);
      doc.setFontSize(10);
      doc.text(20, 43, "Nombre Usuario: " + usuarioCookie);
      doc.text(140, 43, "FECHA:  " + fecha + "    HORA: " + hora);
      doc.setFontSize(13);
      doc.text(75, 53, "CONSULTA DOCUMENTAL");
      doc.setFontSize(9);
      //doc.text(20, 60, "Total de documentos: " + items.length);
    };
    doc.autoTable(columns, result, { margin: { top: 65 }, theme: 'grid', beforePageContent: header });
    let string = doc.output('datauristring');
  }

  const actBitacora = async (cod) => {
    if (usuarioCookie != null) {
      //codigo para actualizar la botacora cuendo se descarge un documento
      const res = await fetch(`${process.env.ruta}/wa/publico/bitacoraDocumento?id_usuario=${usuarioI}&id_documento=${cod}`);
      const datos = await res.json();
    } else {
      console.log("No registra bitacora");
    }
  }

  const descargarCVS = async (e) => {
    //codigo para descargar el archivo csv
    var hoy = new Date();
    var fecha = hoy.getDate() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear();
    var hora = hoy.getHours() + ':' + hoy.getMinutes();
    var items = filtrarJson(data);
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(items[0]);
    let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    csv.unshift("Total de Documentos: " + items.length);
    csv.unshift("CONSULTA DOCUMENTAL");
    csv.unshift("FECHA:  " + fecha + "    HORA: " + hora);
    csv.unshift("Nombre Usuario: " + usuarioCookie);
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
      //console.log(element.ano_publicacion);
      let js = {};
      js.Titulo = element.nombre;
      js.Autor = element.autor;
      js.Pais = element.pais;
      js.Fecha = element.ano_publicacion;
      js.Clasificacion = element.tipo;
      js.Tema1 = element.tema1;
      js.Tema2 = element.tema2;
      //js.Cobertura = element.nivel_cobertura;
      //js.Formato = element.formato;
      js.Archivo = element.url_origen;
      if (usuarioCookie != null) {
        
      }
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

  const renderData = data => {
    return (
      <> <ModalComponent
        show={show}
        datos={datosModal}
        onHide={handleClose}
        onClick={handleClose}
      />
        {
          <table className="t1 table table-bordered table-responsive ">
            <thead className="thead-dark">
              <tr>
                <th>Portada</th>
                <th>Titulo</th>
                <th>Fecha de Publicación</th>
                <th>Fuente</th>
              </tr>
            </thead>
            <tbody>
              {
                data.map((todo) => {
                  return (
                    <tr key={todo.id_metadato_documento}>
                      <td>
                        <OverlayTrigger overlay={<Tooltip>Detalle</Tooltip>}>
                          <a target='_blank' onClick={() => metadatosModal(todo.id_metadato_documento)}>
                            <img src='images/consulta/PUBLICACION_SITU.png' alt='Miniatura' className='card-img-top' />
                          </a>
                        </OverlayTrigger>
                      </td>
                      <td>
                        {todo.nombre}
                      </td>
                      <td>
                        <p>{todo.ano_publicacion}-{todo.mes_publicacion}-{todo.dia_publicacion}</p>
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
  const [itemsPerPages, setItemsPerPages] = useState(5);

  const [pageNumberLimit, setPageNumberLimit] = useState(5);
  const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
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
    const res = await fetch(`${process.env.ruta}/wa/publico/consultaDocumento?search=id:${cod}`);
    const datos = await res.json();

    const cuerpo =
      <div>
        <div className="row">
          <div className="col-8 col-md-8 col-lg-8"></div>
          <div className="col-2 align-self-end">
            {
              //usuarioCookie != null && (
              <a download="Archivo.pdf" href={datos[0].url_origen} target="_blank">
                <button type="button" className="btn btn-light" onClick={() => actBitacora(cod)}>Descargar</button>
              </a>
              // )
            }
          </div>
        </div>
        <div className="row">
          <div className="col-3">
            <img src='images/consulta/publicacion-situ.png' alt='Miniatura' className="img-responsive" />
          </div>
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
    setData(url_bus)
  })

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
    setFileUrl('images/consulta/publicacion-situ.png');
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
    {
      //Betty1
    }
    <Modal dialogAs={DraggableModalDialog} show={showCargaD} onHide={() => setShowCargaD(!showCargaD)}
      keyboard={false} className="modal-analisis" contentClassName="modal-redimensionable tamanio">
      <Modal.Header closeButton >
        <Modal.Title><b>Carga de Documentos</b></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row"></div>
        <Tabs className="tabs-consulta" defaultActiveKey="carga" id="uncontrolled-tab-example">
          <Tab eventKey="carga" title="Carga de Documentos">
            <Form className="col-12" onSubmit={handleSubmit(onSubmitP)}>
              <div className="row">
                <Form.Group controlId="tipo" className="col-5">
                  <Form.Label>Tipo de Documento</Form.Label>
                  <Select
                    placeholder="Selecciona..."
                    className="basic-single"
                    classNamePrefix="Select"
                    name="tipo"
                    options={tarchivos}
                    isClearable={true}
                    onChange={tipoA}
                    ref={register()}
                  ></Select>
                </Form.Group>
                <div className="col-7">
                  {
                    tarchivo == 1 && tarchivo != null ? (
                      <div>
                        <Form.Group controlId="doc">
                          <Form.Label>Documento</Form.Label>
                          <Form.File name="doc" ref={register()} />
                        </Form.Group>
                      </div>
                    ) : (
                      tarchivo == 2 && tarchivo != null ? (
                        <Form.Group controlId="enlace">
                          <Form.Label>Enlace</Form.Label>
                          <Form.Control name="enlace" type="text" ref={register()} />
                        </Form.Group>
                      ) : (
                        <p></p>
                      )
                    )
                  }
                </div>
              </div>
              <hr></hr>
              <div className="row">
                <div className="col-2">
                  <Form.Group controlId="portada">
                    <Form.Label>Portada</Form.Label>
                    <img className="mini" src={fileUrl}></img>
                    <br></br>
                    <Form.File name="portada" accept="image/*" ref={register()} onChange={processImage} />
                  </Form.Group>
                </div>
                <div className="col-5">
                  <Form.Group controlId="titulo">
                    <Form.Label>Titulo</Form.Label>
                    <Form.Control name="titulo" type="text" ref={register()} />
                  </Form.Group>
                  <Form.Group controlId="autor">
                    <Form.Label>Autor</Form.Label>
                    <Form.Control name="autor" type="text" ref={register()} />
                  </Form.Group>
                  <Form.Group controlId="tema1">
                    <Form.Label>Tema 1</Form.Label>
                    <Form.Control name="tema1" type="text" ref={register()} />
                  </Form.Group>
                  <Form.Group controlId="tema2">
                    <Form.Label>Tema 2</Form.Label>
                    <Form.Control name="tema2" type="text" ref={register()} />
                  </Form.Group>
                </div>
                <div className="col-5">
                  <Form.Group controlId="entidad">
                    <Form.Label>Entidad</Form.Label>
                    <Form.Control name="entidad" type="text" ref={register()} />
                  </Form.Group>
                  <Form.Group controlId="municipio">
                    <Form.Label>Municipio</Form.Label>
                    <Form.Control name="municipio" type="text" ref={register()} />
                  </Form.Group>
                  <Form.Group controlId="idgeo">
                    <Form.Label>ID Geográfico</Form.Label>
                    <Form.Control name="idgeo" type="text" ref={register()} />
                  </Form.Group>
                  <Form.Group controlId="serie">
                    <Form.Label>Serie</Form.Label>
                    <Form.Control name="serie" type="text" ref={register()} />
                  </Form.Group>

                </div>

              </div>
              <div className="row text-center">
                <div className="col-6">
                  <Button variant="outline-secondary" className="btn-admin" type="submit">Guardar</Button>
                </div>
                <div className="col-6">
                  <Button variant="outline-danger" className="btn-admin" onClick={MuestraDescarga}>Cancelar</Button>
                </div>
              </div>
            </Form>
          </Tab>
          <Tab eventKey="hcargas" title="Historial de cargas">
            <br></br>
            <div className="row text-center">
              <div className="col-12 table-wrapper-scroll-y my-custom-scrollbar">
                <table className="table table-bordered table-striped mb-0">
                  <thead className="thead-dark">
                    <tr>
                      <th>Nombre</th>
                      <th>Fecha</th>
                      <th>Estatus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      dataPub.map((todo) => {
                        return (
                          <tr key={todo.value}>
                            <td>{todo.nombre}</td>
                            <td>{todo.date}</td>
                            <td>{todo.status}</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
            <br></br>
            <br></br>
            <div className="row text-center">
              <div className="col-12">
                <Button variant="outline-danger" className="btn-admin" onClick={MuestraCarga}>Cancelar</Button>
              </div>
            </div>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal >


    <div className="row">
      {renderData(currentItems)}
    </div>
    <div className="row">
      <div className="col-4">
        <p><b className="number-cd">{data.length}</b> Resultados en el sistema</p>
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
        <OverlayTrigger overlay={<Tooltip>Consulta CVS</Tooltip>}>
          <a onClick={descargarCVS}><FontAwesomeIcon size="3x" icon={faFileCsv} /></a>
        </OverlayTrigger>
      </div>
      <div className="col-1 text-center">
        <OverlayTrigger overlay={<Tooltip>Consulta PDF</Tooltip>}>
          <a onClick={descargaDoc}><FontAwesomeIcon size="3x" icon={faFilePdf} /></a>
        </OverlayTrigger>
      </div>
      <div className="col-1 text-center">
        {
          usuarioCookie != null && (
            <OverlayTrigger overlay={<Tooltip>Cargar Documento</Tooltip>}>
              <Link href="/consulta-documental/cargaDocumental">
                <a><FontAwesomeIcon size="3x" icon={faUpload} /></a>
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
