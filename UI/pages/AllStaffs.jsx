import React from "react";
import { useGetStaffsQuery } from "../src/RTK/staffsService";
import StaffCard from "../components/StaffCard";
import { Col, Row } from "react-bootstrap";

const AllStaffs = () => {
  const { data: staffs, isSuccess } = useGetStaffsQuery({});
  console.log("staffs data in all staffs page", staffs?.data);
  return (
    <Row className="g-4 mt-3">
      {isSuccess &&
        staffs.data?.length > 0 &&
        staffs?.data.map((staff) => (
          <Col key={staff._id} xs={12} sm={6} md={4} lg={3}>
            <StaffCard data={staff} />
          </Col>
        ))}
    </Row>
  );
};
export default AllStaffs;
