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
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Table from "../../../components/MyTable.js";
import { authorization } from "../../../auth/auth";
import addImg from "../../../assets/images/addimg.png";
import isNumber from "../../../helpers/isNumber.js";
import UpdateForm from "./UpdateForm.js";
import generateId from "../../../helpers/generateId.js";
import {
  addProduct,
  fetchProduct,
} from "../../../redux/slices/productSlice.js";
import { useDispatch } from "react-redux";
export default function AddProduct() {
  const navigate = useNavigate();

  const [updateFromOpened, setUpdateFromOpened] = useState(false);
  const [productVariantUpdated, setProductVariantUpdated] = useState(null);

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
  const [description, setDescription] = useState("");
  const inputEl = useRef(null);
  const dispatch = useDispatch();
  const onHandleDelete = (id) => {
    const newList = productVariants.filter((item) => item.id !== id);
    setProductVariants(newList);
  };
  const onHandleSubmit = async () => {
    if (!ten || !sale || productVariants.length === 0) {
      toast.error("Vui l??ng nh???p ?????y ????? th??ng tin");
      return;
    }
    setLoading(true);
    let ok = true;
    for (let [index, variant] of productVariants.entries()) {
      let imgSrcList = [];
      try {
        for (const img of variant.imgList) {
          await new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append("file", img.img);
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
        productVariants[index].imgList = [];
      } catch (error) {
        setLoading(false);
        ok = false;
        console.log(error);
        toast.error("Upload ???nh kh??ng th??nh c??ng");
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

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/products`,
          {
            name: ten.trim(),
            description,
            sale,
            productVariants,
            category,
            variantNames,
          },
          authorization()
        );
        toast.success("Th??m th??nh c??ng");
        setLoading(false);
        dispatch(fetchProduct());
        navigate("/admin?tab=product");
      } catch (error) {
        setLoading(false);
        toast.error("Th??m th???t b???i");
      }
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
      toast.error("Vui l??ng nh???p ch??nh x??c v?? ?????y ????? th??ng tin");
      return;
    }
    if (category === "watch") {
      setProductVariants([
        ...productVariants,
        {
          id: generateId(productVariants),
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
          id: generateId(productVariants),
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
      toast.error("Vui l??ng x??a h???t s???n ph???m tr?????c khi thay ?????i danh m???c");
    }
  };
  return (
    <div style={{ backgroundColor: "#2f3033" }}>
      {updateFromOpened ? (
        <UpdateForm
          type="updateWhenAdding"
          productVariantUpdated={productVariantUpdated}
          setUpdateFromOpened={setUpdateFromOpened}
          setProductVariants={setProductVariants}
          productVariants={productVariants}
          category={category}
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
                  setSaleError("Nh???p kh??ng ????ng ?????nh d???ng (gi?? tr??? t??? 0-1)");
                else setSaleError("");
              }}
            />

            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Th??? lo???i</InputLabel>
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
          </div>
          <div className="col-6">
            <h4>Th??m c??c bi???n th???</h4>

            <TextField
              style={{ width: "100%" }}
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
              style={{ width: "100%" }}
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
              style={{ width: "100%" }}
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
              style={{ width: "100%" }}
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
                if (e.target.files[0]) {
                  setImgList([
                    ...imgList,
                    {
                      id: generateId(imgList),
                      img: e.target.files[0],
                    },
                  ]);
                }
              }}
            ></input>
            <br />
            {imgList &&
              imgList.map((img, index) => {
                return (
                  <img
                    key={img.id}
                    src={window.URL.createObjectURL(img.img)}
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
              Th??m bi???n th???
            </button>
            <br />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <Table
              setProductVariantUpdated={setProductVariantUpdated}
              setUpdateFromOpened={setUpdateFromOpened}
              onHandleDelete={onHandleDelete}
              rows={productVariants}
              type="variant"
              category={category}
            />
          </div>
          <div className="col-12 mb-3 mt-2">
            {!loading ? (
              <Button onClick={onHandleSubmit} variant="contained">
                ????ng s???n ph???m
              </Button>
            ) : (
              <LoadingButton
                loading
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="outlined"
              >
                ????ng s???n ph???m
              </LoadingButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
const getVariants = (variantNames, productVariants) => {
  // console.log(variantNames, productVariants);
  let variants = {};
  variantNames.forEach((variantName) => {
    productVariants.forEach((productVariant) => {
      if (variants[variantName]) {
        if (
          !variants[variantName].some(
            (variant) => variant === productVariant[variantName]
          )
        ) {
          variants[variantName] = [
            ...variants[variantName],
            productVariant[variantName],
          ];
        }
      } else {
        variants[variantName] = [productVariant[variantName]];
      }
    });
  });
  console.log(variants);
  return variants;
};
