import { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Planes = () => {
  const [planes, setPlanes] = useState([
    {
      _id: '1',
      nombre: 'Plan Básico',
      descripcion: 'Ideal para comenzar.',
      precio: 100,
      imagenUrl: 'https://via.placeholder.com/150',
    },
    {
      _id: '2',
      nombre: 'Plan Estándar',
      descripcion: 'Un plan equilibrado.',
      precio: 200,
      imagenUrl: 'https://via.placeholder.com/150',
    },
    {
      _id: '3',
      nombre: 'Plan Premium',
      descripcion: 'El mejor plan para ti.',
      precio: 300,
      imagenUrl: 'https://via.placeholder.com/150',
    },
  ]);

  return (
    <Container>
      <h1 className="text-center my-4">Selecciona un Plan</h1>
      <Row className="row-cols-1 row-cols-md-3 g-4">
        {planes.map((plan) => (
          <Col key={plan._id}>
            <Card className="h-100 w-100">
              <Card.Img variant="top" src={plan.imagenUrl} alt={plan.nombre} />
              <Card.Body>
                <Card.Title>{plan.nombre}</Card.Title>
                <Card.Text>{plan.descripcion}</Card.Text>
                <Card.Text className="fw-bold text-success">${plan.precio}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Planes;
