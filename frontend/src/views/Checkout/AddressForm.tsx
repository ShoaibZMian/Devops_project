import React, { useState, useEffect } from "react";
import axios from "../../httpCommon";
import { validatePhoneNumber } from "./FormValidation";
import { validateEmail } from "./FormValidation";
import { validateVAT } from "./FormValidation";
import { isValidZip } from "./FormValidation";
import { Address } from "./FormInterface";
import { Country } from "./FormInterface";

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

  // Fetch saved address when component mounts
  useEffect(() => {
    const fetchSavedAddress = async () => {
      try {
        const response = await axios.get('/api/UserAddress/GetAddress');
        if (response.data) {
          const savedAddress = response.data;

          setDelivery({
            country: savedAddress.deliveryCountry || "Denmark",
            zip: savedAddress.deliveryZip || "",
            city: savedAddress.deliveryCity || "",
            address1: savedAddress.deliveryAddress1 || "",
            address2: savedAddress.deliveryAddress2 || "",
            name: savedAddress.deliveryName || "",
            phone: savedAddress.deliveryPhone || "",
            email: savedAddress.deliveryEmail || "",
            company: savedAddress.deliveryCompany || "",
            vat: savedAddress.deliveryVat || "",
            countryCode: savedAddress.deliveryCountryCode || "",
          });

          if (savedAddress.isBillingDifferent) {
            setIsBillingDifferent(true);
            setBilling({
              country: savedAddress.billingCountry || "Denmark",
              zip: savedAddress.billingZip || "",
              city: savedAddress.billingCity || "",
              address1: savedAddress.billingAddress1 || "",
              address2: savedAddress.billingAddress2 || "",
              name: savedAddress.billingName || "",
              phone: savedAddress.billingPhone || "",
              email: savedAddress.billingEmail || "",
              company: savedAddress.billingCompany || "",
              vat: savedAddress.billingVat || "",
              countryCode: savedAddress.billingCountryCode || "",
            });
          }
        }
      } catch (error: any) {
        if (error.response?.status !== 404) {
          console.error('Error fetching saved address:', error);
        }
      }
    };

    fetchSavedAddress();
  }, []);

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

  const handlePayment = async (e: React.FormEvent) => {
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

    if (isBillingDifferent) {
      if (!billing.name) {
        setError("Billing name is required");
        return;
      }
      if (!billing.zip) {
        setError("Billing zip is required");
        return;
      }
      if (!billing.address1) {
        setError("Billing address is required");
        return;
      }
      if (!billing.phone) {
        setError("Billing phone is required");
        return;
      }
      if (!billing.email) {
        setError("Billing email is required");
        return;
      }

      if (!validatePhoneNumber(billing.phone, billing.country)) {
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

    // Save address to backend
    try {
      await axios.post('/api/UserAddress/SaveAddress', {
        deliveryCountry: delivery.country,
        deliveryZip: delivery.zip,
        deliveryCity: delivery.city,
        deliveryAddress1: delivery.address1,
        deliveryAddress2: delivery.address2,
        deliveryName: delivery.name,
        deliveryPhone: delivery.phone,
        deliveryEmail: delivery.email,
        deliveryCompany: delivery.company,
        deliveryVat: delivery.vat,
        deliveryCountryCode: delivery.countryCode,
        isBillingDifferent: isBillingDifferent,
        billingCountry: isBillingDifferent ? billing.country : null,
        billingZip: isBillingDifferent ? billing.zip : null,
        billingCity: isBillingDifferent ? billing.city : null,
        billingAddress1: isBillingDifferent ? billing.address1 : null,
        billingAddress2: isBillingDifferent ? billing.address2 : null,
        billingName: isBillingDifferent ? billing.name : null,
        billingPhone: isBillingDifferent ? billing.phone : null,
        billingEmail: isBillingDifferent ? billing.email : null,
        billingCompany: isBillingDifferent ? billing.company : null,
        billingVat: isBillingDifferent ? billing.vat : null,
        billingCountryCode: isBillingDifferent ? billing.countryCode : null,
      });
    } catch (error) {
      console.error('Error saving address:', error);
    }

    window.location.href = "/checkout/payment";
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-card-foreground mb-6">Delivery Information</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handlePayment}>
          {/* Delivery Address Card */}
          <div className="bg-card border rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-2xl font-semibold text-card-foreground mb-4">Delivery Address</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Name *</label>
                <input
                  type="text"
                  value={delivery.name}
                  onChange={(e) => {
                    setDelivery({ ...delivery, name: e.target.value });
                    setError(null);
                  }}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Full Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Country *</label>
                <select
                  value={delivery.country}
                  onChange={(e) => {
                    setDelivery({ ...delivery, country: e.target.value });
                    setError(null);
                  }}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {countries.map((country) => (
                    <option
                      key={country.alpha2Code}
                      value={country.name}
                      disabled={country.name === "Sweden" || country.name === "Norway"}
                    >
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Zip Code *</label>
                <input
                  type="number"
                  value={delivery.zip}
                  onChange={(e) => handleZipChange(e, "delivery")}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="1234"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">City *</label>
                <input
                  type="text"
                  value={delivery.city}
                  readOnly
                  className="w-full px-3 py-2 border rounded-md bg-muted text-foreground"
                  placeholder="Auto-filled from zip"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-1">Address *</label>
                <input
                  type="text"
                  value={delivery.address1}
                  onChange={(e) => {
                    setDelivery({ ...delivery, address1: e.target.value });
                    setError(null);
                  }}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Street name, number, etc."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-1">Address 2 (Optional)</label>
                <input
                  type="text"
                  value={delivery.address2}
                  onChange={(e) => {
                    setDelivery({ ...delivery, address2: e.target.value });
                    setError(null);
                  }}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Apartment, suite, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Phone *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={countryCode}
                    readOnly
                    className="w-20 px-3 py-2 border rounded-md bg-muted text-foreground"
                  />
                  <input
                    type="text"
                    value={delivery.phone}
                    onChange={(e) => handlePhoneChange(e, "delivery")}
                    className="flex-1 px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="12345678"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Email *</label>
                <input
                  type="email"
                  value={delivery.email}
                  onChange={(e) => {
                    setDelivery({ ...delivery, email: e.target.value });
                    setError(null);
                  }}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Company (Optional)</label>
                <input
                  type="text"
                  value={delivery.company}
                  onChange={(e) => {
                    setDelivery({ ...delivery, company: e.target.value });
                    setError(null);
                  }}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Company Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">VAT (Optional)</label>
                <input
                  type="text"
                  value={delivery.vat}
                  onChange={(e) => {
                    handleVatChange(e, "delivery");
                    setError(null);
                  }}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="DK12345678"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBillingDifferent}
                  onChange={() => setIsBillingDifferent(!isBillingDifferent)}
                  className="w-4 h-4 text-primary bg-background border-gray-300 rounded focus:ring-2 focus:ring-ring"
                />
                <span className="text-sm text-foreground font-medium">Billing address is different from delivery address</span>
              </label>
            </div>
          </div>

          {/* Billing Address Card (if different) */}
          {isBillingDifferent && (
            <div className="bg-card border rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">Billing Address</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Name *</label>
                  <input
                    type="text"
                    value={billing.name}
                    onChange={(e) => {
                      setBilling({ ...billing, name: e.target.value });
                      setError(null);
                    }}
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Full Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Country *</label>
                  <select
                    value={billing.country}
                    onChange={(e) => {
                      setBilling({ ...billing, country: e.target.value });
                      setError(null);
                    }}
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {countries.map((country) => (
                      <option key={country.alpha2Code} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Zip Code *</label>
                  <input
                    type="number"
                    value={billing.zip}
                    onChange={(e) => handleZipChange(e, "billing")}
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="1234"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">City *</label>
                  <input
                    type="text"
                    value={billing.city}
                    onChange={(e) => {
                      setBilling({ ...billing, city: e.target.value });
                      setError(null);
                    }}
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="City"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Address *</label>
                  <input
                    type="text"
                    value={billing.address1}
                    onChange={(e) => {
                      setBilling({ ...billing, address1: e.target.value });
                      setError(null);
                    }}
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Street name, number, etc."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Address 2 (Optional)</label>
                  <input
                    type="text"
                    value={billing.address2}
                    onChange={(e) => {
                      setBilling({ ...billing, address2: e.target.value });
                      setError(null);
                    }}
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Apartment, suite, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Phone *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={countryCode}
                      readOnly
                      className="w-20 px-3 py-2 border rounded-md bg-muted text-foreground"
                    />
                    <input
                      type="text"
                      value={billing.phone}
                      onChange={(e) => handlePhoneChange(e, "billing")}
                      className="flex-1 px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="12345678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Email *</label>
                  <input
                    type="email"
                    value={billing.email}
                    onChange={(e) => {
                      setBilling({ ...billing, email: e.target.value });
                      setError(null);
                    }}
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Company (Optional)</label>
                  <input
                    type="text"
                    value={billing.company}
                    onChange={(e) => {
                      setBilling({ ...billing, company: e.target.value });
                      setError(null);
                    }}
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Company Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">VAT (Optional)</label>
                  <input
                    type="text"
                    value={billing.vat}
                    onChange={(e) => handleVatChange(e, "billing")}
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="DK12345678"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium text-lg"
            >
              Continue to Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;
