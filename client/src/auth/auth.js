import axios from "axios";

export function authorization() {
  let token = JSON.parse(localStorage.getItem("auth"));
  if (token)
    return {
      headers: { Authorization: `Beaer ${token}` },
    };
  return {};
}
export async function getUserByToken() {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_SERVER}/auth`,
      authorization()
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    return null;
  }
}
