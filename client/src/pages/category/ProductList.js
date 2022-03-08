import React from "react";
import { useSelector } from "react-redux";
import Loading from "../../components/Loading";
import Product from "../../components/Product";
import capitalizeFirstLetter from "../../helpers/capitalizeFirstLetter";
export default function ProductList({ category }) {
  const products = useSelector((state) => state.products);
  const filteredProducts = products?.data.filter(
    (product) => product.category === category
  );
  return (
    <div className="container">
      {products.loading ? (
        ""
      ) : (
        <div className="row pt-4">
          <div class="col-sm-12 sessionTitle">
            <i class="fab fa-apple"></i>{" "}
            <span>{capitalizeFirstLetter(category)}</span>
          </div>
          {filteredProducts?.map((item) => {
            return <Product key={item.productId} product={item} />;
          })}
        </div>
      )}
    </div>
  );
}
