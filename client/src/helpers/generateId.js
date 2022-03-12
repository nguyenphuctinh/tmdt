export default function generateId(arr) {
  if (arr.length === 0) return 1;
  return arr[arr.length - 1].id + 1;
}
