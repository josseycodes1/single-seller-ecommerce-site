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
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch featured products: ${response.status}`);
      }
      
      const data = await response.json();
      
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

  const getOptimizedCloudinaryUrl = (url, width = 500, height = 500) => {
    if (!url || !isCloudinaryUrl(url)) return url
    
    const optimizationParams = `c_fill,w_${width},h_${height},q_auto,f_auto`
    return url.replace('/upload/', `/upload/${optimizationParams}/`)
  }

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-medium">Featured Products</h2>
            <div className="w-28 h-0.5 bg-josseypink2 mx-auto mt-2"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-12">
            {[1, 2, 3].map((id) => (
              <div key={id} className="relative group animate-pulse">
                <div className="w-full h-80 bg-gray-200 rounded-xl"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                  <div className="h-10 bg-gray-300 rounded w-32"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error && featuredProducts.length === 0) {
    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-medium">Featured Products</h2>
            <div className="w-28 h-0.5 bg-josseypink2 mx-auto mt-2"></div>
          </div>
          <div className="text-center text-gray-500">
            <p>Unable to load featured products. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-medium">Featured Products</h2>
          <div className="w-28 h-0.5 bg-josseypink2 mx-auto mt-2"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14">
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
              <div key={product.id} className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Image container with fixed height */}
                <div className="relative h-80 w-full">
                  {isCloudinaryUrl(imageSrc) ? (
                    <img
                      src={imageSrc}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <Image
                      src={imageSrc}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      width={500}
                      height={500}
                    />
                  )}
                  {/* Gradient overlay for better text visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                </div>
                
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-3">
                  <h3 className="font-bold text-xl">{title}</h3>
                  <p className="text-sm leading-relaxed opacity-90">
                    {description}
                  </p>
                  <button className="flex items-center gap-2 bg-josseypink2 hover:bg-josseypink1 transition-colors duration-200 px-5 py-2.5 rounded-full font-medium mt-2">
                    Buy now <span className="text-lg">😊</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProduct;