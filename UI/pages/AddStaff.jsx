import { useState } from "react";
import { Card, Form, Button, Container, Row, Col } from "react-bootstrap";
import { ROLE_OPTIONS } from "../constant/AppConstant";

export default function StaffForm() {
  const [formData, setFormData] = useState({
    staffId: "",
    name: "",
    role: "",
    shiftPreference: [],
    address: { street: "", city: "", state: "", zipCode: "" },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Staff Form Data:", formData);
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col xs={12} sm={8} md={6} lg={5}>
          <Card className="p-4 shadow-sm">
            <h4 className="text-center mb-3">Add Staff</h4>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Staff ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="(e.g. DOC001)"
                  name="staffId"
                  value={formData.staffId}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Staff Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Staff Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  {ROLE_OPTIONS.map((opt) => (
                    <option key={opt.value || "default"} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <div className="d-grid">
                <Button type="submit" variant="success">
                  Add Staff
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
