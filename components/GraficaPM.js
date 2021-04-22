import { data } from 'autoprefixer';
import React, { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

export default function GraficaPM(props) {

  const { grafica } = props

  // console.log(grafica)
  const [refrescaGrafica, setRefrescaGrafica] = useState(0)

  const cambia = () => {
    setRefrescaGrafica(refrescaGrafica + 1)
  }

  // console.log('Grafica', grafica)
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

  const datosPay = grafica.generaDatos()
  const ancho = parseInt(grafica.ancho)
  const alto = parseInt(grafica.alto)

  // console.log('DATOS DE GRAFICA DE PAY: ', datosPay)

  switch (grafica.tipo) {
    case "pay":
      return <PieChart width={ancho} height={alto}>
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
        <Legend 
          iconSize={30}/>
      </PieChart>;
    case "barra":
      // for (let index = 0; index < datosPay.length; index++) {
      //   const element = datosPay[index];
      //   element.name = element.name.replaceAll('_', ' ')
      //   element.name = element.name.charAt(0).toUpperCase() + element.name.substr(1)
      //   datosPay[index].name = element.name
      // }
      return <ResponsiveContainer height={alto}>
        <BarChart
          width={500}
          height={300}
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
          <Tooltip />
          <Bar dataKey="value" stackId="a" fill={COLORS[0]} />
        </BarChart>
      </ResponsiveContainer>
    default:
      return <p>Contenido no definido</p>;
  }

}
