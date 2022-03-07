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
  const [selectedVariantValues, setSelectedVariantValues] = useState({});
  let variantNames = [];
  for (const key in product?.variants) {
    variantNames.push(key);
  }
  if (product && selectedProductVariant === null) {
    setSelectedProductVariant(product.productVariants[0]);
    let tmpVariantValues = {};
    variantNames.forEach((variantName) => {
      tmpVariantValues = {
        ...tmpVariantValues,
        [variantName]: product.productVariants[0][variantName],
      };
    });
    setSelectedVariantValues(tmpVariantValues);
  }

  return (
    <div className="container">
      {product && (
        <div className="row productDetail pt-2 pb-5">
          <div className="col-sm-6">
            <Carousel>
              {selectedProductVariant?.imgSrcList.map(({ img }) => {
                return (
                  <img className="productImg" width="100%" src={img} alt="" />
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
                  {product.variants[variantName].map((value) => {
                    if (variantName !== "color") {
                      return (
                        <span
                          onClick={() => {
                            setSelectedVariantValues({
                              ...selectedVariantValues,
                              [[variantName]]: value,
                            });
                            setSelectedProductVariant(
                              findProductVariant(
                                product.productVariants,
                                variantNames,
                                selectedVariantValues
                              )
                            );
                          }}
                          key={value}
                        >
                          <div
                            className={`capacity ${
                              selectedVariantValues[variantName] === value
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
                            setSelectedVariantValues({
                              ...selectedVariantValues,
                              [[variantName]]: value,
                            });
                            setSelectedProductVariant(
                              findProductVariant(
                                product.productVariants,
                                variantNames,
                                selectedVariantValues
                              )
                            );
                          }}
                        >
                          <div
                            className={`color ${
                              selectedVariantValues[variantName] === value
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
const findProductVariant = (productVariants, variantNames, values) => {
  let productVariant = null;
  productVariants.forEach((variant) => {
    variantNames.forEach((variantName) => {
      console.log(variant[variantName], values[variantName]);
      if (variant[variantName] === values[variantName]) {
        productVariant = variant;
      }
    });
  });
  console.log(productVariant, values);
  return productVariant;
};
