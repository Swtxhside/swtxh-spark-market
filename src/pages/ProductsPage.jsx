import { Link } from "react-router-dom";
import { getAllProducts } from '@/lib/supabaseApi';
import { useEffect, useState } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const data = await getAllProducts();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 p-6">
      {products.map((product) => (
        <div key={product.id} className="border p-4 rounded-lg shadow">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-40 object-cover"
          />
          <h2 className="font-bold text-lg">{product.name}</h2>
          <p>{product.description}</p>
          <p className="text-green-600 font-semibold">₦{product.price}</p>

          {/* ✅ Use Link for navigation */}
          <Link to={`/products/${product.id}`} className="text-blue-600 underline">
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
}