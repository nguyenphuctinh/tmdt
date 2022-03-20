export const dict = {
  color: "màu",
  capacity: "dung lượng",
  size: "kích cỡ",
};
export default function getColor(color) {
  if (color === "vàng đồng" || color === "vàng") {
    return "#fae7cf";
  }
  if (color === "xám") {
    return "#AAAEB0";
  }
  if (color === "bạc") {
    return "#e9e9e9";
  }
  if (color === "đen") {
    return "#000000";
  }
  if (color === "trắng") {
    return "#f1f2ed";
  }
  if (color === "xanh dương") {
    return "#a7c1d9";
  }
  if (color === "xanh lá") {
    return "#cbdec7";
  }
  if (color === "đỏ") {
    return "#b90b2d";
  }
  if (color === "tím") {
    return "#b7afe6";
  }
  if (color === "hồng") {
    return "#faddd7";
  }
}
