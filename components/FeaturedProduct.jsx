"use client";

import Link from "next/link";
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";

export default function FeaturedProducts({ products = [] }) {
  const { addToCart } = useAppContext();
  const [addingToCart, setAddingToCart] = useState({});

  const handleAddToCart = async (product, e) => {
    e.stopPropagation();
    e.preventDefault();

    // 🚀 Prevent duplicate clicks for this product
    if (addingToCart[product.id]) return;

    setAddingToCart((prev) => ({ ...prev, [product.id]: true }));

    const color = product.colors?.[0] || "default";
    const result = await addToCart(product.id, 1, color);

    if (result?.success) {
      console.log(`✅ Product ${product.id} added to cart`);
    }

    setAddingToCart((prev) => ({ ...prev, [product.id]: false }));
  };

  return (
    <section className="bg-[#EFD9D9] py-10 md:py-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Featured Products
          </h2>
          <p className="mt-2 text-gray-600">
            Explore our handpicked selection of premium items.
          </p>
        </div>

        {/* Products grid */}
        {Array.isArray(products) && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {products.map((product) => (
              <div key={product.id} className="flex flex-col">
                {/* Product card (clickable link) */}
                <Link
                  href={`/product/${product.id}`}
                  className="relative group overflow-hidden rounded-lg block bg-gray-100"
                >
                  {/* Image */}
                  <div className="relative w-full h-64">
                    {product.images?.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Text content */}
                  <div className="group-hover:-translate-y-4 transition duration-300 absolute bottom-8 left-8 text-white space-y-2">
                    <p className="font-medium text-xl lg:text-2xl">
                      {product.name}
                    </p>
                    <p className="text-sm lg:text-base leading-5 max-w-60">
                      {product.description}
                    </p>
                  </div>
                </Link>

                {/* Add to Cart (outside the Link) */}
                <div className="mt-3">
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={addingToCart[product.id]}
                    className="flex items-center gap-1.5 bg-josseypink2 text-white px-4 py-2 rounded hover:bg-josseypink2/90 transition-colors"
                  >
                    {addingToCart[product.id] ? "Adding..." : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No featured products available.</p>
        )}
      </div>
    </section>
  );
}
