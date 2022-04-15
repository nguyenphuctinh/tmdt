import { Stack, TextField } from "@mui/material";
import React, { useState, useRef } from "react";
import isNumber from "../../../helpers/isNumber";
import { useSelector } from "react-redux";
import MyTable from "../../../components/MyTable";
import addImg from "../../../assets/images/addimg.png";
import { toast } from "react-toastify";
import axios from "axios";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
export default function AddPromotion() {
  const products = useSelector((state) => state.products);
  const inputEl = useRef(null);
  const [ten, setTen] = useState("");
  const [tenError, setTenError] = useState("");
  const [sale, setSale] = useState("");
  const [saleError, setSaleError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [saledProducts, setSaledProducts] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [startTimeError, setStartTimeError] = useState("");
  const [endTime, setEndTime] = useState(null);
  const [endTimeError, setEndTimeError] = useState("");
  const [img, setImg] = useState(null);
  const handleSubmit = async () => {
    if (
      tenError !== "" ||
      saleError !== "" ||
      startTimeError !== "" ||
      endTimeError !== "" ||
      saledProducts.length === 0 ||
      !img
    ) {
      toast.error("Vui lòng nhập đầy đủ và chính xác thông tin");
      return;
    }
    try {
      let imgSrc = "";
      await new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", img);
        formData.append("upload_preset", process.env.REACT_APP_CLOUD_PRESET);
        axios
          .post(
            "https://api.cloudinary.com/v1_1/nguyenphuctinh/image/upload",
            formData
          )
          .then((res) => {
            imgSrc = res.data.secure_url;
            resolve();
          })
          .catch((err) => {
            console.log(err);
            reject();
          });
      });
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/promotions`,
        {
          ten,

          saledProducts,
          imgSrc,
          startTime,
          endTime,
        }
      );
      toast.success("Tạo sự kiện thành công");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.err);
      } else if (error.request) {
        toast(error.request);
      } else {
        toast("Error", error.message);
      }
    }
  };
  return (
    <div className="container-fluid addPromotion">
      <div class="row pt-5 pb-5">
        <div class="col-sm-12 sessionTitle">
          <i class="fab fa-apple"></i> <span>Tạo sự kiện khuyến mại</span>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6 ">
          <p>Danh sách sản phẩm</p>

          <div className="productList">
            {products.data?.map((product) => (
              <div
                key={product.productId}
                className="d-flex justify-content-between mb-3"
              >
                <a
                  className="text-primary"
                  href={"product/" + product.productName}
                >
                  {product.productName}
                </a>
                <button
                  onClick={() => setSelectedProduct(product)}
                  type="button"
                  className="btn btn-primary"
                >
                  Thêm khuyến mại
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="col-sm-6">
          <TextField
            style={{ width: "100%" }}
            required
            error={tenError === "" ? false : true}
            label="Tên sự kiện"
            variant="outlined"
            value={ten}
            onChange={(e) => setTen(e.target.value)}
            helperText={tenError}
            onBlur={() => {
              if (ten.length === 0) setTenError("Không được để trống");
              else setTenError("");
            }}
          />
          <LocalizationProvider sx={{ mb: 2 }} dateAdapter={AdapterDateFns}>
            <Stack spacing={1}>
              <DatePicker
                label="Ngày bắt đầu"
                openTo="year"
                views={["year", "month", "day"]}
                value={startTime}
                onChange={(newValue) => {
                  if (
                    newValue === null ||
                    newValue.toString() === "Invalid Date"
                  ) {
                    console.log("invalid");
                    setStartTimeError("Ngày  không hợp lệ");
                  } else {
                    setStartTime(newValue);
                    setStartTimeError("");
                  }
                }}
                renderInput={(params) => {
                  return <TextField required {...params} />;
                }}
              />
              <DatePicker
                label="Ngày kết thúc"
                openTo="year"
                views={["year", "month", "day"]}
                value={endTime}
                onChange={(newValue) => {
                  if (
                    newValue === null ||
                    newValue.toString() === "Invalid Date"
                  ) {
                    console.log("invalid");
                    setEndTimeError("Ngày  không hợp lệ");
                  } else {
                    setEndTime(newValue);
                    setEndTimeError("");
                  }
                }}
                renderInput={(params) => {
                  return <TextField required {...params} />;
                }}
              />
            </Stack>
          </LocalizationProvider>
          <label>Ảnh nền sự kiện:</label>
          <br />
          <img
            onClick={() => inputEl.current.click()}
            className="addImg mb-3"
            src={addImg}
            width={100}
            alt=""
          />
          <input
            ref={inputEl}
            style={{ width: "100%", display: "none" }}
            type="file"
            id="file"
            name="file"
            onChange={(e) => {
              if (e.target.files[0]) {
                setImg(e.target.files[0]);
              }
            }}
          ></input>
          {img && (
            <img src={window.URL.createObjectURL(img)} alt="" width={100} />
          )}
          <p>Chỉnh sửa sale </p>
          <p>Sản phẩm đang chọn: {selectedProduct.productName} </p>
          <TextField
            style={{ width: "100%" }}
            required
            error={saleError === "" ? false : true}
            label="Sale"
            variant="outlined"
            value={sale}
            helperText={saleError}
            onChange={(e) => setSale(e.target.value)}
            onBlur={() => {
              if (
                sale.length === 0 ||
                !parseFloat(sale) < 0 ||
                parseFloat(sale) > 1 ||
                isNumber(sale) === false
              )
                setSaleError("Nhập không đúng định dạng(giá trị từ 0-1)");
              else setSaleError("");
            }}
          />
          <button
            onClick={() => {
              if (
                saleError !== "" ||
                !selectedProduct ||
                saledProducts.some(
                  (product) => product.productId === selectedProduct.productId
                )
              )
                return;
              let tmpProduct = { ...selectedProduct };
              tmpProduct.sale = sale;
              setSaledProducts([...saledProducts, tmpProduct]);
              setSale("");
            }}
            type="button"
            className="btn btn-primary"
          >
            Thêm
          </button>
          <p>Danh sách sản phẩm được sale</p>
          <MyTable
            setSaledProducts={setSaledProducts}
            rows={saledProducts}
            type="promotion"
          />
        </div>
        <div className="col-12 pt-5 pb-3">
          <button
            onClick={handleSubmit}
            type="button"
            className="btn btn-primary"
          >
            Đăng sự kiện
          </button>
        </div>
      </div>
    </div>
  );
}
