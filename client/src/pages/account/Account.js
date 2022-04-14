import React, { useEffect, useState } from "react";
import { logoutAction } from "../../redux/slices/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import { changeNavbar } from "../../redux/slices/navbarSlice.js";
import UpdatePw from "./UpdatePw.js";
import Info from "./Info.js";
import { removeAllItems } from "../../redux/slices/cartSlice.js";
import Orders from "./Orders.js";
export default function Account() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  let user = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(changeNavbar("others"));
    document.title = "Tài khoản";
    navigate("/account?tab=" + tab);
  }, []);
  useEffect(() => {}, [tab]);
  return (
    <div className="container-fluid">
      <div className="row">
        <div style={{ backgroundColor: "#424B54" }} className="col-12 col-sm-3">
          <div>
            {user.data.role === "admin" ? (
              <>
                <Link to="/admin/product">Quản lý sản phẩm</Link>
                <br />
                <Link to="/admin/user">Quản lý người dùng</Link>
                <br />
                <Link to="/admin/order">Quản lý đơn hàng</Link>
              </>
            ) : (
              ""
            )}
          </div>
          <p>
            <Link to="/account?tab=info"> Cập nhật thông tin</Link>
          </p>

          <p>
            <Link to="/account?tab=security"> Đổi mật khẩu</Link>
          </p>
          <p>
            <Link to="/account?tab=orders"> Đơn hàng của bạn</Link>
          </p>
          <button
            type="button"
            className="btn btn-warning"
            onClick={() => {
              dispatch(logoutAction());
              dispatch(removeAllItems());

              localStorage.removeItem("token");
            }}
          >
            Đăng xuất
          </button>
        </div>
        <div style={{ minHeight: "100vh" }} className="col-sm-9">
          {tab === "security" ? (
            <UpdatePw />
          ) : tab === "info" ? (
            <Info />
          ) : (
            <Orders />
          )}
        </div>
      </div>
    </div>
  );
}
