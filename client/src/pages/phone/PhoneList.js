import React from "react";
import { useSelector } from "react-redux";
import Loading from "../../components/Loading";
import Product from "../../components/Product";
export default function PhoneList() {
  const products = useSelector((state) => state.products);
  return (
    <div className="container">
      {products.loading ? (
        <Loading />
      ) : (
        <div className="row">
          {products?.data.map((item) => {
            console.log(item);
            return <Product key={item.productId} product={item} />;
          })}
        </div>
      )}
    </div>
  );
}
