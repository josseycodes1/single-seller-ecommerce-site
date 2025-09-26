"use client"
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import React from "react";
import FeaturedProduct from "@/components/FeaturedProduct";
import toast from "react-hot-toast";



const Product = () => {
    const { id } = useParams();
    const { router, addToCart, currency } = useAppContext();
    const [mainImage, setMainImage] = useState(null);
    const [productData, setProductData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [imageErrors, setImageErrors] = useState({});
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedQuantity, setSelectedQuantity] = useState("");
    const [addToCartLoading, setAddToCartLoading] = useState(false);
    const [quantityError, setQuantityError] = useState("");
    const [buyNowLoading, setBuyNowLoading] = useState(false);


    const isCloudinaryUrl = (url) => {
        return url && url.includes('cloudinary.com');
    }

    const getOptimizedCloudinaryUrl = (url, width = 400, height = 400) => {
        if (!url || !isCloudinaryUrl(url)) return url
        const optimizationParams = `c_fill,w_${width},h_${height},q_auto,f_auto`
        return url.replace('/upload/', `/upload/${optimizationParams}/`)
    }
    
    const handleImageError = (imageType) => {
        setImageErrors(prev => ({ ...prev, [imageType]: true }));
    }

    const fetchProductData = async () => {
        try {
            setLoading(true);
            const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
            const url = `${base}/api/products/${id}/`; 
            
            console.log('Fetching product from:', url); 
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch product: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Product data received:', data); 
            setProductData(data);
            
        
            if (data.colors && data.colors.length > 0) {
                setSelectedColor(data.colors[0]);
            }
            
            if (data.images && data.images.length > 0) {
                setMainImage(data.images[0].image_url);
            }
            
            if (data.category) {
                fetchRelatedProducts(data.category);
            }
            
        } catch (err) {
            console.error('Error fetching product:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedProducts = async (categoryId) => {
        try {
            const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
            const url = `${base}/api/products/?category=${categoryId}&limit=5`;
            
            const response = await fetch(url);
            
            if (response.ok) {
                const data = await response.json();
                setRelatedProducts(Array.isArray(data) ? data : data.results || []);
            }
        } catch (err) {
            console.error('Error fetching related products:', err);
        }
    };

    useEffect(() => {
        if (id) {
            fetchProductData();
        }
    }, [id]);

        const handleAddToCart = async () => {
        if (!selectedColor) {
            toast.error("Please select a color");
            return;
        }

        if (!selectedQuantity || selectedQuantity < 1) {
            toast.error("Please enter a valid quantity");
            return;
        }

        if (selectedQuantity > productData.stock) {
            setQuantityError(`Only ${productData.stock} items available in stock`);
            return;
        }

        setAddToCartLoading(true);

        const result = await addToCart(productData.id, selectedQuantity, selectedColor, true);

        setAddToCartLoading(false);

        if (result.success) {
            toast.success(result.message || "Product added to cart successfully 🎉");
        } else {
            toast.error(result.message || "Failed to add product to cart ❌");
            console.error("Add to cart error:", result.error || result.message);
        }
    };


    const handleBuyNow = async () => {
        if (!selectedColor) {
            toast.error("Please select a color");
            return;
        }
        if (!selectedQuantity || Number(selectedQuantity) < 1) {
            toast.error("Please enter a valid quantity");
            return;
        }
        if (Number(selectedQuantity) > productData.stock) {
            setQuantityError(`Only ${productData.stock} items available in stock`);
            return;
        }

        setBuyNowLoading(true);
        try {
            const qty = Number(selectedQuantity);

          
            const result = await addToCart(productData.id, qty, selectedColor, false);

            if (result.success) {
                router.push("/cart");  
            } else {
                const backendMsg =
                    result.error?.detail ||
                    result.error?.errors ||
                    (typeof result.error === "string" ? result.error : null) ||
                    JSON.stringify(result.error) ||
                    "Failed to add product to cart";
                toast.error(backendMsg);
                console.error("BuyNow addToCart error:", result.error);
            }
        } catch (err) {
            console.error("BuyNow unexpected error:", err);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setBuyNowLoading(false);
        }
    };

    const handleQuantityInputChange = (e) => {
    const value = e.target.value;


    if (value === "") {
        setSelectedQuantity("");
        setQuantityError("");
        return;
    }

    const newQuantity = parseInt(value);

    if (isNaN(newQuantity) || newQuantity < 1) {
        setQuantityError("Quantity must be at least 1");
        setSelectedQuantity(1);
        return;
    }

    if (newQuantity > productData.stock) {
        setSelectedQuantity(productData.stock);
        setQuantityError(`Only ${productData.stock} items available in stock`);
        return;
    }

    setSelectedQuantity(newQuantity);
    setQuantityError("");
    }


    if (loading) {
        return <Loading />;
    }

    if (error || !productData) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center px-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-medium text-gray-800 mb-4">
                            Product Not Found
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {error || "The product you're looking for doesn't exist."}
                        </p>
                        <div className="mb-4">
                            <p className="text-sm text-gray-500">
                                Requested URL: {process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/{id}/
                            </p>
                        </div>
                        <button 
                            onClick={() => router.push('/')}
                            className="px-6 py-2 bg-josseypink2 text-white rounded hover:bg-josseypink1 transition"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const parsePrice = (value) => {
        if (value === null || value === undefined) return 0;
        const num = typeof value === 'string' ? parseFloat(value) : Number(value);
        return isNaN(num) ? 0 : num;
    };

    const productPrice = parsePrice(productData.offer_price || productData.price);
    const originalPrice = productData.price ? parsePrice(productData.price) : null;

    const productImages = productData.images?.map(img => img.image_url).filter(Boolean) || [];

    return (
        <>
            <Navbar />
            <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    {/* Product Images */}
                    <div className="px-5 lg:px-16 xl:px-20">
                        <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4 h-96 flex items-center justify-center">
                            {mainImage && !imageErrors.main ? (
                                <Image
                                    src={getOptimizedCloudinaryUrl(mainImage)}
                                    alt={productData.name}
                                    className="w-full h-full object-contain mix-blend-multiply"
                                    width={500}
                                    height={500}
                                    onError={() => handleImageError('main')}
                                    unoptimized={!isCloudinaryUrl(mainImage)}
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full">
                                    <span className="text-gray-400">No image available</span>
                                </div>
                            )}
                        </div>

                        {productImages.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {productImages.map((imageUrl, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setMainImage(imageUrl)}
                                        className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10 h-20 flex items-center justify-center"
                                    >
                                        <Image
                                            src={getOptimizedCloudinaryUrl(imageUrl, 80, 80)}
                                            alt={`${productData.name} thumbnail ${index + 1}`}
                                            className="w-full h-full object-contain mix-blend-multiply"
                                            width={80}
                                            height={80}
                                            onError={() => handleImageError(`thumb-${index}`)}
                                            unoptimized={!isCloudinaryUrl(imageUrl)}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
                            {productData.name}
                        </h1>
                        
                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Image
                                        key={star}
                                        className="h-4 w-4"
                                        src={star <= (productData.rating || 4.5) ? assets.star_icon : assets.star_dull_icon}
                                        alt={star <= (productData.rating || 4.5) ? "Filled star" : "Empty star"}
                                        width={16}
                                        height={16}
                                    />
                                ))}
                            </div>
                            <p>({parseFloat(productData.rating || 4.5).toFixed(1)})</p>
                            <span className="text-xs text-gray-400 ml-2">
                                ({productData.review_count || 0} reviews)
                            </span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 mt-3">
                            {productData.description}
                        </p>
                        
                        {/* Price */}
                        <p className="text-3xl font-medium mt-6">
                            {currency}
                            {productPrice.toFixed(2)}
                            {originalPrice && productPrice < originalPrice && (
                                <span className="text-base font-normal text-gray-800/60 line-through ml-2">
                                    {currency}
                                    {originalPrice.toFixed(2)}
                                </span>
                            )}
                        </p>
                        
                        {/* Stock Status */}
                        {productData.stock !== undefined && (
                            <div className="mt-4">
                                <span className={productData.stock > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                    {productData.stock > 0 ? `In stock (${productData.stock} available)` : 'Out of stock'}
                                </span>
                            </div>
                        )}
                        
                        <hr className="bg-gray-600 my-6" />
                        
                        {/* Product Selection Options */}
                        <div className="space-y-4">
                            {/* Color Selection */}
                            {productData?.colors && productData.colors.length > 0 && (
                                <div>
                                    <label className="block text-gray-600 font-medium mb-2">
                                        Select Color
                                    </label>
                                    <div className="flex gap-2 flex-wrap">
                                        {productData.colors.map((color, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedColor(color)}
                                                className={`px-4 py-2 rounded-full text-sm border transition ${
                                                    selectedColor === color
                                                        ? 'bg-josseypink2 text-white border-josseypink2'
                                                        : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
                                                }`}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity Selection */}
                            <div>
                                <label className="block text-gray-600 font-medium mb-2">
                                    Select Quantity
                                </label>
                                <div className="flex items-center gap-4">
                                    {/* Input field for manual quantity entry */}
                                    <input
                                    type="number"
                                    value={selectedQuantity}
                                    onChange={handleQuantityInputChange}
                                    placeholder="Enter quantity"
                                    min="1"
                                    max={productData.stock}
                                    className="border border-gray-300 rounded px-3 py-2 w-24"
                                    disabled={productData.stock === 0}
                                />
                                </div>
                                {quantityError && (
                                    <p className="text-red-500 text-sm mt-2">{quantityError}</p>
                                )}
                            </div>
                        </div>

                        {/* Product Details Table */}
                        <div className="overflow-x-auto mt-6">
                            <table className="table-auto border-collapse w-full max-w-72">
                                <tbody>

                                    {/* Available Colors */}
                                    {productData?.colors && (
                                        <tr>
                                            <td className="text-gray-600 font-medium py-2">Available Colors</td>
                                            <td className="text-gray-800/50 py-2 capitalize flex gap-2 flex-wrap">
                                                {productData.colors.length > 0 ? (
                                                    productData.colors.map((color, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-3 py-1 rounded-full text-sm border bg-gray-100"
                                                        >
                                                            {color}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-500">No colors</span>
                                                )}
                                            </td>
                                        </tr>
                                    )}

                                    {/* Category */}
                                    {productData.category && (
                                        <tr>
                                            <td className="text-gray-600 font-medium py-2">Category</td>
                                            <td className="text-gray-800/50 py-2 capitalize">
                                                <span className="font-medium">{productData.category.name}</span>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Add to Cart Buttons */}
                        <div className="flex items-center mt-10 gap-4">
                            <button 
                                onClick={handleAddToCart} 
                                disabled={productData.stock === 0 || addToCartLoading}
                                className={`w-full py-3.5 flex items-center justify-center ${
                                    productData.stock === 0 
                                        ? 'bg-gray-300 cursor-not-allowed' 
                                        : addToCartLoading
                                        ? 'bg-gray-400 cursor-wait'
                                        : 'bg-gray-100 text-gray-800/80 hover:bg-gray-200'
                                } transition`}
                            >
                                {addToCartLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Adding...
                                    </>
                                ) : productData.stock === 0 ? (
                                    'Out of Stock'
                                ) : (
                                    'Add to Cart'
                                )}
                            </button>
                            
                            <button 
                            onClick={handleBuyNow}
                            disabled={productData.stock === 0 || buyNowLoading}
                            className={`w-full py-3.5 flex items-center justify-center ${
                                productData.stock === 0 
                                    ? 'bg-gray-300 cursor-not-allowed' 
                                    : buyNowLoading
                                    ? 'bg-gray-400 cursor-wait text-white'
                                    : 'bg-josseypink2 text-white hover:bg-josseypink1'
                            } transition`}
                        >
                            {buyNowLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                'Buy now'
                            )}
                        </button>
                        </div>
                    </div>
                </div>
                
                {/* Related Products */}
                <FeaturedProduct />
            </div>
            <Footer />
        </>
    );
};

export default Product;