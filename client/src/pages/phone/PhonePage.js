import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { changeNavbar } from "../../redux/slices/navbarSlice";
import PhoneList from "./PhoneList";
export default function PhonePage() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(changeNavbar("iPhone"));
    document.title = "Điện thoại iPhone chính hãng";
  }, []);

  return (
    <div>
      <PhoneList />
    </div>
  );
}
