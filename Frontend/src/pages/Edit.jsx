import React, { useContext, useEffect, useState } from "react";
import { updateFood } from "../api/api.food";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Edit = () => {

    const navigate = useNavigate();
    const { user, loading: authLoading } = useContext(AuthContext);
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { id } = useParams();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: name === "price" ? Number(value) : value
        });
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const filteredForm = Object.fromEntries(
                Object.entries(form).filter(([_, value]) => value !== "")
            );

            await updateFood(id, filteredForm);
            navigate("/admin");
        } catch {
            setError("Error in Updating Food");
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="min-h-screen bg-[#1B1B1E] text-[#F2E9E4] flex items-center justify-center px-4">

            {error && (
                <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
            )}

            {/* Card */}
            <div className="w-full max-w-xl bg-[#2D2A32] p-8 rounded-3xl border border-[#3A2F2A] shadow-xl">

                {/* Heading */}
                <h1 className="text-3xl font-bold text-center mb-6">
                    Edit Food Item
                </h1>
                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Name */}
                    <div>
                        <label className="text-sm text-[#B8B0AA]">Food Name <span className="text-xs text-[#888]">(optional)</span></label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter food name"
                            className="w-full mt-1 px-4 py-2 rounded-xl bg-[#1B1B1E] border border-[#3A2F2A] focus:border-[#C9A66B] outline-none"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm text-[#B8B0AA]">Description <span className="text-xs text-[#888]">(optional)</span></label>
                        <textarea
                            rows="3"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Enter description"
                            className="w-full mt-1 px-4 py-2 rounded-xl bg-[#1B1B1E] border border-[#3A2F2A] focus:border-[#C9A66B] outline-none resize-none"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="text-sm text-[#B8B0AA]">Price <span className="text-xs text-[#888]">(optional)</span></label>
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            placeholder="Enter price"
                            className="w-full mt-1 px-4 py-2 rounded-xl bg-[#1B1B1E] border border-[#3A2F2A] focus:border-[#C9A66B] outline-none"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="text-sm text-[#B8B0AA]">Category <span className="text-xs text-[#888]">(optional)</span></label>
                        <input
                            type="text"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            placeholder="Enter category"
                            className="w-full mt-1 px-4 py-2 rounded-xl bg-[#1B1B1E] border border-[#3A2F2A] focus:border-[#C9A66B] outline-none"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 mt-4">

                        {/* Cancel */}
                        <button
                            type="button"
                            onClick={() => navigate("/admin")}
                            className="flex-1 border border-[#3A2F2A] py-2 rounded-xl hover:bg-[#1B1B1E] transition cursor-pointer"
                        >
                            Cancel
                        </button>

                        {/* Update */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="cursor-pointer flex-1 bg-[#C9A66B] text-[#1B1B1E] py-2 rounded-xl font-semibold hover:bg-[#b89258] transition active:scale-95"
                        >
                            {loading ? "Updating..." : "Update Food"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
};

export default Edit;