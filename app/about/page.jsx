"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import FeaturedProduct from "@/components/FeaturedProduct";
import Footer from "@/components/Footer";
import Image from "next/image";

const AboutUs = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(
          "https://josseycart-backend.onrender.com/api/products/"
        );
        const data = await res.json();

        // Ensure data is an array before setting
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]); // fallback to empty
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 pt-14">
        {/* Hero Section */}
              <div className="relative py-16 rounded-lg mb-12 overflow-hidden">
        {/* Background Image with Next.js Image component */}
        <div className="absolute inset-0">
          <Image
            src="/diffuser12.png"
            alt="JosseyCart background"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            About JosseyCart
          </h1>
          <p className="text-xl opacity-90">
            Your trusted partner in quality products and exceptional service
          </p>
        </div>
      </div>

        {/* Our Story */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Our Story
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Founded in 2020, JosseyCart began as a small startup with a big
                vision: to bring high-quality products to customers worldwide at
                affordable prices. What started as a humble online store has
                grown into a trusted ecommerce platform serving thousands of
                satisfied customers.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Our journey has been fueled by passion, innovation, and an
                unwavering commitment to customer satisfaction. We carefully
                curate every product in our catalog, ensuring they meet our
                strict quality standards before reaching your doorstep.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, we continue to evolve, embracing new technologies and
                trends to provide you with the best shopping experience
                possible.
              </p>
            </div>
            <div className="relative rounded-lg overflow-hidden h-80">
              <Image
                src="/team-photo.jpg"
                alt="JosseyCart Team"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
              <div className="w-16 h-16 bg-josseypink2 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">✓</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality First</h3>
              <p className="text-gray-600">
                We never compromise on quality. Every product is thoroughly
                vetted to ensure it meets our high standards.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
              <div className="w-16 h-16 bg-josseypink2 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">❤️</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Customer Focus</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We're committed to providing
                exceptional service and support.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
              <div className="w-16 h-16 bg-josseypink2 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">✓</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-gray-600">
                We continuously improve our platform and services to enhance
                your shopping experience.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-50 rounded-lg py-12 mb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
              By The Numbers
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-josseypink2 mb-2">
                  5K+
                </div>
                <div className="text-gray-600">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-josseypink2 mb-2">
                  20+
                </div>
                <div className="text-gray-600">Products</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-josseypink2 mb-2">
                  100+
                </div>
                <div className="text-gray-600">Reviews</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-josseypink2 mb-2">
                  24/7
                </div>
                <div className="text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Products */}
        {!loading && products.length > 0 ? (
          <FeaturedProduct products={products} />
        ) : (
          <p className="text-center text-gray-500">No products to show yet.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;
