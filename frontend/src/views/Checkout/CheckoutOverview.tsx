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

    if (productInCart.quantity >= productInCart.rebateQuantity) {
      productInCart.price =
        productInCart.originalPrice * (1 - productInCart.rebatePercent / 100);
    } else {
      productInCart.price = productInCart.originalPrice;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    productInCart.quantity = Math.max(1, quantity);
    setCart(cart);
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
      product.originalPrice = product.price;
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

    return (
      <div className="rebateNudge">
        {`Get a ${product.rebatePercent}% discount by ordering ${product.rebateQuantity} or more!`}
      </div>
    );
  };

  const renderUpsellNudge = (currentProductId: string) => {
    const currentProduct = cart.find((p) => p.id === currentProductId);

    if (currentProduct) {
      const upsellProduct = cart.find(
        (p) => p.id === currentProduct.upsellProductId
      );

      if (upsellProduct) {
        return (
          <div className="upsellNudge">
            {`Consider upgrading to ${upsellProduct.name} for just ${
              upsellProduct.price - currentProduct.price
            } kr more!`}
          </div>
        );
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

  const handleLoginForm = () => {
    window.location.href = '/login';
  };
  
  return (
    <FullScreenWrapper>
      <FullSizeSpaceContainer>
        <div className="container">
          {cart.length === 0 ? (
            <div>Your cart is empty</div>
          ) : (
            <div>
              <h1>Checkout Overview</h1>
              <p>
                This is the checkout overview page. Here you will see a summary
                of the products you have added to the cart.
              </p>
              <div className="cart_container">
                <div className="cart_items">
                  <ul role="list" className="cart_list">
                    <li
                      className="cart_list_item header_row"
                      style={{ fontWeight: "bold", marginBottom: "0.2rem" }}
                    >
                      <div
                        className="cart_item_column"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div className="header__detail"></div>
                        <div className="header__detail">Product Name</div>
                        <div className="header__detail">Quantity</div>
                        <div className="header__detail">Gift Wrap</div>
                        <div className="header__detail">Price</div>
                        <div className="header__detail">Remove</div>
                      </div>
                    </li>
                    <li key="test" className="cart_list_item">
                      <div className="cart_item_details_container">
                        <div>
                          <div className="cart_item_grid_container">
                            {cart.map((item) => (
                              <div
                                key={item.id}
                                className="cart_item_column"
                                style={{ marginTop: "2rem" }}
                              >
                                <div className="item__image">
                                  <img
                                    src={item?.imageUrl || ""}
                                    alt="Product"
                                    className="cart_list_image"
                                    width={50}
                                    height={50}
                                  />
                                </div>
                                <div className="item__details">
                                  <div className="product_name">
                                    {item.name}
                                    {renderQuantityNudge(item.id)}
                                    {renderUpsellNudge(item.id)}
                                  </div>
                                </div>
                                <input
                                  type="number"
                                  placeholder="Select quantity"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      item.id,
                                      parseInt(e.target.value)
                                    )
                                  }
                                  style={{
                                    width: "auto",
                                    padding: "5px",
                                    backgroundColor: "white",
                                  }}
                                />
                                <div className="item__gift_wrap">
                                  <input
                                    type="checkbox"
                                    checked={item.giftWrap}
                                    onChange={(e) =>
                                      handleGiftWrapChange(
                                        item.id,
                                        e.target.checked
                                      )
                                    }
                                  />
                                  <label> Giftwrap?</label>
                                </div>
                                <div className="item__price">
                                  {(item.price * item.quantity).toFixed(2)} kr
                                </div>
                                <button
                                  onClick={() => handleRemoveFromCart(item.id)}
                                  className="remove_button"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="cart_total">
                          <div>Total: {total.toFixed(2)} kr</div>
                        </div>
                        <br></br>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <button
                  onClick={handleLoginForm}
                className="payment-button"
              >
                Go to payment
              </button>
            </div>
          )}
        </div>
      </FullSizeSpaceContainer>
    </FullScreenWrapper>
  );
};

export default CheckoutOverview;
