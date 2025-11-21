import { useGetStaffsQuery } from "../src/RTK/staffsService";

const AllStaffs = () => {
  const {data: staffs} = useGetStaffsQuery({});
  console.log("staffs data in all staffs page", staffs);
  return <div>All Staffs Page</div>;
};
export default AllStaffs;
