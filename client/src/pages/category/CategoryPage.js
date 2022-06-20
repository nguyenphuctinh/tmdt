import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { changeNavbar } from "../../redux/slices/navbarSlice";
import { useSelector } from "react-redux";
import Product from "../../components/Product";
import capitalizeFirstLetter from "../../helpers/capitalizeFirstLetter";
import NotFound from "../notfound/NotFound";
import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import phoneImg from "../../assets/images/2400-600-1920x480-7.png";
// import watchImg from "../../assets/images/2400-600-1920x480-5.png";
import { CategoryPageImg } from "./CategoryPage.style";
export default function CategoryPage() {
  const category = useParams().category;
  const [sort, setSort] = useState("mới nhất");
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);
  const [filteredProducts, setFilteredProducts] = useState([]);
  useEffect(() => {
    let tmp = [...filteredProducts];
    tmp.sort((a, b) => {
      if (sort === "mới nhất") {
        return b.productId - a.productId;
      } else if (sort === "cũ nhất") {
        return a.productId - b.productId;
      } else if (sort === "giá tăng dần") {
        return (
          a.productVariants[0].price * (1 - a.sale) -
          b.productVariants[0].price * (1 - b.sale)
        );
      } else if (sort === "giá giảm dần") {
        return (
          b.productVariants[0].price * (1 - b.sale) -
          a.productVariants[0].price * (1 - a.sale)
        );
      }
    });
    setFilteredProducts([...tmp]);
  }, [sort]);
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
    <Grid container display={"flex"} justifyContent="end">
      <Grid item xs={12}>
        <div className="col-sm-12 sessionTitle">
          <span>{capitalizeFirstLetter(category)}</span>
        </div>
      </Grid>
      <Grid item xs={12}>
        <CategoryPageImg width={"100%"} src={phoneImg} alt="" />
      </Grid>
      <Grid xs={3}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Xếp theo</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={sort}
            label="Xếp theo"
            onChange={(e) => setSort(e.target.value)}
          >
            <MenuItem value="mới nhất">mới nhất</MenuItem>
            <MenuItem value="cũ nhất">cũ nhất</MenuItem>
            <MenuItem value="giá giảm dần">giá giảm dần</MenuItem>
            <MenuItem value="giá tăng dần">giá tăng dần</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid xs={12}>
        <Grid container>
          {filteredProducts?.map((item) => {
            return (
              <Product
                displayedAt="category"
                key={item.productId}
                product={item}
              />
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
}
