import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { Form, Modal, Button, Table, Tabs, Tab, Pagination } from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap-table-next';
import ModalComponent from '../components/ModalComponent'
import ReactPaginate from 'react-paginate';
import Link from 'next/link';
import PaginationComponent from '../components/PaginationComponent'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faDownload, faSearch } from '@fortawesome/free-solid-svg-icons';
import { faWindowRestore } from '@fortawesome/free-regular-svg-icons';
import { DragDropContext, Droppable, Draggable as DraggableDnd, resetServerContext } from 'react-beautiful-dnd';
import Draggable from 'react-draggable';
import ModalDialog from 'react-bootstrap/ModalDialog';
import { Typeahead } from 'react-bootstrap-typeahead';
import Select from 'react-select';



function ContenedorCD() {


    const [pub, setPub] = useState('');
    const [r, modificaResultado] = useState([]);
    const [tfiltro, setTFiltro] = useState('Tema');
    const [datos, setDatos] = useState([]);
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


    const filtros = [
        { value: '1', label: 'ID' },
        { value: '2', label: 'Titulo' },
        { value: '3', label: 'Autor' },
        { value: '4', label: 'Tema' },
        { value: '5', label: 'Fecha de Publicación' }
    ];

    const orden = [
        { value: '1', label: 'Nombre A-Z' },
        { value: '2', label: 'Nombre Z-A' },
        { value: '3', label: 'Año de Publicación Mayor a Menor' },
        { value: '4', label: 'Año de Publicación Menor a Mayor' },
        { value: '5', label: 'Fuente A-Z' },
        { value: '6', label: 'Fuente Z-A' }
    ];



    //Para agregar la funcionalidad de mover modal
    function DraggableModalDialog(props) {
        return (
            <Draggable handle=".modal-header"><ModalDialog  {...props} /></Draggable>
        )
    }

    const [showModalB, setShowModalB] = useState(false)

    const verModal = e => {
        setShowModalB(!showModalB);
        setPub('');
    }


    const FiltroT = async (e) => {
        let tf = document.getElementById("filtro").value;

        if (e.target.value == 'tipo') {
            //console.log( `"${e.target.value}"   `+tf);
            //var filtrado = datos.filter(function (v){return v[e.target.value] == tf });
            //console.log(`${process.env.ruta}/wa/publico/consultaDocumento?search=tipo:*${tf}* OR tema1:*'${tf}'* OR tema2:*'${tf}'*`);
            const res2 = await fetch(`${process.env.ruta}/wa/publico/consultaDocumento?search=tipo:*${tf}*`);
            const datos = await res2.json();
            console.log(datos);
            modificaResultado(datos);
            setPub(`Se Encontraron ${datos.length} Documentos`)
        } else {
            const res2 = await fetch(`${process.env.ruta}/wa/publico/consultaDocumento?search=tema1:*${tf}* OR tema2:*${tf}*`);
            const datos = await res2.json();
            console.log(datos);
            modificaResultado(datos);
            setPub(`Se Encontraron ${datos.length} Documentos`)
        }

        document.getElementById("filtro").value = "";
    }

    const Filtro = e => {
        console.log(datos);
        let tf = document.getElementById("filtro").value;
        console.log(`"${e.target.value}"   ` + tf);
        var filtrado = datos.filter(function (v) { return v[e.target.value] == tf });
        console.log(filtrado);
        modificaResultado(filtrado);
    }

    const ultimasP = e => {
        console.log("Ultimas publicaciones");
        fetch(`${process.env.ruta}/wa/publico/ultimos30publicados`)
            .then((response) => response.json())
            .then((json) => modificaResultado(json));
    }


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
        fetch(`${process.env.ruta}/wa/publico/ultimos30publicados`)
            .then((response) => response.json())
            .then((json) => modificaResultado(json));
    }, []);



    const onSubmit = async (data) => {

        //console.log(`${process.env.ruta}/wa/publico/consultaDocumental?search=nombre:*${data.dato}* OR autor:*${data.autor}* OR nivelCobertura:${data.cobertura} OR descripcion:*'${data.descripcion}'* OR tipo:*${data.tipo}*`);
        const res2 = await fetch(`${process.env.ruta}/wa/publico/consultaDocumental?search=tipo:*${data.tipo}* OR nombre:*${data.dato}* OR autor:*${data.autor}* OR nivelCobertura:${data.cobertura} OR descripcion:*'${data.descripcion}'* `);
        const datos = await res2.json();

        setPub(`Se Encontraron ${datos.length} Docuemntos`)
        modificaResultado(datos);
        setDatos(datos);
        //modificaURL(`http://172.16.117.11/wa/publico/consultaDocumental?search=nombre:*${data.dato}* OR autor:*${data.autor}* OR nivelCobertura:${data.cobertura} OR descripcion:*${data.descripcion}* OR tipo:*${data.tipo}*`);
    }//fin del metodo onSubmit

    /*
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
    
    */
    return (
        <>
            <Modal dialogAs={DraggableModalDialog} show={showModalB} onHide={() => setShowModalB(!showModalB)}
                keyboard={false} className="modal-analisis" contentClassName="modal-redimensionable">
                <Modal.Header closeButton >
                    <Modal.Title><b>Busqueda</b></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="main">
                        <div className="container">
                            <div className="row"></div>
                            <div className="row">
                                <div className="col-12">
                                    <Form className="col-12" onSubmit={handleSubmit(onSubmit)}>
                                        <Form.Group controlId="dato">
                                            <Form.Label>Titulo</Form.Label>
                                            <Form.Control name="dato" type="text" ref={register()} />
                                        </Form.Group>
                                        <Form.Group controlId="descripcion">
                                            <Form.Label>Descripción</Form.Label>
                                            <Form.Control name="descripcion" type="text" ref={register()} />
                                        </Form.Group>
                                        <Form.Group controlId="autor">
                                            <Form.Label>Autor</Form.Label>
                                            <Form.Control name="autor" type="text" ref={register()} />
                                        </Form.Group>
                                        <Form.Group controlId="cobertura">
                                            <Form.Label>Cobertura Geográfica</Form.Label>
                                            <Form.Control name="cobertura" type="text" ref={register()} />
                                        </Form.Group>
                                        <Form.Group controlId="unidad">
                                            <Form.Label>Unidad Responsable</Form.Label>
                                            <Form.Control name="unidad" type="text" ref={register()} />
                                        </Form.Group>
                                        <Form.Group controlId="año">
                                            <Form.Label>Año de Edición</Form.Label>
                                            <Form.Control name="año" type="text" ref={register()} />
                                        </Form.Group>
                                        <Form.Group controlId="tipo">
                                            <Form.Label>Tipo</Form.Label>
                                            <Form.Control name="tipo" type="text" ref={register()} />
                                        </Form.Group>
                                        <Form.Group controlId="tema">
                                            <Form.Label>Tema</Form.Label>
                                            <Form.Control name="tema" type="text" ref={register()} />
                                        </Form.Group>
                                        <div className="text-center"><h6 name="encontrados">{pub}</h6></div>
                                        <div className="row">
                                            <div className="col-6">
                                                <Button variant="outline-secondary" className="btn-admin" type="submit" >BUSCAR</Button>
                                            </div>
                                            <div className="col-6">
                                                <Button variant="outline-danger" className="btn-admin" onClick={verModal}>Cerrar</Button>
                                            </div>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal >

            {//BettyP
            }
            <div className="col-12">
                <div className="tit-cd row">
                    <div className="col-6 col-xs-12"> <h4><b>CONSULTA DOCUMENTAL SITU</b></h4></div>
                    <div className="col-4 col-xs-12">
                        <div className="row sinpadding">
                            <div className="col-6">
                                <Form.Group controlId="inputF" className="busq1">
                                    <Form.Control type="text"/>
                                </Form.Group>
                            </div>
                            <div className="col-5">
                                <Select
                                    placeholder="Búsqueda"
                                    className="basic-single"
                                    classNamePrefix="Select"
                                    name="filtros"
                                    options={filtros}
                                    isClearable={true}
                                ></Select>
                            </div>
                            <div className="col-1">
                                <button className="busq" onClick={verModal}>
                                    <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row sinpadding">
                    <div className="col-6">
                        <Button className="btn-light bot-cd" onClick={ultimasP}>ÚLTIMAS PUBLICACIONES</Button>
                    </div>
                    <div className="col-6">
                        <Button className="btn-light bot-cd">MÁS CONSULTADAS</Button>
                    </div>
                </div>
                <div className="row filtros-cd sinpadding">
                    <div className="col-6">
                        <p><b className="number-cd">N</b> Resultados en el Sistema</p>
                    </div>
                    <div className="col-3">
                        <Select
                            placeholder="Ordenar por"
                            className="basic-single"
                            classNamePrefix="Select"
                            name="orden"
                            options={orden}
                            isClearable={true}
                        ></Select>
                    </div>
                </div>
                <br></br>
                {
                    r.length > 0 &&
                    (
                        <PaginationComponent
                            informacion={r}
                        />
                    )
                }
            </div>

        </>
    )

}

export default ContenedorCD;