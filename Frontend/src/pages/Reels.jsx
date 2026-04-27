import React, { useContext, useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { allFoods } from "../api/api.food";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Reels = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reelsRef = useRef(null);

  useEffect(() => {
    if (authLoading) return;

    if (user && !user.isVerified) {
      navigate("/verify-otp", {
        state: { email: user.email, role: user.userType },
      });
      return;
    }

    const getReels = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await allFoods();
        setData(res.foodItems || []);
      } catch {
        setError("Unable to load reels. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getReels();
  }, [authLoading, user, navigate]);

  // 🎯 AUTO PLAY LOGIC
  useEffect(() => {
    if (!reelsRef.current) return;

    const videos = reelsRef.current.querySelectorAll("video");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: [0.7] }
    );

    videos.forEach((video) => observer.observe(video));

    return () => observer.disconnect();
  }, [data]);

  return (
    <div className="min-h-screen bg-black text-white pt-28">
      <Navbar />

      {/* CENTERED CONTAINER */}
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {loading && <p className="text-[#C9A66B] mb-4">Loading reels...</p>}
        {error && <p className="text-red-400 mb-4">{error}</p>}

        {/* 🎯 MAIN REEL WRAPPER */}
        <div className="flex justify-center">
          <div
            ref={reelsRef}
            className="
              w-full 
              max-w-md 
              h-[75vh] 
              md:h-[80vh]
              overflow-y-scroll 
              snap-y snap-mandatory
              rounded-2xl 
              border border-white/10
              shadow-2xl
              scrollbar-thin 
              scrollbar-thumb-[#C9A66B]/60 
              scrollbar-track-transparent
            "
          >
            {data.length === 0 && !loading ? (
              <div className="flex h-full items-center justify-center text-gray-400">
                No reels available yet.
              </div>
            ) : (
              data.map((item) => (
                <div
                  key={item._id}
                  className="snap-start h-full w-full relative overflow-hidden"
                >
                  {/* VIDEO */}
                  <video
                    className="h-full w-full object-cover"
                    src={item.video}
                    poster={item.thumbnail}
                    loop
                    muted
                    playsInline
                  />

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                  {/* CONTENT */}
                  <div className="absolute bottom-6 left-4 right-4 z-10 flex flex-col gap-3">
                    <div>
                      <p className="text-xl font-semibold">{item.name}</p>
                      <p className="text-xs text-[#C9A66B] mt-1">
                        {item.foodPartner?.restaurantName || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="rounded-full bg-black/60 px-3 py-1 text-sm text-[#C9A66B]">
                        ₹{item.price}
                      </div>

                      <button
                        onClick={() => navigate(`/food/${item._id}`)}
                        className="rounded-full bg-[#C9A66B] px-4 py-1 text-sm font-semibold text-black hover:bg-[#b89258]"
                      >
                        Open
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reels;