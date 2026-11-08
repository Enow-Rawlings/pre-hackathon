import { useEffect, useState } from "react";
import { getItems, createItem, updateItem, deleteItem } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

export default function Items() {
    const {user, logout} = useAuth();
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load items once, when the page first renders
  useEffect(() => {
    getItems()
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); // stop the page from reloading
    setError("");
    try {
      const newItem = await createItem({ name, description });
      setItems((prev) => [newItem, ...prev]); // newest first
      setName("");
      setDescription("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggle = async (item) => {
    try {
      const updated = await updateItem(item._id, { done: !item.done });
      setItems((prev) => prev.map((i) => (i._id === updated._id ? updated : i)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteItem(id);
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-xl">
               <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-800">Hackathon Starter</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">Hi, {user.name}</span>
            <button
              onClick={logout}
              className="rounded-lg bg-slate-800 px-3 py-1 text-sm text-white hover:bg-slate-900"
            >
              Logout
            </button>
          </div>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-6 space-y-3 rounded-xl bg-white p-4 shadow">
          <input
            className="w-full rounded-lg border border-slate-300 p-2 outline-none focus:border-indigo-500"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full rounded-lg border border-slate-300 p-2 outline-none focus:border-indigo-500"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700"
          >
            Add item
          </button>
        </form>

        {/* Error banner */}
        {error && (
          <p className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">{error}</p>
        )}

        {/* List: loading, empty, and data states */}
        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-slate-500">No items yet. Add your first one above.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item._id}
                className="flex items-center justify-between rounded-xl bg-white p-4 shadow"
              >
                <div>
                  <p className={`font-medium ${item.done ? "text-slate-400 line-through" : "text-slate-800"}`}>
                    {item.name}
                  </p>
                  {item.description && (
                    <p className="text-sm text-slate-500">{item.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggle(item)}
                    className="rounded-lg bg-emerald-100 px-3 py-1 text-sm text-emerald-700 hover:bg-emerald-200"
                  >
                    {item.done ? "Undo" : "Done"}
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="rounded-lg bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}