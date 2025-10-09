"use client"
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import FeaturedProduct from "@/components/FeaturedProduct";
import Footer from "@/components/Footer";
import toast from "react-hot-toast";
import Image from 'next/image'

const faqs = [
  {
    question: "How long does shipping take?",
    answer: "Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days.",
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for unused items in original packaging.",
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship to over 50 countries worldwide. Shipping costs and times vary by location.",
  },
  {
    question: "How can I track my order?",
    answer: "You'll receive a tracking number via email once your order ships. You can also track it from your account.",
  },
];

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        // Use the correct environment variable name
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        
        // Send data to your backend API
        const response = await fetch(`${API_BASE_URL}/api/contact/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          toast.success(data.message || "Message sent successfully! We'll get back to you soon.");
          setFormData({ name: "", email: "", subject: "", message: "" });
        } else {
          // Add detailed error logging
          console.error('Backend error response:', {
            status: response.status,
            statusText: response.statusText,
            data: data
          });
          throw new Error(data.details || data.error || `Failed to send message: ${response.status}`);
        }
      } catch (error) {
        console.error('Contact form error:', {
          message: error.message,
          stack: error.stack
        });
        toast.error(error.message || "Failed to send message. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 pt-14">
        {/* Hero Section */}
        <div className="relative py-16 rounded-lg mb-12 overflow-hidden">
          {/* Background Image*/}
          <div className="absolute inset-0">
            <Image
              src="/diffuser12.png"
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
              Contact JosseyCart
            </h1>
            <p className="text-xl opacity-90 text-white">
              We are here to attend to all your enquiries and questions
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Get In Touch</h2>
              <p className="text-gray-600 mb-8">
                Have questions about our products or need assistance with your order? Our team is here to help you. Reach out to us through any of the following channels.
              </p>
              <div className="space-y-6">
                {/* Phone */}
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
                {/* Email */}
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
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-josseypink2 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">📍</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Address</h3>
                    <p className="text-gray-600">
                      123 Commerce Street
                      <br />
                      Oluyole Estate
                      <br />
                      Ibadan, Nigeria
                    </p>
                  </div>
                </div>
                {/* Live Chat */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-josseypink2 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">💬</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">WhatsApp Live Chat</h3>
                    <p className="text-gray-600">Available 24/7</p>
                    <a 
                      href="https://wa.me/08132037553" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-green-600 text-sm font-medium inline-block mt-1"
                    >
                      Chat with us on WhatsApp →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Inputs */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-josseypink2 focus:border-transparent" placeholder="Your full name"/>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-josseypink2 focus:border-transparent" placeholder="your.email@example.com"/>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                  <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-josseypink2 focus:border-transparent" placeholder="What is this regarding?"/>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={5} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-josseypink2 focus:border-transparent" placeholder="Please describe your inquiry in detail..."/>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-josseypink2 text-white py-3.5 rounded-lg font-medium hover:bg-josseypink1 transition disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {Array.isArray(faqs) && faqs.length > 0 &&
              faqs.map((faq, index) => (
                <div key={index} className="bg-white border rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
          </div>
        </div>

        {/* Featured Products (safe render) */}
        <div>
          <FeaturedProduct safe />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;

// "use client"
// import React, { useState } from "react";
// import Navbar from "@/components/Navbar";
// import FeaturedProduct from "@/components/FeaturedProduct";
// import Footer from "@/components/Footer";
// import toast from "react-hot-toast";
// import Image from 'next/image'


// const faqs = [
//   {
//     question: "How long does shipping take?",
//     answer: "Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days.",
//   },
//   {
//     question: "What is your return policy?",
//     answer: "We offer a 30-day return policy for unused items in original packaging.",
//   },
//   {
//     question: "Do you ship internationally?",
//     answer: "Yes, we ship to over 50 countries worldwide. Shipping costs and times vary by location.",
//   },
//   {
//     question: "How can I track my order?",
//     answer: "You'll receive a tracking number via email once your order ships. You can also track it from your account.",
//   },
// ];

// const ContactUs = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     subject: "",
//     message: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       await new Promise((resolve) => setTimeout(resolve, 2000));
//       toast.success("Message sent successfully! We'll get back to you soon.");
//       setFormData({ name: "", email: "", subject: "", message: "" });
//     } catch (error) {
//       toast.error("Failed to send message. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="px-6 md:px-16 lg:px-32 pt-14">
//         {/* Hero Section */}
//         <div className="relative py-16 rounded-lg mb-12 overflow-hidden">
//       {/* Background Image*/}
//       <div className="absolute inset-0">
//         <Image
//           src="/diffuser12.png"
//           alt="JosseyCart background"
//           fill
//           className="object-cover"
//           priority
//         />
//         {/* Dark overlay */}
//         <div className="absolute inset-0 bg-black bg-opacity-50"></div>
//       </div>
      
//       <div className="relative max-w-4xl mx-auto text-center z-10">
//         <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
//           Contact JosseyCart
//         </h1>
//         <p className="text-xl opacity-90 text-white">
//           We are here to attend to all your enquiries and questions
//         </p>
//       </div>
//     </div>

//         <div className="max-w-6xl mx-auto mb-16">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//             {/* Contact Information */}
//             <div>
//               <h2 className="text-3xl font-bold text-gray-800 mb-6">Get In Touch</h2>
//               <p className="text-gray-600 mb-8">
//                 Have questions about our products or need assistance with your order? Our team is here to help you. Reach out to us through any of the following channels.
//               </p>
//               <div className="space-y-6">
//                 {/* Phone */}
//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 bg-josseypink2 rounded-full flex items-center justify-center flex-shrink-0">
//                     <span className="text-white text-xl">📞</span>
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-lg mb-1">Phone</h3>
//                     <p className="text-gray-600">+234 813-2037-553</p>
//                     <p className="text-gray-500 text-sm">Mon-Fri: 9AM-6PM WAT</p>
//                   </div>
//                 </div>
//                 {/* Email */}
//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 bg-josseypink2 rounded-full flex items-center justify-center flex-shrink-0">
//                     <span className="text-white text-xl">✉️</span>
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-lg mb-1">Email</h3>
//                     <p className="text-gray-600">contact@josseycart.dev</p>
//                     <p className="text-gray-500 text-sm">We respond within 24 hours</p>
//                   </div>
//                 </div>
//                 {/* Address */}
//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 bg-josseypink2 rounded-full flex items-center justify-center flex-shrink-0">
//                     <span className="text-white text-xl">📍</span>
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-lg mb-1">Address</h3>
//                     <p className="text-gray-600">
//                       123 Commerce Street
//                       <br />
//                       Oluyole Estate
//                       <br />
//                       Ibadan, Nigeria
//                     </p>
//                   </div>
//                 </div>
//                 {/* Live Chat */}
//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 bg-josseypink2 rounded-full flex items-center justify-center flex-shrink-0">
//                     <span className="text-white text-xl">💬</span>
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-lg mb-1">WhatsApp Live Chat</h3>
//                     <p className="text-gray-600">Available 24/7</p>
//                     <a 
//                       href="https://wa.me/08132037553" 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="text-gray-600 hover:text-green-600 text-sm font-medium inline-block mt-1"
//                     >
//                       Chat with us on WhatsApp →
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Contact Form */}
//             <div className="bg-white rounded-lg shadow-sm border p-8">
//               <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h3>
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Inputs */}
//                 <div>
//                   <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
//                   <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-josseypink2 focus:border-transparent" placeholder="Your full name"/>
//                 </div>
//                 <div>
//                   <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
//                   <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-josseypink2 focus:border-transparent" placeholder="your.email@example.com"/>
//                 </div>
//                 <div>
//                   <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
//                   <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-josseypink2 focus:border-transparent" placeholder="What is this regarding?"/>
//                 </div>
//                 <div>
//                   <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
//                   <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={5} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-josseypink2 focus:border-transparent" placeholder="Please describe your inquiry in detail..."/>
//                 </div>
//                 <button type="submit" disabled={isSubmitting} className="w-full bg-josseypink2 text-white py-3.5 rounded-lg font-medium hover:bg-josseypink1 transition disabled:opacity-50 disabled:cursor-not-allowed">
//                   {isSubmitting ? "Sending..." : "Send Message"}
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>

//         {/* FAQ Section */}
//         <div className="max-w-4xl mx-auto mb-16">
//           <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Frequently Asked Questions</h2>
//           <div className="space-y-4">
//             {Array.isArray(faqs) && faqs.length > 0 &&
//               faqs.map((faq, index) => (
//                 <div key={index} className="bg-white border rounded-lg p-6">
//                   <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
//                   <p className="text-gray-600">{faq.answer}</p>
//                 </div>
//               ))}
//           </div>
//         </div>

//         {/* Featured Products (safe render) */}
//         <div>
//           <FeaturedProduct safe />
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default ContactUs;
