import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Container, Input, Row, Col, Modal, ModalBody, ModalFooter, ModalHeader, FormGroup, Label, ButtonGroup } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Pagination from '@mui/lab/Pagination';
import PaginationItem from '@mui/lab/PaginationItem';
import { Link } from 'react-router-dom';

const modules = [
  "Users", "Roles", "Employees", "Clients", "Services",
  "Venues", "Category of Specimens", "Transfers", "Records", "Dashboard"
];
const permissions = ["Visualizar", "Crear", "Desactivar", "Editar", "Eliminar"];

const createInitialPermissions = () => {
  const initialPermissions = {};
  modules.forEach(mod => {
    initialPermissions[mod] = {
      Visualizar: false,
      Crear: false,
      Desactivar: false,
      Editar: false,
      Eliminar: false,
    };
  });
  return initialPermissions;
};

const data = [
  { id: 1, Rol: "Administrador", Description: "Se encargará de la administración de criadero", Estado: true, Permisos: createInitialPermissions() },
  { id: 2, Rol: "Palafrenero", Description: "Se encargará de ayudarle al montador y también podrá administrar medicina si así es requerido", Estado: true, Permisos: createInitialPermissions() },
  { id: 3, Rol: "Cuidador", Description: "Se encargará de la alimentación y cuidado de los ejemplares", Estado: true, Permisos: createInitialPermissions() }
];

