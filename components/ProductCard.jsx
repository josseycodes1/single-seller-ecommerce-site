import React from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';

const ProductCard = ({ product }) => {
    const { currency, router } = useAppContext()

    // Handle image URL properly with comprehensive checks for Cloudinary
    const getProductImage = () => {
        // If no image at all, return placeholder
        if (!product.image && (!product.images || product.images.length === 0)) {
            return assets.placeholder_image || "/placeholder-product.png";
        }
        
        // Handle single image (could be string or object)
        if (product.image) {
            // If it's a Cloudinary URL or valid URL string
            if (typeof product.image === 'string') {
                if (product.image.startsWith('http')) {
                    return product.image;
                }
                // If it's a Cloudinary public_id, construct URL
                if (product.image.includes('/')) {
                    return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${product.image}`;
                }
            }
            // If it's an image object with url property
            if (typeof product.image === 'object' && product.image.url) {
                if (product.image.url.startsWith('http')) {
                    return product.image.url;
                }
                return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${product.image.url}`;
            }
            // If it's an image object with public_id property
            if (typeof product.image === 'object' && product.image.public_id) {
                return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${product.image.public_id}`;
            }
        }
        
        // Handle images array
        if (product.images && product.images.length > 0) {
            const firstImage = product.images[0];
            
            // If it's a string URL
            if (typeof firstImage === 'string') {
                if (firstImage.startsWith('http')) {
                    return firstImage;
                }
                return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${firstImage}`;
            }
            
            // If it's an image object with url property
            if (typeof firstImage === 'object' && firstImage.url) {
                if (firstImage.url.startsWith('http')) {
                    return firstImage.url;
                }
                return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${firstImage.url}`;
            }
            
            // If it's an image object with public_id property
            if (typeof firstImage === 'object' && firstImage.public_id) {
                return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${firstImage.public_id}`;
            }
        }
        
        // Final fallback
        return assets.placeholder_image || "/placeholder-product.png";
    }

    const productImage = getProductImage();
    const productName = product.name || "Unnamed Product";
    const productDescription = product.description || "No description available";
    
    // Ensure rating is a number
    const productRating = typeof product.rating === 'number' 
        ? product.rating 
        : typeof product.avg_rating === 'number' 
            ? product.avg_rating 
            : 4.5;
    
    // FIX: Ensure productPrice is a number before using toFixed()
    const productPrice = parseFloat(product.offerPrice || product.price || product.original_price || 0);
    const originalPrice = product.price ? parseFloat(product.price) : null;

    // Check if product has a valid ID
    const productId = product.id || product._id;
    const hasValidId = productId && typeof productId === 'string';

    return (
        <div
            onClick={() => { 
                if (hasValidId) {
                    router.push('/product/' + productId); 
                    window.scrollTo(0, 0);
                }
            }}
            className="flex flex-col items-start gap-0.5 max-w-[200px] w-full cursor-pointer"
        >
            <div className="cursor-pointer group relative bg-pink-50 rounded-lg w-full h-52 flex items-center justify-center overflow-hidden">
                <Image
                    src={productImage}
                    alt={productName}
                    className="group-hover:scale-105 transition-transform duration-300 object-cover w-4/5 h-4/5 md:w-full md:h-full"
                    width={200}
                    height={200}
                    onError={(e) => {
                        console.error("Image failed to load:", productImage);
                        e.target.src = assets.placeholder_image || "/placeholder-product.png";
                    }}
                />
                <button 
                    className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        // Add to wishlist functionality here
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

            <p className="md:text-base font-medium pt-2 w-full truncate text-gray-700">
                {productName}
            </p>
            
            <p className="w-full text-xs text-gray-500/70 max-sm:hidden truncate">
                {productDescription}
            </p>
            
            <div className="flex items-center gap-2 mt-1">
                <p className="text-xs font-medium">{productRating.toFixed(1)}</p>
                <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Image
                            key={index}
                            className="h-3 w-3"
                            src={
                                index < Math.floor(productRating)
                                    ? assets.star_icon
                                    : assets.star_dull_icon
                            }
                            alt={index < Math.floor(productRating) ? "Filled star" : "Empty star"}
                            width={12}
                            height={12}
                        />
                    ))}
                </div>
                <span className="text-xs text-gray-400">({product.review_count || 0})</span>
            </div>

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
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent navigating to product page
                        // Add to cart logic here
                        console.log("Add to cart:", productId);
                    }}
                    className="max-sm:hidden px-4 py-1.5 text-white border border-gray-500/20 rounded-full text-xs hover:bg-josseypink2 bg-josseypink2 transition-colors duration-200"
                >
                    Buy now
                </button>
            </div>
            
            {/* Stock status indicator */}
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


// import React from 'react'
// import { assets } from '@/assets/assets'
// import Image from 'next/image';
// import { useAppContext } from '@/context/AppContext';

// const ProductCard = ({ product }) => {

//     const { currency, router } = useAppContext()

//     return (
//         <div
//             onClick={() => { router.push('/product/' + product._id); scrollTo(0, 0) }}
//             className="flex flex-col items-start gap-0.5 max-w-[200px] w-full cursor-pointer"
//         >
//             <div className="cursor-pointer group relative bg-pink-50 rounded-lg w-full h-52 flex items-center justify-center">
//                 <Image
//                     src={product.image[0]}
//                     alt={product.name}
//                     className="group-hover:scale-105 transition object-cover w-4/5 h-4/5 md:w-full md:h-full"
//                     width={800}
//                     height={800}
//                 />
//                 <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md">
//                     <Image
//                         className="h-3 w-3"
//                         src={assets.heart_icon}
//                         alt="heart_icon"
//                     />
//                 </button>
//             </div>

//             <p className="md:text-base font-medium pt-2 w-full truncate text-gray-700">{product.name}</p>
//             <p className="w-full text-xs text-gray-500/70 max-sm:hidden truncate">{product.description}</p>
//             <div className="flex items-center gap-2">
//                 <p className="text-xs">{4.5}</p>
//                 <div className="flex items-center gap-0.5">
//                     {Array.from({ length: 5 }).map((_, index) => (
//                         <Image
//                             key={index}
//                             className="h-3 w-3"
//                             src={
//                                 index < Math.floor(4)
//                                     ? assets.star_icon
//                                     : assets.star_dull_icon
//                             }
//                             alt="star_icon"
//                         />
//                     ))}
//                 </div>
//             </div>

//             <div className="flex items-end justify-between w-full mt-1">
//                 <p className="text-base font-medium text-gray-700">{currency}{product.offerPrice}</p>
//                 <button className=" max-sm:hidden px-4 py-1.5 text-white border border-gray-500/20 rounded-full text-xs hover:bg-josseypink2 bg-josseypink2 transition">
//                     Buy now
//                 </button>
//             </div>
//         </div>
//     )
// }

// export default ProductCard