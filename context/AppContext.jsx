'use client'
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = (props) => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY;
    const router = useRouter();
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const [products, setProducts] = useState([]);
    const [userData, setUserData] = useState(null);
    const [isSeller, setIsSeller] = useState(true);
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartLoading, setCartLoading] = useState(false);
    const [toasts, setToasts] = useState([]);

    // 🔹 Toast system
    const addToast = (message, type = 'success', duration = 3000) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type, duration }]);
        setTimeout(() => removeToast(id), duration);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const ToastContainer = () => (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`p-4 rounded-lg shadow-lg border-l-4 min-w-80 ${
                        toast.type === 'success'
                            ? 'bg-green-50 border-green-500 text-green-700'
                            : toast.type === 'error'
                            ? 'bg-red-50 border-red-500 text-red-700'
                            : 'bg-blue-50 border-blue-500 text-blue-700'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span>{toast.message}</span>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="ml-4 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    // 🔹 Create or get cart from backend
    const getOrCreateCartId = async () => {
        if (typeof window === 'undefined') return null;

        let cartId = localStorage.getItem('cart_id');

        // 🚨 Remove old fake IDs like "cart_123..."
        if (cartId && cartId.startsWith("cart_")) {
            localStorage.removeItem('cart_id');
            cartId = null;
        }

        if (!cartId) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/cart/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" }
                });

                if (response.ok) {
                    const cartData = await response.json();
                    cartId = cartData.id; // UUID from backend
                    localStorage.setItem('cart_id', cartId);
                    setCart(cartData);
                } else {
                    console.error("❌ Failed to create cart on backend");
                    return null;
                }
            } catch (error) {
                console.error("❌ Error creating cart:", error);
                return null;
            }
        }
        return cartId;
    };

    // 🔹 Fetch cart data
    const fetchCart = async () => {
        try {
            const cartId = await getOrCreateCartId();
            if (!cartId) return;

            const response = await fetch(`${API_BASE_URL}/api/cart/?cart_id=${cartId}`);
            if (response.ok) {
                const cartData = await response.json();
                setCart(cartData);
            } else {
                console.error("❌ Failed to fetch cart");
            }
        } catch (error) {
            console.error("❌ Failed to fetch cart:", error);
        }
    };

    // 🔹 Add item to cart
    const addToCart = async (productId, quantity = 1, color = null, showToast = true) => {
        try {
            setCartLoading(true);
            const cartId = await getOrCreateCartId();

            const response = await fetch(`${API_BASE_URL}/api/cart/items/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cart_id: cartId, // UUID
                    product_id: productId,
                    quantity,
                    color,
                })
            });

            if (response.ok) {
                const updatedCart = await response.json();
                setCart(updatedCart);

                if (showToast) {
                    addToast("Item added to cart!", "success");
                }
                return { success: true, cart: updatedCart };
            } else {
                const errorData = await response.json();
                if (showToast) addToast(errorData.detail || "Failed to add item", "error");
                return { success: false, error: errorData };
            }
        } catch (error) {
            console.error("❌ Failed to add to cart:", error);
            if (showToast) addToast("Network error. Please try again.", "error");
            return { success: false, error: error.message };
        } finally {
            setCartLoading(false);
        }
    };

    // 🔹 Update cart quantity
    const updateCartQuantity = async (itemId, quantity, showToast = false) => {
        try {
            setCartLoading(true);
            const cartId = await getOrCreateCartId();

            if (quantity === 0) return await removeFromCart(itemId, showToast);

            const response = await fetch(`${API_BASE_URL}/api/cart/items/${itemId}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart_id: cartId, quantity })
            });

            if (response.ok) {
                const updatedCart = await response.json();
                setCart(updatedCart);
                if (showToast) addToast("Cart updated!", "success");
                return { success: true, cart: updatedCart };
            } else {
                const errorData = await response.json();
                if (showToast) addToast(errorData.detail || "Failed to update cart", "error");
                return { success: false, error: errorData };
            }
        } catch (error) {
            console.error("❌ Failed to update cart:", error);
            if (showToast) addToast("Network error. Please try again.", "error");
            return { success: false, error: error.message };
        } finally {
            setCartLoading(false);
        }
    };

    // 🔹 Remove item
    const removeFromCart = async (itemId, showToast = true) => {
        try {
            setCartLoading(true);
            const cartId = await getOrCreateCartId();

            const response = await fetch(`${API_BASE_URL}/api/cart/items/${itemId}/`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart_id: cartId })
            });

            if (response.ok) {
                const updatedCart = await response.json();
                setCart(updatedCart);
                if (showToast) addToast("Item removed from cart", "success");
                return { success: true, cart: updatedCart };
            } else {
                const errorData = await response.json();
                if (showToast) addToast(errorData.detail || "Failed to remove item", "error");
                return { success: false, error: errorData };
            }
        } catch (error) {
            console.error("❌ Failed to remove from cart:", error);
            if (showToast) addToast("Network error. Please try again.", "error");
            return { success: false, error: error.message };
        } finally {
            setCartLoading(false);
        }
    };

    // 🔹 Clear cart
    const clearCart = async () => {
        try {
            const cartId = await getOrCreateCartId();
            const response = await fetch(`${API_BASE_URL}/api/cart/clear/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart_id: cartId })
            });

            if (response.ok) {
                const updatedCart = await response.json();
                setCart(updatedCart);
                return { success: true, cart: updatedCart };
            } else {
                const errorData = await response.json();
                return { success: false, error: errorData };
            }
        } catch (error) {
            console.error("❌ Failed to clear cart:", error);
            return { success: false, error: error.message };
        }
    };

    // 🔹 Helpers
    const getCartCount = () => (cart ? cart.total_quantity : 0);
    const getCartAmount = () => (cart ? parseFloat(cart.total_price) : 0);

    // 🔹 Fetch products + user + cart on load
    useEffect(() => {
        fetchProductData();
        fetchUserData();
        fetchCart();
    }, []);

    const fetchProductData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/products/`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("❌ Failed to fetch products:", error);
            setError("Failed to load products. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                setUserData(null);
                return;
            }
            const response = await fetch(`${API_BASE_URL}/api/user/profile/`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            if (response.ok) {
                const data = await response.json();
                setUserData(data);
                setIsSeller(data.is_seller || false);
            }
        } catch (error) {
            console.error("❌ Failed to fetch user data:", error);
        }
    };

    // 🔹 Expose context
    const value = {
        currency, router,
        isSeller, setIsSeller,
        userData, fetchUserData,
        products, fetchProductData,
        cart, setCart,
        addToCart, updateCartQuantity,
        removeFromCart, clearCart,
        getCartCount, getCartAmount,
        loading, error,
        fetchCart,
        cartLoading,
        addToast,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
            <ToastContainer />
        </AppContext.Provider>
    );
};
