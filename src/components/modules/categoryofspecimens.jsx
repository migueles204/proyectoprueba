import React, { useState, useEffect } from "react";
import { Button, Tooltip, Card, CardBody, CardTitle, CardText, FormGroup, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter, PaginationItem, PaginationLink, Table, } from "reactstrap"; // Eliminamos Pagination de reactstrap
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Pagination from '@mui/material/Pagination'; // Mantener solo esta si es la que necesitas
 
const CategoryOfSpecimens = () => {
  const [categories, setCategories] = useState([]);
  const [exemplars, setExemplars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(2);
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [editCategoryModalOpen, setEditCategoryModalOpen] = useState(false);
  const [addExemplarModalOpen, setAddExemplarModalOpen] = useState(false);
  const [editExemplarModalOpen, setEditExemplarModalOpen] = useState(false);
  const [viewExemplarModalOpen, setViewExemplarModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategory, setEditCategory] = useState(null);
  const [newExemplar, setNewExemplar] = useState({nombre: '', fechaNacimiento: '', edad: '', paso: '', color: '', dueño: '', cedula: '', correo: '',});
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedExemplar, setSelectedExemplar] = useState(null);
  const [targetCategoryId, setTargetCategoryId] = useState(null);
  const [exemplarToMove, setExemplarToMove] = useState(null);
  const [moveExemplarModalOpen, setMoveExemplarModalOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Datos quemados
const initialCategories = [
  {
    id: uuidv4(),
    name: 'Competencia',
    ejemplares: [
      { id: uuidv4(), nombre: 'Atractivo', fechaNacimiento: '2023-02-14', paso: 'Trocha y galope', color: 'Negro', dueño: 'Carlos Pérez', cedula: '12345678', correo: 'carlos@gmail.com' },
      { id: uuidv4(), nombre: 'Estrella', fechaNacimiento: '2022-06-21', paso: 'P3', color: 'Café', dueño: 'Ana García', cedula: '87654321', correo: 'ana@gmail.com' }
    ]
  },
  {
    id: uuidv4(),
    name: 'Potrancas',
    ejemplares: [
      { id: uuidv4(), nombre: 'Barbie', fechaNacimiento: '2021-12-05', paso: 'Trocha', color: 'Isabela', dueño: 'Miguel Ruiz', cedula: '10293847', correo: 'miguel@gmail.com' }
    ]
  }
];

  const calculateAgeInMonths = (birthDate) => {
    return moment().diff(moment(birthDate), 'months');
  };

  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  const getCategoriesOnPage = () => {
    const startIndex = (currentPage - 1) * categoriesPerPage;
    const endIndex = startIndex + categoriesPerPage;
    return categories.slice(startIndex, endIndex);
  };

  const addCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory = { id: uuidv4(), name: newCategoryName, ejemplares: [] };
      setCategories([...categories, newCategory]);
      setAddCategoryModalOpen(false);
      setNewCategoryName('');
    }
  };

  const updateCategory = () => {
    if (editCategory) {
      setCategories(categories.map(cat =>
        cat.id === editCategory.id ? { ...cat, name: editCategory.name } : cat
      ));
      setEditCategoryModalOpen(false);
      setEditCategory(null);
    }
  };

  const addExemplarToCategory = () => {
    if (selectedCategoryId && newExemplar.nombre.trim()) {
      const calculatedAge = calculateAgeInMonths(newExemplar.fechaNacimiento);
      const newExemplarData = { id: uuidv4(), ...newExemplar, edad: calculatedAge, categoriaId: selectedCategoryId };
      setCategories(categories.map(cat =>
        cat.id === selectedCategoryId
          ? { ...cat, ejemplares: [...cat.ejemplares, newExemplarData] }
          : cat
      ));
      setExemplars([...exemplars, newExemplarData]);
      setAddExemplarModalOpen(false);
      setNewExemplar({nombre: '', fechaNacimiento: '', edad: '', paso: '', color: '', dueño: '', cedula: '', correo: '',});}};

 // Función para abrir el modal de edición y rellenar los datos actuales
 const openEditExemplarModal = (exemplar) => {
  setSelectedExemplar({...exemplar}); // Copia el ejemplar seleccionado al estado
  setEditExemplarModalOpen(true);
};

