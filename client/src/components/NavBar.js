import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logoutAction } from "../redux/slices/userSlice";
function NavBar() {
  let user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  // console.log(user.role);
  return (
    <div>
      <Link to="/">Home</Link>
      <Link to="/phone">Phone</Link>
      {user.role === "admin" && <Link to="/admin">Admin</Link>}
      <Link to="/register">Đăng ky</Link>
      {user.username ? (
        <button
          onClick={() => {
            dispatch(logoutAction());
            localStorage.removeItem("auth");
          }}
        >
          dang xuat
        </button>
      ) : (
        <Link to="/login">Đăng nhập</Link>
      )}
    </div>
  );
}

export default NavBar;
