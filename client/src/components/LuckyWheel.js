import React from "react";
import WheelComponent from "react-wheel-of-prizes";

const App = () => {
  const segments = [
    "Chúc bạn may mắn lần sau!",
    "Giảm 5% cho đơn hàng tiếp theo!",
    "Giảm 7% cho đơn hàng tiếp theo!",
    "Chúc bạn may mắn lần sau!",
    "Giảm 10% cho đơn hàng tiếp theo!",
  ];
  const segColors = ["#F0CF50", "#815CD1", "#3DA5E0", "#34A24F", "#EC3F3F"];
  const onFinished = (winner) => {
    alert("ok" + winner);
  };

  return (
    <div className="wheel-box">
      <WheelComponent
        segments={segments}
        isOnlyOnce={false}
        segColors={segColors}
        onFinished={(winner) => onFinished(winner)}
        primaryColor="black"
        contrastColor="white"
        buttonText="Quay"
      />
    </div>
  );
};

export default App;
