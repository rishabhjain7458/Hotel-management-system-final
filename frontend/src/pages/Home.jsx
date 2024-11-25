import React from 'react';
import { Container, Row, Col, Button, Image, Carousel } from 'react-bootstrap';
import './../css/Home.css'


function Home() {
  return (
    <div>
      <Container fluid style={{ padding: '0', marginBottom: '10vh' }}>
        <Carousel style={{ maxHeight: '100vh' }}>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://img.freepik.com/premium-photo/interior-dark-luxury-hotel-room-night_611456-87.jpg?w=826"
              alt="First slide"
              style={{ maxHeight: '70vh', maxWidth: '100%' }}
            />
          </Carousel.Item>

          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://i.pinimg.com/originals/8f/0a/6b/8f0a6b6c4df4a7ad636162d0508dd2a7.jpg"
              alt="Second slide"
              style={{ maxHeight: '70vh', maxWidth: '100%' }}
            />
          </Carousel.Item>

          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://blackmonarchhotel.com/wp-content/uploads/2019/06/INTR16-1024x683.jpg"
              alt="Third slide"
              style={{ maxHeight: '70vh', maxWidth: '100%' }}
            />
          </Carousel.Item>
        </Carousel>

        {/* Text Overlay on Carousel with animation */}
        <div
          className="carousel-caption"
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            textAlign: 'center',
            fontSize: '3rem',
            fontWeight: 'bold',
            zIndex: '10',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            height:'fit-content'
          }}
        >
          <h2>Welcome to Our Taj Hotels</h2>
          <p>Your comfort is our priority</p>
          <div className="mb-2">
            <Button size="lg" style={{ backgroundColor: '#8D7249' }}>
              Book Now
            </Button>{' '}
          </div>
        </div>

        {/* Floating Container with Random Text and animation */}
        <div
          className="floating-container"
          style={{
            position: 'absolute',
            top: '80%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: '10',
            color: '#8D7249',
            backgroundColor: 'white',
            fontSize: '2rem',
            fontWeight: 'bold',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)',
            width: '50%',
            textAlign: 'center',
          }}
        >
          <Row>
            <Col sm={4} className="hover-col">
              <h2>Hotels</h2>
              <h1>15</h1>
            </Col>
            <Col sm={4} className="hover-col">
              <h2>Customers</h2>
              <h1>300K+</h1>
            </Col>
            <Col sm={4} className="hover-col">
              <h2>Staff</h2>
              <h1>500+</h1>
            </Col>
          </Row>
        </div>
      </Container>

      {/* Best Indian Hotel section with animation */}
      <Container
        fluid
        style={{
          maxWidth: '100%',
          backgroundColor: 'rgb(0,0,0,0.05)',
          color: '#8D7249',
        }}
      >
        <Row>
          <Col sm={1}></Col>
          <Col sm={5} className="best-indian-content" style={{ marginTop: '4%', maxHeight: '50vh', borderRadius: '2%' }}>
            <h3>Welcome to the</h3>
            <h1>Best Indian Hotel</h1>
            <h5>
              Experience unparalleled luxury and comfort at the finest hotel that India has to offer. From world-class amenities to exquisite
              cuisine, we provide the perfect blend of modern convenience and traditional hospitality. Whether you're here for business or leisure,
              our dedicated staff ensures that your stay is nothing short of exceptional. Discover the essence of Indian hospitality and make memories
              that will last a lifetime.
            </h5>
            <Button style={{ backgroundColor: '#8D7249' }}>Contact Us</Button>{' '}
          </Col>
          <Col sm={5} className="image-zoom">
            <Image
              style={{ paddingLeft: '20%', marginTop: '10%', marginBottom: '10%', maxHeight: '50vh' }}
              src="https://elitetraveler.com/wp-content/uploads/sites/8/2021/10/The-Londoner-Exterior-1-CREDIT-Adrian-Houston-RS-scaled.jpg"
              rounded
            />
          </Col>
          <Col sm={1}></Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;
