import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Container, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup, Input } from 'reactstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Importar íconos de react-icons




const data = [
  {id:1, Nombre: "Carolina Guzman", Document:16514416, Correo: "guzman@gmail.com", Celular: "3546549", Nejemplares:5},
  {id:2, Nombre: "Andra Torres", Document:18761919, Correo: "torres@gmail.com", Celular: "3546549",Nejemplares:2},
  {id:3, Nombre: "Natalia Muriel", Document:1016177143, Correo: "muriel@gmail.com", Celular: "3546549",Nejemplares:1}
];








class Clientes extends React.Component {
 
  state = {
    data: data,
    filteredData: data,
    form: {
      id:'',
      Nombre:'',
      Document:'',
      Correo:'',
      Celular: '',
      Nejemplares: ''
    },
    modalAñadir: false,
    modalEditar: false,
    searchText: ''
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
        item.Document.toString().includes(searchText) ||
        item.Correo.toLowerCase().includes(searchText) ||
        item.Celular.toString().includes(searchText)
      )
    });
  }




  mostrarmodalAñadir = () => {
    this.setState({ modalAñadir: true });
  }




  ocultarmodalAñadir = () => {
    this.setState({ modalAñadir: false });
  }




  mostrarModalEditar = (registro) => {
    this.setState({ modalEditar: true, form: registro });
  }




  ocultarModalEditar = () => {
    this.setState({ modalEditar: false });
  }




  Añadir = () => {
    var valorNuevo = { ...this.state.form };
    valorNuevo.id = this.state.data.length + 1;
    var lista = this.state.data;
    lista.push(valorNuevo);
    this.setState({ data: lista, filteredData: lista, modalAñadir: false });
  }




  editar = (dato) => {
    var contador = 0;
    var lista = this.state.data;
    lista.map((registro) => {
      if (dato.id === registro.id) {
        lista[contador].Nombre = dato.Nombre;
        lista[contador].Document = dato.Document;
        lista[contador].Correo = dato.Correo;
        lista[contador].Celular = dato.Celular;
        lista[contador].Nejemplares = dato.Nejemplares;
      }
      contador++;
    });
    this.setState({ data: lista, filteredData: lista, modalEditar: false });
  }




  eliminar = (dato) => {
    var opcion = window.confirm("Realmente desea eliminar el registro " + dato.id);
    if (opcion) {
      var contador = 0;
      var lista = this.state.data;
      lista.map((registro) => {
        if (registro.id === dato.id) {
          lista.splice(contador, 1);
        }
        contador++;
      });
      this.setState({ data: lista, filteredData: lista });
    }
  }


  render() {
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
         
          <Table className="table table-bordered " style={{width: '1250px', height: '200px',}}>
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




        <Modal isOpen={this.state.modalAñadir}>
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
              <input className="form-control" name="Documento" type="number" onChange={this.handleChange} />
            </FormGroup>




            <FormGroup>
              <label>Correo:</label>
              <input className="form-control" name="Correo" type="text" onChange={this.handleChange} />
            </FormGroup>




            <FormGroup>
              <label>Celular: </label>
              <input className="form-control" name="Celular" type="number" onChange={this.handleChange} />
            </FormGroup>




            <FormGroup>
              <label>Numero de ejemplares a registrar: </label>
              <input className="form-control" name="Nejemplares" type="number" onChange={this.handleChange} />
            </FormGroup>
            <ModalFooter>
              <Button color="primary" onClick={this.Añadir}>Añadir</Button>
              <Button color="danger" onClick={this.ocultarmodalAñadir}>Cancelar</Button>
            </ModalFooter>
          </ModalBody>
        </Modal>




        <Modal isOpen={this.state.modalEditar}>
          <ModalHeader>
            <div>
              <h3>Editar</h3>
            </div>
          </ModalHeader>




          <ModalBody>
           <FormGroup>
              <label>Nombre:</label>
              <input className="form-control" name="Nombre" type="text" onChange={this.handleChange} value={this.state.form.Nombre} />
            </FormGroup>




            <FormGroup>
              <label>Documento:</label>
              <input className="form-control" name="Documento" type="number" onChange={this.handleChange} value={this.state.form.Document} />
            </FormGroup>




            <FormGroup>
              <label>Correo: </label>
              <input className="form-control" name="Correo" type="text" onChange={this.handleChange} value={this.state.form.Correo} />
            </FormGroup>




            <FormGroup>
              <label>Celular: </label>
              <input className="form-control" name="Celular" type="number" onChange={this.handleChange} value={this.state.form.Celular}/>
            </FormGroup>
            <FormGroup>
              <label>Numero de ejemplares a registrar: </label>
              <input className="form-control" name="Nejemplares" type="number" onChange={this.handleChange} value={this.state.form.Nejemplares}/>
            </FormGroup>
            <ModalFooter>
              <Button color="primary" onClick={() => this.editar(this.state.form)}>Editar</Button>
              <Button color="danger" onClick={this.ocultarModalEditar}>Cancelar</Button>
            </ModalFooter>
          </ModalBody>
        </Modal>
      </>




    )
  }
}












export default Clientes;