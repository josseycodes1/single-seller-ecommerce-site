'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { assets } from "@/assets/assets";
import Image from "next/image";
import toast from "react-hot-toast";

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

const AddProduct = () => {
  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [rating, setRating] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [colors, setColors] = useState([]);
  const [input, setInput] = useState("");

  
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/seller/login');
    } else {
      fetchCategories();
    }
  }, [router]);

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
  
        fetchCategories();
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

  const validateForm = () => {
    const errors = {};
    
    if (!name.trim()) errors.name = 'Product name is required';
    if (!description.trim()) errors.description = 'Product description is required';
    if (!price || parseFloat(price) <= 0) errors.price = 'Valid price is required';
    if (!stock || parseInt(stock) < 0) errors.stock = 'Valid stock quantity is required';
    if (files.filter(Boolean).length === 0) errors.images = 'Please upload at least one image';

    
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
        if (category) formData.append('category', category);
        formData.append('price', price);
        formData.append('stock', stock || '0');
        formData.append('rating', rating || '0');
        formData.append('is_featured', isFeatured); 
        formData.append('colors', JSON.stringify(colors)); 

        files.forEach((file) => {
          if (file) {
            formData.append("image_files", file);
          }
        });

        console.log("FormData payload:");
        for (let [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }

        const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
        const response = await fetch(`${base}/api/products/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });


        const responseData = await response.json();

        if (response.ok) {
          toast.success("Product added successfully!");
          router.push('/seller-dashboard/all-products');
        } 
        
        else {
          setError(`Failed to add product: ${JSON.stringify(responseData)}`);
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Error adding product. Please try again.');
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


  const addColor = () => {
    if (input.trim() && !colors.includes(input.trim())) {
      setColors([...colors, input.trim()]);
      setInput("");
    }
  };

  const removeColor = (color) => {
    setColors(colors.filter((c) => c !== color));
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
              <p className="text-sm text-gray-600">Add New Product</p>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Add New Product</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
              {error.includes('Authentication') && (
                <button 
                  onClick={logout}
                  className="ml-4 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Login Again
                </button>
              )}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            {/* Product Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images (Up to 4) *
              </label>
              <div className="flex flex-wrap gap-4">
                {[...Array(4)].map((_, index) => (
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
                        name={`image${index}`}
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
              {/* category */}
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
                      {/* Category Select */}
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

                      {/* Add New Category Toggle */}
                      <button
                        type="button"
                        onClick={() => setShowAddCategory(!showAddCategory)}
                        className="flex items-center justify-center text-sm text-josseypink2 hover:text-josseypink1"
                      >
                        <span className="mr-1">+</span> Add New Category
                      </button>

                      {/* Add New Category Input */}
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

                      {/* List of Categories with Delete */}
                      <div className="flex flex-col gap-1 mt-3">
                        {categories.map((cat) => (
                          <div key={cat.id} className="flex justify-between items-center text-sm border rounded px-2 py-1">
                            <span>{cat.name}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="text-red-500 hover:text-red-700 text-xs"
                              disabled={loading}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
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

            {/*color*/}
            <div>
                <label className="block font-medium">Available Colors</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter a color and press Add"
                    className="border px-2 py-1 rounded"
                  />
                  <button
                    type="button"
                    onClick={addColor}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Add
                  </button>
                </div>

                <div className="flex gap-2 mt-2 flex-wrap">
                  {colors.map((color, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-1"
                    >
                      {color}
                      <button
                        type="button"
                        onClick={() => removeColor(color)}
                        className="text-red-500"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
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
                    Adding Product...
                  </span>
                ) : (
                  'ADD PRODUCT'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddProduct;