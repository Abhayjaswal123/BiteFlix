import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { logoutUser, logoutFoodPartner } from "../api/api.auth";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isVerified = user?.isVerified;

  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleClick = async () => {
    try {
      if (user?.userType === "user") {
        await logoutUser();
      } else {
        await logoutFoodPartner();
      }
      logout();
      navigate("/");
    } catch {
      setError("Logout Failed");
    }
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] md:w-[80%] rounded-2xl border border-[#5C3D2E]/40 bg-[#1B1B1E]/80 backdrop-blur-xl shadow-lg">

      <div className="flex items-center justify-between px-6 py-3">

        {/* Logo */}
        <h1
          onClick={() => navigate("/")}
          className="text-lg md:text-xl font-bold tracking-wide cursor-pointer"
        >
          <span className="text-[#C9A66B]">Bite</span>
          <span className="text-[#F2E9E4]">Flix</span>
        </h1>

        {/* Hamburger (Mobile) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white text-2xl"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4 text-sm font-medium">

          <button
            onClick={() => navigate("/about")}
            className={`px-3 py-1 rounded-full transition ${isActive("/about")
              ? "bg-[#C9A66B]/20 text-[#C9A66B]"
              : "text-[#F2E9E4]/70 hover:text-[#F2E9E4] hover:bg-[#2D2A32]"
              }`}
          >
            About
          </button>

          {user && (
            <>
              {!isVerified ? (
                <button
                  onClick={() => navigate("/verify-otp", { state: { email: user.email, role: user.userType } })}
                  className="bg-[#C9A66B] px-4 py-2 rounded-full text-[#1B1B1E] font-semibold hover:bg-[#b89258] transition"
                >
                  Verify Email
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/feed")}
                    className={`px-3 py-1 rounded-full transition ${isActive("/feed")
                      ? "bg-[#C9A66B]/20 text-[#C9A66B]"
                      : "text-[#F2E9E4]/70 hover:text-[#F2E9E4] hover:bg-[#2D2A32]"
                      }`}
                  >
                    Feed
                  </button>

                  <button
                    onClick={() => navigate("/reels")}
                    className={`px-3 py-1 rounded-full transition ${isActive("/reels")
                      ? "bg-[#C9A66B]/20 text-[#C9A66B]"
                      : "text-[#F2E9E4]/70 hover:text-[#F2E9E4] hover:bg-[#2D2A32]"
                      }`}
                  >
                    Reels
                  </button>

                  {user?.userType === "user" && (
                    <button
                      onClick={() => navigate("/cart")}
                      className={`px-3 py-1 rounded-full transition ${isActive("/cart")
                        ? "bg-[#C9A66B]/20 text-[#C9A66B]"
                        : "text-[#F2E9E4]/70 hover:text-[#F2E9E4] hover:bg-[#2D2A32]"
                        }`}
                    >
                      Cart
                    </button>
                  )}
                </>
              )}
            </>
          )}

          {!user ? (
            <button
              onClick={() => navigate("/login")}
              className="bg-[#C9A66B] px-5 py-2 rounded-full text-[#1B1B1E] font-semibold hover:bg-[#b89258] transition"
            >
              Login
            </button>
          ) : (
            <div className="relative group">

              <div className="w-9 h-9 rounded-full bg-[#C9A66B] flex items-center justify-center text-sm font-bold text-[#1B1B1E] cursor-pointer">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div className="absolute right-0 mt-3 w-36 bg-[#2D2A32] border border-[#5C3D2E]/40 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50">

                <button
                  onClick={handleClick}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#3a363f] rounded-xl"
                >
                  Logout
                </button>

                {user?.userType === "foodPartner" && isVerified && (
                  <button
                    onClick={() => navigate("/admin")}
                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3a363f] rounded-xl"
                  >
                    Admin Dashboard
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-3 text-sm font-medium cursor-pointer">

          <button className="cursor-pointer" onClick={() => { navigate("/about"); setMenuOpen(false); }}>
            About
          </button>

          {user && (
            <>
              {!isVerified ? (
                <button
                  onClick={() => { navigate("/verify-otp", { state: { email: user.email, role: user.userType } }); setMenuOpen(false); }}
                  className="text-[#C9A66B] cursor-pointer"
                >
                  Verify Email
                </button>
              ) : (
                <>
                  <button className="cursor-pointer" onClick={() => { navigate("/feed"); setMenuOpen(false); }}>
                    Feed
                  </button>

                  <button className="cursor-pointer" onClick={() => { navigate("/reels"); setMenuOpen(false); }}>
                    Reels
                  </button>

                  {user?.userType === "user" && (
                    <button className="cursor-pointer" onClick={() => { navigate("/cart"); setMenuOpen(false); }}>
                      Cart
                    </button>
                  )}

                  {user?.userType === "foodPartner" && (
                    <button className="cursor-pointer" onClick={() => { navigate("/admin"); setMenuOpen(false); }}>
                      Admin Dashboard
                    </button>
                  )}
                </>
              )}
            </>
          )}

          {!user ? (
            <button
              onClick={() => { navigate("/login"); setMenuOpen(false); }}
              className="text-[#C9A66B] cursor-pointer"
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => { handleClick(); setMenuOpen(false); }}
              className="text-red-400 cursor-pointer"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;