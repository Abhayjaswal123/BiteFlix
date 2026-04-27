import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { allFoods, deleteFood } from "../api/api.food";
import { AuthContext } from "../context/AuthContext";
import AdminNavbar from "../components/AdminNavbar";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);

  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const getItems = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await allFoods();
      const foodItems = Array.isArray(res.foodItems) ? res.foodItems : [];

      const filteredFoods = foodItems.filter((item) => {
        const ownerId = item.foodPartner?._id ?? item.foodPartner;
        return user && ownerId === user._id;
      });

      setData(filteredFoods);
    } catch (err) {
      setError("Error in fetching food items");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (food) => {
    setDeleteTarget(food);
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await deleteFood(deleteTarget._id);
      await getItems();
      setDeleteTarget(null);
    } catch (err) {
      setError("Unable to delete food item");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    if (user.userType !== "foodPartner" || !user.isVerified) return;
    getItems();
  }, [user, authLoading]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.userType !== "foodPartner") {
      navigate("/");
      return;
    }
    if (!user.isVerified) {
      navigate("/verify-otp", { state: { email: user.email, role: user.userType } });
    }
  }, [user, authLoading, navigate]);

  return (
    <div className="min-h-screen bg-[#1B1B1E] text-[#F2E9E4]">

      {/* 🔥 Navbar */}
      <AdminNavbar />

      {/* 🔥 Page Content */}
      <div className="p-6 pt-8">

        {/* Loading */}
        {loading && (
          <p className="text-[#C9A66B] mb-4">Loading foods...</p>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold tracking-wide">
            Admin Dashboard
          </h1>

          <button
            onClick={() => navigate("/create")}
            className="cursor-pointer bg-[#C9A66B] text-[#1B1B1E] px-5 py-2 rounded-full font-semibold hover:bg-[#b89258] transition active:scale-95"
          >
            + Add Food
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 mb-4 text-sm">{error}</p>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center mt-20 text-center">

              <h2 className="text-2xl font-semibold text-[#C9A66B]">
                No food created 🍽️
              </h2>

              <p className="text-sm text-[#B8B0AA] mt-2">
                Start by adding your first food item
              </p>

            </div>
          )}
          {data.map((item) => (
            <div
              key={item._id}
              className="bg-[#2D2A32] border border-[#3A2F2A] rounded-2xl p-4 flex flex-col gap-3 transition-all duration-300 hover:border-[#C9A66B] hover:scale-[1.02] hover:shadow-lg hover:shadow-black/30"
            >

              {/* Image */}
              <div className="relative h-40 w-full rounded-xl overflow-hidden border border-[#3A2F2A]">
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              {/* Info */}
              <h2 className="text-lg font-semibold">
                {item.name}
              </h2>

              <p className="text-sm text-[#C9A66B] mt-1">
                {item.foodPartner?.restaurantName || "Unknown restaurant"}
              </p>

              <p className="text-sm text-[#B8B0AA] line-clamp-2">
                {item.description}
              </p>

              {/* Price + Category */}
              <div className="flex justify-between items-center mt-2">
                <span className="font-bold text-[#C9A66B] text-lg">
                  ₹{item.price}
                </span>

                <span className="text-xs px-3 py-1 rounded-full bg-[#1B1B1E] border border-[#3A2F2A] text-[#D6CCC2]">
                  {item.category}
                </span>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-3">

                <button
                  onClick={() => navigate(`/edit/${item._id}`)}
                  className="cursor-pointer flex-1 bg-[#C9A66B] text-[#1B1B1E] py-2 rounded-xl font-semibold hover:bg-[#b89258] transition active:scale-95"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDeleteClick(item)}
                  className="cursor-pointer flex-1 bg-transparent border border-red-500 text-red-400 py-2 rounded-xl hover:bg-red-500/10 transition active:scale-95"
                >
                  Delete
                </button>

              </div>
            </div>
          ))}

        </div>

      </div>

      {/* 🔥 Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#27252B] p-6 shadow-2xl">

            <h2 className="text-xl font-semibold mb-4">
              Confirm Delete
            </h2>

            <p className="text-sm text-[#C9A66B] mb-5">
              Are you sure you want to delete "{deleteTarget.name}"?
            </p>

            <div className="flex gap-3 justify-end">

              <button
                onClick={cancelDelete}
                className="rounded-full border border-[#3A2F2A] px-4 py-2 text-sm text-[#D6CCC2] hover:bg-white/5 transition"
              >
                No
              </button>

              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="rounded-full bg-[#C9A66B] px-4 py-2 text-sm font-semibold text-[#1B1B1E] hover:bg-[#b89258] transition disabled:opacity-70"
              >
                {deleting ? "Deleting..." : "Yes, delete"}
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;