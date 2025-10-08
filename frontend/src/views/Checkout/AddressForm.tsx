import React, { useState, useEffect } from "react";
import "../../styles/checkout/Addressform.css";
import { validatePhoneNumber } from "./FormValidation";
import { validateEmail } from "./FormValidation";
import { validateVAT } from "./FormValidation";
import { isValidZip } from "./FormValidation";
import { Address } from "./FormInterface";
import { Country } from "./FormInterface";
import FullScreenWrapper from "../../components/container/FullScreenWrapper";
import FullSizeSpaceContainer from "../../components/container/FullSizeSpaceContainer";

// define the AddressForm  functional component
const AddressForm: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([
    { alpha2Code: "DK", name: "Denmark", code: "+45" },
    { alpha2Code: "SE", name: "Sweden", code: "+46" },
    { alpha2Code: "NO", name: "Norway", code: "+47" },
  ]);
  const [isBillingDifferent, setIsBillingDifferent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countryCode, setFullPhone] = useState("");

  const [delivery, setDelivery] = useState<Address>({
    country: "Denmark",
    zip: "",
    city: "",
    address1: "",
    address2: "",
    name: "",
    phone: "",
    email: "",
    company: "",
    vat: "",
    countryCode: "",
  });

  const [billing, setBilling] = useState<Address>({
    country: "Denmark",
    zip: "",
    city: "",
    address1: "",
    address2: "",
    name: "",
    phone: "",
    email: "",
    company: "",
    vat: "",
    countryCode: "",
  });

  useEffect(() => {
    const selectedCountry = countries.find(
      (country) => country.name === delivery.country
    );
    if (selectedCountry) {
      setFullPhone(`${selectedCountry.code}`);
    }
  }, [delivery.country, delivery.phone, countries]);

  const handleZipChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const zip = e.target.value;

    if (zip.length > 4) {
      return;
    }

    if (type === "delivery") {
      setDelivery((prevState) => ({ ...prevState, zip }));
    } else {
      setBilling((prevState) => ({ ...prevState, zip }));
    }
    if (isValidZip(zip)) {
      try {
        const response = await fetch(
          `https://api.dataforsyningen.dk/postnumre/${zip}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        if (data.navn) {
          const city = data.navn;
          if (type === "delivery") {
            setDelivery((prevState) => ({
              ...prevState,
              city: city,
            }));
          } else {
            setBilling((prevState) => ({
              ...prevState,
              city: city,
            }));
          }
        } else {
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const phone = e.target.value;

    if (type === "delivery") {
      setDelivery((prevState) => ({ ...prevState, phone }));
    } else {
      setBilling((prevState) => ({ ...prevState, phone }));
    }
  };
  const handleVatChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const vat = e.target.value;

    if (type === "delivery") {
      setDelivery((prevState) => ({ ...prevState, vat }));
    } else {
      setBilling((prevState) => ({ ...prevState, vat }));
    }
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!delivery.name) {
      setError("Name is required");
      return;
    }
    if (!delivery.zip) {
      setError("Zip is required");
      return;
    }

    if (!delivery.address1) {
      setError("Address1 is required");
      return;
    }
    if (!delivery.phone) {
      setError("Phone is required");
      return;
    }
    if (!delivery.email) {
      setError("Email is required");
      return;
    }

    if (!validatePhoneNumber(delivery.phone, delivery.country)) {
      setError("Invalid delivery phone number");
      return;
    }
    if (!validateEmail(delivery.email)) {
      setError("Invalid delivery email");
      return;
    }
    // if  (delivery.country === 'Denmark' && !validateVAT(delivery.vat, delivery.country)) {
    //     setError('Invalid delivery VAT');
    //     return;
    // }
    if (isBillingDifferent) {
      if (!billing.name) {
        setError("Name is required");
        return;
      }
      if (!billing.zip) {
        setError("Zip is required");
        return;
      }
      if (!billing.address1) {
        setError("Address1 is required");
        return;
      }
      if (!billing.phone) {
        setError("Phone is required");
        return;
      }
      if (!billing.email) {
        setError("Email is required");
        return;
      }

      if (
        isBillingDifferent &&
        !validatePhoneNumber(billing.phone, billing.country)
      ) {
        setError("Invalid billing phone number");
        return;
      }
      if (!validateEmail(billing.email)) {
        setError("Invalid billing email");
        return;
      }
      if (
        billing.country === "Denmark" &&
        !validateVAT(billing.vat, billing.country)
      ) {
        setError("Invalid billing VAT");
        return;
      }
    }
    sessionStorage.setItem("delivery", JSON.stringify(delivery));
    setError(null);
    window.location.href = "/checkout/payment";
  };

  return (
    <FullScreenWrapper>
    <FullSizeSpaceContainer>
    <div className="form-address-card">
      <h4 className="form-address-card-header">Delivery Address</h4>
      <form className="form-card">
        <div>
          <input
            id="name"
            name="name"
            value={delivery.name}
            className="form-input-two"
            placeholder="Name"
            onChange={(e) => {
              setDelivery({ ...delivery, name: e.target.value });
              setError(null);
            }}
          />
          <select
            className="form-input-two"
            value={delivery.country}
            onChange={(e) => {
              setDelivery({ ...delivery, country: e.target.value });
              setError(null);
            }}
          >
            {countries.map((country) => (
              <option
                key={country.alpha2Code}
                value={country.name}
                disabled={
                  country.name === "Sweden" || country.name === "Norway"
                }
              >
                {country.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <input
            type="number"
            value={delivery.zip}
            className="form-input-two"
            placeholder="Zip Code"
            onChange={(e) => handleZipChange(e, "delivery")}
          />
          <input
            type="text"
            value={delivery.city}
            placeholder="City"
            className="form-input-two"
          />
        </div>
        <div>
          <label htmlFor="address1">Address 1</label>
          <input
            id="address1"
            name="address1"
            value={delivery.address1}
            className="form-input"
            placeholder="street name , number , etc"
            onChange={(e) => {
              setDelivery({ ...delivery, address1: e.target.value });
              setError(null);
            }}
          />
        </div>
        <div>
          <label htmlFor="address2">Address 2</label>
          <input
            id="address2"
            name="address2"
            value={delivery.address2}
            className="form-input"
            placeholder="Apartment, suite, etc. (optional)"
            onChange={(e) => {
              setDelivery({ ...delivery, address2: e.target.value });
              setError(null);
            }}
          />
        </div>

        <div>
          <input
            id="countryCode"
            name="countryCode"
            value={countryCode}
            readOnly
            className="form-input-code"
          />

          <input
            id="phone"
            name="phone"
            value={delivery.phone}
            className="form-input-phone"
            placeholder="Phone"
            onChange={(e) => handlePhoneChange(e, "delivery")}
          />
        </div>
        <div>
          <input
            id="email"
            name="email"
            value={delivery.email}
            className="form-input"
            placeholder="Email"
            onChange={(e) => {
              setDelivery({ ...delivery, email: e.target.value });
              setError(null);
            }}
          />
        </div>
        <div>
          <input
            id="company"
            name="company"
            value={delivery.company}
            className="form-input-two"
            placeholder="Company"
            onChange={(e) => {
              setDelivery({ ...delivery, company: e.target.value });
              setError(null);
            }}
          />

          <input
            id="vat"
            name="vat"
            value={delivery.vat}
            className="form-input-two"
            placeholder="VAT"
            onChange={(e) => {
              handleVatChange(e, "delivery");
              setError(null);
            }}
          />
        </div>
        <div>
          <label
            htmlFor="isBillingDifferent"
            style={{
              marginRight: "10px",
              marginTop: "20px",
              fontSize: "18px",
              fontWeight: "bold",
              color: "Black",
            }}
          >
            Is billing address different?
          </label>

          <input
            id="isBillingDifferent"
            name="isBillingDifferent"
            type="checkbox"
            checked={isBillingDifferent}
            onChange={() => setIsBillingDifferent(!isBillingDifferent)}
          />
        </div>
        <br></br>
        {isBillingDifferent && (
          <div>
            <h4>Billing address </h4>
            <br></br>
            <div>
              <input
                id="name"
                name="name"
                value={billing.name}
                className="form-input-two"
                placeholder="Name"
                onChange={(e) => {
                  setBilling({ ...billing, name: e.target.value });
                  setError(null);
                }}
              />
              <select
                id="country"
                name="country"
                value={billing.country}
                className="form-input-two"
                aria-placeholder="Country"
                onChange={(e) => {
                  setBilling({ ...billing, country: e.target.value });
                  setError(null);
                }}
              >
                {countries.map((country) => (
                  <option key={country.alpha2Code} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <input
                id="zip"
                name="zip"
                type="number"
                value={billing.zip}
                className="form-input-two"
                placeholder="Zip Code"
                onChange={(e) => handleZipChange(e, "billing")}
              />
              <input
                id="city"
                name="city"
                value={billing.city}
                className="form-input-two"
                placeholder="City"
                onChange={(e) => {
                  setBilling({ ...billing, city: e.target.value });
                  setError(null);
                }}
              />
            </div>
            <div>
              <label htmlFor="address1">Address 1</label>
              <input
                id="address1"
                name="address1"
                value={billing.address1}
                className="form-input"
                placeholder="street name , number , etc"
                onChange={(e) => {
                  setBilling({ ...billing, address1: e.target.value });
                  setError(null);
                }}
              />
            </div>
            <div>
              <label htmlFor="address2">Address 2</label>
              <input
                id="address2"
                name="address2"
                value={billing.address2}
                className="form-input"
                placeholder="Apartment, suite, etc. (optional)"
                onChange={(e) => {
                  setBilling({ ...billing, address2: e.target.value });
                  setError(null);
                }}
              />
            </div>

            <div>
              <input
                id="countryCode"
                name="countryCode"
                value={countryCode}
                readOnly
                className="form-input-code"
                placeholder="Phone"
              />
              <input
                id="phone"
                name="phone"
                value={billing.phone}
                className="form-input-phone"
                placeholder="Phone"
                onChange={(e) => handlePhoneChange(e, "billing")}
              />
            </div>
            <div>
              <input
                id="email"
                name="email"
                value={billing.email}
                className="form-input"
                placeholder="Email"
                onChange={(e) => {
                  setBilling({ ...billing, email: e.target.value });
                  setError(null);
                }}
              />
            </div>
            <div>
              <input
                id="company"
                name="company"
                value={billing.company}
                className="form-input-two"
                placeholder="Company"
                onChange={(e) => {
                  setBilling({ ...billing, company: e.target.value });
                  setError(null);
                }}
              />

              <input
                id="vat"
                name="vat"
                value={billing.vat}
                className="form-input-two"
                placeholder="VAT"
                onChange={(e) => handleVatChange(e, "billing")}
              />
              {error && error.includes("vat") && (
                <p style={{ color: "red" }}>{error}</p>
              )}
            </div>
          </div>
        )}
      </form>
      <div className="">
        {error && (
          <div>
            <p style={{ color: "red" }}>{error}</p>
          </div>
        )}
        <button
          className="payment-button"
          type="submit"
          onClick={handlePayment}
        >
          Continue to payment
        </button>
      </div>
        </div>
      
   
      </FullSizeSpaceContainer >
    </FullScreenWrapper>
      );
      };




export default AddressForm;
