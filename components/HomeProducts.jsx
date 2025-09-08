import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";

const HomeProducts = () => {
  const { products, router, loading, error } = useAppContext()

  if (loading) {
    return (
      <div className="flex flex-col items-center pt-14">
        <p className="text-3xl font-medium">Popular products</p>
        <div className="w-28 h-0.5 bg-josseypink2 mt-2"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
          {/* Skeleton loading */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-2 animate-pulse">
              <div className="bg-gray-200 rounded-lg w-full h-52"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center pt-14">
        <p className="text-3xl font-medium">Popular products</p>
        <div className="w-28 h-0.5 bg-josseypink2 mt-2"></div>
        <p className="text-red-500 mt-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-12 py-2.5 border rounded text-white hover:bg-josseypink1 bg-josseypink2 transition mt-4"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center pt-14">
      <p className="text-3xl font-medium">Popular products</p>
      <div className="w-28 h-0.5 bg-josseypink2 mt-2"></div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
        {products.slice(0, 10).map((product, index) => ( 
          <ProductCard key={product.id || index} product={product} /> 
        ))}
      </div>
      {products.length > 10 && (
        <button 
          onClick={() => { router.push('/all-products') }} 
          className="px-12 py-2.5 border rounded text-white hover:bg-josseypink1 bg-josseypink2 transition"
        >
          See more
        </button>
      )}
    </div>
  );
};

export default HomeProducts;


// import React from "react";
// import ProductCard from "./ProductCard";
// import { useAppContext } from "@/context/AppContext";

// const HomeProducts = () => {

//   const { products, router } = useAppContext()

//   return (
//     <div className="flex flex-col items-center pt-14">
//       <p className="text-3xl font-medium">Popular products</p>
//       <div className="w-28 h-0.5 bg-josseypink2 mt-2"></div>
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
//         {products.map((product, index) => <ProductCard key={index} product={product} />)}
//       </div>
//       <button onClick={() => { router.push('/all-products') }} className="px-12 py-2.5 border rounded text-white hover:bg-josseypink1 bg-josseypink2 transition">
//         See more
//       </button>
//     </div>
//   );
// };

// export default HomeProducts;
