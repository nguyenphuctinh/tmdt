import React, { useEffect } from "react";
import Wheel from "./Wheel";
import { useSelector, useDispatch } from "react-redux";
import { fetchPrizes } from "../../redux/slices/prizeSlice";
import axios from "axios";
import { authorization } from "../../auth/auth";
import {
  fetchPrizesUser,
  fetchPrizesUserById,
} from "../../redux/slices/prizesUserSlice";
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
      axios.post(`${process.env.REACT_APP_API_URL}/api/prizesUsers`, {
        prizeId: tmpPrize.prizeId,
        userId: user.data.id,
        state: tmpPrize.type === "discount" ? "chưa sử dụng" : "chờ xử lý",
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <p>Số lượt quay còn lại:{user.data?.points / 1000}</p>
          {prizes.data && (
            <Wheel onHandleSpin={onHandleSpin} segments={prizes.data} />
          )}
          <p> Lịch sử quay</p>
          {prizesUser.data &&
            prizesUser.data.map((prizeUser) => (
              <p key={prizeUser.prizeUserId}>{prizeUser.prizeName}</p>
            ))}
        </div>
      </div>
    </div>
  );
}
