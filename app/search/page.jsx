'use client'
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "";
      fetch(`${base}/api/products?search=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          setProducts(data.results || data); // adjust depending on API response
          setLoading(false);
        })
        .catch((err) => {
          console.error("Search error:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
      setProducts([]);
    }
  }, [query]);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Search results for: <span className="text-josseypink2">{query}</span>
      </h1>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-3 shadow">
              <img
                src={product.images?.[0]?.image_url || "/placeholder.png"}
                alt={product.name}
                className="w-full h-40 object-cover rounded"
              />
              <h2 className="mt-2 font-medium">{product.name}</h2>
              <p className="text-sm text-gray-600">${product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="p-6">Loading search...</p>}>
      <SearchPageContent />
    </Suspense>
  );
}
