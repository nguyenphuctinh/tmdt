import React, { useEffect } from "react";
import { logoutAction } from "../../redux/slices/userSlice.js";
import { useSelector, useDispatch } from "react-redux";

import { Link } from "react-router-dom";
import { changeNavbar } from "../../redux/slices/navbarSlice.js";
export default function Account() {
  let user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(changeNavbar("others"));
    document.title = "Tài khoản";
  });
  return (
    <div className="container-fluid">
      <div className="row">
        <div
          style={{ backgroundColor: "#424B54", minHeight: "100vh" }}
          className="col-3"
        >
          <Link to="/admin/product">Quản lý sản phẩm</Link>
          <br />
          <button
            onClick={() => {
              dispatch(logoutAction());
              localStorage.removeItem("token");
            }}
          >
            dang xuat
          </button>
        </div>
      </div>
    </div>
  );
}
