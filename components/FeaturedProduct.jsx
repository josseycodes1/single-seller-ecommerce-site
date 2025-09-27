'use client'
import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";

const FeaturedProduct = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { addToCart } = useAppContext();

  // Track loading state per product
  const [addingToCart, setAddingToCart] = useState({});

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
      const url = `${base}/api/products/?is_featured=true&limit=3`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch featured products: ${response.status}`);
      }

      const data = await response.json();
      const products = Array.isArray(data) ? data : data.results || [];
      const featuredOnly = products.filter((p) => p.is_featured === true);
      setFeaturedProducts(featuredOnly.slice(0, 3));
    } catch (err) {
      console.error("Error fetching featured products:", err);
      setError(err.message);
      setFeaturedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const isCloudinaryUrl = (url) => url && url.includes("cloudinary.com");
  const getOptimizedCloudinaryUrl = (url, width = 400, height = 400) => {
    if (!url || !isCloudinaryUrl(url)) return url;
    const optimizationParams = `c_fill,w_${width},h_${height},q_auto,f_auto`;
    return url.replace("/upload/", `/upload/${optimizationParams}/`);
  };

  const handleAddToCart = async (productId) => {
    setAddingToCart(prev => ({ ...prev, [productId]: true }));
    const result = await addToCart(productId, 1);
    if (result.success) {
      console.log("Product added to cart ✅");
    }
    setAddingToCart(prev => ({ ...prev, [productId]: false }));
  };

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
          const imageSrc =
            product.images && product.images.length > 0 && product.images[0].image_url
              ? getOptimizedCloudinaryUrl(product.images[0].image_url)
              : assets.placeholder_image;

          const title = product.name;
          const description =
            product.description && product.description.length > 100
              ? `${product.description.substring(0, 100)}...`
              : product.description;

          return (
            <div key={product.id} className="relative group overflow-hidden rounded-lg">
              {/* Image */}
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
                <div className="absolute inset-0 bg-black/30"></div>
              </div>

              {/* Content */}
              <div className="group-hover:-translate-y-4 transition duration-300 absolute bottom-8 left-8 text-white space-y-2">
                <p className="font-medium text-xl lg:text-2xl">{title}</p>
                <p className="text-sm lg:text-base leading-5 max-w-60">{description}</p>

                <button
                  onClick={() => handleAddToCart(product.id)}
                  disabled={addingToCart[product.id]}
                  className="flex items-center gap-1.5 bg-josseypink2 px-4 py-2 rounded"
                >
                  {addingToCart[product.id] ? "Adding..." : "Add to Cart"}
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
