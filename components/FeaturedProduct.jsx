import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const FeaturedProduct = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
      const url = `${base}/api/products/?is_featured=true&limit=3`;

          console.log('Fetching from URL:', url); 

      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch featured products: ${response.status}`);
      }
      
      const data = await response.json();

          console.log('API Response:', data); 

      
      const products = Array.isArray(data) ? data : data.results || [];
      
      setFeaturedProducts(products);
    } catch (err) {
      console.error('Error fetching featured products:', err);
      setError(err.message);
      
      setFeaturedProducts([
        {
          id: 1,
          image: assets.girl_with_headphone_image,
          title: "Unparalleled Sound",
          description: "Experience crystal-clear audio with premium headphones.",
        },
        {
          id: 2,
          image: assets.girl_with_earphone_image,
          title: "Stay Connected",
          description: "Compact and stylish earphones for every occasion.",
        },
        {
          id: 3,
          image: assets.boy_with_laptop_image,
          title: "Power in Every Pixel",
          description: "Shop the latest laptops for work, gaming, and more.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const isCloudinaryUrl = (url) => {
    return url && url.includes('cloudinary.com');
  }

  const getOptimizedCloudinaryUrl = (url, width = 400, height = 400) => {
    if (!url || !isCloudinaryUrl(url)) return url
    
    const optimizationParams = `c_fill,w_${width},h_${height},q_auto,f_auto`
    return url.replace('/upload/', `/upload/${optimizationParams}/`)
  }

  if (loading) {
    return (
      <div className="mt-14">
        <div className="flex flex-col items-center">
          <p className="text-3xl font-medium">Featured Products</p>
          <div className="w-28 h-0.5 bg-josseypink2 mt-2"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-12 md:px-14 px-4">
          {[1, 2, 3].map((id) => (
            <div key={id} className="relative group animate-pulse">
              <div className="w-full h-64 bg-gray-200 rounded-lg"></div>
              <div className="absolute bottom-8 left-8 space-y-2">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-10 bg-gray-300 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && featuredProducts.length === 0) {
    return (
      <div className="mt-14">
        <div className="flex flex-col items-center">
          <p className="text-3xl font-medium">Featured Products</p>
          <div className="w-28 h-0.5 bg-josseypink2 mt-2"></div>
        </div>
        <div className="text-center mt-8 text-gray-500">
          <p>Unable to load featured products. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-14">
      <div className="flex flex-col items-center">
        <p className="text-3xl font-medium">Featured Products</p>
        <div className="w-28 h-0.5 bg-josseypink2 mt-2"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-12 md:px-14 px-4">
        {featuredProducts.map((product) => {
          
          let imageSrc;
          let title;
          let description;
          
          if (product.images && product.images.length > 0 && product.images[0].image_url) {
            
            imageSrc = getOptimizedCloudinaryUrl(product.images[0].image_url);
            title = product.name;
            description = product.description.length > 100 
              ? `${product.description.substring(0, 100)}...` 
              : product.description;
          } else {
            
            imageSrc = product.image;
            title = product.title;
            description = product.description;
          }
          
          return (
            <div key={product.id} className="relative group overflow-hidden rounded-lg">
              {/* Image container with overlay */}
              <div className="relative w-full h-64">
                {isCloudinaryUrl(imageSrc) ? (
                  <img
                    src={imageSrc}
                    alt={title}
                    className="w-full h-full object-cover group-hover:brightness-75 transition duration-300"
                  />
                ) : (
                  <Image
                    src={imageSrc}
                    alt={title}
                    className="w-full h-full object-cover group-hover:brightness-75 transition duration-300"
                    width={400}
                    height={400}
                  />
                )}
                {/* Simple dark overlay for text visibility */}
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
              
              {/* Content */}
              <div className="group-hover:-translate-y-4 transition duration-300 absolute bottom-8 left-8 text-white space-y-2">
                <p className="font-medium text-xl lg:text-2xl">{title}</p>
                <p className="text-sm lg:text-base leading-5 max-w-60">
                  {description}
                </p>
                <button className="flex items-center gap-1.5 bg-josseypink2 px-4 py-2 rounded">
                  Buy now <Image className="h-3 w-3" src={assets.redirect_icon} alt="Redirect Icon" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedProduct;