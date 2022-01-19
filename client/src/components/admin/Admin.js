import axios from "axios";
import React, { useState } from "react";

export default function Admin() {
  const [ten, setTen] = useState("");
  const [mau, setMau] = useState("");
  const [dungLuong, setDungLuong] = useState("");
  const [soLuong, setSoLuong] = useState("");
  const [gia, setGia] = useState("");
  const [sale, setSale] = useState("");
  const [img, setImg] = useState(null);
  const [imgList, setImgList] = useState([]);
  const onHandleSubmit = () => {
    console.log("?");
    const formData = new FormData();
    formData.append("file", img);
    formData.append("upload_preset", "ofmm2ky6");
    axios
      .post(
        "https://api.cloudinary.com/v1_1/nguyenphuctinh/image/upload",
        formData
      )
      .then((res) => {
        console.log(res);
        setImgList([...imgList, res.data.secure_url]);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div>
      <div className="form-group">
        <label>ten san pham</label>
        <input
          type="text"
          className="form-control"
          aria-describedby="helpId"
          placeholder="ten"
        />
        <br />
        <label>mau san pham</label>
        <input
          type="text"
          className="form-control"
          aria-describedby="helpId"
          placeholder=""
        />
        <br />
        <label>dung luong san pham</label>
        <input
          type="text"
          className="form-control"
          aria-describedby="helpId"
          placeholder=""
        />
        <br />
        <label>so luong san pham them</label>
        <input
          type="text"
          className="form-control"
          aria-describedby="helpId"
          placeholder=""
        />
        <br />
        <label>gia </label>
        <input
          type="text"
          className="form-control"
          aria-describedby="helpId"
          placeholder=""
        />
        <br />
        <label>sale </label>
        <input
          type="text"
          className="form-control"
          aria-describedby="helpId"
          placeholder=""
        />
        <br />
        <input
          type="file"
          id="file"
          name="file"
          onChange={(e) => {
            setImg(e.target.files[0]);
          }}
        ></input>
        <br />
        <button onClick={onHandleSubmit} type="button">
          submit
        </button>
        {imgList &&
          imgList.map((link) => <img src={link} alt="" width={100} />)}
      </div>
    </div>
  );
}
