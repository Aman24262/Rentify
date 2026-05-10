import { Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../context/useAuth";
import useTheme from "../context/useTheme";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navLinkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-white/10 hover:text-primary-indigo ${
      isActive
        ? "bg-primary-purple/10 text-primary-purple"
        : "text-text-secondary hover:text-text-primary"
    }`;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-background-dark/80 border-b border-border-default">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-2xl font-black tracking-tight bg-gradient-to-r from-primary-purple to-primary-indigo bg-clip-text text-transparent">
          Rentify
        </Link>
        <button
          className="rounded-full border border-border-default bg-white/50 p-2 md:hidden backdrop-blur-sm hover:bg-white/70 transition-all duration-300"
          onClick={() => setOpen(!open)}
        >
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </motion.div>
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-surface absolute left-4 right-4 top-20 flex flex-col gap-3 rounded-2xl p-6 md:hidden shadow-card"
            >
              {links.map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NavLink
                    to={item.to}
                    className={navLinkClass}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: links.length * 0.1 }}
                onClick={toggleTheme}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-text-secondary hover:bg-white/10 hover:text-text-primary transition-all duration-300"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                {theme === "dark" ? "Light" : "Dark"}
              </motion.button>
              {user ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (links.length + 1) * 0.1 }}
                  >
                    <NavLink to="/profile" className={navLinkClass} onClick={() => setOpen(false)}>
                      Profile
                    </NavLink>
                  </motion.div>
                  {user.role === "admin" && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (links.length + 2) * 0.1 }}
                    >
                      <NavLink
                        to="/admin"
                        className="rounded-full bg-gradient-to-r from-primary-purple to-primary-indigo px-4 py-2 text-sm font-medium text-white hover:shadow-glow-purple transition-all duration-300"
                        onClick={() => setOpen(false)}
                      >
                        Admin Dashboard
                      </NavLink>
                    </motion.div>
                  )}
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (links.length + 3) * 0.1 }}
                    onClick={logout}
                    className="rounded-full bg-gradient-to-r from-primary-purple to-primary-indigo px-4 py-2 text-sm font-medium text-white hover:shadow-glow-purple transition-all duration-300"
                  >
                    Logout
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (links.length + 1) * 0.1 }}
                  >
                    <NavLink to="/login" className={navLinkClass} onClick={() => setOpen(false)}>
                      Login
                    </NavLink>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (links.length + 2) * 0.1 }}
                  >
                    <NavLink
                      to="/register"
                      className="rounded-full bg-gradient-to-r from-primary-purple to-primary-indigo px-4 py-2 text-sm font-medium text-white hover:shadow-glow-purple transition-all duration-300"
                      onClick={() => setOpen(false)}
                    >
                      Register
                    </NavLink>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="hidden md:flex md:items-center md:gap-2">
          {links.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-text-secondary hover:bg-white/10 hover:text-text-primary transition-all duration-300"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          {user ? (
            <>
              <NavLink to="/profile" className={navLinkClass}>
                Profile
              </NavLink>
              {user.role === "admin" && (
                <NavLink
                  to="/admin"
                  className="rounded-full bg-gradient-to-r from-primary-purple to-primary-indigo px-4 py-2 text-sm font-medium text-white hover:shadow-glow-purple transition-all duration-300"
                >
                  Admin Dashboard
                </NavLink>
              )}
              <button
                onClick={logout}
                className="rounded-full bg-gradient-to-r from-primary-purple to-primary-indigo px-4 py-2 text-sm font-medium text-white hover:shadow-glow-purple transition-all duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-full bg-gradient-to-r from-primary-purple to-primary-indigo px-4 py-2 text-sm font-medium text-white hover:shadow-glow-purple transition-all duration-300"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
