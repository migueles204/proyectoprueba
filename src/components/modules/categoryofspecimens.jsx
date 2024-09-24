import React, { useState, useEffect } from "react";
import { Button, Tooltip, Card, CardBody, CardTitle, CardText, FormGroup, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter, PaginationItem, PaginationLink, Table, } from "reactstrap";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Pagination from '@mui/material/Pagination'; 
import Swal from 'sweetalert2';
 
const CategoryOfSpecimens = () => {
  const [categories, setCategories] = useState([]);
  const [exemplars, setExemplars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 2; 
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
  
  const filteredCategories = categories.filter(category => category.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
  category.ejemplares.some(exemplar => exemplar.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
); 

 // Cargar datos quemados solo una vez cuando el componente se monta
 useEffect(() => {
  const initialCategories = [
    {
      id: uuidv4(),
      name: 'Competencia',
      ejemplares: [
        { id: uuidv4(), nombre: 'Atractivo', fechaNacimiento: '2023-02-14', paso: 'Trocha y galope', color: 'Negro', dueño: 'Carlos Pérez', cedula: '12345678', correo: 'carlos@gmail.com', edad: calculateAgeInMonths('2023-02-14') },
        { id: uuidv4(), nombre: 'Estrella', fechaNacimiento: '2022-06-21', paso: 'P3', color: 'Café', dueño: 'Ana García', cedula: '87654321', correo: 'ana@gmail.com', edad: calculateAgeInMonths('2022-06-21') }      ]
    },
    {
      id: uuidv4(),
      name: 'Potrancas',
      ejemplares: [
        { id: uuidv4(), nombre: 'Barbie', fechaNacimiento: '2021-12-05', paso: 'Trocha', color: 'Isabela', dueño: 'Miguel Ruiz', cedula: '10293847', correo: 'miguel@gmail.com', edad: calculateAgeInMonths('2021-12-05') }      ]
    },
    {
      id: uuidv4(),
      name: 'Yeguas',
      ejemplares: [
        { id: uuidv4(), nombre: 'San Juanera', fechaNacimiento: '2020-12-06', paso: 'Cabalgata', color: 'mora', dueño: 'Carlos Feo', cedula: '0987364356', correo: 'Carlos@gmail.com', edad: calculateAgeInMonths('2020-12-06') }      ]
    }
  ];

  setCategories(initialCategories);
}, []);

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
    try {
      if (newCategoryName.trim() === '') {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Por favor, ingrese el nombre de la categoría.",
          customClass: {
            confirmButton: 'custom-swal'
          }
        });
        return;
      }

      // Validar que el nombre de la categoría cumple con la expresión regular
      const regex = /^[A-Za-z][A-Za-z0-9\s]*$/;
      if (!regex.test(newCategoryName)) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "El nombre de la categoría no puede comenzar con un número ni contener caracteres especiales.",
          customClass: {
            confirmButton: 'custom-swal'
          }
        });
        return;
      }

      // Verificar si la categoría ya existe
      const categoryExistente = categories.find(cat => cat.name.toLowerCase() === newCategoryName.toLowerCase());
      if (categoryExistente) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "La categoría ya existe. Por favor, ingrese un nombre de categoría diferente.",
          customClass: {
            confirmButton: 'custom-swal'
          }
        });
        return;
      }

      // Si todas las validaciones pasan, añadir la nueva categoría
      const nuevaCategoria = { id: uuidv4(), name: newCategoryName, ejemplares: [] };
      setCategories([...categories, nuevaCategoria]);
      setAddCategoryModalOpen(false);
      setNewCategoryName('');
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Categoría agregada exitosamente",
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          confirmButton: 'custom-swal'
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Error al añadir la categoría: ${error.message}`,
        customClass: {
          confirmButton: 'custom-swal'
        }
      });
    }
  };

  const updateCategory = () => {
    if (editCategory) {
      try {
        const { name, id } = editCategory;

        if (name.trim() === '') {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Por favor, ingrese el nombre de la categoría.",
            customClass: {
              confirmButton: 'custom-swal'
            }
          });
          return;
        }

        const regex = /^[A-Za-z][A-Za-z0-9\s]*$/;
        if (!regex.test(name)) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "El nombre de la categoría no puede comenzar con un número ni contener caracteres especiales.",
            customClass: {
              confirmButton: 'custom-swal'
            }
          });
          return;
        }

        const categoryExistente = categories.find(cat => cat.id !== id && cat.name.toLowerCase() === name.toLowerCase());
        if (categoryExistente) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "La categoría ya existe. Por favor, ingrese un nombre de categoría diferente.",
            customClass: {
              confirmButton: 'custom-swal'
            }
          });
          return;
        }

        setCategories(categories.map(cat =>
          cat.id === id ? { ...cat, name } : cat
        ));
        setEditCategoryModalOpen(false);
        setEditCategory(null);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Categoría actualizada exitosamente",
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            confirmButton: 'custom-swal'
          }
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Error al actualizar la categoría: ${error.message}`,
          customClass: {
            confirmButton: 'custom-swal'
          }
        });
      }
    }
  };

