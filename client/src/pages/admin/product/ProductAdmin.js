import { useSelector } from "react-redux";
import React from "react";
import { Link } from "react-router-dom";
import MyTable from "../../../components/MyTable";
export default function ProductAdmin() {
  const products = useSelector((state) => state.products);

  return (
    <div className="container-fluid">
      <div className="row">
        <div class="row pt-5 pb-5">
          <div class="col-sm-12 sessionTitle">
            <i class="fab fa-apple"></i> <span>Quản lý sản phẩm</span>
          </div>
        </div>

        <div className="col-12">
          <Link to="/admin/product/add">
            <button type="button" class="btn btn-primary">
              Đăng sản phẩm
            </button>
          </Link>
          <h6 style={{ textAlign: "center" }}>Danh sách sản phẩm</h6>

          <MyTable rows={products.data} type="product" />
        </div>
      </div>
    </div>
  );
}
