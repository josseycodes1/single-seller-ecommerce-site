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

    const fetchOrders = async () => {
        try {
            setLoading(true);
            
          
            if (userData && userData.email) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/?email=${userData.email}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const ordersData = await response.json();
                    setOrders(ordersData);
                } else {
                    throw new Error('Failed to fetch orders');
                }
            } else {
               
                addToast('Please log in to view your orders', 'info');
                setOrders([]);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            addToast('Failed to load orders', 'error');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, [userData]);

    
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
                    
                    {loading ? (
                        <Loading />
                    ) : orders.length === 0 ? (
                        <div className="text-center py-12">
                            <Image
                                src={assets.box_icon}
                                alt="No orders"
                                width={80}
                                height={80}
                                className="mx-auto mb-4 opacity-50"
                            />
                            <h3 className="text-lg font-medium text-gray-600 mb-2">No orders yet</h3>
                            <p className="text-gray-500">You haven't placed any orders yet.</p>
                        </div>
                    ) : (
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
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MyOrders;