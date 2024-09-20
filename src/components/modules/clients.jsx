import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Container, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup, Input, ButtonGroup } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

// Datos iniciales de clientes con estado de activación
const data = [
  { id: 1, Nombre: "Carolina Guzman", TypeDocument: "Pasaporte", Document: 16514416, Correo: "guzman@gmail.com", Celular: "3546549", Nejemplares: 5, estado: true },
  { id: 2, Nombre: "Andra Torres", TypeDocument: "Cedula de Ciudadania", Document: 18761919, Correo: "torres@gmail.com", Celular: "3546549", Nejemplares: 2, estado: false },
  { id: 3, Nombre: "Natalia Muriel", TypeDocument: "Cedula de Extranjeria", Document: 1016177143, Correo: "muriel@gmail.com", Celular: "3546549", Nejemplares: 1, estado: true }
];

// Lista de tipos de documentos
const tiposDocumento = [
  'Cedula de Ciudadania',
  'Cedula de Extranjeria',
  'Pasaporte'
];

class Clientes extends React.Component {
  state = {
    data: data,
    filteredData: data,
    form: {
      id: '',
      Nombre: '',
      TypeDocument: '',
      Document: '',
      Correo: '',
      Celular: '',
      Nejemplares: '',
      estado: true
    },
    modalAñadir: false,
    modalEditar: false,
    searchText: '',
    emailError: '',
    documentError: '',
    nameError: ''
  };

