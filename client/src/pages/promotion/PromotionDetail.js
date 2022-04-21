import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import Product from "../../components/Product";
export default function PromotionDetail() {
  const promotions = useSelector((state) => state.promotions);
  const products = useSelector((state) => state.products);
  const { promotionId } = useParams();
  const [promotion, setPromotion] = useState(null);
  const [saledProducts, setSaledProducts] = useState([]);
  useEffect(() => {
    setPromotion(
      promotions.data?.find(
        (promotion) => promotion.promotionId === parseInt(promotionId)
      )
    );
  }, [promotions]);
  useEffect(() => {
    console.log(promotion);
    if (
      promotion &&
      promotion.saledProducts.length > 0 &&
      products.data.length > 0
    ) {
      setSaledProducts([
        ...promotion.saledProducts.map((saledProduct) => {
          return {
            ...products.data.find((product) => {
              return product.productId === saledProduct.productId;
            }),
            sale: saledProduct.sale,
          };
        }),
      ]);
    }
  }, [promotion, products.data]);
  return (
    <div className="pb-4">
      {promotion ? (
        <>
          <p> {promotion.promotionName}</p>
          <p>
            Bắt đầu lúc:{" "}
            {new Date(promotion.promotionStartTime).toLocaleDateString()}
          </p>
          <p>
            Kết thúc vào:{" "}
            {new Date(promotion.promotionExpTime).toLocaleDateString()}
          </p>
          <div className="container ">
            <div className="row">
              {saledProducts.length > 0 &&
                saledProducts.map((item) => {
                  console.log(saledProducts);
                  console.log(item);
                  return (
                    <Product
                      displayedAt="promotion"
                      key={item.productId}
                      product={item}
                    />
                  );
                })}
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
