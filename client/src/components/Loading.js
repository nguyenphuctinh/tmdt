import React from "react";
import { Oval } from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export default function Loading({
  height = 100,
  width = 100,
  heightContainer = "100vh",
}) {
  return (
    <div style={{ position: "fixed", zIndex: 4 }} className="container-fluid">
      <div className="row">
        <div className="col-12 p-0">
          <div
            style={{
              height: heightContainer,
              width: "100vw",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
            className="grid"
          >
            <Oval
              ariaLabel="loading-indicator"
              height={height}
              width={width}
              strokeWidth={3}
              color="white"
              secondaryColor="black"
            />
            {/* <TailSpin
              type="BallTriangle"
              color="#00BFFF"
              height={height}
              width={width}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
