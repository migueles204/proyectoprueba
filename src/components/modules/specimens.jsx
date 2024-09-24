import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Container, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup, Input, ButtonGroup } from 'reactstrap';
import Swal from 'sweetalert2';

// Datos iniciales de ejemplares
const initialData = [
  { id: 1, Ejemplar: "Don Juan", FechaLlegada: "2024-01-15", estado: true },
  { id: 2, Ejemplar: "NN", FechaLlegada: "2024-02-20", estado: true },
  { id: 3, Ejemplar: "Don Ramon", FechaLlegada: "2024-03-10", estado: true }
];

// Datos iniciales de tarjetas
const initialTarjetas = [
  { id: 1, titulo: 'Girardota', espaciosDisponibles: 5, ejemplaresRegistrados: 10 },
  { id: 2, titulo: 'Portachuelo', espaciosDisponibles: 3, ejemplaresRegistrados: 8 },
  { id: 3, titulo: 'Tamesis', espaciosDisponibles: 7, ejemplaresRegistrados: 12 },
];

class Specimens extends React.Component {
  state = {
    data: initialData,
    filteredData: initialData,
    form: {
      id: '',
      Ejemplar: '',
      FechaLlegada: '',
      estado: true,
      tarjetaId: '',
      cantidadEspacios: 1  // Nueva propiedad para la cantidad de espacios
    },
    searchText: '',
    ejemplarError: '',
    fechaError: '',
    modalAñadir: false,
    tarjetas: initialTarjetas,
  };

  handleChange = e => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
      ejemplarError: '',
      fechaError: ''
    });
  }

  handleSearch = e => {
    const searchText = e.target.value.toLowerCase();
    this.setState({
      searchText,
      filteredData: this.state.data.filter(item =>
        item.Ejemplar.toLowerCase().includes(searchText) ||
        item.FechaLlegada.includes(searchText)
      )
    });
  }

  mostrarmodalAñadir = () => {
    this.setState({
      modalAñadir: true,
      form: {
        id: '',
        Ejemplar: '',
        FechaLlegada: '',
        estado: true,
        tarjetaId: '',
        cantidadEspacios: 1  // Restablecer cantidad de espacios al abrir el modal
      }
    });
  }

  ocultarmodalAñadir = () => {
    this.setState({ modalAñadir: false });
  }

  Añadir = () => {
    const { tarjetaId, cantidadEspacios } = this.state.form;

    if (!tarjetaId) {
      Swal.fire('Error', 'Selecciona una tarjeta.', 'error');
      return;
    }

    if (isNaN(cantidadEspacios) || cantidadEspacios <= 0) {
      Swal.fire('Error', 'La cantidad de espacios debe ser un número positivo.', 'error');
      return;
    }

    const tarjetaIndex = this.state.tarjetas.findIndex(t => t.id === parseInt(tarjetaId));

    if (tarjetaIndex === -1) {
      Swal.fire('Error', 'Tarjeta no válida.', 'error');
      return;
    }

    const tarjetasActualizadas = [...this.state.tarjetas];
    tarjetasActualizadas[tarjetaIndex].espaciosDisponibles += parseInt(cantidadEspacios);

    this.setState({ tarjetas: tarjetasActualizadas, modalAñadir: false });
    Swal.fire('Éxito', 'Espacio(s) añadido(s) exitosamente.', 'success');
  }

  cambiarEstado = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas cambiar el estado de este ejemplar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const lista = this.state.data.map(registro =>
          registro.id === id ? { ...registro, estado: !registro.estado } : registro
        );
        this.setState({ data: lista, filteredData: lista });
        Swal.fire('Estado cambiado', 'El estado del ejemplar ha sido actualizado.', 'success');
      }
    });
  }

  render() {
    const { form, modalAñadir, ejemplarError, fechaError, tarjetas } = this.state;

    return (
      <Container>
        <div className="d-flex justify-content-center mb-3">
          <h1 className="text-center border p-2">Ejemplares</h1>
        </div>
        <div className="d-flex justify-content-between mb-3">
          <Input
            type="text"
            placeholder="Buscar"
            value={this.state.searchText}
            onChange={this.handleSearch}
            style={{ width: '300px' }}
          />
          <Button color="success" onClick={this.mostrarmodalAñadir}>Añadir un espacio</Button>
        </div>

        <div className="d-flex">
          <Table className="table table-bordered" style={{ flex: 2 }}>
            <thead>
              <tr>
                <th>Id</th>
                <th>Ejemplar</th>
                <th>Fecha de llegada</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {this.state.filteredData.map((elemento) => (
                <tr key={elemento.id}>
                  <td>{elemento.id}</td>
                  <td>{elemento.Ejemplar}</td>
                  <td>{elemento.FechaLlegada}</td>
                  <td>{elemento.estado ? "Activo" : "Inactivo"}</td>
                  <td>
                    <ButtonGroup>
                      <Button 
                        color={elemento.estado ? "secondary" : "success"} 
                        onClick={() => this.cambiarEstado(elemento.id)}
                        size="sm"
                        className="mr-1"
                      >
                        {elemento.estado ? "Off" : "On"}
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div style={{ flex: 1, marginLeft: '20px' }}>
            <h2 className="text-center">Estadísticas de Tarjetas</h2>
            <Table className="table table-bordered" size="sm">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Espacios Disponibles</th>
                  <th>Ejemplares Registrados</th>
                </tr>
              </thead>
              <tbody>
                {tarjetas.map(tarjeta => (
                  <tr key={tarjeta.id}>
                    <td>{tarjeta.titulo}</td>
                    <td>{tarjeta.espaciosDisponibles}</td>
                    <td>{tarjeta.ejemplaresRegistrados}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>

        {/* Modal para añadir un espacio */}
        <Modal isOpen={modalAñadir}>
          <ModalHeader>
            <h3>Añadir un espacio</h3>
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <label>Seleccionar Tarjeta:</label>
              <Input 
                type="select"
                name="tarjetaId"
                value={form.tarjetaId}
                onChange={this.handleChange}
              >
                <option value="">Selecciona una tarjeta</option>
                {tarjetas.map(tarjeta => (
                  <option key={tarjeta.id} value={tarjeta.id}>
                    {tarjeta.titulo}
                  </option>
                ))}
              </Input>
              <small className="text-danger">{ejemplarError}</small>
            </FormGroup>
            <FormGroup>
              <label>Cantidad de espacios:</label>
              <Input
                className="form-control"
                name="cantidadEspacios"
                type="number"
                min="1"
                value={form.cantidadEspacios}
                onChange={this.handleChange}
              />
              <small className="text-danger">{fechaError}</small>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.Añadir}>Añadir</Button>
            <Button color="secondary" onClick={this.ocultarmodalAñadir}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      </Container>
    );
  }
}

export default Specimens;
