import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"
import { getCartItems, removeFromCart, updateQuantity } from "../api/api.cart";
import { AuthContext } from "../context/AuthContext";

const Cart = () => {

  const[loading, setLoading] = useState(false);
  const[error, setError] = useState("");
  const[data, setData] = useState([]);
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    if (user.userType !== "user") return;

    const initItems = async () => {
      try {
        setError("");
        setLoading(true);
        const res = await getCartItems();
        setData(res.cart.items);
      } catch {
        setError("Failed to load foodItems");
      } finally {
        setLoading(false);
      }
    }

    initItems();
  }, [user, authLoading]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.userType !== "user") {
      navigate("/");
      return;
    }
    if (!user.isVerified) {
      navigate("/verify-otp", { state: { email: user.email, role: user.userType } });
    }
  }, [user, authLoading, navigate]);

  const validItems = data.filter(item => item.food);

  const handleRemove = async (foodId) => {
    try {
      await removeFromCart(foodId);
      setData(data.filter(item => item.food && item.food._id !== foodId));
    } catch (err) {
      setError("Failed to remove item");
    }
  }

  const handleUpdateQuantity = async (foodId, newQuantity) => {
    if (newQuantity <= 0) {
      await handleRemove(foodId);
      return;
    }
    try {
      await updateQuantity({ foodId, quantity: newQuantity });
      setData(data.map(item => 
        item.food._id === foodId ? { ...item, quantity: newQuantity } : item
      ));
    } catch (err) {
      setError("Failed to update quantity");
    }
  }

  const subtotal = validItems.reduce((sum, item) => sum + (item.food.price * item.quantity), 0);
  const deliveryFee = 40;
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + deliveryFee + tax;

  return (
    <div className="min-h-screen bg-[#0F0F10] text-white px-6 md:px-16 pt-28">
        <Navbar />
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold">Your Cart 🛒</h1>
        <p className="text-gray-400 mt-2">
          Review your items before checkout
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">

        {/* LEFT - CART ITEMS */}
        <div className="flex-1 space-y-6">

          {loading && <p className="text-white">Loading cart...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {validItems.length === 0 && !loading && <p className="text-gray-400">Your cart is empty</p>}

          {validItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 bg-[#1B1B1E] p-4 rounded-2xl"
            >
              {/* IMAGE */}
              <div className="w-24 h-24 bg-gray-700 rounded-xl overflow-hidden">
                {item.food.thumbnail && (
                  <img src={item.food.thumbnail} alt={item.food.name} className="w-full h-full object-cover" />
                )}
              </div>

              {/* DETAILS */}
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{item.food.name}</h2>
                <p className="text-gray-400 text-sm">
                  {item.food.description}
                </p>

                {/* QUANTITY */}
                <div className="flex items-center gap-3 mt-3">
                  <button 
                    onClick={() => handleUpdateQuantity(item.food._id, item.quantity - 1)}
                    className="px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => handleUpdateQuantity(item.food._id, item.quantity + 1)}
                    className="px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* PRICE */}
              <div className="text-right">
                <p className="text-[#C9A66B] font-bold">₹{item.food.price}</p>
                <button 
                  onClick={() => handleRemove(item.food._id)}
                  className="text-red-400 text-sm mt-2 hover:underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

        </div>

        {/* RIGHT - SUMMARY */}
        <div className="w-full lg:w-[350px] bg-[#1B1B1E] p-6 rounded-2xl h-fit">

          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

          <div className="space-y-3 text-gray-300">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{tax}</span>
            </div>
          </div>

          <hr className="my-4 border-gray-700" />

          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-[#C9A66B]">₹{total}</span>
          </div>

          <button className="w-full mt-6 py-3 bg-[#C9A66B] text-black font-semibold rounded-xl hover:bg-[#b8955a] transition">
            Checkout
          </button>

        </div>

      </div>

    </div>
  );
};

export default Cart;