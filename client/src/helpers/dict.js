export const dict = {
  color: "màu",
  capacity: "dung lượng",
};
export default function getColor(color) {
  if (color === "vàng đồng") {
    return "#fae7cf";
  }
  if (color === "xám") {
    return "#54524f";
  }
  if (color === "bạc") {
    return "#f1f2ed";
  }
}
