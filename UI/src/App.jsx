import { lazy, Suspense } from "react";
import { Spinner } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

const AppNavbar = lazy(() => import("../components/Nav"));
const AllStaffs = lazy(() => import("../pages/AllStaffs"));
const AddStaff = lazy(() => import("../pages/AddStaff"));
const LoginPage = lazy(() => import("../pages/Login"));

const AppRoutes = () => {
  const location = useLocation();
  const hideNavbarOn = ["/"];
  const showNavbar = !hideNavbarOn.includes(location.pathname);

  return (
    <>
      {showNavbar && <AppNavbar />}
      <Routes>
        <Route path="/allStaffs" element={<AllStaffs />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/addStaff" element={<AddStaff />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Container fluid>
      <BrowserRouter>
        <Suspense fallback={<Spinner animation="border" />}>
          <AppRoutes />
        </Suspense>
      </BrowserRouter>
    </Container>
  );
}

export default App;
