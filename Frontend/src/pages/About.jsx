import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const About = () => {
  const {user} = useContext(AuthContext); 
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1B1B1E] text-[#F2E9E4] px-6 md:px-16 pt-28">

      <Navbar />

      {/* HERO */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Food you don’t just order… <br />
          you <span className="text-[#C9A66B]">feel it 🍿</span>
        </h1>

        <p className="mt-6 text-lg text-[#F2E9E4]/70">
          BiteFlix is where food meets storytelling.
          Every dish is a moment. Every scroll builds a craving.
        </p>
      </div>

      {/* FEATURES */}
      <div className="mt-16 grid md:grid-cols-3 gap-8">

        <div className="bg-[#2D2A32] border border-[#5C3D2E]/40 rounded-2xl p-6 hover:border-[#C9A66B] transition">
          <h2 className="text-xl font-semibold text-[#C9A66B]">
            🍿 Food as Entertainment
          </h2>
          <p className="mt-3 text-[#F2E9E4]/70">
            Every dish is captured like a scene — designed to make you crave instantly.
          </p>
        </div>

        <div className="bg-[#2D2A32] border border-[#5C3D2E]/40 rounded-2xl p-6 hover:border-[#C9A66B] transition">
          <h2 className="text-xl font-semibold text-[#C9A66B]">
            🎬 Endless Feed
          </h2>
          <p className="mt-3 text-[#F2E9E4]/70">
            Scroll through food stories like reels — no searching, just discovery.
          </p>
        </div>

        <div className="bg-[#2D2A32] border border-[#5C3D2E]/40 rounded-2xl p-6 hover:border-[#C9A66B] transition">
          <h2 className="text-xl font-semibold text-[#C9A66B]">
            🔥 Instant Action
          </h2>
          <p className="mt-3 text-[#F2E9E4]/70">
            From craving to checkout in seconds — fast, emotional, seamless.
          </p>
        </div>

      </div>

      {/* EXPERIENCE SECTION */}
      <div className="mt-20 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold">
          Not a menu… <br />
          <span className="text-[#C9A66B]">a food experience 🎬</span>
        </h2>

        <p className="mt-6 text-lg text-[#F2E9E4]/70">
          BiteFlix transforms food into visual storytelling — sizzling, pouring,
          melting moments captured like cinema.
        </p>

        <p className="mt-4 text-[#F2E9E4]/50">
          Entertainment for your eyes. Satisfaction for your hunger.
        </p>
      </div>

      {/* FOUNDER STORY */}
      <div className="mt-24 max-w-4xl mx-auto text-center">

        <h2 className="text-3xl md:text-4xl font-bold">
          The Story Behind BiteFlix
        </h2>

        <div className="mt-8 text-lg text-[#F2E9E4]/70 space-y-4">

          <p>
            BiteFlix started with one simple insight — people don’t read menus anymore,
            they scroll.
          </p>

          <p>
            The idea came from late-night cravings where short food videos felt more powerful
            than any ordering app.
          </p>

          <p>
            So we asked: what if food discovery felt like Netflix?
            Visual. Addictive. Emotional.
          </p>

          <p>
            That’s how BiteFlix was built — combining entertainment and hunger into
            one seamless experience.
          </p>

        </div>

        <p className="text-[#C9A66B] mt-8 font-semibold">
          “We didn’t build a food app. We built cravings.”
        </p>

      </div>

      {/* QUOTE */}
      <div className="mt-16 text-center">
        <div className="inline-block bg-[#2D2A32] border border-[#5C3D2E]/40 rounded-2xl px-6 py-5">
          <p className="text-xl font-semibold text-[#C9A66B]">
            “Every scroll is a hunger story.”
          </p>
        </div>
      </div>

      {/* TAGLINE */}
      <div className="mt-16 text-center">
        <p className="text-sm tracking-widest uppercase text-[#F2E9E4]/50">
          Built for people who eat with their eyes first
        </p>
      </div>

      {/* CTA */}
      <div className="mt-20 text-center">
        <button onClick={()=>{
          {user? navigate("/feed") : navigate("/login") }
        }} className="bg-[#C9A66B] text-[#1B1B1E] px-8 py-3 rounded-full font-semibold hover:bg-[#b89258] transition cursor-pointer active:scale-95">
          Enter BiteFlix 🚀
        </button>
      </div>
      
      <Footer />

    </div>
  );
};

export default About;