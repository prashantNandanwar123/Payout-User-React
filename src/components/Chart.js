import React from 'react';
import ChartDataLables  from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip, ArcElement, Filler, Legend, BarElement, PointElement, LineElement } from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Filler, Legend, PointElement, LineElement, ChartDataLables);

export const BarChart = () => {
    const options = {
        responsive: true,
        // maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                display: false,
            },
            title: {
                display: true,
                text: 'Transaction Analysis',
            },
            datalabels: {
                anchor: 'end',
                align: 'top',
                font: { weight: 'bold' }
            }
        },
        scales: {
            y: {
                min: 0
            }
        }
    };
    const data = {
        labels : ['25/04/2024','25/04/2024','25/04/2024','25/04/2024','25/04/2024','25/04/2024','25/04/2024','25/04/2024','25/04/2024','25/04/2024'],
        datasets: [
            {
                data: [100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000, 1000000],
                borderColor: 'rgb(53, 162, 235)',
                // backgroundColor: '#cd3b57',
                backgroundColor: '#68b368',
                pointRadius: 8,
            },
        ],
    };
    return <Bar options={options} data={data} />
}

export const LineChart = ({xData,yData}) => {
    const options = {
        responsive: true,
        // maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            display: false,
          },
          title: {
            display: true,
            text: 'TRANSACTION CHART',
          },
          datalabels: {
            display : false,
            font: { size: 0 },
            listeners: {
                enter: (context) => {
                    context.hovered = true;
                    context.chart.canvas.style.cursor = 'pointer';
                    return true;
                },
                leave: (context) => {
                    context.hovered = false;
                    context.chart.canvas.style.cursor = 'default';
                    return true;
                },
            }
          }
        },
        scales: {
            y: {
                // max: 500000,
                min: 0
            }
        },
    };
    const data = {
        // labels : ['25/04/2024','25/04/2024','25/04/2024','25/04/2024','25/04/2024','25/04/2024','25/04/2024','25/04/2024'],
        labels : xData,
        datasets: [
            {
                // data: [100000, 20000, 1000, 400000, 10, 600000, 700000, 80000, 900000, 1000000],
                data: yData,
                borderColor: '#db7676',
                backgroundColor: '#db7676',
                pointRadius: 8,
                point: 'pointer',
            },
        ],
    };
    return <Line options={options} data={data} />
}

export const PieChart = ({pieData}) => {
    const options = {
        plugins: {
            legend: {
                display: false
            },
            datalabels: {
                color: 'white',
                font: { weight:'bold' },
                formatter: (value) => {
                    return value+'%'
                }
            }
        }
    }
    const data = {
        labels: ['success','Pending','Failed'],
        datasets: [
            {
                fill: true,
                label: '% ',
                data: pieData ? [pieData[4],pieData[5],pieData[6]] : [],
                backgroundColor: [
                    'rgba(104, 179, 104, 1)',
                    'rgba(255, 193, 7, 1)',
                    'rgba(220, 53, 69, 1)',
                ],
            },
        ],
    };
    return <Pie options={options} data={data} />;
}