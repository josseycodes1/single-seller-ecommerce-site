'use client'
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";

const Cart = () => {
    const { products, router, cart, cartItems, addToCart, updateCartQuantity, removeFromCart, getCartCount, fetchCart } = useAppContext();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Set a timeout to show empty cart if cart doesn't load
        const timer = setTimeout(() => {
            if (!cart) {
                setLoading(false);
            }
        }, 5000);

        return () => clearTimeout(timer);
    }, [cart]);

    useEffect(() => {
        if (cart !== null) {
            setLoading(false);
        }
    }, [cart]);

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity === 0) {
            await removeFromCart(itemId);
        } else {
            await updateCartQuantity(itemId, newQuantity);
        }
    }

    const handleAddToCart = async (productId) => {
        await addToCart(productId, 1);
    }

    // Show loading state only for a reasonable time
    if (loading && !cart) {
        return (
            <>
                <Navbar />
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-center">
                        <p className="text-gray-500 text-lg">Loading cart...</p>
                    </div>
                </div>
            </>
        );
    }

    // If cart is null after loading, show empty cart
    const displayCart = cart || { items: [], total_price: 0, total_quantity: 0 };

    return (
        <>
            <Navbar />
            <div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mb-20">
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
                        <p className="text-2xl md:text-3xl text-gray-500">
                            Your <span className="font-medium text-josseypink1">Cart</span>
                        </p>
                        <p className="text-lg md:text-xl text-gray-500/80">{getCartCount()} Items</p>
                    </div>
                    
                    {displayCart.items && displayCart.items.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto">
                                <thead className="text-left">
                                    <tr>
                                        <th className="text-nowrap pb-6 md:px-4 px-1 text-gray-600 font-medium">
                                            Product Details
                                        </th>
                                        <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                                            Price
                                        </th>
                                        <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                                            Quantity
                                        </th>
                                        <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                                            Subtotal
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayCart.items.map((cartItem) => {
                                        const product = products.find(p => p.id === cartItem.product.id);

                                        if (!product) return null;

                                        return (
                                            <tr key={cartItem.id}>
                                                <td className="flex items-center gap-4 py-4 md:px-4 px-1">
                                                    <div>
                                                        <div className="rounded-lg overflow-hidden bg-gray-500/10 p-2">
                                                            <Image
                                                                src={product.images?.[0]?.image_url || '/placeholder-image.jpg'}
                                                                alt={product.name}
                                                                className="w-16 h-auto object-cover mix-blend-multiply"
                                                                width={64}
                                                                height={64}
                                                            />
                                                        </div>
                                                        <button
                                                            className="md:hidden text-xs text-josseypink1 mt-1"
                                                            onClick={() => handleUpdateQuantity(cartItem.id, 0)}
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                    <div className="text-sm hidden md:block">
                                                        <p className="text-gray-800">{product.name}</p>
                                                        <button
                                                            className="text-xs text-josseypink1 mt-1"
                                                            onClick={() => handleUpdateQuantity(cartItem.id, 0)}
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="py-4 md:px-4 px-1 text-gray-600">${parseFloat(product.price).toFixed(2)}</td>
                                                <td className="py-4 md:px-4 px-1">
                                                    <div className="flex items-center md:gap-2 gap-1">
                                                        <button onClick={() => handleUpdateQuantity(cartItem.id, cartItem.quantity - 1)}>
                                                            <Image
                                                                src={assets.decrease_arrow}
                                                                alt="decrease_arrow"
                                                                className="w-4 h-4"
                                                            />
                                                        </button>
                                                        <input 
                                                            onChange={e => handleUpdateQuantity(cartItem.id, Number(e.target.value))} 
                                                            type="number" 
                                                            value={cartItem.quantity} 
                                                            className="w-8 border text-center appearance-none"
                                                            min="1"
                                                        />
                                                        <button onClick={() => handleAddToCart(product.id)}>
                                                            <Image
                                                                src={assets.increase_arrow}
                                                                alt="increase_arrow"
                                                                className="w-4 h-4"
                                                            />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="py-4 md:px-4 px-1 text-gray-600">
                                                    ${(parseFloat(product.price) * cartItem.quantity).toFixed(2)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
                            <button 
                                onClick={() => router.push('/all-products')} 
                                className="bg-josseypink1 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition"
                            >
                                Start Shopping
                            </button>
                        </div>
                    )}
                    
                    <button onClick={() => router.push('/all-products')} className="group flex items-center mt-6 gap-2 text-josseypink1">
                        <Image
                            className="group-hover:-translate-x-1 transition"
                            src={assets.arrow_right_icon_colored}
                            alt="arrow_right_icon_colored"
                        />
                        Continue Shopping
                    </button>
                </div>
                
                {displayCart.items && displayCart.items.length > 0 && (
                    <OrderSummary />
                )}
            </div>
        </>
    );
};

export default Cart;