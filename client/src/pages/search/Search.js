import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

import searchProductFitler from "../../helpers/searchProductFilter";
import Product from "../../components/Product";
export default function Search() {
  let [searchParams] = useSearchParams();
  const q = searchParams.get("q");
  const products = useSelector((state) => state.products);
  const [filteredProducts, setFilteredProducts] = useState(null);
  useEffect(() => {
    if (products.data.length > 0)
      setFilteredProducts(searchProductFitler(products.data, q));
  }, [products, q]);
  return (
    <div className="container pb-3">
      <div class="row pt-5">
        <div class="col-sm-12 d-flex ">
          <p>
            Kết quả tìm kiếm cho: <strong>{q}</strong>
          </p>
        </div>
      </div>
      {filteredProducts && (
        <div className="row">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              return <Product product={product} />;
            })
          ) : (
            <>
              <div class="col-12">
                <p style={{ textAlign: "center" }} class="notfound text-danger">
                  Không tìm thấy sản phẩm nào
                </p>
              </div>
              <div class="col-12 hint">
                <strong>
                  {" "}
                  Để tìm được kết quả chính xác hơn, bạn vui lòng:
                </strong>{" "}
                <br />
                Kiểm tra lỗi chính tả của từ khóa đã nhập <br />
                Thử lại bằng từ khóa khác <br />
                Thử lại bằng những từ khóa tổng quát hơn <br />
                Thử lại bằng những từ khóa ngắn gọn hơn
                <br />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
