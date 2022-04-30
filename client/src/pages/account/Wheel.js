import React, { Component, useState, useEffect } from "react";
import WheelComponent from "react-wheel-of-prizes";
import { fetchPrizes } from "../../redux/slices/prizeSlice";

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
  ];
  const onFinished = (winner) => {
    alert(winner);
    onHandleSpin(winner);
  };
  return (
    <WheelComponent
      segments={segments.map((seg) => seg.prizeName)}
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