  handleChange = e => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      }
    });
  }

  handleSearch = e => {
    const searchText = e.target.value.toLowerCase();
    this.setState({
      searchText,
      filteredData: this.filterData(searchText)
    });
  }

  filterData = (searchText) => {
    return this.state.data.filter(item =>
      (item.Nombre.toLowerCase().includes(searchText) ||
      item.Document.toString().includes(searchText) ||
      item.Correo.toLowerCase().includes(searchText) ||
      item.Celular.toString().includes(searchText))
    );
  }

  mostrarmodalAñadir = () => {
    this.setState({
      modalAñadir: true,
      emailError: '',
      documentError: '',
      nameError: '',
      form: {
        id: '',
        Nombre: '',
        TypeDocument: '',
        Document: '',
        Correo: '',
        Celular: '',
        Nejemplares: '',
        estado: true
      }
    });
  }

  ocultarmodalAñadir = () => {
    this.setState({ modalAñadir: false });
  }

  mostrarModalEditar = (registro) => {
    this.setState({ modalEditar: true, form: registro, emailError: '', documentError: '', nameError: '' });
  }

  ocultarModalEditar = () => {
    this.setState({ modalEditar: false });
  }

  validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateName = name => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name);
  }

  documentExists = document => {
    return this.state.data.some(item => item.Document === document);
  }

  Añadir = () => {
    const { Nombre, TypeDocument, Document, Correo, Celular, Nejemplares } = this.state.form;

    // Validar campos obligatorios
    if (!Nombre || !TypeDocument || !Document || !Correo || !Celular || !Nejemplares) {
      Swal.fire('Error', 'Todos los campos son obligatorios.', 'error');
      return;
    }

    // Validar nombre
    if (!this.validateName(Nombre)) {
      this.setState({ nameError: 'El nombre no puede contener números.' });
      return;
    }

    // Validar correo electrónico
    if (!this.validateEmail(Correo)) {
      this.setState({ emailError: 'El correo electrónico no es válido.' });
      return;
    }

    // Validar documento
    if (this.documentExists(parseInt(Document))) {
      this.setState({ documentError: 'El documento ya existe.' });
      return;
    }

    const valorNuevo = { ...this.state.form, id: this.state.data.length + 1 };
    const lista = [...this.state.data, valorNuevo];
    this.setState({ data: lista, filteredData: this.filterData(this.state.searchText), modalAñadir: false });
    Swal.fire('Éxito', 'Cliente registrado exitosamente.', 'success');
  }

  editar = (dato) => {
    // Validar campos obligatorios
    if (!dato.Nombre || !dato.TypeDocument || !dato.Document || !dato.Correo || !dato.Celular || !dato.Nejemplares) {
      Swal.fire('Error', 'Todos los campos son obligatorios.', 'error');
      return;
    }

    // Validar nombre
    if (!this.validateName(dato.Nombre)) {
      this.setState({ nameError: 'El nombre no puede contener números.' });
      return;
    }

    // Validar correo electrónico
    if (!this.validateEmail(dato.Correo)) {
      this.setState({ emailError: 'El correo electrónico no es válido.' });
      return;
    }

    // Validar documento
    const existingDocument = this.state.data.find(item => item.Document === dato.Document && item.id !== dato.id);
    if (existingDocument) {
      this.setState({ documentError: 'El documento ya existe.' });
      return;
    }

    const lista = this.state.data.map(registro =>
      registro.id === dato.id ? { ...dato } : registro
    );
    this.setState({ data: lista, filteredData: this.filterData(this.state.searchText), modalEditar: false });
    Swal.fire('Éxito', 'Cliente actualizado exitosamente.', 'success');
  }

  eliminar = (dato) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Realmente deseas eliminar el registro ${dato.id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        const lista = this.state.data.filter(registro => registro.id !== dato.id);
        this.setState({ data: lista, filteredData: this.filterData(this.state.searchText) });
        Swal.fire('Eliminado', 'Cliente eliminado exitosamente.', 'success');
      }
    });
  }

  toggleState = (id) => {
    const registro = this.state.data.find(item => item.id === id);
    
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Realmente deseas cambiar el estado del registro ${registro.id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        const lista = this.state.data.map(registro =>
          registro.id === id ? { ...registro, estado: !registro.estado } : registro
        );
        this.setState({ data: lista, filteredData: this.filterData(this.state.searchText) });
        Swal.fire('Estado cambiado', `El estado del cliente ${id} ha sido actualizado.`, 'success');
      }
    });
  }

  render() {
    const { form, modalAñadir, modalEditar, emailError, documentError, nameError } = this.state;

    return (
      <>
        <Container>
          <p></p>
          <div className="d-flex justify-content-between mb-3">
            <Input
              type="text"
              placeholder="Buscar"
              value={this.state.searchText}
              onChange={this.handleSearch}
              style={{ width: '300px' }}
            />
            <Button color="success" onClick={this.mostrarmodalAñadir}>Añadir cliente</Button>
          </div>

          <Table className="table table-bordered">
            <thead>
              <tr>
                <th>Id</th>
                <th>Nombre Completo</th>
                <th>Tipo Documento</th>
                <th>Documento</th>
                <th>Correo</th>
                <th>Celular</th>
                <th>Nejemplares</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {this.state.filteredData.map((elemento) => (
                <tr key={elemento.id}>
                  <td>{elemento.id}</td>
                  <td>{elemento.Nombre}</td>
                  <td>{elemento.TypeDocument}</td>
                  <td>{elemento.Document}</td>
                  <td>{elemento.Correo}</td>
                  <td>{elemento.Celular}</td>
                  <td>{elemento.Nejemplares}</td>
                  <td>{elemento.estado ? "Activo" : "Inactivo"}</td>
                  <td>
                    <ButtonGroup>
                      <Button 
                        color={elemento.estado ? "secondary" : "success"} 
                        onClick={(e) => { e.stopPropagation(); this.toggleState(elemento.id); }}
                        size="sm"
                        className="mr-1"
                      >
                        {elemento.estado ? "Off" : "On"}
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

        {/* Modal para añadir un nuevo cliente */}
        <Modal isOpen={modalAñadir} toggle={this.ocultarmodalAñadir}>
          <ModalHeader toggle={this.ocultarmodalAñadir}>
            <h3>Añadir cliente</h3>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>Nombre Completo:</label>
              <input className="form-control" name="Nombre" type="text" onChange={this.handleChange} />
              <small className="text-danger">{nameError}</small>
            </FormGroup>

            <FormGroup>
              <label>Tipo de Documento:</label>
              <select className="form-control" name="TypeDocument" onChange={this.handleChange} value={form.TypeDocument}>
                <option value="">Selecciona un tipo de documento</option>
                {tiposDocumento.map((tipo, index) => (
                  <option key={index} value={tipo}>{tipo}</option>
                ))}
              </select>
              <small className="text-danger">{documentError}</small>
            </FormGroup>

            <FormGroup>
              <label>Documento:</label>
              <input className="form-control" name="Document" type="text" onChange={this.handleChange} />
              <small className="text-danger">{documentError}</small>
            </FormGroup>

            <FormGroup>
              <label>Correo:</label>
              <input className="form-control" name="Correo" type="text" onChange={this.handleChange} />
              <small className="text-danger">{emailError}</small>
            </FormGroup>

            <FormGroup>
              <label>Celular:</label>
              <input className="form-control" name="Celular" type="text" onChange={this.handleChange} />
            </FormGroup>

            <FormGroup>
              <label>Nejemplares:</label>
              <input className="form-control" name="Nejemplares" type="number" onChange={this.handleChange} />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button color="primary" onClick={this.Añadir}>Añadir</Button>
            <Button color="secondary" onClick={this.ocultarmodalAñadir}>Cancelar</Button>
          </ModalFooter>
        </Modal>

        {/* Modal para editar un cliente */}
        <Modal isOpen={modalEditar} toggle={this.ocultarModalEditar}>
          <ModalHeader toggle={this.ocultarModalEditar}>
            <h3>Editar cliente</h3>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>Nombre Completo:</label>
              <input
                className="form-control"
                name="Nombre"
                type="text"
                value={form.Nombre}
                onChange={this.handleChange}
              />
              <small className="text-danger">{nameError}</small>
            </FormGroup>

            <FormGroup>
              <label>Tipo de Documento:</label>
              <select className="form-control" name="TypeDocument" onChange={this.handleChange} value={form.TypeDocument}>
                <option value="">Selecciona un tipo de documento</option>
                {tiposDocumento.map((tipo, index) => (
                  <option key={index} value={tipo}>{tipo}</option>
                ))}
              </select>
              <small className="text-danger">{documentError}</small>
            </FormGroup>

            <FormGroup>
              <label>Documento:</label>
              <input
                className="form-control"
                name="Document"
                type="text"
                value={form.Document}
                onChange={this.handleChange}
              />
              <small className="text-danger">{documentError}</small>
            </FormGroup>

            <FormGroup>
              <label>Correo:</label>
              <input
                className="form-control"
                name="Correo"
                type="text"
                value={form.Correo}
                onChange={this.handleChange}
              />
              <small className="text-danger">{emailError}</small>
            </FormGroup>

            <FormGroup>
              <label>Celular:</label>
              <input
                className="form-control"
                name="Celular"
                type="text"
                value={form.Celular}
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>Nejemplares:</label>
              <input
                className="form-control"
                name="Nejemplares"
                type="number"
                value={form.Nejemplares}
                onChange={this.handleChange}
              />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button color="primary" onClick={() => this.editar(form)}>Actualizar</Button>
            <Button color="secondary" onClick={this.ocultarModalEditar}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

export default Clientes;
