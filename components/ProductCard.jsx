'use client'
import React, { useState, useEffect } from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image'
import { useAppContext } from '@/context/AppContext'

const ProductCard = ({ product: initialProduct = null, productId: propProductId = null }) => {
  const { currency, router, addToCart } = useAppContext()
  const [product, setProduct] = useState(initialProduct)
  const [loading, setLoading] = useState(!initialProduct && !!propProductId)
  const [error, setError] = useState(null)
  const [hovered, setHovered] = useState(false)
  const [imageErrors, setImageErrors] = useState({})
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    let controller = new AbortController()
    const signal = controller.signal

    if (initialProduct) {
      setProduct(initialProduct)
      setLoading(false)
      setError(null)
      return () => controller.abort()
    }

    if (!propProductId) {
      setLoading(false)
      setError(null)
      return () => controller.abort()
    }

    const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '')
    const url = `${base}/products/${propProductId}/`

    setLoading(true)
    setError(null)

    fetch(url, { method: 'GET', signal })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => '')
          throw new Error(`Failed to load product (${res.status}) ${text}`)
        }
        return res.json()
      })
      .then((data) => setProduct(data))
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Product fetch error:', err)
          setError(err.message || 'Failed to load product')
        }
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [initialProduct, propProductId])

  const parseRating = (value) => {
    if (value === null || value === undefined) return 4.5
    const num = typeof value === 'string' ? parseFloat(value) : Number(value)
    return isNaN(num) ? 4.5 : num
  }

  const parsePrice = (value) => {
    if (value === null || value === undefined) return 0
    const num = typeof value === 'string' ? parseFloat(value) : Number(value)
    return isNaN(num) ? 0 : num
  }

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

  if (!product) return null

  const productImages = product.images?.map(img => img.image_url).filter(Boolean) || []
  const mainImage = productImages[0] || null
  const hoverImage = productImages[1] || mainImage

  const productName = product.name || 'Unnamed Product'
  const productDescription = product.description || 'No description available'

  const productRating = parseRating(product.avg_rating || product.rating)
  const productPrice = parsePrice(product.offer_price || product.price)
  const originalPrice = product.price ? parsePrice(product.price) : null

  const idFromProduct = product.id || product._id || propProductId

  const handleImageError = (imageType) => {
    setImageErrors(prev => ({ ...prev, [imageType]: true }))
  }

  const isCloudinaryUrl = (url) => url && url.includes('cloudinary.com')
  const getOptimizedCloudinaryUrl = (url, width = 400, height = 400) => {
    if (!url || !isCloudinaryUrl(url)) return url
    const optimizationParams = `c_fill,w_${width},h_${height},q_auto,f_auto`
    return url.replace('/upload/', `/upload/${optimizationParams}/`)
  }

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (addingToCart) return;   // 🚀 lock so it won't fire twice

    setAddingToCart(true);
    const color = product.colors?.[0] || "default";
    const result = await addToCart(product.id, 1, color);
    if (result.success) {
      console.log("Product added to cart ✅");
    }
    setAddingToCart(false);
  };


  return (
    <div className="flex flex-col items-start gap-0.5 max-w-[200px] w-full">
      {/* Clickable area */}
      <div
        onClick={() => {
          if (idFromProduct) {
            router.push('/product/' + idFromProduct)
            window.scrollTo(0, 0)
          }
        }}
        className="cursor-pointer group relative bg-pink-50 rounded-lg w-full h-52 flex items-center justify-center overflow-hidden"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {mainImage && !imageErrors.main && (
          <Image
            src={getOptimizedCloudinaryUrl(mainImage)}
            alt={productName}
            className={`absolute inset-0 object-cover w-full h-full transition-opacity duration-300 ${hovered ? 'opacity-0' : 'opacity-100'}`}
            width={200}
            height={200}
            onError={() => handleImageError('main')}
            unoptimized={!isCloudinaryUrl(mainImage)}
          />
        )}
        {hoverImage && hoverImage !== mainImage && !imageErrors.hover && (
          <Image
            src={getOptimizedCloudinaryUrl(hoverImage)}
            alt={`${productName} hover`}
            className={`absolute inset-0 object-cover w-full h-full transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}
            width={200}
            height={200}
            onError={() => handleImageError('hover')}
            unoptimized={!isCloudinaryUrl(hoverImage)}
          />
        )}
        {(!mainImage || imageErrors.main) && (
          <div className="flex items-center justify-center w-full h-full bg-gray-100">
            <span className="text-gray-400 text-sm">No image available</span>
          </div>
        )}
      </div>

      <p className="md:text-base font-medium pt-2 w-full truncate text-gray-700">{productName}</p>
      <p className="w-full text-xs text-gray-500/70 truncate">{productDescription}</p>

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

      {/* Price + Add to Cart */}
      <div className="flex items-end justify-between w-full mt-2">
        <div className="flex flex-col">
          <p className="text-base font-medium text-gray-700">
            {currency}{productPrice.toFixed(2)}
          </p>
          {originalPrice && productPrice < originalPrice && (
            <p className="text-xs text-gray-400 line-through">
              {currency}{originalPrice.toFixed(2)}
            </p>
          )}
        </div>
        <button
          disabled={addingToCart}
          onClick={handleAddToCart}
          className="px-4 py-1.5 text-white border border-gray-500/20 rounded-full text-xs hover:bg-josseypink2 bg-josseypink2 transition-colors duration-200"
        >
          {addingToCart ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  )
}

export default ProductCard
