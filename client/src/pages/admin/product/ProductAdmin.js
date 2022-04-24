import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MyTable from "../../../components/MyTable";
import {
  FormControl,
  IconButton,
  InputBase,
  InputLabel,
  MenuItem,
  Paper,
  Select,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import searchProductFilter from "../../../helpers/searchProductFilter";

export default function ProductAdmin() {
  const [category, setCategory] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const products = useSelector((state) => state.products);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productSearched, setProductSearched] = useState([]);
  useEffect(() => {
    setFilteredProducts([...products?.data]);
    setProductSearched([...products?.data]);
  }, [products]);
  const onHandleSearch = () => {
    if (category === "all") {
      setFilteredProducts(searchProductFilter(products.data, searchValue));
      setProductSearched(searchProductFilter(products.data, searchValue));
    } else {
      setFilteredProducts(
        searchProductFilter(
          products?.data.filter((product) => product.category === category),
          searchValue
        )
      );
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onHandleSearch();
    }
  };

  const handleChangeCategory = (event) => {
    setCategory(event.target.value);
    if (event.target.value === "all") {
      setFilteredProducts([...productSearched]);
    } else if (event.target.value === "watch") {
      setFilteredProducts(
        productSearched.filter((product) => product.category === "watch")
      );
    } else if (event.target.value === "phone") {
      setFilteredProducts(
        productSearched.filter((product) => product.category === "phone")
      );
    } else if (event.target.value === "laptop") {
      setFilteredProducts(
        productSearched.filter((product) => product.category === "laptop")
      );
    } else {
      setFilteredProducts(
        productSearched.filter((product) => product.category === "tablet")
      );
    }
  };
  return (
    <div className="container-fluid pb-3 productAdmin">
      <div className="row">
        <div className="row pt-5 pb-5">
          <div className="col-sm-12 sessionTitle">
            <i className="fab fa-apple"></i> <span>Quản lý sản phẩm</span>
          </div>
        </div>

        <div className="col-12 pb-5">
          <div className="container-fluid p-0">
            <div className="row">
              <div className="col-12 col-sm-3">
                <Link to="/admin/product/add">
                  <button type="button" className="btn btn-primary">
                    Đăng sản phẩm
                  </button>
                </Link>
              </div>
              <div className="col-12 col-sm-6 mb-3 mt-3 mt-sm-0">
                <Paper
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <InputBase
                    onKeyDown={handleKeyDown}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Tìm kiếm sản phẩm..."
                    inputProps={{ "aria-label": "search products" }}
                  />
                  <IconButton type="submit" sx={{}} aria-label="search">
                    <SearchIcon onClick={onHandleSearch} />
                  </IconButton>
                </Paper>
              </div>
              <div className="col-12 col-sm-3">
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
          <MyTable rows={filteredProducts} type="product" />
        </div>
      </div>
    </div>
  );
}
