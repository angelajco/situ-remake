import { data } from 'autoprefixer';
import React, { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import * as bs from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImages, faSquareFull } from '@fortawesome/free-solid-svg-icons'
import Draggable from 'react-draggable';
import ModalDialog from 'react-bootstrap/ModalDialog';

import $ from 'jquery';

export default function GraficaPM(props) {

  const { grafica } = props

  // console.log(grafica)
  const [refrescaGrafica, setRefrescaGrafica] = useState(0)

  const cambia = () => {
    setRefrescaGrafica(refrescaGrafica + 1)
  }
  grafica.refrescarContenido = cambia

  // const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#e5d8', '#ffe280'];
  const COLORS = grafica.tablaColores()
  const RADIAN = Math.PI / 180;
  
  const [showModalSimbologia, setShowModalSimbologia] = useState(false);
  const handleShowModalSimbologia = () => {
      setShowModalSimbologia(true);
      remueveTabindexModalMovible();
  }

  function remueveTabindexModalMovible() {
    $('.modal-analisis').removeAttr("tabindex");
  }

  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="tw-bg-white border border-green-600 tw-p-5">
            {payload[0].payload.name} : {new Intl.NumberFormat('en-US').format(payload[0].value)}
        </div>
      );
    }
  
    return null;
  };

  const datosPay = grafica.generaDatos()
  const ancho = parseInt(grafica.ancho)
  const alto = parseInt(grafica.alto)

  // console.log('DATOS DE GRAFICA DE PAY: ', datosPay)
  function DraggableModalDialog(props) {
    return (
      <Draggable handle=".modal-header"><ModalDialog  {...props} /></Draggable>
    )
  }

  switch (grafica.tipo) {
    case "pay":
      return <div>
        <bs.Modal dialogAs={DraggableModalDialog} show={showModalSimbologia} backdrop={false} keyboard={false} contentClassName="modal-redimensionable modal-simbologia-planeacion"
          onHide={() => setShowModalSimbologia(!showModalSimbologia)} className="tw-pointer-events-none modal-analisis modal-simbologia">
          <bs.Modal.Header className="tw-cursor-pointer" closeButton>
              <bs.Modal.Title><b>Simbología</b></bs.Modal.Title>
          </bs.Modal.Header>
          <bs.Modal.Body>
            <div className="custom-modal-body-planeacion">
              {
                datosPay.map((entry, index) => (
                  <div key={index} className="row">
                    <div className="col-4">
                      <FontAwesomeIcon style={{color: COLORS[index]}} icon={faSquareFull}></FontAwesomeIcon>
                    </div>
                    <div className="col-8">
                      {entry.name}
                    </div>
                  </div>
                ))
              }
            </div>
          </bs.Modal.Body>
        </bs.Modal>
        <PieChart width={ancho} height={alto}>
          <Pie
            data={datosPay}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
          >
            {datosPay.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          {/* <Legend layout="horizontal" wrapperStyle={{overflowX: 'auto'}}
            iconSize={30}/> */}
        </PieChart>        
        <bs.OverlayTrigger overlay={<bs.Tooltip>Simbología</bs.Tooltip>}>
          <button className="botones-barra-mapa" onClick={handleShowModalSimbologia}>
            <FontAwesomeIcon icon={faImages}></FontAwesomeIcon>
          </button>
        </bs.OverlayTrigger>
        {/* <GetLegends/> */}
      </div>;
    case "barra":
      // for (let index = 0; index < datosPay.length; index++) {
      //   const element = datosPay[index];
      //   element.name = element.name.replaceAll('_', ' ')
      //   element.name = element.name.charAt(0).toUpperCase() + element.name.substr(1)
      //   datosPay[index].name = element.name
      // }
      return <ResponsiveContainer height={alto}>
        <BarChart
          width={ancho}
          height={alto}
          data={datosPay}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          {/* <Bar dataKey="value" stackId="a" fill={COLORS[0]} /> */}
          <Bar dataKey="value" stackId="a">
            {datosPay.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    default:
      return <p>Contenido no definido</p>;
  }

}
