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

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/seller/login');
    } else {
      fetchCategories();
      fetchProduct();
    }
  }, [router, productId]);

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
      const url = `${base}/api/categories/`;
      
      const response = await fetch(url);
      
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
        router.push('/seller/products');
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
          {error && (
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

            {/* Rest of the form remains the same as AddProduct */}
            {/* ... (Include all the form fields from AddProduct component) ... */}
            
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