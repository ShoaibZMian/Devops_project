import React, {useEffect, useState } from "react";
import axios from '../../httpCommon';
import "../../styles/account/DashboardView.css";
import { toast } from 'react-toastify';

interface Category {
    categoryId: string;
    name: string;
    subCategory: SubCategory[];
}

interface SubCategory {
    subCategoryId: string;
    subCategoryName: string;
    product: Product[];
}

interface Product {
    productId: string;
    name : string,
    price : number,
    currency : string,
    rebateQuantity : number,
    rebatePercent : number,
    upsellProduct : string,
    subcategoryId :  number, 
    categoryId : number
}

const AdminDashboardView = () => {
    const [userCount, setUserCount] = useState(0);
    const [productCount, setProductCount] = useState(0);

    const [subCategories, setSubCategories] = useState<SubCategory []>([]); 
    const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
    const[subCategory, setSubCategory] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    
    
    const [categoryId, setCategoryId] = useState('');
    const [productCategory, setProductCategory] = useState('');

    const [productId, setProductId] = useState('');
    const [Name, setProductName] = useState('')
    const [Price, setPrice] = useState('')
    const[currency, setCurrency] = useState('')
    const [rebateQuantity, setRebateQuantity] = useState('')
    const[rebatePercent, setRebatePercent] = useState('')
    const[upsellProduct, setUpsellProduct] = useState('')
    const[subcategoryId, setSubcategoryId] = useState('')
    const [deletedProduct, setDeletedProduct] = useState('')

    const [userId, setUserId] = useState('');
    const [name, setName] = useState('')
    const [lastName, setLastname] = useState('')
    const[userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    
    useEffect(() => {
        // Fetch user data
        axios.get('/api/Admin/userCount')
            .then((response) => {
                console.log('Response data:', response.data);
                setUserCount(response.data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        // Fetch product data
        axios.get('/api/Admin/productCount')
            .then((response) => {
                console.log('Product Data:', response.data);
                setProductCount(response.data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });


            axios.get('/api/Categories/GetCategories')
                .then((response) => {
                    console.log('Categories:', response.data);
                    setCategories(response.data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            
    }
    , []);

    const getCategoryById = async (id: string) => {
        let token = sessionStorage.getItem('token');
        console.log('Token:', token);
        if (id && token) {
            try {
                axios.get(`/api/Categories/GetCategory/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                    .then ((response) => {
                        console.log('Category:', response.data);
                        const categoryData = response.data
                        setProductCategory(categoryData.name)
                        
                    })
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }
    
    const deleteCategory = async (id: string) => {
        let token = sessionStorage.getItem('token');
        console.log('Token:', token);
        if (id && token) {
            try {
                axios.delete(`/api/Categories/DeleteCategory/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                    .then ((response) => {
                        console.log('Category:', response.data);
                        const categoryData = response.data
                        setDeletedProduct(categoryData.name)
                        window.location.reload();
                        toast.success("Category Deleted")
                    })
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }
    
    const createCategory = async () => {
        let token = sessionStorage.getItem('token');
        console.log('Token:', token);
        if (token) {
            try {
                axios.post('api/Categories/CreateCategory', {
                    categoryName : productCategory,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                    .then((response) => {
                        console.log('Category:', response.data);
                        const categoryData = response.data
                        setProductCategory(categoryData.name)
                        
                        window.location.reload();
                        toast.success("Category Created")
                    })
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }
    
    
    const createSubCategory = async () => {
        let token = sessionStorage.getItem('token');
        console.log('Token:', token);
        if (token) {
            try {
                axios.post('api/SubCategories/CreateSubCategory', {
                    subCategoryName : subCategory,
                    categoryId : categoryId
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                    .then((response) => {
                        console.log('SubCategory:', response.data);
                        const subCategoryData = response.data
                        setSubCategory(subCategoryData.name)
                        
                        window.location.reload();
                        toast.success("SubCategory Created")
                    })
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }
    
    
    const getProduct = async (id: string) => {
        let token = sessionStorage.getItem('token');
        console.log('Token:', token);
        if (id && token) {
            try {
                axios.get(`/api/Products/GetProduct/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                    .then ((response) => {
                        console.log('Product:', response.data);
                        const productData = response.data
                        setProductName(productData.name)
                        setPrice(productData.price)
                        setRebateQuantity(productData.rebateQuantity)
                        setRebatePercent(productData.rebatePercent)
                        setUpsellProduct(productData.upsellProduct)
                        
                    })
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }

    const createProduct = async () => {
        console.log('Product:', Name, Price, currency, rebateQuantity, rebatePercent, upsellProduct, subcategoryId, categoryId);
        let token = sessionStorage.getItem('token');
        console.log('Token:', token);
        if (token) {
            try {
                axios.post('api/Products/CreateProduct', {
                    Name: Name,
                    Price: Price,
                    RebateQuantity: rebateQuantity,
                    RebatePercent: rebatePercent,
                    UpsellProductId: upsellProduct,
                    SubcategoryId: subcategoryId,
                    CategoryId: categoryId,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                    .then((response) => {
                        console.log('Product:', response.data);
                        const productData = response.data
                        setProductName(productData.name)
                        setPrice(productData.price)
                        setCurrency(productData.currency)
                        setRebateQuantity(productData.rebateQuantity)
                        setRebatePercent(productData.rebatePercent)
                        setUpsellProduct(productData.upsellProduct)

                        window.location.reload();
                        toast.success("Product Created")
                    })
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }

    const updateProduct = async (id: string) => {
        let token = sessionStorage.getItem('token');
        console.log('Token:', token);
        if (id && token) {
            try {
                axios.put(`/api/Products/UpdateProduct/${id}`, {
                    productId : id,
                    Name : Name,
                    Price : Price,
                    RebateQuantity : rebateQuantity,
                    RebatePercent : rebatePercent,
                    UpsellProduct : upsellProduct
                    },{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                   
                })
                    .then ((response) => {
                        console.log('Product:', response.data);
                        const productData = response.data
                        setProductName(productData.name)
                        setPrice(productData.price)
                        setRebateQuantity(productData.rebateQuantity)
                        setRebatePercent(productData.rebatePercent)
                        setUpsellProduct(productData.upsellProduct)
                        
                        window.location.reload();
                        toast.success("Product Updated")
                        
                    }
                    )
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }

const deleteProduct = async (id: string) => {
    let token = sessionStorage.getItem('token');
    console.log('Token:', token);
    if (id && token) {
        try {
            axios.delete(`/api/Products/DeleteProduct/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then ((response) => {
                    console.log('Product:', response.data);
                    const productData = response.data
                    setDeletedProduct(productData.name)
                    window.location.reload();
                    toast.success("Product Deleted")
                })
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

    const getUser = async (id: string) => {
        let token = sessionStorage.getItem('token');
        console.log('Token:', token);
        if (id && token) {
            try {
                axios.get(`/api/Admin/getUser/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                    .then ((response) => {
                        const userData = response.data
                        setName(userData.firstName)
                        setLastname(userData.lastName)
                        setUserName(userData.userName)
                        setEmail(userData.email)

                        console.log('User:', response.data);
                        
                    })
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }
    
    const handleDeleteProductClick = () => {
        deleteProduct(productId);
    }
    
    const handleGetCategoryByIdClick = () => {
        getCategoryById(productCategory);
    }
    const handleDeleteCategoryClick = () => {
        deleteCategory(productCategory);
    }
    const handleCreateCategoryClick = () => {
        createCategory();
    }
    const handleCreateSubCategoryClick = () => {
        createSubCategory();
    }
    const handleCreateProductClick = () => {
        createProduct();
    }
    const handleUpdateProductClick = () => {
        updateProduct(productId);
    }
    
    const handleGetProductClick = () => {
        getProduct(productId);
    }
    
    const handleGetUserClick = () => {
        getUser(userId);
    };
        
    return (
        <div className="usercontainer">
            <h1>Admin Dashboard</h1>
            <div className="userInformation">
                <h3>Total Users: {userCount}</h3>
                <h4>User Information</h4>
                <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter user ID"
                />
                <p>Name: {name}</p>
                <p>Last Name: {lastName}</p>
                <p>User Name: {userName}</p>
                <p>Email: {email}</p>
                <button onClick={handleGetUserClick}>Get User</button>
            </div>

            <div className="categories">
                <h4>Category Information</h4>
                <select
                    className="category"
                    onChange={(e) => setSelectedCategory(categories.find(category => category.categoryId === e.target.value) || null)}>
                    <option value="">Categories</option>
                    {categories.map((category) => (
                        <option key={category.categoryId} value={category.categoryId}>
                            {`${category.categoryId} ${category.name}`}
                        </option>

                    ))}
                </select>
                <button onClick={handleDeleteCategoryClick}>Delete Category</button>
                


                <div className="createCategory">
                    <h4>Create Category</h4>
                    <input
                        type="text"
                        value={productCategory}
                        onChange={(e) => setProductCategory(e.target.value)}
                        placeholder="Enter category name"
                    />
                    <button onClick={handleCreateCategoryClick}>Create Category</button>
                </div>

                <div className="createSubCategory">
                    <h4>Create SubCategory</h4>
                    <input
                        type="text"
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                        placeholder="Enter subcategory name"
                    />
                    <input
                        type="text"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        placeholder="Enter category ID"
                    />
                    <button onClick={handleCreateSubCategoryClick}>Create SubCategory</button>
                </div>
            </div>

            <div className="productinformation">
                <h3>Total Products: {productCount}</h3>

                <h4>Product Information</h4>
                <input
                    type="text"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    placeholder="Enter product ID"
                />

                <p>Product Name: {Name}</p>
                <p>Price: {Price}</p>
                <p>Rebate Quantity: {rebateQuantity}</p>
                <p>Rebate Percent: {rebatePercent}</p>
                <p>Upsell Product: {upsellProduct}</p>

                <button onClick={handleGetProductClick}>Get Product</button>
                <button onClick={handleDeleteProductClick}>Delete Product</button>
            </div>
            
            <div className="createProduct">
                <h4>Create Product</h4>
                <label>
                    Product Name:
                    <input
                        type="text"
                        value={Name}
                        onChange={(e) => setProductName(e.target.value)}
                    />
                </label>
                <label>
                    Price:
                    <input
                        type="text"
                        value={Price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </label>
                <label>
                    Currency:
                    <input
                        type="text"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                    />
                </label>
                <label>
                    Rebate Quantity:
                    <input
                        type="text"
                        value={rebateQuantity}
                        onChange={(e) => setRebateQuantity(e.target.value)}
                    />
                </label>
                <label>
                    Rebate Percent:
                    <input
                        type="text"
                        value={rebatePercent}
                        onChange={(e) => setRebatePercent(e.target.value)}
                    />
                </label>
                <label>
                    Upsell Product:
                    <input
                        type="text"
                        value={upsellProduct}
                        onChange={(e) => setUpsellProduct(e.target.value)}
                    />
                </label>
                <label>
                    Category Id:
                    <input
                        type="text"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                    />
                </label>
                <label>
                    Subcategory Id:
                    <input
                        type="text"
                        value={subcategoryId}
                        onChange={(e) => setSubcategoryId(e.target.value)}
                    />
                </label>
                <button onClick={handleCreateProductClick}>Create Product</button>
            </div>

            <div className="updateProduct">
                <h4>Update Product</h4>
                <input
                    type="text"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    placeholder="Enter product ID"
                />
                <label>
                    Product Name:
                    <input
                        type="text"
                        value={Name}
                        onChange={(e) => setProductName(e.target.value)}
                    />
                </label>
                <label>
                    Price:
                    <input
                        type="text"
                        value={Price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </label>
                <label>
                    Rebate Quantity:
                    <input
                        type="text"
                        value={rebateQuantity}
                        onChange={(e) => setRebateQuantity(e.target.value)}
                    />
                </label>
                <label>
                    Rebate Percent:
                    <input
                        type="text"
                        value={rebatePercent}
                        onChange={(e) => setRebatePercent(e.target.value)}
                    />
                </label>
                <label>
                    Upsell Product:
                    <input
                        type="text"
                        value={upsellProduct}
                        onChange={(e) => setUpsellProduct(e.target.value)}
                    />
                </label>
                <button onClick={handleUpdateProductClick}>Update Product</button>
                
            </div>
          
        </div>
    );
};

export default AdminDashboardView;