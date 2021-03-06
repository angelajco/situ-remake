import { data } from 'autoprefixer';
import React, { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareFull } from '@fortawesome/free-solid-svg-icons'

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

  switch (grafica.tipo) {
    case "pay":
      return <div>
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
        </PieChart>
        <div className="row custom-chart-legens-container">
          {
            datosPay.map((entry, index) => (
              <div key={index} className="col-6">
                <FontAwesomeIcon className="tw-mr-2" style={{color: COLORS[index]}} icon={faSquareFull}></FontAwesomeIcon>
                {entry.name}
              </div>
            ))
          }
        </div>
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
