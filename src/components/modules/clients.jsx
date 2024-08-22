import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Container, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup, Input } from 'reactstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

// Datos iniciales de clientes
const data = [
  { id: 1, Nombre: "Carolina Guzman", Document: 16514416, Correo: "guzman@gmail.com", Celular: "3546549", Nejemplares: 5 },
  { id: 2, Nombre: "Andra Torres", Document: 18761919, Correo: "torres@gmail.com", Celular: "3546549", Nejemplares: 2 },
  { id: 3, Nombre: "Natalia Muriel", Document: 1016177143, Correo: "muriel@gmail.com", Celular: "3546549", Nejemplares: 1 }
];

class Clientes extends React.Component {
  state = {
    data: data,
    filteredData: data,
    form: {
      id: '',
      Nombre: '',
      Document: '',
      Correo: '',
      Celular: '',
      Nejemplares: ''
    },
    modalAñadir: false,
    modalEditar: false,
    searchText: '',
    emailError: '',
    documentError: ''
  };

  // Maneja los cambios en los campos del formulario
  handleChange = e => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      }
    });
  }

  // Maneja la búsqueda de clientes
  handleSearch = e => {
    const searchText = e.target.value.toLowerCase();
    this.setState({
      searchText,
      filteredData: this.state.data.filter(item =>
        item.Nombre.toLowerCase().includes(searchText) ||
        item.Document.toString().includes(searchText) ||
        item.Correo.toLowerCase().includes(searchText) ||
        item.Celular.toString().includes(searchText)
      )
    });
  }

  // Muestra el modal para añadir un nuevo cliente
  mostrarmodalAñadir = () => {
    this.setState({ modalAñadir: true, emailError: '', documentError: '' });
  }

  // Oculta el modal para añadir un nuevo cliente
  ocultarmodalAñadir = () => {
    this.setState({ modalAñadir: false });
  }

  // Muestra el modal para editar un cliente existente
  mostrarModalEditar = (registro) => {
    this.setState({ modalEditar: true, form: registro, emailError: '', documentError: '' });
  }

  // Oculta el modal para editar un cliente
  ocultarModalEditar = () => {
    this.setState({ modalEditar: false });
  }

  // Valida el correo electrónico
  validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Valida si el documento ya existe
  documentExists = document => {
    return this.state.data.some(item => item.Document === document);
  }

  // Añade un nuevo cliente a la lista
  Añadir = () => {
    const { Nombre, Document, Correo, Celular, Nejemplares } = this.state.form;

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
    this.setState({ data: lista, filteredData: lista, modalAñadir: false });
  }

  // Edita un cliente existente en la lista
  editar = (dato) => {
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
    this.setState({ data: lista, filteredData: lista, modalEditar: false });
  }

  // Elimina un cliente de la lista después de una confirmación
  eliminar = (dato) => {
    const opcion = window.confirm("Realmente desea eliminar el registro " + dato.id);
    if (opcion) {
      const lista = this.state.data.filter(registro => registro.id !== dato.id);
      this.setState({ data: lista, filteredData: lista });
    }
  }

  render() {
    const { form, modalAñadir, modalEditar, emailError, documentError } = this.state;

    return (
      <>
        <Container>
          <div className="d-flex justify-content-center mb-3">
            <h1 className="text-center border p-2">Clientes</h1>
          </div>
          <div className="d-flex justify-content-between mb-3">
            <Button color="success" onClick={this.mostrarmodalAñadir}>Añadir cliente</Button>
            <Input
              type="text"
              placeholder="Buscar cliente"
              value={this.state.searchText}
              onChange={this.handleSearch}
              style={{ width: '300px' }}
            />
          </div>
         
          <Table className="table table-bordered " style={{ width: '1250px', height: '200px' }}>
            <thead>
              <tr>
                <th>Id</th>
                <th>Nombre</th>
                <th>Documento</th>
                <th>Correo</th>
                <th>Celular</th>
                <th>Nejemplares</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {this.state.filteredData.map((elemento) => (
                <tr key={elemento.id}>
                  <td>{elemento.id}</td>
                  <td>{elemento.Nombre}</td>
                  <td>{elemento.Document}</td>
                  <td>{elemento.Correo}</td>
                  <td>{elemento.Celular}</td>
                  <td>{elemento.Nejemplares}</td>
                  <td>
                    <Button color="black" onClick={() => this.mostrarModalEditar(elemento)}><FaEdit /></Button>{' '}
                    <Button color="danger" onClick={() => this.eliminar(elemento)}><FaTrashAlt /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>

        {/* Modal para añadir un nuevo cliente */}
        <Modal isOpen={modalAñadir}>
          <ModalHeader>
            <div>
              <h3>Añadir cliente</h3>
            </div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>Nombre:</label>
              <input className="form-control" name="Nombre" type="text" onChange={this.handleChange} />
            </FormGroup>

            <FormGroup>
              <label>Documento:</label>
              <input className="form-control" name="Document" type="number" onChange={this.handleChange} />
              <small className="text-danger">{this.state.documentError}</small>
            </FormGroup>

            <FormGroup>
              <label>Correo:</label>
              <input className="form-control" name="Correo" type="text" onChange={this.handleChange} />
              <small className="text-danger">{emailError}</small>
            </FormGroup>

            <FormGroup>
              <label>Celular:</label>
              <input className="form-control" name="Celular" type="number" onChange={this.handleChange} />
            </FormGroup>

            <FormGroup>
              <label>Número de ejemplares a registrar:</label>
              <input className="form-control" name="Nejemplares" type="number" onChange={this.handleChange} />
            </FormGroup>

            <ModalFooter>
              <Button color="primary" onClick={this.Añadir}>Añadir</Button>
              <Button color="danger" onClick={this.ocultarmodalAñadir}>Cancelar</Button>
            </ModalFooter>
          </ModalBody>
        </Modal>

        {/* Modal para editar un cliente existente */}
        <Modal isOpen={modalEditar}>
          <ModalHeader>
            <div>
              <h3>Editar</h3>
            </div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>Nombre:</label>
              <input className="form-control" name="Nombre" type="text" onChange={this.handleChange} value={form.Nombre} />
            </FormGroup>

            <FormGroup>
              <label>Documento:</label>
              <input className="form-control" name="Document" type="number" onChange={this.handleChange} value={form.Document} />
              <small className="text-danger">{documentError}</small>
            </FormGroup>

            <FormGroup>
              <label>Correo:</label>
              <input className="form-control" name="Correo" type="text" onChange={this.handleChange} value={form.Correo} />
              <small className="text-danger">{emailError}</small>
            </FormGroup>

            <FormGroup>
              <label>Celular:</label>
              <input className="form-control" name="Celular" type="number" onChange={this.handleChange} value={form.Celular} />
            </FormGroup>

            <FormGroup>
              <label>Número de ejemplares a registrar:</label>
              <input className="form-control" name="Nejemplares" type="number" onChange={this.handleChange} value={form.Nejemplares} />
            </FormGroup>

            <ModalFooter>
              <Button color="primary" onClick={() => this.editar(form)}>Editar</Button>
              <Button color="danger" onClick={this.ocultarModalEditar}>Cancelar</Button>
            </ModalFooter>
          </ModalBody>
        </Modal>
      </>
    )
  }
}

export default Clientes;