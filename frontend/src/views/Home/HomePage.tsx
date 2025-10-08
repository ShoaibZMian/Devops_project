import { useEffect, useState } from "react";
import httpService from "../../httpCommon";

import '../../styles/home/Home.css';
// import ProductCard from "../../components/card/ProductCard";
import { addToCart } from "../../utility/CartUtility";


document.title = "Home";

interface Product {
  productId: string;
  name: string;
  price: number;
  rebateQuantity: number;
  rebatePercent: number;
  upsellProductId: number;
}
interface Subcategory {
  subCategoryId: number;
  subCategoryName: string;
  product: Product[];
}

interface Category {
  categoryId: number;
  name: string;
  subcategory: Subcategory[];
}

const HomeView = () => {

  const axios = httpService()
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [keywords, setKeywords] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);


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

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subCategoryId = parseInt(e.target.value);
    const selectedCategory = categories.find(category => category.subcategory.some(subcategory => subcategory.subCategoryId === subCategoryId));
    if (selectedCategory) {
      const selectedSubcategory = selectedCategory.subcategory.find(subcategory => subcategory.subCategoryId === subCategoryId);
      if (selectedSubcategory) {
        setProducts(selectedSubcategory.product);
        setSelectedSubcategory([selectedSubcategory]);
      }
    }
  };

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


  return (
    <>
      <div className="searchBar">
        <form onSubmit={handleSearch}>
          <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)}
            placeholder="Product Name..." />
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)}
            placeholder="Category..." />
          <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min Price..." />
          <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max Price..." />
          <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)}
            placeholder="Keywords..." />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Sort By...</option>
            <option value="price">Price</option>

          </select>

          <button type="submit">Search</button>

        </form>
        {categories && categories.map(category => (
          <div className="categories" key={category.categoryId}>
            <h2>{category.name}</h2>
            {category.subcategory && category.subcategory.map(subcategory => (
              <div key={subcategory.subCategoryId}>
                <h3>{subcategory.subCategoryName}</h3>
                {subcategory.product && subcategory.product.map(product => (
                  <div key={product.productId}>
                    <h4>{product.name}</h4>
                    <p>{product.price}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}

      </div>

      <div className='flex '>
        {fetchedProducts.length === 0 ? (
          <div>Loading...</div>
        ) : (
          fetchedProducts.map((product, index) => (
            <div key={product.productId}>
              <div className='card'>
                <div className='card-body'>
                  <h4 className={' text-black'}>Product Id: {product.productId}</h4>
                  <h4 className='card-title'>
                    Product name: {product.name}
                  </h4>
                  <div className='card-actions '>
                    <p>Price: {product.price}</p>
                    <p>Rebate Quantity: {product.rebateQuantity}</p>
                    <p>Rebate Percent: {product.rebatePercent}</p>
                    <p>Upsell Product Id: {product.upsellProductId}</p>
                    {/* Add other product details as needed */}
                  </div>
                  <div className='card-actions '>
                    <button
                      className='btn '
                      onClick={() => {
                        addToCart({
                          productId: product.productId,
                          name: product.name,
                          price: product.price,
                          quantity: 1
                        })
                      }}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default HomeView;
