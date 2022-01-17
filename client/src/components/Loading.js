import React from "react";
import { TailSpin } from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export default function Loading({
  height = 100,
  width = 100,
  heightContainer = "100vh",
}) {
  return (
    <div style={{ height: heightContainer }} className="grid">
      <TailSpin type="TailSpin" color="#00BFFF" height={height} width={width} />
    </div>
  );
}
