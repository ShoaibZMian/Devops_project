import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductsPage from "./ProductsPage";
import "@testing-library/jest-dom";

// Mock components
jest.mock("../../components/loadingspinner/LoadingSpinner", () => () => (
  <div>Loading...</div>
));
jest.mock(
  "../../components/card/ProductCard",
  () =>
    ({ name, onAddToCart }) =>
      <button onClick={() => onAddToCart(1)}>{name}</button>
);

describe("ProductsPage", () => {
  beforeAll(() => {
    global.fetch = jest.fn();
    global.localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
    };
  });

  it("displays the loading spinner initially and then renders products", async () => {
    const products = [
      {
        id: "1",
        name: "C-vitamin",
        price: 150,
        currency: "DKK",
        imageUrl: "url",
        quantity: 0,
        rebateQuantity: 2,
        rebatePercent: 25,
        upsellProductId: null,
      },
      {
        id: "2",
        name: "A-vitamin",
        price: 100,
        currency: "DKK",
        imageUrl: "url",
        quantity: 0,
        rebateQuantity: 2,
        rebatePercent: 10,
        upsellProductId: null,
      },
    ];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(products),
    });

    render(<ProductsPage />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      const productButtons = screen.getAllByRole("button");
      expect(productButtons[0]).toHaveTextContent("A-vitamin");
      expect(productButtons[1]).toHaveTextContent("C-vitamin");
    });
  });

  it("handles fetch errors by logging to the console", async () => {
    const consoleSpy = jest.spyOn(console, "error");
    fetch.mockRejectedValueOnce(new Error("Failed to fetch products"));

    render(<ProductsPage />);
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        new Error("Failed to fetch products")
      );
    });
  });

  it("adds a product to the cart", async () => {
    const products = [
      {
        id: "1",
        name: "C-vitamin",
        price: 150,
        currency: "DKK",
        imageUrl: "url",
        quantity: 0,
        rebateQuantity: 2,
        rebatePercent: 25,
        upsellProductId: null,
      },
    ];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(products),
    });
    render(<ProductsPage />);
    await waitFor(() => userEvent.click(screen.getByText("C-vitamin")));

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "cart",
      JSON.stringify([{ ...products[0], quantity: 1 }])
    );
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});
