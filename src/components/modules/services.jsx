import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const initialServices = [
  { id: 1, nombre: "Servicio 1", descripcion: "Descripción del servicio 1", imagen: "https://via.placeholder.com/300", estado: true },
  { id: 2, nombre: "Servicio 2", descripcion: "Descripción del servicio 2", imagen: "https://via.placeholder.com/300", estado: false },
  // Agrega más servicios según sea necesario para probar la paginación
];

class Services extends React.Component {
  state = {
    services: initialServices,
    searchTerm: '',
    form: {
      id: '',
      nombre: '',
      descripcion: '',
      imagen: '',
      estado: true,
      imagenFile: null,
    },
    modalAñadir: false,
    modalEditar: false,
    currentPage: 1,
    servicesPerPage: 4, // Se ajusta para mostrar 3-4 servicios por página
  };

  mostrarModalAñadir = () => {
    this.setState({
      modalAñadir: true,
      form: { id: '', nombre: '', descripcion: '', imagen: '', estado: true, imagenFile: null }
    });
  };

  ocultarModalAñadir = () => {
    this.setState({ modalAñadir: false });
  };

  mostrarModalEditar = (service) => {
    this.setState({ modalEditar: true, form: { ...service, imagenFile: null } });
  };

  ocultarModalEditar = () => {
    this.setState({ modalEditar: false });
  };

  handleChange = (e) => {
    const { name, value, type, files } = e.target;
    this.setState({
      form: {
        ...this.state.form,
        [name]: type === 'file' ? files[0] : value
      }
    });
  };

  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  handleImageUpload = (callback) => {
    const { imagenFile } = this.state.form;
    if (imagenFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.setState(
          {
            form: {
              ...this.state.form,
              imagen: reader.result
            }
          },
          () => {
            if (callback) callback();
          }
        );
      };
      reader.readAsDataURL(imagenFile);
    } else {
      if (callback) callback();
    }
  };

  añadirServicio = () => {
    this.handleImageUpload(() => {
      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas añadir este servicio?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, añadir',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          const nuevoServicio = { ...this.state.form };
          nuevoServicio.id = this.state.services.length + 1;
          const lista = [...this.state.services, nuevoServicio];
          this.setState({ services: lista, modalAñadir: false });
          Swal.fire('Éxito', 'Servicio añadido exitosamente.', 'success');
        }
      });
    });
  };

  editarServicio = () => {
    this.handleImageUpload(() => {
      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas guardar los cambios de este servicio?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, guardar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          const lista = this.state.services.map((s) =>
            s.id === this.state.form.id ? this.state.form : s
          );
          this.setState({ services: lista, modalEditar: false });
          Swal.fire('Éxito', 'Servicio actualizado exitosamente.', 'success');
        }
      });
    });
  };

  eliminarServicio = (service) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Realmente deseas eliminar el servicio ${service.id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const lista = this.state.services.filter((s) => s.id !== service.id);
        this.setState({ services: lista });
        Swal.fire('Eliminado', 'Servicio eliminado exitosamente.', 'success');
      }
    });
  };

  cambiarEstado = (id) => {
    const lista = this.state.services.map((service) =>
      service.id === id ? { ...service, estado: !service.estado } : service
    );
    this.setState({ services: lista });
  };

  handleClickPage = (event, pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  render() {
    const { services, searchTerm, form, modalAñadir, modalEditar, currentPage, servicesPerPage } = this.state;

    // Filtrado de servicios por término de búsqueda
    const filteredServices = services.filter(service =>
      service.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Lógica para la paginación
    const indexOfLastService = currentPage * servicesPerPage;
    const indexOfFirstService = indexOfLastService - servicesPerPage;
    const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);

    const renderServices = currentServices.map((service) => (
      <div className="card m-3" style={{ width: '21rem', height: '30rem', position: 'relative' }} key={service.id}>
        <img className="card-img-top" src={service.imagen} alt="Imagen del servicio" style={{ height: '300px', objectFit: 'cover' }} />
        <div className="card-body" style={{ position: 'relative' }}>
          <h5 className="card-title">{service.nombre}</h5>
          <p className="card-text">{service.descripcion}</p>
          <div className="d-flex flex-column align-items-start" style={{ position: 'absolute', bottom: '10px', width: '100%' }}>
            <FormGroup style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', padding: '0.2rem', borderRadius: '0.2rem', marginBottom: '1rem' }}>
              <Input
                type="text"
                value={service.estado ? "Activo" : "Inactivo"}
                disabled
                style={{ textAlign: 'start', border: 'none', backgroundColor: 'transparent', fontWeight: 'bold', fontSize: '0.8rem' }}/>
            </FormGroup>
            <div className="d-flex justify-content-start align-items-center">
              <Button
                color={service.estado ? "secondary" : "success"}
                onClick={() => this.cambiarEstado(service.id)}
                style={{ fontSize: '0.75rem', marginRight: '0.5rem' }}
              >
                {service.estado ? "Off" : "On"}
              </Button>
              <Button
                color="dark"
                onClick={() => this.mostrarModalEditar(service)}
                style={{ fontSize: '0.75rem', marginRight: '0.5rem' }}
              >
                <FontAwesomeIcon icon={faEdit} />
              </Button>
              <Button
                color="danger"
                onClick={() => this.eliminarServicio(service)}
                style={{ fontSize: '0.75rem' }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    ));

    return (
      <Container>
        <div className="row mb-4">
          <div className="col-md-6 mb-3">
            <Button color="success" onClick={this.mostrarModalAñadir}>Añadir servicio</Button>
          </div>
          <div className="col-md-6 mb-3">
            <Input
              type="text"
              placeholder="Buscar servicio..."
              value={searchTerm}
              onChange={this.handleSearchChange}
            />
          </div>
        </div>

        <div className="d-flex justify-content-center flex-wrap">
          {renderServices}
        </div>

        <div className="d-flex justify-content-center mt-3">
          <Stack spacing={2}>
            <Pagination count={Math.ceil(filteredServices.length / servicesPerPage)} page={currentPage} onChange={this.handleClickPage} />
          </Stack>
        </div>

        {/* Modal Añadir */}
        <Modal isOpen={modalAñadir} toggle={this.ocultarModalAñadir}>
          <ModalHeader toggle={this.ocultarModalAñadir}>Añadir Servicio</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={this.handleChange} />
            </FormGroup>
            <FormGroup>
              <Input type="text" name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={this.handleChange} />
            </FormGroup>
            <FormGroup>
              <Input type="file" name="imagenFile" onChange={this.handleChange} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.añadirServicio}>Añadir</Button>
            <Button color="danger" onClick={this.ocultarModalAñadir}>Cancelar</Button>
          </ModalFooter>
        </Modal>

        {/* Modal Editar */}
        <Modal isOpen={modalEditar} toggle={this.ocultarModalEditar}>
          <ModalHeader toggle={this.ocultarModalEditar}>Editar Servicio</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={this.handleChange} />
            </FormGroup>
            <FormGroup>
              <Input type="text" name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={this.handleChange} />
            </FormGroup>
            <FormGroup>
              <Input type="file" name="imagenFile" onChange={this.handleChange} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.editarServicio}>Guardar cambios</Button>
            <Button color="danger" onClick={this.ocultarModalEditar}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      </Container>
    );
  }
}

export default Services;
