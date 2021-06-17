import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { Form, Modal, Button, Table, Tabs, Tab, Pagination } from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap-table-next';
import ModalComponent from '../../components/ModalComponent'
import ReactPaginate from 'react-paginate';
import Link from 'next/link';
import PaginationComponent from '../../components/PaginationComponent'






export async function getStaticProps() {
    //Recopilar los datos 
    const res2 = await fetch('http://172.16.117.11/wa/publico/ultimos30publicados');
    const docs = await res2.json();
    //modificaResultado1(docs);
    return { props: { docs } }
}



export default function ConsultaDocumental({ docs }) {


    const [r, modificaResultado] = useState(null);
    const [r1, modificaResultado1] = useState(null);
    //Datos para el modal
    const [show, setShow] = useState(false);
    const [datosModal, setDatosModal] = useState({});
    //Estados para mostrar el modal
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    //Para mostra la busqueda
    const [muestraTablABusqueda, setMuestraTablaBusqueda] = useState(false)

    //Datos para crear el form
    const { register, handleSubmit, watch, clearErrors, setError, errors } = useForm();

    function metadatosModal() {
                setDatosModal(
                    {
                        title: 'Información de documento',
                        body: 'Metadatos',
                        nombreBoton: 'Cerrar'
                    }
                )
                setShow(true)
            }


    useEffect(() => {
                modificaResultado1(docs);
                //console.log(docs);
            })

    /*
  useEffect(() => {
      fetch("http://172.16.117.11/wa/publico/ultimos30publicados")
      .then((response) => response.json())
      .then((json) => modificaResultado1(docs));
  });
*/
    const onSubmit = async (data) => {
            const res2 = await fetch(`http://172.16.117.11/wa/publico/consultaDocumental?search=nombre:*${data.dato}* OR autor:*${data.autor}* OR nivelCobertura:${data.cobertura} OR descripcion:*${data.descripcion}* OR tipo:*${data.tipo}*`);
            const datos = await res2.json();
            modificaResultado(datos);
            //modificaURL(`http://172.16.117.11/wa/publico/consultaDocumental?search=nombre:*${data.dato}* OR autor:*${data.autor}* OR nivelCobertura:${data.cobertura} OR descripcion:*${data.descripcion}* OR tipo:*${data.tipo}*`);
        }//fin del metodo onSubmit

        const documentos = [0, 1, 2];

        const columnsDocumentos = [
            {
                dataField: 'nombre',
                text: 'Nombre',
            },
            {
                dataField: 'descripcion',
                text: 'Descripción'
            },
            {
                dataField: 'autor',
                text: 'Autor(a)',
            },
            {
                dataField: 'cobertura',
                text: 'Cobertura geográfica',
            },
            {
                dataField: 'unidad',
                text: 'Unidad responsable de generación',
            },
            {
                dataField: 'periodo',
                text: 'Periodo',
            },
            {
                dataField: 'tema',
                text: 'Tema',
            },
            {
                dataField: 'tipo',
                text: 'Tipo de documento',
            },
            {
                dataField: 'vigentes',
                text: 'Vigentes',
            },
            {
                dataField: 'consultadas',
                text: 'Más consultadas',
            }
        ];



        return (
            <>
                <ModalComponent
                    show={show}
                    datos={datosModal}
                    onHide={handleClose}
                    onClick={handleClose}
                />


                <div className="main">
                    <div className="container">
                        <div className="row"></div>
                        <div className="row">
                            <div className="col-12">
                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <Tabs className="tabs-consulta" defaultActiveKey="titulo" id="uncontrolled-tab-example">
                                        <Tab eventKey="titulo" title="TÍTULO">
                                            <Form.Group controlId="dato">
                                                <Form.Control name="dato" type="text" ref={register()} />
                                            </Form.Group>
                                            <Button variant="outline-secondary" className="btn-admin" type="submit">BUSCAR</Button>
                                        </Tab>
                                        <Tab eventKey="descripcion" title="DESCRIPCIÓN">
                                            <Form.Group controlId="descripcion">
                                                <Form.Control name="descripcion" type="text" ref={register()} />
                                            </Form.Group>
                                            <Button variant="outline-secondary" className="btn-admin" type="submit">BUSCAR</Button>
                                        </Tab>
                                        <Tab eventKey="autor" title="AUTOR">
                                            <Form.Group controlId="autor">
                                                <Form.Control name="autor" type="text" ref={register()} />
                                            </Form.Group>
                                            <Button variant="outline-secondary" className="btn-admin" type="submit">BUSCAR</Button>
                                        </Tab>
                                        <Tab eventKey="cobertura" title={<>COBERTURA<br />GEOGRÁFICA</>}>
                                            <Form.Group controlId="cobertura">
                                                <Form.Control name="cobertura" type="text" ref={register()} />
                                            </Form.Group>
                                            <Button variant="outline-secondary" className="btn-admin" type="submit">BUSCAR</Button>
                                        </Tab>
                                        <Tab eventKey="unidad" title={<>UNIDAD<br />RESPONSABLE</>}>
                                            <Form.Group controlId="unidad">
                                                <Form.Control name="unidad" type="text" ref={register()} />
                                            </Form.Group>
                                            <Button variant="outline-secondary" className="btn-admin" type="submit">BUSCAR</Button>
                                        </Tab>
                                        <Tab eventKey="año" title={<>AÑO DE<br />EDICIÓN</>}>
                                            <Form.Group controlId="año">
                                                <Form.Control name="año" type="text" ref={register()} />
                                            </Form.Group>
                                            <Button variant="outline-secondary" className="btn-admin" type="submit">BUSCAR</Button>
                                        </Tab>
                                        <Tab eventKey="tipo" title="TIPO">
                                            <Form.Group controlId="tipo">
                                                <Form.Control name="tipo" type="text" ref={register()} />
                                            </Form.Group>
                                            <Button variant="outline-secondary" className="btn-admin" type="submit">BUSCAR</Button>
                                        </Tab>
                                        <Tab eventKey="tema" title="TEMA">
                                            <Form.Group controlId="tema">
                                                <Form.Control name="tema" type="text" ref={register()} />
                                            </Form.Group>
                                            <Button variant="outline-secondary" className="btn-admin" type="submit">BUSCAR</Button>
                                        </Tab>
                                    </Tabs>
                                </Form>
                            </div>
                        </div>

                        <div className="row py-2 text-center">
                            {
                                r != null ? (
                                    <PaginationComponent informacion={r} />
                                ) : (
                                    r1 != null ? (
                                        < PaginationComponent informacion={r1} />
                                    ) : (
                                        <p>
                                            hola
                                        </p>
                                    )

                                    /*
                                    <div className="row py-2">
                                <div className="col-md-12">
                                    <div className="card card-body">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <p className="tw-text-center"><b>Lo mas buscado</b></p>
    
                                            </div>
                                            {
                                                docs.map((doc) =>
                                                    <div className="col-md-2 py-1" key={`${doc.id_metadato_documento}`}>
                                                        <div className="card h-100">
                                                            <div className="overflow">
                                                                <Link href={`${doc.url_origen}`}>
                                                                    <a target="_blank">
                                                                        <img src="images/consulta/imagen_min.jpg" alt="" className="card-img-top" />
                                                                    </a>
                                                                </Link>
                                                                <p className="doc-title">{doc.nombre}</p>
                                                                <a href="#" onClick={metadatosModal} className="text-center">Detalle</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                                    */
                                )
                            }
                        </div>
{/*
                        <div className="row">
                            <div className="col-12">
                                <p className="tw-text-center"><b>LO MÁS BUSCADO</b></p>
                            </div>
                            <div className="col-3">
                                <img src="/images/img-pdf.png" style={{ height: 50 + "px" }}></img>
                            </div>
                            <div className="col-3">
                                <img src="/images/img-pdf.png" style={{ height: 50 + "px" }}></img>
                            </div>
                            <div className="col-3">
                                <img src="/images/img-pdf.png" style={{ height: 50 + "px" }}></img>
                            </div>
                            <div className="col-3">
                                <img src="/images/img-pdf.png" style={{ height: 50 + "px" }}></img>
                            </div>
                            <div className="col-3">
                                <img src="/images/img-pdf.png" style={{ height: 50 + "px" }}></img>
                            </div>
                            <div className="col-3">
                                <img src="/images/img-pdf.png" style={{ height: 50 + "px" }}></img>
                            </div>
                            <div className="col-3">
                                <img src="/images/img-pdf.png" style={{ height: 50 + "px" }}></img>
                            </div>
                            <div className="col-3">
                                <img src="/images/img-pdf.png" style={{ height: 50 + "px" }}></img>
                            </div>
                        </div>


                        {/* <ReactPaginate
                        previousLabel={'<'}
                        nextLabel={'>'}
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={5}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        containerClassName={'pagination'}
                        activeClassName={'active'}
                        pageClassName={'page-item'}
                        pageLinkClassName={'page-link'}

                    /> */}
{/*
                        <Pagination>
                            <Pagination.Prev />
                            <Pagination.Item>{1}</Pagination.Item>
                            <Pagination.Item>{2}</Pagination.Item>
                            <Pagination.Item>{3}</Pagination.Item>
                            <Pagination.Item>{4}</Pagination.Item>
                            <Pagination.Next />
                        </Pagination>

*/}

                        {/* <div className="row">
                        <div className="col-12">
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th colSpan="5" className="tw-text-center">Documentos</th>
                                    </tr>
                                    <tr>
                                        <th>Imagen</th>
                                        <th>Título</th>
                                        <th>Año</th>
                                        <th>Fuente</th>
                                        <th>Detalle</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <a href="https://static1.squarespace.com/static/57acf5c1893fc073f698fab9/t/5cd5914cfa0d60623958a300/1557500236915/blank.pdf" target="_blank">
                                                <img src="/images/img-pdf.png" style={{ height: 50 + "px" }}></img>
                                            </a>
                                        </td>
                                        <td>Titulo libro pdf</td>
                                        <td>2021</td>
                                        <td>Fuente</td>
                                        <td><a href="#" onClick={metadatosModal}>Detalle</a></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <a href="/images/doc.docx" download>
                                                <img src="/images/img-icon.png" style={{ height: 50 + "px" }}></img>
                                            </a>
                                        </td>
                                        <td>Titulo libro NO pdf</td>
                                        <td>2021</td>
                                        <td>Fuente</td>
                                        <td><a href="#" onClick={metadatosModal}>Detalle</a></td>
                                    </tr>
                                </tbody>

                            </Table>
                        </div>

                        <div className="col-6">
                            <Form onSubmit={handleSubmit(onSubmit)}>

                                <Form.Group controlId="nombre">
                                    <Form.Control name="nombre" type="text" placeholder="Nombre"
                                        ref={register()} />
                                </Form.Group>

                                <Form.Group controlId="descripcion">
                                    <Form.Control name="descripcion" type="text" placeholder="Descripcion"
                                        ref={register()} />
                                </Form.Group>

                                <Form.Group controlId="autor">
                                    <Form.Control name="autor" type="text" placeholder="Autor"
                                        ref={register()} />
                                </Form.Group>

                                <Form.Group controlId="cobertura">
                                    <Form.Control name="cobertura" type="text" placeholder="Cobertura Geográfica"
                                        ref={register()} />
                                </Form.Group>

                                <Form.Group controlId="unidad">
                                    <Form.Control name="unidad" type="text" placeholder="Unidad Responsable de generación"
                                        ref={register()} />
                                </Form.Group>

                                <Form.Group controlId="periodo">
                                    <Form.Control name="periodo" type="text" placeholder="Periodo"
                                        ref={register()} />
                                </Form.Group>

                                <Form.Group controlId="tema">
                                    <Form.Control name="tema" type="text" placeholder="Tema"
                                        ref={register()} />
                                </Form.Group>

                                <Form.Group controlId="tipo">
                                    <Form.Control name="tipo" type="text" placeholder="Tipo"
                                        ref={register()} />
                                </Form.Group>

                                <Form.Group controlId="vigentes">
                                    <Form.Control name="vigentes" type="text" placeholder="Vigentes"
                                        ref={register()} />
                                </Form.Group>

                                <Form.Group controlId="consultadas">
                                    <Form.Control name="consultadas" type="text" placeholder="Más Consultadas"
                                        ref={register()} />
                                </Form.Group>

                                <Button variant="outline-secondary" className="btn-admin" type="submit">BUSCAR</Button>
                            </Form>
                        </div>

                        {muestraTablABusqueda &&
                            <div className="col-12">
                                <BootstrapTable keyField='id' data={documentos} columns={columnsDocumentos} />
                            </div>
                        }

                    </div> */}

                    </div>
                </div>
            </>
        )
    }