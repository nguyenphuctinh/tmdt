import { Stack, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import isNumber from "../../../helpers/isNumber";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import NotFound from "../../notfound/NotFound";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import UpdateProductPromotionTable from "./UpdateProductPromotionTable";
import { deletePromotion } from "../../../redux/slices/promotionSlice";

export default function UpdatePromotion() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);
  const promotions = useSelector((state) => state.promotions);
  const [promotion, setPromotion] = useState(null);
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
  const { promotionId } = useParams();
  const navigate = useNavigate();
  const handleAddProduct = async () => {
    if (
      saledProducts.some(
        (product) => product.productId === selectedProduct.productId
      )
    ) {
      toast.error("Sản phẩm đã có trong danh sách");
      return;
    }
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
    await axios.put(
      `${process.env.REACT_APP_API_URL}/api/promotions/${promotionId}`,
      {
        type: "addProduct",
        sale,
        productId: selectedProduct.productId,
      }
    );
  };
  const handleDelete = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/promotions/${promotionId}`
      );
      dispatch(deletePromotion({ promotionId }));
      navigate("/admin?tab=promotion");
      toast.success("Xóa thành công!");
    } catch (error) {
      toast.error("Xóa không thành công");
    }
  };
  const handleUpdate = async () => {
    if (
      tenError !== "" ||
      saleError !== "" ||
      startTimeError !== "" ||
      endTimeError !== ""
    ) {
      toast.error("Vui lòng nhập đầy đủ và chính xác thông tin");
      return;
    }
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/promotions/${promotionId}`,
        {
          ten,
          type: "update",
          startTime,
          endTime,
        }
      );
      toast.success("Cập nhật thành công");
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
  useEffect(() => {
    if (promotions.data) {
      const tmpPromotion = promotions.data.find(
        (item) => item.promotionId === parseInt(promotionId)
      );
      setPromotion(tmpPromotion);
      if (tmpPromotion) {
        setTen(tmpPromotion.promotionName);
        // setSale(tmpPromotion.sale);
        setStartTime(tmpPromotion.promotionStartTime);
        setEndTime(tmpPromotion.promotionExpTime);
        setSaledProducts(
          tmpPromotion.saledProducts.map((item) => {
            return {
              ...products.data.find(
                (product) => product.productId === item.productId
              ),
              sale: item.sale,
            };
          })
        );
      }
    }
  }, [promotions.data]);
  if (promotion === undefined) return <NotFound />;
  return (
    <div>
      <div className="container-fluid addPromotion">
        <div class="row pt-5 pb-5">
          <div class="col-sm-12 sessionTitle">
            <i class="fab fa-apple"></i> <span>Cập nhật sự kiện</span>
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
                  <Link
                    to={"/product/" + product.productName}
                    className="text-primary"
                  >
                    {product.productName}
                  </Link>
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
            {/* <label>Ảnh nền sự kiện:</label>
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
            )} */}
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
              onClick={handleAddProduct}
              type="button"
              className="btn btn-primary"
            >
              Thêm
            </button>
            <p>Danh sách sản phẩm được sale</p>
            <UpdateProductPromotionTable
              setSaledProducts={setSaledProducts}
              rows={saledProducts}
              promotionId={promotion?.promotionId}
              type="promotion"
            />
          </div>
          <div className="col-12 pt-5 pb-3">
            <button
              onClick={handleUpdate}
              type="button"
              className="btn btn-primary"
            >
              Lưu
            </button>
            <button
              onClick={handleDelete}
              type="button"
              className="btn btn-danger"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
