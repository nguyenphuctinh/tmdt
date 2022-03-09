import React, { useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import isNumber from "../../../helpers/isNumber";
import { toast } from "react-toastify";
import { authorization } from "../../../auth/auth";
export default function UpdateForm({
  setUpdateFromOpened,
  productVariantUpdated,
  category,
  productId,
  variantNames,
}) {
  console.log(variantNames);
  const [productVariant, setProductVariant] = useState(productVariantUpdated);
  const [mau, setMau] = useState(productVariantUpdated.color);
  const [mauError, setMauError] = useState("");
  const [dungLuong, setDungLuong] = useState(productVariantUpdated.capacity);
  const [dungLuongError, setDungLuongError] = useState("");
  const [kichThuoc, setKichThuoc] = useState(productVariantUpdated.size);
  const [kichThuocError, setKichThuocError] = useState("");
  const [soLuong, setSoLuong] = useState(productVariantUpdated.quantity);
  const [soLuongError, setSoLuongError] = useState("");
  const [gia, setGia] = useState(productVariantUpdated.price);
  const [giaError, setGiaError] = useState("");
  const [loading, setLoading] = useState(false);
  const [imgList, setImgList] = useState([]);
  const onHandleUpdate = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/products/${productId}`,
        {
          type: "updateProductVariant",
          productVariant: {
            color: mau,
            capacity: dungLuong,
            size: kichThuoc,
            quantity: soLuong,
            price: gia,
            productVariantId: productVariant.productVariantId,
          },
          category,
          variantNames,
        },
        authorization()
      );
      toast.success("Cập nhật thành công!");
    } catch (error) {
      toast.error("Cập nhật không thành công!");
      console.log(error);
    }
  };
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "fixed",
        zIndex: "2",
        backgroundColor: "rgba(0,0,0,0.4)",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          color: "black",
        }}
        className="container w-50 pb-3"
      >
        <div style={{ overflowY: "auto", height: 400 }} className="row pt-4">
          <div className="col-12">
            <h4>Cập nhật biến thể</h4>
            <TextField
              style={{ width: "100%", marginBottom: 30 }}
              required
              error={mauError === "" ? false : true}
              label="Màu sản phẩm"
              variant="outlined"
              value={mau}
              onChange={(e) => setMau(e.target.value)}
              helperText={mauError}
              onBlur={() => {
                if (mau.length === 0) setMauError("Không được để trống");
                else setMauError("");
              }}
            />

            <br />
            <TextField
              style={{ width: "100%", marginBottom: 30 }}
              required
              error={
                category === "watch"
                  ? kichThuocError === ""
                    ? false
                    : true
                  : dungLuongError === ""
                  ? false
                  : true
              }
              label={
                category === "watch" ? "Kích thước" : "Dung lượng sản phẩm"
              }
              variant="outlined"
              value={category === "watch" ? kichThuoc : dungLuong}
              helperText={
                category === "watch" ? kichThuocError : dungLuongError
              }
              onBlur={() => {
                if (category === "watch") {
                  if (kichThuoc.length === 0)
                    setKichThuocError("Không được để trống");
                  else setKichThuocError("");
                } else {
                  if (dungLuong.length === 0)
                    setDungLuongError("Không được để trống");
                  else setDungLuongError("");
                }
              }}
              onChange={(e) => {
                if (category === "watch") setKichThuoc(e.target.value);
                else setDungLuong(e.target.value);
              }}
            />

            <br />
            <TextField
              style={{ width: "100%", marginBottom: 30 }}
              required
              error={soLuongError === "" ? false : true}
              label="Số lượng sản phẩm"
              variant="outlined"
              value={soLuong}
              helperText={soLuongError}
              onChange={(e) => setSoLuong(e.target.value)}
              onBlur={() => {
                if (soLuong.length === 0 || isNumber(soLuong) === false)
                  setSoLuongError("Nhập không đúng định dạng");
                else setSoLuongError("");
              }}
            />

            <br />
            <TextField
              style={{ width: "100%", marginBottom: 30 }}
              required
              error={giaError === "" ? false : true}
              label="Giá sản phẩm"
              variant="outlined"
              value={gia}
              helperText={giaError}
              onChange={(e) => setGia(e.target.value)}
              onBlur={() => {
                if (gia.length === 0 || isNumber(gia) === false)
                  setGiaError("Nhập không đúng định dạng");
                else {
                  setGiaError("");
                }
              }}
            />

            {productVariantUpdated.imgSrcList.map((img, index) => {
              return (
                <div
                  style={{ display: "inline-block" }}
                  key={img.product_variant_img_id}
                >
                  <img
                    src={img.img}
                    style={{ width: "100px", marginBottom: 30 }}
                    alt="img"
                  />
                </div>
              );
            })}
            <br />

            {!loading ? (
              <Button onClick={onHandleUpdate} variant="contained">
                Lưu
              </Button>
            ) : (
              <LoadingButton
                loading
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="outlined"
              >
                Lưu
              </LoadingButton>
            )}
            <Button
              onClick={() => {
                setUpdateFromOpened(false);
              }}
              variant="contained"
              color="error"
              style={{ marginLeft: 10 }}
            >
              Đóng
            </Button>

            <br />
          </div>
        </div>
      </div>
    </div>
  );
}
