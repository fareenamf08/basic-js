import React from 'react';
import ReactApexChart from 'react-apexcharts';

function Analytic() {
  const chartOptions = {
    chart: {
      id: 'multi-axis-line-chart',
      zoom: {
        enabled: true,
      },
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      type: 'datetime', // Or 'category' for non-date values
    },
    yaxis: [
      {
        title: {
          text: 'Temperature (°C)',
        },
        opposite: true, // Axis on the right side
      },
      {
        title: {
          text: 'Humidity (%)',
        },
      },
    ],
    markers: {
      size: 0,
    },
    dataLabels: {
      enabled: false,
    },
  };

  const series = [
    {
      name: 'Temperature',
      type: 'line',
      data: [
        { x: '2024-04-01', y: 22 },
        { x: '2024-04-02', y: 23 },
        { x: '2024-04-03', y: 25 },
        // Add more data points
      ],
    },
    {
      name: 'Humidity',
      type: 'line',
      data: [
        { x: '2024-04-01', y: 45 },
        { x: '2024-04-02', y: 50 },
        { x: '2024-04-03', y: 55 },
        // Add more data points
      ],
    },
  ];

  return (
    <div>
      <h1>Analytics Page</h1>
      <ReactApexChart
        options={chartOptions}
        series={series}
        type="line"
        height={500}
      />
    </div>
  );
}

export default Analytic;
