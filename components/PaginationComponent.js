
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ModalComponent from './ModalComponent';






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
          data.map((todo) => {
            return (
              <div className='col-md-2 py-2 px-2' key={todo.id_metadato_documento}>
                <div className='card h-100'>
                  <div className='overflow'>
                    <Link href={`${todo.url_origen}`}>
                      <a target='_blank'>
                        <img src='images/consulta/imagen_min.jpg' alt='' className='card-img-top' />
                      </a>
                    </Link>
                    <p className='doc-title'>{todo.nombre}</p>
                    <a href="#" onClick={() => metadatosModal(todo.id_metadato_documento)} className="text-center">Detalle</a>
                  </div>
                </div>
              </div>
            )
          })   //termina la funcion map     
        }
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
  const [IdDoc, setIdDoc] = useState([]);

  //const onSubmit = async (data) =>
  const metadatosModal = async (cod) => {
    //console.log(cod);

    const res = await fetch(`http://172.16.117.11/wa/publico/consultaDocumento?search=id:${cod}`);
    const datos = await res.json();

    //console.log(datos);

    const cuerpo =
      <div>
        <div className="row">
          <div className="col-4">
            <img src='images/consulta/imagen_min.jpg' alt='imagen Miniatura' className="img-responsive" />
          </div>
          <div className="col-8">
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
            <a href={datos[0].url_origen} className="btn btn-light" target="_blank">Descargar</a>
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
  //console.log(url_bus)
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


  {renderData(currentItems)}


  <div className="row col-12 py-2 text-right">
    <ul className="pageNumbers">
      <li>
        <button onClick={handlePrevbtn}
          disabled={currentPage == 1 ? true : false}
        >
          Prev
        </button>
      </li>
      {pageDecrementBtn}
      {renderPageNumbers}
      {pageIncrementBtn}
      <li>
        <button onClick={handleNextbtn}
          disabled={currentPage == pages[pages.length - 1] ? true : false}
        >
          Next
        </button>
      </li>
    </ul>
  </div>
</>;
}

export default PaginationComponent;
