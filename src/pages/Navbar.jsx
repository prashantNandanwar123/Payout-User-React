
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
    Menu,
    Wallet,
    UserCircle,
    X,
    ArrowLeft
} from "lucide-react";

import axiosInstance from "../api/axios";

export default function Navbar({ toggleSidebar }) {
    const [profileOpen, setProfileOpen] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);

    const [walletBalance, setWalletBalance] = useState(null);
    const [walletLoading, setWalletLoading] = useState(false);

    const location = useLocation();

    // Logged-in user details
    const user = (() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "{}");
        } catch {
            return {};
        }
    })();

    const userData = user?.respData || user;
    const userId = userData?.userId;
    const merchantName =
        `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim() ||
        userData?.merchant_Name ||
        "User";


    const pageTitles = {
        "/app/dashboard": "Dashboard",
        "/app/reports": "Reports",
        "/app/beneficiary-manage": "Beneficiary Management",
        "/app/bulk-payout": "Bulk Payout",
        "/app/top-up": "Top Up",
        "/app/fund-transfer": "Fund Transfer"
    };

    // --------------------------------
    // 1. FETCH WALLET BALANCE API
    // --------------------------------

    const fetchWalletBalance = async () => {
        if (!userId) return;

        try {
            setWalletLoading(true);

            const response = await axiosInstance.post(
                "/fetchWalletBalance",
                {
                    userId: userId
                }
            );

            const data =
                response?.respData ??
                response?.data?.respData ??
                response?.data ??
                response;

            const balance =
                typeof data === "object"
                    ? (
                        data?.walletBalance ??
                        data?.balance ??
                        data?.walletAmount ??
                        data?.amount ??
                        data?.availableBalance
                    )
                    : data;

            setWalletBalance(balance ?? null);

        } catch (error) {
            console.error("Wallet API Error:", error);
            setWalletBalance(null);
        } finally {
            setWalletLoading(false);
        }
    };

    // Fetch wallet when Navbar loads
    useEffect(() => {
        fetchWalletBalance();
    }, [userId]);


    // --------------------------------
    // 2. FETCH PROFILE API
    // --------------------------------

    const fetchProfile = async () => {
        if (!userId) {
            console.error("User ID not found:", user);
            return;
        }

        try {
            setProfileLoading(true);

            const response = await axiosInstance.get(
                `/auth/profile/${userId}`
            );

            console.log("PROFILE API FULL RESPONSE:", response);
            console.log("LOGIN USER DATA:", userData);
            console.log("PROFILE USER ID:", userId);

            const data =
                response?.respData ??
                response?.data?.respData ??
                response?.data ??
                response;

            console.log("PROFILE API DATA:", data);

            if (data && typeof data === "object") {
                setProfileData(data);
            } else {
                setProfileData(null);
            }

        } catch (error) {
            console.error("Profile API Error:", error.response?.data || error);
            setProfileData(null);
        } finally {
            setProfileLoading(false);
        }
    };


    // --------------------------------
    // 3. PROFILE BUTTON CLICK
    // --------------------------------

    const handleProfileClick = () => {
        setProfileOpen(true);
        fetchProfile();
    };


    // --------------------------------
    // 4. PROFILE FIELD VALUES
    // --------------------------------

    const getValue = (...values) => {
        const value = values.find(
            item => item !== undefined && item !== null && item !== ""
        );
        return value ?? "-";
    };


    const profileFields = [
        {
            label: "User Id",
            value: getValue(profileData?.userId, userData?.userId)
        },
        {
            label: "First Name",
            value: getValue(profileData?.firstName, userData?.firstName)
        },
        {
            label: "Last Name",
            value: getValue(profileData?.lastName, userData?.lastName)
        },
        {
            label: "Gender",
            value: getValue(profileData?.gender)
        },
        {
            label: "Email Id",
            value: getValue(profileData?.emailId)
        },
        {
            label: "Address",
            value: getValue(profileData?.address)
        },
        {
            label: "City",
            value: getValue(profileData?.city)
        },
        {
            label: "State",
            value: getValue(profileData?.state)
        },
        {
            label: "Pin Code",
            value: getValue(profileData?.pincode)
        },
        {
            label: "Company Name",
            value: getValue(profileData?.companyName)
        },
        {
            label: "Company Address",
            value: getValue(profileData?.companyAddress)
        },
        {
            label: "A/C No.",
            value: getValue(profileData?.merchantBankAccountNumber)
        },
        {
            label: "Bank Name",
            value: getValue(profileData?.merchantBankName)
        },
        {
            label: "IFSC",
            value: getValue(profileData?.merchantBankIfsc)
        },
        {
            label: "Client Id",
            value: getValue(profileData?.clientId)
        },
        {
            label: "Client Secret",
            value: getValue(profileData?.clientSecret)
        },
        {
            label: "A/C Status",
            value: getValue(profileData?.accountStatus)
        },
        {
            label: "Creation Date",
            value: getValue(profileData?.createdAt)
        }
    ];


    const formattedBalance =
        walletBalance !== null && walletBalance !== ""
            ? `₹ ${Number(walletBalance).toLocaleString("en-IN")}`
            : "₹ --";


    return (
        <>
            {/* NAVBAR */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm px-4 sm:px-6 xl:px-3 h-16 xl:h-14 flex items-center justify-between">

                {/* LEFT SECTION */}
                <div className="flex items-center gap-2 sm:gap-4 min-w-0">

                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-lg hover:bg-gray-100 transition shrink-0"
                    >
                        <Menu size={22} className="text-gray-700" />
                    </button>

                    <h1 className="text-lg sm:text-xl md:text-2xl xl:text-xl font-semibold text-gray-900 truncate">
                        {pageTitles[location.pathname] || "Dashboard"}
                    </h1>

                </div>


                {/* RIGHT SECTION */}
                <div className="flex items-center gap-2 sm:gap-4 shrink-0">

                    {/* WALLET BALANCE */}

                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">

                        <Wallet
                            size={19}
                            className="text-gray-700"
                        />

                        <span className="text-xs sm:text-sm font-semibold text-gray-800">
                            {walletLoading ? "Loading..." : formattedBalance}
                        </span>

                    </div>


                    {/* PROFILE BUTTON */}

                    <button
                        onClick={handleProfileClick}
                        className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-100 transition"
                    >

                        <UserCircle
                            size={23}
                            className="text-gray-700"
                        />

                        <span className="hidden sm:block text-sm font-semibold text-gray-800">
                            {merchantName}
                        </span>

                    </button>

                </div>

            </header>


            {/* -------------------------------- */}
            {/* PROFILE DETAILS POPUP */}
            {/* -------------------------------- */}

            {profileOpen && (

                <div
                    className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-3 sm:p-5"
                    onClick={() => setProfileOpen(false)}
                >

                    <div
                        className="bg-white w-full max-w-[480px] rounded-md shadow-2xl p-4 sm:p-5 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* POPUP HEADER */}

                        <div className="flex items-center justify-between mb-5">

                            <h2 className="text-sm font-semibold text-gray-500">
                                USER DETAILS
                            </h2>

                            <button
                                onClick={() => setProfileOpen(false)}
                                className="text-gray-500 hover:text-red-500"
                            >
                                <X size={20} />
                            </button>

                        </div>


                        {/* PROFILE LOADING */}

                        {profileLoading ? (

                            <div className="py-16 text-center text-sm text-gray-500">
                                Loading profile details...
                            </div>

                        ) : profileData ? (

                            <>

                                {/* PROFILE FIELDS */}

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                                    {profileFields.map((field, index) => (

                                        <div
                                            key={index}
                                            className="border border-gray-200 min-w-0"
                                        >

                                            <div className="text-[11px] text-emerald-700 px-2 pt-1">
                                                {field.label}
                                            </div>

                                            <div className="text-[11px] text-gray-700 px-2 pb-1.5 break-words min-h-[23px]">
                                                {field.value}
                                            </div>

                                        </div>

                                    ))}

                                </div>


                                {/* BACK BUTTON */}

                                <button
                                    onClick={() => setProfileOpen(false)}
                                    className="w-full mt-5 bg-gray-500 hover:bg-gray-600 text-white text-xs py-2.5 rounded-md transition flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft size={14} />
                                    BACK
                                </button>

                            </>

                        ) : (

                            <div className="py-12 text-center">

                                <p className="text-sm text-red-500">
                                    Unable to fetch profile details.
                                </p>

                                <button
                                    onClick={fetchProfile}
                                    className="mt-3 text-sm text-blue-600 underline"
                                >
                                    Try Again
                                </button>

                            </div>

                        )}

                    </div>

                </div>

            )}

        </>
    );
}
