import axios from "axios";

export const fetchServerData = async (dominio, ruta, token = '') => {
  try {
    const response = await axios.get(`${dominio}${ruta}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener datos:", error);
    throw error;
  }
};

export const postServerData = async (dominio, ruta, body, token = "") => {
  try {
    console.log("Dominio: ", dominio)
    console.log("Ruta: ", ruta)
    console.log("Body: ", body)
    console.log("Token: ", token)
    const isFormData = body instanceof FormData;
    console.log("IsFormData: ", isFormData)

    const response = await axios.post(`${dominio}${ruta}`, body, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(!isFormData && { "Content-Type": "application/json" }),
      }
    });
    console.log("Response: ", response)
    return response.data;
  } catch (error) {
    console.error("Error al enviar datos:", error);
    throw error;
  }
};

export const putServerData = async (dominio, ruta, body, token = '') => {
  try {
    const response = await axios.put(`${dominio}${ruta}`, body, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar datos:", error);
    throw error;
  }
};

export const deleteServerData = async (dominio, ruta, token = '') => {
  try {
    const response = await axios.delete(`${dominio}${ruta}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar datos:", error);
    throw error;
  }
};