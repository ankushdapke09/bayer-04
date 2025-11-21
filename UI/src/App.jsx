import { lazy, Suspense } from "react";
import Container from 'react-bootstrap/Container';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListExample from "../componetn/Nav";
import AllStaffs from "../pages/AllStaffs";
import AddStaff from "../pages/AddStaff";
const About = lazy(() => import("../pages/AllStaffs"));

function App() {
  return (
     <Container fluid>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <ListExample></ListExample>
          <Routes>
            <Route path="/" element={<AllStaffs />} />
            <Route path="/addStaff" element={<AddStaff />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Container>
  );
}

export default App;
