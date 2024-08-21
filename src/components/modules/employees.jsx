import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Container, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup, Input } from 'reactstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

// Datos iniciales de empleados
const data = [
  { id: 1, Nombre: "Lionel", Apellido: "Messi", Correo: "messi@gmail.com", Celular: 3005242585, Rol: "palafrenero", estado: true },
  { id: 2, Nombre: "Keimer", Apellido: "Lezcano", Correo: "keimer@gmail.com", Celular: 3000000000, Rol: "veterinario", estado: true },
];

// Lista de roles disponibles para seleccionar
const roles = ["palafrenero", "veterinario", "cuidador", "administrador"];

class Empleados extends React.Component {
  state = { 
    data: data, // Datos originales de empleados
    filteredData: data, // Datos filtrados según la búsqueda
    form: {
      id: '', // ID del empleado (se genera automáticamente)
      Nombre: '', // Nombre del empleado
      Apellido: '', // Apellido del empleado
      Correo: '', // Correo electrónico del empleado
      Celular: '', // Número de celular del empleado
      Rol: 'Seleccione', // Rol del empleado (valor por defecto)
      estado: true // Estado del empleado (activo/inactivo)
    },
    modalAñadir: false, // Estado que controla la visibilidad del modal de añadir
    modalEditar: false, // Estado que controla la visibilidad del modal de editar
    searchText: '' // Texto de búsqueda
  };

  // Maneja los cambios en los campos del formulario
  handleChange = e => {
    const { name, value, type, checked } = e.target;
    this.setState({
      form: {
        ...this.state.form,
        [name]: type === 'checkbox' ? checked : value,
      }
    });
  }

  // Maneja la búsqueda de empleados
  handleSearch = e => {
    const searchText = e.target.value.toLowerCase();
    this.setState({
      searchText,
      filteredData: this.state.data.filter(item =>
        item.Nombre.toLowerCase().includes(searchText) ||
        item.Apellido.toLowerCase().includes(searchText) ||
        item.Correo.toLowerCase().includes(searchText) ||
        item.Rol.toLowerCase().includes(searchText)
      )
    });
  }

  // Muestra el modal para añadir un nuevo empleado
  mostrarmodalAñadir = () => {
    this.setState({ modalAñadir: true });
  }

  // Oculta el modal para añadir un nuevo empleado
  ocultarmodalAñadir = () => {
    this.setState({ modalAñadir: false });
  }

  // Muestra el modal para editar un empleado existente
  mostrarModalEditar = (registro) => {
    this.setState({ modalEditar: true, form: registro });
  }

  // Oculta el modal para editar un empleado
  ocultarModalEditar = () => {
    this.setState({ modalEditar: false });
  }

  // Añade un nuevo empleado a la lista
  Añadir = () => {
    const valorNuevo = { ...this.state.form };
    valorNuevo.id = this.state.data.length + 1; // Genera un nuevo ID
    const lista = [...this.state.data, valorNuevo];
    this.setState({ data: lista, filteredData: lista, modalAñadir: false });
  }

  // Edita un empleado existente en la lista
  editar = (dato) => {
    const lista = this.state.data.map(registro =>
      registro.id === dato.id ? { ...dato } : registro
    );
    this.setState({ data: lista, filteredData: lista, modalEditar: false });
  }

  // Elimina un empleado de la lista después de una confirmación
  eliminar = (dato) => {
    const opcion = window.confirm("Realmente desea eliminar el registro " + dato.id);
    if (opcion) {
      const lista = this.state.data.filter(registro => registro.id !== dato.id);
      this.setState({ data: lista, filteredData: lista });
    }
  }

  // Cambia el estado (activo/inactivo) de un empleado
  cambiarEstado = (id) => {
    const lista = this.state.data.map(registro =>
      registro.id === id ? { ...registro, estado: !registro.estado } : registro
    );
    this.setState({ data: lista, filteredData: lista });
  }