// Función para agregar ejemplar a una categoría con validaciones
const addExemplarToCategory = () => {
  const { nombre, fechaNacimiento, paso, color, dueño, cedula, correo } = newExemplar;

  // Validar que todos los campos estén llenos
  if (!selectedCategoryId || !nombre.trim() || !fechaNacimiento.trim() || !paso.trim() || !color.trim() || !dueño.trim() || !cedula.trim() || !correo.trim()) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Por favor, ingrese todos los campos.',
      customClass: {
        confirmButton: 'custom-swal'
      }
    });
    return;
  }

  // Validar que el nombre no comience con un número ni contenga caracteres especiales
  const nameRegex = /^[A-Za-z][A-Za-z0-9\s]*$/;
  if (!nameRegex.test(nombre)) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'El nombre del ejemplar no puede comenzar con un número ni contener caracteres especiales.',
      customClass: {
        confirmButton: 'custom-swal'
      }
    });
    return;
  }

  // Validar que la fecha de nacimiento sea una fecha válida
  if (!moment(fechaNacimiento, 'YYYY-MM-DD', true).isValid()) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'La fecha de nacimiento no es válida. Use el formato AAAA-MM-DD.',
      customClass: {
        confirmButton: 'custom-swal'
      }
    });
    return;
  }

  // Verificar si el ejemplar ya existe en la categoría
  const existingExemplar = categories.find(cat => cat.id === selectedCategoryId)?.ejemplares.some(ex => ex.nombre.toLowerCase() === nombre.toLowerCase());
  if (existingExemplar) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'El ejemplar ya existe en la categoría. Por favor, ingrese un ejemplar diferente.',
      customClass: {
        confirmButton: 'custom-swal'
      }
    });
    return;
  }

  // Si todas las validaciones pasan, añadir el nuevo ejemplar
  const calculatedAge = calculateAgeInMonths(fechaNacimiento);
  const newExemplarData = { id: uuidv4(), ...newExemplar, edad: calculatedAge, categoriaId: selectedCategoryId };
  setCategories(categories.map(cat =>
    cat.id === selectedCategoryId
      ? { ...cat, ejemplares: [...cat.ejemplares, newExemplarData] }
      : cat
  ));
  setExemplars([...exemplars, newExemplarData]);
  setAddExemplarModalOpen(false);
  setNewExemplar({ nombre: '', fechaNacimiento: '', edad: '', paso: '', color: '', dueño: '', cedula: '', correo: '' });
};

