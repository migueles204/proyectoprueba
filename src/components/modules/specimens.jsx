import React from 'react';
import { useParams } from 'react-router-dom'; // Para obtener el ID de la URL

const detallesEstilos = {
  container: {
    padding: '16px',
    fontFamily: 'Arial, sans-serif',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '16px',
  },
  th: {
    border: '1px solid #ddd',
    padding: '8px',
    backgroundColor: '#f2f2f2',
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
};

const Details = () => {
  const { id } = useParams(); // Obtenemos el ID de la URL
  
  // Lista estática de ejemplares para este ejemplo
  const ejemplares = [
    { id: 1, nombre: 'Ejemplar A', fechaLlegada: '2024-09-01' },
    { id: 2, nombre: 'Ejemplar B', fechaLlegada: '2024-08-15' },
  ];

  // Buscar el ejemplar específico basado en el ID de la URL
const ejemplarSeleccionado = ejemplares.find(ejemplar => ejemplar.id === parseInt(id, 10));

const Specimens = () => {
  const { id } = useParams();
  // Lógica para obtener y mostrar los detalles del espécimen usando el id
  return <div>Detalles del espécimen con ID: {id}</div>;
};

  // Si no se encuentra el ejemplar, mostrar un mensaje
  if (!ejemplarSeleccionado) {
    return (
      <div style={detallesEstilos.container}>
        <h1>Ejemplar no encontrado</h1>
        <p>No hay datos disponibles para el ejemplar con ID: {id}</p>
      </div>
    );
  }

  return (
    <div style={detallesEstilos.container}>
      <h1>Detalles del Ejemplar {ejemplarSeleccionado.nombre}</h1>
      <table style={detallesEstilos.table}>
        <thead>
          <tr>
            <th style={detallesEstilos.th}>ID</th>
            <th style={detallesEstilos.th}>Nombre</th>
            <th style={detallesEstilos.th}>Fecha de Llegada</th>
            <th style={detallesEstilos.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={detallesEstilos.td}>{ejemplarSeleccionado.id}</td>
            <td style={detallesEstilos.td}>{ejemplarSeleccionado.nombre}</td>
            <td style={detallesEstilos.td}>{ejemplarSeleccionado.fechaLlegada}</td>
            <td style={detallesEstilos.td}>
              <div style={detallesEstilos.actions}>
                <button>Editar</button>
                <button>Eliminar</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Details;
