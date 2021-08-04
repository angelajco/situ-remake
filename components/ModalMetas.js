import { Modal, Button, Form, Col, onChange, Tabs, Tab } from 'react-bootstrap';
import { useRef, useState, useEffect } from "react";
import ModalComponent from './ModalComponent';
import axios from 'axios';

export default function ModalTableroIndicadores(props) {
	//Modal mensajes
	const [show, setShow] = useState(false);
    const [datosModal, setDatosModal] = useState(
        {
            title: '',
            body: ''
        }
    );
	const handleClose = () => setShow(false);
	const handleShow = () => {setShow(true)};
	
	//CONSTANTES
	const SELECCIONAR = "Seleccionar";
	const INGRESAR = "Ingresar";
	const INHABILITADO = "Inhabilitado";

	//CATALOGOS
	const [tableros, setTableros] = useState([]);
	useEffect(() => {
		// Se deja el objeto basio hasta ver el tema de los usuarios :P
		var tablero = {
		};
		let json = JSON.stringify(tablero);
		let config = {
			method: "post",
			url: `${process.env.ruta}/tableros-indicadores/getByFilter`,
			headers: {
				"Content-Type": "application/json"
			},
			data: json
		};
		axios(config)
			.then(function (response) {
				var data = response.data;
				data.sort((a, b) => (a.idTablero > b.idTablero) ? 1 : ((b.idTablero > a.idTablero) ? -1 : 0))
				setTableros(data)
			})
			.catch(function (error) {
				console.log(error)
			});
	//}
	}, []);
	
	const PERIODICIDADES = [
		{periodo:"1",value:"2021",descripcion:"2021"},
		
		{periodo:"Semestre",value:"20211",descripcion:"Primer Semestre 2021"},
		{periodo:"Semestre",value:"20212",descripcion:"Segundo Semestre 2021"},
		
		{periodo:"Trimestre",value:"202101",descripcion:"Primer Trimeste 2021"},
		{periodo:"Trimestre",value:"202102",descripcion:"Segundo Trimeste 2021"},
		{periodo:"Trimestre",value:"202103",descripcion:"Tercero Trimeste 2021"},
		{periodo:"Trimestre",value:"202104",descripcion:"Cuarto Trimeste 2021"},
		         
		{periodo:"6",value:"202101",descripcion:"Enero 2021"},
		{periodo:"6",value:"202102",descripcion:"Febrero 2021"},
		{periodo:"6",value:"202103",descripcion:"MArzo 2021"},
		{periodo:"6",value:"202104",descripcion:"Abril 2021"},
		{periodo:"6",value:"202105",descripcion:"Mayo 2021"},
		{periodo:"6",value:"202106",descripcion:"Junio 2021"},
		{periodo:"6",value:"202107",descripcion:"Julio 2021"},
		{periodo:"6",value:"202108",descripcion:"Agosto 2021"},
		{periodo:"6",value:"202109",descripcion:"Septiembre 2021"},
		{periodo:"6",value:"202110",descripcion:"Octubre 2021"},
		{periodo:"6",value:"202111",descripcion:"Noviembre 2021"},
		{periodo:"6",value:"202112",descripcion:"Diciembre 2021"},
	];
	const TIPO = [
		{value:"V",descripcion:"Valor"},
		{value:"M",descripcion:"Meta"}
	];
	const AREA = [
		{value:"E",descripcion:"E"},
		{value:"M",descripcion:"M"},
		{value:"L",descripcion:"L"},
		{value:"AR",descripcion:"AR"},
		{value:"AU",descripcion:"AU"},
		{value:"MZ",descripcion:"MZ"},
		{value:"ZM",descripcion:"ZM"}
	];

	function onChangeTablero(itemSelect){
		const tableroSelect = tableros.find(e => e.idTablero==itemSelect.target.value);
		console.log("item",tableroSelect)

		var periodo = document.getElementById("periodo");
		periodo.options.length = 0;
		
		PERIODICIDADES.filter((i) => 
				i.periodo == tableroSelect.periodicidad && 
				i.value >= tableroSelect.periodoInicial &&
				i.value <= tableroSelect.periodoFinal
			)
				.forEach(function(v){
					var option = document.createElement("option");
					option.value = v.value;
					option.text = v.descripcion;
					periodo.add(option);
					
				});
	}
	
	//Carga de archivo
	const [fileName, setFileName] = useState("Archivo...");

	function submitFormCaptura(){
		var obj = {
			idTablero		:document.getElementById("tablero").value,
			periodo			:document.getElementById("periodo").value,
			tipo			:document.getElementById("tipo").value,
			area			:document.getElementById("area").value,
			valor			:document.getElementById("valor").value
		}
		//Validaciones de negocio
		console.log("obj",obj)
		if(!validacionesFormulario(obj)){
			return;
		}
		var tableroSelect = tableros.find(e => e.idTablero==obj.idTablero);
		let json = JSON.stringify(obj);
		if("1" == tableroSelect.periodicidad){
			 let config = {
                method: "post",
                url: `${process.env.ruta}/celdas-anuales/insert`,
                headers: {
                    "Content-Type": "application/json"
                },
                data: json
			};
			axios(config)
                .then(function (response) {
                    console.log(response)
					props.onClick();            
                })
                .catch(function (error) {
					handleShow();
                    console.log(error)
					setDatosModal({title: "Error!",body: "Error al procesar el registro"});
                });
		}else{
			let config = {
                method: "post",
                url: `${process.env.ruta}/celdas-mensuales/insert`,
                headers: {
                    "Content-Type": "application/json"
                },
                data: json
			};
			axios(config)
                .then(function (response) {
                    console.log(response)
					props.onClick();            
                })
                .catch(function (error) {
					handleShow();
                    console.log(error)
					setDatosModal({title: "Error!",body: "Error al procesar el registro"});
                });
		}
		
	}
	function validacionesFormulario(object){
		if (object.idTablero === null || object.idTablero === ""){
			setDatosModal({title: "Advertencia!",body: "El campo Tablero es obligatorio, favor verificar"});
			handleShow();
            return false;
		}
		if (object.periodo === null || object.periodo === ""){
			setDatosModal({title: "Advertencia!",body: "El campo Periodo es obligatorio, favor verificar"});
			handleShow();
            return false;
		}
		if (object.tipo === null || object.tipo === ""){
			setDatosModal({title: "Advertencia!",body: "El campo Tipo es obligatorio, favor verificar"});
			handleShow();
            return false;
		}
		if (object.area === null || object.area === ""){
			setDatosModal({title: "Advertencia!",body: "El campo Area es obligatorio, favor verificar"});
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
					<Modal.Title>Metas</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<Tabs defaultActiveKey="individual" id="controlled-tab-example" className="flex-row">
					<Tab eventKey="individual" title="Individual">
						<Form id="formCaptura">
							<Form.Row>
								<Form.Group as={Col}>
									<Form.Label>Tablero</Form.Label>
									<Form.Control as="select" id="tablero" onChange={e => onChangeTablero(e)}>
										<option value="" selected disabled>{SELECCIONAR}</option>
										{
											tableros.map((value, index) => (
												<option key={index} value={value.idTablero}>
												{value.idTablero+" - "+value.titulo}
												</option>
											))
										}
									</Form.Control>
								</Form.Group>
								<Form.Group as={Col}>
									<Form.Label>Periodo</Form.Label>
									<Form.Control as="select" id="periodo">
										<option value="" selected disabled>{INHABILITADO}</option>
									</Form.Control>
								</Form.Group>
							</Form.Row>
							<Form.Row>
								<Form.Group as={Col}>
									<Form.Label>Tipo</Form.Label>
									<Form.Control as="select" id="tipo">
										<option value="" selected disabled>{SELECCIONAR}</option>
										{
											TIPO.map((value, index) => (
												<option key={index} value={value.value}>
												{value.descripcion}
												</option>
											))
										}
									</Form.Control>
								</Form.Group>
								<Form.Group as={Col}>
									<Form.Label>Area</Form.Label>
									<Form.Control as="select" id="area">
										<option value="" selected disabled>{SELECCIONAR}</option>
										{
											AREA.map((value, index) => (
												<option key={index} value={value.value}>
												{value.descripcion}
												</option>
											))
										}
									</Form.Control>
								</Form.Group>
								<Form.Group as={Col}>
									<Form.Label>Valor</Form.Label>
									<Form.Control type="text" id="valor" placeholder={INGRESAR}
										onChange={e => {
											document.getElementById("valor").value = e.target.value.replace(/[^\d+(\.\d{1,2})$]/g, '')
										}}/>
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
										onChange={(e) => setFileName(e.target.files[0].name)}
										data-browse="Busqueda"
										custom
									/>
								</Form.Group>
								<Form.Group as={Col} className="text-center">
									<Form.Label></Form.Label>
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
					<Button variant="secondary" onClick={() => props.onClick()}>Cerrar</Button>
					<Button variant="primary" onClick={() => submitFormCaptura()}>Guardar</Button>
				</Modal.Footer>

			</Modal>
		</>
	)
}