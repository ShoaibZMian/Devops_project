import React, {useEffect, useState } from "react";
import axios from '../../httpCommon';
import "../../styles/account/DashboardView.css";
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';

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
    imageUrl?: string,
    subcategoryId :  number,
    categoryId : number
}

const AdminDashboardView = () => {
    // Get auth state from context
    const { token } = useAuth();

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
    const [imageUrl, setImageUrl] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)
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
                        setImageUrl(productData.imageUrl || '')

                    })
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }

    const createProduct = async () => {
        if (!token) {
            toast.error("Authentication required");
            return;
        }

        // Validate required fields
        if (!Name || !Price || !categoryId) {
            toast.error("Please fill in Product Name, Price, and Category ID");
            return;
        }

        try {
            const response = await axios.post('api/Products/CreateProduct', {
                Name: Name,
                Price: Price,
                RebateQuantity: rebateQuantity,
                RebatePercent: rebatePercent,
                UpsellProductId: upsellProduct,
                ImageUrl: imageUrl,
                SubcategoryId: subcategoryId,
                CategoryId: categoryId,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('Product:', response.data);
            const productData = response.data;
            setProductName(productData.name);
            setPrice(productData.price);
            setCurrency(productData.currency);
            setRebateQuantity(productData.rebateQuantity);
            setRebatePercent(productData.rebatePercent);
            setUpsellProduct(productData.upsellProduct);
            setImageUrl(productData.imageUrl || '');

            toast.success("Product Created Successfully!");

            // Reload after a short delay to show the toast
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error: any) {
            console.error('Error creating product:', error);
            console.error('Error response:', error.response?.data);

            let errorMessage = "Failed to create product";
            if (error.response?.data) {
                if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                } else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.data.title) {
                    errorMessage = error.response.data.title;
                } else if (error.response.data.errors) {
                    errorMessage = JSON.stringify(error.response.data.errors);
                } else {
                    errorMessage = JSON.stringify(error.response.data);
                }
            }
            toast.error(`Error: ${errorMessage}`);
        }
    }

    const updateProduct = async (id: string) => {
        if (!id) {
            toast.error("Please enter a Product ID to update");
            return;
        }

        if (!token) {
            toast.error("Authentication required");
            return;
        }

        try {
            const response = await axios.put(`/api/Products/UpdateProduct/${id}`, {
                productId : id,
                Name : Name,
                Price : Price,
                RebateQuantity : rebateQuantity,
                RebatePercent : rebatePercent,
                UpsellProduct : upsellProduct,
                ImageUrl : imageUrl
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('Product:', response.data);
            const productData = response.data;
            setProductName(productData.name);
            setPrice(productData.price);
            setRebateQuantity(productData.rebateQuantity);
            setRebatePercent(productData.rebatePercent);
            setUpsellProduct(productData.upsellProduct);
            setImageUrl(productData.imageUrl || '');

            toast.success("Product Updated Successfully!");

            // Reload after a short delay to show the toast
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error: any) {
            console.error('Error updating product:', error);
            console.error('Error response:', error.response?.data);

            let errorMessage = "Failed to update product";
            if (error.response?.data) {
                if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                } else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.data.title) {
                    errorMessage = error.response.data.title;
                } else if (error.response.data.errors) {
                    errorMessage = JSON.stringify(error.response.data.errors);
                } else {
                    errorMessage = JSON.stringify(error.response.data);
                }
            }
            toast.error(`Error: ${errorMessage}`);
        }
    }

