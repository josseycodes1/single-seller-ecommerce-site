import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";

const Banner = () => {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!API_BASE_URL) {
          throw new Error("API base URL is not defined");
        }
        
        const response = await axios.get(`${API_BASE_URL}/api/banners/`);
        
        if (response.data && response.data.length > 0) {
          const activeBanners = response.data.filter(b => b.is_active);
          setBanner(activeBanners.length > 0 ? activeBanners[0] : response.data[0]);
        } else {
          setError("No banners found");
        }
      } catch (err) {
        console.error("Error fetching banner:", err);
        setError("Failed to load banner");
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, []);

  // Function to ensure HTTPS protocol for Cloudinary URLs
  const ensureHttps = (url) => {
    if (!url) return url;
    
    if (url.startsWith('http://')) {
      return url.replace('http://', 'https://');
    }
    
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      if (url.includes('cloudinary.com')) {
        return `https://${url}`;
      }
      return url;
    }
    
    return url;
  };

  // Function to get optimized Cloudinary URL with HTTPS
  const getOptimizedCloudinaryUrl = (url, width = 900, height = 900) => {
    if (!url) return url;
    
    const httpsUrl = ensureHttps(url);
    const isCloudinary = httpsUrl.includes('cloudinary.com');
    
    if (!isCloudinary) return httpsUrl;
    
    const optimizationParams = `c_fill,w_${width},h_${height},q_auto,f_auto`;
    
    if (httpsUrl.includes('/upload/')) {
      return httpsUrl.replace('/upload/', `/upload/${optimizationParams}/`);
    }
    
    return httpsUrl;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-gradient-to-r from-pink-400 to-pink-600 my-16 rounded-xl overflow-hidden h-64 animate-pulse">
        <div className="w-full h-full bg-gray-300 opacity-30"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center bg-gray-100 my-16 rounded-xl p-8">
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-josseypink2 to-josseypink1 my-16 rounded-xl overflow-hidden p-8 md:p-12">
      {/* Left decorative element */}
      <div className="hidden md:block absolute left-0 top-0 bottom-0 w-1/3 opacity-10">
        <div className="h-full w-full bg-white rounded-full transform -translate-x-1/2 -translate-y-1/4 scale-150"></div>
      </div>
      
      {/* Right decorative element */}
      <div className="hidden md:block absolute right-0 top-0 bottom-0 w-1/3 opacity-10">
        <div className="h-full w-full bg-white rounded-full transform translate-x-1/2 -translate-y-1/4 scale-150"></div>
      </div>
      
      {/* Left image - only show if we have a secondary image */}
      {banner?.secondary_image && (
        <div className="hidden md:flex items-center justify-center w-1/4">
          <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white bg-white shadow-lg">
            <Image
              src={getOptimizedCloudinaryUrl(banner.secondary_image, 300, 300)}
              alt="Banner secondary image"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        </div>
      )}
      
      {/* Center content - properly centered with max width */}
      <div className="flex flex-col items-center justify-center text-center w-full md:w-2/4 z-10 space-y-4">
        {banner?.title && (
          <h2 className="text-white text-2xl md:text-3xl font-bold max-w-md">
            {banner.title}
          </h2>
        )}
        
        {banner?.subtitle && (
          <p className="text-white text-lg max-w-md font-medium">
            {banner.subtitle}
          </p>
        )}
        
        {banner?.discount_text && (
          <p className="text-white font-bold text-xl bg-pink-600 px-4 py-1 rounded-full">
            {banner.discount_text}
          </p>
        )}
        
        <button className="group flex items-center justify-center gap-2 px-6 py-3 bg-white rounded-full text-pink-600 font-semibold hover:bg-gray-50 transition-all shadow-md hover:shadow-lg">
          {banner?.button_text || "Buy now"}
          <svg 
            className="group-hover:translate-x-1 transition-transform" 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M1 8H15M15 8L8 1M15 8L8 15" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      
      {/* Right image - only show if we have a main image */}
      {banner?.image && (
        <div className="hidden md:flex items-center justify-center w-1/4">
          <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white bg-white shadow-lg">
            <Image
              src={getOptimizedCloudinaryUrl(banner.image, 300, 300)}
              alt="Banner product image"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      )}
      
      {/* Mobile image */}
      {(banner?.image_mobile || banner?.image) && (
        <div className="md:hidden mt-6">
          <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-white bg-white shadow-lg">
            <Image
              src={getOptimizedCloudinaryUrl(banner.image_mobile || banner.image, 200, 200)}
              alt="Banner mobile image"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Banner;

// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import axios from "axios";

// const Banner = () => {
//   const [banner, setBanner] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchBanner = async () => {
//       try {
//         const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
//         if (!API_BASE_URL) {
//           throw new Error("API base URL is not defined");
//         }
        
//         const response = await axios.get(`${API_BASE_URL}/api/banners/`);
        
//         if (response.data && response.data.length > 0) {
          
//           const activeBanners = response.data.filter(b => b.is_active);
//           setBanner(activeBanners.length > 0 ? activeBanners[0] : response.data[0]);
//         } else {
//           setError("No banners found");
//         }
//       } catch (err) {
//         console.error("Error fetching banner:", err);
//         setError("Failed to load banner");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBanner();
//   }, []);

//   // Function to ensure HTTPS protocol for Cloudinary URLs
//   const ensureHttps = (url) => {
//     if (!url) return url;
    
//     // Replace http:// with https://
//     if (url.startsWith('http://')) {
//       return url.replace('http://', 'https://');
//     }
    
//     // If it doesn't start with http or https, add https://
//     if (!url.startsWith('https://') && !url.startsWith('http://')) {
//       // Check if it's a Cloudinary URL that needs protocol
//       if (url.includes('cloudinary.com')) {
//         return `https://${url}`;
//       }
//       return url;
//     }
    
//     return url;
//   };

//   // Function to get optimized Cloudinary URL with HTTPS
//   const getOptimizedCloudinaryUrl = (url, width = 900, height = 900) => {
//     if (!url) return url;
    
//     // Ensure HTTPS first
//     const httpsUrl = ensureHttps(url);
    
//     // Check if it's a Cloudinary URL
//     const isCloudinary = httpsUrl.includes('cloudinary.com');
    
//     if (!isCloudinary) return httpsUrl;
    
//     // Add optimization parameters
//     const optimizationParams = `c_fill,w_${width},h_${height},q_auto,f_auto`;
    
//     // Insert optimization parameters into the Cloudinary URL
//     if (httpsUrl.includes('/upload/')) {
//       return httpsUrl.replace('/upload/', `/upload/${optimizationParams}/`);
//     }
    
//     return httpsUrl;
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col md:flex-row items-center justify-between md:pl-20 py-14 md:py-0 bg-gray-200 my-16 rounded-xl overflow-hidden animate-pulse">
//         <div className="hidden md:block w-80 h-80 bg-gray-300"></div>
//         <div className="flex flex-col items-center justify-center text-center space-y-4 px-4 md:px-0">
//           <div className="h-8 bg-gray-300 rounded w-64"></div>
//           <div className="h-6 bg-gray-300 rounded w-80"></div>
//           <div className="h-10 bg-gray-300 rounded w-32"></div>
//         </div>
//         <div className="hidden md:block w-80 h-80 bg-gray-300"></div>
//         <div className="md:hidden w-48 h-48 bg-gray-300"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center bg-gray-100 my-16 rounded-xl p-8">
//         <p className="text-gray-600">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col md:flex-row items-center justify-between md:pl-20 py-14 md:py-0 bg-josseypink2 my-16 rounded-xl overflow-hidden">
//       {/* Left image - desktop only (using secondary_image if available) */}
//       {banner?.secondary_image ? (
//         <Image
//           className="hidden md:block max-w-80"
//           src={getOptimizedCloudinaryUrl(banner.secondary_image)}
//           alt="Banner secondary image"
//           width={900}
//           height={900}
//           priority
//         />
//       ) : banner?.image ? (
//         <Image
//           className="hidden md:block max-w-80"
//           src={getOptimizedCloudinaryUrl(banner.image)}
//           alt="Banner product image"
//           width={900}
//           height={900}
//           priority
//         />
//       ) : null}
      
//       {/* Center content - properly centered */}
//       <div className="flex flex-col items-center justify-center text-center space-y-4 px-4 md:px-0 mx-auto">
//         <h2 className="text-white text-2xl md:text-3xl font-semibold max-w-[290px] md:max-w-none">
//           {banner?.title || "Level Up Your Scent Experience"}
//         </h2>
//         <p className="max-w-[343px] font-medium text-white">
//           {banner?.subtitle || "From affordability to precise strength—everything you need to win"}
//         </p>
        
//         {banner?.discount_text && (
//           <p className="text-white font-semibold">{banner.discount_text}</p>
//         )}
        
//         <button className="group flex items-center justify-center gap-1 px-12 py-2.5 bg-white rounded text-josseypink1 hover:bg-gray-100 transition-colors">
//           {banner?.button_text || "Buy now"}
//           <svg 
//             className="group-hover:translate-x-1 transition-transform" 
//             width="16" 
//             height="16" 
//             viewBox="0 0 16 16" 
//             fill="none" 
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path 
//               d="M1 8H15M15 8L8 1M15 8L8 15" 
//               stroke="currentColor" 
//               strokeWidth="2" 
//               strokeLinecap="round" 
//               strokeLinejoin="round"
//             />
//           </svg>
//         </button>
//       </div>
      
//       {/* Right image - desktop only (using secondary_image if available) */}
//       {banner?.secondary_image ? (
//         <Image
//           className="hidden md:block max-w-80"
//           src={getOptimizedCloudinaryUrl(banner.secondary_image, 200, 200)}
//           alt="Banner secondary image"
//           width={200}
//           height={200}
//         />
//       ) : banner?.image ? (
//         <Image
//           className="hidden md:block max-w-80"
//           src={getOptimizedCloudinaryUrl(banner.image, 200, 200)}
//           alt="Banner product image"
//           width={200}
//           height={200}
//         />
//       ) : null}
      
//       {/* Mobile image (using image_mobile if available) */}
//       {banner?.image_mobile ? (
//         <Image
//           className="md:hidden max-w-48 mx-auto"
//           src={getOptimizedCloudinaryUrl(banner.image_mobile, 200, 200)}
//           alt="Banner mobile image"
//           width={200}
//           height={200}
//         />
//       ) : banner?.image ? (
//         <Image
//           className="md:hidden max-w-48 mx-auto"
//           src={getOptimizedCloudinaryUrl(banner.image, 200, 200)}
//           alt="Banner product image"
//           width={200}
//           height={200}
//         />
//       ) : null}
//     </div>
//   );
// };

// export default Banner;