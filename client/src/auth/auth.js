export function authorization() {
  let token = JSON.parse(localStorage.getItem("auth"));
  if (token)
    return {
      headers: { Authorization: `Beaer ${token}` },
    };
  return {};
}
