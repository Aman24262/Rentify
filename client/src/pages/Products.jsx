import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";

const categories = ["All", "Tools", "Electronics", "Camping Gear", "Books", "Cameras", "Sports", "Vehicles", "Others"];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    api
      .get("/products", { params: { search, category } })
      .then((res) => setProducts(res.data))
      .catch(() => setError("Could not load products right now."))
      .finally(() => setLoading(false));
  }, [search, category]);

  return (
    <section className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-text-primary mb-2">Browse Products</h1>
        <p className="text-text-secondary">Find the perfect item to rent in your area</p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-6"
      >
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-full border border-border-default bg-background-card px-12 py-4 text-text-primary placeholder-text-secondary focus:border-primary-indigo focus:outline-none focus:ring-2 focus:ring-primary-indigo/20 transition-all duration-300 shadow-soft"
            placeholder="Search for products, tools, electronics..."
          />
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat, index) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                category === cat
                  ? "bg-gradient-to-r from-primary-purple to-primary-indigo text-white shadow-glow-purple"
                  : "bg-background-card text-text-secondary hover:bg-primary-purple/10 hover:text-primary-purple border border-border-default"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-red-500"
        >
          {error}
        </motion.p>
      )}

      {/* Products Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <SkeletonCard />
            </motion.div>
          ))
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-12"
          >
            <p className="text-text-secondary text-lg">No products match your filters.</p>
            <p className="text-text-secondary mt-2">Try adjusting your search or category.</p>
          </motion.div>
        ) : (
          products.map((p, index) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))
        )}
      </motion.div>
    </section>
  );
}
