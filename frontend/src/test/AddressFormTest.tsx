import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import AddressForm from "../views/Checkout/AddressForm";
import "@testing-library/jest-dom";

describe("AddressForm", () => {
  it("renders correctly", () => {
    const { getByPlaceholderText } = render(<AddressForm />);
    expect(getByPlaceholderText("Name")).toBeInTheDocument();
  });

  it("updates name on input change", () => {
    const { getByPlaceholderText } = render(<AddressForm />);
    const nameInput = getByPlaceholderText("Name") as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    expect(nameInput.value).toBe("John Doe");
  });

  it("displays error when trying to proceed without complete data", () => {
    const { getByText, getByPlaceholderText, getByRole } = render(
      <AddressForm />
    );
    fireEvent.click(getByRole("button", { name: /continue to payment/i }));
    expect(getByText(/name is required/i)).toBeInTheDocument();
  });

  it("calls API on valid ZIP input and sets city", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ navn: "Copenhagen" }),
    } as Response);

    const { getByPlaceholderText } = render(<AddressForm />);
    const zipInput = getByPlaceholderText("Zip Code") as HTMLInputElement;
    fireEvent.change(zipInput, { target: { value: "1000" } });
    await waitFor(() =>
      expect(getByPlaceholderText("City").value).toBe("Copenhagen")
    );

    global.fetch.mockRestore();
  });
});
