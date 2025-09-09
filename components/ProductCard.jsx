import React, { useState, useEffect } from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image'
import { useAppContext } from '@/context/AppContext'

const ProductCard = ({ product: initialProduct = null, productId: propProductId = null }) => {
  const { currency, router } = useAppContext()
  const [product, setProduct] = useState(initialProduct)
  const [loading, setLoading] = useState(!initialProduct && !!propProductId)
  const [error, setError] = useState(null)
  const [hovered, setHovered] = useState(false)

  // image fallback
  const placeholder = assets?.diffuser5 || '/diffuser5.png'

  // Fetch product from backend if we weren't given it via props
  useEffect(() => {
    // ... (same fetch logic as before)
  }, [initialProduct, propProductId])

  // simple loader / skeleton
  if (loading) {
    return (
      <div className="max-w-[200px] w-full animate-pulse">
        <div className="rounded-lg bg-gray-200 w-full h-52" />
        <div className="h-4 mt-2 bg-gray-200 rounded w-3/4" />
        <div className="h-3 mt-2 bg-gray-200 rounded w-1/2" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-[200px] w-full p-2 border rounded">
        <p className="text-xs text-red-600">Error loading product</p>
        <p className="text-xs text-gray-500 truncate">{error}</p>
      </div>
    )
  }

  if (!product) {
    return null // nothing to render
  }

  // Now images are simple URLs from the backend
  const productImages = product.images?.map(img => img.image_url).filter(Boolean) || []
  const mainImage = productImages[0] || placeholder
  const hoverImage = productImages[1] || mainImage

  const productName = product.name || 'Unnamed Product'
  const productDescription = product.description || 'No description available'
  const productRating = product.avg_rating || product.rating || 4.5
  const productPrice = parseFloat(product.offer_price || product.price || 0) || 0
  const originalPrice = product.price ? parseFloat(product.price) : null

  const idFromProduct = product.id || product._id || propProductId
  const hasValidId = !!idFromProduct

  // image error fallbacks
  const [mainImgError, setMainImgError] = useState(false)
  const [hoverImgError, setHoverImgError] = useState(false)

  return (
    <div
      onClick={() => {
        if (hasValidId) {
          router.push('/product/' + idFromProduct)
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
          src={mainImgError ? placeholder : mainImage}
          alt={productName}
          className={`absolute inset-0 object-cover w-full h-full transition-opacity duration-300 ${hovered ? 'opacity-0' : 'opacity-100'}`}
          width={200}
          height={200}
          onError={() => setMainImgError(true)}
        />

        {/* Hover image */}
        <Image
          src={hoverImgError ? placeholder : hoverImage}
          alt={`${productName} hover`}
          className={`absolute inset-0 object-cover w-full h-full transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}
          width={200}
          height={200}
          onError={() => setHoverImgError(true)}
        />

        {/* Wishlist button */}
        <button
          className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
          onClick={(e) => {
            e.stopPropagation()
            // wishlist logic
          }}
        >
          <Image className="h-3 w-3" src={assets.heart_icon} alt="Add to wishlist" width={12} height={12} />
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
              alt={index < Math.floor(productRating) ? 'Filled star' : 'Empty star'}
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
          <p className="text-base font-medium text-gray-700">
            {currency}
            {productPrice.toFixed(2)}
          </p>
          {originalPrice && productPrice < originalPrice && (
            <p className="text-xs text-gray-400 line-through">
              {currency}
              {originalPrice.toFixed(2)}
            </p>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            // Add to cart logic
            console.log('Add to cart:', idFromProduct)
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
            <span className={product.stock > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
              {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
            </span>
          </div>
          {product.stock > 0 && product.stock < 10 && (
            <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
              <div className="bg-yellow-500 h-1 rounded-full" style={{ width: `${(product.stock / 10) * 100}%` }} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ProductCard