import React, { useEffect, useState, useRef } from "react";
import MyTable from "../../../components/MyTable";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import addImg from "../../../assets/images/addimg.png";
import isNumber from "../../../helpers/isNumber.js";
import UpdateForm from "./UpdateForm";
import axios from "axios";
import { authorization } from "../../../auth/auth";
export default function UpdateProduct() {
  const products = useSelector((state) => state.products);
  const [updateFromOpened, setUpdateFromOpened] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const productId = useParams().productId;
  const [ten, setTen] = useState("");
  const [tenError, setTenError] = useState("");
  const [mau, setMau] = useState("");
  const [mauError, setMauError] = useState("");
  const [dungLuong, setDungLuong] = useState("");
  const [dungLuongError, setDungLuongError] = useState("");
  const [kichThuoc, setKichThuoc] = useState("");
  const [kichThuocError, setKichThuocError] = useState("");
  const [soLuong, setSoLuong] = useState("");
  const [soLuongError, setSoLuongError] = useState("");
  const [gia, setGia] = useState("");
  const [giaError, setGiaError] = useState("");
  const [sale, setSale] = useState("");
  const [saleError, setSaleError] = useState("");
  const [imgList, setImgList] = useState([]);
  const [productVariants, setProductVariants] = useState([]);
  const [category, setCategory] = useState("phone");
  const [productVariantUpdated, setProductVariantUpdated] = useState(null);
  const inputEl = useRef(null);
  let variantNames = [];
  for (const key in product?.variants) {
    variantNames.push(key);
  }

  useEffect(() => {
    document.title = "Quản lý sản phẩm";
    const pro = products?.data.find((product) => {
      return product.productId === parseInt(productId);
    });
    setProduct(pro);
    setTen(pro?.productName);
    setSale(pro?.sale);
    setCategory(pro?.category);
  }, [products, productId]);
  const onHandleSubmit = async () => {
    if (
      ten === "" ||
      parseFloat(sale) < 0 ||
      parseFloat(sale) > 1 ||
      isNumber(sale) === false
    ) {
      toast.error("Vui lòng nhập chính xác và đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/products/${productId}`,
        {
          type: "updateProductNameAndSale",
          productName: ten,
          sale,
        },
        authorization()
      );
      toast.success("Cập nhật thành công!");
    } catch (error) {
      toast.error("Cập nhật thất bại!");
    }
    setLoading(false);
  };
  const onHandleAddVariant = () => {
    if (
      (!dungLuong && category !== "watch") ||
      (!kichThuoc && category === "watch") ||
      !soLuong ||
      !gia ||
      imgList.length === 0 ||
      isNumber(gia) === false ||
      isNumber(soLuong) === false
    ) {
      toast.error("Vui lòng nhập chính xác và đầy đủ thông tin");
      return;
    }
    if (category === "watch") {
      setProductVariants([
        ...productVariants,
        {
          id: productVariants[productVariants.length - 1] + 1,
          color: mau,
          size: kichThuoc,
          quantity: parseInt(soLuong),
          price: gia,
          imgList,
        },
      ]);
    } else {
      setProductVariants([
        ...productVariants,
        {
          color: mau,
          id: productVariants.length + 1,
          capacity: dungLuong,
          quantity: parseInt(soLuong),
          price: gia,
          imgList,
        },
      ]);
    }
    console.log(imgList);
    setImgList([]);
    inputEl.current.value = null;
  };
  return (
    <div className="container">
      {product && (
        <>
          {updateFromOpened ? (
            <UpdateForm
              productVariantUpdated={productVariantUpdated}
              setUpdateFromOpened={setUpdateFromOpened}
              category={category}
              productId={product.productId}
              variantNames={variantNames}
            />
          ) : (
            ""
          )}
          <div
            style={{ backgroundColor: "white", color: "black" }}
            className="container"
          >
            <div className="row pt-4">
              <div className="col-6">
                <TextField
                  style={{ width: "100%" }}
                  required
                  error={tenError === "" ? false : true}
                  label="Tên sản phẩm"
                  variant="outlined"
                  value={ten}
                  onChange={(e) => setTen(e.target.value)}
                  helperText={tenError}
                  onBlur={() => {
                    if (ten.length === 0) setTenError("Không được để trống");
                    else setTenError("");
                  }}
                />

                <br />
                <TextField
                  style={{ width: "100%", marginTop: 30 }}
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
                      setSaleError("Nhập không đúng định dạng");
                    else setSaleError("");
                  }}
                />

                <br />
                <br />
                {!loading ? (
                  <Button onClick={onHandleSubmit} variant="contained">
                    Cập nhật tên và sale
                  </Button>
                ) : (
                  <LoadingButton
                    loading
                    loadingPosition="start"
                    startIcon={<SaveIcon />}
                    variant="outlined"
                  >
                    Cập nhật tên và sale
                  </LoadingButton>
                )}
              </div>
              <div className="col-6">
                <h4>Thêm các biến thể</h4>
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

                <br />
                <label>Thêm ảnh:</label>
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
                    if (e.target.files[0])
                      setImgList([...imgList, e.target.files[0]]);
                  }}
                ></input>
                <br />

                {imgList &&
                  imgList.map((img, index) => {
                    return (
                      <img
                        key={img.lastModified}
                        src={window.URL.createObjectURL(img)}
                        alt=""
                        width={100}
                      />
                    );
                  })}
                <br />
                <button
                  onClick={onHandleAddVariant}
                  type="button"
                  className="mb-3 mt-3 btn btn-success"
                >
                  Thêm biến thể
                </button>
                <br />
              </div>
            </div>
          </div>
          <MyTable
            rows={[...product.productVariants]}
            setProductVariantUpdated={setProductVariantUpdated}
            type="updateVariant"
            category={product.category}
            setUpdateFromOpened={setUpdateFromOpened}
          />
        </>
      )}
    </div>
  );
}
