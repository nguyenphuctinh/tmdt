import React from "react";
import { Link } from "react-router-dom";
function NavBar() {
  return (
    <div>
      <Link to="/">Home</Link>
      <Link to="/login">Đăng nhập</Link>
      <Link to="/register">Đăng ky</Link>
    </div>
  );
}

export default NavBar;
