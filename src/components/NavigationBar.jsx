import React, { useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown, Modal, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { useAuth } from '../context/AuthContext';
import '../css/NavigationBar.css';
import SVG from './SVG';
import { RedirectToLogin, RedirectToRegister } from '../helpers/Redirects';
import DonationForm from '../components/DonationsForm';

function NavigationBar() {
  const { user, carrito, favoritos, logoutContext } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const setNavbarHeight = () => {
      const navbar = document.querySelector('.navStyle');
      if (navbar) {
        const navbarHeight = navbar.offsetHeight;
        document.documentElement.style.setProperty('--navbar-height', `${navbarHeight}px`);
      }
    };

    setNavbarHeight();
    window.addEventListener('resize', setNavbarHeight);
    return () => {
      window.removeEventListener('resize', setNavbarHeight);
    };
  }, []);

  const handleLoginRedirect = () => {
    RedirectToLogin({ navigate });
    setExpanded(false);
  };

  const handleRegisterRedirect = () => {
    RedirectToRegister({ navigate });
    setExpanded(false);
  };

  const handleLogout = () => {
    logoutContext();
    setExpanded(false);
  };

  return (
    <>
      <div className='nav-space'></div>
      <Navbar bg="light" expand="lg" expanded={expanded} onToggle={() => setExpanded(!expanded)} className='navStyle'>
        <Link className='nav-brand px-2' to="/" onClick={() => setExpanded(false)}>
          <img src={logo} alt="logo" />
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link className='ps-4 zabinaHome' as={Link} to="/" onClick={() => setExpanded(false)}>Zabina</Nav.Link>

            <NavDropdown className='ps-4' title="Nuestros productos" id="basics-nav-dropdown">
              <NavDropdown.Item as={Link} to="/unas" onClick={() => setExpanded(false)}>Catálogo</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/unasinfo" onClick={() => setExpanded(false)}>Info</NavDropdown.Item>
              {user && (user.rol === 'admin' || user.rol === 'cliente') && (
                <>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/turnos" onClick={() => setExpanded(false)}>Solicitar turno</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/turnos/lista" onClick={() => setExpanded(false)}>Mis turnos</NavDropdown.Item>
                </>
              )}
            </NavDropdown>

            <Nav.Link className='ps-4' as={Link} to="/SobreMi">Quiénes somos</Nav.Link>
            <Nav.Link className='ps-4' as={Link} to="/productos">Tienda</Nav.Link>
            <Nav.Link className='ps-4' onClick={() => setShowModal(true)}>Donar</Nav.Link>

            {user && (user.rol === 'admin' || user.rol === 'cliente') && (
              <>
                <Nav.Link className='ps-4' as={Link} to="/planes" onClick={() => setExpanded(false)}>Nuestros planes</Nav.Link>
              </>
            )}

            {user && user.rol === 'admin' && (
              <NavDropdown className='ps-4' title="Admin" id="admin-nav-dropdown">
                <NavDropdown.Item as={Link} to="/adminUsers" onClick={() => setExpanded(false)}>Admin Usuarios</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/adminProducts" onClick={() => setExpanded(false)}>Admin Productos</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/adminAppointments" onClick={() => setExpanded(false)}>Admin Turnos</NavDropdown.Item>
              </NavDropdown>
            )}

            {user
              ? (user.rol === 'admin' || user.rol === 'cliente') && (
                <div className='contenedor-links'>
                  <div className='position-relative'>
                    <abbr title="Carrito" className='abbr'>
                      <Link to="/carrito" className='carrito-link' onClick={() => setExpanded(false)}>
                        <SVG
                          name={carrito.length > 0 ? 'cart-go-fill' : 'cart-normal-fill'}
                          width="42px"
                          height="42px"
                          color={carrito.length > 0 ? 'green' : 'transparent'}
                        />
                        <span className={`cart-item-count${carrito.length > 0 ? ' show-space' : ' hidden-space'}`}>{carrito.length}</span>
                      </Link>
                    </abbr>
                  </div>

                  <div className='position-relative'>
                    <abbr title="Favoritos" className='abbr'>
                      <Link to="/favoritos" className='favoritos-link' onClick={() => setExpanded(false)}>
                        <SVG
                          name={'favs-heart-fill'}
                          width="42px"
                          height="42px"
                          color={favoritos.length > 0 ? '#ff0019' : 'transparent'}
                        />
                        <span className={`favs-item-count${favoritos.length > 0 ? ' show-space' : ' hidden-space'}`}>{favoritos.length}</span>
                      </Link>
                    </abbr>
                  </div>
                  <Nav.Link className='ps-4 text-danger' onClick={handleLogout}>Cerrar Sesión</Nav.Link>
                </div>
              )
              : (
                <div className='contenedor-links'>
                  <Nav.Link className='ps-4' onClick={handleLoginRedirect}>Iniciar Sesión</Nav.Link>
                  <Nav.Link className='ps-4' onClick={handleRegisterRedirect}>Registrarse</Nav.Link>
                </div>
              )
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Hacer una Donación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DonationForm />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default NavigationBar;