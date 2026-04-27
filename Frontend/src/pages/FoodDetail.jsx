import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSingleFood } from "../api/api.food";
import { useState, useEffect } from "react";
import { addToCart } from "../api/api.cart";
import { AuthContext } from "../context/AuthContext";

const FoodDetail = () => {

    const { id } = useParams();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [food, setFood] = useState(null);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const canAddToCart = user?.userType === "user" && user?.isVerified;

    useEffect(() => {
        const fetchFood = async () => {
            try {
                const res = await getSingleFood(id);
                setFood(res.food);
            } catch (err) {
                console.error(err);
            }
        };

        fetchFood();
    }, [id]);


    const addingToCart = async () => {
        try {
            setError("");
            setLoading(true);
            await addToCart(id);
            setSuccess("Item Added Successfully");
        } catch (err) {
            console.error(err);
            setError("Failed to add to cart");
            setSuccess("");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
    if (error || success) {
        const timer = setTimeout(() => {
            setError("");
            setSuccess("");
        }, 2000);

        return () => clearTimeout(timer);
    }
}, [error, success]);

    if (!food) return <p className="text-white">Loading...</p>;

    return (
        <div className="min-h-screen bg-[#0F0F10] text-white">

            <div className="p-4">
                <button
                    onClick={() => navigate(-1)}
                    className="cursor-pointer flex items-center gap-2 text-sm text-white bg-black/60 px-4 py-2 rounded-full hover:bg-black/80 transition"
                >
                    ← Back
                </button>
            </div>

            <div className="w-full bg-black flex justify-center">
                <div className="w-full max-w-6xl aspect-video rounded-xl overflow-hidden shadow-lg">
                    {food.video ? (
                        <video
                            className="w-full h-full object-contain bg-black"
                            controls
                            poster={food.thumbnail}
                        >
                            <source src={food.video} type="video/mp4" />
                        </video>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            Video not available
                        </div>
                    )}
                </div>
            </div>
            {/* CONTENT */}
            <div className="max-w-5xl mx-auto px-6 py-8">

                {/* TITLE + PRICE */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h1 className="text-3xl font-bold">
                        {food.name}
                    </h1>

                    <span className="text-[#C9A66B] text-2xl font-semibold">
                        ₹{food.price}
                    </span>
                </div>

                {/* DESCRIPTION */}
                <p className="text-gray-400 mt-4 leading-relaxed max-w-3xl">
                    {food.description}
                </p>

                {/* ACTION BUTTONS */}
                <div className="flex gap-4 mt-6">

                    {canAddToCart ? (
                      <button
                        onClick={addingToCart}
                        disabled={loading}
                        className="active:scale-95 cursor-pointer px-5 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 transition">
                        {loading ? "Adding..." : "Add to Cart"}
                      </button>
                    ) : (
                      <button
                      disabled
                        className="active:scale-95 cursor-pointer px-5 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 transition">
                        {user ? (user.isVerified ? "Only customers can add to cart" : "Verify your email to add cart") : "Login to add to cart"}
                      </button>
                    )}
                </div>

                {error && <p className="text-red-500 mt-2">{error}</p>}
                {success && <p className="text-green-500 mt-2">{success}</p>}
                {user && !user.isVerified && user.userType === "user" && (
                  <p className="text-yellow-300 mt-2 text-sm">
                    Your email is not verified yet. Verify your email to use cart and full customer features.
                  </p>
                )}
                {/* EXTRA INFO CARDS */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">

                    <div className="bg-[#1B1B1E] p-4 rounded-xl text-center">
                        <p className="text-gray-400 text-sm">Category</p>
                        <p className="font-semibold mt-1">{food.category}</p>
                    </div>

                    <div className="bg-[#1B1B1E] p-4 rounded-xl text-center">
                        <p className="text-gray-400 text-sm">Rating</p>
                        <p className="font-semibold mt-1">⭐ 4.5</p>
                    </div>

                    <div className="bg-[#1B1B1E] p-4 rounded-xl text-center">
                        <p className="text-gray-400 text-sm">Delivery</p>
                        <p className="font-semibold mt-1">30 mins</p>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default FoodDetail;