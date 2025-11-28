import { useEffect, useState } from "react";
import axios from "../../httpCommon";
import { addToCart } from "../../utility/CartUtility";

document.title = "Home";

interface Product {
  productId: string;
  name: string;
  price: number;
  rebateQuantity: number;
  rebatePercent: number;
  upsellProductId: number;
  imageUrl?: string;
}
interface Subcategory {
  subCategoryId: number;
  subCategoryName: string;
  product: Product[];
}

interface Category {
  categoryId: number;
  name: string;
  subCategory: Subcategory[];
}

const HomeView = () => {
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [keywords, setKeywords] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});


  useEffect(() => {
    // This will run whenever the component is mounted
    fetchProductsList();

  }, [])


  useEffect(() => {
    // Fetch all categories when the component mounts
    axios.get('/api/Categories/GetCategories')
      .then(response => {
        console.log(response.data);
        setCategories(response.data);
      })
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const fetchProductsList = async () => {
    axios
      .get('/api/Products/GetProducts')
      .then((response) => {
        console.log(response.data)
        setFetchedProducts(response.data)
        console.log('response:', response.data)
        console.log('You have successfully fetched your product list.')
      })
      .catch((error) => {
        console.log(error)
      })
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .get('/api/Products/GetProducts', {
        params: {
          ProductName: productName,
          Category: category,
          MinPrice: minPrice,
          MaxPrice: maxPrice,
          Keywords: keywords,
          SortBy: sortBy,

        }
      })
      .then((response) => {
        setFetchedProducts(response.data)
        console.log(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const getQuantity = (productId: string) => {
    return quantities[productId] || 1;
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    setQuantities({
      ...quantities,
      [productId]: newQuantity < 1 ? 1 : newQuantity
    });
  };


  return (
    <>
      {/* Search Section */}
      <div className="mb-8 border-b pb-6">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Product Name..."
            className="flex-1 min-w-[150px] px-4 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category..."
            className="flex-1 min-w-[150px] px-4 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min Price..."
            className="w-32 px-4 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max Price..."
            className="w-32 px-4 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="Keywords..."
            className="flex-1 min-w-[150px] px-4 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Sort By...</option>
            <option value="price">Price</option>
          </select>
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
          >
            Search
          </button>
        </form>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!Array.isArray(fetchedProducts) || fetchedProducts.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">Loading...</div>
        ) : (
          fetchedProducts.map((product) => (
            <div
              key={product.productId}
              className="bg-card border rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
            >
              {product.imageUrl && (
                <div className="w-full h-48 overflow-hidden bg-white flex items-center justify-center">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <h4 className="text-sm text-muted-foreground mb-2">
                  Product ID: {product.productId}
                </h4>
                <h4 className="text-xl font-semibold text-card-foreground mb-4">
                  {product.name}
                </h4>
                <div className="space-y-2 mb-4 text-sm flex-1">
                  <p className="text-2xl font-bold text-primary">${product.price}</p>
                  <p className="text-muted-foreground">Rebate Quantity: {product.rebateQuantity}</p>
                  <p className="text-muted-foreground">Rebate Percent: {product.rebatePercent}%</p>
                  <p className="text-muted-foreground">Upsell Product ID: {product.upsellProductId}</p>
                </div>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <button
                    onClick={() => handleQuantityChange(product.productId, getQuantity(product.productId) - 1)}
                    className="h-8 w-8 border rounded-md bg-background text-foreground hover:bg-muted transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={getQuantity(product.productId)}
                    onChange={(e) => handleQuantityChange(product.productId, parseInt(e.target.value) || 1)}
                    className="w-16 text-center border rounded-md px-2 py-1 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    onClick={() => handleQuantityChange(product.productId, getQuantity(product.productId) + 1)}
                    className="h-8 w-8 border rounded-md bg-background text-foreground hover:bg-muted transition-colors"
                  >
                    +
                  </button>
                </div>
                <button
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
                  onClick={() => {
                    addToCart({
                      productId: product.productId,
                      name: product.name,
                      price: product.price,
                      quantity: getQuantity(product.productId)
                    })
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default HomeView;
