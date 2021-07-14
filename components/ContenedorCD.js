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
import Select from 'react-select';



function ContenedorCD() {

    const [pub, setPub] = useState('');
    const [r, modificaResultado] = useState([]);
    const [datos, setDatos] = useState([]);
    const [aux, setAux] = useState(false);
    const [tfiltro, setTFiltro] = useState('Tema');
    //para busqueda avanzada
    const [titulo, setTitulo] = useState();
    const [desc, setDesc] = useState();
    const [autor, setAutor] = useState();
    const [cobertura, setCobertura] = useState();
    const [unidad, setUnidad] = useState();
    const [edicion, setEdicion] = useState();
    const [tipo, setTipo] = useState();
    const [tema, setTema] = useState();
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

    //json para los select de los filtros
    const filtros = [
        //{ value: '1', label: 'ID' },
        { value: '2', label: 'Titulo' },
        { value: '3', label: 'Autor' },
        { value: '4', label: 'Tema' },
        { value: '5', label: 'Tipo' },
        { value: '6', label: 'Fecha de Publicación' }
    ];
    const orden = [
        { value: '1', label: 'Nombre A-Z' },
        { value: '2', label: 'Nombre Z-A' },
        { value: '3', label: 'Año de Publicación Mayor a Menor' },
        { value: '4', label: 'Año de Publicación Menor a Mayor' },
        { value: '5', label: 'Fuente A-Z' },
        { value: '6', label: 'Fuente Z-A' }
    ];
    const tipoF = [
        { value: '1', label: 'Normativo' },
        { value: '2', label: 'Instrumento de planeación' },
        { value: '3', label: 'Artículo de Revista' },
        { value: '4', label: 'Revista' },
        { value: '5', label: 'Artículo en revista Indexada' },
        { value: '6', label: 'Revista Indexada' },
        { value: '7', label: 'Libro' },
        { value: '8', label: 'Tésis' },
        { value: '9', label: 'Investigación' },
        { value: '10', label: 'Otro' }
    ];
    const temaF = [
        { value: '1', label: 'Ambiental' },
        { value: '2', label: 'Demográfico' },
        { value: '3', label: 'Energía' },
        { value: '4', label: 'Gestión' },
        { value: '5', label: 'Internacional' },
        { value: '6', label: 'Riesgo, peligros y vulnerabilidad' },
        { value: '7', label: 'Salud' },
        { value: '8', label: 'Socioeconómico' },
        { value: '9', label: 'Tecnológico' },
        { value: '10', label: 'Territorial' },
        { value: '11', label: 'Movilidad' },
        { value: '12', label: 'Planeación' },
        { value: '13', label: 'Ordenamiento Territorial y Urbano' },
        { value: '14', label: 'Ordenamiento Ecológico' },
        { value: '15', label: 'Vivienda' },
        { value: '16', label: 'Desarrollo Agrario' },
        { value: '17', label: 'Desarrollo Rural' },
        { value: '18', label: 'Riesgos' },
        { value: '19', label: 'Catastro' },
        { value: '20', label: 'Gobernanza' }
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

    const cerrarM = e => {
        setShowModalB(!showModalB);
        setTitulo();
        setDesc();
        setAutor();
        setCobertura();
        setEdicion();
        setTipo();
        setTema();
    }

    function ordenarAsc(p_array_json, p_key) {
        p_array_json.sort(function (a, b) {
            return a[p_key] > b[p_key];
        });
    }

    function ordenarDesc(p_array_json, p_key) {
        ordenarAsc(p_array_json, p_key); p_array_json.reverse();
    }

    const ordenDatos = e => {
        if (e != null) {
            //console.log(e.value);
            if (e.value == '1') {
                //se ordena por nombre a-z
                ordenarAsc(r, 'nombre');
                modificaResultado(r);
            }
            if (e.value == '2') {
                //se ordena por nombre a-z 
                ordenarDesc(r, 'nombre');
                modificaResultado(r);
            }
            if (e.value == '3') {
                ordenarDesc(r, 'ano_publicacion');
                modificaResultado(r);
            }
            if (e.value == '4') {

                ordenarAsc(r, 'ano_publicacion');
                modificaResultado(r);
            }
        }
        setAux(!aux);
    }

    const filtroTipo = e => {
        if (e != null) {
            //console.log(e.label);
            var datos = r;
            var filtrado = datos.filter(function (v) { return v['tipo'] == e.label });
            //console.log(filtrado);
            modificaResultado(filtrado);
        }
    }

    const filtroTema = e => {
        if (e != null) {
            //console.log(e.label);
            var datos = r;
            var filtrado = [];// datos.filter(function (v) { return (v['tema1'] == e.label || v['tema2'] == e.label) });
            datos.forEach(element => {
                if (element['tema2'] == e.label || element['tema1'] == e.label) {
                    filtrado.push(element);
                }
            });
            //console.log(filtrado);
            modificaResultado(filtrado);
        }
    }

    function metadatosModal() {
        const cuerpo =
            <div>
                <p>Ingresa parametros de busqueda</p>
            </div>
            ;

        setDatosModal(
            {
                title: 'Datos Incorrectos',
                body: cuerpo,
                nombreBoton: 'Cerrar'
            }
        )
        setShow(true)
    }

    const busqueda = e => {
        if (e != null) {
            //console.log(e.value);
            let busq = document.getElementById('inputF');
            //console.log(busq.value);
            if (busq.value === "") {
                metadatosModal()
            } else {
                if (e.value == 2) {
                    //busqueda por titulo
                    fetch(`${process.env.ruta}/wa/publico/consultaDocumento?search=nombre:*${busq.value}*`)
                        .then((response) => response.json())
                        .then((json) => modificaResultado(json));
                }
                if (e.value == 3) {
                    //busqueda por autor
                    fetch(`${process.env.ruta}/wa/publico/consultaDocumento?search=autor:*${busq.value}* OR autor2:*${busq.value}* OR autor3:*${busq.value}*`)
                        .then((response) => response.json())
                        .then((json) => modificaResultado(json));
                }
                if (e.value == 4) {
                    //busqueda por tema
                    fetch(`${process.env.ruta}/wa/publico/consultaDocumento?search=tema1:*${busq.value}* OR tema2:*${busq.value}*`)
                        .then((response) => response.json())
                        .then((json) => modificaResultado(json));
                }
                if (e.value == 5) {
                    //busqueda por tipo
                    fetch(`${process.env.ruta}/wa/publico/consultaDocumento?search=tipo:*${busq.value}*`)
                        .then((response) => response.json())
                        .then((json) => modificaResultado(json));
                }
            }
        }
    }

    const ultimasP = e => {
        //console.log("Ultimas publicaciones");
        fetch(`${process.env.ruta}/wa/publico/ultimos30publicados`)
            .then((response) => response.json())
            .then((json) => modificaResultado(json));
    }
    const masConsultadas = e => {
        console.log("Mas Consultadas");

        fetch(`${process.env.ruta}/wa/publico/documentosMasConsultados`)
            .then((response) => response.json())
            .then((json) => modificaResultado(json));

    }

    useEffect(() => {
        fetch(`${process.env.ruta}/wa/publico/ultimos30publicados`)
            .then((response) => response.json())
            .then((json) => modificaResultado(json));
    }, []);



    const onSubmit = async (data) => {
        //console.log(`${process.env.ruta}/wa/publico/consultaDocumento?search=tema1:*'${data.tema}*' OR tipo:*${data.tipo}* OR nombre:*${data.dato}* OR autor:*${data.autor}* OR nivelCobertura:${data.cobertura} OR descripcion:*'${data.descripcion}'* `);
        const res2 = await fetch(`${process.env.ruta}/wa/publico/consultaDocumento?search=tema1:*${data.tema}* OR tipo:*${data.tipo}* OR nombre:*${data.dato}* OR autor:*${data.autor}* OR nivelCobertura:${data.cobertura} OR descripcion:*'${data.descripcion}'*`);
        const datos = await res2.json();
        setPub(`Se Encontraron ${datos.length} Docuemntos`)
        modificaResultado(datos);
        setDatos(datos);
        setTitulo(data.dato);
        setDesc(data.descripcion);
        setAutor(data.autor);
        setCobertura(data.cobertura);
        setUnidad(data.unidad);
        setEdicion(data.edicion);
        setTipo(data.tipo);
        setTema(data.tema);
        //modificaURL(`http://172.16.117.11/wa/publico/consultaDocumental?search=nombre:*${data.dato}* OR autor:*${data.autor}* OR nivelCobertura:${data.cobertura} OR descripcion:*${data.descripcion}* OR tipo:*${data.tipo}*`);
    }//fin del metodo onSubmit


    return (
        <>
            <ModalComponent
                show={show}
                datos={datosModal}
                onHide={handleClose}
                onClick={handleClose}
            />
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
                                            <Form.Control name="dato" type="text" ref={register()} value={titulo} />
                                        </Form.Group>
                                        <Form.Group controlId="descripcion">
                                            <Form.Label>Descripción</Form.Label>
                                            <Form.Control name="descripcion" type="text" ref={register()} value={desc} />
                                        </Form.Group>
                                        <Form.Group controlId="autor">
                                            <Form.Label>Autor</Form.Label>
                                            <Form.Control name="autor" type="text" ref={register()} value={autor} />
                                        </Form.Group>
                                        <Form.Group controlId="cobertura">
                                            <Form.Label>Cobertura Geográfica</Form.Label>
                                            <Form.Control name="cobertura" type="text" ref={register()} value={cobertura} />
                                        </Form.Group>
                                        <Form.Group controlId="unidad">
                                            <Form.Label>Unidad Responsable</Form.Label>
                                            <Form.Control name="unidad" type="text" ref={register()} value={unidad} />
                                        </Form.Group>
                                        <Form.Group controlId="año">
                                            <Form.Label>Año de Publicación</Form.Label>
                                            <Form.Control name="año" type="text" ref={register()} value={edicion} />
                                        </Form.Group>
                                        <Form.Group controlId="tipo">
                                            <Form.Label>Tipo</Form.Label>
                                            <Form.Control name="tipo" type="text" ref={register()} value={tipo} />
                                        </Form.Group>
                                        <Form.Group controlId="tema">
                                            <Form.Label>Tema</Form.Label>
                                            <Form.Control name="tema" type="text" ref={register()} value={tema} />
                                        </Form.Group>
                                        <div className="text-center"><h6 name="encontrados">{pub}</h6></div>
                                        <div className="row">
                                            <div className="col-6">
                                                <Button variant="outline-secondary" className="btn-admin" type="submit" >BUSCAR</Button>
                                            </div>
                                            <div className="col-6">
                                                <Button variant="outline-danger" className="btn-admin" onClick={cerrarM}>Cerrar</Button>
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
            <div className="col-12 col-sm-12">
                <div className="tit-cd row">
                    <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                        <h5><b>CONSULTA DOCUMENTAL SITU</b></h5>
                    </div>
                    <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                        <div className="row sinpadding">
                            <div className="col-5 col-sm-5 col-md-5 col-lg-5">
                                <Form.Group controlId="inputF" className="busq1" >
                                    <Form.Control type="text" />
                                </Form.Group>
                            </div>
                            <div className="col-5 col-sm-5 col-md-5 col-lg-5">
                                <Select controlId="filtros"
                                    placeholder="Buscar por"
                                    className="basic-single"
                                    classNamePrefix="Select"
                                    name="filtros"
                                    options={filtros}
                                    isClearable={true}
                                    onChange={busqueda}
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
                    <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                        <Button className="btn-light bot-cd" onClick={ultimasP}>ÚLTIMAS PUBLICACIONES</Button>
                    </div>
                    <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                        <Button className="btn-light bot-cd" onClick={masConsultadas}>MÁS CONSULTADAS</Button>
                    </div>
                </div>
                <div className="row filtros-cd ">
                    <div className="col-12 col-md-3 col-lg-3">
                        <p><b className="number-cd">{r.length}</b> Resultados en el Sistema</p>
                    </div>
                    <div className="col-12 col-md-3 col-lg-3">
                        <Select
                            controlId="orden"
                            placeholder="Ordenar por"
                            className="basic-single"
                            classNamePrefix="Select"
                            name="orden"
                            options={orden}
                            isClearable={true}
                            onChange={ordenDatos}
                        ></Select>
                    </div>
                    <div className="col-12 col-md-3 col-lg-3">
                        <Select
                            controlId="tipo"
                            placeholder="Filtro por Tipo"
                            className="basic-single"
                            classNamePrefix="Select"
                            name="tipo"
                            options={tipoF}
                            isClearable={true}
                            onChange={filtroTipo}
                        ></Select>
                    </div>
                    <div className="col-12 col-md-3 col-lg-3">
                        <Select
                            controlId="tema"
                            placeholder="Filtro por Tema"
                            className="basic-single"
                            classNamePrefix="Select"
                            name="tema"
                            options={temaF}
                            isClearable={true}
                            onChange={filtroTema}
                        ></Select>
                    </div>
                </div>
                <br></br>
                {
                    r != null && (
                        r.length > 0 &&
                        (
                            <PaginationComponent
                                informacion={r}
                            />
                        )
                    )

                }
            </div>

        </>
    )

}

export default ContenedorCD;