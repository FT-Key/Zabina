import Carousel from 'react-bootstrap/Carousel';
import '../css/BasicCarousel.css';

function BasicCarousel({ data }) {
  return (
    <Carousel fade className='basic-custom-carousel' style={{ '--color-border': 'pink' }}>
      {data.slice(0, 3).map((item, index) => (
        <Carousel.Item key={index}>
          <img src={item.imageUrl} alt={item.title} />
          <Carousel.Caption>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default BasicCarousel;