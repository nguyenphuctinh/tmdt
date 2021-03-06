import React, { useEffect, useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import MyTable from "../../../components/MyTable";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
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
import { toast } from "react-toastify";
import addImg from "../../../assets/images/addimg.png";
import isNumber from "../../../helpers/isNumber.js";
import UpdateForm from "./UpdateForm";
import axios from "axios";
import { authorization } from "../../../auth/auth";
import { deleteProduct } from "../../../redux/slices/productSlice.js";
export default function UpdateProduct() {
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const [updateFromOpened, setUpdateFromOpened] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);
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
  const [description, setDescription] = useState("");

  const [productVariantUpdated, setProductVariantUpdated] = useState(null);
  const inputEl = useRef(null);
  let variantNames = [];
  for (const key in product?.variants) {
    variantNames.push(key);
  }

  useEffect(() => {
    document.title = "Qu???n l?? s???n ph???m";
    const pro = products?.data.find((product) => {
      return product.productId === parseInt(productId);
    });
    setProduct(pro);
    setTen(pro?.productName);
    setSale(pro?.sale);
    setCategory(pro?.category);
    setDescription(pro?.description);
  }, [products, productId]);
  const handleChangeCategory = (event) => {
    setCategory(event.target.value);
  };
  const onHandleSubmit = async () => {
    if (
      ten === "" ||
      parseFloat(sale) < 0 ||
      parseFloat(sale) > 1 ||
      isNumber(sale) === false
    ) {
      toast.error("Vui l??ng nh???p ch??nh x??c v?? ?????y ????? th??ng tin");
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/products/${productId}`,
        {
          type: "updateProduct",
          productName: ten.trim(),
          description,
          category,
          sale,
        },
        authorization()
      );
      toast.success("C???p nh???t th??nh c??ng!");
    } catch (error) {
      toast.error("C???p nh???t th???t b???i!");
    }
    setLoading(false);
  };
  const onHandleAddVariant = async () => {
    if (
      (!dungLuong && category !== "watch") ||
      (!kichThuoc && category === "watch") ||
      !soLuong ||
      !gia ||
      imgList.length === 0 ||
      isNumber(gia) === false ||
      isNumber(soLuong) === false
    ) {
      toast.error("Vui l??ng nh???p ch??nh x??c v?? ?????y ????? th??ng tin");
      return;
    }
    try {
      setLoading(true);
      let imgSrcList = [];
      for (const img of imgList) {
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
      if (category === "watch") {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/products/${productId}`,
          {
            type: "addProductVariant",
            productVariant: {
              color: mau,
              size: kichThuoc,
              quantity: parseInt(soLuong),
              price: gia,
              imgSrcList,
            },
            variantNames: ["color", "size"],
          },
          authorization()
        );
      } else {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/products/${productId}`,
          {
            type: "addProductVariant",
            productVariant: {
              color: mau,
              capacity: dungLuong,
              quantity: parseInt(soLuong),
              price: gia,
              imgSrcList,
            },
            variantNames: ["color", "capacity"],
          },
          authorization()
        );
      }
      toast.success("Th??m m???i th??nh c??ng!");
    } catch (error) {
      console.log(error);
      toast.error("Th??m m???i th???t b???i!");
    }

    setImgList([]);
    inputEl.current.value = null;
    setLoading(false);
  };
  const onHandleDelete = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/products/${productId}`,
        authorization()
      );
      toast.success("X??a th??nh c??ng!");

      dispatch(deleteProduct(parseInt(productId)));
      setDeleted(true);
    } catch (error) {
      console.log(error);
      toast.error("X??a s???n ph???m th???t b???i!");
    }
  };
  if (deleted) {
    return <Navigate to="/admin?tab=product" />;
  }
  return (
    <div
      style={{ backgroundColor: "white", color: "black" }}
      className="container p-0"
    >
      {product && (
        <>
          {updateFromOpened ? (
            <UpdateForm
              type="updateWhenUpdatingProduct"
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
              <div className="col-md-6">
                <TextField
                  style={{ width: "100%" }}
                  required
                  error={tenError === "" ? false : true}
                  label="T??n s???n ph???m"
                  variant="outlined"
                  value={ten}
                  onChange={(e) => setTen(e.target.value)}
                  helperText={tenError}
                  onBlur={() => {
                    if (ten.length === 0) setTenError("Kh??ng ???????c ????? tr???ng");
                    else setTenError("");
                  }}
                />

                <br />
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
                      setSaleError(
                        "Nh???p kh??ng ????ng ?????nh d???ng (gi?? tr??? t??? 0-1)"
                      );
                    else setSaleError("");
                  }}
                />
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Th??? lo???i
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={category}
                    label="Th??? lo???i"
                    onChange={handleChangeCategory}
                  >
                    <MenuItem value="phone">Phone</MenuItem>
                    <MenuItem value="laptop">Laptop</MenuItem>
                    <MenuItem value="tablet">Tablet</MenuItem>
                    <MenuItem value="watch">Watch</MenuItem>
                  </Select>
                </FormControl>
                <textarea
                  placeholder="M?? t??? s???n ph???m *"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  name=""
                  id=""
                  className="setDescription"
                ></textarea>
                <Button onClick={onHandleSubmit} variant="contained">
                  C???p nh???t th??ng tin chung
                </Button>
              </div>
              <div className="col-md-6">
                <h4>Th??m c??c bi???n th???</h4>
                <TextField
                  style={{ width: "100%", marginBottom: 30 }}
                  required
                  error={mauError === "" ? false : true}
                  label="M??u s???n ph???m"
                  variant="outlined"
                  value={mau}
                  onChange={(e) => setMau(e.target.value)}
                  helperText={mauError}
                  onBlur={() => {
                    if (mau.length === 0) setMauError("Kh??ng ???????c ????? tr???ng");
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
                    category === "watch" ? "K??ch th?????c" : "Dung l?????ng s???n ph???m"
                  }
                  variant="outlined"
                  value={category === "watch" ? kichThuoc : dungLuong}
                  helperText={
                    category === "watch" ? kichThuocError : dungLuongError
                  }
                  onBlur={() => {
                    if (category === "watch") {
                      if (kichThuoc.length === 0)
                        setKichThuocError("Kh??ng ???????c ????? tr???ng");
                      else setKichThuocError("");
                    } else {
                      if (dungLuong.length === 0)
                        setDungLuongError("Kh??ng ???????c ????? tr???ng");
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
                  label="S??? l?????ng s???n ph???m"
                  variant="outlined"
                  value={soLuong}
                  helperText={soLuongError}
                  onChange={(e) => setSoLuong(e.target.value)}
                  onBlur={() => {
                    if (soLuong.length === 0 || isNumber(soLuong) === false)
                      setSoLuongError("Nh???p kh??ng ????ng ?????nh d???ng");
                    else setSoLuongError("");
                  }}
                />

                <br />
                <TextField
                  style={{ width: "100%", marginBottom: 30 }}
                  required
                  error={giaError === "" ? false : true}
                  label="Gi?? s???n ph???m"
                  variant="outlined"
                  value={gia}
                  helperText={giaError}
                  onChange={(e) => setGia(e.target.value)}
                  onBlur={() => {
                    if (gia.length === 0 || isNumber(gia) === false)
                      setGiaError("Nh???p kh??ng ????ng ?????nh d???ng");
                    else {
                      setGiaError("");
                    }
                  }}
                />

                <br />
                <label>Th??m ???nh:</label>
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
                <div className="mt-2"></div>
                {!loading ? (
                  <Button
                    color="success"
                    onClick={onHandleAddVariant}
                    variant="contained"
                  >
                    Th??m bi???n th???
                  </Button>
                ) : (
                  <LoadingButton
                    color="success"
                    loading
                    loadingPosition="start"
                    startIcon={<SaveIcon />}
                    variant="outlined"
                  >
                    Th??m bi???n th???
                  </LoadingButton>
                )}

                <br />
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
          <Button
            variant="contained"
            color="error"
            style={{ margin: 10 }}
            onClick={onHandleDelete}
          >
            X??a s???n ph???m
          </Button>
        </>
      )}
    </div>
  );
}
