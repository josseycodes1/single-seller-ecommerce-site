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
    const [cartItems, setCartItems] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    
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

    const addToCart = async (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
    }

    const updateCartQuantity = async (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        setCartItems(cartData)
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            if (cartItems[items] > 0) {
                totalCount += cartItems[items];
            }
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product.id === items); 
            if (cartItems[items] > 0 && itemInfo) {
                totalAmount += itemInfo.offerPrice * cartItems[items];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    useEffect(() => {
        fetchProductData()
        fetchUserData()
    }, [])

    const value = {
        currency, router,
        isSeller, setIsSeller,
        userData, fetchUserData,
        products, fetchProductData,
        cartItems, setCartItems,
        addToCart, updateCartQuantity,
        getCartCount, getCartAmount,
        loading, error
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}


// 'use client'
// import { productsDummyData, userDummyData } from "@/assets/assets";
// import { useRouter } from "next/navigation";
// import { createContext, useContext, useEffect, useState } from "react";

// export const AppContext = createContext();

// export const useAppContext = () => {
//     return useContext(AppContext)
// }

// export const AppContextProvider = (props) => {

//     const currency = process.env.NEXT_PUBLIC_CURRENCY
//     const router = useRouter()

//     const [products, setProducts] = useState([])
//     const [userData, setUserData] = useState(false)
//     const [isSeller, setIsSeller] = useState(true)
//     const [cartItems, setCartItems] = useState({})

//     const fetchProductData = async () => {
//         setProducts(productsDummyData)
//     }

//     const fetchUserData = async () => {
//         setUserData(userDummyData)
//     }

//     const addToCart = async (itemId) => {

//         let cartData = structuredClone(cartItems);
//         if (cartData[itemId]) {
//             cartData[itemId] += 1;
//         }
//         else {
//             cartData[itemId] = 1;
//         }
//         setCartItems(cartData);

//     }

//     const updateCartQuantity = async (itemId, quantity) => {

//         let cartData = structuredClone(cartItems);
//         if (quantity === 0) {
//             delete cartData[itemId];
//         } else {
//             cartData[itemId] = quantity;
//         }
//         setCartItems(cartData)

//     }

//     const getCartCount = () => {
//         let totalCount = 0;
//         for (const items in cartItems) {
//             if (cartItems[items] > 0) {
//                 totalCount += cartItems[items];
//             }
//         }
//         return totalCount;
//     }

//     const getCartAmount = () => {
//         let totalAmount = 0;
//         for (const items in cartItems) {
//             let itemInfo = products.find((product) => product._id === items);
//             if (cartItems[items] > 0) {
//                 totalAmount += itemInfo.offerPrice * cartItems[items];
//             }
//         }
//         return Math.floor(totalAmount * 100) / 100;
//     }

//     useEffect(() => {
//         fetchProductData()
//     }, [])

//     useEffect(() => {
//         fetchUserData()
//     }, [])

//     const value = {
//         currency, router,
//         isSeller, setIsSeller,
//         userData, fetchUserData,
//         products, fetchProductData,
//         cartItems, setCartItems,
//         addToCart, updateCartQuantity,
//         getCartCount, getCartAmount
//     }

//     return (
//         <AppContext.Provider value={value}>
//             {props.children}
//         </AppContext.Provider>
//     )
// }