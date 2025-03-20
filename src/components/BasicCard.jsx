import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import MiniGalleryPopup from "./MiniGalleryPopup";
import "../css/BasicCard.css";

function BasicCard({ data, type, onDelete }) {
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este animal?"
    );
    if (confirmDelete) {
      try {
        if (onDelete) {
          await onDelete(data._id);
        }
      } catch (error) {
        console.error("Error al eliminar el animal:", error);
      }
    }
  };

  return (
    <>
      {type === "productCard" && (
        <Card>
          <Card.Img variant="top" src={data.imagenUrl} />
          <Card.Body>
            <Card.Title>{data.nombre}</Card.Title>
            <Card.Text>{data.descripcion}</Card.Text>
            <div>
              <Button
                as={Link}
                to={`/productDetail/${data._id}`}
                variant="primary"
              >
                Ver más
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
      {type === "previewProductCard" && (
        <Card className="preview-product-card">
          {/* MiniGalleryPopup envuelve la imagen */}
          <MiniGalleryPopup images={data.collection} />
        </Card>
      )}
    </>
  );
}

export default BasicCard;
