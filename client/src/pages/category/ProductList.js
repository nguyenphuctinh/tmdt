import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Product from "../../components/Product";
import capitalizeFirstLetter from "../../helpers/capitalizeFirstLetter";
export default function ProductList({ category, displayType, limit = "all" }) {
  const products = useSelector((state) => state.products);

  const [filteredProducts, setFilteredProducts] = useState([]);
  useEffect(() => {
    let tmpProducts = products?.data.filter(
      (product) => product.category === category
    );
    if (limit !== "all") {
      tmpProducts = tmpProducts.slice(0, limit);
    }
    setFilteredProducts(tmpProducts);
  }, [products]);
  return (
    <div className="container pb-3">
      {products.loading ? (
        ""
      ) : (
        <div className="row pt-4">
          <div class="col-sm-12 sessionTitle">
            <i class="fab fa-apple"></i>{" "}
            <span>{capitalizeFirstLetter(category)}</span>
          </div>
          {filteredProducts?.map((item) => {
            return (
              <Product
                displayType={displayType}
                key={item.productId}
                product={item}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
