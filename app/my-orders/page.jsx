'use client';
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";

const MyOrders = () => {
    const { currency, userData, addToast } = useAppContext();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [debugInfo, setDebugInfo] = useState('');

    const fetchOrders = async (email) => {
        try {
            setLoading(true);
            setDebugInfo(`Fetching orders for email: ${email}`);
            
            console.log(`🔍 DEBUG: Fetching orders for email: ${email}`);
            console.log(`🔍 DEBUG: API URL: ${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/?email=${email}`);

            const response = await fetch(`${process.env.NUBLIC_API_BASE_URL}/api/orders/?email=${email}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log(`🔍 DEBUG: Response status: ${response.status}`);
            
            if (response.ok) {
                const ordersData = await response.json();
                console.log(`🔍 DEBUG: Orders received:`, ordersData);
                setOrders(ordersData);
                setDebugInfo(`Found ${ordersData.length} orders for ${email}`);
            } else {
                const errorText = await response.text();
                console.error(`🔍 DEBUG: API error: ${response.status} - ${errorText}`);
                throw new Error(`Failed to fetch orders: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setDebugInfo(`Error: ${error.message}`);
            addToast('Failed to load orders', 'error');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        console.log('🔍 DEBUG: useEffect running');
        console.log('🔍 DEBUG: userData:', userData);
        
        // Check for guest email in URL parameters or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const emailFromUrl = urlParams.get('email');
        const storedEmail = localStorage.getItem('guestOrderEmail');
        
        console.log('🔍 DEBUG: emailFromUrl:', emailFromUrl);
        console.log('🔍 DEBUG: storedEmail:', storedEmail);

        if (userData && userData.email) {
            console.log('🔍 DEBUG: Using logged-in user email');
            fetchOrders(userData.email);
        } else if (emailFromUrl) {
            console.log('🔍 DEBUG: Using email from URL');
            fetchOrders(emailFromUrl);
        } else if (storedEmail) {
            console.log('🔍 DEBUG: Using stored guest email');
            fetchOrders(storedEmail);
        } else {
            console.log('🔍 DEBUG: No email found - showing empty state');
            setLoading(false);
            addToast('Please enter your email to view orders', 'info');
        }
    }, [userData]);

    // Add a simple email input for guests
    const handleEmailSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        if (email) {
            localStorage.setItem('guestOrderEmail', email);
            fetchOrders(email);
        }
    }

    const formatStatus = (status) => {
        const statusMap = {
            'pending': 'Pending',
            'processing': 'Processing',
            'shipped': 'Shipped',
            'delivered': 'Delivered'
        };
        return statusMap[status] || status;
    }

    const formatPaymentStatus = (paymentStatus, isPaid) => {
        if (isPaid) return 'Paid';
        return paymentStatus === 'success' ? 'Paid' : 'Pending';
    }

    return (
        <>
            <Navbar />
            <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen">
                <div className="space-y-5">
                    <h2 className="text-2xl font-bold mt-6">My Orders</h2>
                    
                    {/* Debug info - remove in production */}
                    {process.env.NODE_ENV === 'development' && debugInfo && (
                        <div className="bg-yellow-100 border border-yellow-400 p-3 rounded">
                            <p className="text-sm text-yellow-800">Debug: {debugInfo}</p>
                        </div>
                    )}

                    {/* Email input for guests */}
                    {!userData?.email && orders.length === 0 && !loading && (
                        <div className="max-w-md mx-auto bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h3 className="text-lg font-medium text-blue-800 mb-3">View Your Orders</h3>
                            <p className="text-blue-600 mb-4">Enter the email address you used for your order</p>
                            <form onSubmit={handleEmailSubmit} className="space-y-3">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="your@email.com"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    View My Orders
                                </button>
                            </form>
                        </div>
                    )}
                    
                    {loading ? (
                        <Loading />
                    ) : orders.length === 0 && (userData?.email || localStorage.getItem('guestOrderEmail')) ? (
                        <div className="text-center py-12">
                            <Image
                                src={assets.box_icon}
                                alt="No orders"
                                width={80}
                                height={80}
                                className="mx-auto mb-4 opacity-50"
                            />
                            <h3 className="text-lg font-medium text-gray-600 mb-2">No orders found</h3>
                            <p className="text-gray-500">
                                No orders found for this email address.
                            </p>
                        </div>
                    ) : orders.length > 0 ? (
                        <div className="max-w-5xl border-t border-gray-300 text-sm">
                            {orders.map((order) => (
                                <div key={order.id} className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-300">
                                    <div className="flex-1 flex gap-5 max-w-80">
                                        <Image
                                            className="max-w-16 max-h-16 object-cover"
                                            src={assets.box_icon}
                                            alt="box_icon"
                                            width={64}
                                            height={64}
                                        />
                                        <div className="flex flex-col gap-2">
                                            <span className="font-medium text-base">
                                                {order.items && order.items.map((item) => 
                                                    `${item.product?.name || 'Product'} x ${item.quantity}`
                                                ).join(", ")}
                                            </span>
                                            <span className="text-gray-600">Order ID: #{order.id}</span>
                                            <span className="text-gray-600">Items: {order.items?.length || 0}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="text-gray-700">
                                        <p>
                                            <span className="font-medium">{order.customer_name}</span>
                                            <br />
                                            <span>{order.customer_email}</span>
                                            <br />
                                            <span>{order.customer_phone}</span>
                                            {order.address && (
                                                <>
                                                    <br />
                                                    <span>{order.address.street_address}</span>
                                                    <br />
                                                    <span>{`${order.address.town}, ${order.address.state}`}</span>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                    
                                    <div className="font-medium my-auto">
                                        {currency}{parseFloat(order.total_amount || 0).toFixed(2)}
                                    </div>
                                    
                                    <div className="flex flex-col gap-1">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {formatStatus(order.status)}
                                        </span>
                                        <span className="text-gray-600 text-xs">
                                            Date: {new Date(order.created_at).toLocaleDateString()}
                                        </span>
                                        <span className={`text-xs font-medium ${
                                            order.is_paid || order.payment_status === 'success' ? 
                                            'text-green-600' : 'text-yellow-600'
                                        }`}>
                                            Payment: {formatPaymentStatus(order.payment_status, order.is_paid)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MyOrders;