import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../assets/images/logo.png";
import { Navigate, useNavigate } from "react-router-dom";

function NavBar() {
  const navbar = useSelector((state) => state.navbar);
  const [finding, setFinding] = useState(false);
  const [finded, setFinded] = useState(false);
  const navigate = useNavigate();
  const inputEl = useRef(null);
  useEffect(() => {
    if (finding && inputEl.current) inputEl.current.focus();
    if (!finding) inputEl.current.value = "";
  }, [finding, finded]);
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      const q = event.target.value;
      setFinded(true);
      navigate({
        pathname: "/search",
        search: "?q=" + q,
      });
      setFinding(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row myNavbar padding-lg">
        <div className="col-3 d-flex align-items-center navLogo">
          <div onClick={() => setFinding(false)} className="">
            <Link to="/">
              <img src={logo} alt="" />
            </Link>
          </div>
        </div>
        <div
          className="col-9 col-sm-6 padding-0"
          style={{ textAlign: "center" }}
        >
          <div
            style={{ display: finding ? "block" : "none" }}
            className="searchForm align-items-center"
          >
            <input
              ref={inputEl}
              onKeyDown={handleKeyDown}
              id="search"
              autoComplete="off"
              className="searchInput"
              type="search"
              placeholder="Bạn tìm gì..."
              aria-label="Search"
            />
            <i
              onClick={() => setFinding(false)}
              id="closeSearch"
              className="fal fa-times"
            ></i>
          </div>
          <div
            style={{ display: !finding ? "block" : "none" }}
            className="main justify-content-center"
          >
            <ul className="d-flex  justify-content-center">
              <li
                style={{
                  backgroundColor: navbar.value === "home" ? "#2f3033" : "",
                }}
                className="d-flex align-items-center "
              >
                <Link to="/">Home</Link>
              </li>

              <li
                style={{
                  backgroundColor: navbar.value === "phone" ? "#2f3033" : "",
                }}
                className="d-flex align-items-center"
              >
                <Link to="/category/phone">iPhone</Link>
              </li>
              <li
                style={{
                  backgroundColor: navbar.value === "laptop" ? "#2f3033" : "",
                }}
                className="d-flex align-items-center"
              >
                <Link to="/category/laptop">Mac</Link>
              </li>
              <li
                style={{
                  backgroundColor: navbar.value === "tablet" ? "#2f3033" : "",
                }}
                className="d-flex align-items-center"
              >
                <Link to="/category/tablet">iPad</Link>
              </li>
              <li
                style={{
                  backgroundColor: navbar.value === "watch" ? "#2f3033" : "",
                }}
                className="d-flex align-items-center"
              >
                <Link to="/category/watch">Watch</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-sm-3 padding-0">
          <div className="menu pl-5 pr-5">
            <ul className="d-flex justify-content-between">
              <li
                onClick={() => {
                  setFinding(true);
                }}
                className="d-flex align-items-center"
              >
                <div className="bg searchIcon">
                  <i className="far fa-search"></i>
                </div>
              </li>
              <li
                onClick={() => setFinding(false)}
                className="d-flex align-items-center"
              >
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
              <li
                onClick={() => setFinding(false)}
                className="d-flex align-items-center"
              >
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
