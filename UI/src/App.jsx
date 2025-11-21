import { useSelector } from "react-redux";

function App() {
  const data = useSelector((state) => state.staffs);
  console.log("staff data", data);

  return <>l</>;
}

export default App;
