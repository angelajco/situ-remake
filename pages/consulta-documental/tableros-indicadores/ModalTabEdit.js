import { Modal, Button, Form, Col, onChange, Tabs, Tab } from 'react-bootstrap';
import { useRef, useState, useEffect } from "react";
import ModalComponent from '../../../components/ModalComponent';
import { temas, periodicidades, getAmbitos, getPeriodo } from './../../../components/Catalogos'
import { useAuthState } from '../../../context/context';
import axios from 'axios';

export default function ModalTabAdd(props) {
	//Datos Usuario
    const userDetails = useAuthState().user;
	let csrfToken = userDetails.csrfToken;
	
	const [modTotal] = useState(true)
	const [tablero,setTablero] = useState();
	//Modal mensajes
	const [show, setShow] = useState(false);
	const [datosModal, setDatosModal] = useState({
		title: '',
		body: ''
	});
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	//CONSTANTES
	const SELECCIONAR = "Seleccionar";
	const INGRESAR = "Ingresar";
	const INHABILITADO = "Inhabilitado";
	//CATALOGOS
	const [ambitos, setAmbitos] = useState([]);
	const [periodo, setPeriodo] = useState([]);
	async function handleAmbito() {
		setAmbitos(await getAmbitos())
	}
	async function handlePeriodo() {
		setPeriodo(await getPeriodo())
	}
	useEffect(() => {
		handleAmbito();
		handlePeriodo();
	}, []);

	function fillItemsPeriodoInicial(itemSelect) {
		var pInical = document.getElementById("periodoInicial");
		pInical.options.length = 0;
		var pFinal = document.getElementById("periodoFinal");
		pFinal.options.length = 0;
		periodicidades.filter((i) => i.periodo === itemSelect.target.value)
			.forEach(function (v) {
				var option = document.createElement("option");
				option.value = v.value;
				option.text = v.descripcion;
				pInical.add(option);

			});
		periodicidades.filter((i) => i.periodo === itemSelect.target.value)
			.forEach(function (v) {
				var option = document.createElement("option");
				option.value = v.value;
				option.text = v.descripcion;
				pFinal.add(option);
			});
	}
	function fillItemsPeriodoFinal(itemSelect) {
		var periodo = document.getElementById("periodicidad").value;
		var pFinal = document.getElementById("periodoFinal");
		pFinal.options.length = 0;
		periodicidades.filter((i) => i.periodo === periodo && itemSelect.target.value <= i.value)
			.forEach(function (v) {
				var option = document.createElement("option");
				option.value = v.value;
				option.text = v.descripcion;
				pFinal.add(option);
			});
	}

	function submitFormCaptura() {

		var obj = {
			//Se deja temporalmente
			idUsuario: 1,
			idTablero: 		(props.tableroSelect===undefined?0:props.tableroSelect.idTablero),
			titulo: 		document.getElementById("titulo").value,
			tema: 			document.getElementById("tema").value,
			subTema: 		document.getElementById("subTema").value,
			descripcion: 	document.getElementById("descripcion").value,
			unidad:			document.getElementById("unidad").value,
			ambito: 		document.getElementById("ambito").value,
			metas: 			document.getElementById("metas").checked,
			periodicidad: 	document.getElementById("periodicidad").value,
			periodoInicial: document.getElementById("periodoInicial").value,
			periodoFinal: 	document.getElementById("periodoFinal").value,
			usaPorcentajes: document.getElementById("usaPorcentajes").checked
		}
		//Validaciones de negocio
		console.log("obj", obj)
		if (!validacionesFormulario(obj)) {
			return;
		}
		let json = JSON.stringify(obj);
		let requestHeaders = { "Content-Type": "application/json" };
		requestHeaders[`${csrfToken.headerName}`] = csrfToken.token;
		let config = {
			method: "post",
			url: `${process.env.ruta}/wa/prot/tableros-indicadores/update`,
			withCredentials: true,
			headers: requestHeaders,
			data: json
		};
		console.log("config", config)
		axios(config)
			.then(function (response) {
				console.log(response)
				props.refreshTabs(true)
				props.onClick();
			})
			.catch(function (error) {
				handleShow();
				console.log(error)
				setDatosModal({ title: "Error!", body: "Error al procesar el registro" });
			});
	}
	function close() {
		props.refreshTabs()
		props.onClick()
	}
	function validacionesFormulario(object) {
		console.log(object)
		if (object.titulo === null || object.titulo === "") {
			setDatosModal({ title: "Advertencia!", body: "El campo titulo es obligatorio, favor verificar" });
			handleShow();
			return false;
		}
		if (object.periodicidad === null || object.periodicidad === "") {
			setDatosModal({ title: "Advertencia!", body: "El campo periodicidad es obligatorio, favor verificar" });
			handleShow();
			return false;
		}
		if (object.ambito === null || object.ambito === "") {
			setDatosModal({ title: "Advertencia!", body: "El campo ambito es obligatorio, favor verificar" });
			handleShow();
			return false;
		}
		return true;
	}

	return (
		<>
			{/*Construcción de modal para mensajes*/}
			<ModalComponent
				show={show}
				datos={datosModal}
				onHide={handleClose}
				onClick={handleClose}
			/>
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
					<Form id="formCapturaIndividual">
						<Form.Group>
							<Form.Label>Titulo</Form.Label>
							<Form.Control type="text" id="titulo" placeholder={INGRESAR} defaultValue={(props.tableroSelect===undefined?"":props.tableroSelect.titulo)} />
						</Form.Group>
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Tema</Form.Label>
								<Form.Control as="select" id='tema' defaultValue={(props.tableroSelect===undefined?"":props.tableroSelect.tema)} >
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
								<Form.Control type="text" placeholder={INGRESAR} id="subTema" defaultValue={(props.tableroSelect===undefined?"":props.tableroSelect.subTema)} />
							</Form.Group>
						</Form.Row>
						<Form.Group>
							<Form.Label>Descripción</Form.Label>
							<Form.Control as="textarea" rows={3} placeholder={INGRESAR} id="descripcion" defaultValue={(props.tableroSelect===undefined?"":props.tableroSelect.descripcion)} />
						</Form.Group>
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Unidad</Form.Label>
								<Form.Control type="text" placeholder={INGRESAR} id="unidad" defaultValue={(props.tableroSelect===undefined?"":props.tableroSelect.unidad)} />
							</Form.Group>
							<Form.Group as={Col} className="text-center">
								<Form.Label></Form.Label>
								<Form.Check type="checkbox" label="Metas" id="metas" defaultChecked={(props.tableroSelect===undefined?false:props.tableroSelect.metas)} disabled={modTotal}/>
							</Form.Group>
							<Form.Group as={Col} className="text-center">
								<Form.Label></Form.Label>
								<Form.Check type="checkbox" label="¿Usa Porcentajes?" id="usaPorcentajes" defaultChecked={(props.tableroSelect===undefined?false:props.tableroSelect.usaPorcentajes)} disabled={modTotal}/>
							</Form.Group>
						</Form.Row>
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Periodicidad</Form.Label>
								<Form.Control as="select" id="periodicidad" defaultValue={(props.tableroSelect===undefined?"":props.tableroSelect.periodicidad)}
									onChange={e => {
										fillItemsPeriodoInicial(e)
									}} disabled={modTotal}>
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
								<Form.Control as="select" id="periodoInicial" defaultValue={(props.tableroSelect===undefined?"":props.tableroSelect.periodoInicial)}
									onChange={e => {
										fillItemsPeriodoFinal(e)
									}} disabled={modTotal}>
									{
										periodicidades.filter((i) => i.periodo == (props.tableroSelect===undefined?"":props.tableroSelect.periodicidad)).map((value,index) =>(
											<option key={index} value={value.value}>
												{value.descripcion}
											</option>
										))
									}
								</Form.Control>
							</Form.Group>
							<Form.Group as={Col}>
								<Form.Label>Periodo Final</Form.Label>
								<Form.Control as="select" id="periodoFinal" defaultValue={(props.tableroSelect===undefined?"":props.tableroSelect.periodoFinal)} disabled={modTotal}>
									{
										periodicidades.filter((i) => 
												i.periodo == (props.tableroSelect===undefined?"":props.tableroSelect.periodicidad) && 
												(props.tableroSelect===undefined?"":props.tableroSelect.periodoInicial) <= i.value)
											.map((value,index) =>(
												<option key={index} value={value.value}>
													{value.descripcion}
												</option>
											))
									}
								</Form.Control>
							</Form.Group>
						</Form.Row>
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Ambito</Form.Label>
								<Form.Control as="select" id="ambito" defaultValue={(props.tableroSelect===undefined?"":props.tableroSelect.ambito)} disabled={modTotal}>
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