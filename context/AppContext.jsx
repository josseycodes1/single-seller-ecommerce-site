'use client'
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY
    const router = useRouter()
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

    const [products, setProducts] = useState([])
    const [userData, setUserData] = useState(null)
    const [isSeller, setIsSeller] = useState(true)
    const [cart, setCart] = useState(null) 
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    
    const getOrCreateCartId = () => {
        if (typeof window === 'undefined') return null;
        
        let cartId = localStorage.getItem('cart_id');
        if (!cartId) {
            
            cartId = 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('cart_id', cartId);
            
            
            createCartOnBackend(cartId);
        }
        return cartId;
    }

    
    const createCartOnBackend = async (cartId) => {
        try {
            await fetch(`${API_BASE_URL}/api/cart/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: cartId }) 
            });
        } catch (error) {
            console.error("Failed to create cart on backend:", error);
        }
    }

    
    const fetchCart = async () => {
        try {
            const cartId = getOrCreateCartId();
            if (!cartId) return;

            const response = await fetch(`${API_BASE_URL}/api/cart/?cart_id=${cartId}`);
            
            if (response.ok) {
                const cartData = await response.json();
                setCart(cartData);
            } else if (response.status === 404) {
                
                await createCartOnBackend(cartId);
                
                const retryResponse = await fetch(`${API_BASE_URL}/api/cart/?cart_id=${cartId}`);
                if (retryResponse.ok) {
                    const cartData = await retryResponse.json();
                    setCart(cartData);
                }
            }
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        }
    }

   
    const addToCart = async (productId, quantity = 1) => {
        try {
            const cartId = getOrCreateCartId();
            
            const response = await fetch(`${API_BASE_URL}/api/cart/items/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cart_id: cartId,
                    product_id: productId,
                    quantity: quantity
                })
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
            console.error("Failed to add to cart:", error);
            return { success: false, error: error.message };
        }
    }

    
    const updateCartQuantity = async (itemId, quantity) => {
        try {
            const cartId = getOrCreateCartId();
            
            if (quantity === 0) {
                
                return await removeFromCart(itemId);
            }

            const response = await fetch(`${API_BASE_URL}/api/cart/items/${itemId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cart_id: cartId,
                    quantity: quantity
                })
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
            console.error("Failed to update cart quantity:", error);
            return { success: false, error: error.message };
        }
    }

    
    const removeFromCart = async (itemId) => {
        try {
            const cartId = getOrCreateCartId();
            
            const response = await fetch(`${API_BASE_URL}/api/cart/items/${itemId}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cart_id: cartId
                })
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
            console.error("Failed to remove from cart:", error);
            return { success: false, error: error.message };
        }
    }

    
    const clearCart = async () => {
        try {
            const cartId = getOrCreateCartId();
            
            const response = await fetch(`${API_BASE_URL}/api/cart/clear/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cart_id: cartId
                })
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
            console.error("Failed to clear cart:", error);
            return { success: false, error: error.message };
        }
    }

    
    const getCartCount = () => {
        return cart ? cart.total_quantity : 0;
    }

    
    const getCartAmount = () => {
        return cart ? parseFloat(cart.total_price) : 0;
    }

    
    const getCartItemsMap = () => {
        if (!cart || !cart.items) return {};
        
        const cartItemsMap = {};
        cart.items.forEach(item => {
            cartItemsMap[item.product.id] = item.quantity;
        });
        return cartItemsMap;
    }

    const fetchProductData = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${API_BASE_URL}/api/products/`)
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            const data = await response.json()
            setProducts(data) 
        } catch (error) {
            console.error("Failed to fetch products:", error)
            setError("Failed to load products. Please try again later.")
        } finally {
            setLoading(false)
        }
    }

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('auth_token') 
            
            if (!token) {
                setUserData(null)
                return
            }
            
            const response = await fetch(`${API_BASE_URL}/api/user/profile/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            
            if (response.ok) {
                const userData = await response.json()
                setUserData(userData)
                setIsSeller(userData.is_seller || false)
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error)
        }
    }

    useEffect(() => {
        fetchProductData()
        fetchUserData()
        fetchCart()
    }, [])

    const value = {
        currency, router,
        isSeller, setIsSeller,
        userData, fetchUserData,
        products, fetchProductData,
        cart, setCart, 
        cartItems: getCartItemsMap(), 
        addToCart, updateCartQuantity,
        removeFromCart, clearCart,
        getCartCount, getCartAmount,
        loading, error,
        fetchCart 
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}