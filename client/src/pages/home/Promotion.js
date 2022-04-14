import React, { useEffect, useState } from "react";
import { countdown } from "../../helpers/dateCalculation";
export default function Promotion() {
  const [days, setDays] = useState();
  const [hours, setHours] = useState();
  const [minutes, setMinutes] = useState();
  const [seconds, setSeconds] = useState();
  useEffect(() => {
    const intervalId = setInterval(() => {
      setDays(countdown("2022-04-16T09:43:57.000Z").days);
      setHours(countdown("2022-04-16T09:43:57.000Z").hours);
      setMinutes(countdown("2022-04-16T09:43:57.000Z").minutes);
      setSeconds(countdown("2022-04-16T09:43:57.000Z").seconds);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="promotion-wrapper">
      <img
        className="promotion__img"
        src="https://cdn.shopify.com/s/files/1/0023/4104/4283/files/erer.jpg?v=1643689002"
        alt=""
      />
      <div className="promotion__titles">
        <p className="promotion__title1">KHUYẾN MẠI SIÊU SALE NGÀY 5-5 </p>
        <p className="promotion__title2">Thời gian còn lại...</p>
        <p className="promotion__title3">
          <div className="d-flex justify-content-center">
            <div className="d-flex ">
              <p>{days} ngày</p>
              <p>{hours} giờ</p>
              <p>{minutes} phút</p>
              <p>{seconds}giây</p>
            </div>
          </div>
        </p>

        <div style={{ position: "relative", padding: "3rem 0" }}>
          <p className="promotion__title1">HẾT HẠN VÀO</p>
          <p className="promotion__title4">11 NOVEMBER 2021</p>
        </div>
      </div>
      <div className="promotion__btn myBtn">Chi tiết</div>
    </div>
  );
}
