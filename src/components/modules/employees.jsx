import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Container, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup, Input, ButtonGroup } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

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

    this.setState({ validationErrors: errors });
    return Object.keys(errors).length === 0;
  }

  Añadir = () => {
    if (!this.validateForm()) return;

    const valorNuevo = { ...this.state.form };
    valorNuevo.id = this.state.data.length + 1; 
    const lista = [...this.state.data, valorNuevo];
    this.setState({ data: lista, filteredData: lista, modalAñadir: false });
  }

  editar = (dato) => {
    if (!this.validateForm()) return;

    const lista = this.state.data.map(registro =>
      registro.id === dato.id ? { ...dato } : registro
    );
    this.setState({ data: lista, filteredData: lista, modalEditar: false });
  }

  eliminar = (dato) => {
    const opcion = window.confirm("Realmente desea eliminar el registro " + dato.id);
    if (opcion) {
      const lista = this.state.data.filter(registro => registro.id !== dato.id);
      this.setState({ data: lista, filteredData: lista });
    }
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
                <th>Documento</th>
                <th>Correo</th>
                <th>Celular</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {this.state.filteredData.map((elemento) => (
                <tr key={elemento.id}>
                  <td>{elemento.id}</td>
                  <td>{elemento.Nombre}</td>
                  <td>{elemento.Apellido}</td>
                  <td>{elemento.Documento}</td>
                  <td>{elemento.Correo}</td>
                  <td>{elemento.Celular}</td>
                  <td>{elemento.Rol}</td>
                  <td>{elemento.estado ? "Activo" : "Inactivo"}</td>
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
        </Container>

        {/* Modal para añadir empleado */}
        <Modal isOpen={modalAñadir} toggle={this.ocultarmodalAñadir}>
          <ModalHeader toggle={this.ocultarmodalAñadir}>Añadir empleado</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Input
                type="text"
                name="Nombre"
                placeholder="Nombre"
                value={form.Nombre}
                onChange={this.handleChange}
              />
              <small className="text-danger">{validationErrors.Nombre}</small>
            </FormGroup>
            <FormGroup>
              <Input
                type="text"
                name="Apellido"
                placeholder="Apellido"
                value={form.Apellido}
                onChange={this.handleChange}
              />
              <small className="text-danger">{validationErrors.Apellido}</small>
            </FormGroup>
            <FormGroup>
              <Input
                type="text"
                name="Correo"
                placeholder="Correo"
                value={form.Correo}
                onChange={this.handleChange}
              />
              <small className="text-danger">{validationErrors.Correo || emailError}</small>
            </FormGroup>
            <FormGroup>
              <Input
                type="text"
                name="Celular"
                placeholder="Celular"
                value={form.Celular}
                onChange={this.handleChange}
              />
              <small className="text-danger">{validationErrors.Celular}</small>
            </FormGroup>
            <FormGroup>
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
            </FormGroup>
            <FormGroup>
              <Input
                type="text"
                name="Documento"
                placeholder="Documento"
                value={form.Documento}
                onChange={this.handleChange}
              />
              <small className="text-danger">{validationErrors.Documento || documentoError}</small>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.ocultarmodalAñadir}>Cancelar</Button>
            <Button color="primary" onClick={this.Añadir}>Añadir</Button>
          </ModalFooter>
        </Modal>

        {/* Modal para editar empleado */}
        <Modal isOpen={modalEditar} toggle={this.ocultarModalEditar}>
          <ModalHeader toggle={this.ocultarModalEditar}>Editar empleado</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Input
                type="text"
                name="Nombre"
                placeholder="Nombre"
                value={form.Nombre}
                onChange={this.handleChange}
              />
              <small className="text-danger">{validationErrors.Nombre}</small>
            </FormGroup>
            <FormGroup>
              <Input
                type="text"
                name="Apellido"
                placeholder="Apellido"
                value={form.Apellido}
                onChange={this.handleChange}
              />
              <small className="text-danger">{validationErrors.Apellido}</small>
            </FormGroup>
            <FormGroup>
              <Input
                type="text"
                name="Correo"
                placeholder="Correo"
                value={form.Correo}
                onChange={this.handleChange}
              />
              <small className="text-danger">{validationErrors.Correo || emailError}</small>
            </FormGroup>
            <FormGroup>
              <Input
                type="text"
                name="Celular"
                placeholder="Celular"
                value={form.Celular}
                onChange={this.handleChange}
              />
              <small className="text-danger">{validationErrors.Celular}</small>
            </FormGroup>
            <FormGroup>
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
            </FormGroup>
            <FormGroup>
              <Input
                type="text"
                name="Documento"
                placeholder="Documento"
                value={form.Documento}
                onChange={this.handleChange}
              />
              <small className="text-danger">{validationErrors.Documento || documentoError}</small>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.ocultarModalEditar}>Cancelar</Button>
            <Button color="primary" onClick={() => this.editar(form)}>Guardar cambios</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

export default Empleados;
