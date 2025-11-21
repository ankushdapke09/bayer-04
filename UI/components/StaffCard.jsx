// ...existing code...
import { useState } from "react";
import { Card, Badge, ListGroup, Form, Button } from "react-bootstrap";
import { AFTERNOON, MORNING, NIGHT } from "../constant/AppConstant";
import { useBookShiftsMutation } from "../src/RTK/staffsService";

 const StaffCard = ({ data }) =>{
  console.log("staff data in staff card", data);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [bookShifts] = useBookShiftsMutation();

  const shiftOptions = [MORNING, AFTERNOON, NIGHT];

    const formatDate = (val) => {
    if (!val) return "";
    const d = new Date(val);
    if (isNaN(d)) return String(val);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  };

  const getBadgeBg = (shift) => {
    switch (shift) {
      case MORNING:
        return "warning";
      case AFTERNOON:
        return "info";
      case NIGHT:
        return "dark";
      default:
        return "secondary";
    }
  }

  const handleBook = () => {
    const booking = {
      staffId: data._id,
      date: selectedDate,
      shift: selectedShift,
    };
    console.log("Booking shift:", booking);
    bookShifts(booking);
    setSelectedDate("");
    setSelectedShift("");
  };

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
          {data.shiftPreference.map((shift, index) => (
            <ListGroup.Item key={index}>
              <div className="d-flex justify-content-between">
                <span>{formatDate(shift.date)}</span>
                <Badge bg={getBadgeBg(shift.shift)} className="text-capitalize">
                  {shift.shift}
                </Badge>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>

        <hr />

        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Book Date</Form.Label>
            <Form.Control
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Shift</Form.Label>
            <Form.Select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
            >
              <option value="">Select shift</option>
              {shiftOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <div className="d-grid mt-2">
            <Button
              variant="primary"
              disabled={!selectedDate || !selectedShift}
              onClick={handleBook}
            >
              Book Shift
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default StaffCard;