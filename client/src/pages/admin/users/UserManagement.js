import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllUsers } from "../../../redux/slices/userListSlice";
import UserTable from "./UserTable";

export default function UserManagement() {
  const dispatch = useDispatch();
  let users = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          {users.data && <UserTable rows={users.data} />}
        </div>
      </div>
    </div>
  );
}
