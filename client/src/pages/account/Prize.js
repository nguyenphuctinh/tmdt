import React, { useEffect } from "react";
import Wheel from "./Wheel";
import { useSelector, useDispatch } from "react-redux";
import { fetchPrizes } from "../../redux/slices/prizeSlice";
import axios from "axios";
import { authorization } from "../../auth/auth";
import {
  addPrizeUser,
  fetchPrizesUserById,
} from "../../redux/slices/prizesUserSlice";
import { generateEntityId } from "../../helpers/generateId";
import { decreasePoints } from "../../redux/slices/userSlice";
export default function Prize() {
  const user = useSelector((state) => state.user);
  const prizes = useSelector((state) => state.prizes);
  const prizesUser = useSelector((state) => state.prizesUser);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPrizes());
    dispatch(fetchPrizesUserById(user.data.id));
  }, []);
  const onHandleSpin = async (prizeName) => {
    console.log(prizeName);
    if (user.data.points < 1000) {
      return;
    }
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/${user.data.id}`,
        {
          points: user.data.points - 1000,
          type: "updatePoints",
        },
        authorization()
      );
      const tmpPrize = prizes.data.find(
        (prize) => prize.prizeName === prizeName
      );
      console.log(tmpPrize);
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/prizesUsers`,
        {
          prizeId: tmpPrize.prizeId,
          userId: user.data.id,
          state:
            tmpPrize.prizeType === "discount" ? "chưa sử dụng" : "chờ xử lý",
        },
        authorization()
      );
      dispatch(decreasePoints(1000));
      dispatch(
        addPrizeUser({
          ...res.data,
          prizeName: tmpPrize.prizeName,
          prizeType: tmpPrize.prizeType,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <p>Số lượt quay còn lại:{parseInt(user.data?.points / 1000)}</p>
          {prizes.data && (
            <div>
              {" "}
              <div
                style={{
                  zIndex: parseInt(user.data?.points / 1000) > 0 ? "-1" : "10",
                  width: "1000px",
                  height: "800px",
                  position: "absolute",
                }}
              ></div>
              <Wheel onHandleSpin={onHandleSpin} segments={prizes.data} />
            </div>
          )}
          <p> Lịch sử quay</p>

          <table class="table">
            <thead>
              <tr>
                <th scope="col">Tên phần thưởng</th>
                <th scope="col">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {prizesUser.data?.map((prizeUser) => (
                <tr key={prizeUser.prizeUserId}>
                  <td>
                    {" "}
                    {prizeUser.prizeType === "discount"
                      ? `Phiếu giảm giá ${prizeUser.prizeName * 100}%`
                      : prizeUser.prizeName}
                  </td>
                  <td>
                    <p>{prizeUser.state}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
