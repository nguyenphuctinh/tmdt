export const transfer = (val) => {
  if (val === "màu") return "color";
  if (val === "kích thước") return "size";
  if (val === "dung lượng") return "capacity";

  if (val === "điện thoại") return "phone";
  if (val === "máy tính") return "laptop";
  if (val === "máy tính bảng") return "tablet";
  if (val === "đồng hồ") return "watch";
  if (val === "triệu") return "000000";
  if (val === "nghìn") return "000";
  if (val === "less") return "dưới";
  if (val === "more") return "trên";
  if (val === "around") return "khoảng";

  return val;
};
