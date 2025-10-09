"use client"
import React from "react";
import Navbar from "@/components/Navbar";
import FeaturedProduct from "@/components/FeaturedProduct";
import Footer from "@/components/Footer";
import Image from 'next/image'

const PrivacyPolicy = () => {
    return (
        <>
            <Navbar />
            <div className="px-6 md:px-16 lg:px-32 pt-14">
                {/* Hero Section */}
                <div className="absolute inset-0">
                          <Image
                            src="/diffuser11.png"
                            alt="JosseyCart background"
                            fill
                            className="object-cover"
                            priority
                          />
                          {/* Dark overlay */}
                          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                        </div>
                        
                        <div className="relative max-w-4xl mx-auto text-center z-10">
                          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                            Privacy Policy
                          </h1>
                          <p className="text-xl opacity-90 text-white">
                            How we protect and use your information
                          </p>
                        </div>

                <div className="max-w-4xl mx-auto mb-16">
                    <div className="prose prose-lg max-w-none">
                        {/* Last Updated */}
                        <div className="bg-josseypink3 border-l-4 border-josseypink2 p-4 mb-8">
                            <p className="text-josseypink2">
                                <strong>Last Updated:</strong> January 1, 2025
                            </p>
                        </div>

                        {/* Introduction */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Introduction</h2>
                            <p className="text-gray-600 mb-4">
                                Welcome to JosseyCart. We are committed to protecting your privacy and ensuring 
                                that your personal information is handled in a safe and responsible manner. This 
                                Privacy Policy outlines how we collect, use, and protect your information when 
                                you visit our website or make a purchase from us.
                            </p>
                        </section>

                        {/* Information We Collect */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Information We Collect</h2>
                            <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
                            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                                <li>Name and contact information (email address, phone number, shipping address)</li>
                                <li>Payment information (credit card details processed through secure payment gateways)</li>
                                <li>Account credentials (username and password)</li>
                                <li>Purchase history and preferences</li>
                            </ul>
                            
                            <h3 className="text-xl font-semibold mb-3">Automatically Collected Information</h3>
                            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                                <li>IP address and browser type</li>
                                <li>Device information and operating system</li>
                                <li>Website usage data through cookies and similar technologies</li>
                                <li>Referring website and pages visited</li>
                            </ul>
                        </section>

                        {/* How We Use Your Information */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. How We Use Your Information</h2>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>Process and fulfill your orders</li>
                                <li>Provide customer support and respond to inquiries</li>
                                <li>Send order confirmations and shipping notifications</li>
                                <li>Personalize your shopping experience</li>
                                <li>Send marketing communications (with your consent)</li>
                                <li>Improve our website and services</li>
                                <li>Prevent fraud and enhance security</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </section>

                        {/* Information Sharing */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Information Sharing</h2>
                            <p className="text-gray-600 mb-4">
                                We do not sell, trade, or rent your personal information to third parties. We may 
                                share your information with:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>Shipping carriers to deliver your orders</li>
                                <li>Payment processors to handle transactions</li>
                                <li>Service providers who assist in our operations</li>
                                <li>Legal authorities when required by law</li>
                            </ul>
                        </section>

                        {/* Cookies */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Cookies and Tracking Technologies</h2>
                            <p className="text-gray-600 mb-4">
                                We use cookies and similar technologies to enhance your browsing experience, 
                                analyze website traffic, and understand where our visitors come from. You can 
                                control cookies through your browser settings.
                            </p>
                        </section>

                        {/* Data Security */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Data Security</h2>
                            <p className="text-gray-600 mb-4">
                                We implement appropriate security measures to protect your personal information 
                                against unauthorized access, alteration, disclosure, or destruction. This includes 
                                SSL encryption, secure servers, and regular security assessments.
                            </p>
                        </section>

                        {/* Your Rights */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Your Rights</h2>
                            <p className="text-gray-600 mb-4">
                                You have the right to:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>Access and receive a copy of your personal data</li>
                                <li>Correct inaccurate or incomplete information</li>
                                <li>Request deletion of your personal data</li>
                                <li>Object to processing of your personal data</li>
                                <li>Withdraw consent at any time</li>
                            </ul>
                        </section>

                        {/* Contact Information */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Contact Us</h2>
                            <p className="text-gray-600 mb-2">
                                If you have any questions about this Privacy Policy or how we handle your 
                                information, please contact us:
                            </p>
                            <div className="bg-josseypink3 p-4 rounded-lg">
                                <p className="text-gray-600">
                                    <strong>Email:</strong> contact@josseycart.dev<br />
                                    <strong>Phone:</strong> +234 813-037-553<br />
                                    <strong>Address:</strong> 123 Commerce Street, Oluyole Estate, Nigeria
                                </p>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Featured Products */}
                <FeaturedProduct />
            </div>
            <Footer />
        </>
    );
};

export default PrivacyPolicy;