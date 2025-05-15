import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "../css/RecoverPassword.css";

const RecoverPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // obtiene token si está en URL

  // Estados para email
  const [email, setEmail] = useState("");
  // Estados para nueva contraseña (cuando hay token)
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setMessage("");
    setError("");
  }, [token]);

  const esTokenValido = (token) => {
    return /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(token);
  };

  // Enviar email para recuperar (cuando no hay token)
  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Por favor ingresa tu correo electrónico.");
      return;
    }

    try {
      // TODO: llamada al backend para enviar mail con link + token
      // await axios.post("/api/recuperarContrasenia", { email });
      setMessage("Se ha enviado un enlace de recuperación a tu correo.");
      setEmail("");
    } catch (err) {
      setError("Hubo un error al enviar el correo. Intenta nuevamente.");
    }
  };

  // Enviar nueva contraseña (cuando hay token)
  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!password || !confirmPassword) {
      setError("Por favor completa ambos campos.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const token = new URLSearchParams(window.location.search).get("token");
    if (!esTokenValido(token)) {
      setError("El enlace de recuperación es inválido.");
      return;
    }

    try {
      // Llamada real al backend
      // await axios.post("/api/restablecerContrasenia", { token, password });
      setMessage("Contraseña restablecida correctamente.");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError("Error al restablecer la contraseña. Intenta nuevamente.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <div className="card shadow-sm">
        <div className="card-body">
          {!token ? (
            <>
              <h3 className="card-title text-center mb-4">
                Recuperar Contraseña
              </h3>
              <form onSubmit={handleSubmitEmail}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Enviar enlace de recuperación
                </button>
              </form>
            </>
          ) : (
            <>
              <h3 className="card-title text-center mb-4">
                Restablecer Contraseña
              </h3>
              <form onSubmit={handleSubmitPassword}>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    placeholder="Nueva contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="form-control"
                    placeholder="Confirmar nueva contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-success w-100">
                  Restablecer contraseña
                </button>
              </form>
            </>
          )}

          {message && (
            <div className="alert alert-success mt-3" role="alert">
              {message}
            </div>
          )}
          {error && (
            <div className="alert alert-danger mt-3" role="alert">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecoverPassword;