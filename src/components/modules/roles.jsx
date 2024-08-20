import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Container, Input, Row, Col, Modal, ModalBody, ModalFooter, ModalHeader, FormGroup, Label, ButtonGroup } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const modules = ["Users", "Roles", "Employees", "Clients", "Services", "Venues", "Category of Specimens", "Transfers", "Records", "Dashboard"];
const permissions = ["Visualizar", "Crear", "Desactivar", "Editar", "Eliminar"];

const data = [
  { id: 1, Rol: "Administrador", Description: "See encargara de la administración de criadero", Estado: true, Permisos: createInitialPermissions() },
  { id: 2, Rol: "Palafrenero", Description: "Se encargara de ayudarle al montador y tambien podra administrar medicina si asi es requerido", Estado: true, Permisos: createInitialPermissions() },
  { id: 3, Rol: "Cuidador", Description: "Se encargara de la alimentacion y cuidado de los ejemplares", Estado: true, Permisos: createInitialPermissions() }
];

function createInitialPermissions() {
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
}

class Roles extends Component {
  state = {
    data: data,
    search: '',
    selectedRole: data[0],
    form: {
      id: '',
      Rol: '',
      Description: '',
      Estado: true,
      Permisos: createInitialPermissions()
    },
    modalInsertar: false,
    modalEditar: false,
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      form: {
        ...this.state.form,
        [name]: name === "Estado" ? value === "true" : value,
      }
    });
  }

  handleSearchChange = e => {
    this.setState({ search: e.target.value });
  }

  handlePermissionChange = (module, permission) => {
    const updatedPermissions = { ...this.state.selectedRole.Permisos };
    updatedPermissions[module][permission] = !updatedPermissions[module][permission];
    this.setState({
      selectedRole: {
        ...this.state.selectedRole,
        Permisos: updatedPermissions
      }
    });
  }

  handleSavePermissions = () => {
    const { selectedRole } = this.state;
    const hasSelectedPermission = Object.values(selectedRole.Permisos).some(modulePermissions =>
      Object.values(modulePermissions).some(permission => permission)
    );

    if (!hasSelectedPermission) {
      alert("Debe seleccionar al menos un permiso antes de guardar.");
      return;
    }

    const lista = this.state.data.map((registro) => 
      registro.id === selectedRole.id ? selectedRole : registro
    );
    this.setState({ data: lista });
    alert("Permisos guardados exitosamente");
  }

  handleDeletePermissions = () => {
    const { selectedRole } = this.state;
    const hasSelectedPermission = Object.values(selectedRole.Permisos).some(modulePermissions =>
      Object.values(modulePermissions).some(permission => permission)
    );

    if (!hasSelectedPermission) {
      alert("No hay permisos seleccionados para eliminar.");
      return;
    }

    const updatedPermissions = createInitialPermissions();
    this.setState({
      selectedRole: {
        ...this.state.selectedRole,
        Permisos: updatedPermissions
      }
    });
    alert("Permisos eliminados exitosamente");
  }

  mostrarModalInsertar = () => {
    this.setState({ 
      modalInsertar: true, 
      form: { id: '', Rol: '', Description:'', Estado: true, Permisos: createInitialPermissions() } 
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
  
      if (Rol.trim() === '' || Description.trim() === '') {
        alert("Por favor, ingrese todos los campos");
        return;
      }
  
      // Simulación de un error en caso de que el rol ya exista(para el manejo de errores se utiliza try-catch)
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
    try{
    const {Rol, Description} = this.state.form;

    if(Rol.trim() === '' || Description.trim() === '') {
      alert("Por favor, ingrese todos los campos");
      return;
    }
    
    const rolExistente = this.state.data.find(registro => registro.Rol.toLowerCase() === Rol.toLowerCase()&& registro.id !==this.state.form.id
  );
      if (rolExistente) {
        throw new Error("No puedes editar el rol con las mismas cracteristica con uno ya existente. Por favor, intenta algo diferente.");
      }

    const lista = this.state.data.map((registro) => 
      registro.id === this.state.form.id ? this.state.form : registro
    );
    this.setState({ data: lista, modalEditar: false });
    alert("Rol editado exitosamente")
    }catch(error){
      alert(`Error al editar el rol: ${error.message}`);
    }
  }

  eliminar = (dato) => {
    const opcion = window.confirm("Realmente desea eliminar el rol " + dato.Rol + "?");
    if (opcion) {
      const lista = this.state.data.filter(registro => registro.id !== dato.id);
      this.setState({ data: lista });
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
    this.setState({ selectedRole: rol });
  }

  render() {
    const { search, data, selectedRole, modalInsertar, modalEditar } = this.state;
    const filteredData = data.filter(item =>
      item.Rol.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <>
        <Container>
          <br />
          <div className="d-flex justify-content-between">
            <div className="d-flex">
              <Button color="success" onClick={this.mostrarModalInsertar} size="sm">Insertar</Button>
              <Input
                type="text"
                placeholder="Buscar rol..."
                value={this.state.search}
                onChange={this.handleSearchChange}
                style={{ width: "300px", marginLeft: "10px" }}
              />
            </div>
          </div>
          <br />

          <Row>
            <Col md={6}>
              <Table className="table table-bordered" style={{ fontSize: '0.875rem' }}>
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Rol</th>
                    <th>Descripción del rol</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((elemento) => (
                    <tr key={elemento.id} onClick={() => this.seleccionarRol(elemento)}>
                      <td>{elemento.id}</td>
                      <td>{elemento.Rol}</td>
                      <td>{elemento.Description}</td>
                      <td>{elemento.Estado ? "Activo" : "Inactivo"}</td>
                      <td>
                        <ButtonGroup>
                          <Button 
                            color={elemento.Estado ? "success" : "secondary"} 
                            onClick={(e) => { e.stopPropagation(); this.cambiarEstado(elemento.id); }}
                            size="sm"
                            className="mr-1"
                          >
                            {elemento.Estado ? "On" : "Off"}
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
            </Col>

            <Col md={6}>
              {selectedRole && (
                <div style={{ marginLeft: '20px' }}>
                  <Input
                    type="text"
                    value={selectedRole.Rol}
                    readOnly
                    className="mb-3"
                    style={{ width: '100%' }}
                  />
                  <Table className="table table-bordered" style={{ maxWidth: '100%', fontSize: '0.875rem' }}>
                    <thead>
                      <tr>
                        <th>Permisos/Privilegios</th>
                        {permissions.map(permission => (
                          <th key={permission}>{permission}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {modules.map((module) => (
                        <tr key={module}>
                          <td>{module}</td>
                          {permissions.map(permission => (
                            <td key={permission} style={{ padding: '0.25rem' }}>
                              <Input 
                                type="checkbox" 
                                checked={selectedRole.Permisos[module][permission]} 
                                onChange={() => this.handlePermissionChange(module, permission)} 
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <div className="d-flex justify-content-between">
                    <Button color="danger" onClick={this.handleDeletePermissions} size="sm">Eliminar Permisos</Button>
                    <Button color="success" onClick={this.handleSavePermissions} size="sm">Guardar permisos</Button>
                  </div>
                </div>
              )}
            </Col>
          </Row>

          {/* Modal Insertar */}
          <Modal isOpen={this.state.modalInsertar}>
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

          <Modal isOpen={this.state.modalEditar}>
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
