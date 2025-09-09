'use client'
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";

const ProductList = () => {
  const { router } = useAppContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const fetchSellerProducts = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
      const url = `${base}/api/products/`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('access_token');
          localStorage.removeItem('user_data');
          router.push('/seller/login');
          return;
        }
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const data = await response.json();
      setProducts(Array.isArray(data) ? data : data.results || []);
      
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
      
      if (err.message.includes('401') || err.message.includes('token')) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_data');
        router.push('/seller/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const token = getAuthToken();
      const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
      const url = `${base}/api/products/${productId}/`;
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Remove the product from the local state
        setProducts(products.filter(product => product.id !== productId));
        alert('Product deleted successfully!');
      } else {
        throw new Error(`Failed to delete product: ${response.status}`);
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product. Please try again.');
    }
  };

  useEffect(() => {
    // Check authentication first
    if (!isAuthenticated()) {
      router.push('/seller/login');
      return;
    }
    
    fetchSellerProducts();
  }, [router]);

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

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex-1 min-h-screen flex flex-col justify-between">
        <div className="w-full md:p-10 p-4">
          <h2 className="pb-4 text-lg font-medium">All Products</h2>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Error loading products: {error}</p>
            <button 
              onClick={fetchSellerProducts}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">All Products</h2>
          <button 
            onClick={() => router.push('/seller/add-product')}
            className="px-4 py-2 bg-josseypink2 text-white rounded-md hover:bg-josseypink1 transition-colors"
          >
            Add New Product
          </button>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">No products found.</p>
            <button 
              onClick={() => router.push('/seller/add-product')}
              className="px-4 py-2 bg-josseypink2 text-white rounded-md hover:bg-josseypink1 transition-colors"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table className="table-fixed w-full overflow-hidden">
              <thead className="text-gray-900 text-sm text-left">
                <tr>
                  <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate">Product</th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">Category</th>
                  <th className="px-4 py-3 font-medium truncate">Price</th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">Stock</th>
                  <th className="px-4 py-3 font-medium truncate">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-gray-500/20 hover:bg-gray-50">
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                      <div className="bg-gray-500/10 rounded p-2 flex-shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0].image_url}
                            alt={product.name}
                            className="w-16 h-16 object-cover"
                            width={64}
                            height={64}
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Image</span>
                          </div>
                        )}
                      </div>
                      <span className="truncate w-full">
                        {product.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-sm:hidden capitalize">
                      {typeof product.category === 'object' ? product.category.name : product.category}
                    </td>
                    <td className="px-4 py-3">
                      ${parseFloat(product.price).toFixed(2)}
                      {product.offer_price && product.offer_price < product.price && (
                        <span className="text-xs text-gray-400 line-through ml-1">
                          ${parseFloat(product.offer_price).toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 max-sm:hidden">
                      <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => router.push(`/product/${product.id}`)} 
                          className="flex items-center gap-1 px-2 py-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
                          title="View Product"
                        >
                          <Image
                            className="h-3.5 w-3.5"
                            src={assets.redirect_icon}
                            alt="View product"
                            width={14}
                            height={14}
                          />
                          <span className="hidden md:block text-xs">View</span>
                        </button>
                        <button 
                          onClick={() => router.push(`/seller/edit-product/${product.id}`)} 
                          className="flex items-center gap-1 px-2 py-1.5 bg-yellow-100 text-yellow-600 rounded-md hover:bg-yellow-200 transition-colors"
                          title="Edit Product"
                        >
                          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                          </svg>
                          <span className="hidden md:block text-xs">Edit</span>
                        </button>
                        <button 
                          onClick={() => deleteProduct(product.id)} 
                          className="flex items-center gap-1 px-2 py-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                          title="Delete Product"
                        >
                          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                          </svg>
                          <span className="hidden md:block text-xs">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductList;