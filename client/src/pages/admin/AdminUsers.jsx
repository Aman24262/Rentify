import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import confirmAction from "../../utils/confirmAction";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchUsers = () =>
    api
      .get("/users")
      .then((res) => setUsers(res.data))
      .catch(() => setError("Could not load users"))
      .finally(() => setLoading(false));

  useEffect(() => void fetchUsers(), []);

  const remove = async (id) => {
    const confirmed = confirmAction("Delete this user account?");
    if (!confirmed) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success("User removed");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
        <h1 className="text-xl font-semibold">Users</h1>
        <p className="mt-1 text-sm text-slate-400">Monitor registered accounts and keep your marketplace clean.</p>
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-700">
        {loading ? (
          <p className="p-4 text-text-primary">Loading users...</p>
        ) : error ? (
          <p className="p-4 text-rose-300">{error}</p>
        ) : users.length === 0 ? (
          <p className="p-4 text-slate-400">No users found.</p>
        ) : (
          <table className="min-w-full table-fixed text-left text-sm">
            <thead className="bg-slate-900">
              <tr className="text-slate-300">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3 text-center">Role</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t border-slate-800">
                  <td className="px-4 py-3 text-text-primary truncate">{user.name}</td>
                  <td className="px-4 py-3 text-text-primary truncate">{user.email}</td>
                  <td className="px-4 py-3 text-center text-text-primary">{user.role}</td>
                  <td className="px-4 py-3 text-right">
                    {user.role !== "admin" ? (
                      <button onClick={() => remove(user._id)} className="rounded bg-rose-600 px-3 py-1 text-xs">Delete</button>
                    ) : (
                      <span className="text-xs text-slate-500">Protected</span>
                    )}
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
