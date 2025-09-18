'use client'
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Loading from "@/components/Loading";

// Auth utility functions
const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('access_token');
  return !!token;
};

const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user_data');
  window.location.href = '/seller/login';
};

const EditProduct = () => {
  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [rating, setRating] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  // Check authentication and product ID on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/seller/login');
      return;
    }
    
    // Check if we have a valid product ID
    if (!productId) {
      setError('Invalid product ID');
      setFetching(false);
      return;
    }
    
    fetchCategories();
    fetchProduct();
  }, [router, productId]);

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const token = getAuthToken();
      const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
      const url = `${base}/api/categories/`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        console.error('Failed to fetch categories:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories. Please refresh the page.');
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Fetch product data
  const fetchProduct = async () => {
    try {
      setFetching(true);
      const token = getAuthToken();
      const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
      const url = `${base}/api/products/${productId}/`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const productData = await response.json();
        
        // Populate form with existing data
        setName(productData.name);
        setDescription(productData.description);
        setCategory(productData.category?.id || productData.category || '');
        setPrice(productData.price);
        setStock(productData.stock);
        setRating(productData.rating);
        setIsFeatured(productData.is_featured);
        setExistingImages(productData.images || []);
      } else if (response.status === 404) {
        setError('Product not found. It may have been deleted or does not exist.');
      } else {
        setError('Failed to load product data.');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Error loading product data. Please try again.');
    } finally {
      setFetching(false);
    }
  };

  // Add new category
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setError('Category name is required');
      return;
    }

    setAddingCategory(true);
    setError('');

    try {
      const token = getAuthToken();
      const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
      const url = `${base}/api/categories/`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      if (response.ok) {
        const newCategory = await response.json();
        setCategories([...categories, newCategory]);
        setCategory(newCategory.id);
        setNewCategoryName('');
        setShowAddCategory(false);
        setError('');
        fetchCategories(); // Refresh categories
      } else {
        const errorData = await response.json();
        setError(errorData.detail || errorData.name || 'Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      setError('Error adding category. Please try again.');
    } finally {
      setAddingCategory(false);
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!name.trim()) errors.name = 'Product name is required';
    if (!description.trim()) errors.description = 'Product description is required';
    if (!price || parseFloat(price) <= 0) errors.price = 'Valid price is required';
    if (!stock || parseInt(stock) < 0) errors.stock = 'Valid stock quantity is required';
    if (files.filter(Boolean).length === 0 && existingImages.length === 0) errors.images = 'Please upload at least one image';
    
    return errors;
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    
    const errors = validateForm();
    if (errors[field]) {
      setFormErrors({ ...formErrors, [field]: errors[field] });
    } else {
      const newErrors = { ...formErrors };
      delete newErrors[field];
      setFormErrors(newErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const allTouched = {};
    Object.keys(validateForm()).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const token = getAuthToken();
      
      if (!token) {
        setError('Authentication token missing. Please login again.');
        return;
      }
      
      const formData = new FormData();
      
      formData.append('name', name);
      formData.append('description', description);
      if (category) {
        formData.append('category', category);
      }
      formData.append('price', price);
      formData.append('stock', stock);
      formData.append('rating', rating || '0');
      formData.append('is_featured', isFeatured.toString());
      
      // Add new images
      files.forEach((file, index) => {
        if (file) {
          formData.append('images', file);
        }
      });

      const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
      const response = await fetch(`${base}/api/products/${productId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        alert('Product updated successfully!');
        router.push('/all-products');
      } else {
        if (response.status === 401 || response.status === 403) {
          setError('Authentication failed. Please login again.');
          logout();
        } else {
          setError(`Failed to update product: ${responseData.detail || JSON.stringify(responseData)}`);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error updating product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (index, file) => {
    const updatedFiles = [...files];
    updatedFiles[index] = file;
    setFiles(updatedFiles);
    
    if (file) {
      const newErrors = { ...formErrors };
      delete newErrors.images;
      setFormErrors(newErrors);
    }
  };

  const removeImage = (index) => {
    const updatedFiles = [...files];
    updatedFiles[index] = null;
    setFiles(updatedFiles);
  };

  const removeExistingImage = (imageId) => {
    setExistingImages(existingImages.filter(img => img.id !== imageId));
  };

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FC46AA] mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (fetching) {
    return <Loading />;
  }

  if (error && (error.includes('Invalid product ID') || error.includes('Product not found'))) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => router.push('/seller/products')}
            className="px-4 py-2 bg-josseypink2 text-white rounded-md hover:bg-josseypink1 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <button 
                onClick={() => router.push('/seller/products')}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Products
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            </div>
            <button 
              onClick={logout}
              className="px-4 py-2 bg-josseypink2 text-white text-sm font-medium rounded-md hover:bg-josseypink1 transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {error && !error.includes('Invalid product ID') && !error.includes('Product not found') && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            {/* Product Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images (Up to 4) *
              </label>
              
              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Existing Images:</p>
                  <div className="flex flex-wrap gap-4 mb-4">
                    {existingImages.map((image) => (
                      <div key={image.id} className="relative">
                        <img
                          src={image.image_url}
                          alt="Product image"
                          className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(image.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          disabled={loading}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* New Images */}
              <p className="text-sm text-gray-600 mb-2">Add New Images:</p>
              <div className="flex flex-wrap gap-4">
                {[...Array(4 - existingImages.length)].map((_, index) => (
                  <div key={index} className="relative">
                    <label htmlFor={`image${index}`} className="cursor-pointer">
                      <input 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileChange(index, e.target.files[0]);
                          }
                        }} 
                        type="file" 
                        id={`image${index}`} 
                        className="hidden" 
                        accept="image/*"
                        disabled={loading}
                      />
                      <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#FC46AA] transition-colors flex items-center justify-center overflow-hidden">
                        {files[index] ? (
                          <img
                            src={URL.createObjectURL(files[index])}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image
                            src={assets.upload_area}
                            alt="Upload area"
                            width={48}
                            height={48}
                            className="opacity-50"
                          />
                        )}
                      </div>
                    </label>
                    {files[index] && (
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        disabled={loading}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {touched.images && formErrors.images && (
                <p className="text-red-500 text-sm mt-2">{formErrors.images}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">At least one image is required</p>
            </div>

            {/* Product Name */}
            <div>
              <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                id="product-name"
                type="text"
                placeholder="Enter product name"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC46AA] focus:border-transparent ${
                  touched.name && formErrors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => handleBlur('name')}
                value={name}
                required
                disabled={loading}
              />
              {touched.name && formErrors.name && (
                <p className="text-red-500 text-sm mt-2">{formErrors.name}</p>
              )}
            </div>

            {/* Product Description */}
            <div>
              <label htmlFor="product-description" className="block text-sm font-medium text-gray-700 mb-2">
                Product Description *
              </label>
              <textarea
                id="product-description"
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC46AA] focus:border-transparent resize-none ${
                  touched.description && formErrors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe your product..."
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => handleBlur('description')}
                value={description}
                required
                disabled={loading}
              />
              {touched.description && formErrors.description && (
                <p className="text-red-500 text-sm mt-2">{formErrors.description}</p>
              )}
            </div>

            {/* Category, Price, Stock, Rating */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category - Now Optional */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                {categoriesLoading ? (
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                    <div className="animate-pulse h-4 bg-gray-300 rounded"></div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <select
                      id="category"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC46AA] focus:border-transparent"
                      onChange={(e) => setCategory(e.target.value)}
                      value={category}
                      disabled={loading}
                    >
                       <option value="">No Category (Optional)</option>
                          {categories && categories.length > 0 ? (
                            categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>No categories available</option>
                          )}
                    </select>
                    
                    <button
                      type="button"
                      onClick={() => setShowAddCategory(!showAddCategory)}
                      className="flex items-center justify-center text-sm text-josseypink2 hover:text-josseypink1"
                    >
                      <span className="mr-1">+</span> Add New Category
                    </button>
                    
                    {showAddCategory && (
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          placeholder="New category name"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                          disabled={addingCategory}
                        />
                        <button
                          type="button"
                          onClick={handleAddCategory}
                          disabled={addingCategory || !newCategoryName.trim()}
                          className="px-2 py-1 bg-josseypink2 text-white rounded text-sm hover:bg-josseypink1 disabled:opacity-50"
                        >
                          {addingCategory ? 'Adding...' : 'Add'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Product Price */}
              <div>
                <label htmlFor="product-price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  id="product-price"
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC46AA] focus:border-transparent ${
                    touched.price && formErrors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  onChange={(e) => setPrice(e.target.value)}
                  onBlur={() => handleBlur('price')}
                  value={price}
                  required
                  disabled={loading}
                />
                {touched.price && formErrors.price && (
                  <p className="text-red-500 text-sm mt-2">{formErrors.price}</p>
                )}
              </div>

              {/* Stock */}
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                  Stock *
                </label>
                <input
                  id="stock"
                  type="number"
                  placeholder="0"
                  min="0"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC46AA] focus:border-transparent ${
                    touched.stock && formErrors.stock ? 'border-red-500' : 'border-gray-300'
                }`}
                  onChange={(e) => setStock(e.target.value)}
                  onBlur={() => handleBlur('stock')}
                  value={stock}
                  required
                  disabled={loading}
                />
                {touched.stock && formErrors.stock && (
                  <p className="text-red-500 text-sm mt-2">{formErrors.stock}</p>
                )}
              </div>

              {/* Rating */}
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <input
                  id="rating"
                  type="number"
                  placeholder="0.0"
                  min="0"
                  max="10"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC46AA] focus:border-transparent"
                  onChange={(e) => setRating(e.target.value)}
                  value={rating}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Featured Product Checkbox */}
            <div className="flex items-center">
              <input
                id="is-featured"
                type="checkbox"
                className="h-4 w-4 text-[#FC46AA] focus:ring-[#FC46AA] border-gray-300 rounded"
                onChange={(e) => setIsFeatured(e.target.checked)}
                checked={isFeatured}
                disabled={loading}
              />
              <label htmlFor="is-featured" className="ml-2 block text-sm text-gray-900">
                Feature this product
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="px-6 py-3 bg-[#FC46AA] text-white font-medium rounded-md hover:bg-[#F699CD] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating Product...
                  </span>
                ) : (
                  'UPDATE PRODUCT'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditProduct;