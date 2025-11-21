import { lazy, Suspense } from "react";
import { Spinner } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { getIsLoggedIn } from "../selectors";
import BookShifts from "../pages/BookShifts";

const AppNavbar = lazy(() => import("../components/Nav"));
const AllStaffs = lazy(() => import("../pages/AllStaffs"));
const AddStaff = lazy(() => import("../pages/AddStaff"));
const LoginPage = lazy(() => import("../pages/Login"));

const AppRoutes = () => {
  const isLoggedIn = useSelector(getIsLoggedIn);
  const location = useLocation();
  const hideNavbarOn = ["/"];
  const showNavbar = !hideNavbarOn.includes(location.pathname);

  return (
    <>
      {showNavbar && <AppNavbar />}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        {isLoggedIn && (
          <>
            <Route path="/allStaffs" element={<AllStaffs />} />
            <Route path="/addStaff" element={<AddStaff />} />
            <Route path="/bookShifts" element={<BookShifts />} />
          </>
        )}
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