const deleteProduct = async (id: string) => {
    if (!id) {
        toast.error("Please enter a Product ID to delete");
        return;
    }

    if (!token) {
        toast.error("Authentication required");
        return;
    }

    try {
        const response = await axios.delete(`/api/Products/DeleteProduct/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('Product:', response.data);
        const productData = response.data;
        setDeletedProduct(productData.name);

        toast.success("Product Deleted Successfully!");

        // Reload after a short delay to show the toast
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    } catch (error: any) {
        console.error('Error deleting product:', error);
        console.error('Error response:', error.response?.data);

        let errorMessage = "Failed to delete product";
        if (error.response?.data) {
            if (typeof error.response.data === 'string') {
                errorMessage = error.response.data;
            } else if (error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.response.data.title) {
                errorMessage = error.response.data.title;
            } else if (error.response.data.errors) {
                errorMessage = JSON.stringify(error.response.data.errors);
            } else {
                errorMessage = JSON.stringify(error.response.data);
            }
        }
        toast.error(`Error: ${errorMessage}`);
    }
}

const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setImageFile(e.target.files[0]);
    }
}

const uploadImage = async (productId: string) => {
    if (!imageFile || !token) {
        toast.error("Please select an image file");
        return;
    }

    try {
        // Convert file to base64
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onloadend = async () => {
            const base64String = reader.result as string;
            // Remove the data:image/xxx;base64, prefix
            const base64Image = base64String.split(',')[1];

            try {
                const response = await axios.post('/api/Products/UploadImage', {
                    Base64Image: base64Image,
                    FileName: imageFile.name,
                    ContentType: imageFile.type,
                    ProductId: productId
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log('Image uploaded:', response.data);
                toast.success("Image uploaded successfully!");
                setImageFile(null);
                // Clear the file input
                const fileInput = document.getElementById('imageFileInput') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
            } catch (error) {
                console.error('Error uploading image:', error);
                toast.error("Failed to upload image");
            }
        };
    } catch (error) {
        console.error('Error:', error);
        toast.error("Failed to process image");
    }
}

    const getUser = async (id: string) => {
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

    const handleUploadImageClick = () => {
        uploadImage(productId);
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

                <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                    <h5 style={{ marginBottom: '10px' }}>Upload Product Image</h5>
                    <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={handleImageFileChange}
                        style={{ marginBottom: '10px' }}
                    />
                    {imageFile && (
                        <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                            Selected: {imageFile.name}
                        </p>
                    )}
                    <button
                        onClick={handleUploadImageClick}
                        disabled={!imageFile || !productId}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: imageFile && productId ? '#4CAF50' : '#ccc',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: imageFile && productId ? 'pointer' : 'not-allowed'
                        }}
                    >
                        Upload Image
                    </button>
                    <p style={{ fontSize: '11px', color: '#888', marginTop: '8px' }}>
                        Enter Product ID above, then select and upload an image
                    </p>
                </div>
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
                    Image URL:
                    <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Enter image URL (or upload below)"
                    />
                </label>
                <div className="imageUploadSection">
                    <p style={{ margin: '10px 0', fontWeight: 'bold' }}>OR Upload Image File:</p>
                    <input
                        id="imageFileInput"
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={handleImageFileChange}
                        style={{ marginBottom: '10px' }}
                    />
                    {imageFile && (
                        <p style={{ fontSize: '12px', color: '#666' }}>
                            Selected: {imageFile.name}
                        </p>
                    )}
                    <p style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
                        Note: Upload image after creating the product
                    </p>
                </div>
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
                <label>
                    Image URL:
                    <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Enter image URL (or upload below)"
                    />
                </label>
                <div className="imageUploadSection">
                    <p style={{ margin: '10px 0', fontWeight: 'bold' }}>OR Upload Image File:</p>
                    <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={handleImageFileChange}
                        style={{ marginBottom: '10px' }}
                    />
                    {imageFile && (
                        <div>
                            <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                                Selected: {imageFile.name}
                            </p>
                            <button
                                onClick={handleUploadImageClick}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    marginBottom: '10px'
                                }}
                            >
                                Upload Image
                            </button>
                        </div>
                    )}
                </div>
                <button onClick={handleUpdateProductClick}>Update Product</button>
                
            </div>
          
        </div>
    );
};

export default AdminDashboardView;