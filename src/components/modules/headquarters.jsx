import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para la navegación
import { FaTrash } from 'react-icons/fa'; // Importa el ícono de la caneca de basura
import { Bar, Line } from 'react-chartjs-2'; // Importar los componentes Bar y Line para los gráficos
import Chart from 'chart.js/auto'; // Importar el módulo Chart
import { Container, Row, Col, Card } from 'reactstrap';


// Estilos en línea para el componente
const estilos = {
  headquarters: {
    padding: '16px',
    fontFamily: 'Arial, sans-serif',
    position: 'relative', // Habilita el posicionamiento absoluto del botón
  },
  h1: {
    fontSize: '2rem',
    marginBottom: '16px',
  },
  tarjetasContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
  },
  tarjeta: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    maxWidth: '300px',
    margin: '16px auto',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between', // Asegura que el contenido se distribuya en la tarjeta
    position: 'relative',
  },
  h1Tarjeta: {
    fontSize: '1.25rem',
    marginBottom: '16px',
  },
  h2: {
    fontSize: '1rem',
    marginBottom: '8px',
  },
  recuadro: {
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '8px',
    fontSize: '1.25rem',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
  },
  info: {
    marginBottom: '16px',
  },
  btnContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  btnVer: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    flex: '1',
  },
  btnVerHover: {
    backgroundColor: '#0056b3',
  },
  btnEliminar: {
    padding: '10px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginLeft: '10px', // Espacio entre el botón de eliminar y el botón de ver
  },
  btnAgregar: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  btnAgregarHover: {
    backgroundColor: '#218838',
  },
};

// Componente Tarjeta
const Tarjeta = ({ id, titulo, espaciosDisponibles, ejemplaresRegistrados, onEliminar }) => {
  const [hover, setHover] = React.useState(false);
  const navigate = useNavigate(); // Hook para navegación

  const handleVerClick = () => {
    navigate('/detalles'); // Redirige a la vista de detalles
  };

  const handleEliminarClick = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás recuperar esta sede!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      onEliminar(id);
      Swal.fire(
        'Eliminado!',
        'La sede ha sido eliminada.',
        'success'
      );
    }
  };

  return (
    <div
      style={estilos.tarjeta}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <h1 style={estilos.h1Tarjeta}>{titulo}</h1>
      <div style={estilos.info}>
        <div>
          <h2>Espacios</h2>
          <div style={estilos.recuadro}>{espaciosDisponibles || '---'}</div>
        </div>
        <div>
          <h2>Número de ejemplares</h2>
          <div style={estilos.recuadro}>{ejemplaresRegistrados || '---'}</div>
        </div>
      </div>
      <div style={estilos.btnContainer}>
        <button
          style={{ ...estilos.btnVer, ...(hover && estilos.btnVerHover) }}
          onClick={handleVerClick}
        >
          Ver
        </button>
        <button
          style={estilos.btnEliminar}
          onClick={handleEliminarClick}
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

// Componente Headquarters
const Headquarters = () => {
  const [tarjetas, setTarjetas] = useState([
    { id: 1, titulo: 'Tarjeta 1', espaciosDisponibles: '', ejemplaresRegistrados: '' },
    // Puedes inicializar con más tarjetas si lo deseas
  ]);

  const handleAgregarTarjeta = async () => {
    const { value: nombre } = await Swal.fire({
      title: 'Agregar nueva sede',
      input: 'text',
      inputLabel: 'Nombre de la sede',
      inputPlaceholder: 'Escribe el nombre de la sede',
      confirmButtonText: 'Agregar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    });

    if (nombre) {
      const nuevaTarjeta = {
        id: tarjetas.length + 1,
        titulo: nombre,
        espaciosDisponibles: '', // Inicialmente vacío
        ejemplaresRegistrados: '', // Inicialmente vacío
      };
      setTarjetas([...tarjetas, nuevaTarjeta]);
    }
  };

  const handleEliminarTarjeta = (id) => {
    setTarjetas(tarjetas.filter(tarjeta => tarjeta.id !== id));
  };

  return (
    <div style={estilos.headquarters}>
      <h1 style={estilos.h1}>Headquarters</h1>
      <button
        style={estilos.btnAgregar}
        onClick={handleAgregarTarjeta}
      >
        Agregar Sede
      </button>
      <div style={estilos.tarjetasContainer}>
        {tarjetas.map(tarjeta => (
          <Tarjeta
            key={tarjeta.id}
            id={tarjeta.id}
            titulo={tarjeta.titulo}
            espaciosDisponibles={tarjeta.espaciosDisponibles}
            ejemplaresRegistrados={tarjeta.ejemplaresRegistrados}
            onEliminar={handleEliminarTarjeta}
          />
        ))}
      </div>
    </div>
  );
};

export default Headquarters;
