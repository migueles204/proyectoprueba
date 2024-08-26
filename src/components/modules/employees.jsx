import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Container, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup, Input, ButtonGroup } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';


// Datos iniciales de empleados
const data = [
  { id: 1, Nombre: "Lionel", Apellido: "Messi", Correo: "messi@gmail.com", Celular: 3005242585, Rol: "palafrenero", estado: true, Documento: 123456789 },
  { id: 2, Nombre: "Keimer", Apellido: "Lezcano", Correo: "keimer@gmail.com", Celular: 3000000000, Rol: "veterinario", estado: true, Documento: 987654321 },
];

// Lista de roles disponibles para seleccionar
const roles = ["palafrenero", "veterinario", "cuidador", "administrador"];

class Empleados extends React.Component {
  state = { 
    data: data,
    filteredData: data,
    form: {
      id: '',
      Nombre: '',
      Apellido: '',
      Correo: '',
      Celular: '',
      Rol: '',
      estado: true,
      Documento: ''
    },
    modalAñadir: false,
    modalEditar: false,
    searchText: '',
    emailError: '',
    documentoError: '',
    validationErrors: {},
  };

  validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  checkDocumentoExists = (documento, excludeId = null) => {
    return this.state.data.some(item => item.Documento === documento && item.id !== excludeId);
  }

  validateNameAndSurname = (text) => {
    // Validar que solo contenga letras y espacios (puede modificar según requisitos)
    const regex = /^[A-Za-z\s]+$/;
    return regex.test(text);
  }

  handleChange = e => {
    const { name, value, type, checked } = e.target;
    this.setState({
      form: {
        ...this.state.form,
        [name]: type === 'checkbox' ? checked : value,
      }
    }, () => {
      if (name === 'Correo') {
        const isValidEmail = this.validateEmail(this.state.form.Correo);
        this.setState({
          emailError: isValidEmail ? '' : 'Correo electrónico inválido.'
        });
      }
      if (name === 'Documento') {
        const documentoExists = this.checkDocumentoExists(this.state.form.Documento, this.state.form.id);
        this.setState({
          documentoError: documentoExists ? 'Documento ya existe.' : ''
        });
      }
      if (name === 'Nombre' || name === 'Apellido') {
        const isValidNameOrSurname = this.validateNameAndSurname(this.state.form[name]);
        this.setState({
          validationErrors: {
            ...this.state.validationErrors,
            [name]: isValidNameOrSurname ? '' : 'El campo solo puede contener letras y espacios.'
          }
        });
      }
    });
  }

  handleSearch = e => {
    const searchText = e.target.value.toLowerCase();
    this.setState({
      searchText,
      filteredData: this.state.data.filter(item =>
        item.Nombre.toLowerCase().includes(searchText) ||
        item.Apellido.toLowerCase().includes(searchText) ||
        item.Correo.toLowerCase().includes(searchText) ||
        item.Rol.toLowerCase().includes(searchText) ||
        item.Documento.toString().includes(searchText)
      )
    });
  }

  mostrarmodalAñadir = () => {
    this.setState({ 
      modalAñadir: true,
      form: {
        id: '',
        Nombre: '',
        Apellido: '',
        Correo: '',
        Celular: '',
        Rol: '',
        estado: true,
        Documento: ''
      },
      emailError: '',
      documentoError: '',
      validationErrors: {}
    });
  }

  ocultarmodalAñadir = () => {
    this.setState({ modalAñadir: false });
  }

  mostrarModalEditar = (registro) => {
    this.setState({ 
      modalEditar: true, 
      form: registro,
      emailError: '',
      documentoError: '',
      validationErrors: {}
    });
  }

  ocultarModalEditar = () => {
    this.setState({ modalEditar: false });
  }

  validateForm = () => {
    const { Nombre, Apellido, Correo, Celular, Documento } = this.state.form;
    let errors = {};
    
    if (!Nombre) errors.Nombre = 'Nombre es obligatorio.';
    if (!Apellido) errors.Apellido = 'Apellido es obligatorio.';
    if (!Correo) errors.Correo = 'Correo es obligatorio.';
    if (!Celular) errors.Celular = 'Celular es obligatorio.';
    if (!Documento) errors.Documento = 'Documento es obligatorio.';

    if (!this.validateEmail(Correo)) errors.Correo = 'Correo electrónico inválido.';
    if (this.checkDocumentoExists(Documento, this.state.form.id)) errors.Documento = 'Documento ya existe.';
    if (!this.validateNameAndSurname(Nombre)) errors.Nombre = 'Nombre solo puede contener letras y espacios.';
    if (!this.validateNameAndSurname(Apellido)) errors.Apellido = 'Apellido solo puede contener letras y espacios.';

    this.setState({ validationErrors: errors });
    return Object.keys(errors).length === 0;
  }

