import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { Form, Modal, Button } from 'react-bootstrap'
import ModalComponent from './ModalComponent'
import PaginationComponent from './PaginationComponent'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Draggable from 'react-draggable';
import ModalDialog from 'react-bootstrap/ModalDialog';
import Select from 'react-select';
import { Typeahead } from 'react-bootstrap-typeahead';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'universal-cookie'
import Loader from '../components/Loader'
const cookies = new Cookies()



function ContenedorCD() {
    const usuarioCookie = cookies.get('Usuario')
    const usuarioI = cookies.get('IDU')

    const [pub, setPub] = useState('');
    const [r, modificaResultado] = useState([]);
    const [datos, setDatos] = useState([]);
    const [aux, setAux] = useState(false);
    //para busqueda avanzada
    let [titulo, setTitulo] = useState();
    const [desc, setDesc] = useState();
    const [autor, setAutor] = useState();
    const [cobertura, setCobertura] = useState();
    const [unidad, setUnidad] = useState();
    const [edicion, setEdicion] = useState();
    const [tipo, setTipo] = useState();
    const [temaP, setTemaP] = useState();
    const [temaS, setTemaS] = useState();
    const [cober, setCober] = useState();
    const [tipoD, setTipoD] = useState();
    const [tem1, setTem1] = useState();
    const [tem2, setTem2] = useState();
    const [busquedaPR, setBusquedaPR] = useState(null);
    const [busqAnt, setBusqAnt] = useState([]);
    const [busq1, setBusq1] = useState([]);
    const [busq2, setBusq2] = useState([]);
    const [busq3, setBusq3] = useState([]);
    const [isLoading, setIsLoading] = useState(true);



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
    const busqueda1 = [
        { value: '1', label: 'Acervo' },
        { value: '2', label: 'Últimas publicaciones' },
        { value: '3', label: 'Más consultados' },
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
    const tema1 = [
        { value: '1', label: 'Ambiental' },
        { value: '2', label: 'Demográfico' },
        { value: '3', label: 'Energía' },
        { value: '4', label: 'Gestión' },
        { value: '5', label: 'Internacional' },
        { value: '6', label: 'Riesgos, peligros y vulnerabilidad' },
        { value: '7', label: 'Salud' },
        { value: '8', label: 'Socioeconómico' },
        { value: '9', label: 'Tecnológico' },
        { value: '10', label: 'Territorial' },
        { value: '11', label: 'Movilidad' },
    ];
    const tema2 = [
        { value: '1', label: 'Planeación' },
        { value: '2', label: 'Ordenamiento Territorial y Urbano' },
        { value: '3', label: 'Ordenamiento Ecológico' },
        { value: '4', label: 'Vivienda' },
        { value: '5', label: 'Desarrollo Agrario' },
        { value: '6', label: 'Desarrollo Rural' },
        { value: '7', label: 'Riesgos' },
        { value: '8', label: 'Catastro' },
        { value: '9', label: 'Gobernanza' }
    ];
    const coberturaG = [
        { value: '1', label: 'Nacional', name: 'cobertura' },
        { value: '2', label: 'Regional', name: 'cobertura' },
        { value: '3', label: 'Metropolitano', name: 'cobertura' },
        { value: '4', label: 'Estatal', name: 'cobertura' },
        { value: '5', label: 'Municipal', name: 'cobertura' },
        { value: '6', label: 'Subregional', name: 'cobertura' },
        { value: '7', label: 'Localidad', name: 'cobertura' },
        { value: '8', label: 'General', name: 'cobertura' }
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
        setTitulo();
        setDesc();
        setAutor();
        setCobertura();
        setEdicion();
        setTipo();
        setTem2();
        setTem1();
        setCober();
        setTipoD();
        setTemaP();
        setTemaS();
        setUnidad();
    }

    const cerrarM = e => {
        setShowModalB(!showModalB);
        setTitulo();
        setDesc();
        setAutor();
        setCobertura();
        setEdicion();
        setTipo();
        setTem2();
        setTem1();
        setCober();
        setTipoD();
        setTemaP();
        setTemaS();
        setUnidad();
        setPub('');
    }

    function sortJSON(data, key, orden) {
        return data.sort(function (a, b) {
            var x = a[key],
                y = b[key];

            if (orden === 'asc') {
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            }

            if (orden === 'desc') {
                return ((x > y) ? -1 : ((x < y) ? 1 : 0));
            }
        });
    }

    const ordenDatos = e => {
        //console.log(getBrowserInfo());
        if (e != null) {
            setIsLoading(true);
            if (e.value == '1') {
                //se ordena por nombre a-z
                sortJSON(r, 'nombre', 'asc');
                modificaResultado(r);
                setIsLoading(false);
            }
            if (e.value == '2') {
                sortJSON(r, 'nombre', 'desc');
                modificaResultado(r);
                setIsLoading(false);
            }
            if (e.value == '3') {
                sortJSON(r, 'ano_publicacion', 'desc');
                modificaResultado(r);
                setIsLoading(false);
            }
            if (e.value == '4') {
                sortJSON(r, 'ano_publicacion', 'asc');
                modificaResultado(r);
                setIsLoading(false);
            }
            if (e.value == '5') {
                sortJSON(r, 'instancia', 'asc');
                modificaResultado(r);
                setIsLoading(false);
            }
            if (e.value == '6') {
                sortJSON(r, 'instancia', 'desc');
                modificaResultado(r);
                setIsLoading(false);
            }
        }
        setAux(!aux);
    }

    const filtroTipo = e => {
        if (e != null) {
            setIsLoading(true);
            setBusq1(r);
            var datos = r;
            var filtrado = datos.filter(function (v) { return v['tipo'] == e.label });
            modificaResultado(filtrado);
            setIsLoading(false);
        } else {
            modificaResultado(busq1);
        }
    }

    const filtroTema1 = e => {
        if (e != null) {
            setBusq2(r);
            var datos = r;
            var filtrado = [];
            datos.forEach(element => {
                if (element['tema1'] == e.label) {
                    filtrado.push(element);
                }
            });
            modificaResultado(filtrado);
        } else {
            modificaResultado(busq2);
        }
    }

    const filtroTema2 = e => {
        //console.log(r)
        if (e != null) {
            setBusq3(r);
            var datos = r;
            var filtrado = [];
            datos.forEach(element => {
                if (element['tema2'] == e.label) {
                    filtrado.push(element);
                }
            });
            modificaResultado(filtrado);
        } else {
            modificaResultado(busq3);
        }
    }

    const busquedaP = e => {
        //console.log(getBrowserInfo());
        if (e != null) {
            setIsLoading(true);
            if (e.value == 1) {
                setBusquedaPR(e.value);
                setIsLoading(false);
            }
            if (e.value == 2) {
                //ultimas publicaciones 
                fetch(`${process.env.ruta}/wa/publico/ultimos30publicados`)
                    .then((response) => response.json())
                    .then((json) => { modificaResultado(json); setIsLoading(false); });
                setBusq1(r);

                setBusquedaPR();
            }
            if (e.value == 3) {
                //mas consultados
                fetch(`${process.env.ruta}/wa/publico/documentosMasConsultados`)
                    .then((response) => response.json())
                    .then((json) => { modificaResultado(json); setIsLoading(false); });
                setBusq1(r);
                setBusquedaPR();
            }
        } else {
            setBusquedaPR();
        }
    }

    var getBrowserInfo = function () {
        var ua = navigator.userAgent, tem,
            M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE ' + (tem[1] || '');
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
            if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
        return M.join(' ');
    };

    useEffect(() => {
        setIsLoading(true);
        fetch(`${process.env.ruta}/wa/publico/ultimos30publicados`)
            .then((response) => response.json())
            .then((json) => { modificaResultado(json); setIsLoading(false); });
        setBusq1(r);
    }, []);



    const onSubmit = async (data) => {
        console.log(data);
        //console.log(`${process.env.ruta}/wa/publico/consultaDocumento?search=tema1:*${data.tema}* OR tipo:*${data.tipo}* OR nombre:*${data.dato}* OR autor:*${data.autor}* OR nivelCobertura:*${data.cobertura}* OR descripcion:*${data.descripcion}* OR anoPublicacion:*${data.anio}* OR tema2:*${data.tema}* OR instancia:*${data.unidad}*`);
        const res2 = await fetch(`${process.env.ruta}/wa/publico/consultaDocumento?search=tema1:*${data.tem1}* OR tipo:*${data.tipo}* OR nombre:*${data.dato}* OR autor:*${data.autor}* OR nivelCobertura:*${data.cobertura}* OR descripcion:*${data.descripcion}* OR anoPublicacion:*${data.anio}* OR tema2:*${data.tem2}* OR instancia:*${data.unidad}*`);
        const datos = await res2.json();
        modificaResultado(datos);
        setBusq1(datos);
        setDatos(datos);
        setTitulo(data.dato);
        setDesc(data.descripcion);
        setAutor(data.autor);
        setCobertura(data.cobertura);
        setUnidad(data.unidad);
        setEdicion(data.anio);
        setTipo(data.tipo);
        setTem1(data.tem1);
        setTem1(data.tem2);
        setPub(datos.length + " Resultados en sistema")
    };//fin del metodo onSubmit

    function cambioD(e) {
        if (e.target.name === 'dato') {
            console.log(e.target.value);
            setTitulo();
        }
        if (e.target.name === 'descripcion') {
            setDesc();
        }
        if (e.target.name === 'autor') {
            setAutor();
        }
        if (e.target.name === 'cobertura') {
            setCobertura();
        }
        if (e.target.name === 'unidad') {
            setUnidad();
        }
        if (e.target.name === 'anio') {
            setEdicion();
        }
        if (e.target.name === 'tipo') {
            setTipo();
        }
        if (e.target.name === 'temaP') {
            setTemaP();
        }
        if (e.target.name === 'temaS') {
            setTemaS();
        }
    }

    function cambioC(e) {
        if (e[0] != undefined) {
            if (e[0].name == 'cobertura') {
                setCobertura(e[0].label);
                setCober(e);
            }
        } else {
            setCober();
            setCobertura();
        }
        setTitulo(document.getElementById("dato").value);
        setDesc(document.getElementById("dato1").value);
        setAutor(document.getElementById("dato2").value);
        setUnidad(document.getElementById("dato3").value);
        setEdicion(document.getElementById("dato4").value);

    }

    function cambioT(e) {
        if (e[0] != undefined) {
            setTipo(e[0].label);
            setTipoD(e);
        } else {
            setTipo();
            setTipoD();
        }
        setTitulo(document.getElementById("dato").value);
        setDesc(document.getElementById("dato1").value);
        setAutor(document.getElementById("dato2").value);
        setUnidad(document.getElementById("dato3").value);
        setEdicion(document.getElementById("dato4").value);
    }
    function cambioTema1(e) {
        if (e[0] != undefined) {
            setTemaP(e[0].label);
            setTem1(e);
        } else {
            setTemaP();
            setTem1();
        }
        setTitulo(document.getElementById("dato").value);
        setDesc(document.getElementById("dato1").value);
        setAutor(document.getElementById("dato2").value);
        setUnidad(document.getElementById("dato3").value);
        setEdicion(document.getElementById("dato4").value);
    }

    function cambioTema2(e) {
        if (e[0] != undefined) {
            setTemaS(e[0].label);
            setTem2(e);
        } else {
            setTemaS();
            setTem2();
        }
        setTitulo(document.getElementById("dato").value);
        setDesc(document.getElementById("dato1").value);
        setAutor(document.getElementById("dato2").value);
        setUnidad(document.getElementById("dato3").value);
        setEdicion(document.getElementById("dato4").value);
    }

    return (
        <>
            {
                isLoading ?
                    <Loader /> :
                    ''
            }
            <ModalComponent
                show={show}
                datos={datosModal}
                onHide={handleClose}
                onClick={handleClose}
            />

            <Modal show={showModalB} onHide={() => setShowModalB(!showModalB)} dialogAs={DraggableModalDialog}
                keyboard={false} className="modal-analisis" contentClassName="modal-redimensionable">
                <Modal.Header closeButton >
                    <Modal.Title><b>Busqueda</b></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="main">
                        <div className="container">
                            <div className="row">
                                <div className=" col-12 text-center"><h6 name="encontrados">{pub}</h6></div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <Form className="col-12" onSubmit={handleSubmit(onSubmit)}>
                                        <Form.Group controlId="dato">
                                            <Form.Label>Titulo</Form.Label>
                                            <Form.Control name="dato" type="text" ref={register()} value={titulo} onChange={(e) => cambioD(e)} id="dato" />
                                        </Form.Group>
                                        <Form.Group controlId="descripcion">
                                            <Form.Label>Or Descripción</Form.Label>
                                            <Form.Control name="descripcion" type="text" ref={register()} value={desc} onChange={(e) => cambioD(e)} id="dato1" />
                                        </Form.Group>
                                        <Form.Group controlId="autor">
                                            <Form.Label>Or Autor</Form.Label>
                                            <Form.Control name="autor" type="text" ref={register()} value={autor} onChange={(e) => cambioD(e)} id="dato2" />
                                        </Form.Group>
                                        <Form.Group controlId="cobertura">
                                            <Form.Label>Or Cobertura Geográfica</Form.Label>
                                            <Form.Control name="cobertura" type="hidden" ref={register()} value={cobertura} />
                                            <Typeahead
                                                id="coberturaG"
                                                name="coberturaG"
                                                labelKey={"label"}
                                                options={coberturaG}
                                                onChange={(e) => cambioC(e)}
                                                placeholder="Selecciona una opcion"
                                                clearButton
                                                selected={cober}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="unidad">
                                            <Form.Label>Or Unidad Responsable</Form.Label>
                                            <Form.Control name="unidad" type="text" ref={register()} value={unidad} onChange={(e) => cambioD(e)} id="dato3" />
                                        </Form.Group>
                                        <Form.Group controlId="anio">
                                            <Form.Label>Or Año de Publicación</Form.Label>
                                            <Form.Control placeholder="Ej. 2001" name="anio" type="text" ref={register()} value={edicion} onChange={(e) => cambioD(e)} pattern="[0-9]{4}" title="El año debe ser en formato AAAA" id="dato4" />
                                        </Form.Group>
                                        <Form.Group controlId="tipo">
                                            <Form.Label>Or Tipo</Form.Label>
                                            <Form.Control name="tipo" type="hidden" ref={register()} value={tipo} />
                                            <Typeahead
                                                id="tipoD"
                                                name="tipoD"
                                                labelKey={"label"}
                                                options={tipoF}
                                                onChange={(e) => cambioT(e)}
                                                placeholder="Selecciona una opcion"
                                                clearButton
                                                selected={tipoD}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="tema1">
                                            <Form.Label>Or Tema Principal</Form.Label>
                                            <Form.Control name="tema1" type="hidden" ref={register()} value={temaP} />
                                            <Typeahead
                                                id="temaP"
                                                name="temaP"
                                                labelKey={"label"}
                                                options={tema1}
                                                onChange={(e) => cambioTema1(e)}
                                                selected={tem1}
                                                placeholder="Selecciona una opcion"
                                                clearButton
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="tema2">
                                            <Form.Label>Or Tema Secundario</Form.Label>
                                            <Form.Control name="tema2" type="hidden" ref={register()} value={temaS} />
                                            <Typeahead
                                                id="temaS"
                                                name="temaS"
                                                labelKey={"label"}
                                                options={tema2}
                                                onChange={(e) => cambioTema2(e)}
                                                selected={tem2}
                                                placeholder="Selecciona una opcion"
                                                clearButton
                                            />
                                        </Form.Group>

                                        <div className="row">
                                            <div className="col-11 col-md-6 col-lg-6">
                                                <Button variant="outline-secondary" className="btn-admin" type="submit" >BUSCAR</Button>
                                            </div>

                                            <div className="col-11 col-md-6 col-lg-6">
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
            {
                busquedaPR != null && (
                    <div className="row">
                        <div className="col-8 col-sm-8"></div>
                        <div className="col-1 col-sm-1 align-self-end">
                            <button className="busq" onClick={verModal}>
                                <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                            </button>
                        </div>
                    </div>
                )
            }

            <div className="row">
                <div className="col-9 col-sm-9">
                    {
                        r != null && (
                            r.length > 0 ? (
                                <PaginationComponent
                                    informacion={r}
                                />
                            ) : (
                                <div className="row">
                                    <div className="col-4">
                                        <p><b className="number-cd">{r.length}</b> Resultados en el sistema</p>
                                    </div>
                                </div>
                            ))
                    }
                </div>
                <div className="col-3 col-sm-3">
                    <div className="row">
                        <div className="col-12 col-md-12 col-lg-12">
                            <Select
                                controlId="orden"
                                placeholder="Busqueda"
                                className="basic-single"
                                classNamePrefix="Select"
                                name="orden"
                                options={busqueda1}
                                isClearable={true}
                                onChange={busquedaP}
                                defaultValue={busqueda1[1]}
                            ></Select>
                        </div>
                    </div>
                    <br></br>
                    <div className="row">
                        <div className="col-12 col-md-12 col-lg-12">
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
                    </div>
                    <br></br>
                    <div className="row justify-content-center">
                        <div className="col-11 caja">
                            <p>Filtros</p>
                            <div className="row">
                                <div className="col-12 col-md-12 col-lg-12">
                                    <Select
                                        controlId="tipo"
                                        placeholder="Tipo de documento"
                                        className="basic-single"
                                        classNamePrefix="Select"
                                        name="tipo"
                                        options={tipoF}
                                        isClearable={true}
                                        onChange={filtroTipo}
                                    ></Select>
                                </div>
                            </div>
                            <br></br>
                            <div className="row">
                                <div className="col-12 col-md-12 col-lg-12">
                                    <Select
                                        controlId="tema"
                                        placeholder="Tema principal"
                                        className="basic-single"
                                        classNamePrefix="Select"
                                        name="tema"
                                        options={tema1}
                                        isClearable={true}
                                        onChange={filtroTema1}
                                    ></Select>
                                </div>
                            </div>
                            <br></br>
                            <div className="row">
                                <div className="col-12 col-md-12 col-lg-12">
                                    <Select
                                        controlId="tema"
                                        placeholder="Tema secundario"
                                        className="basic-single"
                                        classNamePrefix="Select"
                                        name="tema"
                                        options={tema2}
                                        isClearable={true}
                                        onChange={filtroTema2}
                                    ></Select>
                                </div>
                            </div>
                            <br></br>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-9 col-sm-9">
                </div>
            </div>

        </>
    )

}

export default ContenedorCD;