// Función para actualizar un ejemplar con validaciones
const updateExemplar = () => {
  const { nombre, fechaNacimiento, paso, color, dueño, cedula, correo } = selectedExemplar;

  if (!selectedExemplar) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'No se ha seleccionado ningún ejemplar para editar.',
      customClass: {
        confirmButton: 'custom-swal'
      }
    });
    return;
  }

  // Validar que todos los campos estén llenos
  if (!nombre.trim() || !fechaNacimiento.trim() || !paso.trim() || !color.trim() || !dueño.trim() || !cedula.trim() || !correo.trim()) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Por favor, ingrese todos los campos.',
      customClass: {
        confirmButton: 'custom-swal'
      }
    });
    return;
  }

  // Validar que el nombre no comience con un número ni contenga caracteres especiales
  const nameRegex = /^[A-Za-z][A-Za-z0-9\s]*$/;
  if (!nameRegex.test(nombre)) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'El nombre del ejemplar no puede comenzar con un número ni contener caracteres especiales.',
      customClass: {
        confirmButton: 'custom-swal'
      }
    });
    return;
  }

  // Validar que la fecha de nacimiento sea una fecha válida
  if (!moment(fechaNacimiento, 'YYYY-MM-DD', true).isValid()) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'La fecha de nacimiento no es válida. Use el formato AAAA-MM-DD.',
      customClass: {
        confirmButton: 'custom-swal'
      }
    });
    return;
  }

  // Verificar si el ejemplar ya existe en la categoría con un nombre diferente
  const existingExemplarInCategory = categories.find(cat => 
    cat.ejemplares.some(ex => ex.nombre.toLowerCase() === nombre.toLowerCase() && ex.id !== selectedExemplar.id)
  );
  if (existingExemplarInCategory) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Ya existe un ejemplar con el mismo nombre en la categoría. Por favor, use un nombre diferente.',
      customClass: {
        confirmButton: 'custom-swal'
      }
    });
    return;
  }

  // Si todas las validaciones pasan, actualizar el ejemplar
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

  // Mostrar alerta de éxito
  Swal.fire({
    icon: 'success',
    title: 'Actualización exitosa',
    text: 'Los datos del ejemplar se ha actualizado correctamente.',
    customClass: {
      confirmButton: 'custom-swal'
    }
  });

  setEditExemplarModalOpen(false);
  setSelectedExemplar(null);
};

 // Función para eliminar categoría con validación y confirmación
const deleteCategory = (id) => {
  // Encontrar la categoría a eliminar
  const categoryToDelete = categories.find(cat => cat.id === id);

  // Verificar si la categoría tiene ejemplares
  if (categoryToDelete && categoryToDelete.ejemplares.length > 0) { 
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se puede eliminar la categoría porque contiene ejemplares.',
      customClass: {
        confirmButton: 'custom-swal'
      }
    });
    return;
  }

  // Mostrar alerta de confirmación para eliminar la categoría
  Swal.fire({
    title: '¿Estás seguro?',
    text: '¡No podrás revertir esto!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#1e7e34',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'No, cancelar',
    reverseButtons: true,
    customClass: {
      cancelButton: 'custom-swal',
      confirmButton: 'custom-swal'
    },
    didOpen: (modal) => {
      const icon = modal.querySelector('.swal2-icon.swal2-warning');
      if (icon) {
        icon.style.color = '#f1c40f';
        icon.style.borderColor = '#f1c40f';
      }
    }
  }).then((result) => {
    if (result.isConfirmed) {
      // Filtrar las categorías para eliminar la seleccionada
      const updatedCategories = categories.filter(cat => cat.id !== id);
      setCategories(updatedCategories);

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Categoría eliminada exitosamente",
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          confirmButton: 'custom-swal'
        }
      });
    }
  });
};

