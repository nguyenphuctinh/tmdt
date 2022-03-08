import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { changeNavbar } from "../../redux/slices/navbarSlice";
import ProductList from "./ProductList";
export default function CategoryPage() {
  const category = useParams().category;
  console.log(category);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(changeNavbar(category));
    console.log(category);
    if (category === "phone") {
      document.title = "Điện thoại iPhone chính hãng";
    } else if (category === "laptop") {
      document.title = "Macbook chính hãng";
    } else if (category === "tablet") {
      document.title = "Máy tính bảng iPad chính hãng";
    } else {
      document.title = "Đồng hồ thông minh Apple Watch chính hãng";
    }
  }, [category]);

  return (
    <div>
      <ProductList category={category} />
    </div>
  );
}
