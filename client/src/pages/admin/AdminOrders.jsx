import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const statuses = ["Pending", "Approved", "Returned", "Cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchOrders = () =>
    api
      .get("/orders")
      .then((res) => setOrders(res.data))
      .catch(() => setError("Could not load orders"))
      .finally(() => setLoading(false));

  useEffect(() => void fetchOrders(), []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}`, { status });
      toast.success("Order status updated");
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update status");
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
        <h1 className="text-xl font-semibold">Rental Orders</h1>
        <p className="mt-1 text-sm text-slate-400">Review every rental request and update status accurately.</p>
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-700">
        {loading ? (
          <p className="p-4 text-slate-400">Loading orders...</p>
        ) : error ? (
          <p className="p-4 text-rose-300">{error}</p>
        ) : orders.length === 0 ? (
          <p className="p-4 text-slate-400">No orders yet.</p>
        ) : (
          <table className="min-w-full table-fixed text-left text-sm">
            <thead className="bg-slate-900">
              <tr className="text-slate-300">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Delivery Name</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3 text-right">Days</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t border-slate-800">
                  <td className="px-4 py-3 text-text-primary truncate">{order.product?.title || "Product removed"}</td>
                  <td className="px-4 py-3 text-text-primary truncate">{order.user?.name || "Unknown user"}</td>
                  <td className="px-4 py-3 text-text-primary truncate">{order.deliveryName}</td>
                  <td className="px-4 py-3 text-text-primary truncate max-w-xs" title={order.deliveryAddress}>{order.deliveryAddress}</td>
                  <td className="px-4 py-3 text-text-primary">{order.contactNumber}</td>
                  <td className="px-4 py-3 text-right text-text-primary">{order.rentalDays}</td>
                  <td className="px-4 py-3 text-right text-text-primary">₹{order.totalPrice}</td>
                  <td className="px-4 py-3 text-center">
                    <select value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)} className="rounded bg-slate-800 p-2">
                      {statuses.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
