import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import PromotionTable from "./PromotionTable";

export default function Promotion() {
  const promtions = useSelector((state) => state.promotions);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <button type="button" className="btn btn-primary">
            <Link to="/admin/promotion/add"> Tạo sự kiện</Link>
          </button>
          <h4 className="text-center">Danh sách các sự kiện</h4>
          {promtions.data ? <PromotionTable rows={promtions.data} /> : ""}
        </div>
      </div>
    </div>
  );
}
