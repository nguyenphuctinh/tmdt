export function authorization() {
  let token = JSON.parse(localStorage.getItem("token"));
  if (token)
    return {
      headers: { Authorization: `Beaer ${token}` },
    };
  return {};
}