const handlePageChange = (event, page) => {
  setCurrentPage(page);
};

  const viewExemplar = (exemplar) => {
    setSelectedExemplar(exemplar);
    setViewExemplarModalOpen(true);
  };

  const moveExemplarToCategory = () => {
    if (!exemplarToMove || !targetCategoryId) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor, seleccione un ejemplar y una categoría de destino.',
        customClass: {
          confirmButton: 'custom-swal'
        }
      });
      return;
    }
  
    // Verificar si el ejemplar ya está en la categoría de destino
    if (exemplarToMove.categoriaId === targetCategoryId) {
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'El ejemplar ya está en la categoría seleccionada.',
        customClass: {
          confirmButton: 'custom-swal'
        }
      });
      return;
    }
  
    // Verificar si el ejemplar ya existe en la categoría de destino
    const targetCategory = categories.find(cat => cat.id === targetCategoryId);
    if (targetCategory && targetCategory.ejemplares.find(ex => ex.id === exemplarToMove.id)) {
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'El ejemplar ya existe en la categoría seleccionada.',
        customClass: {
          confirmButton: 'custom-swal'
        }
      });
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
  
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Ejemplar movido exitosamente',
      showConfirmButton: false,
      timer: 1500,
      customClass: {
        confirmButton: 'custom-swal'
      }
    });
  };  

  useEffect(() => {
    console.log('Categories:', categories);
    console.log('Exemplars:', exemplars);
  }, [categories, exemplars]);  

  return (
    <div className="container mt-5">
     <div className="d-flex justify-content-between mb-3">
      {/* Botón Crear Categoría */}
      <Button color="success" onClick={() => setAddCategoryModalOpen(true)}>
        Crear Categoría
      </Button>

      {/* Campo de búsqueda */}
      <input
        type="text"
        placeholder="Buscar por ejemplar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-control rounded"  // Bordes redondeados en las esquinas
        style={{ maxWidth: '600px', width: '100%' }}  // Ancho ajustado
      />
    </div>
    
{/* Renderizar categorías y ejemplares filtrados */}
{searchTerm && filteredCategories.length > 0 ? (
        filteredCategories.map(category => {
          // Filtramos los ejemplares de la categoría que coinciden con el término de búsqueda
          const matchingExemplars = category.ejemplares.filter(exemplar =>
            exemplar.nombre.toLowerCase().includes(searchTerm.toLowerCase())
          );

          return (
            <div key={category.id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{category.name}</h5>
                {/* Si hay ejemplares que coinciden, los mostramos en una línea separada por guiones */}
                {matchingExemplars.length > 0 && (
                  <ul className="list-group list-group-flush">
                    {matchingExemplars.map(exemplar => (
                      <li key={exemplar.id} className="list-group-item">
                        {`${exemplar.nombre}  ${exemplar.edad} `}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })
      ) : searchTerm && filteredCategories.length === 0 ? (
        <p>No se encontraron resultados</p>
      ) : null}
      
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
                      <th>Edad (Meses)</th>
                      <th>Fecha de Nacimiento</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.ejemplares.map((exemplar) => (
                      <tr key={exemplar.id}>
                        <td>{exemplar.nombre}</td>
                        <td>{exemplar.edad}</td> 
                        <td>{exemplar.fechaNacimiento}</td>
                        <td>
                        <Button
                          outline
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
                        <Button
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
                        <Button
                          style={{
                            marginLeft: '0.5rem',
                            backgroundColor: 'transparent',
                            border: 'none'
                          }}
                          size="sm"
                          className="mr-2 p-0"
                          onClick={() => {
                            setSelectedExemplar(exemplar); // Establecer el ejemplar seleccionado
                            setEditExemplarModalOpen(true); // Abrir el modal
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} style={{ color: 'black', fontSize: '1.2rem' }} />
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

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60px', // Ajusta el mínimo alto si es necesario
          marginTop: '20px', // Margen superior para separar del contenido
          marginBottom: '20px', // Margen inferior para separar del contenido
        }}
      >
      <Pagination
      count={totalPages}  // Total de páginas
      page={currentPage}  // Página actual
      onChange={handlePageChange}  // Manejador del cambio de página
    />
  </div>
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
        <ModalHeader >
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
