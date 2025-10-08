import React, { useCallback, useEffect, useState } from "react";
import "../../styles/products/ProductCard.css";
import { get } from "http";

interface ProductCardProps {
  name: string;
  price: number;
  currency: string;
  onAddToCart: (quantity: number) => void;
  imageUrl: string;
}

const ProductCard = (props: ProductCardProps) => {
  const { imageUrl } = props;
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity < 1 ? 1 : newQuantity);
  };

  return (
    <div className="product-card" style={{ minHeight: "450px" }}>
      <div
        className="content"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: "20px",
        }}
      >
        {imageUrl && (
          <img
            loading="lazy"
            src={props.imageUrl}
            alt={props.name}
            height={100}
            width={100}
            style={{ maxHeight: "100px", maxWidth: "200px" }}
          />
        )}
        <h2>{props.name}</h2>
        <div className="price">
          {props.price} {props.currency}
        </div>
        <div className="quantity-controls">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            className="minus-btn"
          >
            -
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
            className="quantity-input"
          />
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            className="plus-btn"
          >
            +
          </button>
        </div>
      </div>
      <button
        onClick={() => props.onAddToCart(quantity)}
        className="add-to-cart-btn"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
