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
import { useRouter } from 'next/router'
import { faWindowRestore } from '@fortawesome/free-regular-svg-icons';
//import tipoF from '../shared/jsons/tipo.json'
//import tema1 from '../shared/jsons/temaPrinicpal.json'
//import tema2 from '../shared/jsons/temaSecundario.json'
//import coberturaG from '../shared/jsons/cobertura.json'
import formatoD from '../shared/jsons/formato.json'
import $ from 'jquery';



function ContenedorCD() {
    //const usuarioCookie = cookies.get('Usuario')
    //const usuarioI = cookies.get('IDU')

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
    const [formato, setFormato] = useState();
    const [formatoS, setFormatoS] = useState();
    const [busquedaPR, setBusquedaPR] = useState(null);
    const [busqAnt, setBusqAnt] = useState([]);
    const [busq1, setBusq1] = useState([]);
    const [busq2, setBusq2] = useState([]);
    const [busq3, setBusq3] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [consulta, setConsulta] = useState();
    const [palabras, setPalabras] = useState();
    const [libre, setLibre] = useState();
    const [total, setTotal] = useState();
    const [tipoF, setTipoF] = useState();
    const [tema1, setTema1] = useState();
    const [tema2, setTema2] = useState();
    const [coberturaG, setCoberturaG] = useState();
    const [operador1, setOperador1] = useState([]);
    const [operador2, setOperador2] = useState([]);
    const [operador3, setOperador3] = useState([]);
    const [operador4, setOperador4] = useState([]);
    const [operador5, setOperador5] = useState([]);
    const [operador6, setOperador6] = useState([]);
    const [operador7, setOperador7] = useState([]);
    const [operador8, setOperador8] = useState([]);
    const [operador9, setOperador9] = useState([]);
    const [operador10, setOperador10] = useState([]);
    const [operador11, setOperador11] = useState([]);
    const [operador12, setOperador12] = useState([]);


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
    const operador = [
        { value: '1', label: 'AND' },
        { value: '2', label: 'OR' },
    ];
    const orden = [
        { value: '1', label: 'Nombre/Titulo A-Z' },
        { value: '2', label: 'Nombre/Titulo Z-A' },
        { value: '3', label: 'Año de Publicación Mayor a Menor' },
        { value: '4', label: 'Año de Publicación Menor a Mayor' },
        { value: '5', label: 'Fuente A-Z' },
        { value: '6', label: 'Fuente Z-A' }
    ];
    const [busq, setBusq] = useState(busqueda1[1]);
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
        setFormato();
        setFormatoS();
        setLibre();
        setPalabras();
        setOperador1([]);
        setOperador2([]);
        setOperador3([]);
        setOperador4([]);
        setOperador5([]);
        setOperador6([]);
        setOperador7([]);
        setOperador8([]);
        setOperador9([]);
        setOperador10([]);
        setOperador11([]);
        setOperador12([]);
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
        setFormato();
        setFormatoS();
        setLibre();
        setPalabras();
        setOperador1([]);
        setOperador2([]);
        setOperador3([]);
        setOperador4([]);
        setOperador5([]);
        setOperador6([]);
        setOperador7([]);
        setOperador8([]);
        setOperador9([]);
        setOperador10([]);
        setOperador11([]);
        setOperador12([]);
    
    
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
    function ordenFechaDes(dat) {
        let aux = [];
        let aux1 = [];
        for (let index = 0; index < dat.length; index++) {
            aux.push(index)
            //aux1.push(Math.floor((Math.random() * (101-1))+1));
            //let number = parseInt(dat[index].ano_publicacion  +dat[index].mes_publicacion+ dat[index].dia_publicacion,10)
        }
        const l = dat.length;
        for (let i = 0; i < (l - 1); i++) {
            for (let j = 0; j < (l - i - 1); j++) {
                let aux2, aux22;
                //let number = parseInt(dat[j].ano_publicacion + dat[j].mes_publicacion + dat[j].dia_publicacion, 10);
                //let number1 = parseInt(dat[j+1].ano_publicacion + dat[j+1].mes_publicacion + dat[j+1].dia_publicacion, 10);
                let cadena1 = dat[j].ano_publicacion + "-" + dat[j].mes_publicacion + "-" + dat[j].dia_publicacion;
                let cadena2 = dat[j + 1].ano_publicacion + "-" + dat[j + 1].mes_publicacion + "-" + dat[j + 1].dia_publicacion;
                let fecha1 = new Date(cadena1);
                let fecha2 = new Date(cadena2);

                if (fecha1 < fecha2) {
                    aux2 = aux[j];
                    aux[j] = aux[j + 1];
                    aux[j + 1] = aux2;
                }

            }
        }
        for (let i = 0; i < l; i++) {
            aux1.push(dat[aux[i]]);
            let date = dat[aux[i]].ano_publicacion + "-" + dat[aux[i]].mes_publicacion + "-" + dat[aux[i]].dia_publicacion;
            //console.log(date);
        }
        //console.log(aux1);
        return aux1;
    }
    function ordenFechaAsc(dat) {
        let aux = [];
        let aux1 = [];
        for (let index = 0; index < dat.length; index++) {
            aux.push(index)
            //aux1.push(Math.floor((Math.random() * (101-1))+1));
            //let number = parseInt(dat[index].ano_publicacion  +dat[index].mes_publicacion+ dat[index].dia_publicacion,10)
        }
        const l = dat.length;
        for (let i = 0; i < (l - 1); i++) {
            for (let j = 0; j < (l - i - 1); j++) {
                let aux2, aux22;
                //let number = parseInt(dat[j].ano_publicacion + dat[j].mes_publicacion + dat[j].dia_publicacion, 10);
                //let number1 = parseInt(dat[j+1].ano_publicacion + dat[j+1].mes_publicacion + dat[j+1].dia_publicacion, 10);
                let cadena1 = dat[j].ano_publicacion + "-" + dat[j].mes_publicacion + "-" + dat[j].dia_publicacion;
                let cadena2 = dat[j + 1].ano_publicacion + "-" + dat[j + 1].mes_publicacion + "-" + dat[j + 1].dia_publicacion;
                let fecha1 = new Date(cadena1);
                let fecha2 = new Date(cadena2);

                if (fecha1 > fecha2) {
                    aux2 = aux[j];
                    aux[j] = aux[j + 1];
                    aux[j + 1] = aux2;
                }
            }
        }
        for (let i = 0; i < l; i++) {
            aux1.push(dat[aux[i]]);
            let date = dat[aux[i]].ano_publicacion + "-" + dat[aux[i]].mes_publicacion + "-" + dat[aux[i]].dia_publicacion;
            //console.log(date);
        }
        //console.log(aux1);
        return aux1;
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
                let aux = ordenFechaDes(r);
                modificaResultado(aux);
                setIsLoading(false);
            }
            if (e.value == '4') {
                sortJSON(r, 'ano_publicacion', 'asc');
                let aux = ordenFechaAsc(r);
                modificaResultado(aux);
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

    useEffect(() => {
        fetch(`${process.env.ruta}/wa/publico/consultaDocumentalCatTipo`)
            .then((response) => response.json())
            .then(
                (data) => {
                    construyeCatalogoTipo(data);
                },
                (error) => console.log(error)
            )

        fetch(`${process.env.ruta}/wa/publico/consultaDocumentalCatTema1`)
            .then((response) => response.json())
            .then(
                (data) => {
                    construyeCatalogoTema1(data);
                },
                (error) => console.log(error)
            )
        fetch(`${process.env.ruta}/wa/publico/consultaDocumentalCatTema2`)
            .then((response) => response.json())
            .then(
                (data) => {
                    construyeCatalogoTema2(data);
                },
                (error) => console.log(error)
            )
        fetch(`${process.env.ruta}/wa/publico/catNivelCobertura`)
            .then((response) => response.json())
            .then(
                (data) => {
                    construyeCatalogoCobertura(data);
                },
                (error) => console.log(error)
            )
    }, []);

    function construyeCatalogoTipo(data) {
        //console.log(data);
        let lista = [];
        let i = 0;
        data.map(value => {
            let j = {};
            j.value = i + 1;
            j.label = value.tipo
            j.name = "tipo";
            lista.push(j)
            //console.log(value.tipo);
        })
        setTipoF(lista);
    }
    function construyeCatalogoTema1(data) {
        let lista = [];
        let i = 0;
        data.map(value => {
            let j = {};
            j.value = i + 1;
            j.label = value.tema
            j.name = "tema1";
            lista.push(j)
            //console.log(value.tipo);
        })
        setTema1(lista);
    }
    function construyeCatalogoTema2(data) {
        let lista = [];
        let i = 0;
        data.map(value => {
            let j = {};
            j.value = i + 1;
            j.label = value.subtema
            j.name = "tema2";
            lista.push(j)
            //console.log(value.tipo);
        })
        setTema2(lista);
    }
    function construyeCatalogoCobertura(data) {
        let lista = [];
        let i = 0;
        data.map(value => {
            let j = {};
            j.value = i + 1;
            j.label = value.cobertura
            j.name = "cobertura";
            lista.push(j)
            //console.log(value.tipo);
        })

        setCoberturaG(lista);
    }

    const busquedaP = e => {
        //console.log(getBrowserInfo());
        let aux;
        if (e != null) {
            setIsLoading(true);
            if (e.value == 1) {
                setBusquedaPR(e.value);
                setConsulta("Acervo");
                fetch(`${process.env.ruta}/wa/publico/consultaDocumentalTodo`)
                    .then((response) => response.json())
                    .then((json) => { modificaResultado(json) });
                /*
                                fetch(`${process.env.ruta}/wa/publico/ultimos30publicados`)
                                    .then((response) => response.json())
                                    .then((json) => { modificaResultado(json); });
                */
                //console.log(total);
                setBusq1(r);
                setIsLoading(false);


            }
            if (e.value == 2) {
                //ultimas publicaciones 
                setConsulta("ÚLTIMOS DOCUMENTOS PUBLICADOS");
                fetch(`${process.env.ruta}/wa/publico/ultimos30publicados`)
                    .then((response) => response.json())
                    .then((json) => { modificaResultado(json); setIsLoading(false); setTotal(0); });
                setBusq1(r);
                setBusquedaPR();
            }
            if (e.value == 3) {
                //mas consultados
                setConsulta("DOCUMENTOS MÁS CONSULTADOS");
                fetch(`${process.env.ruta}/wa/publico/documentosMasConsultados`)
                    .then((response) => response.json())
                    .then((json) => { modificaResultado(json); setIsLoading(false); });
                setBusq1(r);

                setBusquedaPR();
            }
        } else {
            fetch(`${process.env.ruta}/wa/publico/ultimos30publicados`)
                .then((response) => response.json())
                .then((json) => { modificaResultado(json); setIsLoading(false); setTotal(0); });
            setBusq(busqueda1[1]);
            setBusq1(r);
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
        setConsulta("ÚLTIMOS DOCUMENTOS PUBLICADOS");
        fetch(`${process.env.ruta}/wa/publico/ultimos30publicados`)
            .then((response) => response.json())
            .then((json) => { modificaResultado(json); setIsLoading(false); setTotal(0); });
        setBusq1(r);
        setTotal(0);


    }, []);



    const onSubmit = async (data) => {
        setTotal(0);
        let str = data.dato;
        let str2 = "";
        str = str.replace(str[0], "*");
        //data.dato=str;
        if (data.dato != "") {
            str2 += "Titulo: " + data.dato + " ";
        }
        if (data.descripcion != "") {
            str2 += "Descripcion: " + data.descripcion + " ";
        }
        if (data.cobertura != "") {
            str2 += "Cobertura: " + data.cobertura + " ";
        }
        if (data.unidad != "") {
            str2 += "Unidad: " + data.unidad + " ";
        }
        if (data.anio != "") {
            str2 += "Edición: " + data.anio + " ";
        }
        if (data.tipo != "") {
            str2 += "Tipo: " + data.tipo + " ";
        }
        if (data.tema1 != "") {
            str2 += "Tema 1: " + data.tema1 + " ";
        }
        if (data.tema2 != "") {
            str2 += "Tema 2: " + data.tema2 + " ";
        }
        if (data.formato != "") {
            str2 += "Formato: " + data.formato + " ";
        }
        if (data.clave != "") {
            str2 += "Palabras Clave: " + data.clave + " ";
        }
        if (data.libre != "") {
            str2 += "Texto Libre: " + data.libre + " ";
        }
        let st = "ACERVO DOCUMENTAL POR," + str2;
        setConsulta(st);
        
        let urs;
        let urs1 = construirBusqueda(data);
        
        urs = `${process.env.ruta}/wa/publico/consultaDocumento?search=${urs1} `;//${op1} descripcion:'*${data.descripcion}*' ${op2} autor:'*${data.autor}*' ${op3} nivelCobertura:*${data.cobertura}* ${op4} instancia:'*${data.unidad}*' ${op5} anoPublicacion:*${data.anio}* ${op6}  tipo:'*${data.tipo}'* ${op7} tema1:'*${data.tema1}*' ${op8} tema2:'*${data.tema2}*' ${op9} ${strP} ${op10} formato:'*${data.formato}*'  `
        console.log(urs);
        
        const res2 = await fetch(urs);
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
        setFormato(data.formato);
        setPalabras(data.clave);
        setLibre(data.libre);
        setPub(datos.length + " Resultados en sistema");

        //setConsulta("ACERVO DOCUMENTAL POR "); //ACERVO DOCUMENTAL POR {}
    };//fin del metodo onSubmit

    function construirBusqueda(data){
        
        let op1;
        let op2;
        let op3;
        let op4;
        let op5;
        let op6;
        let op7;
        let op8;
        let op9;
        let op10;
        let op11;
        let op12;

        if (operador1.length > 0) {
            op1 = operador1[0].label;
        } else {
            op1 = "OR";
        }
        if (operador2.length > 0) {
            op2 = operador2[0].label;
        } else {
            op2 = "OR";
        }
        if (operador3.length > 0) {
            op3 = operador3[0].label;
        } else {
            op3 = "OR";
        }
        if (operador4.length > 0) {
            op4 = operador4[0].label;
        } else {
            op4 = "OR";
        }
        if (operador5.length > 0) {
            op5 = operador5[0].label;
        } else {
            op5 = "OR";
        }
        if (operador6.length > 0) {
            op6 = operador6[0].label;
        } else {
            op6 = "OR";
        }
        if (operador7.length > 0) {
            op7 = operador7[0].label;
        } else {
            op7 = "OR";
        }
        if (operador8.length > 0) {
            op8 = operador8[0].label;
        } else {
            op8 = "OR";
        }
        if (operador9.length > 0) {
            op9 = operador9[0].label;
        } else {
            op9 = "OR";
        }
        if (operador10.length > 0) {
            op10 = operador10[0].label;
        } else {
            op10 = "OR";
        }
        if (operador11.length > 0) {
            op11 = operador11[0].label;
        } else {
            op11 = "OR";
        }
        if (operador12.length > 0) {
            op12 = operador12[0].label;
        } else {
            op12 = " ";
        }

        let strP = "";
        if (data.clave != "") {
            let aux = data.clave.split(',');
            let opc = [];
            aux.forEach(element => {
                element = element.replace(element[0], "*");
                opc.push(element);
            });

            for (let i = 0; i < opc.length; i++) {
                if (i != opc.length - 1) {
                    strP += `palabrasclave:'${opc[i]}*' OR `
                } else {
                    strP += `palabrasclave:'${opc[i]}*'`
                }
            }

        }

        let str = data.dato;
        let str2 = "";
        str = str.replace(str[0], "*");
        //data.dato=str;
        if (data.dato != "") {
            str2 += `nombre:'${str}*' ${op1} `;
        }
        if (data.descripcion != "") {
            str2 += `descripcion:'*${data.descripcion}*' ${op2} `;
        }
        if (data.cobertura != "") {
            str2 += `nivelCobertura:*${data.cobertura}* ${op4} `
        }
        if (data.unidad != "") {
            str2 += `instancia:'*${data.unidad}*' ${op5} `;
        }
        if (data.anio != "") {
            str2 += `anoPublicacion:*${data.anio}* ${op6} `;
        }
        if (data.tipo != "") {
            str2 += `tipo:'*${data.tipo}*' ${op7} `;
        }
        if (data.tema1 != "") {
            str2 += `tema1:'*${data.tema1}*' ${op8} `;
        }
        if (data.tema2 != "") {
            str2 += `tema2:'*${data.tema2}*' ${op9} `;
        }
        if (data.formato != "") {
            str2 += `formato:'*${data.formato}*' `;
        }
        if (data.clave != "") {
            str2 += `${strP} ${op10}`
        }
        let texto;
        if (data.libre != "") {
            texto = data.libre;
            texto = texto.replace(texto[0], "*");
            str2 += `nombre:'${texto}*' OR descripcion:'${texto}*' OR autor:'${texto}*' OR nivelCobertura:'${texto}*' OR instancia:'${texto}*' OR anoPublicacion:'${texto}*' OR  tipo:'${texto}*' OR tema1:'${texto}*' OR tema2:'${texto}*' OR  formato:'${texto}*' OR  palabrasclave:'${texto}*'`;
        }
        //console.log(str2);
        return str2;
           
    }

    function cambioD(e) {
        if (e.target.name === 'dato') {
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
        if (e.target.name === 'clave') {
            setPalabras();
        }
        if (e.target.name === 'libre') {
            setLibre();
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
        setTitulo(document.getElementById('dato').value);
        setDesc(document.getElementById("descripcion").value);
        setAutor(document.getElementById("autor").value);
        setUnidad(document.getElementById("unidad").value);
        setEdicion(document.getElementById("anio").value);
        setPalabras(document.getElementById("clave").value);
        setLibre(document.getElementById("libre").value);

    }

    function cambioT(e) {
        if (e[0] != undefined) {
            setTipo(e[0].label);
            setTipoD(e);
        } else {
            setTipo();
            setTipoD();
        }
        setTitulo(document.getElementById('dato').value);
        setDesc(document.getElementById("descripcion").value);
        setAutor(document.getElementById("autor").value);
        setUnidad(document.getElementById("unidad").value);
        setEdicion(document.getElementById("anio").value);
        setPalabras(document.getElementById("clave").value);
        setLibre(document.getElementById("libre").value);
    }
    function cambioTema1(e) {
        if (e[0] != undefined) {
            setTemaP(e[0].label);
            setTemaP(e[0].label);
            setTem1(e);
        } else {
            setTemaP();
            setTem1();
        }
        setTitulo(document.getElementById('dato').value);
        setDesc(document.getElementById("descripcion").value);
        setAutor(document.getElementById("autor").value);
        setUnidad(document.getElementById("unidad").value);
        setEdicion(document.getElementById("anio").value);
        setPalabras(document.getElementById("clave").value);
        setLibre(document.getElementById("libre").value);
    }

    function cambioTema2(e) {
        if (e[0] != undefined) {
            setTemaS(e[0].label);
            setTemaS(e[0].label);
            setTem2(e);
        } else {
            setTemaS();
            setTem2();
        }
        setTitulo(document.getElementById('dato').value);
        setDesc(document.getElementById("descripcion").value);
        setAutor(document.getElementById("autor").value);
        setUnidad(document.getElementById("unidad").value);
        setEdicion(document.getElementById("anio").value);
        setPalabras(document.getElementById("clave").value);
        setLibre(document.getElementById("libre").value);
    }
    function cambioFormato(e) {
        //console.log(document.getElementById("clave").value);
        if (e[0] != undefined) {
            setFormato(e[0].label);
            setFormatoS(e);
        } else {
            setFormato();
            setFormatoS();
        }
        setTitulo(document.getElementById('dato').value);
        setDesc(document.getElementById("descripcion").value);
        setAutor(document.getElementById("autor").value);
        setUnidad(document.getElementById("unidad").value);
        setEdicion(document.getElementById("anio").value);
        setPalabras(document.getElementById("clave").value);
        setLibre(document.getElementById("libre").value);

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

    function guardarParametros(e, name) {
        if (name == "operador1") {
            setTitulo(document.getElementById('dato').value);
            setDesc(document.getElementById("descripcion").value);
            setAutor(document.getElementById("autor").value);
            setUnidad(document.getElementById("unidad").value);
            setEdicion(document.getElementById("anio").value);
            setPalabras(document.getElementById("clave").value);
            setLibre(document.getElementById("libre").value);
            setOperador1(e);
        }
        if (name == "operador2") {
            setTitulo(document.getElementById('dato').value);
            setDesc(document.getElementById("descripcion").value);
            setAutor(document.getElementById("autor").value);
            setUnidad(document.getElementById("unidad").value);
            setEdicion(document.getElementById("anio").value);
            setPalabras(document.getElementById("clave").value);
            setLibre(document.getElementById("libre").value);
            setOperador2(e);
        }
        if (name == "operador3") {
            setTitulo(document.getElementById('dato').value);
            setDesc(document.getElementById("descripcion").value);
            setAutor(document.getElementById("autor").value);
            setUnidad(document.getElementById("unidad").value);
            setEdicion(document.getElementById("anio").value);
            setPalabras(document.getElementById("clave").value);
            setLibre(document.getElementById("libre").value);
            setOperador3(e);
        }
        if (name == "operador5") {
            setTitulo(document.getElementById('dato').value);
            setDesc(document.getElementById("descripcion").value);
            setAutor(document.getElementById("autor").value);
            setUnidad(document.getElementById("unidad").value);
            setEdicion(document.getElementById("anio").value);
            setPalabras(document.getElementById("clave").value);
            setLibre(document.getElementById("libre").value);
            setOperador5(e);
        }
        if (name == "operador6") {
            setTitulo(document.getElementById('dato').value);
            setDesc(document.getElementById("descripcion").value);
            setAutor(document.getElementById("autor").value);
            setUnidad(document.getElementById("unidad").value);
            setEdicion(document.getElementById("anio").value);
            setPalabras(document.getElementById("clave").value);
            setLibre(document.getElementById("libre").value);
            setOperador6(e);
        }
        if (name == "operador10") {
            setTitulo(document.getElementById('dato').value);
            setDesc(document.getElementById("descripcion").value);
            setAutor(document.getElementById("autor").value);
            setUnidad(document.getElementById("unidad").value);
            setEdicion(document.getElementById("anio").value);
            setPalabras(document.getElementById("clave").value);
            setLibre(document.getElementById("libre").value);
            setOperador10(e);
        }
        if (name == "operador11") {
            setTitulo(document.getElementById('dato').value);
            setDesc(document.getElementById("descripcion").value);
            setAutor(document.getElementById("autor").value);
            setUnidad(document.getElementById("unidad").value);
            setEdicion(document.getElementById("anio").value);
            setPalabras(document.getElementById("clave").value);
            setLibre(document.getElementById("libre").value);
            setOperador11(e);
        }
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

            <Modal dialogAs={DraggableModalDialog} show={showModalB} backdrop={false} keyboard={false} contentClassName="modal-redimensionableConsulta"
                onHide={() => setShowModalB(!showModalB)} className="tw-pointer-events-none modal-analisis">
                <Modal.Header className="tw-cursor-pointer modal-movible" closeButton>
                    <Modal.Title><b>Busqueda</b></Modal.Title>
                    <button className="boton-minimizar-modal" onClick={(e) => minimizaModal(e)}>
                        <FontAwesomeIcon icon={faWindowRestore} />
                    </button>
                </Modal.Header>
                <Modal.Body className="modal-movible">
                    <div className="main">
                        <div className="container">
                            <div className="row">
                                <div className=" col-12 text-center"><h6 name="encontrados">{pub}</h6></div>
                            </div>
                            <Form className="col-12" onSubmit={handleSubmit(onSubmit)}>
                                <div className="row">
                                    <div className="col-8 col-md-8 col-lg-8">
                                        <Form.Group controlId="dato">
                                            <Form.Label>Titulo/Nombre</Form.Label>
                                            <Form.Control name="dato" type="text" ref={register()} value={titulo} onChange={(e) => cambioD(e)} />
                                        </Form.Group>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-4">
                                        <Form.Label>Operador</Form.Label>
                                        <Typeahead
                                            id="operador1"
                                            name="operador1"
                                            labelKey={"label"}
                                            options={operador}
                                            onChange={(e) => guardarParametros(e, "operador1")}
                                            placeholder="Selecciona"
                                            clearButton
                                            selected={operador1}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-8 col-md-8 col-lg-8">
                                        <Form.Group controlId="descripcion">
                                            <Form.Label>Descripción</Form.Label>
                                            <Form.Control name="descripcion" type="text" ref={register()} value={desc} onChange={(e) => cambioD(e)} />
                                        </Form.Group>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-4">
                                        <Form.Label></Form.Label>
                                        <Typeahead
                                            id="operador2"
                                            name="operador2"
                                            labelKey={"label"}
                                            options={operador}
                                            onChange={(e) => guardarParametros(e, "operador2")}
                                            placeholder="Selecciona"
                                            clearButton
                                            selected={operador2}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-8 col-md-8 col-lg-8">
                                        <Form.Group controlId="autor">
                                            <Form.Label>Autor</Form.Label>
                                            <Form.Control name="autor" type="text" ref={register()} value={autor} onChange={(e) => cambioD(e)} />
                                        </Form.Group>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-4">
                                        <Form.Label></Form.Label>
                                        <Typeahead
                                            id="operador3"
                                            name="operador3"
                                            labelKey={"label"}
                                            options={operador}
                                            onChange={(e) => guardarParametros(e, "operador3")}
                                            placeholder="Selecciona"
                                            clearButton
                                            selected={operador3}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-8 col-md-8 col-lg-8">
                                        <Form.Group controlId="cobertura">
                                            <Form.Label>Nivel de Cobertura</Form.Label>
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
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-4">
                                        <Form.Label></Form.Label>
                                        <Typeahead
                                            id="operador4"
                                            name="operador4"
                                            labelKey={"label"}
                                            options={operador}
                                            onChange={(e) => setOperador4(e)}
                                            placeholder="Selecciona"
                                            clearButton
                                            selected={operador4}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-8 col-md-8 col-lg-8">
                                        <Form.Group controlId="unidad">
                                            <Form.Label>Fuente/Instancia</Form.Label>
                                            <Form.Control name="unidad" type="text" ref={register()} value={unidad} onChange={(e) => cambioD(e)} />
                                        </Form.Group>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-4">
                                        <Form.Label></Form.Label>
                                        <Typeahead
                                            id="operador5"
                                            name="operador5"
                                            labelKey={"label"}
                                            options={operador}
                                            onChange={(e) => guardarParametros(e, "operador5")}
                                            placeholder="Selecciona"
                                            clearButton
                                            selected={operador5}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-8 col-md-8 col-lg-8">
                                        <Form.Group controlId="anio">
                                            <Form.Label>Año de Publicación</Form.Label>
                                            <Form.Control placeholder="Ej. 2001" name="anio" type="text" ref={register()} value={edicion} onChange={(e) => cambioD(e)} pattern="[0-9]{4}" title="El año debe ser en formato AAAA" />
                                        </Form.Group>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-4">
                                        <Form.Label></Form.Label>
                                        <Typeahead
                                            id="operador6"
                                            name="operador6"
                                            labelKey={"label"}
                                            options={operador}
                                            onChange={(e) => guardarParametros(e, "operador6")}
                                            placeholder="Selecciona"
                                            clearButton
                                            selected={operador6}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-8 col-md-8 col-lg-8">
                                        <Form.Group controlId="tipo">
                                            <Form.Label>Tipo/Clasificación</Form.Label>
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
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-4">
                                        <Form.Label></Form.Label>
                                        <Typeahead
                                            id="operador7"
                                            name="operador7"
                                            labelKey={"label"}
                                            options={operador}
                                            onChange={(e) => setOperador7(e)}
                                            placeholder="Selecciona"
                                            clearButton
                                            selected={operador7}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-8 col-md-8 col-lg-8">
                                        <Form.Group controlId="tema1">
                                            <Form.Label>Tema Principal</Form.Label>
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
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-4">
                                        <Form.Label></Form.Label>
                                        <Typeahead
                                            id="operador8"
                                            name="operador8"
                                            labelKey={"label"}
                                            options={operador}
                                            onChange={(e) => setOperador8(e)}
                                            placeholder="Selecciona"
                                            clearButton
                                            selected={operador8}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-8 col-md-8 col-lg-8">
                                        <Form.Group controlId="tema2">
                                            <Form.Label>Tema Secundario</Form.Label>
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
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-4">
                                        <Form.Label></Form.Label>
                                        <Typeahead
                                            id="operador9"
                                            name="operador9"
                                            labelKey={"label"}
                                            options={operador}
                                            onChange={(e) => setOperador9(e)}
                                            placeholder="Selecciona"
                                            clearButton
                                            selected={operador9}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-8 col-md-8 col-lg-8">
                                        <Form.Group controlId="clave">
                                            <Form.Label>Palabras clave</Form.Label>
                                            <Form.Control name="clave" type="text" o placeholder="Ej. palabra1, palabra2..." ref={register()} value={palabras} onChange={(e) => cambioD(e)} />
                                        </Form.Group>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-4">
                                        <Form.Label></Form.Label>
                                        <Typeahead
                                            id="operador10"
                                            name="operador10"
                                            labelKey={"label"}
                                            options={operador}
                                            onChange={(e) => guardarParametros(e, "operador10")}
                                            placeholder="Selecciona"
                                            clearButton
                                            selected={operador10}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-8 col-md-8 col-lg-8">
                                        <Form.Group controlId="formato">
                                            <Form.Label>Formato de Archivo</Form.Label>
                                            <Form.Control name="formato" type="hidden" ref={register()} value={formato} />
                                            <Typeahead
                                                id="formato"
                                                name="formato"
                                                labelKey={"label"}
                                                options={formatoD}
                                                onChange={(e) => cambioFormato(e)}
                                                selected={formatoS}
                                                placeholder="Selecciona una opcion"
                                                clearButton
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-4">
                                        <Form.Label></Form.Label>
                                        <Typeahead
                                            id="operador11"
                                            name="operador11"
                                            labelKey={"label"}
                                            options={operador}
                                            onChange={(e) => setOperador11(e)}
                                            placeholder="Selecciona"
                                            clearButton
                                            selected={operador11}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-8 col-md-8 col-lg-8">
                                        <Form.Group controlId="libre">
                                            <Form.Label>Texto Libre</Form.Label>
                                            <Form.Control name="libre" type="text" ref={register()} value={libre} onChange={(e) => cambioD(e)} />
                                        </Form.Group>
                                    </div>
                                    {
                                        /*
                                    <div className="col-4 col-md-4 col-lg-4">
                                        <Form.Label></Form.Label>
                                        <Typeahead
                                            id="operador12"
                                            name="operador12"
                                            labelKey={"label"}
                                            options={operador}
                                            onChange={(e) => setOperador12(e)}
                                            placeholder="Selecciona"
                                            clearButton
                                            selected={operador12}
                                        />
                                    </div>
                                    */
                                    }
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-11 col-md-6 col-lg-6">
                                                <Button variant="outline-secondary" className="btn-admin" type="submit" >BUSCAR</Button>
                                            </div>
                                            <div className="col-11 col-md-6 col-lg-6">
                                                <Button variant="outline-danger" className="btn-admin" onClick={cerrarM}>Cerrar</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </Form>


                        </div>
                    </div>
                </Modal.Body>
            </Modal>



            <div className="row">
                <div className="col-8 col-sm-8 col-lg-8">
                    {
                        r != null && (
                            r.length > 0 ? (
                                <PaginationComponent
                                    informacion={r}
                                    consulta={consulta}
                                    total={total}
                                    pagina={1}
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
                                defaultValue={busq}
                            ></Select>
                        </div>
                    </div>
                    <br />
                    {
                        /*
                        busquedaPR != null && (
                            <div className="row justify-content-center">
                                <div className="col-11 caja">
                                    <p>Búsquedas</p>
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
                                                onChange={buscarxTipo}
                                            ></Select>
                                        </div>
                                    </div>
                                    <br />
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
                                                onChange={buscarxTema1}
                                            ></Select>
                                        </div>
                                    </div>
                                    <br />
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
                                                onChange={buscarxTema2}
                                            ></Select>
                                        </div>
                                    </div>
                                    <br />
                                    <div className="row">
                                        <div className="col-12 col-md-12 col-lg-12">
                                            <Select
                                                controlId="tema"
                                                placeholder="Nivel de Cobertura"
                                                className="basic-single"
                                                classNamePrefix="Select"
                                                name="tema"
                                                options={coberturaG}
                                                isClearable={true}
                                                onChange={buscarxcobertura}
                                            ></Select>
                                        </div>
                                    </div>
                                    <br />
                                    <div className="row">
                                        <div className="col-12 col-md-12 col-lg-12">
                                            <Form.Group controlId="nombre">
                                                <Form.Label>Nombre o Titulo</Form.Label>
                                                <Form.Control name="nombre" type="text" onKeyUp={buscarxTitulo} />
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 col-md-12 col-lg-12">
                                            <Form.Group controlId="clave">
                                                <Form.Label>Palabras clave</Form.Label>
                                                <Form.Control name="clave" type="text" onKeyUp={buscarxPalabras} placeholder="Ej. palabra1, palabra2..." />
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 col-md-12 col-lg-12">
                                            <Form.Group controlId="anio">
                                                <Form.Label>Año</Form.Label>
                                                <Form.Control name="anio" type="text" onKeyUp={buscarxAnio} pattern="[0-9]{4}" placeholder="Ej. 2000" />
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 col-md-12 col-lg-12">
                                            <Form.Group controlId="libre">
                                                <Form.Label>Texto Libre</Form.Label>
                                                <Form.Control name="libre" type="text" onKeyUp={buscarxTextoL} />
                                            </Form.Group>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )*/
                    }

                    <div className="row mt-2">
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
                <div className="col-1 col-md-1 col-lg-1">
                    {
                        busquedaPR != null && (
                            <div className="row">
                                <div className="col-1 col-sm-1 align-self-end">
                                    <button className="busq" onClick={verModal}>
                                        <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                                    </button>
                                </div>
                            </div>
                        )
                    }
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