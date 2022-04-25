import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { Stack, TextField } from "@mui/material";
import { addMonths } from "date-fns/esm";
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
import {
  decreaseDays,
  getMonthDifference,
} from "../../../helpers/dateCalculation";
import { fetchAllOrders } from "../../../redux/slices/orderSlice";
export default function Report() {
  const orders = useSelector((state) => state.orders);
  const products = useSelector((state) => state.products);

  const dispatch = useDispatch();

  const [startTime, setStartTime] = useState(decreaseDays(new Date(), 30));
  const [startTimeError, setStartTimeError] = useState("");
  const [endTime, setEndTime] = useState(new Date());
  const [endTimeError, setEndTimeError] = useState("");
  const [categoryReport, setCategoryReport] = useState();
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const data = [
    {
      name: "Tháng 1",
      revenue: 11111,
    },
    {
      name: "Tháng 2",
      revenue: 111122,
    },
  ];
  useEffect(() => {
    setCategoryReport([
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
            { name: "Số sản phẩm đã bán" }
          ),
      },
    ]);
    let monthCount = getMonthDifference(new Date(startTime), new Date(endTime));
    let data = [];

    for (let i = 0; i <= monthCount; i++) {
      let revenue = orders.data
        ?.filter((order) => {
          return (
            new Date(order.orderDate).getMonth() ==
              addMonths(startTime, i).getMonth() &&
            order.orderStatus.toLowerCase() === "đã giao"
          );
        })
        .map((order) => {
          return order.orderItems.reduce((acc, curr) => {
            return acc + curr.quantity * curr.price * (1 - curr.sale);
          }, 0);
        })
        .reduce((acc, curr) => {
          return acc + curr;
        }, 0);
      data = [
        ...data,
        {
          name: ` ${addMonths(startTime, i).getMonth() + 1}/${addMonths(
            startTime,
            i
          ).getFullYear()}`,
          revenue: revenue / 1000000,
        },
      ];
    }
    setMonthlyRevenue(data);
  }, [orders.data, startTime, endTime]);
  return (
    <div>
      <p>Thống kê doanh thu</p>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6">
            <p>Từ</p>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack spacing={3}>
                <DatePicker
                  disableFuture
                  label="Từ tháng"
                  openTo="year"
                  views={["year", "month"]}
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
            <p>Đến</p>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack spacing={3}>
                <DatePicker
                  disableFuture
                  label="Đến tháng"
                  openTo="year"
                  views={["year", "month"]}
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
        <div>
          <div className="pb-3">
            {" "}
            <AreaChart
              width={320}
              height={250}
              data={monthlyRevenue}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis unit={"tr"} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorUv)"
              />
            </AreaChart>
          </div>
          {/* <BarChart width={320} height={250} data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="phone" fill="#DD6E42" />
            <Bar dataKey="laptop" fill="#E8DAB2" />
            <Bar dataKey="tablet" fill="#4F6D7A" />
            <Bar dataKey="watch" fill="#C0D6DF" />
          </BarChart> */}
          <BarChart width={320} height={250} data={categoryReport}>
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
        </div>
      )}
    </div>
  );
}
