import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";

const categories = ["All", "Tools", "Electronics", "Camping Gear", "Books", "Cameras"];

const floatingCards = [
  { title: "Camera", price: "$25/day", image: "/api/placeholder/100/100" },
  { title: "Drone", price: "$50/day", image: "/api/placeholder/100/100" },
  { title: "Laptop", price: "$30/day", image: "/api/placeholder/100/100" },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [active, setActive] = useState("All");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/products")
      .then((res) => setProducts(res.data.slice(0, 6)))
      .catch(() => {
        setProducts([]);
        setError("Could not load featured products.");
      });
  }, []);

  const shown = active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-hero-gradient p-8 md:p-16">
        <div className="relative z-10 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex rounded-full bg-primary-purple/10 px-4 py-2 text-sm font-semibold text-primary-purple"
          >
            Hyper-local rental marketplace
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl font-black leading-tight text-text-primary md:text-7xl"
          >
            Rent{" "}
            <span className="bg-gradient-to-r from-primary-purple to-primary-indigo bg-clip-text text-transparent">
              Anything
            </span>
            , Anytime, Near You.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 max-w-2xl text-lg text-text-secondary md:text-xl"
          >
            Rentify helps you save money by renting quality products within your city.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              to="/products"
              className="rounded-full bg-gradient-to-r from-primary-purple to-primary-indigo px-8 py-4 text-lg font-semibold text-white shadow-soft hover:shadow-glow-purple transition-all duration-300 hover:scale-105"
            >
              Browse Products
            </Link>
            <Link
              to="/register"
              className="rounded-full border-2 border-primary-indigo bg-transparent px-8 py-4 text-lg font-semibold text-primary-indigo hover:bg-primary-indigo hover:text-white transition-all duration-300"
            >
              Get Started
            </Link>
          </motion.div>
        </div>

        {/* Floating Product Cards */}
        <div className="absolute inset-0 overflow-hidden">
          {floatingCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: 0,
                y: [0, -10, 0],
              }}
              transition={{
                duration: 0.8,
                delay: 1 + index * 0.2,
                y: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              className="absolute rounded-2xl bg-background-card p-4 shadow-card"
              style={{
                top: `${20 + index * 25}%`,
                left: `${10 + index * 30}%`,
                transform: `rotate(${index * 5}deg)`,
              }}
            >
              <div className="mb-2 h-16 w-16 rounded-lg bg-background-soft"></div>
              <p className="text-sm font-semibold text-text-primary">{card.title}</p>
              <p className="text-xs text-text-secondary">{card.price}</p>
            </motion.div>
          ))}
        </div>

        {/* Background Effects */}
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary-purple/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-primary-cyan/10 blur-3xl"></div>
      </section>

      {/* Categories */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="flex flex-wrap gap-3 justify-center"
      >
        {categories.map((category, index) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
          >
            <CategoryCard
              label={category}
              active={active === category}
              onClick={setActive}
            />
          </motion.div>
        ))}
      </motion.section>

      {/* Stats */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="grid gap-6 rounded-2xl bg-background-card p-8 shadow-soft md:grid-cols-3"
      >
        {[
          { number: "12+", label: "Curated products" },
          { number: "24h", label: "Average approval time" },
          { number: "100%", label: "Hyper-local convenience" },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 + index * 0.2 }}
            className="text-center"
          >
            <div className="rounded-2xl bg-gradient-to-br from-primary-purple/10 to-primary-indigo/10 p-6">
              <p className="text-3xl font-bold text-primary-purple">{stat.number}</p>
              <p className="text-sm text-text-secondary">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.section>

      {/* Featured Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.6 }}
        className="mb-8 flex items-end justify-between"
      >
        <h2 className="text-3xl font-bold tracking-tight text-text-primary">Featured Products</h2>
        <Link
          to="/products"
          className="text-sm font-medium text-primary-indigo hover:text-primary-purple transition-colors duration-300"
        >
          View all →
        </Link>
      </motion.div>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.8 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : shown.length === 0 ? (
          <div className="rounded-2xl bg-background-card p-6 shadow-soft">
            <p>No featured products yet.</p>
              <p className="mt-2 text-sm text-text-secondary">
              If this is a fresh setup, run <code className="rounded bg-background-soft px-2 py-1 text-xs">npm run seed</code> inside <code className="rounded bg-background-soft px-2 py-1 text-xs">server</code>.
            </p>
          </div>
        ) : (
          shown.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2 + index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))
        )}
      </motion.section>
    </div>
  );
}
