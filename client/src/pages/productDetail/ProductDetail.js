import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import capitalizeFirstLetter from "../../helpers/capitalizeFirstLetter";
import { dict } from "../../helpers/dict";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import sortByIntValues from "../../helpers/sortByIntValues";
import NotFound from "../notfound/NotFound";
import InfoOrderForm from "../../components/InfoOrderForm";
import { addItem } from "../../redux/slices/cartSlice";
export default function ProductDetail() {
  let user = useSelector((state) => state.user);
  let cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [variantValues, setVariantValues] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [changed, setChanged] = useState(false);
  const products = useSelector((state) => state.products);
  const { productName } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedProductVariant, setSelectedProductVariant] = useState(null);
  const [variantNames, setVariantNames] = useState([]);
  const [updateInfoOrderFormOpened, setUpdateInfoOrderFormOpened] =
    useState(false);
  useEffect(() => {
    console.log(productName);
    setProduct(
      products?.data.find((item) => {
        return item.productName === productName;
      })
    );
  }, [products]);
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
  const onHandleBuyNow = () => {
    setUpdateInfoOrderFormOpened(true);
  };
  const onHandleAddToCart = async () => {
    let selectedVariantValues = [];
    variantNames.forEach((variantName) => {
      selectedVariantValues.push({
        variantName,
        value: selectedProductVariant[variantName],
      });
    });
    if (!user.data) {
      dispatch(
        addItem({
          productName: product.productName,
          productVariantId: selectedProductVariant.productVariantId,
          sale: product.sale,
          price: selectedProductVariant.price,
          quantity,
          imgSrc: selectedProductVariant.imgSrcList[0].img,
          variantValues: [...selectedVariantValues],
        })
      );
    } else {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/carts`,
          {
            productVariantId: selectedProductVariant.productVariantId,
            sale: product.sale,
            price: selectedProductVariant.price,
            quantity,
            userId: user.data.id,
          }
        );

        dispatch(
          addItem({
            productName: product.productName,
            productVariantId: selectedProductVariant.productVariantId,
            sale: product.sale,
            price: selectedProductVariant.price,
            quantity,
            imgSrc: selectedProductVariant.imgSrcList[0].img,
            variantValues: [...selectedVariantValues],
          })
        );
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };
  if (product === undefined) {
    return <NotFound />;
  }

  return product ? (
    <>
      <div className="container">
        {updateInfoOrderFormOpened ? (
          <>
            <div
              onClick={() => setUpdateInfoOrderFormOpened(false)}
              style={{
                position: "fixed",
                height: "100vh",
                width: "100vw",
                zIndex: "2",
                left: 0,
                // top: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            ></div>
            <div
              style={{
                position: "fixed",
                width: "50%",
                left: "50%",
                overflowY: "auto",
                height: "400px",
                transform: "translate(-50%, 0)",
                zIndex: "3",
              }}
            >
              <InfoOrderForm
                productVariants={[
                  {
                    productVariantId: selectedProductVariant.productVariantId,
                    sale: product.sale,
                    price: selectedProductVariant.price,
                    quantity,
                  },
                ]}
              />
            </div>
          </>
        ) : (
          ""
        )}
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
                              className={`option ${
                                selectedProductVariant &&
                                selectedProductVariant[variantName] === value
                                  ? "option--active "
                                  : ""
                              }`}
                            >
                              <p className="option__name">
                                {value.toUpperCase()}
                              </p>
                            </div>
                          </span>
                        );
                      }
                    )}
                </div>
              );
            })}
            <p>Mô tả</p>
            <textarea
              disabled
              className="productDetailDescription"
              name=""
              id=""
              value={product.description}
              spellCheck="false"
            ></textarea>
            <p className="mt-3"></p>
            <div style={{ width: "100%" }}>
              <div className="d-flex">
                <div className="d-flex">
                  <button
                    onClick={() => {
                      if (quantity === 1) return quantity;
                      return setQuantity(quantity - 1);
                    }}
                    className="quantity__increase d-flex align-items-center"
                  >
                    -
                  </button>
                  <div className="quantity__value d-flex align-items-center">
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="quantity__decrease d-flex align-items-center"
                  >
                    +
                  </button>
                </div>
                <button onClick={onHandleBuyNow} className="btn buynow">
                  MUA NGAY
                </button>
              </div>

              <button
                onClick={onHandleAddToCart}
                className="btn mt-3   mr-lg-3  addtocart text-white"
              >
                Thêm vào giỏ
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    ""
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
