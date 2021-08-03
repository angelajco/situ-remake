import {temas, periodicidades, getAmbitos, getPeriodo, getEntidades, getMunicipios, 
	getMetasAnualesByIdTablero, getMetasMensualesByIdTablero, getLocalidadesByIdEntidadAndIdMunicipio,getLocalidadesByTablero} from './Catalogos'
import Table from "./TableComponent"; 
import { Modal, Button, Form, Col, onChange, Tabs, Tab} from 'react-bootstrap';
import { useRef, useState, useEffect, PureComponent } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuthState } from '../../../context/context';

export default function ModalTabAdd(props) {
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
		setColExtra1([]);
	}, [props]);
	useEffect(() => {
		generateInfoTab();
		generaInfoGrafica();
	}, [metas]);

	function close() {
		props.refreshTabs()
		props.onClick()
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

	//PROPIEDADES GRAFICA
	const [dataGrafica, setDataGrafica] = useState([]);
	const [lineGrafica, setLineGrafica] = useState([]);
	async function generaInfoGrafica(){
		if (props.tableroSelect === undefined) return;
		const tablero = props.tableroSelect;
		const areas =  []
		tablero.estructuraFilas.split("|").sort().forEach(v=> {
			switch (tablero.ambito.toString()){
				case '5':
					let ent = entidades.find(f=> f.id_entidades===v)
					if(tablero.metas){
						areas.push({id:v,titulo:`Meta - ${ent.nombre_entidad}`,color:getNewColor()})
						areas.push({id:v,titulo:`Valor - ${ent.nombre_entidad}`,color:getNewColor()})
					}else{
						areas.push({id:v,titulo:ent.nombre_entidad,color:getNewColor()})
					}
					break
				case '9':
					let mun = municipios.find(f=> f.id_municipios===v)
					if(tablero.metas){
						areas.push({id:v,titulo:`Meta - ${mun.nombre_municipio}`,color:getNewColor()})
						areas.push({id:v,titulo:`Valor - ${mun.nombre_municipio}`,color:getNewColor()})
					}else{
						areas.push({id:v,titulo:mun.nombre_municipio,color:getNewColor()})
					}
					break
				case '17':
					let loc = localidades.find(f=> f.id_localidades===v)
					if(tablero.metas){
						areas.push({id:v,titulo:`Meta - ${loc.nombre_localidad}`,color:getNewColor()})
						areas.push({id:v,titulo:`Valor - ${loc.nombre_localidad}`,color:getNewColor()})
					}else{
						areas.push({id:v,titulo:loc.nombre_localidad,color:getNewColor()})
					}
					break
				default:
					if(tablero.metas){
						areas.push({id:v,titulo:`Meta - ${v}`,color:getNewColor()})
						areas.push({id:v,titulo:`Valor - ${v}`,color:getNewColor()})
					}else{
						areas.push({id:v,titulo:v,color:getNewColor()})
					}
			}
		});
		setLineGrafica(areas)
		const periodosAplica = periodicidades.filter((f) => f.periodo == tablero.periodicidad && f.value >= tablero.periodoInicial && f.value <= tablero.periodoFinal);
		let objectsData = [];
		periodosAplica.forEach(p=>{
			let objectData = {name:p.descripcion}
			areas.forEach(a=>{
				if(tablero.metas){
					objectData[`Meta - ${a.titulo}`] = 0
					objectData[`Valor - ${a.titulo}`] = 0
				}else{
					objectData[a.titulo] = 0
				}
			})
			objectsData.push(objectData);
		})
		console.log("periodosAplican",periodosAplica)
		console.log("objectsData",objectsData)
		metas.forEach(m=>{
			let periodo = periodicidades.find(f=> f.periodo == tablero.periodicidad && f.value==m.periodo)
			let extraeData = objectsData.find(f=> f.name==periodo.descripcion)
			switch (tablero.ambito.toString()){
				case '5':
					let ent = entidades.find(f=> f.id_entidades===m.area)
					if(tablero.metas){
						if(m.tipo==="V"){
							extraeData[`Valor - ${ent.nombre_entidad}`] = m.valor
						}else{
							extraeData[`Meta - ${ent.nombre_entidad}`] = m.valor
						}
					}else{
						extraeData[ent.nombre_entidad] = m.valor
					}
					break
				case '9':
					let mun = municipios.find(f=> f.id_municipios===m.area)
					if(tablero.metas){
						if(m.tipo==="V"){
							extraeData[`Valor - ${mun.nombre_municipio}`] = m.valor
						}else{
							extraeData[`Meta - ${mun.nombre_municipio}`] = m.valor
						}
					}else{
						extraeData[mun.nombre_municipio] = m.valor
					}
					break
				case '17':
					let loc = localidades.find(f=> f.id_localidades===m.area)
					if(tablero.metas){
						if(m.tipo==="V"){
							extraeData[`Valor - ${loc.nombre_localidad}`] = m.valor
						}else{
							extraeData[`Meta - ${loc.nombre_localidad}`] = m.valor
						}
					}else{
						extraeData[loc.nombre_localidad] = m.valor
					}
					break
				default:
					if(tablero.metas){
						if(m.tipo==="V"){
							extraeData[`Valor - ${m.area}`] = m.valor
						}else{
							extraeData[`Meta - ${m.area}`] = m.valor
						}
					}else{
						extraeData[m.area] = m.valor
					}
			}
		})
		setDataGrafica(objectsData);
	}
	function getNewColor(){
		var simbolos, color;
		simbolos = "0123456789ABCDEF";
		color = "#";
	
		for(var i = 0; i < 6; i++){
			color = color + simbolos[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	return (
		<>
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
							<Form.Control type="text" id="titulo" disabled value={((props.tableroSelect===undefined) ? '' : props.tableroSelect.titulo)} />
						</Form.Group>
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Tema</Form.Label>
								<Form.Control type="text" id="tema" disabled value={((props.tableroSelect===undefined) ? '' : props.tableroSelect.tema)} />
							</Form.Group>
							<Form.Group as={Col}>
								<Form.Label>SubTema</Form.Label>
								<Form.Control type="text" id="subtema" disabled value={((props.tableroSelect===undefined) ? '' : props.tableroSelect.subTema)} />
							</Form.Group>
						</Form.Row>
						<Form.Group>
							<Form.Label>Descripción</Form.Label>
							<Form.Control 
								as="textarea" 
								rows={3} 
								id="descripcion" 
								disabled 
								value={((props.tableroSelect===undefined) ? '' : props.tableroSelect.descripcion)}
							/>
						</Form.Group>
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Unidad</Form.Label>
								<Form.Control 
									type="text" 
									id="ambito" 
									disabled 
									value={((props.tableroSelect===undefined)? '' : props.tableroSelect.unidad)}
								/>
							</Form.Group>
							<Form.Group as={Col} className="text-center">
								<Form.Label></Form.Label>
								<Form.Check type="checkbox" label="Metas" id="metas" disabled checked={((props.tableroSelect===undefined) ? '' : props.tableroSelect.metas)} />
							</Form.Group>
							<Form.Group as={Col} className="text-center">
								<Form.Label></Form.Label>
								<Form.Check type="checkbox" label="¿Usa Porcentajes?" id="usaPorcentajes" disabled checked={((props.tableroSelect===undefined) ? '' : props.tableroSelect.usaPorcentajes)} />
							</Form.Group>
						</Form.Row>
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Periodo Inicial</Form.Label>
								<Form.Control 
									type="text" 
									id="periodoInicial" 
									disabled
									value={((props.tableroSelect===undefined) ? '' : periodicidades.find(e => e.periodo==props.tableroSelect.periodicidad && e.value==props.tableroSelect.periodoInicial).descripcion)}
								/>
							</Form.Group>
							<Form.Group as={Col}>
								<Form.Label>Periodo Final</Form.Label>
								<Form.Control 
									type="text" 
									id="periodoFinal" 
									disabled
									value={((props.tableroSelect===undefined) ? '' : periodicidades.find(e => e.periodo==props.tableroSelect.periodicidad && e.value==props.tableroSelect.periodoFinal).descripcion)}
								/>
							</Form.Group>
						</Form.Row>
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Periodicidad</Form.Label>
								<Form.Control 
									type="text" 
									id="periodicidad" 
									disabled
									value={((props.tableroSelect===undefined || ambitos.length==0) ? '' : periodo.find(e => e.id_pertab==props.tableroSelect.periodicidad).descripcion)}
								/>
							</Form.Group>
						</Form.Row>
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Ambito</Form.Label>
								<Form.Control
									type="text"
									id="ambito"
									disabled
									value={((props.tableroSelect === undefined || ambitos.length == 0) ? '' : ambitos.find(e => e.id == props.tableroSelect.ambito).descripcion)}
								/>
							</Form.Group>
						</Form.Row>
						<Form.Row>
							<Form.Group>
								Unidad:{unidad}
							</Form.Group>
						</Form.Row>
						<Form.Row>
							<Form.Group>
								<Table headers={headers} data={data} disabled={true} colExtra1={colExtra1}/>
							</Form.Group>
						</Form.Row>
					</Form>
					<ResponsiveContainer width="100%" height={400}>
        				<LineChart
						width={500}
						height={300}
						data={dataGrafica}
						margin={{top: 5,right: 30,left: 20,bottom: 5}}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="name" />
							<YAxis />
							<Tooltip />
							<Legend />
							{
								lineGrafica.map((value, index) => (
									<Line type="monotone" dataKey={value.titulo} stroke={value.color} />					
								))
							}
						</LineChart>
					</ResponsiveContainer>
				</Modal.Body>

				<Modal.Footer>
					<Button variant="secondary" onClick={() => close()}>Cerrar</Button>
				</Modal.Footer>

			</Modal>
		</>
	)
}