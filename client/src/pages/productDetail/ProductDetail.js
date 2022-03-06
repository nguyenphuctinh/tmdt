import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import capitalizeFirstLetter from "../../helpers/capitalizeFirstLetter";
export default function ProductDetail() {
  const dispatch = useDispatch();
  const { productId } = useParams();
  const products = useSelector((state) => state.products);
  const product = products?.data.find(
    (product) => product.productId === parseInt(productId)
  );
  console.log(product);
  let variantNames = [];
  for (const key in product?.variants) {
    variantNames.push(key);
  }
  return (
    <div className="container-fluid">
      {product && (
        <div class="row productDetail pt-5 pb-5">
          <div class="col-sm-6">
            <div class="">
              <img class="productImg" width="100%" src="" alt="" />
            </div>
          </div>
          <div class="col-sm-6 pt-5">
            <p class="productName">{product.productName}</p>
            <div class="d-flex ">
              <p class="productPrice mr-2">{1223}₫</p>
              <p class="productPrice--sale">{112113} ₫</p>
            </div>

            {variantNames?.map((variantName) => {
              return (
                <>
                  <p>{capitalizeFirstLetter(variantName)}</p>
                  {product.variants[variantName].map((value) => {
                    if (variantName !== "color") {
                      console.log(product.variants[variantName]);
                      return (
                        <a href="?color={selectedcolor}&capacity=13">
                          <div class="capacity capacity--active ">
                            <p class="capacity__name">{value.toUpperCase()}</p>
                          </div>
                        </a>
                      );
                    } else {
                    }
                  })}
                </>
              );
            })}

            <p class="mt-3">Màu</p>
            <div class="colors mb-5">
              <a href="?color={{color.color}}&capacity={{selectedcapacity}}">
                <div
                  class="color color--active "
                  style={{ backgroundColor: "red" }}
                ></div>
              </a>
            </div>
            <a href="/addtocart/{{product.id}}?color={{selectedcolor}}&capacity={{selectedcapacity}}">
              <div class="addtocart mr-lg-3">Thêm vào giỏ</div>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
