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
import { ToastContainer } from "react-toastify";
import { fetchUser } from "../redux/action";
function App() {
  const [rendered, setRendered] = useState(false);
  const dispatch = useDispatch();
  let user = useSelector((state) => state.user);
  useEffect(() => {
    setRendered(true);
    dispatch(fetchUser());
  }, []);
  return (
    <>
      {user.loading || !rendered ? (
        <h1>loading...</h1>
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
          </Routes>
        </Router>
      )}
    </>
  );
}

export default App;
