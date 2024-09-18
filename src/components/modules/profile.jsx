import React, { Component } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de importar Bootstrap CSS
import perfilImage from '/src/assets/perfil.png'; // Ajusta la ruta a tu imagen

// Define los estilos en línea como un objeto
const styles = {
  appContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5', // Color de fondo opcional
  },
  profileContainer: {
    width: '300px',
    border: '1px solid #ddd',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff', // Fondo blanco para el contenedor
  },
  profilePic: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  profileImage: {
    width: '100px', // Ajusta el tamaño según lo necesario
    height: '100px',
    borderRadius: '50%', // Para hacerlo redondo
    objectFit: 'cover', // Para que la imagen se ajuste bien
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  profileHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  infoField: {
    marginBottom: '12px',
  },
  label: {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#f5f5f5', // Color de fondo de los inputs
    cursor: 'not-allowed', // Muestra el cursor como no editable
  },
  resetPasswordButton: {
    marginTop: '16px',
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  resetPasswordButtonHover: {
    backgroundColor: '#0056b3',
  },
};

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'jorge eduardo',
      email: 'eduardo@gmail.com.com',
      phone: '123-456-7890',
      showModal: false,
      username: '',
      emailInput: '',
      errors: {
        username: '',
        email: '',
      },
    };
  }

  handleResetPassword = () => {
    this.setState({ showModal: true });
  };

  handleCloseModal = () => {
    this.setState({
      showModal: false,
      username: '',
      emailInput: '',
      errors: {
        username: '',
        email: '',
      },
    });
  };

  handleFormChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleFormSubmit = (event) => {
    event.preventDefault();
    const { username, emailInput } = this.state;
    let errors = {
      username: '',
      email: '',
    };

    if (!username) {
      errors.username = 'Campo obligatorio';
    }

    if (!emailInput) {
      errors.email = 'Campo obligatorio';
    }

    this.setState({ errors });

    if (!errors.username && !errors.email) {
      // Aquí puedes manejar el envío del formulario
      alert('Formulario enviado');
      this.handleCloseModal();
    }
  };

  render() {
    const { name, email, phone, showModal, username, emailInput, errors } = this.state;
    return (
      <div style={styles.appContainer}>
        <div style={styles.profileContainer}>
          <div style={styles.profilePic}>
            <img
              src={perfilImage}
              alt="Perfil"
              style={styles.profileImage}
            />
          </div>
          <div style={styles.profileInfo}>
            <div style={styles.profileHeader}>
              <h2>Perfil</h2>
            </div>
            <div style={styles.infoField}>
              <label style={styles.label}>Nombre:</label>
              <input
                type="text"
                value={name}
                readOnly
                style={styles.input}
              />
            </div>
            <div style={styles.infoField}>
              <label style={styles.label}>Correo electrónico:</label>
              <input
                type="email"
                value={email}
                readOnly
                style={styles.input}
              />
            </div>
            <div style={styles.infoField}>
              <label style={styles.label}>Celular:</label>
              <input
                type="text"
                value={phone}
                readOnly
                style={styles.input}
              />
            </div>
            <button
              style={styles.resetPasswordButton}
              onClick={this.handleResetPassword}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.resetPasswordButtonHover.backgroundColor}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.resetPasswordButton.backgroundColor}
            >
              Restablecer contraseña
            </button>
          </div>
        </div>

        {/* Modal para restablecer contraseña */}
        <Modal show={showModal} onHide={this.handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Restablecer Contraseña</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.handleFormSubmit}>
              <Form.Group controlId="formBasicUsername">
                <Form.Label>Nombre de usuario</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={username}
                  onChange={this.handleFormChange}
                  isInvalid={!!errors.username}
                  placeholder="Ingrese nombre de usuario"
                />
                <Form.Control.Feedback type="invalid" style={styles.formError}>
                  {errors.username}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control
                  type="email"
                  name="emailInput"
                  value={emailInput}
                  onChange={this.handleFormChange}
                  isInvalid={!!errors.email}
                  placeholder="Ingrese correo electrónico"
                />
                <Form.Control.Feedback type="invalid" style={styles.formError}>
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              <p></p>
              <Button variant="primary" type="submit">
                Enviar
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
} 

export default Profile;
