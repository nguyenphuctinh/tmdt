import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import logo from "../assets/images/logo.png";

function NavBar() {
  const navbar = useSelector((state) => state.navbar);
  return (
    <div className="container-fluid">
      <div className="row myNavbar padding-lg">
        <div className="col-3 d-flex align-items-center navLogo">
          <div className="">
            <Link to="/">
              <img src={logo} alt="" />
            </Link>
          </div>
        </div>
        <div
          className="col-9 col-sm-6 padding-0"
          style={{ textAlign: "center" }}
        >
          <div className="searchForm align-items-center">
            <form className="" action="/search/" method="get">
              <input
                id="search"
                autoComplete="off"
                name="q"
                className="searchInput"
                type="search"
                placeholder="Bạn tìm gì..."
                aria-label="Search"
              />
            </form>
            <i id="closeSearch" className="fal fa-times"></i>
          </div>
          <div className="main justify-content-center">
            <ul className="d-flex">
              <li
                style={{
                  backgroundColor: navbar.value === "home" ? "#2f3033" : "",
                }}
                className="d-flex align-items-center"
              >
                <Link to="/">Home</Link>
              </li>
              <li
                style={{
                  backgroundColor: navbar.value === "iPhone" ? "#2f3033" : "",
                }}
                className="d-flex align-items-center"
              >
                <Link to="/iphone">iPhone</Link>
              </li>
              <li
                style={{
                  backgroundColor: navbar.value === "mac" ? "#2f3033" : "",
                }}
                className="d-flex align-items-center"
              >
                <Link to="/mac">Mac</Link>
              </li>
              <li
                style={{
                  backgroundColor: navbar.value === "iPad" ? "#2f3033" : "",
                }}
                className="d-flex align-items-center"
              >
                <Link to="/ipad">iPad</Link>
              </li>
              <li
                style={{
                  backgroundColor: navbar.value === "watch" ? "#2f3033" : "",
                }}
                className="d-flex align-items-center"
              >
                <Link to="/watch">Watch</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-sm-3 padding-0">
          <div className="menu pl-5 pr-5">
            <ul className="d-flex justify-content-between">
              <li className="d-flex align-items-center">
                <div className="bg searchIcon">
                  <i className="far fa-search"></i>
                </div>
              </li>
              <li className="d-flex align-items-center">
                <Link to="/order/">
                  <div className="bg">
                    <div
                      className="grid"
                      style={{
                        backgroundColor: "brown",
                        borderRadius: "50%",

                        width: "1.3rem",
                        height: "1.3rem",
                        zIndex: "2",
                        position: "relative",
                        right: "5px",
                      }}
                    >
                      <p
                        id="number_in_cart"
                        style={{ fontSize: "0.8rem", fontWeight: "600" }}
                      >
                        1
                      </p>
                    </div>
                    <i className="far fa-shopping-bag"></i>
                  </div>
                </Link>
              </li>
              <li className="d-flex align-items-center">
                <Link to="/account">
                  <div className="bg">
                    <i className="far fa-user"></i>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="space"></div>
    </div>
  );
}

export default NavBar;
