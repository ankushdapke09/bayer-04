import { Card, Badge, ListGroup } from "react-bootstrap";

 const StaffCard = ({ data }) =>{
  console.log("staff data in staff card", data);
  return (
    <Card style={{ width: "22rem" }} className="shadow-sm">
      <Card.Body>
        <Card.Title className="fw-bold">{data.name}</Card.Title>

        <Card.Subtitle className="mb-2 text-muted">
          Staff ID: {data.staffId}
        </Card.Subtitle>

        <Card.Text>Role: {data.role}</Card.Text>

        <h6 className="mt-3">Assigned Shifts</h6>
        <ListGroup variant="flush">
          {data.shifts.map((shift, index) => (
            <ListGroup.Item key={index}>
              <div className="d-flex justify-content-between">
                <span>{shift.date}</span>
                <Badge bg="primary" className="text-capitalize">
                  {shift.shift}
                </Badge>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
}

export default StaffCard;