import React, { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

export default function GenericChart(props) {

  const grafica = props
  const [refrescaGrafica, setRefrescaGrafica] = useState(0)

  const cambia = () => {
    setRefrescaGrafica(refrescaGrafica + 1)
  }

  const COLORS = [grafica.chart.color];
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

  const genericChart = grafica.chart;
  const ancho = parseInt(genericChart.width ? genericChart.width : 100);
  const alto = parseInt(genericChart.heigth ? genericChart.heigth : 100);

  const getIntroOfPage = () => {
    return '';
  };
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip tw-bg-inst-verdef tw-px-1">
          {
            genericChart.data[0].representation === 'percentage' ?
            <p className="label tw-text-white">{`${payload[0].value}%`}</p> :
            <p className="label tw-text-white">{`${payload[0].value}`}</p>
          }
          <p className="intro tw-text-white">{getIntroOfPage()}</p>
        </div>
      );
    }
  
    return null;
  };

  let renderLabel = function(entry) {
    return entry.name;
  }

  switch (genericChart.type) {
    case "pay":
      return <PieChart width={ancho} height={alto}>
        <Pie
          data={genericChart.datos}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
        >
          {genericChart.datos.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>;
    case "barra":
      return <ResponsiveContainer height={alto}>
        <BarChart
          width={ancho}
          height={alto}
          data={genericChart.data}
          label={renderLabel} 
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          {
            genericChart.anchor ?
              <XAxis dataKey="name" angle={genericChart.angle} textAnchor={genericChart.anchor}/> :
              <XAxis dataKey="name" angle={genericChart.angle}/>
          }
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" stackId="a" fill={COLORS[0]} />
        </BarChart>
      </ResponsiveContainer>
    default:
      return <p>Contenido no definido</p>;
  }

}
