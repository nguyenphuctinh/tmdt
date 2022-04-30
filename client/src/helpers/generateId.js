export default function generateId(arr) {
  if (arr.length === 0) return 1;
  return arr[arr.length - 1].id + 1;
}
export const generateEntityId = (type, stt) => {
  var str = "" + stt;
  var pad = "0000";
  return type + pad.substring(0, pad.length - str.length) + str;
};
