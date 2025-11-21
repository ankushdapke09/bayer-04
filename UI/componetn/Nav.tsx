import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export default function AppNavbar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand>Health Care</Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">

            <LinkContainer to="/">
              <Nav.Link>All Staffs</Nav.Link>
            </LinkContainer>

            <LinkContainer to="/addStaff">
              <Nav.Link>Add Staff</Nav.Link>
            </LinkContainer>

            <LinkContainer to="/bookShifts">
              <Nav.Link>Book Shifts</Nav.Link>
            </LinkContainer>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
