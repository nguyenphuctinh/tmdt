import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loading from "../../components/Loading";
import { fetchPhone } from "../../redux/slices/phoneSlice";
import Phone from "./Phone";

export default function PhoneList() {
  const phones = useSelector((state) => state.phones);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchPhone());
  }, []);
  return (
    <div>
      {/* <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={() => setDs([...ds, text])}>them</button>
      {ds?.map((item, index) => {
        return (
          <p key={index} alt="">
            {item}
          </p>
        );
      })} */}
      {phones.loading ? (
        <Loading />
      ) : (
        phones?.data?.map((item) => {
          return <Phone key={item.phone_id} phone={item} />;
        })
      )}
    </div>
  );
}
