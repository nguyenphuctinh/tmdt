import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProductById } from "../../redux/slices/productSlice";
export default function ProductDetail() {
  const dispatch = useDispatch();
  const { productId } = useParams();
  const product = useSelector((state) => state.products.data[0]);
  console.log(product);
  let variants = [];
  if (product) {
    if (product.category === "phone") {
      variants = [...product.phone_variants];
    } else if (product.category === "mac") {
      variants = [...product.mac_variants];
    } else if (product.category === "watch") {
      variants = [...product.watch_variants];
    } else {
      variants = [...product.tablet_variants];
    }
  }
  useEffect(() => {
    dispatch(fetchProductById(productId));
  }, [dispatch]);

  return (
    <div className="container-fluid">
      {product && (
        <div class="row productDetail pt-5 pb-5">
          <div class="col-sm-6">
            <div class="">
              {/* <img class="productImg" width="100%" src="" alt="" /> */}
            </div>
          </div>
          <div class="col-sm-6 pt-5">
            <p class="productName">{product.product_name}</p>
            <div class="d-flex ">
              <p class="productPrice mr-2">{1223}₫</p>
              <p class="  productPrice--sale">{112113} ₫</p>
            </div>
            <p>Dung lượng</p>
            {variants?.map((variant) => {
              return (
                <div class="d-flex">
                  <p class="productPrice mr-2">{variant.price}</p>
                  <p class="  productPrice--sale">{variant.price}</p>
                </div>
              );
            })}
            <a href="?color={selectedcolor}&capacity=13">
              <div class="capacity capacity--active ">
                <p class="capacity__name">13</p>
              </div>
            </a>

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
