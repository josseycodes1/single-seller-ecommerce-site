'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { assets } from "@/assets/assets";
import Image from "next/image";

// Auth utility functions
const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('access_token');
  const userData = localStorage.getItem('user_data');
  return !!(token && userData);
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
  const [imageUrls, setImageUrls] = useState([]); // For Cloudinary URLs
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Earphone');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userData, setUserData] = useState(null);
  
  const router = useRouter();

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/seller/login');
    } else {
      const userDataStr = localStorage.getItem('user_data');
      if (userDataStr) {
        setUserData(JSON.parse(userDataStr));
      }
    }
  }, [router]);

  // Upload images to Cloudinary first
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'your_upload_preset_here'); // You need to set this up in Cloudinary
    
    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      return data.secure_url; // Return the Cloudinary URL
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploading(true);

    try {
      const token = getAuthToken();
      
      // Upload all images to Cloudinary first
      const uploadedImageUrls = [];
      for (const file of files) {
        if (file) {
          const imageUrl = await uploadToCloudinary(file);
          uploadedImageUrls.push(imageUrl);
        }
      }

      setImageUrls(uploadedImageUrls);
      setUploading(false);

      // Now send product data to your Django backend with Cloudinary URLs
      const productData = {
        name: name,
        description: description,
        category: category,
        price: parseFloat(price),
        offer_price: offerPrice ? parseFloat(offerPrice) : null,
        image_urls: uploadedImageUrls, // Send array of Cloudinary URLs
      };

      const response = await fetch('http://localhost:8000/api/products/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const responseData = await response.json();

      if (response.ok) {
        alert('Product added successfully!');
        // Reset form
        setName('');
        setDescription('');
        setPrice('');
        setOfferPrice('');
        setFiles([]);
        setImageUrls([]);
      } else {
        alert(`Failed to add product: ${responseData.message || 'Unknown error'}`);
      }
    } catch (error) {
      alert('Error adding product. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const updatedFiles = [...files];
    updatedFiles[index] = null;
    setFiles(updatedFiles);
    
    const updatedUrls = [...imageUrls];
    updatedUrls[index] = null;
    setImageUrls(updatedUrls);
  };

  // Redirect to login if not authenticated
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
              {userData && (
                <p className="text-sm text-gray-600">
                  Welcome, {userData.business_name || userData.email}
                </p>
              )}
            </div>
            <button 
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Add New Product</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images
              </label>
              <div className="flex flex-wrap gap-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="relative">
                    <label htmlFor={`image${index}`} className="cursor-pointer">
                      <input 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const updatedFiles = [...files];
                            updatedFiles[index] = e.target.files[0];
                            setFiles(updatedFiles);
                          }
                        }} 
                        type="file" 
                        id={`image${index}`} 
                        className="hidden" 
                        accept="image/*"
                        disabled={uploading}
                      />
                      <Image
                        className="w-24 h-24 object-cover border-2 border-dashed border-gray-300 rounded-lg hover:border-[#FC46AA] transition-colors"
                        src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area}
                        alt={`Preview ${index + 1}`}
                        width={96}
                        height={96}
                      />
                    </label>
                    {(files[index] || imageUrls[index]) && (
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        disabled={uploading}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Upload up to 4 images</p>
              {uploading && (
                <div className="mt-2 flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#FC46AA] mr-2"></div>
                  <span className="text-sm text-gray-600">Uploading images to Cloudinary...</span>
                </div>
              )}
            </div>

            {/* Product Name */}
            <div>
              <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <input
                id="product-name"
                type="text"
                placeholder="Enter product name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC46AA] focus:border-transparent"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
                disabled={loading || uploading}
              />
            </div>

            {/* Product Description */}
            <div>
              <label htmlFor="product-description" className="block text-sm font-medium text-gray-700 mb-2">
                Product Description
              </label>
              <textarea
                id="product-description"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC46AA] focus:border-transparent resize-none"
                placeholder="Describe your product..."
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                required
                disabled={loading || uploading}
              />
            </div>

            {/* Category and Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC46AA] focus:border-transparent"
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                  disabled={loading || uploading}
                >
                  <option value="Earphone">Earphone</option>
                  <option value="Headphone">Headphone</option>
                  <option value="Watch">Watch</option>
                  <option value="Smartphone">Smartphone</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Camera">Camera</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              {/* Product Price */}
              <div>
                <label htmlFor="product-price" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Price ($)
                </label>
                <input
                  id="product-price"
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC46AA] focus:border-transparent"
                  onChange={(e) => setPrice(e.target.value)}
                  value={price}
                  required
                  disabled={loading || uploading}
                />
              </div>

              {/* Offer Price */}
              <div>
                <label htmlFor="offer-price" className="block text-sm font-medium text-gray-700 mb-2">
                  Offer Price ($) <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  id="offer-price"
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC46AA] focus:border-transparent"
                  onChange={(e) => setOfferPrice(e.target.value)}
                  value={offerPrice}
                  disabled={loading || uploading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading || uploading}
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
                ) : uploading ? (
                  'Uploading Images...'
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