class Roles extends Component {
  state = {
    data: data,
    search: '',
    selectedRole: null,
    form: {
      id: '',
      Rol: '',
      Description: '',
      Estado: true,
      Permisos: createInitialPermissions()
    },
    modalInsertar: false,
    modalEditar: false,
    originalPermissions: createInitialPermissions(),
    page: 1,
    rowsPerPage: 5,
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      form: {
        ...prevState.form,
        [name]: name === "Estado" ? value === "true" : value,
      }
    }));
  }

  handleSearchChange = e => {
    this.setState({ search: e.target.value });
  }

  handlePermissionChange = (module, permission) => {
    if (module === "Dashboard" && permission !== "Visualizar") {
      return;
    }

    const updatedPermissions = { ...this.state.selectedRole.Permisos };
    updatedPermissions[module][permission] = !updatedPermissions[module][permission];
    this.setState(prevState => ({
      selectedRole: {
        ...prevState.selectedRole,
        Permisos: updatedPermissions
      }
    }));
  }

  handleSavePermissions = () => {
    const { selectedRole } = this.state;
    
    // Verifica si hay un rol seleccionado
    if (!selectedRole) {
      alert("Debe seleccionar un rol para guardar los permisos.");
      return; // Salir de la función si no hay rol seleccionado
    }
  
    // Verifica si hay permisos seleccionados
    if (!selectedRole.permissions || selectedRole.permissions.length === 0) {
      alert("Debe seleccionar al menos un permiso para guardar.");
      return; // Salir de la función si no hay permisos seleccionados
    }
  
    // Si hay un rol seleccionado y permisos seleccionados, actualiza los datos
    const updatedData = this.state.data.map((registro) =>
      registro.id === selectedRole.id ? selectedRole : registro
    );
    
    // Actualiza el estado con los datos modificados
    this.setState({ data: updatedData });
    
    // Muestra una alerta de éxito
    alert("Permisos guardados exitosamente");
  }
  

  handleDiscardPermissions = () => {
    const { selectedRole } = this.state;
    if (selectedRole) {
      const resetPermissions = {};
      modules.forEach(mod => {
        resetPermissions[mod] = {
          Visualizar: false,
          Crear: false,
          Desactivar: false,
          Editar: false,
          Eliminar: false,
        };
      });

      this.setState(prevState => ({
        selectedRole: {
          ...prevState.selectedRole,
          Permisos: resetPermissions
        }
      }));
      alert("Cambios en permisos no guardados");
    }
  }

  handleResetPermissions = () => {
    const { selectedRole, originalPermissions } = this.state;
    if (selectedRole) {
      this.setState(prevState => ({
        selectedRole: {
          ...prevState.selectedRole,
          Permisos: { ...originalPermissions }
        }
      }));
    }
  }

  mostrarModalInsertar = () => {
    this.setState({
      modalInsertar: true,
      form: { id: '', Rol: '', Description: '', Estado: true, Permisos: createInitialPermissions() }
    });
  }

  ocultarModalInsertar = () => {
    this.setState({ modalInsertar: false });
  }

  mostrarModalEditar = (registro) => {
    this.setState({ modalEditar: true, form: { ...registro } });
  }

  ocultarModalEditar = () => {
    this.setState({ modalEditar: false });
  }

  insertar = () => {
    try {
      const { Rol, Description } = this.state.form;

      const regex = /^[A-Za-z][A-Za-z0-9\s]*$/;
      if (!regex.test(Rol)) {
        alert("El nombre del rol no puede comenzar con un número ni contener caracteres especiales.");
        return;
      }

      if (Rol.trim() === '' || Description.trim() === '') {
        alert("Por favor, ingrese todos los campos");
        return;
      }

      const rolExistente = this.state.data.find(registro => registro.Rol.toLowerCase() === Rol.toLowerCase());
      if (rolExistente) {
        throw new Error("El rol ya existe. Por favor, ingrese un nombre de rol diferente.");
      }

      const nuevoRol = { ...this.state.form, id: this.state.data.length + 1 };
      const lista = [...this.state.data, nuevoRol];
      this.setState({ data: lista, modalInsertar: false });
      alert("Rol agregado exitosamente");
    } catch (error) {
      alert(`Error al insertar el rol: ${error.message}`);
    }
  }

  editar = () => {
    try {
      const { Rol, Description } = this.state.form;

      const regex = /^[A-Za-z][A-Za-z0-9\s]*$/;
      if (!regex.test(Rol)) {
        alert("El nombre del rol no puede comenzar con un número ni contener caracteres especiales.");
        return;
      }

      if (Rol.trim() === '' || Description.trim() === '') {
        alert("Por favor, ingrese todos los campos");
        return;
      }

      const rolExistente = this.state.data.find(
        (registro) => registro.Rol.toLowerCase() === Rol.toLowerCase() && registro.id !== this.state.form.id
      );
      if (rolExistente) {
        throw new Error("No puedes editar el rol con las mismas características de uno ya existente. Por favor, intenta algo diferente.");
      }

      const lista = this.state.data.map((registro) =>
        registro.id === this.state.form.id ? this.state.form : registro
      );
      this.setState({ data: lista, modalEditar: false });
      alert("Rol editado exitosamente");
    } catch (error) {
      alert(`Error al editar el rol: ${error.message}`);
    }
  }

  eliminar = (dato) => {
    const opcion = window.confirm("Realmente desea eliminar el rol " + dato.Rol + "?");
    if (opcion) {
      const lista = this.state.data.filter(registro => registro.id !== dato.id);
      this.setState({ data: lista, selectedRole: null });
      alert("Rol eliminado exitosamente");
    }
  }

  cambiarEstado = (id) => {
    const lista = this.state.data.map((registro) => {
      if (registro.id === id) {
        registro.Estado = !registro.Estado;
      }
      return registro;
    });

    this.setState({ data: lista });
  }

  seleccionarRol = (rol) => {
    if (this.state.selectedRole && JSON.stringify(this.state.selectedRole.Permisos) !== JSON.stringify(this.state.originalPermissions)) {
      this.handleResetPermissions();
    }

    this.setState({
      selectedRole: rol,
      originalPermissions: { ...rol.Permisos }
    });
  }

  handlePageChange = (event, newPage) => {
    this.setState({ page: newPage });
  };

  render() {
    const { search, selectedRole, data, modalInsertar, modalEditar, page, rowsPerPage } = this.state;
    const filteredItems = data.filter(
      item =>
        item.Rol.toLowerCase().includes(search.toLowerCase()) ||
        item.Description.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredItems.length / rowsPerPage);
    const paginatedItems = filteredItems.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    const selectedStyle = {
      backgroundColor: '#d3d3d3'
    };

    return (
      <>
        <Container>
          <Row className="mb-3">
            <Col md={6}>
            <p></p>
              <div className="d-flex align-items-center">
                <Button color="success" onClick={this.mostrarModalInsertar}>Insertar Rol</Button>
                <Input
                  type="text"
                  placeholder="Buscar rol..."
                  value={search}
                  onChange={this.handleSearchChange}
                  style={{ width: '50%', fontSize: '1rem', marginLeft: '1rem' }}
                />
              </div>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Table className="table table-bordered" style={{ fontSize: '0.875rem' }}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Rol</th>
                    <th>Descripción</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((elemento) => (
                    <tr
                      key={elemento.id}
                      onClick={() => this.seleccionarRol(elemento)}
                      style={selectedRole && selectedRole.id === elemento.id ? selectedStyle : {}}
                    >
                      <td
                        style={selectedRole && selectedRole.id === elemento.id ? selectedStyle : {}}
                      >
                        {elemento.id}
                      </td>
                      <td
                        style={selectedRole && selectedRole.id === elemento.id ? selectedStyle : {}}
                      >
                        {elemento.Rol}
                      </td>
                      <td
                        style={selectedRole && selectedRole.id === elemento.id ? selectedStyle : {}}
                      >
                        {elemento.Description}
                      </td>
                      <td
                        style={selectedRole && selectedRole.id === elemento.id ? selectedStyle : {}}
                      >
                        {elemento.Estado ? "Activo" : "Inactivo"}
                      </td>
                      <td>
                        <ButtonGroup>
                          <Button
                            color={elemento.Estado ? "secondary" : "success"}
                            onClick={(e) => { e.stopPropagation(); this.cambiarEstado(elemento.id); }}
                            size="sm"
                            className="mr-1"
                          >
                            {elemento.Estado ? "off" : "on"}
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
              <Pagination
                count={totalPages}
                page={page}
                onChange={this.handlePageChange}
                renderItem={(item) => (
                  <PaginationItem
                    component={Link}
                    to={`/roles?page=${item.page}`}
                    {...item}
                  />
                )}
              />
            </Col>

            <Col md={6}>
              <div style={{ marginBottom: '1rem' }}>
                <Input
                  type="text"
                  value={selectedRole ? selectedRole.Rol : ""}
                  readOnly
                  placeholder="Nombre del rol"
                  style={{ width: '100%', fontSize: '1rem', marginBottom: '1rem' }}
                />
              </div>
              <div style={{ marginTop: '1rem' }}>
                <Table className="table table-bordered" style={{ fontSize: '0.875rem' }}>
                  <thead>
                    <tr>
                      <th>Permiso/Privilegio</th>
                      {permissions.map(permission => (
                        <th key={permission}>{permission}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {modules.map(module => (
                      <tr key={module}>
                        <td>{module}</td>
                        {permissions.map(permission => (
                          <td key={permission}>
                            <Input
                              type="checkbox"
                              disabled={module === "Dashboard" && permission !== "Visualizar"}
                              checked={selectedRole ? selectedRole.Permisos[module][permission] : false}
                              onChange={() => selectedRole && this.handlePermissionChange(module, permission)}
                              style={{
                                border: '2px solid #333',
                                borderRadius: '0.25rem',
                                width: '16px',
                                height: '16px'
                              }}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className="d-flex justify-content-between mt-3">
                <Button color="danger" onClick={this.handleDiscardPermissions} size="sm">No guardar cambios</Button>
                <Button color="success" onClick={this.handleSavePermissions} size="sm">Guardar permisos</Button>
              </div>
            </Col>
          </Row>

          {/* Modal Insertar */}
          <Modal isOpen={modalInsertar}>
            <ModalHeader>Insertar Nuevo Rol</ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="Rol">Rol:</Label>
                <Input type="text" name="Rol" id="Rol" onChange={this.handleChange} />
              </FormGroup>
              <FormGroup>
                <Label for="Description">Descripción:</Label>
                <Input type="text" name="Description" id="Description" onChange={this.handleChange} />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="success" onClick={this.insertar}>Insertar</Button>
              <Button color="danger" onClick={this.ocultarModalInsertar}>Cancelar</Button>
            </ModalFooter>
          </Modal>

          {/* Modal Editar */}
          <Modal isOpen={modalEditar}>
            <ModalHeader>Editar Rol</ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="Rol">Rol:</Label>
                <Input type="text" name="Rol" id="Rol" value={this.state.form.Rol} onChange={this.handleChange} />
              </FormGroup>
              <FormGroup>
                <Label for="Description">Descripción:</Label>
                <Input type="text" name="Description" id="Description" value={this.state.form.Description} onChange={this.handleChange} />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="success" onClick={this.editar}>Editar</Button>
              <Button color="danger" onClick={this.ocultarModalEditar}>Cancelar</Button>
            </ModalFooter>
          </Modal>
        </Container>
      </>
    );
  }
}

export default Roles;
