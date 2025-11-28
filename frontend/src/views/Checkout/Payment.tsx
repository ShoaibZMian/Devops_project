import React, { useState, useEffect } from "react";
import { Address } from "./FormInterface";
import LoadingSpinner from "../../components/loadingspinner/LoadingSpinner";
import axios from "../../httpCommon";
import { toast } from 'react-toastify';

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
    if (value === "" || /^\d*$/.test(value)) {
      setPayment((previousPayment) => ({
        ...previousPayment,
        phoneNumber: value,
      }));
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

  const submitPayment = async () => {
    if (!acceptTerms) {
      setTermsError("You must accept the terms & conditions to proceed.");
      return;
    }

    if (paymentDetails.mobilePay && payment.phoneNumber.length !== 8) {
      setError("You must enter a valid phone number.");
      return;
    }

    if (paymentDetails.giftCard && payment.cardNumber.length !== 8) {
      setError("Card number must be 8 digits");
      return;
    }

    setShowLoading(true);

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
        toast.success("Order submitted successfully! Redirecting to home...", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });
        localStorage.removeItem("cart");
        setTimeout(() => {
          window.location.href = "/home";
        }, 2000);
      } else {
        throw new Error("Unexpected response status: " + response.status);
      }
    } catch (error) {
      console.error("Error submitting payment:", error);
      toast.error("An error occurred while submitting payment. Please try again later.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setShowLoading(false);
    }
  };

  if (cart?.length === 0) {
    return (
      <div className="min-h-screen bg-background py-8 flex items-center justify-center">
        <div className="bg-card border rounded-xl shadow-sm p-8 text-center">
          <h1 className="text-2xl font-bold text-card-foreground">Your cart is empty</h1>
          <p className="text-muted-foreground mt-2">Add some products to continue shopping</p>
        </div>
      </div>
    );
  }

  if (showLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-card-foreground mb-6">Payment</h1>

        {/* Order Summary Card */}
        <div className="bg-card border rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-semibold text-card-foreground mb-4">Order Summary</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Product</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Quantity</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Price</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-3 px-2 text-foreground">{item.name}</td>
                    <td className="py-3 px-2 text-center text-foreground">{item.quantity}</td>
                    <td className="py-3 px-2 text-right text-foreground">{item.price} DKK</td>
                    <td className="py-3 px-2 text-right text-foreground">{item.price * item.quantity} DKK</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="py-4 px-2 text-right font-bold text-lg text-card-foreground">
                    Grand Total
                  </td>
                  <td className="py-4 px-2 text-right font-bold text-lg text-primary">
                    {grandTotal} DKK
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-card border rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-semibold text-card-foreground mb-4">Payment Method</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => handleButtonClick("giftCard")}
              className={`p-4 border-2 rounded-lg flex flex-col items-center gap-3 transition-all ${
                paymentDetails.giftCard
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <img
                src="https://static.vecteezy.com/system/resources/previews/022/973/168/original/gift-card-flat-icon-shopping-gift-card-earn-points-redeem-present-box-concept-vector-illustration-png.png"
                alt="Gift Card"
                className="w-16 h-16 object-contain"
              />
              <span className="font-medium text-foreground">Gift Card</span>
            </button>

            <button
              onClick={() => handleButtonClick("mobilePay")}
              disabled={parseInt(payment.amount) >= grandTotal}
              className={`p-4 border-2 rounded-lg flex flex-col items-center gap-3 transition-all ${
                paymentDetails.mobilePay
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF7P2OcICK_NabJ2zC6tTRYCJYpLa2wnaYhjjLqQXQuA&s"
                alt="MobilePay"
                className="w-16 h-16 object-contain"
              />
              <span className="font-medium text-foreground">MobilePay</span>
            </button>

            <button
              onClick={() => handleButtonClick("invoice")}
              disabled={parseInt(payment.amount) >= grandTotal}
              className={`p-4 border-2 rounded-lg flex flex-col items-center gap-3 transition-all ${
                paymentDetails.invoice
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/5044/5044245.png"
                alt="Invoice Billing"
                className="w-16 h-16 object-contain"
              />
              <span className="font-medium text-foreground">Invoice</span>
            </button>
          </div>

          {/* Payment Details Forms */}
          {paymentDetails.giftCard && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-card-foreground">Gift Card Details</h3>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Card Number (8 digits)
                </label>
                <input
                  type="text"
                  value={payment.cardNumber}
                  onChange={handleGiftCardChange}
                  placeholder="12345678"
                  className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                    giftCardError ? "border-red-500" : ""
                  }`}
                />
                {giftCardError && <p className="text-red-500 text-sm mt-1">{giftCardError}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Amount to be paid (DKK)
                </label>
                <input
                  type="text"
                  value={payment.amount}
                  onChange={handleAmountChange}
                  placeholder="0"
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          )}

          {paymentDetails.mobilePay && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-card-foreground">MobilePay Details</h3>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Phone Number (8 digits)
                </label>
                <input
                  type="tel"
                  value={payment.phoneNumber}
                  onChange={handlePhoneNumberChange}
                  placeholder="12345678"
                  className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                    phoneNumberError ? "border-red-500" : ""
                  }`}
                />
                {phoneNumberError && <p className="text-red-500 text-sm mt-1">{phoneNumberError}</p>}
              </div>
            </div>
          )}

          {paymentDetails.invoice && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-card-foreground">Invoice Details</h3>
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Billing Address</h4>
                <p className="text-foreground">{delivery.name}</p>
                <p className="text-foreground">{delivery.country}</p>
                <p className="text-foreground">{delivery.address1}</p>
                {delivery.address2 && <p className="text-foreground">{delivery.address2}</p>}
                <p className="text-foreground">
                  {delivery.city} {delivery.zip}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Terms and Options */}
        <div className="bg-card border rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-semibold text-card-foreground mb-4">Additional Options</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
              {error}
            </div>
          )}

          {termsError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
              {termsError}
            </div>
          )}

          <div className="space-y-4">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => {
                  setAcceptTerms(e.target.checked);
                  setTermsError("");
                }}
                className="w-4 h-4 mt-1 text-primary bg-background border-gray-300 rounded focus:ring-2 focus:ring-ring"
              />
              <span className="text-sm text-foreground">
                I accept the terms & conditions <span className="text-red-500">*</span>
              </span>
            </label>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptMarketing}
                onChange={(e) => setAcceptMarketing(e.target.checked)}
                className="w-4 h-4 mt-1 text-primary bg-background border-gray-300 rounded focus:ring-2 focus:ring-ring"
              />
              <span className="text-sm text-foreground">
                I agree to receive marketing emails
              </span>
            </label>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Order Comment (Optional)
              </label>
              <textarea
                placeholder="Enter an optional order comment"
                value={orderComment}
                onChange={(e) => setOrderComment(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={submitPayment}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium text-lg"
          >
            Submit Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
