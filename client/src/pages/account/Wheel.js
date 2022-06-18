import React from "react";
import WheelComponent from "react-wheel-of-prizes";

export default function Wheel({ segments, onHandleSpin }) {
  const segColors = [
    "#EE4040",
    "#F0CF50",
    "#815CD1",
    "#3DA5E0",
    "#34A24F",
    "#F9AA1F",
    "#EC3F3F",
    "#FF9000",
    "#EE4040",
    "#F0CF50",
    "#815CD1",
    "#3DA5E0",
    "#34A24F",
    "#F9AA1F",
    "#EC3F3F",
    "#FF9000",
  ];
  const onFinished = (winner) => {
    // alert(winner);
    if (winner.includes("Phiếu giảm giá")) {
      var numb = winner.match(/\d/g);
      numb = numb.join("");
      onHandleSpin(parseInt(numb) / 100 + "");
    } else {
      onHandleSpin(winner);
    }
  };
  return (
    <WheelComponent
      segments={segments.map((seg) => {
        return seg.prizeType === "discount"
          ? `Phiếu giảm giá ${seg.prizeName * 100}%`
          : seg.prizeName;
      })}
      segColors={segColors}
      winningSegment="won 10"
      onFinished={(winner) => onFinished(winner)}
      primaryColor="black"
      contrastColor="white"
      buttonText="Quay"
      isOnlyOnce={false}
      size={200}
      upDuration={100}
      downDuration={1000}
      fontFamily="Arial"
    />
  );
}
