import React, { useRef, useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp, resendOtp } from "../api/api.auth";
import { AuthContext } from "../context/AuthContext";

const OtpVerify = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();

  const { login, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const email = location.state?.email || user?.email;
  const role = location.state?.role || user?.userType || "user";

  useEffect(() => {
    if (user?.isVerified) {
      navigate("/");
      return;
    }

    if (!email) {
      navigate("/register");
    }
  }, [email, navigate, user]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }

    setError("");
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim();

    if (!/^\d+$/.test(paste)) {
      setError("Only numbers allowed");
      return;
    }

    const pasteArray = paste.slice(0, 6).split("");
    const newOtp = [...otp];

    pasteArray.forEach((digit, i) => {
      newOtp[i] = digit;
    });

    setOtp(newOtp);
    const lastIndex = Math.min(pasteArray.length - 1, 5);
    inputsRef.current[lastIndex]?.focus();

    setError("");
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setResendLoading(true);
    setError("");
    setSuccess("");

    try {
      await resendOtp({ email, type: role });
      setSuccess("OTP resent to your email");
      setResendTimer(120);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await verifyOtp({ email, otp: finalOtp, type: role });
      login(res);
      setSuccess("OTP verified successfully!");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1B1B1E] text-[#F2E9E4] flex items-center justify-center px-4">

      <div
        className="w-full max-w-md bg-[#2D2A32] border border-[#5C3D2E]/40 rounded-2xl md:rounded-3xl p-6 sm:p-8 shadow-2xl text-center"
        onPaste={handlePaste}
      >

        <h2 className="text-xl sm:text-2xl font-bold mb-2">
          Verify Your Account
        </h2>

        <p className="text-xs sm:text-sm text-[#F2E9E4]/60 mb-5 sm:mb-6">
          Enter the 6-digit code sent to your email
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-2 sm:gap-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              value={digit}
              maxLength="1"
              inputMode="numeric"
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl rounded-lg sm:rounded-xl bg-[#1B1B1E] border border-[#5C3D2E]/40 focus:border-[#C9A66B] outline-none"
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-xs sm:text-sm mb-3">{error}</p>
        )}

        {/* Success */}
        {success && (
          <p className="text-green-400 text-xs sm:text-sm mb-3">{success}</p>
        )}

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#C9A66B] text-[#1B1B1E] py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-[#b89258] transition active:scale-95 disabled:opacity-50 text-sm sm:text-base cursor-pointer active:scale-95"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* Resend Button */}
        <button
          onClick={handleResendOtp}
          disabled={resendLoading || resendTimer > 0}
          className="cursor-pointer w-full mt-4 bg-transparent border border-[#C9A66B] text-[#C9A66B] py-2 rounded-lg font-semibold hover:bg-[#C9A66B]/10 transition disabled:opacity-50 text-sm active:scale-95"
        >
          {resendLoading ? "Resending..." : resendTimer > 0 ? `Resend in ${Math.floor(resendTimer / 60)}:${(resendTimer % 60).toString().padStart(2, '0')}` : "Resend OTP"}
        </button>

      </div>
    </div>
  );
};

export default OtpVerify;