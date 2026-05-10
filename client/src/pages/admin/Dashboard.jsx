import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Package, ShoppingCart, TrendingUp, DollarSign, UserCheck } from "lucide-react";
import api from "../../api/axios";

const statsConfig = [
  { key: "totalUsers", label: "Total Users", icon: Users, color: "from-blue-500 to-cyan-500" },
  { key: "totalRenters", label: "Active Renters", icon: UserCheck, color: "from-green-500 to-emerald-500" },
  { key: "totalProducts", label: "Products Listed", icon: Package, color: "from-purple-500 to-indigo-500" },
  { key: "totalOrders", label: "Total Rentals", icon: ShoppingCart, color: "from-orange-500 to-red-500" },
  { key: "activeRentals", label: "Active Rentals", icon: TrendingUp, color: "from-pink-500 to-rose-500" },
  { key: "totalRevenue", label: "Revenue", icon: DollarSign, color: "from-yellow-500 to-orange-500", prefix: "₹" },
];

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/users/stats")
      .then((res) => setStats(res.data))
      .catch(() => {
        setStats({});
        setError("Could not load dashboard stats");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-text-secondary">Loading dashboard...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-primary-purple/10 to-primary-indigo/10 p-6 border border-primary-purple/20"
      >
        <h1 className="text-3xl font-bold text-text-primary">Rentify Control Center</h1>
        <p className="mt-2 text-text-secondary">Track platform activity, manage rentals, and add products for users.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {statsConfig.map((stat, index) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl bg-background-card p-6 shadow-soft border border-border-default hover:shadow-card transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-text-primary mt-2">
                  {stat.prefix}{stats[stat.key] ?? "-"}
                </p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid gap-6 md:grid-cols-3"
      >
        <QuickLink
          to="/admin/products"
          title="Manage Products"
          subtitle="Create new rentable products, edit details, or delete."
          icon={Package}
        />
        <QuickLink
          to="/admin/orders"
          title="Manage Rentals"
          subtitle="Approve, return, or cancel rentals quickly."
          icon={ShoppingCart}
        />
        <QuickLink
          to="/admin/users"
          title="Monitor Users"
          subtitle="Track registrations and manage accounts."
          icon={Users}
        />
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid gap-6 lg:grid-cols-2"
      >
        <div className="rounded-2xl bg-background-card p-6 shadow-soft border border-border-default">
          <h2 className="text-xl font-bold text-text-primary mb-4">Recent Users</h2>
          {stats.recentUsers?.length ? (
            <ul className="space-y-3">
              {stats.recentUsers.map((user) => (
                <li key={user._id} className="rounded-xl bg-background-main p-4 border border-border-default">
                  <p className="font-semibold text-text-primary">{user.name}</p>
                  <p className="text-text-secondary text-sm">{user.email} • {user.role}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-text-secondary">No users yet.</p>
          )}
        </div>

        <div className="rounded-2xl bg-background-card p-6 shadow-soft border border-border-default">
          <h2 className="text-xl font-bold text-text-primary mb-4">Recent Rentals</h2>
          {stats.recentOrders?.length ? (
            <ul className="space-y-3">
              {stats.recentOrders.map((order) => (
                <li key={order._id} className="rounded-xl bg-background-main p-4 border border-border-default">
                  <p className="font-semibold text-text-primary">{order.product?.title || "Product removed"}</p>
                  <p className="text-text-secondary text-sm">
                    {order.user?.name || "Unknown user"} • {order.rentalDays} day(s) • ₹{order.totalPrice}
                  </p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                    order.status === 'approved' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-text-secondary">No rentals yet.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function QuickLink({ to, title, subtitle, icon: Icon }) {
  return (
    <Link
      to={to}
      className="group rounded-2xl bg-background-card p-6 shadow-soft border border-border-default hover:shadow-card hover:border-primary-purple/30 transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-r from-primary-purple to-primary-indigo group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="font-semibold text-text-primary">{title}</p>
          <p className="text-text-secondary text-sm mt-1">{subtitle}</p>
        </div>
      </div>
    </Link>
  );
}
