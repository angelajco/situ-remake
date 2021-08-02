import React, { useEffect, useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import { Container } from 'react-bootstrap'
import { Form, Modal, Button, Table, Tabs, Tab } from 'react-bootstrap';
import Draggable, { DraggableCore } from "react-draggable";
import { ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Select from 'react-select';
import Cookies from 'universal-cookie';
import Loader from '../../components/Loader';
import ModalComponent from '../../components/ModalComponent';
import axios from 'axios'
import Router from 'next/router'
import Link from 'next/link';
const cookies = new Cookies()


export default function consultaMetadatos() {


    //Datos para el modal
    const [show, setShow] = useState(false);
    const [datosModal, setDatosModal] = useState({});

    //Estados para mostrar el modal
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    //console.log(usuarioI);
    //Datos para crear el form
    const { register, handleSubmit, control: controlJson, watch, clearErrors, setError, errors } = useForm();
    const [tarchivo, setTarchivo] = useState(null);
    const [fileUrl, setFileUrl] = useState('/images/consultaD/miniaturaD.png');
    const [imgportada, setImgPortada] = useState(null);
    const [tipodoc, setTipoDoc] = useState();
    const [tema1, setTema1] = useState();
    const [tema2, setTema2] = useState();
    const [cobertura, setCobertura] = useState();
    const [cdatos, setCDatos] = useState();
    const [vigencia, setVigencia] = useState();
    const [actual, setActual] = useState();
    const [armoni, setArmoni] = useState();
    const [formato, setFormato] = useState();
    const [pais, setPais] = useState();
    const [idioma, setIdioma] = useState(); //msjError
    const [msjError, setMsjError] = useState();
    // Estado para guardar el web token que se pide a la API
    const [tokenSesion, setTokenSesion] = useState(false)
    // Guarda el token que viene en la cookie para verificar que la tenga
    const tokenCookie = cookies.get('SessionToken')
    const rolCookie = cookies.get('RolUsuario')
    const estatusCookie = cookies.get('EstatusUsuario')
    const usuarioCookie = cookies.get('Usuario')
    const usuarioI = cookies.get('IDU')
    const prod = cookies.get('prod');
    //console.log(prod);
    const [nombre, setNombre] = useState();
    const [urlo, setUrlo] = useState();
    const [descrip, setDescrip] = useState();
    const [aliasD, setAliasD] = useState();
    const [detalle, setDetalle] = useState();
    const [t, setTipoDo] = useState();
    const [cEntidad, setCEntidad] = useState();
    const [cMunicipio, setCMunicipio] = useState();
    const [clasi, setClasi] = useState();
    const [autor1, setAutor1] = useState();
    const [autor2, setAutor2] = useState();
    const [autor3, setAutor3] = useState();
    const [ints1, setInts1] = useState();
    const [ints2, setInts2] = useState();
    const [ints3, setInts3] = useState();
    const [conjunto, setConjunto] = useState();
    const [editorial, setEditorial] = useState();
    const [edicion, setEdicion] = useState();
    const [isbn, setISBN] = useState();
    //const [, ] = useState();
    const [fpublicacion, setFPublicacion] = useState();
    const [factualizacion, setFActualizacion] = useState();
    const [vIni, setVIni] = useState();
    const [vFin, setVFin] = useState();
    const [paginas, setPaginas] = useState();
    const [archivo, setArchivo] = useState();
    const [claves, setClaves] = useState();
    const [isLoading, setIsLoading] = useState(true);


    const buscar = async () => {
        const res = await fetch(`${process.env.ruta}/wa/publico/consultaDocumento?search=id:${prod}`);
        const datos1 = await res.json();
        var index = buscarCampo(datos1[0].tipo, tipoF);
        //console.log(index);
        setVIni(datos1[0].ano_vig_inicial);
        setVFin(datos1[0].ano_vig_final);
        setPaginas(datos1[0].paginas);
        setClaves(datos1[0].palabrasclave)
        setArchivo(datos1[0].nombre_archivo);
        setNombre(datos1[0].nombre);
        setUrlo(datos1[0].url_origen);
        setDetalle(datos1[0].tratamiento_publicacion);
        setDescrip(datos1[0].descripcion);
        setAliasD(datos1[0].alias);
        setTipoDo(parseInt(index, 10));
        setCEntidad(datos1[0].cve_ent);
        setCMunicipio(datos1[0].cve_mun);
        setClasi(datos1[0].tipo);
        setTema1(datos1[0].tema1);
        setTema2(datos1[0].tema2);
        setCobertura(datos1[0].nivel_cobertura);
        setAutor1(datos1[0].autor1);
        setAutor2(datos1[0].autor2);
        setAutor3(datos1[0].autor3);
        setInts1(datos1[0].instancia);
        setInts2(datos1[0].instancia2);
        setInts3(datos1[0].instancia3);
        setConjunto(datos1[0].tratamiento_publicacion);
        setEditorial(datos1[0].editorial);
        setEdicion(datos1[0].editorial);
        setISBN(datos1[0].isbn);
        setFPublicacion(datos1[0].ano_publicacion + "/" + datos1[0].mes_publicacion + "/" + datos1[0].dia_publicacion);
        setVigencia(datos1[0].doc_vigente);
        setActual(datos1[0].doc_actualizado);
        setFActualizacion(datos1[0].actualizacion);
        setArmoni(datos1[0].armonizado_lgahotdu);
        setFormato(datos1[0].formato);
        setIdioma(datos1[0].idioma);
        setPais(datos1[0].pais);
        setIsLoading(false);
    }


    useEffect(() => {
        setIsLoading(true);
        buscar(prod);
        
      })

    const tarchivos = [
        { value: '1', label: 'Documento' },
        { value: '2', label: 'Enlace' }
    ];
    const tipoF = [
        { value: '1', label: 'Normativo', name: 'tipo' },
        { value: '2', label: 'Instrumento de planeación', name: 'tipo' },
        { value: '3', label: 'Artículo de Revista', name: 'tipo' },
        { value: '4', label: 'Revista', name: 'tipo' },
        { value: '5', label: 'Artículo en revista Indexada', name: 'tipo' },
        { value: '6', label: 'Revista Indexada', name: 'tipo' },
        { value: '7', label: 'Libro', name: 'tipo' },
        { value: '8', label: 'Tésis', name: 'tipo' },
        { value: '9', label: 'Investigación', name: 'tipo' },
        { value: '10', label: 'Otro', name: 'tipo' }
    ];
    const temaP = [
        { value: '1', label: 'Ambiental', name: 'tema1' },
        { value: '2', label: 'Demográfico', name: 'tema1' },
        { value: '3', label: 'Energía', name: 'tema1' },
        { value: '4', label: 'Gestión', name: 'tema1' },
        { value: '5', label: 'Internacional', name: 'tema1' },
        { value: '6', label: 'Riesgos, peligros y vulnerabilidad', name: 'tema1' },
        { value: '7', label: 'Salud', name: 'tema1' },
        { value: '8', label: 'Socioeconómico', name: 'tema1' },
        { value: '9', label: 'Tecnológico', name: 'tema1' },
        { value: '10', label: 'Territorial', name: 'tema1' },
        { value: '11', label: 'Movilidad', name: 'tema1' },
    ];
    const temaS = [
        { value: '1', label: 'Planeación', name: 'tema2' },
        { value: '2', label: 'Ordenamiento Territorial y Urbano', name: 'tema2' },
        { value: '3', label: 'Ordenamiento Ecológico', name: 'tema2' },
        { value: '4', label: 'Vivienda', name: 'tema2' },
        { value: '5', label: 'Desarrollo Agrario', name: 'tema2' },
        { value: '6', label: 'Desarrollo Rural', name: 'tema2' },
        { value: '7', label: 'Riesgos', name: 'tema2' },
        { value: '8', label: 'Catastro', name: 'tema2' },
        { value: '9', label: 'Gobernanza', name: 'tema2' }
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

    const cDatos = [
        { value: '1', label: 'Publicación oficial', name: 'cDatos' },
        { value: '2', label: 'Estudio', name: 'cDatos' },
        { value: '3', label: 'Proyecto', name: 'cDatos' },
        { value: '4', label: 'Colección', name: 'cDatos' },
        { value: '5', label: 'Investigación', name: 'cDatos' },
        { value: '6', label: 'Propuesta', name: 'cDatos' },
        { value: '7', label: 'Comunicado', name: 'cDatos' },
        { value: '8', label: 'Manifiesto', name: 'cDatos' },
        { value: '9', label: 'Adendum', name: 'cDatos' },
        { value: '10', label: 'Artículos académicos', name: 'cDatos' }
    ];
    const vig = [
        { value: '1', label: 'Vigente', name: 'vigencia' },
        { value: '2', label: 'Histórico', name: 'vigencia' }
    ];

    const act = [
        { value: '1', label: 'Si', name: 'actualizado' },
        { value: '2', label: 'No', name: 'actualizado' }
    ];

    const armon = [
        { value: '1', label: 'Si', name: 'armonizado' },
        { value: '2', label: 'No', name: 'armonizado' },
        { value: '3', label: 'N/A', name: 'armonizado' },
        { value: '4', label: 'S/D', name: 'armonizado' }
    ];

    const formatoD = [
        { value: '1', label: 'pdf', name: 'formato' },
        { value: '2', label: 'Procesador de textos', name: 'formato' },
        { value: '3', label: 'Hoja de cálculo', name: 'formato' },
        { value: '4', label: 'jpg', name: 'formato' },
        { value: '5', label: 'png', name: 'formato' },
        { value: '6', label: 'dwg', name: 'formato' },
        { value: '7', label: 'Otro', name: 'formato' }
    ];
    const paisD = [
        { value: '1', label: 'México', name: 'pais' },
        { value: '2', label: 'Estados Unidos', name: 'pais' },
        { value: '3', label: 'Canada', name: 'pais' },
        { value: '4', label: 'Colombia', name: 'pais' },
        { value: '5', label: 'Argentina', name: 'pais' },
        { value: '6', label: 'Costa Rica', name: 'pais' },
        { value: '7', label: 'Brazil', name: 'pais' }
    ];
    const idiomaD = [
        { value: '1', label: 'Español', name: 'idioma' },
        { value: '2', label: 'Ingles', name: 'idioma' },
        { value: '3', label: 'Frances', name: 'idioma' }
    ];

    const onSubmitP = async (data) => {
        //data.portada = imgportada;
        var hoy = new Date();
        var fechaC = hoy.getDate() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear();
        var fechaA = hoy.getFullYear() + '/' + (hoy.getMonth() + 1) + '/' + hoy.getDate();
        //console.log(fechaA);
        //setFileUrl(null);
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///codigo para validaciones de formulario


        if (tarchivo == null) {
            let t1 = document.getElementById('msj-tipoDoc');
            document.getElementById('tipo').focus();
            t1.innerHTML = "Selecciona tipo de documento a guardar";
            setMsjError("Se han encontrado errores en la información");
            return false;
        } else {
            let t1 = document.getElementById('msj-tipoDoc');
            t1.innerHTML = "";
            setMsjError("");
        }
        if (tarchivo == 2) {
            if (data.enlace === "") {
                let t1 = document.getElementById('msj-enlace');
                document.getElementById('enlace').focus();
                t1.innerHTML = "Ingresa enlace del documento";
                setMsjError("Se han encontrado errores en la información");
                return false;
            } else {
                let t1 = document.getElementById('msj-enlace');
                t1.innerHTML = "";
            }
        }
        if (tarchivo == 1) {
            if (data.doc.length === 0) {
                let t1 = document.getElementById('msj-doc');
                document.getElementById('doc').focus();
                t1.innerHTML = "Ingresa documento a subir";
                setMsjError("Se han encontrado errores en la información");
                return false;
            } else {
                let t1 = document.getElementById('msj-doc');
                t1.innerHTML = "";
            }
        }

        if (data.titulo === "") {
            let t1 = document.getElementById('msj-titulo');
            document.getElementById('titulo').focus();
            t1.innerHTML = "Ingresa nombre del documento";
            setMsjError("Se han encontrado errores en la información");
            return false;
        } else {
            let t1 = document.getElementById('msj-titulo');
            t1.innerHTML = "";
        }
        if (data.descripcion === "") {
            let t1 = document.getElementById('msj-descripcion');
            document.getElementById('descripcion').focus();
            t1.innerHTML = "Ingresa Descripción del documento";
            setMsjError("Se han encontrado errores en la información");
            return false;
        } else {
            let t1 = document.getElementById('msj-descripcion');
            t1.innerHTML = "";
        }

        if (data.tipoD === "") {
            let t1 = document.getElementById('msj-tipo');
            let t2 = document.getElementById('tipoD1').focus();
            t1.innerHTML = "Selecciona tipo de archivo";
            setMsjError("Se han encontrado errores en la información");
            return false;
        } else {
            let t1 = document.getElementById('msj-tipo');
            t1.innerHTML = "";
        }

        if (data.tema1 === "") {
            let t1 = document.getElementById('msj-tema1');
            document.getElementById('tema11').focus();
            t1.innerHTML = "Selecciona tema principal del documento";
            setMsjError("Se han encontrado errores en la información");
            return false;
        } else {
            let t1 = document.getElementById('msj-tema1');
            t1.innerHTML = "";
        }

        if (data.tema2 === "") {
            let t1 = document.getElementById('msj-tema2');
            document.getElementById('tema22').focus();
            t1.innerHTML = "Selecciona tema secundario del documento";
            setMsjError("Se han encontrado errores en la información");
            return false;
        } else {
            let t1 = document.getElementById('msj-tema2');
            t1.innerHTML = " ";
        }

        if (data.cobertura === "") {
            let t1 = document.getElementById('msj-cobertura');
            document.getElementById('coberturaG1').focus();
            t1.innerHTML = "Selecciona nivel de cobertura del documento";
            setMsjError("Se han encontrado errores en la información");
            return false;
        } else {
            let t1 = document.getElementById('msj-cobertura');
            t1.innerHTML = " ";
        }
        if (data.autor1 != "") {
            var reg = /^([a-z ñáéíóú]{2,60})$/i;

            if (!reg.test(data.autor1)) {
                let t1 = document.getElementById('msj-autor1');
                document.getElementById('autor1').focus();
                t1.innerHTML = "Ingresa un nombre válido";
                setMsjError("Se han encontrado errores en la información");
                return false;
            } else {
                let t1 = document.getElementById('msj-autor1');
                t1.innerHTML = "";
            }
        }
        if (data.autor2 != "") {
            var reg = /^([a-z ñáéíóú]{2,60})$/i;
            if (!reg.test(data.autor2)) {
                let t1 = document.getElementById('msj-autor2');
                document.getElementById('autor2').focus();
                t1.innerHTML = "Ingresa un nombre válido";
                setMsjError("Se han encontrado errores en la información");
                return false;
            } else {
                let t1 = document.getElementById('msj-autor2');
                t1.innerHTML = "";
            }
        }
        if (data.autor3 != "") {
            var reg = /^([a-z ñáéíóú]{2,60})$/i;
            if (!reg.test(data.autor3)) {
                let t1 = document.getElementById('msj-autor3');
                document.getElementById('autor3').focus();
                t1.innerHTML = "Ingresa un nombre válido";
                setMsjError("Se han encontrado errores en la información");
                return false;
            } else {
                let t1 = document.getElementById('msj-autor3');
                t1.innerHTML = "";
            }
        }

        if (data.fecha === "") {
            let t1 = document.getElementById('msj-fechaP');
            let t2 = document.getElementById('fecha').focus();
            t1.innerHTML = "Ingresa fecha de pub;icación";
            setMsjError("Se han encontrado errores en la información");
            return false;
        } else {
            let t1 = document.getElementById('msj-fechaP');
            t1.innerHTML = "";
        }

        if (data.formato === "") {
            let t1 = document.getElementById('msj-formato');
            document.getElementById('formato1').focus();
            t1.innerHTML = "Selecciona el formato del documento";
            setMsjError("Se han encontrado errores en la información");
            return false;
        } else {
            let t1 = document.getElementById('msj-formato');
            t1.innerHTML = " ";
        }

        if (data.pais === "") {
            let t1 = document.getElementById('msj-pais');
            document.getElementById('pais').focus();
            t1.innerHTML = "Selecciona el pais del documento";
            setMsjError("Se han encontrado errores en la información");
            return false;
        } else {
            let t1 = document.getElementById('msj-pais');
            t1.innerHTML = " ";
        }

        if (data.idioma === "") {
            let t1 = document.getElementById('msj-idioma');
            document.getElementById('idioma').focus();
            t1.innerHTML = "Selecciona el idioma del documento";
            setMsjError("Se han encontrado errores en la información");
            return false;
        } else {
            let t1 = document.getElementById('msj-idioma');
            t1.innerHTML = " ";
        }

        if (data.paginas === "") {
            let t1 = document.getElementById('msj-paginas');
            document.getElementById('paginas').focus();
            t1.innerHTML = "Ingresa número de paginas del documento";
            setMsjError("Se han encontrado errores en la información");
            return false;
        } else {
            let t1 = document.getElementById('msj-paginas');
            t1.innerHTML = " ";
        }

        if (data.palabrasC === "") {
            let t1 = document.getElementById('msj-palabras');
            document.getElementById('palabrasC').focus();
            t1.innerHTML = "Ingresa el nombre origen del documento";
            setMsjError("Se han encontrado errores en la información");
            return false;
        } else {
            let t1 = document.getElementById('msj-palabras');
            t1.innerHTML = " ";
        }

        if (data.nomArchivo === "") {
            let t1 = document.getElementById('msj-nombreOrigen');
            document.getElementById('nomArchivo').focus();
            t1.innerHTML = "Ingresa las palabras clave del documento";
            setMsjError("Se han encontrado errores en la información");
            return false;
        } else {
            let t1 = document.getElementById('msj-nombreOrigen');
            t1.innerHTML = " ";
        }
        if (data.fechaAct == "") {
            data.fechaAct = fechaA;
        } else {
            data.fechaAct.replace('-', '/')
        }
        if (data.cveEntidad == "" && data.cveMunicipal == "") {
            data.idGeo = "00";
        } else {
            data.idGeo = data.cveEntidad + data.cveMunicipal;
        }
        if (data.cveEntidad == "") {
            data.cveEntidad = "00";
        }
        if (data.cveMunicipal == "") {
            data.cveMunicipal = "N/A";
        }



        console.log(data);

        const auxfech = data.fecha.split('-');
        //console.log(auxfech);
        //terminan las validaciones 
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //console.log("Datos Correctos")

        const url = `${process.env.ruta}/wa/publico/setMetadatoDocumento?id_usuario=${usuarioI}&nombre=${data.titulo}&descripcion=${data.descripcion}&tipo=${data.tipoD}&tema1=${data.tema1}&tema2=${data.tema2}&nivel_cobertura=${data.cobertura}&ano_publicacion=${auxfech[0]}&mes_publicacion=${auxfech[1]}&dia_publicacion=${auxfech[2]}&formato=${data.formato}&pais=${data.pais}&idioma=${data.idioma}&paginas=${data.paginas}&palabras_clave=${data.palabrasC}&nombre_archivo=${data.nomArchivo}&url_origen=${data.enlace}&fecha_cap_situ=${fechaC}&actualizacion=${fechaA}&alias=${data.alias}&publicacion=${data.detalle}&cve_ent=${data.cveEntidad}&cve_mun=${data.cveMunicipal}&id_geografico=${data.idGeo}&autor=${data.autor1}&autor2=${data.autor2}&autor3=${data.autor3}&instancia=${data.dependencia}&instancia2=${data.dependencia2}&instancia3=${data.dependencia3}&tratamiento_publicacion=${data.conjDatos}&editorial=${data.editorial}&edicion=${data.edicion}&isbn=${data.isbn}&doc_vigente=${data.vigencia}&doc_actualizado=${data.actualizado}&ano_vig_inicial=${data.pvInicial}&ano_vig_final=${data.pvFinal}&armonizado_lgahotdu=${data.armonizado}`;
        console.log(url);
        const res = await fetch(url);
        const datos = await res.json();
        if (datos['message-subject'] === 'Datos guardados') {
            let formData = new FormData();
            formData.append("file", data.portada[0]);
            fetch(`${process.env.ruta}/wa/publico/upMiniaturaDocumento`, {
                method: 'POST',
                body: formData
            }).then(respuesta => respuesta.text()).then(decodificado => { console.log(decodificado); });
            metadatosModal('Registro Exitoso');
        } else {
            metadatosModal('Error de Registro');
        }
        if (!show) {
            //location.reload();
        }


    }

    function buscarCampo(campo, json1) {
        for (var i = 0; i < json1.length; i++) {
            if (json1[i].label == campo) {
                return i;
            }
        }
    }

    const tipoA = e => {
        if (e == null) {
            setTarchivo("");
        } else {
            setTarchivo(e.value);
        }
    }

    function processImage(event) {
        const imageFile = event.target.files[0];
        const imageUrl = URL.createObjectURL(imageFile);
        setFileUrl(imageUrl);
        setImgPortada(imageFile)
    }

    function cambioTipo(e) {
        if (e != null) {
            if (e.name == "tipo") {
                if (e != undefined) {
                    setTipoDoc(e.label);
                } else {
                    setTipoDoc("");
                }
            }
        } else {
            setTipoDoc("");
        }
    }
    function cambioTemaP(e) {
        if (e != null) {
            if (e.name == "tema1") {
                if (e != undefined) {
                    setTema1(e.label);
                } else {
                    setTema1("");
                }
            }
        } else {
            setTema1("");
        }
    }
    function cambioTemaS(e) {
        if (e != null) {
            if (e.name == "tema2") {
                if (e != undefined) {
                    setTema2(e.label);
                } else {
                    setTema2("");
                }
            }
        } else {
            setTema2("");
        }
    }
    function cambioCobertura(e) {
        if (e != null) {
            if (e.name == "cobertura") {
                if (e != undefined) {
                    setCobertura(e.label);
                } else {
                    setCobertura("");
                }
            }
        } else {
            setCobertura("");
        }
    }
    function cambioCDatos(e) {
        if (e != null) {
            if (e.name == "cDatos") {
                if (e != undefined) {
                    setCDatos(e.label);
                } else {
                    setCDatos("");
                }
            }
        } else {
            setCDatos("");
        }
    }
    function cambioVigencia(e) {
        if (e != null) {
            if (e.name == "vigencia") {
                if (e != undefined) {
                    setVigencia(e.label);
                } else {
                    setVigencia("");
                }
            }
        } else {
            setVigencia("");
        }
    }
    function cambioActualizado(e) {
        if (e != null) {
            if (e.name == "actualizado") {
                if (e != undefined) {
                    setActual(e.label);
                } else {
                    setActual("");
                }
            }
        } else {
            setActual("");
        }
    }
    function cambioArmonizado(e) {
        if (e != null) {
            if (e.name == "armonizado") {
                if (e != undefined) {
                    setArmoni(e.label);
                } else {
                    setArmoni("");
                }
            }
        } else {
            setArmoni("");
        }
    }
    function cambioFormato(e) {
        if (e != null) {
            if (e.name == "formato") {
                if (e != undefined) {
                    setFormato(e.label);
                } else {
                    setFormato("");
                }
            }
        } else {
            setFormato("");
        }
    }
    function cambioPais(e) {
        if (e != null) {
            if (e.name == "pais") {
                if (e != undefined) {
                    setPais(e.label);
                } else {
                    setPais("");
                }
            }
        } else {
            setPais("");
        }
    }
    function cambioIdioma(e) {
        if (e != null) {
            if (e.name == "idioma") {
                if (e != undefined) {
                    setIdioma(e.label);
                } else {
                    setIdioma("");
                }
            }
        } else {
            setIdioma("");
        }
    }

    const metadatosModal = async (mensaje) => {
        const cuerpo =
            <div>
                <p>{mensaje}</p>
            </div>;

        setDatosModal(
            {
                title: 'Carga Documental',
                body: cuerpo,
                nombreBoton: 'Cerrar'
            }
        )
        setShow(true)
    }


    return (
        <>
            
            <ModalComponent
                show={show}
                datos={datosModal}
                onHide={handleClose}
                onClick={handleClose}
            />
            <main>
            
                <Container>
                    <div className="container">
                        <h5 className="text-center"> Detalle de Metadatos </h5>
                        <br></br>
                        <Form className="col-12" onSubmit={handleSubmit(onSubmitP)}>
                            <div className="row">
                                <div className="col-2 col-md-2 col-lg-2">
                                    <Form.Group controlId="portada">
                                        <Form.Label>Portada</Form.Label>
                                        <img className="mini" src={fileUrl}></img>
                                        <br></br>
                                        {/*}
                                        <Form.File name="portada" accept="image/*" ref={register()} onChange={processImage} />
                                        {*/}
                                    </Form.Group>
                                </div>
                                <div className="col-10 col-md-10 col-lg-10">
                                    <Form.Group controlId="enlace">
                                        <Form.Label>URL Origen *</Form.Label>
                                        <Form.Control name="enlace" type="text" ref={register()} value={urlo} disabled />
                                    </Form.Group>
                                    <Form.Group controlId="titulo">
                                        <Form.Label>Nombre *</Form.Label>
                                        <Form.Control name="titulo" type="text" ref={register()} value={nombre} disabled />
                                        <p id="msj-titulo" className="msj"></p>
                                    </Form.Group>
                                    <Form.Group controlId="descripcion">
                                        <Form.Label>Descripción *</Form.Label>
                                        <Form.Control name="descripcion" type="textarea" rows="10" ref={register()} value={descrip} disabled />
                                        <p id="msj-descripcion" className="msj"></p>
                                    </Form.Group>


                                </div>

                            </div>{/*termian la primer fila del formulario*/}
                            <hr></hr>
                            <div className="row">
                                <div className="col-6">
                                    <Form.Group controlId="alias">
                                        <Form.Label>Alias</Form.Label>
                                        <Form.Control name="alias" type="text" ref={register()} value={aliasD} disabled />
                                        <p id="msj-alias" className="msj"></p>
                                    </Form.Group>
                                    <Form.Group controlId="tipoD">
                                        <Form.Label>Tipo *</Form.Label>
                                        <Form.Control name="tipoD" type="text" ref={register()} value={clasi} disabled />
                                        {/*}
                                        <Select
                                            id="tipoD1"
                                            controlId="tipoD"
                                            defaultValue={tipoF[t]}
                                            placeholder="Selecciona una opción"
                                            className="basic-single"
                                            classNamePrefix="Select"
                                            name="tipoD"
                                            options={tipoF}
                                            isClearable={true}
                                            onChange={(e) => cambioTipo(e)}
                                        ></Select>
                                    */}
                                        <p id="msj-tipo" className="msj"></p>
                                    </Form.Group>
                                    {
                                        clasi == 'Revista Indexada' || clasi == 'Libro' || clasi == 'Revista' ? (
                                            <Form.Group controlId="detalle">
                                                <Form.Label>Detalle de la publicación</Form.Label>
                                                <Form.Control name="detalle" type="text" ref={register()} value={detalle} disabled />
                                            </Form.Group>
                                        ) : (<p></p>)
                                    }
                                    <Form.Group controlId="tema1">
                                        <Form.Label>Tema Principal *</Form.Label>
                                        <Form.Control name="tema1" type="text" ref={register()} value={tema1} disabled />
                                        {/*
                                        <Select
                                            id="tema11"
                                            controlId="tema1"
                                            placeholder="Selecciona una opción"
                                            className="basic-single"
                                            classNamePrefix="Select"
                                            name="tema1"
                                            options={temaP}
                                            isClearable={true}
                                            onChange={(e) => cambioTemaP(e)}
                                            required
                                        ></Select>*/}
                                        <p id="msj-tema1" className="msj"></p>
                                    </Form.Group>
                                    <Form.Group controlId="tema2">
                                        <Form.Label>Tema Secundario *</Form.Label>
                                        <Form.Control name="tema2" type="text" ref={register()} value={tema2} disabled />
                                        {/*
                                        <Select
                                            id="tema22"
                                            controlId="tema2"
                                            placeholder="Selecciona una opción"
                                            className="basic-single"
                                            classNamePrefix="Select"
                                            name="tema2"
                                            options={temaS}
                                            isClearable={true}
                                            onChange={(e) => cambioTemaS(e)}
                                            required
                                        ></Select>*/}
                                        <p id="msj-tema2" className="msj"></p>
                                    </Form.Group>
                                    <Form.Group controlId="cobertura">
                                        <Form.Label>Nivel de Cobertura *</Form.Label>
                                        <Form.Control name="cobertura" type="text" ref={register()} value={cobertura} disabled />
                                        {/*
                                        <Select
                                            id="coberturaG1"
                                            controlId="cobertura"
                                            placeholder="Selecciona una opción"
                                            className="basic-single"
                                            classNamePrefix="Select"
                                            name="cobertura"
                                            options={coberturaG}
                                            isClearable={true}
                                            onChange={(e) => cambioCobertura(e)}
                                            required
                                        ></Select>*/}
                                        <p id="msj-cobertura" className="msj"></p>
                                    </Form.Group>
                                    <Form.Group controlId="cveEntidad">
                                        <Form.Label>Clave de la Entidad</Form.Label>
                                        <Form.Control name="cveEntidad" type="text" ref={register()} value={cEntidad} disabled />
                                    </Form.Group>
                                    <Form.Group controlId="cveMunicipal">
                                        <Form.Label>Clave Municipal</Form.Label>
                                        <Form.Control name="cveMunicipal" type="text" ref={register()} value={cMunicipio} disabled />
                                    </Form.Group>
                                    <Form.Group controlId="autor1">
                                        <Form.Label>Primer Autor(a)</Form.Label>
                                        <Form.Control name="autor1" type="text" value={autor1} disabled />
                                        <p id="msj-autor1" className="msj"></p>
                                    </Form.Group>
                                    <Form.Group controlId="autor2">
                                        <Form.Label> Segundo Autor(a)</Form.Label>
                                        <Form.Control name="autor2" type="text" value={autor2} disabled />
                                        <p id="msj-autor2" className="msj"></p>
                                    </Form.Group>
                                    <Form.Group controlId="autor3">
                                        <Form.Label>Tercer Autor(a)</Form.Label>
                                        <Form.Control name="autor3" type="text" value={autor3} disabled />
                                        <p id="msj-autor3" className="msj"></p>
                                    </Form.Group>
                                    <Form.Group controlId="dependencia">
                                        <Form.Label>Primera Institución</Form.Label>
                                        <Form.Control name="dependencia" type="text" value={ints1} disabled />
                                    </Form.Group>
                                    <Form.Group controlId="dependencia2">
                                        <Form.Label>Segunda Institución</Form.Label>
                                        <Form.Control name="dependencia2" type="text" value={ints2} disabled />
                                    </Form.Group>
                                    <Form.Group controlId="dependencia3">
                                        <Form.Label>Tercera Institución</Form.Label>
                                        <Form.Control name="dependencia3" type="text" value={ints3} disabled />
                                    </Form.Group>
                                    <Form.Group controlId="conjDatos">
                                        <Form.Label>Conjunto de datos</Form.Label>
                                        <Form.Control name="conjDatos" type="text" ref={register()} value={conjunto} disabled />
                                        {/*
                                        <Select
                                            controlId="conjDatos"
                                            placeholder="Selecciona una opción"
                                            className="basic-single"
                                            classNamePrefix="Select"
                                            name="conjDatos"
                                            options={cDatos}
                                            isClearable={true}
                                            onChange={(e) => cambioCDatos(e)}
                                        ></Select>
                                        */}
                                    </Form.Group>
                                    <Form.Group controlId="editorial">
                                        <Form.Label>Editorial</Form.Label>
                                        <Form.Control name="editorial" type="text" ref={register()} value={editorial} disabled />
                                    </Form.Group>

                                </div>
                                <div className="col-6">
                                    <Form.Group controlId="edicion">
                                        <Form.Label>Edición</Form.Label>
                                        <Form.Control name="edicion" type="text" ref={register()} value={edicion} disabled />
                                    </Form.Group>
                                    <Form.Group controlId="isbn">
                                        <Form.Label>ISBN</Form.Label>
                                        <Form.Control name="isbn" type="text" ref={register()} value={isbn} disabled />
                                    </Form.Group>
                                    <Form.Group controlId="fecha">
                                        <Form.Label>Fecha de Publicación *</Form.Label>
                                        <Form.Control name="fecha" type="text" ref={register()} value={fpublicacion} disabled />
                                        <p id="msj-fechaP" className="msj"></p>
                                    </Form.Group>
                                    <Form.Group controlId="vigencia">
                                        <Form.Label>Vigencia</Form.Label>
                                        <Form.Control name="vigencia" type="text" ref={register()} value={vigencia} disabled />
                                        {/*}
                                        <Select
                                            controlId="vigencia"
                                            placeholder="Selecciona una opción"
                                            className="basic-single"
                                            classNamePrefix="Select"
                                            name="vigencia"
                                            options={vig}
                                            isClearable={true}
                                            onChange={(e) => cambioVigencia(e)}
                                    ></Select>*/}
                                    </Form.Group>
                                    <Form.Group controlId="actualizado">
                                        <Form.Label>Documento Actualizado</Form.Label>
                                        <Form.Control name="actualizado" type="text" ref={register()} value={actual} disabled />
                                        {/*}
                                        <Select
                                            controlId="actualizado"
                                            placeholder="Selecciona una opción"
                                            className="basic-single"
                                            classNamePrefix="Select"
                                            name="actualizado"
                                            options={act}
                                            isClearable={true}
                                            onChange={(e) => cambioActualizado(e)}
                                ></Select>*/}
                                    </Form.Group>
                                    <Form.Group controlId="fechaAct">
                                        <Form.Label>Fecha de Actualización</Form.Label>
                                        <Form.Control name="fechaAct" type="text" ref={register()} velue={factualizacion} disabled />
                                    </Form.Group>
                                    <Form.Group controlId="pvInicial">
                                        <Form.Label>Periodo de Vigencia Inicial</Form.Label>
                                        <Form.Control name="pvInicial" type="text" ref={register()} pattern="[0-9]{4}" value={vIni} disabled />
                                    </Form.Group>
                                    <Form.Group controlId="pvFinal">
                                        <Form.Label>Periodo de Vigencia Final</Form.Label>
                                        <Form.Control name="pvFinal" type="text" ref={register()} pattern="[0-9]{4}" value={vFin} disabled />
                                    </Form.Group>
                                    <Form.Group controlId="armonizado">
                                        <Form.Label>Armonizado a la LGAHOTDU</Form.Label>
                                        <Form.Control name="armonizado" type="text" ref={register()} value={armoni} disabled />
                                        {/*}
                                        <Select
                                            controlId="armonizado"
                                            placeholder="Selecciona una opción"
                                            className="basic-single"
                                            classNamePrefix="Select"
                                            name="armonizado"
                                            options={armon}
                                            isClearable={true}
                                            onChange={(e) => cambioArmonizado(e)}
                                        ></Select>
                                        {*/}
                                    </Form.Group>
                                    <Form.Group controlId="formato">
                                        <Form.Label>Formato del Documento *</Form.Label>
                                        <Form.Control name="formato" type="text" ref={register()} value={formato} disabled />
                                        {/*}
                                        <Select
                                            id="formato1"
                                            controlId="formato"
                                            placeholder="Selecciona una opción"
                                            className="basic-single"
                                            classNamePrefix="Select"
                                            name="formato"
                                            options={formatoD}
                                            isClearable={true}
                                            onChange={(e) => cambioFormato(e)}
                                            required
                                        ></Select>
                            {*/}
                                        <p id="msj-formato" className="msj"></p>
                                    </Form.Group>
                                    <Form.Group controlId="pais">
                                        <Form.Label>País del Documento *</Form.Label>
                                        <Form.Control name="pais" type="text" ref={register()} value={pais} disabled />
                                        {/*}
                                        <Select
                                            id="pais"
                                            controlId="pais"
                                            placeholder="Selecciona una opción"
                                            className="basic-single"
                                            classNamePrefix="Select"
                                            name="pais"
                                            options={paisD}
                                            isClearable={true}
                                            onChange={(e) => cambioPais(e)}
                                            required
                                        ></Select>
                            {*/}
                                        <p id="msj-pais" className="msj"></p>
                                    </Form.Group>
                                    <Form.Group controlId="idioma">
                                        <Form.Label>Idioma del Documento *</Form.Label>
                                        <Form.Control name="idioma" type="text" ref={register()} value={idioma} disabled />
                                        {/*}
                                        <Select
                                            id="idioma"
                                            controlId="idioma"
                                            placeholder="Selecciona una opción"
                                            className="basic-single"
                                            classNamePrefix="Select"
                                            name="idioma"
                                            options={idiomaD}
                                            isClearable={true}
                                            onChange={(e) => cambioIdioma(e)}
                                            required
                                        ></Select>{*/}
                                        <p id="msj-idioma" className="msj"></p>
                                    </Form.Group>
                                    <Form.Group controlId="paginas">
                                        <Form.Label>Número de páginas *</Form.Label>
                                        <Form.Control name="paginas" type="text" ref={register()} value={paginas} disabled />
                                        <p id="msj-paginas" className="msj"></p>
                                    </Form.Group>
                                    <Form.Group controlId="palabrasC">
                                        <Form.Label>Palabras Clave *</Form.Label>
                                        <Form.Control name="palabrasC" type="text" ref={register()} value={claves} disabled />
                                        <p id="msj-palabras" className="msj"></p>
                                    </Form.Group>
                                    <Form.Group controlId="nomArchivo">
                                        <Form.Label>Nombre de Origen del Archivo *</Form.Label>
                                        <Form.Control name="nomArchivo" type="text" ref={register()} value={archivo} disabled />
                                        <p id="msj-nombreOrigen" className="msj"></p>
                                    </Form.Group>
                                </div>
                            </div>
                            <br></br>
                            {/*}
                            <div className="row text-center">
                                <div className="col-12">
                                    <Link href="/consulta-documental">
                                        <Button variant="outline-secondary" className="btn-admin">Regresar</Button>
                                    </Link>

                                </div>
                            </div>
                                    */}
                            <br></br>
                        </Form>
                        <div className="row text-center">
                            <div className="col-12">
                                <h5 className="msj">{msjError}</h5>
                            </div>
                        </div>
                    </div>
                </Container>
            </main>

        </>
    )
}