  render() {
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
                  <td>{elemento.Correo}</td>
                  <td>{elemento.Celular}</td>
                  <td>{elemento.Rol}</td>
                  <td>{elemento.estado ? "Activo" : "Inactivo"}</td>
                  <td>
                    <Button
                      color={elemento.estado ? "success" : "secondary"}
                      onClick={(e) => { e.stopPropagation(); this.cambiarEstado(elemento.id); }}
                      size="sm"
                      className="mr-1"
                    >
                      {elemento.estado ? "On" : "Off"}
                    </Button>
                    <Button color="primary" onClick={() => this.mostrarModalEditar(elemento)}><FaEdit /></Button>{' '}
                    <Button color="danger" onClick={() => this.eliminar(elemento)}><FaTrashAlt /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>

        {/* Modal para añadir un nuevo empleado */}
        <Modal isOpen={this.state.modalAñadir}>
          <ModalHeader>
            <div>
              <h3>Añadir Empleado</h3>
            </div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>Id:</label>
              <input className="form-control" readOnly type="text" value={this.state.data.length + 1} />
            </FormGroup>

            <FormGroup>
              <label>Nombre:</label>
              <input className="form-control" name="Nombre" type="text" onChange={this.handleChange} />
            </FormGroup>

            <FormGroup>
              <label>Apellido:</label>
              <input className="form-control" name="Apellido" type="text" onChange={this.handleChange} />
            </FormGroup>

            <FormGroup>
              <label>Correo:</label>
              <input className="form-control" name="Correo" type="text" onChange={this.handleChange} />
            </FormGroup>

            <FormGroup>
              <label>Celular:</label>
              <input className="form-control" name="Celular" type="number" onChange={this.handleChange} />
            </FormGroup>

            <FormGroup>
              <label>Rol:</label>
              <select className="form-control" name="Rol" value={this.state.form.Rol} onChange={this.handleChange}>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </FormGroup>

            <FormGroup>
              <label>Estado:</label>
              <Input type="checkbox" name="estado" checked={this.state.form.estado} onChange={this.handleChange} />
            </FormGroup>

            <ModalFooter>
              <Button color="primary" onClick={this.Añadir}>Añadir</Button>
              <Button color="danger" onClick={this.ocultarmodalAñadir}>Cancelar</Button>
            </ModalFooter>
          </ModalBody>
        </Modal>

        {/* Modal para editar un empleado existente */}
        <Modal isOpen={this.state.modalEditar}>
          <ModalHeader>
            <div>
              <h3>Editar</h3>
            </div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>Id:</label>
              <input className="form-control" readOnly type="text" value={this.state.form.id} />
            </FormGroup>

            <FormGroup>
              <label>Nombre:</label>
              <input className="form-control" name="Nombre" type="text" onChange={this.handleChange} value={this.state.form.Nombre} />
            </FormGroup>

            <FormGroup>
              <label>Apellido:</label>
              <input className="form-control" name="Apellido" type="text" onChange={this.handleChange} value={this.state.form.Apellido} />
            </FormGroup>

            <FormGroup>
              <label>Correo:</label>
              <input className="form-control" name="Correo" type="text" onChange={this.handleChange} value={this.state.form.Correo} />
            </FormGroup>

            <FormGroup>
              <label>Celular:</label>
              <input className="form-control" name="Celular" type="number" onChange={this.handleChange} value={this.state.form.Celular} />
            </FormGroup>

            <FormGroup>
              <label>Rol:</label>
              <select className="form-control" name="Rol" value={this.state.form.Rol} onChange={this.handleChange}>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </FormGroup>

            <FormGroup>
              <label>Estado:</label>
              <Input type="checkbox" name="estado" checked={this.state.form.estado} onChange={this.handleChange} />
            </FormGroup>

            <ModalFooter>
              <Button color="primary" onClick={() => this.editar(this.state.form)}>Guardar cambios</Button>
              <Button color="danger" onClick={this.ocultarModalEditar}>Cancelar</Button>
            </ModalFooter>
          </ModalBody>
        </Modal>
      </>
    );
  }
}

export default Empleados;
