import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar"
import { allFoods } from "../api/api.food";
import Footer from "../components/Footer"
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Feed = () => {

  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (user && !user.isVerified) {
      navigate("/verify-otp", { state: { email: user.email, role: user.userType } });
      return;
    }

    const init = async () => {
      try {
        setError("");
        setLoading(true);

        const res = await allFoods(search, category);
        setData(res.foodItems);
      } catch {
        setError("Error in Fetching Data")
      } finally {
        setLoading(false);
      }
    }
    const timer = setTimeout(() => {
      init();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, category, user, authLoading, navigate])

  return (
    <div className="min-h-screen bg-[#0F0F10] text-white px-6 md:px-16 pt-28">
      <Navbar />

      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold">
          Explore Delicious Food 🍽️
        </h1>
        <p className="text-gray-400 mt-2">
          Discover meals from top food partners
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search food..."
          className="flex-1 px-4 py-3 rounded-xl bg-[#1B1B1E] border border-gray-700 focus:outline-none"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="cursor-pointer px-4 py-3 rounded-xl bg-[#1B1B1E] border border-gray-700">
          <option value="">All Categories</option>
          <option value="veg">Veg</option>
          <option value="non-veg">Non-Veg</option>
          <option value="fast-food">Fast-Food</option>
        </select>
      </div>

      {/* FOOD GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {/* CARD */}
        {data.map((item, index) => (
          <div
            key={item._id}
            className="bg-[#1B1B1E] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
          >
            {/* VIDEO */}
            <div className="h-48 w-full bg-black overflow-hidden">
              <img
                src={item.thumbnail}
                className="w-full h-full object-cover"
                alt="food"
              />
            </div>

            {/* CONTENT */}
            <div className="p-4">
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-sm text-[#C9A66B] mt-1">
                {item.foodPartner?.restaurantName || "Unknown restaurant"}
              </p>
              <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                {item.description}
              </p>

              {/* PRICE + BUTTON */}
              <div className="flex items-center justify-between mt-4">
                <span className="text-[#C9A66B] font-bold">₹{item.price}</span>

                <button onClick={() => {
                  navigate(`/food/${item._id}`)
                }} className="cursor-pointer px-3 py-1 text-sm bg-[#C9A66B] text-black rounded-lg hover:bg-[#b8955a]">
                  View
                </button>
              </div>
            </div>
          </div>
        ))}

      </div>
      <Footer />
    </div>
  );
};

export default Feed;