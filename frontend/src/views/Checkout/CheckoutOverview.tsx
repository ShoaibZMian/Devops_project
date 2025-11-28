import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FullScreenWrapper from "../../components/container/FullScreenWrapper";
import FullSizeSpaceContainer from "../../components/container/FullSizeSpaceContainer";
import LoadingSpinner from "../../components/loadingspinner/LoadingSpinner";
import "../../styles/checkout/CheckoutOverview.css";

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  rebateQuantity: number;
  rebatePercent: number;
  upsellProductId: null | string;
  originalPrice: number;
  imageUrl: string;
}

interface CartProduct extends Product {
  id: string;
  product: Product;
  quantity: number;
  giftWrap: boolean;
}

const CheckoutOverview = () => {
  const [cart, setCart] = useState<CartProduct[]>([]);

  const [total, setTotal] = useState<number>(0.0);

  const [showLoading, setShowLoading] = useState(true);

  const navigate = useNavigate();

  const handleQuantityChange = (id: string, quantity: number) => {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    let productInCart = cart.find((product: CartProduct) => product.id === id);

    if (!productInCart) return;

    // Update quantity first
    productInCart.quantity = Math.max(1, quantity);

    // Then calculate price based on new quantity
    if (productInCart.rebateQuantity && productInCart.rebatePercent && productInCart.originalPrice) {
      if (productInCart.quantity >= productInCart.rebateQuantity) {
        productInCart.price =
          productInCart.originalPrice * (1 - productInCart.rebatePercent / 100);
      } else {
        productInCart.price = productInCart.originalPrice;
      }
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setCart([...cart]);
  };

  const handleGiftWrapChange = (id: string, giftWrap: boolean) => {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    let productInCart = cart.find((product: CartProduct) => product.id === id);

    if (productInCart) {
      productInCart.giftWrap = giftWrap;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setCart(cart);
  };

  const handleRemoveFromCart = (id: string) => {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    let updatedCart = cart.filter((product: CartProduct) => product.id !== id);

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  useEffect(() => {
    document.title = "Checkout";

    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.forEach((product: CartProduct) => {
      // Only set originalPrice if it doesn't exist
      if (!product.originalPrice) {
        product.originalPrice = product.price;
      }

      // Apply rebate if quantity meets threshold
      if (product.rebateQuantity && product.rebatePercent && product.originalPrice) {
        if (product.quantity >= product.rebateQuantity) {
          product.price = product.originalPrice * (1 - product.rebatePercent / 100);
        } else {
          product.price = product.originalPrice;
        }
      }
    });

    setCart(cart);
    localStorage.setItem("cart", JSON.stringify(cart));

    let total = 0.0;

    cart.forEach((product: CartProduct) => {
      total += product.quantity * product.price;
    });

    setTotal(total);
    setShowLoading(false);
  }, []);

  const renderQuantityNudge = (productId: string) => {
    if (!cart) return null;

    const product = cart.find((p) => p.id === productId);
    if (!product || product.rebateQuantity <= 1) return null;

    return `Get a ${product.rebatePercent}% discount by ordering ${product.rebateQuantity} or more!`;
  };

  const renderUpsellNudge = (currentProductId: string) => {
    const currentProduct = cart.find((p) => p.id === currentProductId);

    if (currentProduct) {
      const upsellProduct = cart.find(
        (p) => p.id === currentProduct.upsellProductId
      );

      if (upsellProduct) {
        return `Consider upgrading to ${upsellProduct.name} for just ${
          (upsellProduct.price - currentProduct.price).toFixed(2)
        } DKK more!`;
      }
    }
    return null;
  };

  useEffect(() => {
    let newTotal = 0.0;
    cart.forEach((product: CartProduct) => {
      newTotal += product.quantity * product.price;
    });
    setTotal(newTotal);
  }, [cart]);

  if (showLoading) {
    return <LoadingSpinner />;
  }

  const handleProceedToCheckout = () => {
    navigate('/checkout/address');
  };
  
  return (
    <FullScreenWrapper>
      <FullSizeSpaceContainer>
        <div className="max-w-7xl mx-auto px-4 py-8">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold text-muted-foreground mb-4">Your cart is empty</h2>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-bold text-card-foreground mb-2">Shopping Cart</h1>
              <p className="text-muted-foreground mb-8">
                Review your items and proceed to checkout
              </p>

              {/* Cart Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-card border rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
                  >
                    {/* Product Image */}
                    {item.imageUrl && (
                      <div className="w-full h-48 overflow-hidden bg-white flex items-center justify-center">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    {/* Product Details */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h4 className="text-xl font-semibold text-card-foreground mb-2">
                        {item.name}
                      </h4>
                      <p className="text-2xl font-bold text-primary mb-4">
                        {item.price} DKK
                      </p>

                      {/* Nudges */}
                      {renderQuantityNudge(item.id) && (
                        <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
                          {renderQuantityNudge(item.id)}
                        </div>
                      )}
                      {renderUpsellNudge(item.id) && (
                        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
                          {renderUpsellNudge(item.id)}
                        </div>
                      )}

                      {/* Quantity Selector */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                          Quantity
                        </label>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="h-8 w-8 border rounded-md bg-background text-foreground hover:bg-muted transition-colors"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                            className="w-16 text-center border rounded-md px-2 py-1 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="h-8 w-8 border rounded-md bg-background text-foreground hover:bg-muted transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Gift Wrap */}
                      <div className="mb-4 flex items-center justify-center gap-2">
                        <input
                          type="checkbox"
                          id={`giftwrap-${item.id}`}
                          checked={item.giftWrap}
                          onChange={(e) => handleGiftWrapChange(item.id, e.target.checked)}
                          className="w-4 h-4 text-primary bg-background border-gray-300 rounded focus:ring-2 focus:ring-ring"
                        />
                        <label htmlFor={`giftwrap-${item.id}`} className="text-sm text-muted-foreground">
                          Add gift wrap
                        </label>
                      </div>

                      {/* Subtotal */}
                      <div className="text-center mb-4 p-3 bg-muted rounded-md">
                        <span className="text-sm text-muted-foreground">Subtotal: </span>
                        <span className="text-lg font-bold text-primary">
                          {(item.price * item.quantity).toFixed(2)} DKK
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors font-medium"
                      >
                        Remove from Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="bg-card border rounded-xl shadow-sm p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-card-foreground">Order Total</h2>
                  <p className="text-3xl font-bold text-primary">{total.toFixed(2)} DKK</p>
                </div>
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium text-lg"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </FullSizeSpaceContainer>
    </FullScreenWrapper>
  );
};

export default CheckoutOverview;
