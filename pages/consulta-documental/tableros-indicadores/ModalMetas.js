import {temas, periodicidades, getAmbitos, getPeriodo, getEntidades, getMunicipios,
	getMetasAnualesByIdTablero, getMetasMensualesByIdTablero, getLocalidadesByTablero} from './../../../components/Catalogos'
import Table from "./TableComponent"; 
import { Modal, Button, Form, Col, onChange, Tabs, Tab} from 'react-bootstrap';
import { useRef, useState, useEffect } from "react";
import ModalComponent from '../../../components/ModalComponent';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory from 'react-bootstrap-table2-editor';
import { useAuthState } from '../../../context/context';
import axios from 'axios';

export default function ModalMetas(props) {
	//Datos Usuario
    const userDetails = useAuthState().user;
	let csrfToken = userDetails.csrfToken;
	//CATALOGOS
	const [metas, setMetas] = useState([]);
	const [ambitos, setAmbitos] = useState([]);
	const [periodo, setPeriodo] = useState([]);
	const [entidades, setEntidades] = useState([]);
	const [municipios, setMunicipios] = useState([]);
	const [localidades, setLocalidades] = useState([]);
	async function handleAmbito () { if(ambitos.length<1)setAmbitos(await getAmbitos())}
	async function handlePeriodo() { if(periodo.length<1)setPeriodo(await getPeriodo())}
	async function handleEntidades(){ if(entidades.length<1)setEntidades(await getEntidades())}
	async function handleMunicipios(){ if(municipios.length<1)setMunicipios(await getMunicipios())}
	async function handleLocalidades(){
		if (props.tableroSelect !== undefined) {
			if (props.tableroSelect.ambito.toString() === '17') {
				setLocalidades(await getLocalidadesByTablero(csrfToken,props.tableroSelect.idTablero))
			}
		}
	}
	async function handleLastMetas(){ 
		if(props.tableroSelect !== undefined){
			switch (props.tableroSelect.periodicidad) {
				case 1:
					setMetas(await getMetasAnualesByIdTablero(csrfToken,props.tableroSelect.idTablero))
					break;
				case 6:
					setMetas(await getMetasMensualesByIdTablero(csrfToken,props.tableroSelect.idTablero))
					break;
				default:
					setMetas([])
			}
		}
	}
	useEffect(() => {
		handleAmbito();
		handlePeriodo();
		handleEntidades();
		handleMunicipios();
		handleLocalidades();
		if(props.tableroSelect!==undefined)handleLastMetas();
		if(props.tableroSelect!==undefined)setUnidad(props.tableroSelect.unidad);
		//Se inicializan vacios para que no guarde propiedades
		setColExtra1([]);
	}, [props]);
	useEffect(() => {
		generateInfoTab();
	}, [metas]);
	//Modal mensajes
	const [show, setShow] = useState(false);
    const [datosModal, setDatosModal] = useState({title: '',body: ''});
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	
	async function submitFormCaptura(){
		if(props.tableroSelect===undefined)return;
		//Se crean los objetos con la información creada
		var finalData = [];
		let tab = props.tableroSelect
		data.forEach(function (value) {
			value.celdas.forEach(function (celda){
				let areaId;
				switch (props.tableroSelect.ambito.toString()) {
					case '5': // Estatal
						areaId = value.ambitoCompleto.id_entidades
						break;
					case '9': // Municipios
						areaId = value.ambitoCompleto.id_municipios
						break;
					case '17':// Localidades
						areaId = value.ambitoCompleto.id_localidades
						break;
					default:
						areaId = value.ambito
				}
				var data = {
					idTablero:	tab.idTablero,
					periodo:	celda.periodo,
					tipo:		celda.tipo,
					area:		areaId,
					valor: 		document.getElementById(celda.index).value
				}
				finalData.push(data)
			});
		});
		finalData = finalData.filter(f=> f.valor!=="");
		if(props.tableroSelect.usaPorcentajes){
			if(!validaPorcentaje(finalData)){
				return;
			}
		}
		let requestHeaders = { "Content-Type": "application/json" };
		requestHeaders[`${csrfToken.headerName}`] = csrfToken.token;
		switch (tab.periodicidad) {
			case 1:// Anual
				let jsonAnual = JSON.stringify(finalData);
				let configAnual = {
					method: "post",
					url: `${process.env.ruta}/wa/prot/celdas-anuales/insert`,
					withCredentials: true,
					headers: requestHeaders,
					data: jsonAnual
				};
				axios(configAnual)
					.then(function (response) {
						console.log(response)
						close();
					})
					.catch(function (error) {
						handleShow();
						console.log(error)
						setDatosModal({ title: "Error!", body: "Error al procesar el registro" });
					});
				break;
			case 6:// Mensual
				let jsonMensual = JSON.stringify(finalData);
				let configMensual = {
					method: "post",
					url: `${process.env.ruta}/wa/prot/celdas-mensuales/insert`,
					withCredentials: true,
					headers: requestHeaders,
					data: jsonMensual
				};
				axios(configMensual)
					.then(function (response) {
						console.log(response)
						close();
					})
					.catch(function (error) {
						handleShow();
						console.log(error)
						setDatosModal({ title: "Error!", body: "Error al procesar el registro" });
					});
				break;
				default:
		}
	}
	function validaPorcentaje(finalData){
		let validacion = true;
		const areas = [];
		finalData.forEach(a=>{
			if(!areas.includes(a.area)){
				areas.push(a.area)
			}
		})
		areas.forEach(area=>{
			let registros = finalData.filter(f=> f.area===area && f.tipo==='V')
			let total = 0;
			for(let reg of registros){
				total += Number(reg.valor)
			}
			if(total>100){
				setDatosModal({title: "Advertencia!",body: obtenDescripcionArea(area)+" sobrepasa el 100% en el valor, favor verificar"});
				handleShow();
				validacion = false;
            	return;	
			}
			if(props.tableroSelect.metas){
				registros = finalData.filter(f=> f.area===area && f.tipo==='M')
				total = 0;
				for(let regM of registros){
					total += Number(regM.valor)
				}
				if(total>100){
					setDatosModal({title: "Advertencia!",body: obtenDescripcionArea(area)+" sobrepasa el 100% en la meta, favor verificar"});
					handleShow();
					validacion = false;
					return;	
				}
			}
		})
		return validacion;
	}
	function obtenDescripcionArea(area){
		switch (props.tableroSelect.ambito.toString()) {
			case '5': // Estatal
				return "El estado "+(entidades.filter(f=> f.id_entidades===area))[0].nombre_entidad 
			case '9': // Municipios
				return "El municipio "+(municipios.filter(f=> f.id_municipios===area))[0].nombre_municipio
			case '17':// Localidades
				return "La localidad "+(localidades.filter(f=> f.id_localidades===area))[0].nombre_localidad
			default:
				return "El area "+area;
		}
	}
	function close(){
		props.refreshTabs();
		props.onClick();
	}

	//PROPIEDASDES TABLE
	const [data, setData] = useState([]);
	const [headers, setHeaders] = useState([]);
	const [unidad, setUnidad] = useState("");
	const [colExtra1,setColExtra1] = useState([]);
	async function generateInfoTab(){
		if (props.tableroSelect === undefined) return;
		//Variables y catalogos
		await handleLocalidades();
		let tab = props.tableroSelect
		let ambitoTab = ambitos.find((f) => f.id == tab.ambito);
		let periodosAplica = periodicidades.filter((f) => f.periodo == tab.periodicidad && f.value >= tab.periodoInicial && f.value <= tab.periodoFinal);
		//Empiza construcción del encabezado
		const encabezados = []
		if(tab.ambito.toString() === '9'){
			//Se agrega encabezado de Entidad
			encabezados.push('Entidad')
			encabezados.push(ambitoTab.descripcion)
			encabezados.push('Tipo')
		}else if(tab.ambito.toString() === '17'){
			//Se agrega encabezado de Entidad y Municipio
			encabezados.push('Entidad')
			encabezados.push('Municipio')
			encabezados.push(ambitoTab.descripcion)
			encabezados.push('Tipo')
		}else{
			encabezados.push(ambitoTab.descripcion)
			encabezados.push('Tipo')
		}
		periodosAplica.forEach(f=> encabezados.push(f.descripcion))
		setHeaders(encabezados)
		//Define la cantidad de Filas a crear
		var catAmbito;
		var idEntidades = [];
		var rowspanEnt = [];
		var newColumEnt = [];
		switch (tab.ambito.toString()) {
			case '0': // No definido
				catAmbito = tab.estructuraFilas.split("|").sort()
				break;
			case '1': // Nacional
				catAmbito = [tab.estructuraFilas]
				break;
			case '5': // Estatal
				catAmbito = [];
				tab.estructuraFilas.split("|").sort().forEach(v => {
					catAmbito.push(entidades.find(f => f.id_entidades === v))
				});
				break;
			case '9': // Municipios
				catAmbito = [];
				idEntidades = [];
				rowspanEnt = [];
				newColumEnt = [];
				//Se obtiene las entidades de cada uno de los id de registros
				tab.estructuraFilas.split("|").sort().forEach(v=> {
					idEntidades.push(v.substring(0, 2));
				});
				//Se obtiene la cantidad de veces que se encuentra duplicado
				idEntidades.forEach(function(entidad){
					rowspanEnt[entidad] = (rowspanEnt[entidad] || 0) + 1;
				});
				//Se crea aaray para la construcción de la columna extra
				for (const [key, value] of Object.entries(rowspanEnt)) {
					newColumEnt.push({
						idEntidad: key,
						numRow: value,
						descripcion: entidades.find(f=> f.id_entidades===key).nombre_entidad,
						municioInicial: municipios.find(f=> f.id_municipios === (tab.estructuraFilas.split("|").sort().find(v=> v.substring(0, 2)===key)))
					});
				}
				setColExtra1(newColumEnt);
				tab.estructuraFilas.split("|").sort().forEach(v => {
					catAmbito.push(municipios.find(f => f.id_municipios === v))
				});
				break;
			case '17':// Localidades
				catAmbito = [];
				idEntidades = [];
				rowspanEnt = [];
				newColumEnt = [];

				let idEntidadesMunicipios = [];
				let rowspanEntMun = [];
				//Se obtiene las entidades de cada uno de los id de registros
				tab.estructuraFilas.split("|").sort().forEach(v => {
					idEntidadesMunicipios.push(v.substring(0, 5));
				});
				//Se obtiene la cantidad de veces que se encuentra duplicado
				idEntidadesMunicipios.forEach(function (entMun) {
					rowspanEntMun[entMun] = (rowspanEntMun[entMun] || 0) + 1;
				});
				//Se crea aaray para la construcción de la columna extra
				for (const [key, value] of Object.entries(rowspanEntMun)) {
					newColumEnt.push({
						id: key,
						numRow: value,
						descripcionMunicipio: municipios.find(f => f.id_municipios === key).nombre_municipio,
						descripcionEntidad: municipios.find(f => f.id_municipios === key).nombre_entidad,
						locInicial: localidades.find(f => f.id_localidades === (tab.estructuraFilas.split("|").sort().find(v => v.substring(0, 5) === key )))
					});
				}
				setColExtra1(newColumEnt);
				tab.estructuraFilas.split("|").sort().forEach(v => {
					catAmbito.push(localidades.find(f => f.id_localidades === v))
				});
				break;
			default:
		}
		let data = [];
		catAmbito.forEach(amb=>{
			var f 
			var fila = {};
			switch (tab.ambito.toString()) {
				case '5': // Estatal
					fila['ambito'] = amb.nombre_entidad;
					f = amb.nombre_entidad;
					fila['ambitoCompleto'] = amb;
					break;
				case '9': // Municipios
					fila['ambito'] = amb.nombre_municipio;
					f = amb.nombre_municipio;
					fila['ambitoCompleto'] = amb;	
					break;
				case '17':// Localidades
					fila['ambito'] = amb.nombre_localidad;
					f = amb.nombre_localidad;
					fila['ambitoCompleto'] = amb;
					break;
				default:
					fila['ambito'] = amb;
					f = amb;
			}
			var f 
			var celdas = []
			if (tab.metas) {
				fila['rowSpanAmbito'] = '2';
				//Metas
				periodosAplica.forEach(p => {
					var celda = {
						tipo: "M",
						periodo: p.value,
						valor: '',
						index: p.value + '|M' + '|' + f
					}
					celdas.push(celda)
				})
				//Valores
				periodosAplica.forEach(p => {
					var celda = {
						tipo: "V",
						periodo: p.value,
						valor: '',
						index: p.value + '|V' + '|' + f
					}
					celdas.push(celda)
				})
			} else {
				fila['rowSpanAmbito'] = '1';
				//Valores
				periodosAplica.forEach(p => {
					var celda = {
						tipo: "V",
						periodo: p.value,
						valor: '',
						index: p.value + '|V' + '|' + f
					}
					celdas.push(celda)
				})
			}
			if (metas.length > 0) {
				switch (tab.ambito.toString()) {
					case '5': // Estatal
						metas.forEach(meta => {
							let descEntidad = entidades.find(f=> f.id_entidades===meta.area).nombre_entidad
							celdas.filter(f => f.index === `${meta.periodo}|${meta.tipo}|${descEntidad}`).forEach(celda => {
								celda['valor'] = meta.valor
							})
						})
						break;
					case '9': // Municipios
						metas.forEach(meta => {
							let descMunicipio = municipios.find(f => f.id_municipios === meta.area).nombre_municipio
							celdas.filter(f => f.index === `${meta.periodo}|${meta.tipo}|${descMunicipio}`).forEach(celda => {
								celda['valor'] = meta.valor
							})
						})
						break;
					case '17':// Localidades
						metas.forEach(meta => {
							let descLocalidad = localidades.find(f => f.id_localidades === meta.area).nombre_localidad
							celdas.filter(f => f.index === `${meta.periodo}|${meta.tipo}|${descLocalidad}`).forEach(celda => {
								celda['valor'] = meta.valor
							})
						})
						break;
					default:
						metas.forEach(meta => {
							celdas.filter(f => f.index === `${meta.periodo}|${meta.tipo}|${meta.area}`).forEach(celda => {
								celda['valor'] = meta.valor
							})
						})
				}
			}
			fila['celdas'] = celdas;
			data.push(fila);
		});
		setData(data)
	}
	return (
		<>
		 	{/*Construcción de modal para mensajes*/}
			 <ModalComponent show={show} datos={datosModal} onHide={handleClose} onClick={handleClose}/>
			 
			<Modal 
			show={props.show} 
			onHide={() => props.onHide()} 
			backdrop="static" 
			centered
			contentClassName="custom-modal-tablero-indicadores-style"
			>
				
				<Modal.Header closeButton>
					<Modal.Title>Metas</Modal.Title>
				</Modal.Header>
				
				<Modal.Body>
					<Form>
						<Form.Group>
							Unidad:{unidad}
						</Form.Group>
						<Form.Group>
							<Table headers={headers} data={data} disabled={false} colExtra1={colExtra1}/>
                        </Form.Group>
					</Form>
				</Modal.Body>
				
				<Modal.Footer>
					<Button variant="secondary" onClick={() => close()}>Cerrar</Button>
					<Button variant="primary" onClick={() => submitFormCaptura()}>Guardar</Button>
				</Modal.Footer>

			</Modal>
		</>
	)
}