export function isValidZip(zip: string): boolean {
  return /^\d{4}$/.test(zip);
}

export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validateVAT(vat: string, country: string): boolean {
  if (country === "Denmark") {
    const regex = /^\d{8}$/;
    return regex.test(vat.trim());
  }
  return true;
}

export function validatePhoneNumber(phone: string, country: string): boolean {
  if (country === "Denmark") {
    const regex = /^\d{8}$/;
    return regex.test(phone.trim());
  }
  return true;
}
