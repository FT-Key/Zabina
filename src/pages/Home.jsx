import React, { useState, useEffect } from "react";
import BasicCarousel from "../components/BasicCarousel";
import "../css/Home.css";
import { Col, Row, Container } from "react-bootstrap";
import BasicCard from "../components/BasicCard";
import MiniGalleryPopup from "../components/MiniGalleryPopup";
import { getProducts } from "../helpers/ServerProducts.js";
import PaginationComponent from "../components/PaginationComponent.jsx";
import { Helmet } from "react-helmet-async";
import Title from "../components/Title.jsx";

const Home = () => {
  const products = [
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

  const data = [
    {
      imageUrl: 'banner/Banner1.png',
      title: 'Ofertas',
      description: 'Aprovechá nuestras ofertas hasta 50% OFF por tiempo limitado.'
    },
    {
      imageUrl: 'banner/Banner2.webp',
      title: '',
      description: ''
    },
    {
      imageUrl: 'banner/Banner3.webp',
      title: '',
      description: ''
    }
  ];

  const [productos, setProductos] = useState([]);

  // PAGINACION PRODUCTOS
  const [currentPageProd, setCurrentPageProd] = useState(1);
  const [limitProd, setLimitProd] = useState(3);
  const [totalPagesProd, setTotalPagesProd] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const cargarDatos = async () => {
      while (true) {
        try {
          const dataProductos = await getProducts();

          if (isMounted) {
            setProductos(dataProductos.productos);

            setTotalPagesProd(Math.ceil(dataProductos.productos.length / limitProd));
          }

          break;
        } catch (error) {
          console.error("Error cargando datos:", error);
        }
      }
    };

    cargarDatos();

    return () => {
      isMounted = false;
    };
  }, [limitProd]);

  const productosActuales = productos.slice((currentPageProd - 1) * limitProd, currentPageProd * limitProd);

  return (
    <>
      <Helmet>
        <title>Zabina Store</title>
      </Helmet>

      <div>
        <img className="homeLogo d-flex w-100" src="Zabina.png" alt="Zabina Logo" />
      </div>

      <BasicCarousel data={data} />

      <Container fluid className="py-4">
        <Title className="text-center py-3 fw-bold" type={'h2'} highlight={true}>Nuestro catálogo</Title>
        <Row className="g-4">
          {products.map((product) => (
            <Col key={product._id} xs={12} sm={6} md={4} lg={4}>
              <MiniGalleryPopup images={product.collection} />
            </Col>
          ))}
        </Row>
      </Container>

      <section className="products-section">
        <Container fluid>
          <Title className="text-center fw-bold" type={'h2'} highlight={true}>Nuestros Productos</Title>
          <Row className="row-cols-sm-1 row-cols-md-2 row-cols-lg-3 my-3 custom-row g-3">
            {productosActuales.map((prod) => (
              <Col className="p-0 d-flex justify-content-center align-items-center" key={prod.id}>
                <BasicCard data={prod} type={"productCard"} />
              </Col>
            ))}
          </Row>
          <PaginationComponent
            totalPages={totalPagesProd}
            currentPage={currentPageProd}
            setPage={setCurrentPageProd}
          />
        </Container>
      </section>
    </>
  );
};

export default Home;