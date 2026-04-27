import React from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser, logoutFoodPartner } from "../api/api.auth";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const AdminNavbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);

    if (user?.userType === "user") {
        return navigate("/")
    }

        const handleClick = async () => {
            try {
                await logoutFoodPartner();
                logout();
                navigate("/");
            } catch {
                setError("Logout Failed")
            }
        }

        return (
            <div className="w-full sticky top-0 z-50 bg-[#1B1B1E]/80 backdrop-blur-md border-b border-[#3A2F2A] px-6 py-4 flex justify-between items-center">

                <h1
                    onClick={() => navigate("/admin")}
                    className="text-xl font-bold text-[#C9A66B] cursor-pointer"
                >
                    BiteFlix Admin
                </h1>

                <div className="flex items-center gap-4">

                    <button
                        onClick={() => navigate("/")}
                        className="cursor-pointer text-sm text-[#F2E9E4]/70 hover:text-white transition"
                    >
                        View App
                    </button>

                    <button
                        onClick={() => {
                            handleClick()
                        }} className="cursor-pointer bg-[#C9A66B] text-[#1B1B1E] px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-[#b89258] transition">
                        Logout
                    </button>

                </div>
            </div>
        );
    };

    export default AdminNavbar;