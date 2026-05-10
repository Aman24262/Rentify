import { NavLink, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, Package, ShoppingCart, Users } from "lucide-react";

const navItems = [
  { to: "/admin", end: true, label: "Dashboard", icon: BarChart3 },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/users", label: "Users", icon: Users },
];

export default function AdminLayout() {
  const navClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
      isActive
        ? "bg-gradient-to-r from-primary-purple to-primary-indigo text-white shadow-glow-purple"
        : "text-text-secondary hover:bg-background-card hover:text-text-primary"
    }`;

  return (
    <div className="min-h-screen bg-background-main">
      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          className="w-64 bg-background-card shadow-card min-h-screen border-r border-border-default"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-purple to-primary-indigo bg-clip-text text-transparent mb-8">
              Admin Panel
            </h2>
            <nav className="space-y-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NavLink to={item.to} end={item.end} className={navClass}>
                    <item.icon size={20} />
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
          </div>
        </motion.aside>

        {/* Main Content */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex-1 p-8"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
