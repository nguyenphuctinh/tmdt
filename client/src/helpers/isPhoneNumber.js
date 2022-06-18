export default function isPhoneNumber(phoneNumber) {
  let vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
  if (phoneNumber !== "") {
    if (vnf_regex.test(phoneNumber) === false) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
}
