import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import searchProductFitler from "../../helpers/searchProductFilter";
import Product from "../../components/Product";
export default function Search() {
  let [searchParams] = useSearchParams();
  const q = searchParams.get("q");
  const products = useSelector((state) => state.products);
  const [filteredProducts, setFilteredProducts] = useState([]);
  useEffect(() => {
    setFilteredProducts(searchProductFitler(products.data, q));
  }, [products, q]);
  return (
    <div className="container">
      <div className="row">
        {filteredProducts.map((product) => {
          return <Product product={product} />;
        })}
      </div>
    </div>
  );
}
