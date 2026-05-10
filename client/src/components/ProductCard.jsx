import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group overflow-hidden rounded-3xl bg-background-card shadow-soft hover:shadow-card transition-all duration-300"
    >
      <div className="relative overflow-hidden rounded-t-3xl">
        <img
          src={product.image}
          alt={product.title}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 rounded-full bg-gradient-to-r from-primary-purple to-primary-indigo px-3 py-1 text-xs font-semibold text-white shadow-soft">
          ₹{product.pricePerDay}/day
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="line-clamp-1 text-lg font-bold text-text-primary">{product.title}</h3>
          <span className="rounded-full bg-primary-purple/10 px-3 py-1 text-xs font-medium text-primary-purple">
            {product.category}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-text-secondary mb-4">{product.description}</p>
        <Link
          to={`/products/${product._id}`}
          className="inline-block w-full rounded-full bg-gradient-to-r from-primary-purple to-primary-indigo py-3 text-center text-sm font-semibold text-white shadow-soft hover:shadow-glow-purple transition-all duration-300 hover:scale-105"
        >
          Rent Now
        </Link>
      </div>
    </motion.article>
  );
}
