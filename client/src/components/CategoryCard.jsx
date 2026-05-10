import { motion } from "framer-motion";

export default function CategoryCard({ label, onClick, active }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(label)}
      className={`rounded-full border-2 px-6 py-3 text-sm font-semibold transition-all duration-300 ${
        active
          ? "border-primary-purple bg-gradient-to-r from-primary-purple to-primary-indigo text-white shadow-glow-purple"
          : "border-border-default bg-background-card text-text-secondary hover:border-primary-indigo hover:text-primary-indigo hover:shadow-soft"
      }`}
    >
      {label}
    </motion.button>
  );
}
