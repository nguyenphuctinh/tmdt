import React from "react";
import { Link } from "react-router-dom";

export default function Product({ product, displayedAt }) {
  return (
    <div
      className={`productContainer  ${
        displayedAt === "home"
          ? "col-6  col-sm-4 col-md-3"
          : displayedAt === "slider"
          ? ""
          : " col-6  col-sm-4"
      } mt-5`}
    >
      <Link to={`/product/${product.productName}`}>
        <div className="product">
          <img
            className="productImg"
            width="100%"
            src={product.productVariants[0].imgSrcList[0].img}
            alt=""
          />
          <p className="productName">{product.productName}</p>
          <div className="d-flex price w-100 justify-content-center">
            <p className="productPrice mr-2">
              {parseInt(
                product.productVariants[0].price * (1 - product.sale)
              ).toLocaleString()}
              <small>₫</small>
            </p>
            {product.sale > 0 && (
              <p className="productPrice  productPrice--sale">
                {parseInt(product.productVariants[0].price).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
