import { Modal, Button, Form, Col, onChange, Tabs, Tab} from 'react-bootstrap';
import { useRef, useState, useEffect, useCallback} from "react";
import ModalComponent from '../../../components/ModalComponent';
import { useAuthState } from '../../../context/context';
import {temas, periodicidades, getAmbitos, getPeriodo, getEntidades, getMunicipios, getLocalidades,
	 getLocalidadesByIdEntidadAndIdMunicipio} from './../../../components/Catalogos'
import BootstrapTable from 'react-bootstrap-table-next';
import axios from 'axios';

export default function ModalTabAdd(props) {
	//Datos Usuario
    const userDetails = useAuthState().user;
    let csrfToken = userDetails.csrfToken;
	//Modal mensajes
	const [show, setShow] = useState(false);
    const [datosModal, setDatosModal] = useState({title: '',body: ''});
	const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
	//CONSTANTES
	const SELECCIONAR = "Seleccionar";
	const INGRESAR = "Ingresar";
	const INHABILITADO = "Inhabilitado";
	//CATALOGOS
	const [ambitos, setAmbitos] = useState([]);
	const [periodo, setPeriodo] = useState([]);
	const [entidades, setEntidades] = useState([]);
	const [municipios, setMunicipios] = useState([]);
	const [localidades, setLocalidades] = useState([]);
	async function handleAmbito () { if(ambitos.length<1)setAmbitos(await getAmbitos())}
	async function handlePeriodo() { if(periodo.length<1)setPeriodo(await getPeriodo())}
	async function handleEntidades(){ if(entidades.length<1)setEntidades(await getEntidades())}
	async function handleMunicipios(){ if(municipios.length<1)setMunicipios(await getMunicipios())}
	useEffect(() => {
		handleAmbito();
		handlePeriodo();
		handleEntidades();
		handleMunicipios();
		setFileName("Archivo...");
		setTabSelect("individual");
		setShowSelectArea(null);
		setShowSelectArea2(null);
		setAreas([]);
	}, [props]);
	
	//actualización
	function fillItemsPeriodoInicial(itemSelect){
		let pInical = document.getElementById("periodoInicial");
		pInical.options.length = 0;
		let pFinal = document.getElementById("periodoFinal");
		pFinal.options.length = 0;
    	periodicidades.filter((i) => i.periodo === itemSelect.target.value)
				.forEach(function(v){
					var option = document.createElement("option");
					option.value = v.value;
					option.text = v.descripcion;
					pInical.add(option);
					
				});
		periodicidades.filter((i) => i.periodo === itemSelect.target.value)
				.forEach(function(v){
					var option = document.createElement("option");
					option.value = v.value;
					option.text = v.descripcion;
					pFinal.add(option);
				});
  	}
	function fillItemsPeriodoFinal(itemSelect){
		let periodo = document.getElementById("periodicidad").value;
		let pFinal = document.getElementById("periodoFinal");
		pFinal.options.length = 0;
		periodicidades.filter((i) => i.periodo === periodo && itemSelect.target.value<=i.value)
				.forEach(function(v){
					var option = document.createElement("option");
					option.value = v.value;
					option.text = v.descripcion;
					pFinal.add(option);
				});	
	}
	//Ambito y grid
	const [showSelectArea, setShowSelectArea] = useState(null);
	const [showSelectArea2, setShowSelectArea2] = useState(null);
	const [areas, setAreas] = useState([]);
	const [area, setArea] = useState();
	useEffect(() => {
		if(area!==undefined){
			if(area===""){
				setDatosModal({ title: "Advertencia!", body: "No se permiten vacios, favor verificar" });
				handleShow();
				return;
			}
			const duplicado = areas.filter(f=> f.area==area);
			if (duplicado.length>=1) {
				setDatosModal({ title: "Advertencia!", body: "El valor capturado ya se encuentra registrado, favor verificar" });
				handleShow();
				return;
			}else{
				switch (document.getElementById("ambito").value) {
					case '0': // No definido
						setAreas((oldAreas) => ([...oldAreas, { area: area }]));
						setArea();
						break;
					case '1': // Nacional
						break;
					case '5': // Estatal
						console.log("Area",area)
						const duplicadoE = areas.filter(f => f.id == area.id_entidades && f.area == area.nombre_entidad);
						if (duplicadoE.length >= 1) {
							setDatosModal({ title: "Advertencia!", body: "El valor ya fue seleccionado, favor verificar" });
							handleShow();
							return;
						} else {
							setAreas((oldAreas) => ([...oldAreas, { id:area.id_entidades, area: area.nombre_entidad }]));
							setArea();
						}
						break;
					case '9': // Municipios
						console.log("Area",area)
						const duplicadoM = areas.filter(f => f.id == area.id_municipios && f.area == area.nombre_municipio);
						if (duplicadoM.length >= 1) {
							setDatosModal({ title: "Advertencia!", body: "El valor ya fue seleccionado, favor verificar" });
							handleShow();
							return;
						} else {
							setAreas((oldAreas) => ([...oldAreas, { id:area.id_municipios, area: area.nombre_municipio }]));
							setArea();
						}
						break;
					case '17':
						console.log("Area",area)
						const duplicadoL = areas.filter(f => f.id == area.id_localidades && f.area == area.nombre_localidad);
						if (duplicadoL.length >= 1) {
							setDatosModal({ title: "Advertencia!", body: "El valor ya fue seleccionado, favor verificar" });
							handleShow();
							return;
						} else {
							setAreas((oldAreas) => ([...oldAreas, { id:area.id_localidades, area: area.nombre_localidad }]));
							setArea();
						}
						break;
					default:
				}
			}
		}	
	}, [area]);
	
	async function fillAmbito(itemSelect){
		setAreas([]);
		setShowSelectArea(null);
		setShowSelectArea2(null);
		switch (itemSelect.target.value) {
			case '0': // No definido
				setShowSelectArea(
					<Form.Group as={Col}>
						<Form.Group>
							<Form.Control type="text" id="NoDefinido" placeholder={INGRESAR} />
						</Form.Group>
						<Form.Group as={Col} className="text-right">
							<Button variant="secondary"
								onClick={() => { const a = document.getElementById("NoDefinido").value; setArea(a); document.getElementById("NoDefinido").value = "" }
								}>Agregar</Button>
						</Form.Group>
					</Form.Group>
				);
				break;
			case '1': // Nacional
				setAreas([{ area: "México" }])
				break;
			case '5': // Estatal
				setShowSelectArea(
					<Form.Group as={Col}>
						<div className="scrollTable">
							<BootstrapTable
								bootstrap4
								keyField='id_entidades'
								data={entidades}
								columns={columnAddEstado}
								noDataIndication="No hay valores disponibles"
								selectRow={selectRowAdd}
							/>
						</div>
					</Form.Group>
				);
				break;
			case '9': // Municipios
				setShowSelectArea(
					<Form.Group as={Col}>
						<Form.Group>
							<Form.Label>Entidad</Form.Label>
							<Form.Control as="select" id='entidad9' defaultValue=""
								onChange={e => { fillEstadoSelect9(e) }}>
								<option value="" disabled>{SELECCIONAR}</option>
								{
									entidades.map((value, index) => (
										<option key={index} value={value.id_entidades}>
											{value.nombre_entidad}
										</option>
									))
								}
							</Form.Control>
						</Form.Group>
					</Form.Group>
				);
				setShowSelectArea2(
					null
				);
				break;
			case '17':// Localidad
				setShowSelectArea(
					<Form.Group as={Col}>
						<Form.Group>
							<Form.Label>Entidad</Form.Label>
							<Form.Control as="select" id='entidad17' defaultValue=""
								onChange={e => { fillEstadoSelect17(e) }}>
								<option value="" disabled>{SELECCIONAR}</option>
								{
									entidades.map((value, index) => (
										<option key={index} value={value.id_entidades}>
											{value.nombre_entidad}
										</option>
									))
								}
							</Form.Control>
						</Form.Group>
						<Form.Group>
							<Form.Label>Municipio</Form.Label>
							<Form.Control as="select" id='municipio17' defaultValue=""
								onChange={e => { fillMunicipioSelect17(e) }}>
								<option value="" disabled>{SELECCIONAR}</option>
							</Form.Control>
						</Form.Group>
					</Form.Group>
				);
				setShowSelectArea2(
					null
				);
				break;
			default:
				setShowSelectArea(null);
		}
	}
	
	//Comportamientos de selección en las tablas
	const selectRowRemove = {
		mode: 'checkbox',
		clickToSelect: true,
		hideSelectColumn: true,
		onSelect: (row, isSelect, rowIndex, e) => {
			switch (document.getElementById("ambito").value) {
				case '0': // No definido
					setAreas(areas.filter(f => f !== row))
					break;
				case '1': // Nacional
					break;
				case '5': // Estatal
					setAreas(areas.filter(f => f !== row))
					break;
				case '9': // Municipios
					setAreas(areas.filter(f => f !== row))
					break;
				case '17':// Localidad
					setAreas(areas.filter(f => f !== row))
					break;
				default:
			}
		}
	}
	const selectRowAdd = {
		mode: 'checkbox',
		clickToSelect: true,
		hideSelectColumn: true,
		onSelect: (row, isSelect, rowIndex, e) => {
			switch (document.getElementById("ambito").value) {
				case '0': // No definido
					break;
				case '1': // Nacional
					break;
				case '5': // Estatal
					setArea(row);
					break;
				case '9': // Municipios
					setArea(row);
					break;
				case '17':// Localidad
					setArea(row);
					break;
				default:
			}
		}
	}
	//Construcciones de columnas
	const columns = [{
		dataField: 'area',
		text: 'Lista Áreas',
		sort: true,
		headerAlign: 'center',
		formatter: cell => <div className="d-flex justify-content-center">{cell}</div>
	}];
	const columnAddEstado = [{
		dataField: 'nombre_entidad',
		text: 'Estados',
		sort: true,
		headerAlign: 'center',
		formatter: cell => <div className="d-flex justify-content-center">{cell}</div>
	}];
	const columnAddMunicipio = [{
		dataField: 'nombre_municipio',
		text: 'Municipios',
		sort: true,
		headerAlign: 'center',
		formatter: cell => <div className="d-flex justify-content-center">{cell}</div>
	}];
	const columnAddLocalidad = [{
		dataField: 'nombre_localidad',
		text: 'Localidades',
		sort: true,
		headerAlign: 'center',
		formatter: cell => <div className="d-flex justify-content-center">{cell}</div>
	}];
	//Metodos de Combobox para ir filtrando
	const  fillEstadoSelect9 = (e) => {
		setShowSelectArea2(
					<TableMunicipios 
						areasSelect={municipios.filter(f=> f.cve_ent===e.target.value)} 
						columnAddMunicipio={columnAddMunicipio}
						selectRowAdd={selectRowAdd}
					/>
				);
	}
	async function fillEstadoSelect17 (e) {
		let cbMunicipio = document.getElementById("municipio17");
		cbMunicipio.options.length = 0;
		municipios.filter(f=> f.cve_ent===e.target.value)
				.forEach(function(v){
					var option = document.createElement("option");
					option.value = v.cve_mun;
					option.text = v.nombre_municipio;
					cbMunicipio.add(option);
				});
	}
	async function fillMunicipioSelect17 (e) {
		let entidad = document.getElementById("entidad17").value;
		const loc = (await getLocalidadesByIdEntidadAndIdMunicipio(entidad,e.target.value));
		setLocalidades(loc);
		setShowSelectArea2(
					<TableLocalidades 
						areasSelect={loc} 
						columnAddLocalidad={columnAddLocalidad}
						selectRowAdd={selectRowAdd}
					/>
				);
	}
		
	//Carga de archivo
	const [fileName, setFileName] = useState("Archivo...");
	function cargarArchivo(e){
		setFileName(e.target.files[0].name);
	}
	const [tabSelect, setTabSelect] = useState("individual");
	function handleTabSelect (key) {setTabSelect(key)}
	
	//Funciones del Footer
	function close(){
		props.refreshTabs();
		props.onClick();
	}
	function submitFormCaptura(){
		if(tabSelect==="individual"){
			let builderAreas
			areas.forEach(function (val, ind, arr) {
				switch (document.getElementById("ambito").value) {
					case '5': // Estatal
					case '9': // Municipios
					case '17':// Localidades
						ind === 0 ?builderAreas = val.id : builderAreas = builderAreas + "|" + val.id
						break;
					default:
						ind === 0?
							builderAreas = val.area.trim()
							:builderAreas = builderAreas + "|" + val.area.trim()
				}
			});
			var obj = {
				//Se deja temporalmente
				idUsuario		:userDetails.id,
				titulo			:document.getElementById("titulo").value,
				tema			:document.getElementById("tema").value,
				subTema			:document.getElementById("subTema").value,
				descripcion		:document.getElementById("descripcion").value,
				unidad			:document.getElementById("unidad").value,
				ambito			:document.getElementById("ambito").value,
				metas			:document.getElementById("metas").checked,
				periodicidad	:document.getElementById("periodicidad").value,
				periodoInicial	:document.getElementById("periodoInicial").value,
				periodoFinal	:document.getElementById("periodoFinal").value,
				usaPorcentajes	:document.getElementById("usaPorcentajes").checked,
				estructuraFilas	:builderAreas
			}
			//Validaciones de negocio
			console.log("obj",obj)
			if(!validacionesFormulario(obj)){
				return;
			}
			let json = JSON.stringify(obj);
			let requestHeaders = { "Content-Type": "application/json" };
			requestHeaders[`${csrfToken.headerName}`] = csrfToken.token;
			let config = {
				method: "post",
				url: `${process.env.ruta}/wa/prot/tableros-indicadores/insert`,
				withCredentials: true,
				headers: requestHeaders,
				data: json
			};
			console.log("config",config)
			axios(config)
				.then(function (response) {
					console.log(response)
					close();
				})
				.catch(function (error) {
					handleShow();
					console.log(error)
					setDatosModal({ title: "Error!", body: "Error al procesar el registro" });
				});
		}else if(tabSelect==="masiva"){
			
		}
		
	}
	function validacionesFormulario(object){
		console.log(object)
		if (object.titulo === null || object.titulo === ""){
			setDatosModal({title: "Advertencia!",body: "El campo titulo es obligatorio, favor verificar"});
			handleShow();
            return false;
		}
		if (object.periodicidad === null || object.periodicidad === ""){
			setDatosModal({title: "Advertencia!",body: "El campo periodicidad es obligatorio, favor verificar"});
			handleShow();
			return false;
		}
		if (object.ambito === null || object.ambito === ""){
			setDatosModal({title: "Advertencia!",body: "El campo ambito es obligatorio, favor verificar"});
			handleShow();
			return false;
		}
		if (areas.length<1){
			setDatosModal({title: "Advertencia!",body: "No se ha seleccionada ningun area, favor verificar"});
			handleShow();
			return false;
		}
		return true;
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
					<Modal.Title>Tablero de Indicadores</Modal.Title>
				</Modal.Header>
				
				<Modal.Body>
				<Tabs defaultActiveKey="individual" id="controlled-tab-example" className="flex-row" onSelect={handleTabSelect}>
				<Tab eventKey="individual" title="Individual">
						<Form id="formCapturaIndividual">
							<Form.Group>
								<Form.Label>Titulo</Form.Label>
								<Form.Control type="text" id="titulo" placeholder={INGRESAR} />
							</Form.Group>
							<Form.Row>
								<Form.Group as={Col}>
									<Form.Label>Tema</Form.Label>
									<Form.Control as="select" id='tema' defaultValue="">
										<option value="" disabled>{SELECCIONAR}</option>
										{
											temas.map((value, index) => (
												<option key={index} value={value.value}>
												{value.descripcion}
												</option>
											))
										}
									</Form.Control>
								</Form.Group>
								<Form.Group as={Col}>
									<Form.Label>SubTema</Form.Label>
									<Form.Control type="text" placeholder={INGRESAR} id="subTema"/>
								</Form.Group>
							</Form.Row>
							<Form.Group>
								<Form.Label>Descripción</Form.Label>
								<Form.Control as="textarea" rows={3} placeholder={INGRESAR} id="descripcion" />
							</Form.Group>
							<Form.Row>
								<Form.Group as={Col}>
									<Form.Label>Unidad</Form.Label>
									<Form.Control type="text" placeholder={INGRESAR} id="unidad"/>
								</Form.Group>
								<Form.Group as={Col} className="text-center">
									<Form.Label></Form.Label>
									<Form.Check type="checkbox" label="Metas" id="metas"/>
								</Form.Group>
								<Form.Group as={Col} className="text-center">
									<Form.Label></Form.Label>
									<Form.Check type="checkbox" label="¿Usa Porcentajes?" id="usaPorcentajes"/>
								</Form.Group>
							</Form.Row>
							<Form.Row>
								<Form.Group as={Col}>
									<Form.Label>Periodicidad</Form.Label>
									<Form.Control as="select" id="periodicidad" defaultValue=""
										onChange={e => {fillItemsPeriodoInicial(e)}}>
										<option value="" disabled>{SELECCIONAR}</option>
										{
											periodo.map((value, index) => (
												<option key={index} value={value.id_pertab}>
												{value.descripcion}
												</option>
											))
										}
									</Form.Control>
								</Form.Group>
								<Form.Group as={Col}>
									<Form.Label>Periodo Inicial</Form.Label>
									<Form.Control as="select" id="periodoInicial" defaultValue=""
										onChange={e => {
											fillItemsPeriodoFinal(e)
										}}>
										<option value="" disabled>{INHABILITADO}</option>
									</Form.Control>
								</Form.Group>
								<Form.Group as={Col}>
									<Form.Label>Periodo Final</Form.Label>
									<Form.Control as="select" id="periodoFinal" defaultValue="">
										<option value="" disabled>{INHABILITADO}</option>
									</Form.Control>
								</Form.Group>
							</Form.Row>
							<Form.Row>
								<Form.Group as={Col}>
									<Form.Label>Ambito</Form.Label>
									<Form.Control as="select" id="ambito" defaultValue=""
										onChange={e => {
											fillAmbito(e)
										}}>
										<option value="" disabled>{SELECCIONAR}</option>
										{
											ambitos.map((value, index) => (
												<option key={index} value={value.id}>
												{value.descripcion}
												</option>
											))
										}
									</Form.Control>
								</Form.Group>
							</Form.Row>
							<Form.Row>
								{showSelectArea}
								{showSelectArea2}
								<Form.Group as={Col} className="text-center">
									<div className="scrollTable">
										<BootstrapTable 
											bootstrap4 
											keyField='area'
											data={areas}
											columns={columns} 
											noDataIndication="No se han agregado Áreas"
											selectRow={selectRowRemove}
										/>
									</div>
								</Form.Group>
							</Form.Row>
						</Form>
					</Tab>

				<Tab eventKey="masiva" title="Masiva">
						<Form id="formCapturaMasiva">
							<Form.Row>
								<Form.Group as={Col}>
									<Form.Label>Carga Masiva</Form.Label>
									<Form.File 
										id="cargaArchivo1"
										label={fileName}
										onChange={(e) => cargarArchivo(e)}
										data-browse="Busqueda"
										custom
									/>
								</Form.Group>
								<Form.Group as={Col} className="text-center">
									<Form.Label></Form.Label>
								</Form.Group>
							</Form.Row>
						</Form>
					</Tab>
				</Tabs>
				</Modal.Body>
				
				<Modal.Footer>
					<Button variant="secondary" onClick={() => close()}>Cerrar</Button>
					<Button variant="primary" onClick={() => submitFormCaptura()}>Guardar</Button>
				</Modal.Footer>

			</Modal>
		</>
	)
}

const TableMunicipios = ({ areasSelect, columnAddMunicipio, selectRowAdd}) => {
	return (
		<Form.Group as={Col}>
			<div className="scrollTable">
				<BootstrapTable
					bootstrap4
					keyField='id_municipios'
					data={areasSelect}
					columns={columnAddMunicipio}
					noDataIndication="No hay valores disponibles"
					selectRow={selectRowAdd}
				/>
			</div>
		</Form.Group>
	);
};
const TableLocalidades = ({ areasSelect, columnAddLocalidad, selectRowAdd}) => {
	return (
		<Form.Group as={Col}>
			<div className="scrollTable">
				<BootstrapTable
					bootstrap4
					keyField='id_localidades'
					data={areasSelect}
					columns={columnAddLocalidad}
					noDataIndication="No hay valores disponibles"
					selectRow={selectRowAdd}
				/>
			</div>
		</Form.Group>
	);
};