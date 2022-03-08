import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MyTable from "../../../components/MyTable";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export default function ProductAdmin() {
  const [category, setCategory] = useState("all");
  const products = useSelector((state) => state.products);
  const [filteredProducts, setFilteredProducts] = useState([]);
  useEffect(() => {
    document.title = "Quản lý sản phẩm";
    setFilteredProducts([...products?.data]);
    console.log(products);
  }, [products]);

  const handleChangeCategory = (event) => {
    setCategory(event.target.value);
    if (event.target.value === "all") {
      setFilteredProducts([...products?.data]);
    } else if (event.target.value === "watch") {
      setFilteredProducts(
        products?.data.filter((product) => product.category === "watch")
      );
    } else if (event.target.value === "phone") {
      setFilteredProducts(
        products?.data.filter((product) => product.category === "phone")
      );
    } else if (event.target.value === "laptop") {
      setFilteredProducts(
        products?.data.filter((product) => product.category === "laptop")
      );
    } else {
      setFilteredProducts(
        products?.data.filter((product) => product.category === "tablet")
      );
    }
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div class="row pt-5 pb-5">
          <div class="col-sm-12 sessionTitle">
            <i class="fab fa-apple"></i> <span>Quản lý sản phẩm</span>
          </div>
        </div>

        <div className="col-12">
          <div className="container-fluid">
            <div className="row">
              <div className="col-5 col-sm-3">
                <Link to="/admin/product/add">
                  <button type="button" class="btn btn-primary">
                    Đăng sản phẩm
                  </button>
                </Link>
              </div>
              <div className="col-2 col-sm-6"></div>
              <div className="col-5 col-sm-3">
                <FormControl className="" fullWidth>
                  <InputLabel
                    style={{ color: "#0d6efd" }}
                    id="demo-simple-select-label"
                  >
                    Thể loại
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: "white" }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={category}
                    label="Thể loại"
                    onChange={handleChangeCategory}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="phone">Phone</MenuItem>
                    <MenuItem value="laptop">Laptop</MenuItem>
                    <MenuItem value="tablet">Tablet</MenuItem>
                    <MenuItem value="watch">Watch</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>
          <h6 style={{ textAlign: "center" }}>Danh sách sản phẩm</h6>
          {console.log(filteredProducts)}
          <MyTable rows={filteredProducts} type="product" />
        </div>
      </div>
    </div>
  );
}
