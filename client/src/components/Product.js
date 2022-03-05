import React from "react";
import { Link } from "react-router-dom";

export default function Product({ product, type }) {
  let price = "";
  let imgSrc = "";
  if (type === "phone") {
    imgSrc = product.phone_variants[0].imgSrcList[0].img;
    price = product.phone_variants[0].price;
  } else if (type === "mac") {
    imgSrc = product.mac_variants[0].imgSrcList[0].img;
    price = product.mac_variants[0].price;
  } else if (type === "watch") {
    imgSrc = product.watch_variants[0].imgSrcList[0].img;
    price = product.watch_variants[0].price;
  } else {
    imgSrc = product.tablet_variants[0].imgSrcList[0].img;
    price = product.tablet_variants[0].price;
  }
  return (
    <div className="col-6  col-sm-4 col-md-3 mt-5">
      <Link to={`/iphone/${product.product_id}`}>
        <div className="product">
          <img className="productImg" width="100%" src={imgSrc} alt="" />
          <p className="productName">{product.product_name}</p>
          <div className="d-flex price w-100 justify-content-center">
            <p className="productPrice mr-2">
              {parseInt(price * (1 - product.sale)).toLocaleString()}
              <small>₫</small>
            </p>
            {product.sale > 0 && (
              <p className="productPrice  productPrice--sale">
                {parseInt(price).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
