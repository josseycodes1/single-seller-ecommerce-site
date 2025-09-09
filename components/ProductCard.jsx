import React, { useState } from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image'
import { useAppContext } from '@/context/AppContext'

const ProductCard = ({ product }) => {
    const { currency, router } = useAppContext()
    const [hovered, setHovered] = useState(false)

    // Limit to 4 images max
    const productImages = Array.isArray(product.images) ? product.images.slice(0, 4) : []
    const placeholder = assets.placeholder_image || "/placeholder-product.png"

    // Default to first image, swap to second on hover
    const mainImage = productImages[0] || placeholder
    const hoverImage = productImages[1] || mainImage

    const productName = product.name || "Unnamed Product"
    const productDescription = product.description || "No description available"

    const productRating = typeof product.rating === 'number'
        ? product.rating
        : typeof product.avg_rating === 'number'
            ? product.avg_rating
            : 4.5

    const productPrice = parseFloat(product.offerPrice || product.price || product.original_price || 0)
    const originalPrice = product.price ? parseFloat(product.price) : null

    const productId = product.id || product._id
    const hasValidId = !!productId

    return (
        <div
            onClick={() => {
                if (hasValidId) {
                    router.push('/product/' + productId)
                    window.scrollTo(0, 0)
                }
            }}
            className="flex flex-col items-start gap-0.5 max-w-[200px] w-full cursor-pointer"
        >
            {/* Product Image with hover swap */}
            <div
                className="cursor-pointer group relative bg-pink-50 rounded-lg w-full h-52 flex items-center justify-center overflow-hidden"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {/* Main image */}
                <Image
                    src={mainImage}
                    alt={productName}
                    className={`absolute inset-0 object-cover w-full h-full transition-opacity duration-300 ${hovered ? "opacity-0" : "opacity-100"}`}
                    width={200}
                    height={200}
                    onError={(e) => { e.currentTarget.src = placeholder }}
                />
                {/* Hover image */}
                <Image
                    src={hoverImage}
                    alt={productName + " hover"}
                    className={`absolute inset-0 object-cover w-full h-full transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}
                    width={200}
                    height={200}
                    onError={(e) => { e.currentTarget.src = placeholder }}
                />

                {/* Wishlist button */}
                <button
                    className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
                    onClick={(e) => {
                        e.stopPropagation()
                        // wishlist logic
                    }}
                >
                    <Image
                        className="h-3 w-3"
                        src={assets.heart_icon}
                        alt="Add to wishlist"
                        width={12}
                        height={12}
                    />
                </button>
            </div>

            {/* Product Info */}
            <p className="md:text-base font-medium pt-2 w-full truncate text-gray-700">{productName}</p>
            <p className="w-full text-xs text-gray-500/70 max-sm:hidden truncate">{productDescription}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-1">
                <p className="text-xs font-medium">{productRating.toFixed(1)}</p>
                <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Image
                            key={index}
                            className="h-3 w-3"
                            src={index < Math.floor(productRating) ? assets.star_icon : assets.star_dull_icon}
                            alt={index < Math.floor(productRating) ? "Filled star" : "Empty star"}
                            width={12}
                            height={12}
                        />
                    ))}
                </div>
                <span className="text-xs text-gray-400">({product.review_count || 0})</span>
            </div>

            {/* Price + Buy Button */}
            <div className="flex items-end justify-between w-full mt-2">
                <div className="flex flex-col">
                    <p className="text-base font-medium text-gray-700">{currency}{productPrice.toFixed(2)}</p>
                    {originalPrice && productPrice < originalPrice && (
                        <p className="text-xs text-gray-400 line-through">
                            {currency}{originalPrice.toFixed(2)}
                        </p>
                    )}
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        console.log("Add to cart:", productId)
                    }}
                    className="max-sm:hidden px-4 py-1.5 text-white border border-gray-500/20 rounded-full text-xs hover:bg-josseypink2 bg-josseypink2 transition-colors duration-200"
                >
                    Buy now
                </button>
            </div>

            {/* Stock Indicator */}
            {product.stock !== undefined && (
                <div className="w-full mt-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Stock:</span>
                        <span className={product.stock > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                            {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
                        </span>
                    </div>
                    {product.stock > 0 && product.stock < 10 && (
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                            <div
                                className="bg-yellow-500 h-1 rounded-full"
                                style={{ width: `${(product.stock / 10) * 100}%` }}
                            ></div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default ProductCard
