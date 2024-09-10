// Home.jsx
import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Placeholder from 'react-bootstrap/Placeholder';
import { formatDistanceToNow } from 'date-fns';

function calculateAge(birthDate) {
  return formatDistanceToNow(new Date(birthDate), { addSuffix: true });
}

function Home() {
  const birthDate = '2020-09-15';
  const age = calculateAge(birthDate);
  
  return (
    <div className="d-flex flex-wrap justify-content-around">
      {/* Info General */}
      <Card style={{ width: '18rem', margin: '1rem' }}>
        <Card.Body>
          <Card.Title>Info General</Card.Title>
          <Card.Text>
            <strong>Nombre:</strong> Encantador<br />
            <strong>Fecha de nacimiento:</strong> 15/09/2020<br />
            <strong>Edad:</strong> {age}<br />
            <strong>Sexo:</strong> Macho<br />
            <strong>Color:</strong> Castaño<br />
            <strong>Andar:</strong> P1.<br />
            <strong>Fin:</strong> Competencia.<br />
            <strong>Peso:</strong> 420 KG
          </Card.Text>
          <Button variant="primary">Editar Información</Button>
        </Card.Body>
      </Card>

      {/* Recordatorios */}
      <Card style={{ width: '18rem', margin: '1rem' }}>
        <Card.Body>
          <Card.Title>Recordatorios</Card.Title>
          <Card.Text>
            <strong>Última vacuna:</strong> { /* Aquí iría la información de la última vacuna */ }<br />
            <strong>Dar alimento:</strong> { /* Aquí iría la información del próximo alimento */ }<br />
            <strong>Dar medicina:</strong> { /* Aquí iría la información de la próxima medicina */ }
          </Card.Text>
          <Button variant="primary">Actualizar Recordatorios</Button>
        </Card.Body>
      </Card>

      {/* Info del Propietario/Cliente */}
      <Card style={{ width: '18rem', margin: '1rem' }}>
        <Card.Body>
          <Card.Title>Info del Propietario/Cliente</Card.Title>
          <Card.Text>
            <strong>Nombres y apellidos:</strong> Caro Torres<br />
            <strong>Correo:</strong> { /* Aquí iría el correo del propietario */ }<br />
            <strong>Celular:</strong> 3002584747<br />
            <strong>N. Ejemplares:</strong> 1
          </Card.Text>
          <Button variant="primary">Editar Información</Button>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Home;

