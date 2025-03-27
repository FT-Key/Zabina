import { Link } from 'react-router-dom';
import '../css/Footer.css';
import { Col, Container, Row } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className='mt-auto footer'>
      <Container>
        <Row className='gy-3'>
          <Col sm={12} md={4} className='d-flex flex-column justify-content-center'>
            <h6>Tel: +098 7 654-321</h6>
            <h6>Dir: Arg, calle Inventada 321, Piso 0, Dpto. 0</h6>
          </Col>

          <Col sm={12} md={4} className='d-flex flex-column justify-content-center'>
            <div className={'container-footer'}>
              <h3 className={'text-footer'}>© {new Date().getFullYear()} Zabina. Todos los derechos reservados.</h3>
              <div className={'socialLinks-footer'}>
                <Link to="/sobreMi" className={'link-footer'}>Sobre mí</Link>
                <Link to="/comentarios" className={'link-footer'}>Califícanos</Link>
              </div>
              <div className={'socialLinks-footer'}>
                <Link to={'/NotFound'} className={'link-footer'}><FaFacebook size={24} /></Link>
                <Link to={'/NotFound'} className={'link-footer'}><FaTwitter size={24} /></Link>
                <Link to={'/NotFound'} className={'link-footer'}><FaInstagram size={24} /></Link>
              </div>
            </div>
          </Col>

          <Col sm={12} md={4} className='d-flex flex-column justify-content-center'>
          </Col>
        </Row>
      </Container>

    </footer>
  );
};

export default Footer;