const updateExemplar = () => {
  if (selectedExemplar) {
    // Actualizar el ejemplar en la lista de ejemplares
    const updatedExemplars = exemplars.map(ex =>
      ex.id === selectedExemplar.id ? { ...selectedExemplar } : ex
    );
    setExemplars(updatedExemplars);

    // Actualizar el ejemplar en la categoría correspondiente
    setCategories(categories.map(cat => ({
      ...cat,
      ejemplares: cat.ejemplares.map(ex =>
        ex.id === selectedExemplar.id ? { ...selectedExemplar } : ex
      )
    })));

    setEditExemplarModalOpen(false);
    setSelectedExemplar(null);
  }
};

  const deleteCategory = (id) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const viewExemplar = (exemplar) => {
    setSelectedExemplar(exemplar);
    setViewExemplarModalOpen(true);
  };

  const moveExemplarToCategory = () => {
    if (targetCategoryId && exemplarToMove) {
      // Verificar si el ejemplar ya está en la categoría de destino
      if (exemplarToMove.categoriaId === targetCategoryId) {
        alert('El ejemplar ya está en la categoría seleccionada.');
        return;
      }
  
      // Remover el ejemplar de todas las categorías
      const updatedCategories = categories.map(cat => ({
        ...cat,
        ejemplares: cat.ejemplares.filter(ex => ex.id !== exemplarToMove.id)
      }));
  
      // Actualizar el ejemplar con la nueva categoría
      const updatedExemplar = { ...exemplarToMove, categoriaId: targetCategoryId };
  
      // Añadir el ejemplar a la nueva categoría
      const newCategories = updatedCategories.map(cat =>
        cat.id === targetCategoryId
          ? { ...cat, ejemplares: [...cat.ejemplares, updatedExemplar] }
          : cat
      );
  
      // Actualizar el estado de las categorías y ejemplares
      setCategories(newCategories);
  
      // Actualizar la lista global de ejemplares con la nueva categoría asignada
      const updatedExemplars = exemplars.map(ex => 
        ex.id === exemplarToMove.id ? updatedExemplar : ex
      );
      setExemplars(updatedExemplars);
  
      // Cerrar el modal y resetear los estados
      setMoveExemplarModalOpen(false);
      setExemplarToMove(null);
      setTargetCategoryId(null);
    }
  };  

  const filteredCategories = categories.filter(category => {
    const matchCategoryName = category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchExemplar = category.ejemplares.some(exemplar => exemplar.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCategoryName || matchExemplar;
  });

  useEffect(() => {
    console.log('Categories:', categories);
    console.log('Exemplars:', exemplars);
    setCategories(initialCategories);
  }, [categories, exemplars]);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-3">
        <Button color="success" onClick={() => setAddCategoryModalOpen(true)}>
          Crear Categoría
        </Button>
      </div>

      <div className="col-md-6 mb-3">
        <Input
          type="text"
          placeholder="Buscar por categoría o ejemplar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: '20px' }}
        />
      </div>

      <div className="row">
        {getCategoriesOnPage().map((category) => (
          <div key={category.id} className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <h3>{category.name}</h3>
                <div>
                <Button
                    color="success"
                    style={{ marginLeft: '0.5rem' }}
                    onClick={() => {
                      setSelectedCategoryId(category.id);
                      setAddExemplarModalOpen(true);
                    }}
                    id={`addExemplarButton-${category.id}`} // Identificador único para el tooltip
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                  <Tooltip
                    placement="top"
                    isOpen={tooltipOpen}
                    target={`addExemplarButton-${category.id}`} // Referencia al botón específico
                    toggle={() => setTooltipOpen(!tooltipOpen)}
                  >
                    Añadir Ejemplar
                  </Tooltip>
                <Button
                  color="dark"
                  style={{ marginLeft: '0.5rem' }}
                  className="ml-2"
                  onClick={() => {
                    setEditCategory(category); // Establecer la categoría a editar
                    setEditCategoryModalOpen(true); // Abrir el modal
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} /> 
                </Button>
                <Button
                  color="danger"
                  style={{ marginLeft: '0.5rem' }}
                  className="ml-2"
                  onClick={() => deleteCategory(category.id)}
                >
                  <FontAwesomeIcon icon={faTrash} /> 
                </Button>
                </div>
              </div>
              <div className="card-body">
                <Table striped>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Fecha de Nacimiento</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.ejemplares.map((exemplar) => (
                      <tr key={exemplar.id}>
                        <td>{exemplar.nombre}</td>
                        <td>{exemplar.fechaNacimiento}</td>
                        <td>
                        <Button
                          outline
                          id={`addExemplarButton-${exemplar.id}`} // Asegúrate de que el id sea único para cada botón
                          style={{
                            color: 'info',
                            marginLeft: '0.5rem',
                            backgroundColor: 'transparent', // Elimina el fondo
                            border: 'none' // Elimina el borde del botón
                          }}
                          size="sm"
                          className="mr-2 p-0" // Elimina el padding para que el ícono esté más centrado
                          onClick={() => viewExemplar(exemplar)}
                        >
                          <FontAwesomeIcon icon={faEye} style={{ color: '#4a90e2', fontSize: '1.2rem' }} /> {/* Azul marino oscuro */}
                        </Button>

                        <Tooltip
                          placement="top"
                          isOpen={tooltipOpen}
                          target={`addExemplarButton-${exemplar.id}`} // Vincula el tooltip con el botón específico
                          toggle={() => setTooltipOpen(!tooltipOpen)}
                        >
                          Ver datos del ejemplar
                        </Tooltip>
                        <Button
                          id={`addExemplarButton-${category.id}`} // Asigna un id único al botón para el Tooltip
                          style={{
                            marginLeft: '0.5rem',
                            backgroundColor: 'transparent', // Elimina el fondo
                            border: 'none' // Elimina el borde del botón
                          }}
                          size="sm"
                          className="mr-2 p-0"
                          onClick={() => {
                            setExemplarToMove(exemplar);
                            setMoveExemplarModalOpen(true);
                          }}
                        >
                          <i className="bi bi-arrow-left-right" style={{ color: '#28a745', fontSize: '1.2rem' }}></i> {/* Icono de mover y color verde */}
                        </Button>
                        <Tooltip
                          placement="top"
                          isOpen={tooltipOpen}
                          target={`addExemplarButton-${category.id}`} // Referencia al botón específico
                          toggle={() => setTooltipOpen(!tooltipOpen)}
                        >
                          Mover ejemplar de carpeta
                        </Tooltip>
                        <Button
                          style={{
                            marginLeft: '0.5rem',
                            backgroundColor: 'transparent', // Elimina el fondo
                            border: 'none' // Elimina el borde del botón
                          }}
                          size="sm"
                          className="mr-2 p-0"
                          onClick={() => openEditExemplarModal(exemplar)}
                        >
                          <FontAwesomeIcon icon={faEdit} style={{ color: 'black', fontSize: '1.2rem' }} /> {/* Ícono edit en negro */}
                        </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination>
        {[...Array(totalPages).keys()].map(number => (
          <PaginationItem key={number + 1} active={number + 1 === currentPage}>
            <PaginationLink
              onClick={() => paginate(number + 1)}
            >
              {number + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
      </Pagination>

      {/* Modals */}
      <Modal isOpen={addCategoryModalOpen} toggle={() => setAddCategoryModalOpen(!addCategoryModalOpen)}>
        <ModalHeader toggle={() => setAddCategoryModalOpen(!addCategoryModalOpen)}>
          Añadir Categoría
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="categoryName">Nombre de la Categoría</Label>
            <Input
              type="text"
              id="categoryName"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={addCategory}>
            Añadir
          </Button>
          <Button color="danger" onClick={() => setAddCategoryModalOpen(false)}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={editCategoryModalOpen} toggle={() => setEditCategoryModalOpen(false)}>
        <ModalHeader toggle={() => setEditCategoryModalOpen(false)}>
          Editar Categoría
        </ModalHeader>
        <ModalBody>
          {editCategory && (
            <FormGroup>
              <Label for="editCategoryName">Nombre de la Categoría</Label>
              <Input
                type="text"
                id="editCategoryName"
                value={editCategory.name}
                onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
              />
            </FormGroup>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={updateCategory}>
            Actualizar
          </Button>
          <Button color="danger" onClick={() => setEditCategoryModalOpen(false)}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal para agregar ejemplar */}
      <Modal isOpen={addExemplarModalOpen} toggle={() => setAddExemplarModalOpen(false)}>
        <ModalHeader toggle={() => setAddExemplarModalOpen(false)}>
          Añadir Ejemplar
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="exemplarName">Nombre</Label>
            <Input
              type="text"
              id="exemplarName"
              value={newExemplar.nombre}
              onChange={(e) => setNewExemplar({ ...newExemplar, nombre: e.target.value })}
            />
          </FormGroup>
          <FormGroup>
            <Label for="exemplarBirthDate">Fecha de Nacimiento</Label>
            <Input
              type="date"
              id="exemplarBirthDate"
              value={newExemplar.fechaNacimiento}
              onChange={(e) => setNewExemplar({ ...newExemplar, fechaNacimiento: e.target.value })}
            />
          </FormGroup>
          <FormGroup>
            <Label for="exemplarPaso">Paso</Label>
            <Input
              type="text"
              id="exemplarPaso"
              value={newExemplar.paso}
              onChange={(e) => setNewExemplar({ ...newExemplar, paso: e.target.value })}
            />
          </FormGroup>
          <FormGroup>
            <Label for="exemplarColor">Color</Label>
            <Input
              type="text"
              id="exemplarColor"
              value={newExemplar.color}
              onChange={(e) => setNewExemplar({ ...newExemplar, color: e.target.value })}
            />
          </FormGroup>
          <FormGroup>
            <Label for="exemplarOwner">Dueño</Label>
            <Input
              type="text"
              id="exemplarOwner"
              value={newExemplar.dueño}
              onChange={(e) => setNewExemplar({ ...newExemplar, dueño: e.target.value })}
            />
          </FormGroup>
          <FormGroup>
            <Label for="exemplarIdCard">Cédula</Label>
            <Input
              type="text"
              id="exemplarIdCard"
              value={newExemplar.cedula}
              onChange={(e) => setNewExemplar({ ...newExemplar, cedula: e.target.value })}
            />
          </FormGroup>
          <FormGroup>
            <Label for="exemplarEmail">Correo</Label>
            <Input
              type="email"
              id="exemplarEmail"
              value={newExemplar.correo}
              onChange={(e) => setNewExemplar({ ...newExemplar, correo: e.target.value })}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={addExemplarToCategory}>
            Añadir
          </Button>
          <Button color="danger" onClick={() => setAddExemplarModalOpen(false)}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>

{/* Modal para editar ejemplar */}
<Modal isOpen={editExemplarModalOpen} toggle={() => setEditExemplarModalOpen(false)}>
  <ModalHeader toggle={() => setEditExemplarModalOpen(false)}>
    Editar Ejemplar
  </ModalHeader>
  <ModalBody>
    {selectedExemplar && (
      <>
        <FormGroup>
          <Label for="editExemplarName">Nombre</Label>
          <Input
            type="text"
            id="editExemplarName"
            value={selectedExemplar.nombre}
            onChange={(e) => setSelectedExemplar({ ...selectedExemplar, nombre: e.target.value })}
          />
        </FormGroup>
        <FormGroup>
          <Label for="exemplarBirthDate">Fecha de Nacimiento</Label>
          <Input
            type="date"
            id="exemplarBirthDate"
            value={selectedExemplar.fechaNacimiento}
            onChange={(e) => setSelectedExemplar({ ...selectedExemplar, fechaNacimiento: e.target.value })}
          />
        </FormGroup>
        <FormGroup>
          <Label for="exemplarPaso">Paso</Label>
          <Input
            type="text"
            id="exemplarPaso"
            value={selectedExemplar.paso}
            onChange={(e) => setSelectedExemplar({ ...selectedExemplar, paso: e.target.value })}
          />
        </FormGroup>
        <FormGroup>
          <Label for="exemplarColor">Color</Label>
          <Input
            type="text"
            id="exemplarColor"
            value={selectedExemplar.color}
            onChange={(e) => setSelectedExemplar({ ...selectedExemplar, color: e.target.value })}
          />
        </FormGroup>
        <FormGroup>
          <Label for="exemplarOwner">Dueño</Label>
          <Input
            type="text"
            id="exemplarOwner"
            value={selectedExemplar.dueño}
            onChange={(e) => setSelectedExemplar({ ...selectedExemplar, dueño: e.target.value })}
          />
        </FormGroup>
        <FormGroup>
          <Label for="exemplarIdCard">Cédula</Label>
          <Input
            type="text"
            id="exemplarIdCard"
            value={selectedExemplar.cedula}
            onChange={(e) => setSelectedExemplar({ ...selectedExemplar, cedula: e.target.value })}
          />
        </FormGroup>
        <FormGroup>
          <Label for="exemplarEmail">Correo</Label>
          <Input
            type="email"
            id="exemplarEmail"
            value={selectedExemplar.correo}
            onChange={(e) => setSelectedExemplar({ ...selectedExemplar, correo: e.target.value })}
          />
        </FormGroup>
      </>
    )}
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={updateExemplar}>
            Actualizar
          </Button>
          <Button color="danger" onClick={() => setEditExemplarModalOpen(false)}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={viewExemplarModalOpen} toggle={() => setViewExemplarModalOpen(!viewExemplarModalOpen)}>
        <ModalHeader toggle={() => setViewExemplarModalOpen(!viewExemplarModalOpen)}>
          Ver Ejemplar
        </ModalHeader>
        <ModalBody>
          {selectedExemplar && (
            <Card>
              <CardBody>
                <CardTitle>{selectedExemplar.nombre}</CardTitle>
                <CardText>
                  <strong>Fecha de Nacimiento:</strong> {selectedExemplar.fechaNacimiento} <br />
                  <strong>Edad:</strong> {selectedExemplar.edad} meses <br />
                  <strong>Color:</strong> {selectedExemplar.color} <br />
                  <strong>Dueño:</strong> {selectedExemplar.dueño} <br />
                  <strong>Cédula:</strong> {selectedExemplar.cedula} <br />
                  <strong>Correo:</strong> {selectedExemplar.correo}
                </CardText>
              </CardBody>
            </Card>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={() => setViewExemplarModalOpen(false)}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={moveExemplarModalOpen} toggle={() => setMoveExemplarModalOpen(!moveExemplarModalOpen)}>
        <ModalHeader toggle={() => setMoveExemplarModalOpen(!moveExemplarModalOpen)}>
          Mover Ejemplar
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="targetCategory">Categoría Destino</Label>
            <Input
              type="select"
              id="targetCategory"
              value={targetCategoryId || ''}
              onChange={(e) => setTargetCategoryId(e.target.value)}
            >
              <option value="">Seleccionar Categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </Input>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={moveExemplarToCategory}>
            Mover
          </Button>
          <Button color="danger" onClick={() => setMoveExemplarModalOpen(false)}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CategoryOfSpecimens;
