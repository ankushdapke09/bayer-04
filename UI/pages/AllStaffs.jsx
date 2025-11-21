import React, { useState, useMemo } from "react";
import { useGetStaffsQuery } from "../src/RTK/staffsService";
import StaffCard from "../components/StaffCard";
import { Col, Row, Form, InputGroup, Button, Spinner } from "react-bootstrap";

// ...existing code...
const AllStaffs = () => {
  const { data: staffs, isSuccess, isFetching } = useGetStaffsQuery({});
  const [query, setQuery] = useState("");
  console.log("Fetched staffs:", staffs?.data?.staff );

  const staffsList = staffs?.data?.staff || [];

  const filteredStaffs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return staffsList.filter((st) => {
      return (st.name || "").toLowerCase().includes(q);
    });
  }, [staffsList, query]);

  if (isFetching) {
    return <Spinner animation="border" />;
  }

  return (
    <>
      <Row className="mt-3">
        <Col xs={12} md={6} lg={6}>
          <InputGroup>
            <Form.Control
              placeholder="Search by name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button variant="outline-secondary" onClick={() => setQuery("")}>
              Clear
            </Button>
          </InputGroup>
        </Col>
      </Row>

      <Row className="g-4 mt-3">
        {isSuccess && filteredStaffs.length > 0 ? (
          filteredStaffs.map((staff) => (
            <Col key={staff._id} xs={12} sm={6} md={4} lg={3}>
              <StaffCard data={staff} />
            </Col>
          ))
        ) : (
          <Col xs={12}>
            <div className="text-center text-muted py-4">
              {isSuccess
                ? "No staffs match your search."
                : "No staffs available."}
            </div>
          </Col>
        )}
      </Row>
    </>
  );
};
export default AllStaffs;
