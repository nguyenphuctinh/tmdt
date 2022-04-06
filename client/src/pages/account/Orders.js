import { Tab, Tabs } from "@mui/material";
import { Box } from "@mui/system";
// import React from "react";
import * as React from "react";
import OrderList from "./OrderList";
export default function Orders() {
  const [value, setValue] = React.useState(0);
  const handleChange = (e, newValue) => {
    setValue(newValue);
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Tất cả" />
          <Tab label="Chờ xác nhận" />
          <Tab label="Chờ lấy hàng" />
          <Tab label="Đang giao" />
          <Tab label="Đã giao" />
          <Tab label="Đã hủy" />
        </Tabs>
      </div>
      <div className="row">
        <div className="col-12">{value === 0 ? <OrderList /> : ""}</div>
      </div>
    </div>
  );
}
