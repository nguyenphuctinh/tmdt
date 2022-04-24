import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  BarChart,
  Legend,
  Bar,
} from "recharts";
import { decreaseDays } from "../../../helpers/dateCalculation";
import { fetchAllOrders } from "../../../redux/slices/orderSlice";
export default function Report() {
  const orders = useSelector((state) => state.orders);
  const products = useSelector((state) => state.products);

  const dispatch = useDispatch();

  const [startTime, setStartTime] = useState(decreaseDays(new Date(), 30));
  const [startTimeError, setStartTimeError] = useState("");
  const [endTime, setEndTime] = useState(new Date());
  const [endTimeError, setEndTimeError] = useState("");
  const [dataByDate, setDataByDate] = useState();
  const data = [
    {
      name: "Thống kê theo sản phẩm",
      phone: 4000,
      laptop: 2400,
      tablet: 2400,
      watch: 2400,
    },
  ];
  useEffect(() => {
    setDataByDate([
      {
        ...orders.data
          ?.filter((order) => {
            return (
              new Date(order.orderDate) >= startTime &&
              new Date(order.orderDate) <= endTime &&
              order.orderStatus.toLowerCase() === "đã giao"
            );
          })
          .reduce((acc, curr) => {
            const productsInOrder = curr.orderItems.map((item) => {
              return {
                category: products.data.find((product) => {
                  return product.productVariants
                    .map((productVariant) => productVariant.productVariantId)
                    .includes(item.productVariantId);
                }).category,
                quantity: item.quantity,
              };
            });
            return [...acc, ...productsInOrder];
          }, [])
          .reduce((acc, curr) => {
            let ok = 0;
            acc.forEach((element) => {
              if (element.category === curr.category) {
                element.quantity += curr.quantity;
                ok = 1;
              }
            });
            if (acc.length === 0) {
              return [curr];
            }
            if (ok === 0) {
              return [...acc, curr];
            }
            return acc;
          }, [])
          .map((element) => {
            return { [element.category]: element.quantity };
          })
          .reduce(
            (acc, curr) => {
              return { ...acc, ...curr };
            },
            { name: "Thống kê theo sản phẩm" }
          ),
      },
    ]);
  }, [orders.data, startTime, endTime]);
  return (
    <div>
      <p>Thống kê doanh thu</p>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6">
            <p>Từ ngày</p>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack spacing={3}>
                <DatePicker
                  disableFuture
                  label="Từ ngày"
                  openTo="year"
                  views={["year", "month", "day"]}
                  value={startTime}
                  onChange={(newValue) => {
                    if (
                      newValue === null ||
                      newValue.toString() === "Invalid Date"
                    ) {
                      console.log("invalid");
                      setStartTimeError("Ngày không hợp lệ");
                    } else {
                      setStartTime(newValue);
                      setStartTimeError("");
                    }
                  }}
                  renderInput={(params) => {
                    return <TextField required {...params} />;
                  }}
                />
              </Stack>
            </LocalizationProvider>
          </div>
          <div className="col-md-6">
            <p>Đến ngày</p>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack spacing={3}>
                <DatePicker
                  disableFuture
                  label="Đến ngày"
                  openTo="year"
                  views={["year", "month", "day"]}
                  value={endTime}
                  onChange={(newValue) => {
                    if (
                      newValue === null ||
                      newValue.toString() === "Invalid Date"
                    ) {
                      console.log("invalid");
                      setEndTimeError("Ngày không hợp lệ");
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
          </div>
        </div>
      </div>
      {orders && orders.data && (
        // <AreaChart
        //   width={730}
        //   height={250}
        //   data={orders.data}
        //   margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        // >
        //   <defs>
        //     <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
        //       <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
        //       <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
        //     </linearGradient>
        //     <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
        //       <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
        //       <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
        //     </linearGradient>
        //   </defs>
        //   <XAxis dataKey="name" />
        //   <YAxis />
        //   <CartesianGrid strokeDasharray="3 3" />
        //   <Tooltip />
        //   <Area
        //     type="monotone"
        //     dataKey="orderId"
        //     stroke="#8884d8"
        //     fillOpacity={1}
        //     fill="url(#colorUv)"
        //   />
        //   {/* <Area
        //     type="monotone"
        //     dataKey="pv"
        //     stroke="#82ca9d"
        //     fillOpacity={1}
        //     fill="url(#colorPv)"
        //   /> */}
        // </AreaChart>
        <BarChart width={730} height={250} data={dataByDate}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="phone" fill="#DD6E42" />
          <Bar dataKey="laptop" fill="#E8DAB2" />
          <Bar dataKey="tablet" fill="#4F6D7A" />
          <Bar dataKey="watch" fill="#C0D6DF" />
        </BarChart>
      )}
    </div>
  );
}
