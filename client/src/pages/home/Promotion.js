import React, { useEffect, useState } from "react";
import { countdown } from "../../helpers/dateCalculation";
import { useSelector } from "react-redux";
export default function Promotion() {
  const promotion = useSelector((state) => state.promotion);
  const [days, setDays] = useState();
  const [hours, setHours] = useState();
  const [minutes, setMinutes] = useState();
  const [seconds, setSeconds] = useState();
  useEffect(() => {
    const intervalId = setInterval(() => {
      setDays(countdown(promotion.data?.promotionStartTime).days);
      setHours(countdown(promotion.data?.promotionStartTime).hours);
      setMinutes(countdown(promotion.data?.promotionStartTime).minutes);
      setSeconds(countdown(promotion.data?.promotionStartTime).seconds);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [promotion.data]);

  return (
    <>
      {new Date() < new Date(promotion.data?.promotionStartTime) ? (
        <div className="promotion-wrapper">
          <img
            className="promotion__img"
            src="https://cdn.shopify.com/s/files/1/0023/4104/4283/files/erer.jpg?v=1643689002"
            alt=""
          />
          <div className="promotion__titles">
            <p className="promotion__title1">{promotion.data?.promotionName}</p>
            <p className="promotion__title2">Sẽ bắt đầu sau...</p>
            <p className="promotion__title3">
              <div className="d-flex justify-content-center">
                <div className="d-flex ">
                  <p>{days} ngày</p>
                  <p>{hours} giờ</p>
                  <p>{minutes} phút</p>
                  <p>{seconds} giây</p>
                </div>
              </div>
            </p>
            <div style={{ position: "relative", padding: "3rem 0" }}>
              <p className="promotion__title1">KẾT THÚC VÀO</p>
              <p className="promotion__title4">
                {promotion.data?.promotionExpTime}
              </p>
            </div>
          </div>
          <div className="promotion__btn myBtn">Chi tiết</div>
        </div>
      ) : new Date() > new Date(promotion.data?.promotionStartTime) &&
        new Date() < new Date(promotion.data?.promotionExpTime) ? (
        "dang dien ra do"
      ) : (
        ""
      )}
    </>
  );
}
