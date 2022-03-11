export default function sortByIntValues(arr) {
  arr.sort((a, b) => {
    if (!/\d/.test(a)) {
      return a.localeCompare(b);
    }
    const aArray = a.split(/[^0-9]+/);
    const bArray = b.split(/[^0-9]+/);
    for (let index = 0; index < aArray.length; index++) {
      const element1 = aArray[index];
      const element2 = bArray[index];
      if (parseInt(element1) > parseInt(element2)) {
        return 1;
      }
      if (parseInt(element1) < parseInt(element2)) {
        return -1;
      }
      if (index === aArray.length - 1) {
        return 0;
      }
    }
  });
  return arr;
}
