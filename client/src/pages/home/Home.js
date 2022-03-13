import { useEffect } from "react";
import { useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { changeNavbar } from "../../redux/slices/navbarSlice";
import ProductList from "../category/ProductList";
import { Carousel } from "react-responsive-carousel";
import sliderImg1 from "../../assets/images/top-mac-2880-800-1920x533-2.png";
import sliderImg2 from "../../assets/images/2880-800-1920x533-2.png";
import sliderImg3 from "../../assets/images/2880-800-1920x533-6.png";
function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changeNavbar("home"));
  }, [dispatch]);
  return (
    <div className="App">
      <div className="container-fluid ">
        <div className="row p-0">
          <div className="p-0 col-12">
            <Carousel
              infiniteLoop={true}
              autoPlay={true}
              showStatus={false}
              showThumbs={false}
            >
              <img src={sliderImg1} alt="" />
              <img src={sliderImg2} alt="" />
              <img src={sliderImg3} alt="" />
            </Carousel>
          </div>
        </div>
      </div>
      <ProductList limit={8} displayType="3" category={"phone"} />
      <ProductList limit={8} displayType="3" category={"laptop"} />
      <ProductList limit={8} displayType="3" category={"tablet"} />
      <ProductList limit={8} displayType="3" category={"watch"} />
    </div>
  );
}

export default Home;
