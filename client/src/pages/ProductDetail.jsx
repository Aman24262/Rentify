import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Star, Minus, Plus } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import useAuth from "../context/useAuth";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [product, setProduct] = useState(null);
  const [days, setDays] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    deliveryName: '',
    deliveryAddress: '',
    contactNumber: '',
    paymentMethod: 'Cash on Delivery'
  });

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setError("Unable to load this product"))
      .finally(() => setLoading(false));
  }, [id]);

  const rentNow = () => {
    if (!token) {
      toast.error("Please login to rent a product");
      navigate("/login");
      return;
    }
    if (Number(days) < 1) return toast.error("Rental days must be at least 1");
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.deliveryName || !formData.deliveryAddress || !formData.contactNumber) {
      toast.error("Please fill all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post("/orders", { 
        productId: id, 
        rentalDays: days,
        deliveryName: formData.deliveryName,
        deliveryAddress: formData.deliveryAddress,
        contactNumber: formData.contactNumber,
        paymentMethod: formData.paymentMethod
      });
      toast.success("Order created successfully");
      setShowModal(false);
      navigate("/profile");
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Could not place order");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-text-secondary">Loading product details...</div>
    </div>
  );
  if (error) return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-red-500">{error}</div>
    </div>
  );
  if (!product) return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-text-secondary">Product not found.</div>
    </div>
  );

  const totalPrice = product.pricePerDay * days;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-2"
    >
      {/* Product Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative overflow-hidden rounded-3xl bg-background-card shadow-card"
      >
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-96 lg:h-[500px] object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-purple/90 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-white shadow-soft">
            <Star size={16} />
            {product.category}
          </span>
        </div>
        {!product.availability && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <span className="text-white text-lg font-semibold bg-red-500 px-4 py-2 rounded-full">
              Currently Unavailable
            </span>
          </div>
        )}
      </motion.div>

      {/* Product Details */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-4xl font-bold text-text-primary mb-2">{product.title}</h1>
          <p className="text-text-secondary text-lg leading-relaxed">{product.description}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-text-secondary">
            <MapPin size={18} />
            <span>Local pickup available</span>
          </div>
        </div>

        <div className="bg-background-card rounded-2xl p-6 shadow-soft border border-border-default">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-text-secondary text-sm">Price per day</p>
              <p className="text-3xl font-bold text-primary-purple">₹{product.pricePerDay}</p>
            </div>
            <div className="text-right">
              <p className="text-text-secondary text-sm">Total for {days} day{days > 1 ? 's' : ''}</p>
              <p className="text-2xl font-bold text-text-primary">₹{totalPrice}</p>
            </div>
          </div>

          {/* Days Selector */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-text-secondary" />
              <span className="font-medium text-text-primary">Rental Duration</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDays(Math.max(1, days - 1))}
                className="w-10 h-10 rounded-full border border-border-default flex items-center justify-center hover:bg-background-main transition-colors duration-200"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center font-semibold text-text-primary">{days}</span>
              <button
                onClick={() => setDays(days + 1)}
                className="w-10 h-10 rounded-full border border-border-default flex items-center justify-center hover:bg-background-main transition-colors duration-200"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting || !product.availability}
          onClick={rentNow}
          className={`w-full rounded-full py-4 text-lg font-semibold shadow-soft transition-all duration-300 ${
            product.availability
              ? 'bg-gradient-to-r from-primary-purple to-primary-indigo text-white hover:shadow-glow-purple'
              : 'bg-background-soft text-text-muted cursor-not-allowed'
          }`}
        >
          {!product.availability
            ? "Currently Unavailable"
            : isSubmitting
            ? "Placing Order..."
            : token
            ? `Rent for ₹${totalPrice}`
            : "Login to Rent"}
        </motion.button>

        {!token && (
          <p className="text-center text-text-secondary">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-primary-indigo hover:text-primary-purple font-medium transition-colors duration-300"
            >
              Sign up
            </button>
          </p>
        )}
      </motion.div>

      {/* Rental Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-background-card rounded-2xl shadow-card max-w-md w-full p-6"
          >
            <h2 className="text-2xl font-bold text-text-primary mb-4">Complete Your Rental</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.deliveryName}
                  onChange={(e) => setFormData({...formData, deliveryName: e.target.value})}
                  className="w-full px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Delivery Address</label>
                <textarea
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
                  className="w-full px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Contact Number</label>
                <input
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                  className="w-full px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple"
                >
                  <option value="Cash on Delivery">Cash on Delivery</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-border-default rounded-lg text-text-primary hover:bg-background-card transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-purple to-primary-indigo text-white rounded-lg hover:shadow-glow-purple transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Placing Order..." : "Confirm Order"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.section>
  );
}
