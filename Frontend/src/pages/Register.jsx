import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { registerFoodPartner, registerUser } from "../api/api.auth";

const Register = () => {
    const [role, setRole] = useState("user");
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
        restaurantName: ""
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

    // ✅ Handle normal inputs
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));

        if (error) setError("");
    };

    // ✅ Handle phone input separately
    const handlePhoneChange = (e) => {
        const value = e.target.value;

        // allow only digits and max 10
        if (/^\d{0,10}$/.test(value)) {
            setForm((prev) => ({
                ...prev,
                phoneNumber: value
            }));
        }

        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // 🔹 Common validation
        if (!form.name || !form.email || !form.password) {
            setError("All fields are required");
            return;
        }

        if (!emailRegex.test(form.email)) {
            setError("Please enter a valid email address");
            return;
        }

        if (!passwordRegex.test(form.password)) {
            setError(
                "Password must include uppercase, lowercase, number & special character"
            );
            return;
        }

        // 🔥 Food Partner validation
        if (role === "foodPartner") {
            if (!form.phoneNumber || !form.restaurantName) {
                setError("Phone number and Restaurant name are required");
                return;
            }

            if (!/^\d{10}$/.test(form.phoneNumber)) {
                setError("Phone number must be exactly 10 digits");
                return;
            }

            if (form.restaurantName.length < 3) {
                setError("Restaurant name must be at least 3 characters");
                return;
            }
        }

        setLoading(true);

        try {
            let payload;

            if (role === "user") {
                payload = {
                    name: form.name,
                    email: form.email,
                    password: form.password
                };
            } else {
                payload = {
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    phoneNumber: form.phoneNumber,
                    restaurantName: form.restaurantName
                };
            }

            const apiCall =
                role === "user" ? registerUser : registerFoodPartner;

            const res = await apiCall(payload);

            login(res);
            navigate("/feed");

        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#1B1B1E] text-[#F2E9E4] flex items-center justify-center px-4">

            <div className="bg-[#2D2A32] border border-[#5C3D2E]/40 p-8 rounded-3xl w-full max-w-md shadow-2xl">

                {/* Heading */}
                <h2 className="text-2xl font-bold text-center mb-6">
                    Join <span className="text-[#C9A66B]">BiteFlix</span>
                </h2>

                {/* Toggle */}
                <div className="flex bg-[#1B1B1E] rounded-full p-1 mb-6 border border-[#5C3D2E]/30">
                    <button
                        onClick={() => setRole("user")}
                        className={`flex-1 cursor-pointer py-2 rounded-full text-sm font-medium transition ${role === "user"
                                ? "bg-[#C9A66B] text-[#1B1B1E]"
                                : "text-[#F2E9E4]/60 hover:text-[#F2E9E4]"
                            }`}
                    >
                        User 👤
                    </button>

                    <button
                        onClick={() => setRole("foodPartner")}
                        className={`flex-1 cursor-pointer py-2 rounded-full text-sm font-medium transition ${role === "foodPartner"
                                ? "bg-[#C9A66B] text-[#1B1B1E]"
                                : "text-[#F2E9E4]/60 hover:text-[#F2E9E4]"
                            }`}
                    >
                        Partner 🍳
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    {/* Error */}
                    {error && (
                        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 px-3 py-2 rounded-lg">
                            {error}
                        </p>
                    )}

                    {/* Name */}
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder={role === "user" ? "Full Name" : "Owner Name"}
                        className="bg-[#1B1B1E] border border-[#5C3D2E]/40 p-3 rounded-xl outline-none focus:border-[#C9A66B]"
                    />

                    {/* Email */}
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="bg-[#1B1B1E] border border-[#5C3D2E]/40 p-3 rounded-xl outline-none focus:border-[#C9A66B]"
                    />

                    {/* Password */}
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="bg-[#1B1B1E] border border-[#5C3D2E]/40 p-3 rounded-xl outline-none focus:border-[#C9A66B]"
                    />

                    {/* Extra Fields */}
                    {role === "foodPartner" && (
                        <>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={form.phoneNumber}
                                onChange={handlePhoneChange}
                                placeholder="Phone Number"
                                maxLength={10}
                                inputMode="numeric"
                                className="bg-[#1B1B1E] border border-[#5C3D2E]/40 p-3 rounded-xl outline-none focus:border-[#C9A66B]"
                            />

                            <input
                                type="text"
                                name="restaurantName"
                                value={form.restaurantName}
                                onChange={handleChange}
                                placeholder="Restaurant Name"
                                maxLength={50}
                                className="bg-[#1B1B1E] border border-[#5C3D2E]/40 p-3 rounded-xl outline-none focus:border-[#C9A66B]"
                            />
                        </>
                    )}

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#C9A66B] text-[#1B1B1E] py-3 rounded-xl font-semibold hover:bg-[#b89258] active:scale-95 transition mt-2 shadow-md disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? "Creating..." : "Create Account"}
                    </button>

                </form>

                {/* Footer */}
                <p className="text-sm text-center text-[#F2E9E4]/50 mt-6">
                    Already have an account?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="text-[#C9A66B] cursor-pointer hover:underline"
                    >
                        Login
                    </span>
                </p>

            </div>
        </div>
    );
};

export default Register;