import React from "react";
import { Link } from "react-router-dom";

export default function Product({ product, displayType = "4" }) {
  return (
    <div
      className={`col-6 productContainer  col-sm-4 col-md-${displayType} mt-5`}
    >
      <Link to={`/product/${product.productId}`}>
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
