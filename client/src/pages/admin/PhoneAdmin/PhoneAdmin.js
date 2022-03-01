import { Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import LoadingButton from "@mui/lab/LoadingButton";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import PhoneVariantTable from "./PhoneVariantTable";

export default function PhoneAdmin() {
  const [ten, setTen] = useState("");
  const [mau, setMau] = useState("");
  const [dungLuong, setDungLuong] = useState("");
  const [soLuong, setSoLuong] = useState("");
  const [gia, setGia] = useState("");
  const [sale, setSale] = useState("");
  const [imgList, setImgList] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const onHandleSubmit = () => {
    setLoading(true);
    var imgSrcList = [];
    variants.forEach(async (variant) => {
      imgSrcList = [];
      try {
        await new Promise((resolve, reject) => {
          let count = 0;
          variant.imgList.forEach((img) => {
            const formData = new FormData();
            console.log(img);
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
                console.log(res);
                imgSrcList = [...imgSrcList, res.data.secure_url];
                count++;
                console.log(imgSrcList);
                if (count === variant.imgList.length) {
                  resolve();
                }
              })
              .catch((err) => {
                console.log(err);
                reject();
              });
          });
        });
        console.log("ok");
        axios
          .post(
            `${process.env.REACT_APP_API_URL}/api/admin/phone`,
            {
              name: variant.ten,
              color: variant.mau,
              capacity: variant.dungLuong,
              quantity: variant.soLuong,
              price: variant.gia,
              sale: variant.sale,
              imgList: imgSrcList,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .then((res) => {
            toast.success("Thêm thành công");
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            toast.error("Thêm thất bại");
          });
      } catch (error) {
        setLoading(false);
        toast.error("Upload ảnh không thành công");
      }
    });
  };
  const onHandleAddVariant = () => {
    // console.log(mau, dungLuong);
    setVariants([
      ...variants,
      {
        color: mau,
        capacity: dungLuong,
        quantity: soLuong,
        price: gia,
        imgList,
      },
    ]);
    setImgList([]);

    // variants[0]?.imgList.forEach((img, index) => {
    //   console.log(img, index);
    // });
  };
  return (
    <div className="container">
      <div className="row">
        <div className="col-6">
          <label>ten san pham</label>
          <input
            type="text"
            className="form-control"
            aria-describedby="helpId"
            placeholder="ten"
            value={ten}
            onChange={(e) => setTen(e.target.value)}
          />
          <br />

          <label>sale </label>
          <input
            type="text"
            className="form-control"
            aria-describedby="helpId"
            placeholder=""
            value={sale}
            onChange={(e) => setSale(e.target.value)}
          />
          <br />
        </div>
        <div className="col-6">
          <h4>Thêm các biến thể</h4>
          <label>mau san pham</label>
          <input
            type="text"
            className="form-control"
            aria-describedby="helpId"
            placeholder=""
            value={mau}
            onChange={(e) => setMau(e.target.value)}
          />
          <br />
          <label>dung luong san pham</label>
          <input
            type="text"
            className="form-control"
            aria-describedby="helpId"
            placeholder=""
            value={dungLuong}
            onChange={(e) => setDungLuong(e.target.value)}
          />
          <br />
          <label>so luong san pham</label>
          <input
            type="text"
            className="form-control"
            aria-describedby="helpId"
            placeholder=""
            value={soLuong}
            onChange={(e) => setSoLuong(e.target.value)}
          />
          <br />
          <label>gia </label>
          <input
            type="text"
            className="form-control"
            aria-describedby="helpId"
            placeholder=""
            value={gia}
            onChange={(e) => setGia(e.target.value)}
          />
          <br />

          <input
            style={{ width: "100%" }}
            type="file"
            id="file"
            name="file"
            onChange={(e) => {
              setImgList([...e.target.files]);
            }}
            multiple
          ></input>
          <br />
          <button onClick={onHandleAddVariant} type="button">
            Thêm
          </button>
          <br />
          {imgList &&
            imgList.map((img) => {
              return (
                <img
                  key={window.URL.createObjectURL(img)}
                  src={window.URL.createObjectURL(img)}
                  alt=""
                  width={100}
                />
              );
            })}
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <PhoneVariantTable rows={variants} />
        </div>
        <div className="col-12 mb-3">
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
