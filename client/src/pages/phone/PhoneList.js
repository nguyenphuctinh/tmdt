import React from "react";
import { useSelector } from "react-redux";
import Loading from "../../components/Loading";
import Product from "../../components/Product";
export default function PhoneList() {
  const phones = useSelector((state) => state.phones);
  return (
    <div className="container">
      {phones.loading ? (
        <Loading />
      ) : (
        <div className="row">
          {phones?.data?.map((item) => {
            return <Product key={item.product_id} product={item} />;
          })}
        </div>
      )}
    </div>
  );
}
