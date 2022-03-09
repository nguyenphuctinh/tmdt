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
    return "#54524f";
  }
  if (color === "bạc") {
    return "#f1f2ed";
  }
  if (color === "đen") {
    return "#000000";
  }
  if (color === "trắng") {
    return "#ffffff";
  }
}
