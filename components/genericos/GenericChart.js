import React, { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line, CartesianGrid, ScatterChart, Scatter } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareFull } from '@fortawesome/free-solid-svg-icons'

export default function GenericChart(props) {

  const grafica = props
  const [refrescaGrafica, setRefrescaGrafica] = useState(0)

  const cambia = () => {
    setRefrescaGrafica(refrescaGrafica + 1)
  }

  const COLORS = grafica.chart.color;
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
  const ancho = 250;
  const alto = 250;

  const getIntroOfPage = () => {
    return '';
  };
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip tw-bg-inst-verdef tw-px-1">
            <p className="label tw-text-white text-center">{payload[0].payload.name}</p>
            <p className="label tw-text-white text-center">{genericChart.data[0].representation === 'number' ? new Intl.NumberFormat('en-US').format(payload[0].value) : payload[0].value}{genericChart.data[0].representation === 'percentage' ? '%' : ''}</p>
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
      return <div className="static-chart-size">
            <PieChart width={ancho/2} height={alto/2}>
              <Pie
                data={genericChart.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={50}
                fill="#8884d8"
                dataKey="value"
              >
                {genericChart.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          <div className="row my-3 custom-chart-legens-container">
            {
              genericChart.data.map((entry, index) => (
                <div key={index} className="col-6">
                  <FontAwesomeIcon className="tw-mr-2" style={{color: COLORS[index]}} icon={faSquareFull}></FontAwesomeIcon>
                  {entry.name}
                </div>
              ))
            }
          </div>
        </div>;
    case "barra":
      return <BarChart
          width={ancho}
          height={alto}
          data={genericChart.data}
          label={renderLabel} 
        >
          {
            genericChart.anchor ?
              <XAxis dataKey="name" angle={genericChart.angle} textAnchor={genericChart.anchor}/> :
              <XAxis dataKey="name" angle={genericChart.angle}/>
          }
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" stackId="a" fill={COLORS[0]} />
        </BarChart>;
    case "radar":
      return <div className="static-chart-size">
        <ResponsiveContainer height={alto} width={ancho}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={genericChart.data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis />
            <Radar dataKey="A" stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      </div>;
    case "line":
      return <LineChart
          width={ancho}
          height={alto}
          data={genericChart.data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="value" name=" " stroke={COLORS[0]} activeDot={{ r: 8 }} />
        </LineChart>
    case "scatter":
      return <ScatterChart
          width={ancho}
          height={alto}
        >
          <XAxis type="number" dataKey="x" name=" "/>
          <YAxis type="number" dataKey="y" name=" "/>
          <Tooltip cursor={{ strokeDasharray: '3 3' }} content={CustomTooltip}/>
          <Scatter data={genericChart.data} fill={COLORS[0]} />
        </ScatterChart>;
    default:
      return <p>Contenido no definido</p>;
  }

}
