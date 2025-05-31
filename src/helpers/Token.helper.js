import { jwtDecode } from 'jwt-decode';

export const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

export function getToken() {
  try {
    const sessionToken = sessionStorage.getItem("authToken");
    const localToken = localStorage.getItem("authToken");

    return sessionToken || localToken || null;
  } catch (error) {
    console.error("Error al obtener el token de autorización:", error);
    return null;
  }
}

export const decodeToken = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken;
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return null;
  }
};

export function setToken(token, userRemember) {
  try {
    if (!token) {
      throw new Error("Token vacío o no válido");
    }

    if (userRemember) {
      localStorage.setItem("authToken", token);
      sessionStorage.setItem("authToken", token);
    } else {
      sessionStorage.setItem("authToken", token);
    }
  } catch (error) {
    console.error("Error al guardar el token de autorización:", error);
  }
}

export function removeToken() {
  try {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
  } catch (error) {
    console.error("Error al eliminar el token de autorización:", error);
  }
}