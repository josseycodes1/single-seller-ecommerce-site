import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Quick Links",
      links: [
        { name: "Add Product", href: "/sellerdashboard" },
        { name: "Product List", href: "/sellerdashboard/product-list" },
        { name: "Orders", href: "/sellerdashboard/orders" },
        { name: "Analytics", href: "/sellerdashboard/analytics" },
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Contact Us", href: "/contact" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Blog", href: "/blog" },
        { name: "Press", href: "/press" },
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-josseypink2 mb-4">JOSSEYCART</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your trusted partner in e-commerce. We provide sellers with powerful tools to manage 
              their products and grow their business online.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-josseypink2 transition-colors duration-300"
                aria-label="Facebook"
              >
                <Image src={assets.facebook_icon} alt="Facebook" width={24} height={24} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-josseypink2 transition-colors duration-300"
                aria-label="Twitter"
              >
                <Image src={assets.twitter_icon} alt="Twitter" width={24} height={24} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-josseypink2 transition-colors duration-300"
                aria-label="Instagram"
              >
                <Image src={assets.instagram_icon} alt="Instagram" width={24} height={24} />
              </a>
            </div>
          </div>

          {/* Footer Links Sections */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="text-lg font-semibold mb-4 text-white">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      href={link.href}
                      className="text-gray-300 hover:text-josseypink2 transition-colors duration-300 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h4 className="text-lg font-semibold mb-2">Stay Updated</h4>
              <p className="text-gray-300 text-sm">
                Subscribe to get the latest updates and news.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-josseypink2 focus:ring-1 focus:ring-josseypink2 w-full md:w-64"
              />
              <button className="bg-josseypink2 text-white px-6 py-2 rounded-lg font-medium hover:bg-josseypink1 transition-colors duration-300 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm text-center md:text-left mb-2 md:mb-0">
              © {currentYear} jossseycodes.dev. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-300 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// import React from "react";
// import { assets } from "@/assets/assets";
// import Image from "next/image";

// const Footer = () => {
//   return (
//     <div className="flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-10 bg-josseypink2">
//       <div className="flex items-center gap-4 text-centre">
//         <div className="hidden md:block h-7 w-px"></div>
//         <p className="py-4 text-center text-xs md:text-sm text-white">
//           Copyright 2025 © jossseycodes.dev All Right Reserved.
//         </p>
//       </div>
//       <div className="flex items-center gap-3">
//         <a href="#">
//           <Image src={assets.facebook_icon} alt="facebook_icon" />
//         </a>
//         <a href="#">
//           <Image src={assets.twitter_icon} alt="twitter_icon" />
//         </a>
//         <a href="#">
//           <Image src={assets.instagram_icon} alt="instagram_icon" />
//         </a>
//       </div>
//     </div>
    
//   );
// };

// export default Footer;