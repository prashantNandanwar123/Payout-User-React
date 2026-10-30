import { toast } from "react-toastify";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { FiUser } from "react-icons/fi";
import { RiLockPasswordLine } from "react-icons/ri";
import { GrShieldSecurity } from "react-icons/gr";
import { TbLogin2 } from "react-icons/tb";
import { MdOutlineHeadsetMic } from "react-icons/md";
import { FaEye, FaEyeSlash, FaShieldAlt, FaBolt, FaChartBar } from "react-icons/fa";
import logo from "../assets/img-1.jpeg";
import img2 from "../assets/img-2.jpeg";

export default function Login() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const isSubmitting = useRef(false);

    // Already logged-in user ko seedha dashboard bhejo
    useEffect(() => {
        if (localStorage.getItem("isLogin") === "true") {
           navigate("/app/dashboard", { replace: true });
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting.current) return;

        isSubmitting.current = true;
        setLoading(true);

        try {
            const response = await axiosInstance.post("/auth/login", {
                mobileNo: userId,
                password: password,
            });

            // Interceptor data return kare ya poora response, dono handle honge
            const res =
                response?.respCode !== undefined ? response : response?.data;

            if (Number(res?.respCode) === 0) {
                localStorage.setItem("isLogin", "true");
                if (res.respData) {
                    localStorage.setItem("user", JSON.stringify(res.respData));
                }
                toast.success(res.respMsg || "Login successful");
                navigate("/app/dashboard", { replace: true });
            } else {
                toast.error(res?.respMsg || "Login failed");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.respMsg ||
                error.response?.data?.message ||
                "Login failed. Check your credentials."
            );
        } finally {
            isSubmitting.current = false;
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 py-8 overflow-y-auto login-bg">
            <div className="w-full max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden my-auto">
                {/* ================= LEFT SIDE ================= */}
                <div className="hidden md:flex md:w-[35%] bg-[#040F25] relative text-white overflow-hidden md:rounded-l-2xl">
                    <div className="absolute inset-0 bg-cover bg-center opacity-20" />
                    <div className="relative z-10 flex flex-col justify-between h-full w-full">
                        <div className="px-6 md:px-8 lg:px-10 xl:px-8 xl:pt-1 cursor-default">
                            <img
                                src={logo}
                                alt="logo"
                                className="h-16 md:h-18 lg:h-20 xl:h-16 object-contain"
                                style={{ marginLeft: "-18px" }}
                            />
                            <h1 className="text-[18px] md:text-[14px] md:leading-[18px] font-medium">
                                Manage your payoutttttttttt
                                <br />
                                business payments
                                <br />
                                <span className="text-[#FFB504]">effortlessly</span>
                            </h1>
                            <p className="text-gray-300 md:mt-2 leading-4 md:text-xs font-normal">
                                Secure platform for merchants with lightning-fast
                                settlements and powerful dashboard.
                            </p>

                            <div className="space-y-5 md:space-y-6 lg:space-y-8 xl:space-y-2 mt-4 md:mt-6">
                                <div className="flex items-start gap-3 md:gap-4 lg:gap-5">
                                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                        <FaShieldAlt className="text-yellow-400 text-lg" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-xs">Secure Transactions</h3>
                                        <p className="text-gray-300 text-xs mt-1">
                                            Bank level encrypted
                                            <br />
                                            payment infrastructure.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 md:gap-4 lg:gap-5">
                                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                        <FaBolt className="text-yellow-400 text-lg" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-xs">Fast Settlement</h3>
                                        <p className="text-gray-300 text-xs mt-1">
                                            Receive your payments
                                            <br />
                                            quickly and securely.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 md:gap-4 lg:gap-5">
                                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                        <FaChartBar className="text-yellow-400 text-lg" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-xs">Analytics</h3>
                                        <p className="text-gray-300 text-xs mt-1">
                                            Smart reports to grow
                                            <br />
                                            your business.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <img
                                src={img2}
                                alt=""
                                className="object-contain max-w-full xl:max-h-25"
                            />
                        </div>
                    </div>
                </div>

                {/* ================= RIGHT SIDE ================= */}
                <div className="flex-1 relative bg-cover bg-right bg-no-repeat md:rounded-r-2xl p-5">
                    <div className="relative z-10 flex justify-center items-center min-h-full py-6 xl:py-2 md:px-2 lg:px-8">
                        <div className="w-full max-w-md">
                            {/* Mobile Logo */}
                            <div className="md:hidden flex justify-center mb-8">
                                <img src={logo} className="h-12 xl:h-11" alt="logo" />
                            </div>

                            <h2 className="text-2xl font-bold text-[#071C39] text-center md:text-left cursor-default">
                                Welcome Back!
                            </h2>
                            <p className="mb-2 xl:mb-3 md:pb-2 text-sm text-gray-500 text-center md:text-left cursor-default">
                                Payout User Login Page
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4 xl:space-y-2">
                                {/* MOBILE NO */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-500 mb-2">
                                        Enter Your Mobile No
                                    </label>
                                    <div className="relative">
                                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            value={userId}
                                            placeholder="Enter User ID"
                                            required
                                            onChange={(e) => setUserId(e.target.value)}
                                            className="w-full h-10 rounded-xl border border-gray-300 bg-white pl-12 pr-4 outline-none focus:border-[#FDB913] transition"
                                            style={{ WebkitBoxShadow: "0 0 0 1000px white inset" }}
                                        />
                                    </div>
                                </div>

                                {/* PASSWORD */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-500 mb-2">
                                        PASSWORD
                                    </label>
                                    <div className="relative">
                                        <RiLockPasswordLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            placeholder="Enter Password"
                                            required
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full h-10 rounded-xl border border-gray-300 bg-white pl-12 pr-12 outline-none focus:border-[#FDB913] transition"
                                            style={{ WebkitBoxShadow: "0 0 0 1000px white inset" }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#FDB913]"
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                {/* LOGIN BUTTON */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full h-10 rounded-xl text-[#071C39] font-semibold text-lg transition flex items-center justify-center gap-3 shadow-md ${
                                        loading
                                            ? "bg-gray-300 cursor-not-allowed"
                                            : "bg-[#fec931] cursor-pointer"
                                    }`}
                                >
                                    <TbLogin2 />
                                    {loading ? "Logging In..." : "Log In"}
                                </button>

                                {/* Jab register page ban jaye tab ye button on karein
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/register")}
                                        className="text-[#3498db] text-sm hover:underline cursor-pointer"
                                    >
                                        Create an Account?
                                    </button>
                                </div>
                                */}

                                {/* Divider */}
                                <div className="flex items-center gap-4 pt-2 cursor-default">
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                    <span className="text-sm text-gray-500">New to HelloPe?</span>
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                </div>

                                {/* Need Help */}
                                <div className="p-2">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-[#F3F9FF] flex items-center justify-center flex-shrink-0">
                                            <MdOutlineHeadsetMic size={25} className="text-[#2980b9]" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#071C39] cursor-default">
                                                Need Help?
                                            </h4>
                                            <p className="text-xs text-gray-700 md:mt-1 cursor-default">
                                                Contact Us at
                                                <span className="text-[#3498db] font-medium mt-2 cursor-pointer">
                                                    {" "}support@helloPe.co.in
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="border-t border-gray-200 cursor-default">
                                    <p className="flex items-center justify-center gap-2 md:pt-2 text-sm text-gray-400 font-normal">
                                        <GrShieldSecurity className="text-xs" />
                                        <span>Your security is our Priority</span>
                                    </p>
                                    <p className="text-center md:text-xs text-gray-400 mt-1 font-normal">
                                        © 2026 HelloPe Financial Services Pvt. Ltd. All Rights Reserved.
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}