import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  BrowserRouter as Router,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import NavBar from "./NavBar";
import NotFound from "./NotFound";
import { ToastContainer } from "react-toastify";
import { fetchUser } from "../redux/slices/userSlice";
import Loading from "./Loading";

function App() {
  const [rendered, setRendered] = useState(false);
  const dispatch = useDispatch();
  let user = useSelector((state) => state.user);
  useEffect(() => {
    setRendered(true);
    dispatch(fetchUser());
  }, [dispatch]);
  return (
    <>
      {user.loading || !rendered ? (
        <Loading />
      ) : (
        <Router>
          <ToastContainer />
          <NavBar />
          <Routes>
            <Route
              path="/"
              element={user.username ? <Home /> : <Navigate to="/login" />}
            ></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/*" element={<NotFound />}></Route>
          </Routes>
        </Router>
      )}
    </>
  );
}

export default App;
