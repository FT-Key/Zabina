import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import "../css/BasicModal.css";
import UserFormModal from "./UserFormModal";
import ProductsFormModal from "./ProductsFormModal";
import { validateProductFields, validateUserFields } from "./Validators";
import { postProduct, putProduct, uploadProductImage } from "../helpers/ServerProducts";
import { putUser, uploadProfileImage } from "../helpers/ServerUsers";

const BasicModal = ({
  type,
  show,
  onHide,
  userData,
  functionUpdateData,
  functionNewUpdatedData,
  productData,
  isNew = false
}) => {
  const [formData, setFormData] = useState(
    (type === "adminUsers" && userData) ||
    (type === "adminProducts" && productData)
  );
  const [editedData, setEditedData] = useState(formData);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!show) {
      setEditedData(formData);
      setErrors({});
    }
  }, [show, formData]);

  useEffect(() => {
    if (type === "adminProducts") {
      setFormData(productData);
    } else if (type === "adminUsers") {
      setFormData(userData);
    }
  }, [type, userData, productData]);

  useEffect(() => {
    setEditedData(formData);
  }, [formData]);

  const parseNestedName = (name) => {
    if (name.includes("[")) {
      const [mainKey, index, subKey] = name.match(/(\w+)\[(\d+)\]\.(\w+)/).slice(1);
      return { type: "array", mainKey, index: parseInt(index, 10), subKey };
    }
    if (name.includes(".")) {
      const [mainKey, subKey] = name.split(".");
      return { type: "object", mainKey, subKey };
    }
    return { type: "simple", key: name };
  };

  const getValueByInputType = (inputType, value, checked) => {
    if (inputType === "checkbox") return checked;
    if (inputType === "date") return new Date(value);
    return value;
  };

  const handleChange = (e) => {
    const { name, value, type: inputType, checked, files } = e.target;
    const updatedData = { ...editedData };

    // Archivo
    if (inputType === "file" && files?.length > 0) {
      const fileUrl = URL.createObjectURL(files[0]);
      updatedData["uploadedFile"] = files[0];
      updatedData[name] = fileUrl;
      setEditedData(updatedData);
      return;
    }

    const parsed = parseNestedName(name);
    const inputValue = getValueByInputType(inputType, value, checked);

    if (parsed.type === "array") {
      const { mainKey, index, subKey } = parsed;
      updatedData[mainKey] = [
        ...updatedData[mainKey].slice(0, index),
        {
          ...updatedData[mainKey][index],
          [subKey]: inputValue,
        },
        ...updatedData[mainKey].slice(index + 1),
      ];
    } else if (parsed.type === "object") {
      const { mainKey, subKey } = parsed;
      updatedData[mainKey] = {
        ...updatedData[mainKey],
        [subKey]: inputValue,
      };
    } else {
      updatedData[parsed.key] = parsed.key === "calificaciones"
        ? parseFloat(inputValue)
        : inputValue;
    }

    setEditedData(updatedData);
  };


  const removeBlobUrlFields = (type, data) => {
    const updated = { ...data };
    if (type === "adminUsers" && updated.fotoPerfil?.startsWith("blob:")) {
      delete updated.fotoPerfil;
    }
    if (type === "adminProducts" && updated.imagenUrl?.startsWith("blob:")) {
      delete updated.imagenUrl;
    }
    return updated;
  };

  const getValidationErrors = (type, data) => {
    switch (type) {
      case "adminUsers":
        return validateUserFields(data);
      case "adminProducts":
        return validateProductFields(data);
      default:
        return null;
    }
  };

  const updateEntityData = async (type, id, data) => {
    switch (type) {
      case "adminUsers":
        return (await putUser(id, data)).usuario;
      case "adminProducts":
        return (await putProduct(id, data)).producto;
      default:
        return null;
    }
  };

  const uploadImageIfNeeded = async (type, id, file) => {
    if (!file) return null;
    const fileData = new FormData();
    fileData.append("image", file);

    switch (type) {
      case "adminUsers":
        return (await uploadProfileImage(id, fileData)).data;
      case "adminProducts":
        return (await uploadProductImage(id, fileData)).data;
      default:
        return null;
    }
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      const cleanedData = removeBlobUrlFields(type, editedData);
      const { uploadedFile, ...dataWithoutFile } = cleanedData;

      const errors = getValidationErrors(type, cleanedData);
      if (errors && Object.keys(errors).length > 0) {
        setErrors(errors);
        return;
      }

      let newObjectData = await updateEntityData(type, cleanedData._id, dataWithoutFile);

      const imageUploadResponse = await uploadImageIfNeeded(type, cleanedData._id, uploadedFile);
      if (imageUploadResponse) {
        newObjectData = imageUploadResponse;
      }

      setFormData(cleanedData);
      functionUpdateData(prev => !prev);
      if (typeof functionNewUpdatedData === "function") {
        functionNewUpdatedData(newObjectData);
      }
      onHide();
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    setIsLoading(true);
    let validationErrors;

    switch (true) {
      // Elimina el campo imageUrl si comienza con 'blob:'
      case type === "adminProducts":
        if (typeof editedData.imagenUrl === "string" && editedData.imagenUrl.startsWith("blob:")) {
          delete editedData.imagenUrl;
        }
        break;

      default:
        break;
    }

    switch (true) {
      case type === "adminProducts":
        validationErrors = validateProductFields(editedData);
        break;

      default:
        break;
    }

    if (validationErrors && Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      const { uploadedFile, ...productDataWithoutFile } = editedData;

      let updatedData;

      switch (true) {
        case type === "adminProducts":
          updatedData = await postProduct(productDataWithoutFile);
          break;

        default:
          break;
      }

      // Si hay un archivo seleccionado, realizar la subida en una llamada separada
      if (uploadedFile) {
        const fileData = new FormData();
        fileData.append("image", uploadedFile);

        let uploadResponse;
        switch (true) {
          case type === "adminProducts":
            uploadResponse = await uploadProductImage(editedData._id, fileData);
            break;

          default:
            break;
        }

        if (!uploadResponse) {
          throw new Error(uploadResponse.message);
        }
      }

      setFormData(editedData);
      functionUpdateData((prevMark) => !prevMark);
      onHide();
    } catch (error) {
      console.error("Error al guardar el producto:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnabledData = (section, isEnabled) => {
    const updatedData = { ...editedData };

    switch (section) {
      case "direccion":
        if (isEnabled) {
          updatedData.direccion = updatedData.direccion || {
            calle: '',
            ciudad: '',
            estado: '',
            codigoPostal: '',
            pais: ''
          };
        } else if (updatedData.direccion) {
          updatedData.direccion = Object.fromEntries(
            Object.entries(updatedData.direccion).filter(([_, value]) => value !== '')
          );
          if (Object.keys(updatedData.direccion).length === 0) {
            delete updatedData.direccion;
          }
        }
        break;

      case "preguntasSeguridad":
        if (isEnabled) {
          updatedData.preguntasSeguridad = updatedData.preguntasSeguridad || [];
        } else if (updatedData.preguntasSeguridad) {
          updatedData.preguntasSeguridad = updatedData.preguntasSeguridad.filter(pregunta =>
            pregunta.pregunta !== '' || pregunta.respuesta !== ''
          );
          if (updatedData.preguntasSeguridad.length === 0) {
            delete updatedData.preguntasSeguridad;
          }
        }
        break;

      case "enlacesRedesSociales":
        if (isEnabled) {
          updatedData.enlacesRedesSociales = updatedData.enlacesRedesSociales || {
            twitter: '',
            linkedin: ''
          };
        } else if (updatedData.enlacesRedesSociales) {
          updatedData.enlacesRedesSociales = Object.fromEntries(
            Object.entries(updatedData.enlacesRedesSociales).filter(([_, value]) => value !== '')
          );
          if (Object.keys(updatedData.enlacesRedesSociales).length === 0) {
            delete updatedData.enlacesRedesSociales;
          }
        }
        break;

      case "fotosPerfil":
        if (isEnabled) {
          updatedData.fotoPerfil = updatedData.fotoPerfil || '';
          updatedData.fotosPerfil = updatedData.fotosPerfil || [];
        } else {
          // Si está deshabilitado, eliminamos ambos campos si están vacíos
          if (!updatedData.fotoPerfil) delete updatedData.fotoPerfil;
          if (!updatedData.fotosPerfil || updatedData.fotosPerfil.length === 0) {
            delete updatedData.fotosPerfil;
          }
        }
        break;

      case "mascotas":
        if (isEnabled) {
          updatedData.mascotas = updatedData.mascotas || [];
        } else {
          // Si está deshabilitado, eliminamos el campo si el array de mascotas está vacío
          if (!updatedData.mascotas || updatedData.mascotas.length === 0) {
            delete updatedData.mascotas;
          }
        }
        break;

      default:
        break;
    }

    setEditedData(updatedData);
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {(type === "adminUsers" &&
            `Editando usuario: ${formData.nombreUsuario}`) ||
            (type === "adminProducts" &&
              `Editando Producto: ${formData.nombre}`) ||
            "Modal Title"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {type === "adminUsers" && (
          <UserFormModal
            handleChange={handleChange}
            editedData={editedData}
            handleEnabledData={handleEnabledData}
            errors={errors}
          />
        )}

        {type === "adminProducts" && (
          <ProductsFormModal
            handleChange={handleChange}
            editedData={editedData}
            errores={errors}
          />
        )}

        {type === "adminAnimals" && (
          <AnimalsFormModal
            handleChange={handleChange}
            editedData={editedData}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        {(type === "adminUsers" || type === "adminProducts" || type === "adminAnimals") && !isNew
          ? (
            <Button onClick={handleSaveChanges} disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar cambios"}
            </Button>
          )
          : (type === "adminProducts" || type === "adminAnimals") && isNew
          && (
            <Button onClick={handleCreate} disabled={isLoading}>
              {isLoading ? "Creando..." : "Crear"}
            </Button>
          )}
      </Modal.Footer>
    </Modal>
  );
};

export default BasicModal;
