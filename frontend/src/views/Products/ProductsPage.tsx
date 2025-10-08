import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/loadingspinner/LoadingSpinner";
import "../../styles/products/Products.css";
import FullScreenWrapper from "../../components/container/FullScreenWrapper";
import FullSizeSpaceContainer from "../../components/container/FullSizeSpaceContainer";
import ProductCard from "../../components/card/ProductCard";

interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  currency: string;
  rebateQuantity: number;
  rebatePercent: number;
  upsellProductId: string | null;
  imageUrl: string;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    document.title = "Products";

    const url =
      "https://raw.githubusercontent.com/larsthorup/checkout-data/main/product-v2.json";

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch products");

        return response.json();
      })
      .then((data) => {
        data.sort((a: Product, b: Product) => {
          return a.name.localeCompare(b.name);
        });

        setProducts(data);
        setShowLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleAddToCart = (productToAdd: Product, quantity: number) => {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    let productInCart = cart.find(
      (product: Product) => product.id === productToAdd.id
    );

    if (productInCart) {
      productInCart.quantity += quantity;
    } else {
      const newProduct = { ...productToAdd, quantity };
      cart.push(newProduct);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("You have added " + quantity + " " + productToAdd.name + " to cart");
  };

  return (
    <FullScreenWrapper>
      <FullSizeSpaceContainer>
        <div className="container">
          {showLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="products-container">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  price={product.price}
                  currency={product.currency}
                  onAddToCart={(quantity) => handleAddToCart(product, quantity)}
                  imageUrl={product.imageUrl}
                />
              ))}
            </div>
          )}
        </div>
      </FullSizeSpaceContainer>
    </FullScreenWrapper>
  );
};

export default ProductsPage;
