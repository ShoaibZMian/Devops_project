import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";

interface ProductCardProps {
  name: string;
  price: number;
  currency: string;
  onAddToCart: (quantity: number) => void;
  imageUrl: string;
}

const ProductCard = (props: ProductCardProps) => {
  const { imageUrl, name, price, currency } = props;
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity < 1 ? 1 : newQuantity);
  };

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4">
          {imageUrl && (
            <div className="w-full h-48 flex items-center justify-center overflow-hidden rounded-md bg-muted">
              <img
                loading="lazy"
                src={imageUrl}
                alt={name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          )}
          <h2 className="text-xl font-semibold text-center text-card-foreground">
            {name}
          </h2>
          <div className="text-2xl font-bold text-primary">
            {price} {currency}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Button
              onClick={() => handleQuantityChange(quantity - 1)}
              variant="outline"
              size="icon"
              className="h-8 w-8"
            >
              -
            </Button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
              className="w-16 text-center border rounded-md px-2 py-1 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button
              onClick={() => handleQuantityChange(quantity + 1)}
              variant="outline"
              size="icon"
              className="h-8 w-8"
            >
              +
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          onClick={() => props.onAddToCart(quantity)}
          className="w-full"
          size="lg"
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
