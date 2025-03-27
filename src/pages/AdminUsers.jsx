import React, { useEffect, useMemo, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import CustomButton from "../components/CustomButton";
import BasicModal from "../components/BasicModal";
import "../css/AdminUsers.css";
import { putServerData, deleteServerData } from "../helpers/ServerCalling";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { getUsers } from "../helpers/ServerUsers";
import ProfileImage from "../components/ProfileImage";
import PaginationComponent from "../components/PaginationComponent";
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import { getToken } from "../helpers/Token.helper";

const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loadedUsers, setLoadedUsers] = useState([]);
  const [updateMark, setUpdateMark] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({});
  // PAGINACION
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const USERS_BATCH_SIZE = 50;

  useEffect(() => {
    if (updatedUser && updatedUser._id) {
      setLoadedUsers((prevUsers) => {
        const hasOnlyId = Object.keys(updatedUser).length === 1 && updatedUser._id;

        if (hasOnlyId) {
          return prevUsers.filter((user) => user._id !== updatedUser._id);
        } else {
          return prevUsers.map((user) =>
            user._id === updatedUser._id ? updatedUser : user
          );
        }
      });

      setUpdatedUser({});
    }
  }, [updatedUser]);

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      while (true) {
        try {
          const data = await getUsers(currentPage, USERS_BATCH_SIZE);

          if (isMounted) {
            setLoadedUsers((prevUsers) => [...prevUsers, ...data.usuarios]);
            setTotalPages(Math.ceil(data.pagination.totalUsuarios / limit));
          }
          break;
        } catch (error) {
          console.error("Error trayendo usuarios:", error);
          if (!isMounted) return;
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    };

    if (loadedUsers.length < currentPage * limit) {
      fetchUsers();
    }

    return () => {
      isMounted = false;
    };
  }, [updateMark, currentPage]);

  const BLOQUEADO_CONFIG = {
    true: { text: "Desbloquear", color: "success" },
    false: { text: "Bloquear", color: "danger" },
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setModalShow(true);
  };

  const handleToggleLockClick = async (user) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = getToken();

    try {
      const updatedUser = { ...user, bloqueado: !user.bloqueado };
      const response = await putServerData(apiUrl, `/usuarios/${user._id}`, updatedUser, token);

      setUpdateMark((prevMark) => !prevMark);
      setUpdatedUser(response.usuario);
    } catch (error) {
      console.error("Error actualizando estado bloqueado del usuario:", error);
    }
  };

  const handleDeleteClick = (userId) => {
    confirmAlert({
      message: "¿Seguro desea eliminar el usuario?",
      buttons: [
        {
          label: "Sí",
          onClick: async () => {
            const apiUrl = import.meta.env.VITE_API_URL;
            const token = getToken();

            try {
              await deleteServerData(apiUrl, `/usuarios/${userId}`, token);
              setUsers(users.filter((user) => user._id !== userId));
              setUpdatedUser({ _id: userId });
            } catch (error) {
              console.error("Error eliminando usuario:", error);
            }

            setUpdateMark(prevMark => !prevMark);

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

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    return loadedUsers.slice(startIndex, endIndex);
  }, [loadedUsers, currentPage, limit]);

  const fillEmptySpaces = useMemo(() => {
    return Array(limit - paginatedUsers.length).fill(null);
  }, [paginatedUsers.length, limit]);

  return (
    <>
      <Helmet>
        <title>Admin Usuarios</title>
      </Helmet>
      <Container className="py-3 adminUsers">
        <Row className="text-center text-white header responsive">
          <Col>Usuarios</Col>
        </Row>

        <Row className="text-center text-white header normal">
          <Col md={1}>ID</Col>
          <Col md={2}>Nombre de Usuario</Col>
          <Col md={2}>Foto Perfil</Col>
          <Col md={1}>Nombre</Col>
          <Col md={2}>Email</Col>
          <Col md={2}>Bloqueado</Col>
          <Col md={1}>Editar</Col>
          <Col md={1}>Eliminar</Col>
        </Row>

        {paginatedUsers.map((userListed) => (
          <Row
            key={userListed.id}
            className="text-center"
            style={{ background: "white" }}
          >
            <Col xs={12} md={1}>
              {userListed.id}
            </Col>
            <Col xs={12} md={2}>
              {userListed.nombreUsuario}
            </Col>
            <Col xs={12} md={2}>
              <ProfileImage source={userListed.fotoPerfil} width="100px" />
            </Col>
            <Col xs={12} md={1}>{`${userListed.nombre} ${userListed.apellido}`}</Col>
            <Col xs={12} md={2}>
              {userListed.email}
            </Col>
            <Col xs={12} md={2}>
              {user._id != userListed._id &&
                (
                  <CustomButton
                    paddingB={false}
                    className={"my-1"}
                    variant={BLOQUEADO_CONFIG[userListed.bloqueado].color}
                    buttonText={BLOQUEADO_CONFIG[userListed.bloqueado].text}
                    onClick={() => handleToggleLockClick(userListed)}
                  />
                )}
            </Col>
            <Col xs={12} md={1}>
              <CustomButton
                paddingB={false}
                className={"my-1"}
                variant={"warning"}
                buttonText={"Editar"}
                onClick={() => handleEditClick(userListed)}
              />
            </Col>
            <Col xs={12} md={1}>
              {user._id != userListed._id &&
                (
                  <CustomButton
                    paddingB={false}
                    className={"my-1"}
                    btnClassName="btn-delete"
                    variant={"danger"}
                    buttonText={"X"}
                    onClick={() => handleDeleteClick(userListed._id)}
                  />
                )}
            </Col>
          </Row>
        ))}

        {/* Renderizar espacios vacíos para mantener la consistencia visual */}
        {fillEmptySpaces.map((_, index) => (
          <Row className="empty" key={`empty-${index}`}>
            <Col xs={12} md={1}>void</Col>
            <Col xs={12} md={2}>void</Col>
            <Col xs={12} md={2}>
              <img className="void-image" src="/Espacio-transparente.png" alt="vacio" />
            </Col>
            <Col xs={12} md={1}>void</Col>
            <Col xs={12} md={2}>void</Col>
            <Col xs={12} md={2}>
              <CustomButton
                paddingB={false}
                className={"my-1"}
                variant={BLOQUEADO_CONFIG[true].color}
                buttonText={BLOQUEADO_CONFIG[true].text}
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

        {selectedUser && (
          <BasicModal
            type="adminUsers"
            show={modalShow}
            functionUpdateData={setUpdateMark}
            functionNewUpdatedData={setUpdatedUser}
            onHide={() => setModalShow(false)}
            userData={selectedUser}
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

export default AdminUsers;