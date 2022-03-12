export default function searchProductFitler(arr, q) {
  return arr.filter((product) => {
    let ok = 1;
    const words = q.split(" ");
    words.forEach((word) => {
      if (
        product.productName.toLowerCase().indexOf(word.toLowerCase()) === -1
      ) {
        ok = 0;
      }
    });
    return ok;
  });
}
