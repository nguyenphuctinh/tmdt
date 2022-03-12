import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import capitalizeFirstLetter from "../../helpers/capitalizeFirstLetter";
import getColor, { dict } from "../../helpers/dict";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import sortByIntValues from "../../helpers/sortByIntValues";
export default function ProductDetail() {
  const [variantValues, setVariantValues] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [changed, setChanged] = useState(false);
  const products = useSelector((state) => state.products);
  const { productId } = useParams();
  const product = products?.data.find(
    (product) => product.productId === parseInt(productId)
  );
  const [selectedProductVariant, setSelectedProductVariant] = useState(null);
  const [variantNames, setVariantNames] = useState([]);
  useEffect(() => {
    setSelectedProductVariant(product?.productVariants[0]);
    if (product) {
      let tmpVariantValues = [];
      for (const key in product.variants) {
        tmpVariantValues.push(key);
      }
      setVariantNames([...tmpVariantValues]);
      document.title = `${product.productName}`;
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      if (changed) {
        const tmp = findVariantValues(
          product.productVariants,
          variantNames,
          selectedProductVariant
        );
        setVariantValues({ ...tmp });
      } else {
        let tmp = {};
        variantNames.forEach((variantName) => {
          tmp = { ...tmp, [variantName]: [...product.variants[variantName]] };
        });
        setVariantValues({ ...tmp });
      }
    }
  }, [product, variantNames, selectedProductVariant, changed]);

  return (
    <div className="container">
      {product && (
        <div className="row productDetail pt-2 pb-5">
          <div className="col-sm-6">
            <Carousel
              showStatus={false}
              showThumbs={imgLoaded}
              showIndicators={imgLoaded}
            >
              {selectedProductVariant?.imgSrcList.map(({ img }) => {
                return (
                  <img
                    onLoad={() => setImgLoaded(true)}
                    key={img}
                    className="productImg"
                    width="100%"
                    src={img}
                    alt=""
                  />
                );
              })}
            </Carousel>
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
                  {variantValues[variantName] &&
                    [...sortByIntValues(variantValues[variantName])].map(
                      (value) => {
                        if (variantName !== "color") {
                          return (
                            <span key={value}>
                              <div
                                onClick={() => {
                                  setImgLoaded(false);
                                  setChanged(true);
                                  setSelectedProductVariant(
                                    findProductVariant(
                                      product.productVariants,
                                      variantNames,
                                      selectedProductVariant,
                                      { [variantName]: value }
                                    )
                                  );
                                }}
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
                            <span>
                              <div
                                key={value}
                                onClick={() => {
                                  setImgLoaded(false);
                                  setChanged(true);
                                  setSelectedProductVariant(
                                    findProductVariant(
                                      product.productVariants,
                                      variantNames,
                                      selectedProductVariant,
                                      { [variantName]: value }
                                    )
                                  );
                                }}
                                className={`color ${
                                  selectedProductVariant &&
                                  selectedProductVariant[variantName] === value
                                    ? "color--active "
                                    : ""
                                }`}
                                style={{
                                  backgroundColor: getColor(
                                    value.toLowerCase()
                                  ),
                                }}
                              ></div>
                            </span>
                          );
                        }
                      }
                    )}
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
  if (!productVariant) {
    let mess = "";
    variantNames.forEach((variantName) => {
      if (!variantValue[variantName]) {
        mess += `${capitalizeFirstLetter(dict[variantName])}:${
          preProductVariant[variantName]
        } `;
      } else {
        mess += `${capitalizeFirstLetter(dict[variantName])}:${
          variantValue[variantName]
        } `;
      }
    });
    toast.info(`Sản phẩm không có lựa chọn ${mess} !`);
    productVariants.forEach((variant) => {
      variantNames.forEach((variantName) => {
        if (
          (variant[variantName] === preProductVariant[variantName] &&
            !variantValue[variantName]) ||
          (variant[variantName] === variantValue[variantName] &&
            variantValue[variantName])
        ) {
          productVariant = variant;
        }
      });
    });
  }
  return productVariant;
};
const findVariantValues = (productVariants, variantNames, variantValue) => {
  let variantValues = {};
  if (!productVariants || !variantNames || !variantValue) {
    return {};
  }

  let productVariantsOk = new Set();
  variantNames.forEach((variantName) => {
    productVariants.forEach((productVariant) => {
      if (productVariant[variantName] === variantValue[variantName]) {
        productVariantsOk.add(productVariant);
      }
    });
  });
  for (let item of productVariantsOk.values()) {
    variantNames.forEach((variantName) => {
      if (!variantValues[variantName]) {
        variantValues[variantName] = [item[variantName]];
      } else if (!variantValues[variantName].includes(item[variantName])) {
        variantValues[variantName] = [
          ...variantValues[variantName],
          item[variantName],
        ];
      }
    });
  }
  return variantValues;
};
