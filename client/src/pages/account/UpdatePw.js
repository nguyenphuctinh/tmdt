import { TextField } from "@mui/material";
import { toast } from "react-toastify";
import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { authorization } from "../../auth/auth";
export default function UpdatePw() {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const user = useSelector((state) => state.user);
  const onHandleClick = async () => {
    if (newPassword !== confirmPassword || newPassword.length === 0) {
      return;
    }

    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/${user.data.username}`,
        {
          password,
          newPassword,
          type: "updatePassword",
        },
        authorization()
      );
      toast.success("Đổi mật khẩu thành công");
      setNewPassword("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error(error.response.data);
      } else if (error.request) {
        toast(error.request);
      } else {
        toast("Error", error.message);
      }
    }
  };
  return (
    <div className="container updatePw">
      <div className="row">
        <div className="col-12">
          <p className="sessionTitle">
            <span>ĐỔI MẬT KHẨU</span>
          </p>
        </div>
        <div className="col-12">
          <TextField
            style={{ width: "100%" }}
            required
            type="password"
            error={passwordError === "" ? false : true}
            label="Mật khẩu hiện tại"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText={passwordError}
            onBlur={() => {
              if (password.length === 0)
                setPasswordError("Không được để trống");
              else setPasswordError("");
            }}
          />
          <br />
          <br />
          <TextField
            style={{ width: "100%" }}
            type="password"
            required
            error={newPasswordError === "" ? false : true}
            label="Mật khẩu mới"
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            helperText={newPasswordError}
            onBlur={() => {
              if (newPassword.length === 0)
                setNewPasswordError("Không được để trống");
              else setNewPasswordError("");
            }}
          />{" "}
          <br />
          <br />
          <TextField
            style={{ width: "100%" }}
            required
            type="password"
            error={confirmPasswordError === "" ? false : true}
            label="Nhập lại mật khẩu mới"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            helperText={confirmPasswordError}
            onBlur={() => {
              if (confirmPassword.length === 0) {
                setConfirmPasswordError("Không được để trống");
              } else if (confirmPassword !== newPassword) {
                setConfirmPasswordError("Mật khẩu không khớp");
              } else setConfirmPasswordError("");
            }}
          />
          <button onClick={onHandleClick} type="button" class="btn btn-primary">
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
