"use client"
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import FeaturedProduct from "@/components/FeaturedProduct";
import Footer from "@/components/Footer";
import toast from "react-hot-toast";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            toast.success("Message sent successfully! We'll get back to you soon.");
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (error) {
            toast.error("Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="px-6 md:px-16 lg:px-32 pt-14">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-josseypink2 to-josseypink1 text-white py-16 rounded-lg mb-12">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
                        <p className="text-xl opacity-90">We're here to help! Get in touch with us</p>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto mb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Information */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">Get In Touch</h2>
                            <p className="text-gray-600 mb-8">
                                Have questions about our products or need assistance with your order? 
                                Our team is here to help you. Reach out to us through any of the following channels.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-josseypink2 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-xl">📞</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Phone</h3>
                                        <p className="text-gray-600">+234 813-2037-553</p>
                                        <p className="text-gray-500 text-sm">Mon-Fri: 9AM-6PM WAT</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-josseypink2 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-xl">✉️</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Email</h3>
                                        <p className="text-gray-600">contact@josseycart.dev</p>
                                        <p className="text-gray-500 text-sm">We respond within 24 hours</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-josseypink2 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-xl">📍</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Address</h3>
                                        <p className="text-gray-600">
                                            123 Commerce Street<br />
                                            Oluyole Estate<br />
                                            Ibadan, Nigeria
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-josseypink2 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-xl">💬</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Live Chat</h3>
                                        <p className="text-gray-600">Available 24/7</p>
                                        <p className="text-gray-500 text-sm">Click the chat icon in the bottom right</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white rounded-lg shadow-sm border p-8">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-josseypink2 focus:border-transparent"
                                        placeholder="Your full name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-josseypink2 focus:border-transparent"
                                        placeholder="your.email@example.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-josseypink2 focus:border-transparent"
                                        placeholder="What is this regarding?"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-josseypink2 focus:border-transparent"
                                        placeholder="Please describe your inquiry in detail..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-josseypink2 text-white py-3.5 rounded-lg font-medium hover:bg-josseypink1 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </span>
                                    ) : (
                                        'Send Message'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-4xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {[
                            {
                                question: "How long does shipping take?",
                                answer: "Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days."
                            },
                            {
                                question: "What is your return policy?",
                                answer: "We offer a 30-day return policy for unused items in original packaging."
                            },
                            {
                                question: "Do you ship internationally?",
                                answer: "Yes, we ship to over 50 countries worldwide. Shipping costs and times vary by location."
                            },
                            {
                                question: "How can I track my order?",
                                answer: "You'll receive a tracking number via email once your order ships. You can also track it from your account."
                            }
                        ].map((faq, index) => (
                            <div key={index} className="bg-white border rounded-lg p-6">
                                <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                                <p className="text-gray-600">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Featured Products */}
                <FeaturedProduct />
            </div>
            <Footer />
        </>
    );
};

export default ContactUs;