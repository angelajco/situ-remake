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


function PaginationComponent(props) {

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
                            <p className='doc-title'>{todo.tema1}</p>
                          </td>
                          <td>
                            <p className='doc-title'>{todo.fecha_cap_situ}</p>
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



  return <>

    <div className="row datos-cd">
      {renderData(currentItems)}
    </div>

    <div className="row">
      <div className="col-8">
        <button className="b btn btn-light" > Cargar Documento&nbsp;
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
