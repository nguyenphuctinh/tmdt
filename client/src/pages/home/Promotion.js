import React, { useEffect, useState } from "react";
import { countdown } from "../../helpers/dateCalculation";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Product from "../../components/Product";
import Slider from "./Slider";

export default function Promotion({ promotion }) {
  const [days, setDays] = useState();
  const [hours, setHours] = useState();
  const [minutes, setMinutes] = useState();
  const [seconds, setSeconds] = useState();
  const [saledProducts, setSaledProducts] = useState([]);
  const products = useSelector((state) => state.products);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (new Date() < new Date(promotion.promotionStartTime)) {
        setDays(countdown(promotion?.promotionStartTime).days);
        setHours(countdown(promotion?.promotionStartTime).hours);
        setMinutes(countdown(promotion?.promotionStartTime).minutes);
        setSeconds(countdown(promotion?.promotionStartTime).seconds);
      } else {
        setDays(countdown(promotion?.promotionExpTime).days);
        setHours(countdown(promotion?.promotionExpTime).hours);
        setMinutes(countdown(promotion?.promotionExpTime).minutes);
        setSeconds(countdown(promotion?.promotionExpTime).seconds);
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [promotion]);
  useEffect(() => {
    if (
      promotion &&
      promotion.saledProducts.length > 0 &&
      products.data.length > 0
    ) {
      setSaledProducts([
        ...promotion.saledProducts.map((saledProduct) => {
          return {
            ...products.data.find((product) => {
              return product.productId === saledProduct.productId;
            }),
            sale: saledProduct.sale,
          };
        }),
      ]);
    }
  }, [promotion, products.data]);
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
            <p className="promotion__title2">S??? b???t ?????u sau...</p>
            <p className="promotion__title3">
              <div className="d-flex justify-content-center">
                <div className="d-flex ">
                  <p>{days} ng??y</p>
                  <p>{hours} gi???</p>
                  <p>{minutes} ph??t</p>
                  <p>{seconds} gi??y</p>
                </div>
              </div>
            </p>
            <div style={{ position: "relative", padding: "3rem 0" }}>
              <p className="promotion__title1">K???T TH??C V??O</p>
              <p className="promotion__title4">
                {promotion
                  ? new Date(promotion.promotionExpTime).toLocaleDateString()
                  : ""}
              </p>
            </div>
          </div>
          <Link to={`/promotion/${promotion.promotionId}`}>
            {" "}
            <div className="promotion__btn myBtn text-light"> Chi ti???t</div>
          </Link>
        </div>
      ) : new Date() > new Date(promotion?.promotionStartTime) &&
        new Date() < new Date(promotion?.promotionExpTime) ? (
        <>
          <div></div>
          <div className="promotion-wrapper ">
            <img
              className="promotion__img"
              src={promotion?.promotionImg}
              alt=""
            />
            <div className="promotion__info d-flex  flex-column">
              <p className="promotion__name">{promotion?.promotionName}</p>
              <div className="d-flex justify-content-center">
                <div className="d-flex ">
                  <p>
                    <strong>K???t th??c sau:</strong>
                  </p>
                  <p>{days} ng??y</p>
                  <p>{hours} gi???</p>
                  <p>{minutes} ph??t</p>
                  <p>{seconds} gi??y</p>
                </div>
              </div>
            </div>
            <div className="container-fluid  promotion__slider ">
              <div className="row">
                <div className="col-12 p-0">
                  <Slider saledProducts={saledProducts} />
                </div>
              </div>
            </div>

            <Link to={`/promotion/${promotion.promotionId}`}>
              {" "}
              <div className="promotion__btn myBtn text-light"> Chi ti???t</div>
            </Link>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
}
