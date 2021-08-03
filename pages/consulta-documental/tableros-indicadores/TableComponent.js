import { Modal, Button, Form, Col, onChange, Tabs, Tab } from 'react-bootstrap';
import { useRef, useState, useEffect } from "react";
import React from 'react';

const Table = ({ headers, data, disabled, colExtra1}) => {
	return (
		<div>
			<table className="table table-bordered" key='Data'>
				<thead>
					<tr>
						{headers.map(head => (
							<th className="align-middle text-center" id={head} key={head}>{head}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map(r => (Fila(r,disabled,colExtra1)))}
				</tbody>
			</table>
		</div>
	);
};

const Fila = (r,disabled,colExtra1) => {
	if (r.rowSpanAmbito === '2') {
		return (
			<React.Fragment>
				<tr>
					{generaColumnaExtra1(r,colExtra1,r.rowSpanAmbito)}
					<td className="align-middle text-center" id={r.ambito} key={r.ambito} rowSpan={r.rowSpanAmbito}>{r.ambito}</td>
					<td className="align-middle text-center" id={`${r.ambito}|M`} key={`${r.ambito}|M`}>Metas</td>
					{r.celdas.filter(f => f.tipo === 'M').map((c) => celdas(c,disabled))}
				</tr>
				<tr>
					<td className="align-middle text-center" id={`${r.ambito}|V`} key={`${r.ambito}|V`}>Valores</td>
					{r.celdas.filter(f => f.tipo === 'V').map((c) => celdas(c,disabled))}
				</tr>
			</React.Fragment>	
		);
	} else {
		return (
			<React.Fragment>
				<tr>
					{generaColumnaExtra1(r,colExtra1,r.rowSpanAmbito)}
					<td className="align-middle text-center" id={r.ambito} key={r.ambito} rowSpan={r.rowSpanAmbito}>{r.ambito}</td>
					<td className="align-middle text-center" id={`${r.ambito}|V`} key={`${r.ambito}|V`}>Valores</td>
					{r.celdas.filter(f => f.tipo === 'V').map((c) => celdas(c,disabled))}
				</tr>
			</React.Fragment>
		);
	}
}

const celdas = (c,disabled) => {
	return (
		<td className="align-middle text-center" >
			<Form.Control 
				disabled={disabled}
				className="text-right"
				type="text"
				id={c.index}
				key={c.index}
				defaultValue={c.valor}
				onChange={e => allowOnlyNumericsOrDigits(e)}
			/>
		</td>
	)
}
function allowOnlyNumericsOrDigits(e) {
	if (/\D/g.test(e.target.value)) {
		e.target.value = e.target.value.replace(/\D/g, '');
	}
}

const generaColumnaExtra1 = (fila,colExtra1,rowSpanAmbito) => {
	if(colExtra1===undefined || colExtra1.length<1)return
	if(colExtra1[0].municioInicial!==undefined){
		if(colExtra1.find(f=> f.municioInicial.nombre_municipio===fila.ambito)){
			let extra = colExtra1.find(f=> f.municioInicial.nombre_municipio===fila.ambito)
			return (<td className="align-middle text-center" rowSpan={rowSpanAmbito*extra.numRow} >{extra.descripcion}</td>);
		}
	}else{
		if(colExtra1.find(f=> f.locInicial.nombre_localidad===fila.ambito)){
			let extra = colExtra1.find(f=> f.locInicial.nombre_localidad===fila.ambito)
			return (
				<React.Fragment>
					<td className="align-middle text-center" rowSpan={rowSpanAmbito*extra.numRow} >{extra.descripcionEntidad}</td>
					<td className="align-middle text-center" rowSpan={rowSpanAmbito*extra.numRow} >{extra.descripcionMunicipio}</td>
				</React.Fragment>
			);
		}
	}
}

export default Table;