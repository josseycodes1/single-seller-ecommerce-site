'use client'
import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";

const FeaturedProduct = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useAppContext();
  const [addingToCart, setAddingToCart] = useState({});

  // fetch featured products
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

  // check if url is from cloudinary
  const isCloudinaryUrl = (url) => url && url.includes("cloudinary.com");

  // optimize cloudinary images
  const getOptimizedCloudinaryUrl = (url, width = 400, height = 400) => {
    if (!url || !isCloudinaryUrl(url)) return url;
    const optimizationParams = `c_fill,w_${width},h_${height},q_auto,f_auto`;
    return url.replace("/upload/", `/upload/${optimizationParams}/`);
  };

  // add to cart handler
  const handleAddToCart = async (product, e) => {
    e.stopPropagation(); // prevent triggering the card navigation
    e.preventDefault(); // prevent Link navigation

    const color = product.colors?.[0] || "default";
    setAddingToCart((prev) => ({ ...prev, [product.id]: true }));

    const result = await addToCart(product.id, 1, color);
    if (result.success) console.log("Product added to cart ✅");

    setAddingToCart((prev) => ({ ...prev, [product.id]: false }));
  };

  if (loading) return <p>Loading featured products...</p>;
  if (error && featuredProducts.length === 0) return <p>Unable to load featured products</p>;

  return (
    <div className="mt-14">
      {/* section title */}
      <div className="flex flex-col items-center">
        <p className="text-3xl font-medium text-gray-900">Featured Products</p>
        <div className="w-28 h-0.5 bg-josseypink2 mt-2"></div>
      </div>

      {/* products grid */}
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
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="relative group overflow-hidden rounded-lg block"
            >
              {/* product image */}
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

              {/* overlay details */}
              <div className="group-hover:-translate-y-4 transition duration-300 absolute bottom-8 left-8 text-white space-y-2">
                <p className="font-medium text-xl lg:text-2xl">{title}</p>
                <p className="text-sm lg:text-base leading-5 max-w-60">{description}</p>
                <button
                  onClick={(e) => handleAddToCart(product, e)}
                  disabled={addingToCart[product.id]}
                  className="flex items-center gap-1.5 bg-josseypink2 px-4 py-2 rounded"
                >
                  {addingToCart[product.id] ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedProduct;
