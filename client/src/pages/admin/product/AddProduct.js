import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import axios from "axios";
import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import Table from "../../../components/MyTable.js";
import { authorization } from "../../../auth/auth";
import addImg from "../../../assets/images/addimg.png";
import isNumber from "../../../helpers/isNumber.js";
export default function AddProduct() {
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
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("phone");
  const inputEl = useRef(null);
  const onHandleDelete = (id) => {
    const newList = productVariants.filter((item) => item.id !== id);
    setProductVariants(newList);
  };
  const onHandleSubmit = async () => {
    if (!ten || !sale || productVariants.length === 0) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    setLoading(true);
    let ok = true;
    for (let [index, variant] of productVariants.entries()) {
      let imgSrcList = [];
      try {
        for (const img of variant.imgList) {
          console.log(img);
          await new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append("file", img);
            formData.append(
              "upload_preset",
              process.env.REACT_APP_CLOUD_PRESET
            );
            axios
              .post(
                "https://api.cloudinary.com/v1_1/nguyenphuctinh/image/upload",
                formData
              )
              .then((res) => {
                imgSrcList = [...imgSrcList, res.data.secure_url];
                console.log(imgSrcList);
                resolve();
              })
              .catch((err) => {
                console.log(err);
                reject();
              });
          });
        }

        productVariants[index].imgSrcList = [...imgSrcList];
      } catch (error) {
        setLoading(false);
        ok = false;
        toast.error("Upload ảnh không thành công");
      }
    }
    if (ok) {
      console.log(productVariants);
      let variantNames = [];
      if (category === "watch") {
        variantNames = ["color", "size"];
      } else {
        variantNames = ["color", "capacity"];
      }
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/api/products`,
          {
            name: ten,
            sale,
            productVariants,
            category,
            variantNames,
          },
          authorization()
        )
        .then((res) => {
          toast.success("Thêm thành công");
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          toast.error("Thêm thất bại");
        });
    }
  };
  const onHandleAddVariant = () => {
    if (
      !ten ||
      !mau ||
      (!dungLuong && category !== "watch") ||
      (!kichThuoc && category === "watch") ||
      !soLuong ||
      !gia ||
      imgList.length === 0 ||
      parseFloat(sale) < 0 ||
      parseFloat(sale) > 1 ||
      isNumber(sale) === false ||
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
  const handleChangeCategory = (event) => {
    if (productVariants.length === 0) {
      setCategory(event.target.value);
    } else {
      toast.error("Vui lòng xóa hết sản phẩm trước khi thay đổi danh mục");
    }
  };
  return (
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
          <FormControl className="mt-4" fullWidth>
            <InputLabel id="demo-simple-select-label">Thể loại</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={category}
              label="Thể loại"
              onChange={handleChangeCategory}
            >
              <MenuItem value="phone">Phone</MenuItem>
              <MenuItem value="laptop">Laptop</MenuItem>
              <MenuItem value="tablet">Tablet</MenuItem>
              <MenuItem value="watch">Watch</MenuItem>
            </Select>
          </FormControl>
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
            label={category === "watch" ? "Kích thước" : "Dung lượng sản phẩm"}
            variant="outlined"
            value={category === "watch" ? kichThuoc : dungLuong}
            helperText={category === "watch" ? kichThuocError : dungLuongError}
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
      <div className="row">
        <div className="col-12">
          <Table
            onHandleDelete={onHandleDelete}
            rows={productVariants}
            type="variant"
            category={category}
          />
        </div>
        <div className="col-12 mb-3 mt-2">
          {!loading ? (
            <Button onClick={onHandleSubmit} variant="contained">
              Đăng sản phẩm
            </Button>
          ) : (
            <LoadingButton
              loading
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="outlined"
            >
              Đăng sản phẩm
            </LoadingButton>
          )}
        </div>
      </div>
    </div>
  );
}