  Añadir = () => {
    if (!this.validateForm()) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas añadir este empleado?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, añadir',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        const valorNuevo = { ...this.state.form };
        valorNuevo.id = this.state.data.length + 1; 
        const lista = [...this.state.data, valorNuevo];
        this.setState({ data: lista, filteredData: lista, modalAñadir: false });
        Swal.fire('Éxito', 'Empleado añadido exitosamente.', 'success');
      }
    });
  }

  editar = (dato) => {
    if (!this.validateForm()) return;

    const lista = this.state.data.map(registro =>
      registro.id === dato.id ? { ...dato } : registro
    );
    this.setState({ data: lista, filteredData: lista, modalEditar: false });
    Swal.fire('Éxito', 'Empleado actualizado exitosamente.', 'success');
  }

  eliminar = (dato) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Realmente deseas eliminar el registro ${dato.id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        const lista = this.state.data.filter(registro => registro.id !== dato.id);
        this.setState({ data: lista, filteredData: lista });
        Swal.fire('Eliminado', 'Empleado eliminado exitosamente.', 'success');
      }
    });
  }

  cambiarEstado = (id) => {
    const lista = this.state.data.map(registro =>
      registro.id === id ? { ...registro, estado: !registro.estado } : registro
    );
    this.setState({ data: lista, filteredData: lista });
  }

  render() {
    const { form, modalAñadir, modalEditar, emailError, documentoError, validationErrors } = this.state;

    return (
      <>
        <Container>
          <br />
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Input
              type="text"
              placeholder="Buscar empleado"
              value={this.state.searchText}
              onChange={this.handleSearch}
              style={{ width: '300px' }}
            />
            <Button color="success" onClick={this.mostrarmodalAñadir}>Añadir empleado</Button>
          </div>
          
          <Table className="table table-bordered">
            <thead>
              <tr>
                <th>Id</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo</th>
                <th>Celular</th>
                <th>Rol</th>
                <th>Documento</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {this.state.filteredData.map((elemento, index) => (
                <tr key={index}>
                  <td>{elemento.id}</td>
                  <td>{elemento.Nombre}</td>
                  <td>{elemento.Apellido}</td>
                  <td>{elemento.Correo}</td>
                  <td>{elemento.Celular}</td>
                  <td>{elemento.Rol}</td>
                  <td>{elemento.Documento}</td>
                  <td>{elemento.estado ? 'Activo' : 'Inactivo'}</td>
                      <td>
                        <ButtonGroup>
                          <Button 
                            color={elemento.estado ? "success" : "secondary"} 
                            onClick={(e) => { e.stopPropagation(); this.cambiarEstado(elemento.id); }}
                            size="sm"
                            className="mr-1"
                          >
                            {elemento.estado ? "On" : "Off"}
                          </Button>
                          <Button 
                            color="dark" 
                            onClick={(e) => { e.stopPropagation(); this.mostrarModalEditar(elemento); }}
                            size="sm"
                            className="mr-1"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          <Button 
                            color="danger" 
                            onClick={(e) => { e.stopPropagation(); this.eliminar(elemento); }}
                            size="sm"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </ButtonGroup>
                      </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Modal isOpen={modalAñadir} toggle={this.ocultarmodalAñadir}>
            <ModalHeader toggle={this.ocultarmodalAñadir}>Añadir Empleado</ModalHeader>
            <ModalBody>
              <FormGroup>
                <label>Nombre:</label>
                <Input
                  type="text"
                  name="Nombre"
                  value={form.Nombre}
                  onChange={this.handleChange}
                  invalid={!!validationErrors.Nombre}
                />
                {validationErrors.Nombre && <div className="text-danger">{validationErrors.Nombre}</div>}
              </FormGroup>
              <FormGroup>
                <label>Apellido:</label>
                <Input
                  type="text"
                  name="Apellido"
                  value={form.Apellido}
                  onChange={this.handleChange}
                  invalid={!!validationErrors.Apellido}
                />
                {validationErrors.Apellido && <div className="text-danger">{validationErrors.Apellido}</div>}
              </FormGroup>
              <FormGroup>
                <label>Correo:</label>
                <Input
                  type="email"
                  name="Correo"
                  value={form.Correo}
                  onChange={this.handleChange}
                  invalid={!!emailError}
                />
                {emailError && <div className="text-danger">{emailError}</div>}
              </FormGroup>
              <FormGroup>
                <label>Celular:</label>
                <Input
                  type="number"
                  name="Celular"
                  value={form.Celular}
                  onChange={this.handleChange}
                  invalid={!!validationErrors.Celular}
                />
                {validationErrors.Celular && <div className="text-danger">{validationErrors.Celular}</div>}
              </FormGroup>
              <FormGroup>
                <label>Rol:</label>
                <Input
                  type="select"
                  name="Rol"
                  value={form.Rol}
                  onChange={this.handleChange}
                >
                  <option value="">Seleccionar rol</option>
                  {roles.map((rol, index) => (
                    <option key={index} value={rol}>{rol}</option>
                  ))}
                </Input>
                {validationErrors.Rol && <div className="text-danger">{validationErrors.Rol}</div>}
              </FormGroup>
              <FormGroup>
                <label>Documento:</label>
                <Input
                  type="number"
                  name="Documento"
                  value={form.Documento}
                  onChange={this.handleChange}
                  invalid={!!documentoError}
                />
                {documentoError && <div className="text-danger">{documentoError}</div>}
              </FormGroup>
              <FormGroup>
                <label>Estado:</label>
                <Input
                  type="checkbox"
                  name="estado"
                  checked={form.estado}
                  onChange={this.handleChange}
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.ocultarmodalAñadir}>Cancelar</Button>
              <Button color="primary" onClick={this.Añadir}>Añadir</Button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={modalEditar} toggle={this.ocultarModalEditar}>
            <ModalHeader toggle={this.ocultarModalEditar}>Editar Empleado</ModalHeader>
            <ModalBody>
              <FormGroup>
                <label>Nombre:</label>
                <Input
                  type="text"
                  name="Nombre"
                  value={form.Nombre}
                  onChange={this.handleChange}
                  invalid={!!validationErrors.Nombre}
                />
                {validationErrors.Nombre && <div className="text-danger">{validationErrors.Nombre}</div>}
              </FormGroup>
              <FormGroup>
                <label>Apellido:</label>
                <Input
                  type="text"
                  name="Apellido"
                  value={form.Apellido}
                  onChange={this.handleChange}
                  invalid={!!validationErrors.Apellido}
                />
                {validationErrors.Apellido && <div className="text-danger">{validationErrors.Apellido}</div>}
              </FormGroup>
              <FormGroup>
                <label>Correo:</label>
                <Input
                  type="email"
                  name="Correo"
                  value={form.Correo}
                  onChange={this.handleChange}
                  invalid={!!emailError}
                />
                {emailError && <div className="text-danger">{emailError}</div>}
              </FormGroup>
              <FormGroup>
                <label>Celular:</label>
                <Input
                  type="number"
                  name="Celular"
                  value={form.Celular}
                  onChange={this.handleChange}
                  invalid={!!validationErrors.Celular}
                />
                {validationErrors.Celular && <div className="text-danger">{validationErrors.Celular}</div>}
              </FormGroup>
              <FormGroup>
                <label>Rol:</label>
                <Input
                  type="select"
                  name="Rol"
                  value={form.Rol}
                  onChange={this.handleChange}
                >
                  <option value="">Seleccionar rol</option>
                  {roles.map((rol, index) => (
                    <option key={index} value={rol}>{rol}</option>
                  ))}
                </Input>
                {validationErrors.Rol && <div className="text-danger">{validationErrors.Rol}</div>}
              </FormGroup>
              <FormGroup>
                <label>Documento:</label>
                <Input
                  type="number"
                  name="Documento"
                  value={form.Documento}
                  onChange={this.handleChange}
                  invalid={!!documentoError}
                />
                {documentoError && <div className="text-danger">{documentoError}</div>}
              </FormGroup>
              <FormGroup>
                <label>Estado:</label>
                <Input
                  type="checkbox"
                  name="estado"
                  checked={form.estado}
                  onChange={this.handleChange}
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.ocultarModalEditar}>Cancelar</Button>
              <Button color="primary" onClick={() => this.editar(form)}>Guardar cambios</Button>
            </ModalFooter>
          </Modal>
        </Container>
      </>
    );
  }
}

export default Empleados;
