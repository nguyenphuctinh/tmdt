import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import capitalizeFirstLetter from "../../helpers/capitalizeFirstLetter";
import getColor, { dict } from "../../helpers/dict";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

export default function ProductDetail() {
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const { productId } = useParams();
  const product = products?.data.find(
    (product) => product.productId === parseInt(productId)
  );
  const [selectedProductVariant, setSelectedProductVariant] = useState(null);
  let variantNames = [];
  for (const key in product?.variants) {
    variantNames.push(key);
  }
  if (product && selectedProductVariant === null) {
    setSelectedProductVariant(product.productVariants[0]);
  }
  useEffect(() => {
    // console.log(selectedProductVariant);
  });
  return (
    <div className="container">
      {product && (
        <div className="row productDetail pt-2 pb-5">
          <div className="col-sm-6">
            <Carousel>
              {selectedProductVariant?.imgSrcList.map(({ img }) => {
                return (
                  <img
                    key={img}
                    className="productImg"
                    width="100%"
                    src={img}
                    alt=""
                  />
                );
              })}
            </Carousel>
            <div className="">
              <img className="productImg" width="100%" src="" alt="" />
            </div>
          </div>
          <div className="col-sm-6 pt-5">
            <p className="productName">{product.productName}</p>
            <div className="d-flex ">
              <p className="productPrice mr-2">
                {selectedProductVariant &&
                  parseInt(
                    selectedProductVariant.price * (1 - product.sale)
                  ).toLocaleString()}
                ₫
              </p>
              <p className="productPrice--sale">
                {selectedProductVariant &&
                  product.sale > 0 &&
                  selectedProductVariant.price.toLocaleString() + "₫"}
              </p>
            </div>

            {variantNames?.map((variantName) => {
              return (
                <div key={variantName}>
                  <p>{capitalizeFirstLetter(dict[variantName])}</p>
                  {[...product.variants[variantName]].sort().map((value) => {
                    if (variantName !== "color") {
                      return (
                        <span
                          onClick={() => {
                            setSelectedProductVariant(
                              findProductVariant(
                                product.productVariants,
                                variantNames,
                                selectedProductVariant,
                                { [variantName]: value }
                              )
                            );
                          }}
                          key={value}
                        >
                          <div
                            className={`capacity ${
                              selectedProductVariant &&
                              selectedProductVariant[variantName] === value
                                ? "capacity--active "
                                : ""
                            }`}
                          >
                            <p className="capacity__name">
                              {value.toUpperCase()}
                            </p>
                          </div>
                        </span>
                      );
                    } else {
                      return (
                        <span
                          key={value}
                          onClick={() => {
                            setSelectedProductVariant(
                              findProductVariant(
                                product.productVariants,
                                variantNames,
                                selectedProductVariant,
                                { [variantName]: value }
                              )
                            );
                          }}
                        >
                          <div
                            className={`color ${
                              selectedProductVariant &&
                              selectedProductVariant[variantName] === value
                                ? "color--active "
                                : ""
                            }`}
                            style={{
                              backgroundColor: getColor(value.toLowerCase()),
                            }}
                          ></div>
                        </span>
                      );
                    }
                  })}
                </div>
              );
            })}

            <p className="mt-3"></p>

            <a href="/addtocart/{{product.id}}?color={{selectedcolor}}&capacity={{selectedcapacity}}">
              <div className="addtocart mr-lg-3">Thêm vào giỏ</div>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
const findProductVariant = (
  productVariants,
  variantNames,
  preProductVariant,
  variantValue
) => {
  let productVariant = null;
  productVariants.forEach((variant) => {
    let count = 0;
    variantNames.forEach((variantName) => {
      if (
        (variant[variantName] === preProductVariant[variantName] &&
          !variantValue[variantName]) ||
        (variant[variantName] === variantValue[variantName] &&
          variantValue[variantName])
      ) {
        count++;
      }
    });
    if (count === variantNames.length) {
      productVariant = variant;
    }
  });
  return productVariant;
};
