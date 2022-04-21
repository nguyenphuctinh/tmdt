import React from "react";
import { Swiper, SwiperSlide } from "swiper/swiper-react.cjs";
import SwiperCore, { Navigation, Pagination, Autoplay, Virtual } from "swiper";
import "swiper/swiper-bundle.css";
import Product from "../../components/Product";
SwiperCore.use([Navigation, Pagination, Autoplay, Virtual]);

export default function Slider({ saledProducts }) {
  const slides = [];
  saledProducts.forEach((saledProduct) => {
    slides.push(
      <SwiperSlide key={saledProduct.productId}>
        <Product displayedAt="slider" product={saledProduct} />
      </SwiperSlide>
    );
  });

  return (
    <Swiper
      id="swiper"
      //   virtual
      slidesPerView={4}
      breakpoints={{
        320: {
          slidesPerView: 2,
        },
        480: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        640: {
          slidesPerView: 4,
          spaceBetween: 50,
        },
      }}
      spaceBetween={30}
      onReachEnd={() => {
        const tmp = slides.unshift();
        slides.push(tmp);
      }}
      navigation
      //   loop
    >
      {slides}
    </Swiper>
  );
}
