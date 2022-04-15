import React, { useEffect, useState } from "react";
import { countdown } from "../../helpers/dateCalculation";
import { useSelector } from "react-redux";
export default function Promotion({ promotion }) {
  console.log(promotion);
  const [days, setDays] = useState();
  const [hours, setHours] = useState();
  const [minutes, setMinutes] = useState();
  const [seconds, setSeconds] = useState();
  useEffect(() => {
    const intervalId = setInterval(() => {
      setDays(countdown(promotion?.promotionStartTime).days);
      setHours(countdown(promotion?.promotionStartTime).hours);
      setMinutes(countdown(promotion?.promotionStartTime).minutes);
      setSeconds(countdown(promotion?.promotionStartTime).seconds);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [promotion]);

  return (
    <>
      {new Date() < new Date(promotion?.promotionStartTime) ? (
        <div className="promotion-wrapper">
          <img
            className="promotion__img"
            src={promotion?.promotionImg}
            alt=""
          />
          <div className="promotion__titles">
            <p className="promotion__title1">{promotion?.promotionName}</p>
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
                {promotion
                  ? new Date(promotion.promotionExpTime).toLocaleDateString()
                  : ""}
              </p>
            </div>
          </div>
          <div className="promotion__btn myBtn">Chi tiết</div>
        </div>
      ) : new Date() > new Date(promotion?.promotionStartTime) &&
        new Date() < new Date(promotion?.promotionExpTime) ? (
        "dang dien ra do"
      ) : (
        ""
      )}
    </>
  );
}
