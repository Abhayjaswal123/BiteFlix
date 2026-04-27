import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginUser, loginFoodPartner } from "../api/api.auth";

const Login = () => {
  const [role, setRole] = useState("user");
  const { login } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setError("");
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Validation
    if (!form.email || !form.password) {
      return setError("All fields are required");
    }

    setLoading(true);

    try {
      let res;
      if (role === "user") {
        res = await loginUser(form);
      } else {
        res = await loginFoodPartner(form);
      }
      login(res);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1B1B1E] text-[#F2E9E4] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#2D2A32] border border-[#5C3D2E]/40 rounded-3xl p-8 shadow-2xl">

        <h2 className="text-2xl font-bold text-center mb-6">
          Welcome Back to <span className="text-[#C9A66B]">BiteFlix</span>
        </h2>

        {/* Role Toggle */}
        <div className="flex bg-[#1B1B1E] rounded-full p-1 mb-6 border border-[#5C3D2E]/30">
          <button
            type="button"
            onClick={() => setRole("user")}
            className={`cursor-pointer flex-1 py-2 rounded-full text-sm font-medium transition ${
              role === "user"
                ? "bg-[#C9A66B] text-[#1B1B1E]"
                : "text-[#F2E9E4]/60"
            }`}
          >
            User 👤
          </button>

          <button
            type="button"
            onClick={() => setRole("foodPartner")}
            className={`cursor-pointer flex-1 py-2 rounded-full text-sm font-medium transition ${
              role === "foodPartner"
                ? "bg-[#C9A66B] text-[#1B1B1E]"
                : "text-[#F2E9E4]/60"
            }`}
          >
            Partner 🍳
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="email"
            name="email"
            value={form.email}   // ✅ controlled
            onChange={handleChange}
            placeholder="Email"
            className="bg-[#1B1B1E] border border-[#5C3D2E]/40 p-3 rounded-xl outline-none focus:border-[#C9A66B]"
          />

          <input
            type="password"
            name="password"
            value={form.password}  // ✅ controlled
            onChange={handleChange}
            placeholder="Password"
            className="bg-[#1B1B1E] border border-[#5C3D2E]/40 p-3 rounded-xl outline-none focus:border-[#C9A66B]"
          />

          {/* Error UI */}
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          {/* Forgot Password */}
          {/* <p
            onClick={() => navigate("/forgot-password")}
            className="text-right text-sm text-[#C9A66B] cursor-pointer hover:underline"
          >
            Forgot Password?
          </p> */}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#C9A66B] cursor-pointer text-[#1B1B1E] py-3 rounded-xl font-semibold hover:bg-[#b89258] active:scale-95 transition mt-2 shadow-md disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-sm text-center text-[#F2E9E4]/50 mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-[#C9A66B] cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;