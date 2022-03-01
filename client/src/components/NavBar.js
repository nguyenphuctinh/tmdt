import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logoutAction } from "../redux/slices/userSlice";
import Drawer from "@mui/material/Drawer";
function NavBar() {
  let user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  // console.log(user.role);
  const [drawer, setDrawer] = useState(false);
  return (
    <div>
      <button onClick={() => setDrawer(true)}>menu</button>
      <Drawer anchor={"left"} open={drawer} onClose={() => setDrawer(false)}>
        <Link onClick={() => setDrawer(false)} to="/">
          Home
        </Link>
        <Link onClick={() => setDrawer(false)} to="/phone">
          Phone
        </Link>
        {user.role === "admin" && (
          <Link onClick={() => setDrawer(false)} to="/admin/phone">
            Admin
          </Link>
        )}
        <Link onClick={() => setDrawer(false)} to="/register">
          Đăng ky
        </Link>

        {user.username ? (
          <button
            onClick={() => {
              setDrawer(false);
              dispatch(logoutAction());
              localStorage.removeItem("auth");
            }}
          >
            dang xuat
          </button>
        ) : (
          <Link onClick={() => setDrawer(false)} to="/login">
            Đăng nhập
          </Link>
        )}
      </Drawer>
    </div>
  );
}

export default NavBar;
