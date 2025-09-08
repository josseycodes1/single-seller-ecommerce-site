import React from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';

const ProductCard = ({ product }) => {
    const { currency, router } = useAppContext()

    
    const productImage = product.images && product.images.length > 0 
        ? product.images[0] 
        : product.image && product.image.length > 0 
            ? product.image[0] 
            : assets.placeholder_image || "/placeholder-product.png"

    return (
        <div
            onClick={() => { 
                router.push('/product/' + (product.id || product._id)); 
                window.scrollTo(0, 0) 
            }}
            className="flex flex-col items-start gap-0.5 max-w-[200px] w-full cursor-pointer"
        >
            <div className="cursor-pointer group relative bg-pink-50 rounded-lg w-full h-52 flex items-center justify-center">
                <Image
                    src={productImage}
                    alt={product.name || "Product"}
                    className="group-hover:scale-105 transition object-cover w-4/5 h-4/5 md:w-full md:h-full"
                    width={800}
                    height={800}
                    onError={(e) => {
                        e.target.src = "/placeholder-product.png"; 
                    }}
                />
                <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md">
                    <Image
                        className="h-3 w-3"
                        src={assets.heart_icon}
                        alt="heart_icon"
                    />
                </button>
            </div>

            <p className="md:text-base font-medium pt-2 w-full truncate text-gray-700">
                {product.name || "Unnamed Product"}
            </p>
            <p className="w-full text-xs text-gray-500/70 max-sm:hidden truncate">
                {product.description || "No description available"}
            </p>
            <div className="flex items-center gap-2">
                <p className="text-xs">{product.rating || 4.5}</p>
                <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Image
                            key={index}
                            className="h-3 w-3"
                            src={
                                index < Math.floor(product.rating || 4)
                                    ? assets.star_icon
                                    : assets.star_dull_icon
                            }
                            alt="star_icon"
                        />
                    ))}
                </div>
            </div>

            <div className="flex items-end justify-between w-full mt-1">
                <p className="text-base font-medium text-gray-700">
                    {currency}{product.offerPrice || product.price || "N/A"}
                </p>
                <button 
                    onClick={(e) => {
                        e.stopPropagation(); 
                        
                    }}
                    className="max-sm:hidden px-4 py-1.5 text-white border border-gray-500/20 rounded-full text-xs hover:bg-josseypink2 bg-josseypink2 transition"
                >
                    Buy now
                </button>
            </div>
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