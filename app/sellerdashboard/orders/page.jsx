'use client';
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";

const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('access_token');
  return !!token;
};

const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

const Orders = () => {
  const { currency } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSellerOrders = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
      const url = `${base}/api/orders/`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          
          localStorage.removeItem('access_token');
          localStorage.removeItem('user_data');
          window.location.href = '/seller/login';
          return;
        }
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      const data = await response.json();
      setOrders(Array.isArray(data) ? data : data.results || []);
      
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = getAuthToken();
      const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
      const url = `${base}/api/orders/${orderId}/`;
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
       
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        alert('Order status updated successfully!');
      } else {
        throw new Error(`Failed to update order: ${response.status}`);
      }
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Failed to update order status. Please try again.');
    }
  };

  useEffect(() => {
   
    if (!isAuthenticated()) {
      window.location.href = '/seller/login';
      return;
    }
    
    fetchSellerOrders();
  }, []);


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
      <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
        <div className="md:p-10 p-4 space-y-5">
          <h2 className="text-lg font-medium">Orders</h2>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Error loading orders: {error}</p>
            <button 
              onClick={fetchSellerOrders}
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };

  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
      <div className="md:p-10 p-4 space-y-5">
        <h2 className="text-lg font-medium">Orders</h2>
        
        {orders.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No orders found.</p>
          </div>
        ) : (
          <div className="max-w-6xl rounded-md">
            {orders.map((order) => (
              <div key={order.id} className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300">
                {/* order items */}
                <div className="flex-1 flex gap-5 max-w-80">
                  <Image
                    className="max-w-16 max-h-16 object-cover"
                    src={assets.box_icon}
                    alt="box_icon"
                    width={64}
                    height={64}
                  />
                  <div className="flex flex-col gap-2">
                    <span className="font-medium">
                      {order.items && order.items.map((item) => 
                        `${item.product?.name || 'Product'} x ${item.quantity}`
                      ).join(", ")}
                    </span>
                    <span>Items: {order.items?.length || 0}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>

                {/* customer information */}
                <div className="flex-1">
                  <p className="font-medium">{order.customer_name}</p>
                  <p>{order.customer_email}</p>
                  <p>{order.customer_phone}</p>
                  <p className="mt-2 whitespace-pre-line">{order.customer_address}</p>
                </div>

                {/* order amount */}
                <div className="flex flex-col items-end">
                  <p className="font-medium text-lg">
                    {currency}
                    {order.items?.reduce((total, item) => total + (parseFloat(item.price || 0) * (item.quantity || 1)), 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>

                {/* order actions */}
                <div className="flex flex-col gap-2">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                  
                  <div className="text-xs text-gray-500">
                    <p>Order ID: #{order.id}</p>
                    <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;