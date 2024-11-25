import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import './../css/Navbar.css'; // Ensure this path is correct

function NavigationBar() {
  return (
    <Navbar collapseOnSelect expand="lg" className="navbar-transparent" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/">
          <img
            alt=""
            src="https://seeklogo.com/images/T/Taj_Palace_Hotel-logo-5201DF6D3B-seeklogo.com.png"
            width="60"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          Group of Hotels
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/about">Our Presence</Nav.Link>
            <NavDropdown title="More" id="collapsible-nav-dropdown">
              <NavDropdown.Item as={Link} to="/services">Services</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/contact">Contact Us</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <Nav.Link as={Link} to="/userlogin">User Login</Nav.Link>
            <Nav.Link eventKey={2} as={Link} to="/stafflogin">Staff Login</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
