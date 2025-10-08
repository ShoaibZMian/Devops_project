export interface Country {
  alpha2Code: string; //represent countries and regions.
  name: string;
  code: string;
}

export interface Address {
  country: string;
  zip: string;
  city: string;
  address1: string;
  address2: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  vat: string;
  countryCode: string;
}
export interface AddressFormState {
  delivery: Address;
  billing: Address;
  isBillingDifferent: boolean;
}
