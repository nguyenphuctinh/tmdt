import React, { useEffect, useState } from "react";

import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changeNavbar } from "../../../redux/slices/navbarSlice";
import ProductAdmin from "../product/ProductAdmin";
import OrderAdmin from "../order/OrderAdmin";

export default function Admin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  let user = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(changeNavbar("admin"));
    document.title = "Quản lý";
    if (!tab) navigate("/admin?tab=product");
    else navigate("/admin?tab=" + tab);
  }, []);
  useEffect(() => {}, [tab]);
  return (
    <div className="container-fluid">
      <div className="row">
        <div style={{ backgroundColor: "#424B54" }} className="col-12 col-sm-2">
          <Link to="/admin?tab=product">Quản lý sản phẩm</Link>
          <br />
          <Link to="/admin?tab=user">Quản lý người dùng</Link>
          <br />
          <Link to="/admin?tab=order">Quản lý đơn hàng</Link>
          <br />
          <Link to="/admin?tab=promotion">Quản lý sự kiện</Link>
        </div>
        <div style={{ minHeight: "100vh" }} className="col-sm-10 p-0">
          {tab === "product" ? (
            <ProductAdmin />
          ) : tab === "user" ? (
            <div>Quản lý người dùng</div>
          ) : tab === "order" ? (
            <OrderAdmin />
          ) : tab === "promotion" ? (
            <div>Quản lý sự kiện</div>
          ) : (
            <p>Không có trang này</p>
          )}
        </div>
      </div>
    </div>
  );
}
