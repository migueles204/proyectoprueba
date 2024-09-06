// Details.js
import React from 'react';
import { useLocation } from 'react-router-dom';

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
  // Aquí podrías extraer datos relevantes de la URL o el estado
  // Para simplificar, usaré datos estáticos en el ejemplo

  const ejemplares = [
    { id: 1, nombre: 'Ejemplar A', fechaLlegada: '2024-09-01' },
    { id: 2, nombre: 'Ejemplar B', fechaLlegada: '2024-08-15' },
  ];

  return (
    <div style={detallesEstilos.container}>
      <h1>Detalles de Ejemplares</h1>
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
          {ejemplares.map(ejemplar => (
            <tr key={ejemplar.id}>
              <td style={detallesEstilos.td}>{ejemplar.id}</td>
              <td style={detallesEstilos.td}>{ejemplar.nombre}</td>
              <td style={detallesEstilos.td}>{ejemplar.fechaLlegada}</td>
              <td style={detallesEstilos.td}>
                <div style={detallesEstilos.actions}>
                  <button>Editar</button>
                  <button>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Details;
