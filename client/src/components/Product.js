import React from "react";
import { Link } from "react-router-dom";

export default function Product({ product }) {
  return (
    <div className="col-6  col-sm-4 col-md-3 mt-5">
      <Link to={`/iphone/${product.product_id}`}>
        <div className="product">
          <img
            className="productImg"
            width="100%"
            src={product.variants[0].imgSrcList[0].img}
            alt=""
          />
          <p className="productName">{product.product_name}</p>
          <div className="d-flex price w-100 justify-content-center">
            <p className="productPrice mr-2">
              {parseInt(
                product.variants[0].price * (1 - product.sale)
              ).toLocaleString()}
              <small>₫</small>
            </p>
            {product.sale > 0 && (
              <p className="productPrice  productPrice--sale">
                {parseInt(product.variants[0].price).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
