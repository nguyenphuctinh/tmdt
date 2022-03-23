import { TextField } from "@mui/material";
import { toast } from "react-toastify";
import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function Info() {
  const [ten, setTen] = useState("");
  const [tenError, setTenError] = useState("");
  return (
    <div className="container updatePw">
      <div className="row">
        <div className="col-12">
          <p className="sessionTitle">
            <span>CẬP NHẬT THÔNG TIN</span>
          </p>
        </div>
        <div className="col-12">
          <TextField
            style={{ width: "100%" }}
            required
            error={tenError === "" ? false : true}
            label="Tên"
            variant="outlined"
            value={ten}
            onChange={(e) => setTen(e.target.value)}
            helperText={tenError}
            onBlur={() => {
              if (ten.length === 0) setTenError("Không được để trống");
              else setTenError("");
            }}
          />
        </div>
      </div>
    </div>
  );
}
