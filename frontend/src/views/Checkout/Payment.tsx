import React, { useState, useEffect } from "react";
import "../../styles/checkout/Payment.css";
import { Address } from "../Checkout/AddressForm";
import LoadingSpinner from "../../components/loadingspinner/LoadingSpinner";
import httpService from "../../httpCommon";

const axios = httpService()
interface IPaymentDetails {
  giftCard: boolean;
  mobilePay: boolean;
  invoice: boolean;
}

interface IPayment {
  cardNumber: string;
  amount: string;
  phoneNumber: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  rebateQuantity: number;
  rebatePercent: number;
  upsellProductId: null | string;
}

interface CartProduct extends Product {
  id: string;
  product: Product;
  quantity: number;
  giftWrap: boolean;
}

const Payment = () => {
  const [paymentDetails, setPaymentDetails] = useState<IPaymentDetails>({
    giftCard: true,
    mobilePay: false,
    invoice: false,
  });

  const [payment, setPayment] = useState<IPayment>({
    cardNumber: "",
    phoneNumber: "",
    amount: "",
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptMarketing, setAcceptMarketing] = useState(false);
  const [orderComment, setOrderComment] = useState("");
  const [termsError, setTermsError] = useState<string>("");

  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [phoneNumberError, setPhoneNumberError] = useState<string>("");
  const [AmountError, setAmountError] = useState<string>("");
  const [giftCardError, setGiftCardError] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleButtonClick = (paymentType: keyof IPaymentDetails) => {
    setPaymentDetails({
      giftCard: paymentType === "giftCard",
      mobilePay: paymentType === "mobilePay",
      invoice: paymentType === "invoice",
    });
  };

  const [cart, setCart] = useState<CartProduct[]>([]);

  useEffect(() => {
    document.title = "Payment";

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(cart);
  }, []);

  useEffect(() => {
    const total = cart.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    setGrandTotal(total);
  }, [cart]);

  const [showLoading, setShowLoading] = useState(false);

  const handlePhoneNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    // Allow changes if the value is empty or if it's a number
    if (value === "" || /^\d*$/.test(value)) {
      setPayment((previousPayment) => ({
        ...previousPayment,
        phoneNumber: value,
      }));
      // Set or clear the error message based on the length of the phone number
      setPhoneNumberError(
        value.length === 8 ? "" : "Phone number must be 8 digits"
      );
    }
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value === "" || /^\d*$/.test(value)) {
      setPayment((previousPayment) => ({ ...previousPayment, amount: value }));
      setAmountError(value.length === 6 ? "" : "");
    }
  };

  const handleGiftCardChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (value === "" || /^\d*$/.test(value)) {
      setPayment((previousPayment) => ({
        ...previousPayment,
        cardNumber: value,
      }));
      setGiftCardError(
        value.length === 8 ? "" : "Card number must be 8 digits"
      );
    }
  };

  const [delivery, setDelivery] = useState<Address>(
    sessionStorage.getItem("delivery")
      ? JSON.parse(sessionStorage.getItem("delivery") as string)
      : ({} as Address)
  );

  const HandleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptTerms) {
      setTermsError("Please accept the terms & conditions to proceed.");
      return;
    }

    if (payment.phoneNumber.length !== 8) {
      setError("Phone number must be 8 digits");
    }
    if (payment.cardNumber.length !== 8) {
      setGiftCardError("Card number must be 8 digits");
    }
    setError(null);
    window.location.href = "/AcceptTerms";
  };

  const submitPayment = async () => {
    if (!acceptTerms) {
      alert("You must accept the terms first.");
      return;
    }

    if (paymentDetails.mobilePay && payment.phoneNumber.length !== 8) {
      alert("Du skal indtaste et gyldigt telefonnummer.");
      return;
    }

    setShowLoading(true);

    // Prepare data for submission
    const dto = {
      Name: delivery.name,
      City: delivery.city,
      Address: delivery.address1,
      Phone: delivery.phone,
      Email: delivery.email,
      ZipCode: delivery.zip,
      Country: delivery.country,
      products: []
    };

    try {
      const response = await axios.post("/orderSubmit", dto);
      if (response.status === 200) {
        console.log(response.data);
        alert("Order submitted successfully!");
      } else {
        throw new Error("Unexpected response status: " + response.status);
      }
    } catch (error) {
      // Handle errors
      console.error("Error submitting payment:", error);
      alert("An error occurred while submitting payment. Please try again later.");
    }

    setShowLoading(false);

    localStorage.removeItem("cart");

    window.location.href = "/home";
    window.location.reload();
  };

  if (cart?.length === 0) {
    return <h1>Your cart is empty</h1>;
  }

  if (showLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <h1 className="h1">Payment</h1>
      <div className="paymentContainer">
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>
                    {item.price} {item.currency}
                  </td>
                  <td>
                    {item.price * item.quantity} {item.currency}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tr>
            <td colSpan={2} className="grandTotal">
              Grand Total
            </td>
            <td colSpan={2} className="grandTotal">
              {grandTotal} kr
            </td>
          </tr>
        </table>
        <br />
        <br />
        <h3>How do you want to pay?</h3>
        <div className="paymentOptions">
          <button
            className={`payButton ${paymentDetails.giftCard ? "active" : ""}`}
            onClick={() => handleButtonClick("giftCard")}
          >
            <img
              src="https://static.vecteezy.com/system/resources/previews/022/973/168/original/gift-card-flat-icon-shopping-gift-card-earn-points-redeem-present-box-concept-vector-illustration-png.png"
              alt="Gift Card"
            />
            Gift Card
          </button>
          <button
            className={`payButton ${paymentDetails.mobilePay ? "active" : ""}`}
            onClick={() => handleButtonClick("mobilePay")}
            disabled={parseInt(payment.amount) >= grandTotal}
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF7P2OcICK_NabJ2zC6tTRYCJYpLa2wnaYhjjLqQXQuA&s"
              alt="MobilePay"
            />
            MobilePay
          </button>
          <button
            className={`payButton ${paymentDetails.invoice ? "active" : ""}`}
            onClick={() => handleButtonClick("invoice")}
            disabled={parseInt(payment.amount) >= grandTotal}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/5044/5044245.png"
              alt="Invoice Billing"
            />
            Invoice Billing
          </button>
        </div>

        <div className="paymentDetails">
          {paymentDetails.giftCard && (
            <div className="Card">
              <h3>Payment : Gift Card</h3>

              <br></br>
              <form className="form">
                <label className="label">Enter 8 digit Card Number:</label>
                <br />
                <br />
                <input
                  type="text"
                  value={payment.cardNumber}
                  onChange={handleGiftCardChange}
                  placeholder="Enter your card number"
                  className={`input ${giftCardError ? "error" : ""}`}
                />
                {giftCardError && <p className="error">{giftCardError}</p>}
                <br />
                <br />

                <label className="label">Amount to be paid:</label>
                <br />
                <br />
                <input
                  type="text"
                  value={payment.amount}
                  onChange={handleAmountChange}
                  placeholder="DKK"
                  className="input"
                />
                <br />
                <br />
              </form>
            </div>
          )}
          {paymentDetails.mobilePay && (
            <div className="Card">
              <h3>Payment : MobilePay</h3>
              <form className="form">
                <label className="label">Enter your phone number:</label>
                <br />
                <br />
                <input
                  type="tel"
                  value={payment.phoneNumber}
                  onChange={handlePhoneNumberChange}
                  placeholder="Phone number"
                  className={`input ${phoneNumberError ? "error" : ""}`}
                />
                {phoneNumberError && (
                  <p className="error">{phoneNumberError}</p>
                )}
                <br />
                <br />
              </form>
            </div>
          )}

          {paymentDetails.invoice && (
            <div className="invoice">
              <h3>Payment : Invoice</h3>
              <div className="address">
                <h4 className="h4">Address</h4>
                <p className="p">{delivery.name}</p>
                <p className="p">{delivery.country}</p>
                <p className="p">{delivery.address1}</p>
                <p className="p">{delivery.address2}</p>
                <p className="p">
                  {delivery.city} {delivery.zip}
                </p>
              </div>
              <div></div>
              <table className="invoiceTable">
                <thead>
                  <tr>
                    <th style={{ backgroundColor: "white" }}>Product</th>
                    <th style={{ backgroundColor: "white" }}>Quantity</th>
                    <th style={{ backgroundColor: "white" }}>Price</th>
                    <th style={{ backgroundColor: "white" }}>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => {
                    return (
                      <tr key={item.id}>
                        <td style={{ backgroundColor: "white" }}>
                          {item.name}
                        </td>
                        <td
                          style={{
                            backgroundColor: "white",
                            alignItems: "center",
                          }}
                        >
                          {item.quantity}
                        </td>
                        <td
                          style={{
                            backgroundColor: "white",
                            alignItems: "center",
                          }}
                        >
                          {item.price * item.quantity}
                        </td>
                        <td style={{ backgroundColor: "white" }}>0 DKK</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tr>
                  <td
                    style={{ backgroundColor: "white" }}
                    colSpan={2}
                    className="grand"
                  >
                    Grand Total
                  </td>
                  <td
                    style={{ backgroundColor: "white" }}
                    colSpan={2}
                    className="grandT"
                  >
                    {grandTotal} DKK
                  </td>
                </tr>
              </table>
              <br />
              <br />
            </div>
          )}
          <div className="options">
            <div className="checkbox-container">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                />
                I accept the terms & conditions
                <span className="required-asterisk">*</span>
              </label>
              {termsError && (
                <div className="terms-error-message">{termsError}</div>
              )}
            </div>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={acceptMarketing}
                onChange={(e) => setAcceptMarketing(e.target.checked)}
              />
              I agree to receive marketing emails
            </label>
            <textarea
              placeholder="Enter an optional order comment"
              value={orderComment}
              onChange={(e) => setOrderComment(e.target.value)}
              className="textarea"
            />
          </div>
        </div>
        <div className="submit ">
          <button type="submit" onClick={submitPayment}>
            Submit Payment
          </button>
        </div>
      </div>
      <div></div>
    </>
  );
};

export default Payment;
