import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const {user} = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-[#1B1B1E] text-[#F2E9E4]">

      <Navbar />

      {/* HERO */}
      <section className="pt-28 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between">

        {/* LEFT */}
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Watch Food. <br />
            <span className="text-[#C9A66B]">Crave Instantly.</span>
          </h1>

          <p className="mt-6 text-[#F2E9E4]/70 text-lg">
            BiteFlix turns food into entertainment. Scroll short videos,
            discover dishes, and order instantly.
          </p>

          {/* BUTTONS */}
          <div className="flex gap-4 mt-8">
            <button onClick={()=>{
              {user ? navigate("/feed") : navigate("/register")}
            }} className="bg-[#C9A66B] text-[#1B1B1E] px-6 py-3 rounded-full font-semibold hover:bg-[#b89258] cursor-pointer active:scale-95 transition">
              Get Started 🚀
            </button>

            <button
              onClick={() => navigate("/about")}
              className="border cursor-pointer active:scale-95 border-[#5C3D2E] text-[#F2E9E4] px-6 py-3 rounded-full hover:bg-[#2D2A32] transition"
            >
              Explore
            </button>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="mt-12 md:mt-0 relative">
          <img
            src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
            alt="food"
            className="w-[320px] md:w-[420px] rounded-3xl border border-[#5C3D2E] shadow-2xl"
          />

          {/* glow */}
          <div className="absolute inset-0 bg-[#C9A66B]/20 blur-3xl -z-10 rounded-full" />
        </div>

      </section>

      {/* FEATURES */}
      <section className="mt-24 px-6 md:px-16 grid md:grid-cols-3 gap-8">

        <div className="bg-[#2D2A32] p-6 rounded-2xl border border-[#5C3D2E] hover:border-[#C9A66B] transition">
          <h3 className="text-xl font-semibold text-[#C9A66B]">
            🎬 Reels Experience
          </h3>
          <p className="mt-2 text-[#F2E9E4]/70">
            Scroll food like Instagram reels.
          </p>
        </div>

        <div className="bg-[#2D2A32] p-6 rounded-2xl border border-[#5C3D2E] hover:border-[#C9A66B] transition">
          <h3 className="text-xl font-semibold text-[#C9A66B]">
            ⚡ Instant Discovery
          </h3>
          <p className="mt-2 text-[#F2E9E4]/70">
            Find trending dishes instantly.
          </p>
        </div>

        <div className="bg-[#2D2A32] p-6 rounded-2xl border border-[#5C3D2E] hover:border-[#C9A66B] transition">
          <h3 className="text-xl font-semibold text-[#C9A66B]">
            🛒 Fast Ordering
          </h3>
          <p className="mt-2 text-[#F2E9E4]/70">
            Order directly from videos.
          </p>
        </div>

      </section>

      <Footer />

    </div>
  );
};

export default Home;