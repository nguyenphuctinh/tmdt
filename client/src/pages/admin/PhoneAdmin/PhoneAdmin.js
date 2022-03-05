import { useSelector, useDispatch } from "react-redux";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchPhone } from "../../../redux/slices/phoneSlice";
import MyTable from "../../../components/MyTable";
export default function PhoneAdmin() {
  const phones = useSelector((state) => state.phones);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchPhone());
  }, [dispatch]);
  return (
    <div className="container-fluid">
      <div className="row">
        <div class="row pt-5 pb-5">
          <div class="col-sm-12 sessionTitle">
            <i class="fab fa-apple"></i> <span>Quản lý điện thoại</span>
          </div>
        </div>

        <div className="col-12">
          <Link to="/admin/phone/add">
            <button type="button" class="btn btn-primary">
              Đăng sản phẩm
            </button>
          </Link>
          <h6 style={{ textAlign: "center" }}>Danh sách sản phẩm</h6>

          <MyTable rows={phones.data} type="product" />
        </div>
      </div>
    </div>
  );
}
