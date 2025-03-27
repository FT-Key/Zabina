
import { useState } from "react";
import { Col, Row, Container, Button, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import Title from "../components/Title";
import MiniGalleryPopup from "../components/MiniGalleryPopup";

const NailsComponent = () => {
  const categorias = ["Francesa", "Acrílicas", "Gel", "Decoradas", "Naturales"];
  const precioInicial = { min: 10000, max: 20000 };

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("all");
  const [precio, setPrecio] = useState(precioInicial);
  const [mostrarDisponibles, setMostrarDisponibles] = useState(false);

  const productos = [
  {
    _id: "1",
    nombre: "Producto 1",
    descripcion: "Descripción del Producto 1",
    imagenUrl: "unas/1/image1.jpg",
    collection: [
      "unas/1/image1.jpg",
      "unas/1/image2.jpg",
      "unas/1/image3.jpg",
      "unas/1/image4.jpg",
      "unas/1/image5.jpg",
      "unas/1/video1.mp4",
    ],
  },
  {
    _id: "2",
    nombre: "Producto 2",
    descripcion: "Descripción del Producto 2",
    imagenUrl: "unas/2/image1.jpg",
    collection: [
      "unas/2/image1.jpg",
      "unas/2/image2.jpg",
      "unas/2/image3.jpg",
      "unas/2/image4.jpg",
      "unas/2/image5.jpg",
    ],
  },
  {
    _id: "3",
    nombre: "Producto 3",
    descripcion: "Descripción del Producto 3",
    imagenUrl: "unas/3/image1.jpg",
    collection: [
      "unas/3/image1.jpg",
      "unas/3/image2.jpg",
      "unas/3/image3.jpg",
      "unas/3/image4.jpg",
      "unas/3/image5.jpg",
      "unas/3/video1.mp4",
    ],
  },
  {
    _id: "4",
    nombre: "Producto 4",
    descripcion: "Descripción del Producto 4",
    imagenUrl: "unas/4/image1.jpg",
    collection: [
      "unas/4/image1.jpg",
      "unas/4/image2.jpg",
      "unas/4/image3.jpg",
      "unas/4/image4.jpg",
      "unas/4/image5.jpg",
    ],
  },
  {
    _id: "5",
    nombre: "Producto 5",
    descripcion: "Descripción del Producto 5",
    imagenUrl: "unas/5/image1.jpg",
    collection: [
      "unas/5/image1.jpg",
      "unas/5/image2.jpg",
      "unas/5/image3.jpg",
      "unas/5/image4.jpg",
      "unas/5/image5.jpg",
    ],
  },
  {
    _id: "6",
    nombre: "Producto 6",
    descripcion: "Descripción del Producto 6",
    imagenUrl: "unas/6/image1.jpg",
    collection: [
      "unas/6/image1.jpg",
      "unas/6/image2.jpg",
      "unas/6/image3.jpg",
    ],
  },
];

  return (
    <>
      <Helmet>
        <title>Productos</title>
      </Helmet>
      <section className="products-section">
        <Container fluid className="m-0 p-0">
          <Title type="h1" highlight={true} className="text-center fw-bold pt-3">
            Nuestros Diseños
          </Title>

          <Container fluid className="py-4">
            <Row>
              <Col xs={12} md={2} className="">
                <aside className="filters-aside border rounded p-3">
                  <h5 className="fw-bold">Filtros</h5>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Categoría</Form.Label>
                      <Form.Select
                        value={categoriaSeleccionada}
                        onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                      >
                        <option value="all">Todas</option>
                        {categorias.map((cat, index) => (
                          <option key={index} value={cat}>{cat}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Precio: {precio.min} - {precio.max}</Form.Label>
                      <Form.Range
                        min={precioInicial.min}
                        max={precioInicial.max}
                        step={500}
                        value={precio.max}
                        onChange={(e) => setPrecio({ ...precio, max: e.target.value })}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        label="Mostrar solo disponibles"
                        checked={mostrarDisponibles}
                        onChange={() => setMostrarDisponibles(!mostrarDisponibles)}
                      />
                    </Form.Group>

                    <Button variant="primary" className="w-100">
                      Aplicar filtros
                    </Button>
                  </Form>
                </aside>
              </Col>

              <Col xs={12} md={10} className="px-3">
                <Row className="g-4">
                  {productos.map((product) => (
                    <Col key={product._id} xs={12} sm={6} md={4} lg={4}>
                      <MiniGalleryPopup images={product.collection} />
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </Container>
        </Container>
      </section>
    </>
  );
};

export default NailsComponent;
