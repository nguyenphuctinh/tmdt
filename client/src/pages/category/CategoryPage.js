import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { changeNavbar } from "../../redux/slices/navbarSlice";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

import Product from "../../components/Product";
import capitalizeFirstLetter from "../../helpers/capitalizeFirstLetter";
import NotFound from "../notfound/NotFound";
import Slider from "../home/Slider";
export default function CategoryPage() {
  const category = useParams().category;
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    setFilteredProducts(
      products.data.filter((item) => item.category === category)
    );
  }, [products, category]);
  useEffect(() => {
    dispatch(changeNavbar(category));
    if (category === "phone") {
      document.title = "Điện thoại iPhone chính hãng";
    } else if (category === "laptop") {
      document.title = "Macbook chính hãng";
    } else if (category === "tablet") {
      document.title = "Máy tính bảng iPad chính hãng";
    } else if (category === "watch") {
      document.title = "Đồng hồ thông minh Apple Watch chính hãng";
    }
  }, [category, dispatch]);
  if (
    category !== "phone" &&
    category !== "laptop" &&
    category !== "tablet" &&
    category !== "watch"
  ) {
    return <NotFound />;
  }
  return (
    <div className="container pb-3">
      <div className="row">
        <div className="col-sm-12 sessionTitle">
          <span>{capitalizeFirstLetter(category)}</span>
        </div>
      </div>
      <div className="row">
        {" "}
        {filteredProducts?.map((item) => {
          return (
            <Product
              displayedAt="category"
              key={item.productId}
              product={item}
            />
          );
        })}
        <div className="col-9">
          <div className="container-fluid">
            <div className="row"> </div>
          </div>
        </div>
      </div>
    </div>
  );
}
