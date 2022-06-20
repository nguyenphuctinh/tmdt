import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { changeNavbar } from "../../redux/slices/navbarSlice";
import { useSelector } from "react-redux";

import { Carousel } from "react-responsive-carousel";
import sliderImg1 from "../../assets/images/top-mac-2880-800-1920x533-2.png";
import sliderImg2 from "../../assets/images/2880-800-1920x533-2.png";
import sliderImg3 from "../../assets/images/2880-800-1920x533-6.png";
import mobileSliderImg1 from "../../assets/images/w7-720-720-720x720-2.png";
import mobileSliderImg2 from "../../assets/images/720-720-720x720-5.png";
import mobileSliderImg3 from "../../assets/images/720-720-720x720-7.png";
import Product from "../../components/Product";
import Promotion from "./Promotion";
import { fetchPromotion } from "../../redux/slices/promotionSlice";
import { Link } from "react-router-dom";
import { StyledLink } from "./Home.style";
function Home() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);
  const promotions = useSelector((state) => state.promotions);
  const [phones, setPhones] = useState([]);
  const [laptops, setLaptops] = useState([]);
  const [tablets, setTablets] = useState([]);
  const [watches, setWatches] = useState([]);

  useEffect(() => {
    dispatch(changeNavbar("home"));
    dispatch(fetchPromotion());
    setWatches(
      products.data.filter((item) => item.category === "watch").slice(0, 8)
    );
    setPhones(
      products.data.filter((item) => item.category === "phone").slice(0, 8)
    );
    setLaptops(
      products.data.filter((item) => item.category === "laptop").slice(0, 8)
    );
    setTablets(
      products.data.filter((item) => item.category === "tablet").slice(0, 8)
    );
    document.title =
      " Cửa hàng điện thoại, máy tính, máy tính bảng, đồng hô chính hãng";
  }, [dispatch, products]);
  return (
    <div className="App home">
      <div className="container-fluid ">
        <div className="row p-0">
          <div className="p-0 col-12 slider d-none d-md-block">
            <Carousel
              infiniteLoop={true}
              autoPlay={true}
              showStatus={false}
              showThumbs={false}
            >
              <StyledLink to="category/watch">
                <img src={sliderImg1} alt="" />
              </StyledLink>
              <StyledLink to="category/tablet">
                <img src={sliderImg2} alt="" />
              </StyledLink>
              <StyledLink to="category/laptop">
                <img src={sliderImg3} alt="" />
              </StyledLink>
            </Carousel>
          </div>
          <div className="p-0 col-12 slider d-block d-md-none">
            <Carousel
              infiniteLoop={true}
              // autoPlay={true}
              showStatus={false}
              showThumbs={false}
            >
              <StyledLink to="category/watch">
                <img src={mobileSliderImg1} alt="" />
              </StyledLink>
              <StyledLink to="category/laptop">
                <img src={mobileSliderImg2} alt="" />
              </StyledLink>
              <StyledLink to="category/tablet">
                <img src={mobileSliderImg3} alt="" />
              </StyledLink>
            </Carousel>
          </div>
        </div>
        <div className="row">
          {promotions.data &&
            promotions.data.map((promotion) => (
              <Promotion promotion={promotion} />
            ))}
        </div>
      </div>

      {products.data.length > 0 ? (
        <div className="container pb-4">
          <div className="row p-0">
            <div className="col-sm-12 sessionTitle">
              <span>{"Phone"}</span>
            </div>
            {phones?.map((item) => {
              return (
                <Product
                  displayedAt="home"
                  key={item.productId}
                  product={item}
                />
              );
            })}
            <div className="col-sm-12 sessionTitle">
              <span>{"Laptop"}</span>
            </div>
            {laptops?.map((item) => {
              return (
                <Product
                  displayedAt="home"
                  key={item.productId}
                  product={item}
                />
              );
            })}
            <div className="col-sm-12 sessionTitle">
              <span>{"Tablet"}</span>
            </div>
            {tablets?.map((item) => {
              return (
                <Product
                  displayedAt="home"
                  key={item.productId}
                  product={item}
                />
              );
            })}
            <div className="col-sm-12 sessionTitle">
              <span>{"Watch"}</span>
            </div>
            {watches?.map((item) => {
              return (
                <Product
                  displayedAt="home"
                  key={item.productId}
                  product={item}
                />
              );
            })}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Home;
