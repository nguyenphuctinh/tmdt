import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../assets/images/shop.jpg";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const navbar = useSelector((state) => state.navbar);
  const cart = useSelector((state) => state.cart);
  const [finding, setFinding] = useState(false);
  const [finded, setFinded] = useState(false);
  const navigate = useNavigate();
  const inputEl = useRef(null);
  let user = useSelector((state) => state.user);

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
      <div className="row myNavbar">
        <div className="col-4 d-block d-sm-none d-flex align-items-center navLogo">
          <div onClick={() => setFinding(false)} className="">
            <Link to="/">
              <img src={logo} alt="" />
            </Link>
          </div>
        </div>

        <div
          className="col-8 col-sm-5 padding-0"
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
            <ul
              className={`d-flex ${
                !user.data || user.data.role !== "admin"
                  ? "justify - content - between"
                  : "flex-row"
              }`}
            >
              {!user.data || user.data.role !== "admin" ? (
                <>
                  <li
                    style={{
                      backgroundColor:
                        navbar.value === "phone" ? "#2f3033" : "",
                    }}
                    className="d-flex align-items-center"
                  >
                    <Link to="/category/phone">Phone</Link>
                  </li>
                  <li
                    style={{
                      backgroundColor:
                        navbar.value === "laptop" ? "#2f3033" : "",
                    }}
                    className="d-flex align-items-center"
                  >
                    <Link to="/category/laptop">Laptop</Link>
                  </li>
                  <li
                    style={{
                      backgroundColor:
                        navbar.value === "tablet" ? "#2f3033" : "",
                    }}
                    className="d-flex align-items-center"
                  >
                    <Link to="/category/tablet">Tablet</Link>
                  </li>
                  <li
                    style={{
                      backgroundColor:
                        navbar.value === "watch" ? "#2f3033" : "",
                    }}
                    className="d-flex align-items-center"
                  >
                    <Link to="/category/watch">Watch</Link>
                  </li>
                </>
              ) : (
                <li
                  style={{
                    backgroundColor: navbar.value === "laptop" ? "#2f3033" : "",
                  }}
                  className="d-flex align-items-center"
                >
                  <Link to="/admin?tab=product">Admin</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="col-4 d-none  d-sm-flex align-items-center navLogo">
          <div onClick={() => setFinding(false)} className="">
            <Link to="/">
              <img src={logo} alt="" />
            </Link>
          </div>
        </div>

        <div className="col-sm-3 padding-0">
          <div className="menu pl-5 pr-5">
            <ul
              className={`d-flex ${
                !user.data || user.data.role !== "admin"
                  ? "justify-content-between"
                  : "flex-row-reverse"
              }`}
            >
              {!user.data || user.data.role !== "admin" ? (
                <>
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
                    <Link to="/cart">
                      <div className="bg">
                        <div
                          className="grid"
                          style={{
                            backgroundColor: "brown",
                            borderRadius: "50%",
                            color: "white",
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
                            {cart.data.cartItems.reduce((a, b) => {
                              return a + b.quantity;
                            }, 0)}
                          </p>
                        </div>
                        <i className="far fa-shopping-bag"></i>
                      </div>
                    </Link>
                  </li>
                </>
              ) : (
                ""
              )}

              <li
                onClick={() => setFinding(false)}
                className="d-flex align-items-center"
              >
                <Link to="/account?tab=security">
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
