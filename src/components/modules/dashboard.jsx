// src/components/modules/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'reactstrap';
import { Line, Bar } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHorse, faUser } from '@fortawesome/free-solid-svg-icons';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  // Dummy data
  const [clientsData, setClientsData] = useState({
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio"],
    datasets: [
      {
        label: "Clientes Mensuales",
        data: [10, 20, 15, 30, 25, 40, 35],
        borderColor: "#0191B4", // Azul Medio
        backgroundColor: "rgba(74, 144, 226, 0.2)", // Azul Medio translúcido
        pointBorderColor: "#50E3C2", // Verde Menta
        pointBackgroundColor: "#50E3C2",
      },
    ],
  });

  const [servicesData, setServicesData] = useState({
    labels: ["Alimentación", "Pesebrera", "Veterinaria"],
    datasets: [
      {
        label: "Uso de Servicios",
        data: [12, 29, 5],
        backgroundColor: ["#6DBE45", "#00CED1", "#F8BBD0"], // Verde, Azul, Rosa Pastel
        borderColor: "#4A90E2", // Azul Medio para bordes
        borderWidth: 1,
      },
    ],
  });

  const [specimensData, setSpecimensData] = useState({
    labels: ["Girardota", "Portachuelo", "Támesis"],
    datasets: [
      {
        label: "Ejemplares por Sede",
        data: [45, 33, 28 ],
        backgroundColor: ["#A0D6E1", "#F6C6A5", "#A87BC7"], // Azul Pastel, Naranja, Morado claro vibrante
        borderColor: "#4A90E2", // Azul Medio para bordes
        borderWidth: 1,
      },
    ],
  });

  const [transferredSpecimensData, setTransferredSpecimensData] = useState({
    labels: ["Girardota", "Portachuelo", "Támesis"],
    datasets: [
      { 
        label: 'Ejemplares Trasladados',
        data: [20, 35, 15],
        backgroundColor: ["#B9FBC0", "#FCE6A7", "#B39DDB"], // Verde Pastel, Amarillo Pastel, Lila
        borderColor: "#4A90E2", // Azul Medio para bordes
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    // Fetch data from API or other sources here
  }, []);

  return (
    <Container style={{ backgroundColor: '#F8F9FA', padding: '20px' }}>
      <Row>
        <Col md={6}>
          <Card body style={{ borderColor: '#CED4DA' }}>
            <h4 className="text-center" style={{ color: '#343A40' }}>Clientes Mensuales</h4>
            <Line
              data={clientsData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        return `${context.dataset.label}: ${context.raw}`;
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Meses',
                    },
                    ticks: {
                      color: '#343A40',
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Número de Clientes',
                    },
                    beginAtZero: true,
                    ticks: {
                      color: '#343A40',
                    },
                  },
                },
              }}
            />
          </Card>
        </Col>
        <Col md={6}>
          <Card body style={{ borderColor: '#CED4DA' }}>
            <h4 className="text-center" style={{ color: '#343A40' }}>Uso de Servicios</h4>
            <Bar
              data={servicesData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        return `${context.dataset.label}: ${context.raw}`;
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Servicios',
                    },
                    ticks: {
                      color: '#343A40',
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Número de Usos',
                    },
                    beginAtZero: true,
                    ticks: {
                      color: '#343A40',
                    },
                  },
                },
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md={6}>
          <Card body style={{ borderColor: '#CED4DA' }}>
            <h4 className="text-center" style={{ color: '#343A40' }}>Ejemplares por Sede</h4>
            <Bar
              data={specimensData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        return `${context.dataset.label}: ${context.raw}`;
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Sedes',
                    },
                    ticks: {
                      color: '#343A40',
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Número de Ejemplares',
                    },
                    beginAtZero: true,
                    ticks: {
                      color: '#343A40',
                    },
                  },
                },
              }}
            />
          </Card>
        </Col>
        <Col md={6}>
          <Card body style={{ borderColor: '#CED4DA' }}>
            <h4 className="text-center" style={{ color: '#343A40' }}>Ejemplares Trasladados</h4>
            <Bar
              data={transferredSpecimensData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        return `${context.dataset.label}: ${context.raw}`;
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Sedes',
                    },
                    ticks: {
                      color: '#343A40',
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Número de Ejemplares Trasladados',
                    },
                    beginAtZero: true,
                    ticks: {
                      color: '#343A40',
                    },
                  },
                },
              }}
            />
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
  