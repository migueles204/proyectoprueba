// Alimentacion.jsx
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Container, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup, Input, ButtonGroup } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

// Datos iniciales de alimentación
const data = [
  { id: 1, Nombre: "Carne de res", Cantidad: 5, Frecuencia: "Diaria", Estado: 'Administrado' },
  { id: 2, Nombre: "Leche", Cantidad: 10, Frecuencia: "Semanal", Estado: 'No administrado' },
  { id: 3, Nombre: "Manzanas", Cantidad: 20, Frecuencia: "Diaria", Estado: 'Administrado' }
];

class Alimentacion extends React.Component {
  state = {
    data: data,
    filteredData: data,
    form: {
      id: '',
      Nombre: '',
      Cantidad: '',
      Frecuencia: '',
      Estado: 'No administrado'
    },
    modalAñadir: false,
    modalEditar: false,
    searchText: '',
    nombreError: '',
    cantidadError: '',
    frecuenciaError: ''
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
      filteredData: this.state.data.filter(item =>
        item.Nombre.toLowerCase().includes(searchText) ||
        item.Frecuencia.toLowerCase().includes(searchText)
      )
    });
  }

  mostrarmodalAñadir = () => {
    this.setState({
      modalAñadir: true,
      nombreError: '',
      cantidadError: '',
      frecuenciaError: '',
      form: {
        id: '',
        Nombre: '',
        Cantidad: '',
        Frecuencia: '',
        Estado: true
      }
    });
  }

  ocultarmodalAñadir = () => {
    this.setState({ modalAñadir: false });
  }

  mostrarModalEditar = (registro) => {
    this.setState({ modalEditar: true, form: { ...registro }, nombreError: '', cantidadError: '', frecuenciaError: '' });
  }

  ocultarModalEditar = () => {
    this.setState({ modalEditar: false });
  }

  validateNombre = nombre => {
    return nombre.trim().length > 0;
  }

  validateCantidad = cantidad => {
    return !isNaN(cantidad) && cantidad > 0;
  }

  validateFrecuencia = frecuencia => {
    return frecuencia.trim().length > 0;
  }

  itemExists = nombre => {
    return this.state.data.some(item => item.Nombre === nombre);
  }

  Añadir = () => {
    const { Nombre, Cantidad, Frecuencia, Estado } = this.state.form;

    // Validar campos obligatorios
    if (!Nombre || !Cantidad || !Frecuencia) {
      Swal.fire('Error', 'Todos los campos son obligatorios.', 'error');
      return;
    }

    // Validar nombre
    if (!this.validateNombre(Nombre)) {
      this.setState({ nombreError: 'El nombre no puede estar vacío.' });
      return;
    }

    // Validar cantidad
    if (!this.validateCantidad(Cantidad)) {
      this.setState({ cantidadError: 'La cantidad debe ser un número positivo.' });
      return;
    }

    // Validar frecuencia
    if (!this.validateFrecuencia(Frecuencia)) {
      this.setState({ frecuenciaError: 'La frecuencia no puede estar vacía.' });
      return;
    }

    // Verificar si el ítem ya existe
    if (this.itemExists(Nombre)) {
      Swal.fire('Error', 'El ítem ya existe.', 'error');
      return;
    }

    const valorNuevo = { ...this.state.form, id: this.state.data.length + 1 };
    const lista = [...this.state.data, valorNuevo];
    this.setState({ data: lista, filteredData: lista, modalAñadir: false });
    Swal.fire('Éxito', 'Ítem registrado exitosamente.', 'success');
  }

  editar = (dato) => {
    // Validar campos obligatorios
    if (!dato.Nombre || !dato.Cantidad || !dato.Frecuencia) {
      Swal.fire('Error', 'Todos los campos son obligatorios.', 'error');
      return;
    }

    // Validar nombre
    if (!this.validateNombre(dato.Nombre)) {
      this.setState({ nombreError: 'El nombre no puede estar vacío.' });
      return;
    }

    // Validar cantidad
    if (!this.validateCantidad(dato.Cantidad)) {
      this.setState({ cantidadError: 'La cantidad debe ser un número positivo.' });
      return;
    }

    // Validar frecuencia
    if (!this.validateFrecuencia(dato.Frecuencia)) {
      this.setState({ frecuenciaError: 'La frecuencia no puede estar vacía.' });
      return;
    }

    // Verificar si el ítem ya existe
    const existingItem = this.state.data.find(item => item.Nombre === dato.Nombre && item.id !== dato.id);
    if (existingItem) {
      Swal.fire('Error', 'El ítem ya existe.', 'error');
      return;
    }

    const lista = this.state.data.map(registro =>
      registro.id === dato.id ? { ...dato } : registro
    );
    this.setState({ data: lista, filteredData: lista, modalEditar: false });
    Swal.fire('Éxito', 'Ítem actualizado exitosamente.', 'success');
  }

  eliminar = (dato) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Realmente deseas eliminar el ítem ${dato.id}?`,
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
        Swal.fire('Eliminado', 'Ítem eliminado exitosamente.', 'success');
      }
    });
  }

  toggleEstado = (id) => {
    const lista = this.state.data.map(registro =>
      registro.id === id ? { ...registro, Estado: registro.Estado === 'Administrado' ? 'No Administrado' : 'Administrado' } : registro
    );
    this.setState({ data: lista, filteredData: lista });
  }

  render() {
    const { form, modalAñadir, modalEditar, nombreError, cantidadError, frecuenciaError } = this.state;

    return (
      <Container>
        <div className="d-flex justify-content-between mb-3">
          <Input
            type="text"
            placeholder="Buscar"
            value={this.state.searchText}
            onChange={this.handleSearch}
            style={{ width: '300px' }}
          />
          <Button color="success" onClick={this.mostrarmodalAñadir}>Añadir alimento</Button>
        </div>

        <Table className="table table-bordered">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Frecuencia</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {this.state.filteredData.map((elemento) => (
              <tr key={elemento.id}>
                <td>{elemento.Nombre}</td>
                <td>{elemento.Cantidad}</td>
                <td>{elemento.Frecuencia}</td>
                <td>{elemento.Estado}</td>
                <td>
                <ButtonGroup>
                    <Button
                      color={elemento.Estado === 'Administrado' ? 'secondary' : 'success'}
                      onClick={() => this.toggleEstado(elemento.id)}
                      size="sm"
                      className="mr-1"
                    >
                      {elemento.Estado === 'Administrado' ? 'Off' : 'On'}
                    </Button>
                    <Button
                      color="dark"
                      onClick={() => this.mostrarModalEditar(elemento)}
                      size="sm"
                      className="mr-1"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button
                      color="danger"
                      onClick={() => this.eliminar(elemento)}
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

        {/* Modal para añadir un nuevo ítem */}
        <Modal isOpen={modalAñadir}>
          <ModalHeader>
            <div>
              <h3>Añadir ítem</h3>
            </div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>Nombre:</label>
              <Input className="form-control" name="Nombre" type="text" onChange={this.handleChange} />
              <small className="text-danger">{nombreError}</small>
            </FormGroup>

            <FormGroup>
              <label>Cantidad:</label>
              <Input className="form-control" name="Cantidad" type="number" onChange={this.handleChange} />
              <small className="text-danger">{cantidadError}</small>
            </FormGroup>

            <FormGroup>
              <label>Frecuencia:</label>
              <Input className="form-control" name="Frecuencia" type="text" onChange={this.handleChange} />
              <small className="text-danger">{frecuenciaError}</small>
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button color="primary" onClick={this.Añadir}>Añadir</Button>
            <Button color="secondary" onClick={this.ocultarmodalAñadir}>Cancelar</Button>
          </ModalFooter>
        </Modal>

        {/* Modal para editar un ítem */}
        <Modal isOpen={modalEditar}>
          <ModalHeader>
            <div>
              <h3>Editar ítem</h3>
            </div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>Nombre:</label>
              <Input
                className="form-control"
                name="Nombre"
                type="text"
                value={form.Nombre}
                onChange={this.handleChange}
              />
              <small className="text-danger">{nombreError}</small>
            </FormGroup>

            <FormGroup>
              <label>Cantidad:</label>
              <Input
                className="form-control"
                name="Cantidad"
                type="number"
                value={form.Cantidad}
                onChange={this.handleChange}
              />
              <small className="text-danger">{cantidadError}</small>
            </FormGroup>

            <FormGroup>
              <label>Frecuencia:</label>
              <Input
                className="form-control"
                name="Frecuencia"
                type="text"
                value={form.Frecuencia}
                onChange={this.handleChange}
              />
              <small className="text-danger">{frecuenciaError}</small>
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button color="primary" onClick={() => this.editar(form)}>Actualizar</Button>
            <Button color="secondary" onClick={this.ocultarModalEditar}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      </Container>
    );
  }
}

export default Alimentacion;
