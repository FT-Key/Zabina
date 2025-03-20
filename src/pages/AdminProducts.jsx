import React, { useEffect, useMemo, useState } from "react";
import CustomButton from "../components/CustomButton";
import BasicModal from "../components/BasicModal";
import "../css/AdminProducts.css";
import { putServerData, deleteServerData } from "../helpers/ServerCalling";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { getProducts } from "../helpers/ServerProducts";
import PaginationComponent from "../components/PaginationComponent";
import { Helmet } from 'react-helmet-async';
import ProductImage from "../components/ProductImage";
import { Col, Container, Row, Button } from "react-bootstrap";
import { getToken } from "../helpers/Token.helper";

const AdminProducts = () => {
  const emptyProduct = {
    id: "",
    imagenUrl: "",
    imagenesUrls: [],
    nombre: "",
    precio: "",
    descripcion: "",
    categoria: "",
    cantidadEnStock: "",
    proveedor: "",
    codigoDeBarras: "",
    calificaciones: 0,
    garantia: "",
    fechaDeIngreso: new Date(),
    descuento: ""
  };
  const [loadedProducts, setLoadedProducts] = useState([]);
  const [updateMark, setUpdateMark] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isNew, setIsNew] = useState(false)
  const [updatedProduct, setUpdatedProduct] = useState({});
  // PAGINACION
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const PRODUCTS_BATCH_SIZE = 50;

  useEffect(() => {
    if (updatedProduct && updatedProduct._id) {
      setLoadedProducts((prevProducts) => {
        const hasOnlyId = Object.keys(updatedProduct).length === 1 && updatedProduct._id;

        if (hasOnlyId) {
          return prevProducts.filter((product) => product._id !== updatedProduct._id);
        } else {
          return prevProducts.map((product) =>
            product._id === updatedProduct._id ? updatedProduct : product
          );
        }
      });

      setUpdatedProduct({});
    }
  }, [updatedProduct]);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      while (true) {
        try {
          const data = await getProducts(currentPage, PRODUCTS_BATCH_SIZE);

          if (isMounted) {
            setLoadedProducts((prevProducts) => [...prevProducts, ...data.productos]);

            setTotalPages(Math.ceil(data.pagination.totalProductos / limit));
          }
          break;
        } catch (error) {
          console.error("Error trayendo productos:", error);
          if (!isMounted) return;
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    };

    if (loadedProducts.length < currentPage * limit) {
      fetchProducts();
    }

    return () => {
      isMounted = false;
    };
  }, [updateMark, currentPage]);

  const BLOCKED_CONFIG = {
    true: { text: "Habilitar", color: "success" },
    false: { text: "Deshabilitar", color: "danger" },
  };

  const handleEditClick = (product) => {
    setIsNew(product == emptyProduct)
    setSelectedProduct(product);
    setModalShow(true);
  };

  const handleToggleLockClick = async (product) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = getToken();

    try {
      const updatedProduct = { ...product, bloqueado: !product.bloqueado };
      const response = await putServerData(apiUrl, `/productos/${product._id}`, updatedProduct, token);

      setUpdateMark((prevMark) => !prevMark);
      setUpdatedProduct(response.producto);
    } catch (error) {
      console.error("Error actualizando estado bloqueado del producto:", error);
    }
  };

  const handleDeleteClick = (productId) => {
    confirmAlert({
      message: "¿Seguro desea eliminar el producto?",
      buttons: [
        {
          label: "Sí",
          onClick: async () => {
            const apiUrl = import.meta.env.VITE_API_URL;
            const token = getToken();

            try {
              await deleteServerData(apiUrl, `/productos/${productId}`, token);
              setLoadedProducts(
                loadedProducts.filter((product) => product._id !== productId)
              );
              setUpdatedProduct({ _id: productId });
            } catch (error) {
              console.error("Error eliminando producto:", error);
            }

            const alertContainer = document.querySelector(
              ".react-confirm-alert"
            );
            if (alertContainer) {
              alertContainer.remove();
            }
          },
        },
        {
          label: "No",
          onClick: () => {
            const alertContainer = document.querySelector(
              ".react-confirm-alert"
            );
            if (alertContainer) {
              alertContainer.remove();
            }
          },
        },
      ],
    });
  };

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    return loadedProducts.slice(startIndex, endIndex);
  }, [loadedProducts, currentPage, limit]);

  const fillEmptySpaces = useMemo(() => {
    return Array(limit - paginatedProducts.length).fill(null);
  }, [paginatedProducts.length, limit]);

  return (
    <>
      <Helmet>
        <title>Admin Productos</title>
      </Helmet>
      <Container className="py-3 adminProducts">

        <div className="d-flex justify-content-end  my-2">
          <Button
            className={""}
            variant={"primary"}
            onClick={() => handleEditClick(emptyProduct)}
          >
            Nuevo
          </Button>
        </div>

        <Row className="text-center text-white header responsive">
          <Col>Productos</Col>
        </Row>

        <Row className="text-center header text-white normal">
          <Col xs={12} md={1}>ID</Col>
          <Col xs={12} md={2}>Image</Col>
          <Col xs={12} md={2}>Nombre</Col>
          <Col xs={12} md={2}>Categoría</Col>
          <Col xs={12} md={1}>Precio</Col>
          <Col xs={12} md={2}>Bloqueado</Col>
          <Col xs={12} md={1}>Editar</Col>
          <Col xs={12} md={1}>Eliminar</Col>
        </Row>

        {paginatedProducts.map((product) => (
          <Row key={product.id} className="text-center" style={{ background: "white" }}>
            <Col xs={12} md={1}>{product.id}</Col>
            <Col xs={12} md={2}>
              <ProductImage source={product.imagenUrl} alternative={product.nombre} width="100px" />
            </Col>
            <Col xs={12} md={2}>{product.nombre}</Col>
            <Col xs={12} md={2}>{product.categoria}</Col>
            <Col xs={12} md={1}>${product.precio}</Col>
            <Col xs={12} md={2}>
              <CustomButton
                paddingB={false}
                className={"my-1"}
                variant={BLOCKED_CONFIG[product.bloqueado].color}
                buttonText={BLOCKED_CONFIG[product.bloqueado].text}
                onClick={() => handleToggleLockClick(product)}
              />
            </Col>
            <Col xs={12} md={1}>
              <CustomButton
                paddingB={false}
                className={"my-1"}
                variant={"warning"}
                buttonText={"Editar"}
                onClick={() => handleEditClick(product)}
              />
            </Col>
            <Col xs={12} md={1}>
              <CustomButton
                paddingB={false}
                className={"my-1"}
                btnClassName="btn-delete"
                variant={"danger"}
                buttonText={"X"}
                onClick={() => handleDeleteClick(product._id)}
              />
            </Col>
          </Row>
        ))}

        {/* Renderizar espacios vacíos para mantener la consistencia visual */}
        {fillEmptySpaces.map((_, index) => (
          <Row className="empty" key={`empty-${index}`}>
            <Col xs={12} md={1}>void</Col>
            <Col xs={12} md={2}>
              <img className="void-image" src="/Espacio-transparente.png" alt="vacio" />
            </Col>
            <Col xs={12} md={2}>void</Col>
            <Col xs={12} md={2}>void</Col>
            <Col xs={12} md={1}>void</Col>
            <Col xs={12} md={2}>
              <CustomButton
                paddingB={false}
                className={"my-1"}
                variant={BLOCKED_CONFIG[true].color}
                buttonText={BLOCKED_CONFIG[true].text}
                onClick={() => handleToggleLockClick(product)}
              />
            </Col>
            <Col xs={12} md={1}>
              <CustomButton
                paddingB={false}
                className={"my-1"}
                variant={"warning"}
                buttonText={"Editar"}
              />
            </Col>
            <Col xs={12} md={1}>
              <CustomButton
                paddingB={false}
                className={"my-1"}
                btnClassName="btn-delete"
                variant={"danger"}
                buttonText={"X"}
              />
            </Col>
          </Row>
        ))}

        {selectedProduct && (
          <BasicModal
            type="adminProducts"
            show={modalShow}
            functionUpdateData={setUpdateMark}
            functionNewUpdatedData={setUpdatedProduct}
            onHide={() => setModalShow(false)}
            productData={selectedProduct}
            isNew={isNew}
          />
        )}
      </Container>

      <PaginationComponent
        totalPages={totalPages}
        currentPage={currentPage}
        setPage={setCurrentPage}
      />
    </>
  );
};

export default AdminProducts;