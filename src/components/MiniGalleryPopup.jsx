import React, { useState } from "react";
import "../css/MiniGalleryPopup.css";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function MiniGalleryPopup({ images }) {
  const [mainImage, setMainImage] = useState(images[0]); // Imagen principal por defecto
  const [isHovered, setIsHovered] = useState(false); // Control de visibilidad de la galería
  const [isGalleryHidden, setIsGalleryHidden] = useState(false); // Control de visibilidad de la mini galería después del clic

  const handleImageClick = (image) => {
    setMainImage(image); // Cambiar la imagen principal
    setIsGalleryHidden(true); // Ocultar la mini galería al hacer clic
  };

  const handleMouseEnter = () => {
    if (!isGalleryHidden) {
      setIsHovered(true); // Mostrar la galería si no está oculta
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false); // Ocultar la galería al quitar el mouse
  };

  const handleMouseMove = () => {
    if (isGalleryHidden) {
      setIsGalleryHidden(false); // Vuelve a mostrar la galería al mover el mouse nuevamente
    }
  };

  // Determinar las imágenes visibles (máximo 5)
  const visibleImages = images.slice(0, 5);

  return (
    <div
      className="gallery-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove} // Manejamos el movimiento para reactivar la galería
    >
      {/* Imagen principal */}
      <div
        className="main-image"
        style={{ backgroundImage: `url(${mainImage})` }}
      ></div>

      {/* Galería emergente */}
      {isHovered && !isGalleryHidden && (
        <div className="popup-gallery">
          {visibleImages.map((img, index) => (
            <div
              key={index}
              className="popup-image"
              style={{ backgroundImage: `url(${img})` }}
              onClick={() => handleImageClick(img)} // Cambiar la imagen principal y ocultar la mini galería
            ></div>
          ))}

          <Button
            className="view-more-button m-0"
            variant="primary"
            as={Link}
            to="/unas"
          >
            Ver más
          </Button>
        </div>
      )}
    </div>
  );
}

export default MiniGalleryPopup;
