import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ModalComponent from './ModalComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faDownload, faEye, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Form, Modal, Button, Table, Tabs, Tab, Pagination } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import { faWindowRestore } from '@fortawesome/free-regular-svg-icons';
import { DragDropContext, Droppable, Draggable as DraggableDnd, resetServerContext } from 'react-beautiful-dnd';
import Draggable from 'react-draggable';
import ModalDialog from 'react-bootstrap/ModalDialog';
import Select from 'react-select';
import dataPub from '../shared/jsons/publicaciones.json';


function PaginationComponent(props) {

  //Datos para crear el form
  const { register, handleSubmit, watch, clearErrors, setError, errors } = useForm();
  const [tarchivo, setTarchivo] = useState(null);
  const [fileUrl, setFileUrl] = useState('images/consulta/publicacion-situ.png');
  const [imgportada, setImgPortada] = useState(null);

  const tarchivos = [
    { value: '1', label: 'Documento' },
    { value: '2', label: 'Enlace' }
  ];

  const tipoA = e => {
    //console.log(e.value);

    if (e == null) {
      setTarchivo("");
    } else {
      setTarchivo(e.value);
    }
  }


  const url_bus = props.informacion;

  const renderData = data => {
    return (
      <> <ModalComponent
        show={show}
        datos={datosModal}
        onHide={handleClose}
        onClick={handleClose}
      />

        {
          <div>
            <div className="row">
              <table className="table table-bordered">
                <thead className="thead-dark">
                  <tr>
                    <th>Portada</th>
                    <th className="columna1">Titulo</th>
                    <th className="columna2">Autor</th>
                    <th className="columna3">Tema</th>
                    <th className="columna4">Fecha de Publicación</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    data.map((todo) => {
                      return (
                        <tr key={todo.id_metadato_documento}>
                          <td>
                            <a target='_blank'>
                              <img src='images/consulta/publicacion-situ.png' alt='Miniatura' className='card-img-top' />
                            </a>
                          </td>
                          <td>
                            {todo.nombre}
                          </td>
                          <td>
                            {todo.autor}
                          </td>
                          <td>
                            <p>{todo.tema1}</p>
                            <p>{todo.tema2}</p>
                          </td>
                          <td>
                            <p>{todo.ano_publicacion}-{todo.mes_publicacion}-{todo.dia_publicacion}</p>
                          </td>
                          <td >
                            <a className="columna5" onClick={() => metadatosModal(todo.id_metadato_documento)}><FontAwesomeIcon icon={faEye} /></a>
                          </td>
                        </tr>
                      )
                    }) //termiina funcion map
                  }
                </tbody>
              </table>

            </div>
          </div>

        /*  data.map((todo) => {
            return (
        <div className='col-md-2 py-2 px-2' key={todo.id_metadato_documento}>
          <div className='card h-100 overflow'>
            <Link href={`${todo.url_origen}`}>
              <a target='_blank'>
                <img src='images/consulta/publicacion-situ.png' alt='Miniatura' className='card-img-top' />
              </a>
            </Link>

            <p className='doc-title'>{todo.nombre}</p>
            <div className="align-self-end align-self-center">
              <a href="#" onClick={() => metadatosModal(todo.id_metadato_documento)} className="card-link">Detalle</a>
            </div>
          </div>

        </div>
        )
          })   //termina la funcion map     
        */ }
      </>
    )

  }


  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPages, setItemsPerPages] = useState(6);

  const [pageNumberLimit, setPageNumberLimit] = useState(6);
  const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(6);
  const [minPageNumberLimit, setminPageNumberLimit] = useState(0);

  const [datosModal, setDatosModal] = useState({});
  const [show, setShow] = useState(false);
  const [showCargaD, setShowCargaD] = useState(false);
  //Estados para mostrar el modal
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);


  //const onSubmit = async (data) =>
  const metadatosModal = async (cod) => {

    const res = await fetch(`${process.env.ruta}/wa/publico/consultaDocumento?search=id:${cod}`);
    const datos = await res.json();

    const cuerpo =
      <div>
        <div className="row">
          <div className="col-5">
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
          </div>
        </div>
        <div className="row">
          <div className="col center-block">
            <a download="Archivo.pdf" href={datos[0].url_origen} target="_blank">
              <button type="button" className="btn btn-light">Descargar</button>
            </a>

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
    setData(url_bus)
    //console.log(url_bus);
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
    setFileUrl(null);
  }
  

  
  function processImage(event) {
    const imageFile = event.target.files[0];
    const imageUrl = URL.createObjectURL(imageFile);
    setFileUrl(imageUrl);
    setImgPortada(imageFile)
  }

  const onSubmitP = async (data) => {
    //se mandan los datos a bd
    data.portada=imgportada;
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
        <Modal.Title><b>Busqueda</b></Modal.Title>
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
                  <Button variant="outline-secondary" className="btn-admin" type="submit" >Guardar</Button>
                </div>
                <div className="col-6">
                  <Button variant="outline-danger" className="btn-admin" onClick={MuestraCarga}>Cancelar</Button>
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



    <div className="row datos-cd">
      {renderData(currentItems)}
    </div>

    <div className="row">
      <div className="col-8">
        <button className="b btn btn-light" onClick={MuestraCarga}> Cargar Documento&nbsp;
          <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>
        </button>&nbsp;&nbsp;
        <button className="b btn btn-light" >Descargar Consulta&nbsp;
          <FontAwesomeIcon icon={faDownload}></FontAwesomeIcon>
        </button>
      </div>
      <div className="col-1"></div>
      <div className="py-2 col-2 text-align-left">
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
    </div>




  </>;
}

export default PaginationComponent;
