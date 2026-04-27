import React, { useContext, useEffect, useRef } from "react";
import { useState } from 'react';
import { createFood } from '../api/api.food';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Create = () => {

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  })

  const [video, setVideo] = useState(null);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
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
    setLoading(true);
    setError("");

    if (!video || !thumbnail) {
      setError("Video and thumbnail are required");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("video", video);
    formData.append("thumbnail", thumbnail);

    try {
      const response = await createFood(formData);
      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
      });
      setVideo(null);
      setThumbnail(null);
      navigate("/feed");

    } catch (err) {
      setError(err.response?.data?.message || "Failed to create food item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F10] text-white px-6 md:px-16 pt-10">

      <div className="max-w-3xl mx-auto bg-[#1B1B1E] px-8 rounded-2xl shadow-xl">

        <button
          onClick={() => navigate(-1)}
          className="mb-4 mt-5 text-sm text-gray-400 hover:text-white cursor-pointer"
        >
          ← Back
        </button>
        {/* TITLE */}
        <h1 className="text-2xl font-bold mb-6">
          Create Food Item 🍽️
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* NAME */}
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Food Name"
            className="w-full px-4 py-3 rounded-xl bg-[#0F0F10] border border-gray-700 focus:outline-none"
            required
          />

          {/* DESCRIPTION */}
          <textarea
            placeholder="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-3 rounded-xl bg-[#0F0F10] border border-gray-700 focus:outline-none"
          />

          {/* PRICE */}
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full px-4 py-3 rounded-xl bg-[#0F0F10] border border-gray-700 focus:outline-none"
            required
          />

          {/* CATEGORY */}
          <select name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-[#0F0F10] border border-gray-700"
            required>
            <option value="">Select Category</option>
            <option value="fast-food">Fast-Food</option>
            <option value="non-veg">Non-Veg</option>
            <option value="veg">Veg</option>
            <option value="dessert">Dessert</option>
          </select>

          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
            style={{ display: 'none' }}
          />

          <input
            ref={thumbnailInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            style={{ display: 'none' }}
          />

          {/* VIDEO UPLOAD */}
          <div
            className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:bg-[#2a2a2e] transition cursor-pointer"
            onClick={() => videoInputRef.current.click()}
          >
            <p className="text-gray-400 text-sm mb-2">Upload Video</p>
            <p className="text-xs text-gray-500">{video ? video.name : "click to upload"}</p>
          </div>

          {/* THUMBNAIL UPLOAD */}
          <div
            className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:bg-[#2a2a2e] transition cursor-pointer"
            onClick={() => thumbnailInputRef.current.click()}
          >
            <p className="text-gray-400 text-sm mb-2">Upload Picture</p>
            <p className="text-xs text-gray-500">{thumbnail ? thumbnail.name : "click to upload"}</p>
          </div>

          {/* BUTTON */}
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
              {loading ? "Creating..." : "Create Item"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default Create;