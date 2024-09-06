import React, { useState } from 'react';
import Swal from 'sweetalert2';

const RecoveryForm = ({ onBackToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const handleRecovery = async (event) => {
    event.preventDefault();

    // Aquí deberías implementar la lógica real de recuperación de clave
    await Swal.fire({
      title: 'Recuperación de clave',
      text: 'Instrucciones para recuperar la clave enviadas a tu correo.',
      icon: 'success',
      confirmButtonText: 'Aceptar',
    });

    // Regresar al formulario de inicio de sesión
    onBackToLogin();
  };

  return (
    <form style={formStyle} onSubmit={handleRecovery}>
      <h2 style={headingStyle}>Recuperar clave</h2>
      <div style={formGroupStyle}>
        <label htmlFor="username-recovery" style={labelStyle}>Nombre de usuario:</label>
        <input
          id="username-recovery"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={inputStyle}
        />
      </div>
      <div style={formGroupStyle}>
        <label htmlFor="email" style={labelStyle}>Correo electrónico:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
      </div>
      <button
        type="submit"
        style={buttonStyle}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
      >
        Recuperar clave
      </button>
      <a
        style={linkStyle}
        onClick={onBackToLogin}
      >
        Volver al inicio de sesión
      </a>
    </form>
  );
};

const formStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  width: '300px',
};

const headingStyle = {
  margin: '0 0 20px 0',
  fontSize: '24px',
  color: '#333',
  textAlign: 'center',
};

const formGroupStyle = {
  marginBottom: '15px',
};

const labelStyle = {
  display: 'block',
  fontSize: '14px',
  color: '#666',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  fontSize: '14px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  backgroundColor: 'white',
  boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.1)',
};

const buttonStyle = {
  width: '100%',
  padding: '10px',
  fontSize: '16px',
  color: 'white',
  backgroundColor: '#007bff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
};

const buttonHoverStyle = {
  backgroundColor: '#0056b3',
};

const linkStyle = {
  display: 'block',
  marginTop: '10px',
  textAlign: 'center',
  color: '#007bff',
  textDecoration: 'none',
  cursor: 'pointer',
};

export default RecoveryForm;