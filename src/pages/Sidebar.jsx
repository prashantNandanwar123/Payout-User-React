import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { PiLinkSimpleBold } from "react-icons/pi";
import balcklogo from "../assets/img-1.jpeg";
import whitelogo from "../assets/logo-copy.png";
import { TbCoinBitcoin } from "react-icons/tb";

import {
  LayoutDashboard,
  BarChart2,
  Settings,
  ChevronDown,
  Key,
  Webhook,
  LogOut,
  CircleUser,
  Moon,
  Sun,
} from "lucide-react";

export default function Sidebar({ open, setOpen }) {
  const [darkMode, setDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showCrypto, setShowCrypto] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [sidebarColor, setSidebarColor] = useState("#020923");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setSidebarColor(
      darkMode ? "#020923" : "rgba(239,236,237,0.95)"
    );
  }, [darkMode]);

  const isLightSidebar =
    sidebarColor === "rgba(239,236,237,0.95)" ||
    sidebarColor === "#fff" ||
    sidebarColor === "#ffffff";

  const getMenuClass = ({ menuKey }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${activeMenu === menuKey
      ? isLightSidebar
        ? "bg-yellow-400 text-black"
        : "bg-white text-black"
      : isLightSidebar
        ? "text-black hover:bg-yellow-400"
        : "text-white/70 hover:bg-white hover:text-black"
    }`;

  // Handle Logout
  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post("/auth/logout");
      if (response.respCode === 0) {
        localStorage.removeItem("isLogin");
        localStorage.removeItem("user");
        toast.success(response.respMsg);
        setTimeout(() => {
          navigate("/");
        }, 200);
      } else {
        toast.error(response.respMsg);
      }
    } catch (error) {
      toast.error(error);
      localStorage.removeItem("isLogin");
      localStorage.removeItem("user");
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 200);
    }
  };

  // const isSettingsChildActive = [
  //   "/app/api-keys",
  //   "/app/webhooks",
  //   "/app/ip-Whishlist",
  //   "/app/profile",
  //   "/app/apidoc",
  // ].includes(location.pathname);

  const isSettingsMainActive =
    location.pathname === "/app/settings";

  const isCryptoChildActive = [
    "/app/crypto-dashboard",
    "/app/crypto-reports",
  ].includes(location.pathname);

  // Only For Mobile Device
  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) {
      setOpen(false);
    }
  };

  return (
    <>
      <aside
        className={`
        fixed top-0 left-0 h-screen
        flex flex-col
        transition-all duration-300
        z-[100]
        ${isLightSidebar ? "text-black" : "text-white"}
        lg:translate-x-0
        ${open ? "translate-x-0 lg:w-64 xl:w-56" : "-translate-x-full lg:translate-x-0 lg:w-20"}
        w-64
      `}
        style={{ backgroundColor: sidebarColor }}
      >
        {/* Header */}
        <div
          className={`px-5 py-5 xl:px-4 xl:py-3 border-b border-white/10 ${open ? "flex items-center" : "flex justify-center"
            }`}
        >
          <div className="flex items-center gap-3 xl:gap-2 overflow-hidden cursor-default">
            <div className="w-10 h-10 xl:w-8 xl:h-8 rounded-full bg-[#fec931] flex items-center justify-center font-bold text-black text-lg xl:text-base shrink-0">
              H
            </div>
            {open && (
              <div className="flex items-center overflow-hidden h-10 xl:h-8">
                <img
                  className="h-10 xl:h-15 w-auto object-contain max-w-[140px] xl:max-w-[110px]"
                  src={isLightSidebar ? whitelogo : balcklogo}
                  alt="logo"
                />
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto px-4 py-5 xl:px-3 xl:py-3 hide-scrollbar">
          {/* MAIN */}       
          <div className="space-y-2 xl:space-y-1.5 ">
            <NavLink
              to="/app/dashboard"
              onClick={() => {
                setActiveMenu("dashboard");
                setShowCrypto(false);
                setShowSettings(false);
                closeSidebarOnMobile();
              }}
              className={() => getMenuClass({ menuKey: "dashboard" })}
            >

              <LayoutDashboard size={18} className="xl:w-4 xl:h-4" />
              {open && <span className="xl:text-sm">Dashboard</span>}
            </NavLink>

            <NavLink
              to="/app/beneficiary-manage"
              onClick={() => {
                setActiveMenu("BeneficiaryManagement");
                setShowSettings(false);
                closeSidebarOnMobile();
              }}
              className={getMenuClass}
            >
              <PiLinkSimpleBold size={18} className="xl:w-4 xl:h-4" />
              {open && <span className="xl:text-sm">BENEFICIARY MANAGEMENT</span>}
            </NavLink>

            <NavLink
              to="/app/top-up"
              onClick={() => {
                setActiveMenu("TopUp");
                setShowSettings(false);
                closeSidebarOnMobile();
              }}
              className={getMenuClass}
            >
              <PiLinkSimpleBold size={18} className="xl:w-4 xl:h-4" />
              {open && <span className="xl:text-sm">Top Up</span>}
            </NavLink>

            <NavLink
              to="/app/fund-transfer"
              onClick={() => {
                setActiveMenu("Fund Transfer");
                setShowSettings(false);
                closeSidebarOnMobile();
              }}
              className={getMenuClass}
            >
              <PiLinkSimpleBold size={18} className="xl:w-4 xl:h-4" />
              {open && <span className="xl:text-sm">Fund Transfer</span>}
            </NavLink>

            <NavLink
              to="/app/bulk-payout"
              onClick={() => {
                setActiveMenu("Bulk Payout");
                setShowSettings(false);
                closeSidebarOnMobile();
              }}
              className={getMenuClass}
            >
              <PiLinkSimpleBold size={18} className="xl:w-4 xl:h-4" />
              {open && <span className="xl:text-sm">Bulk Payout</span>}
            </NavLink>

            <NavLink
              to="/app/reports"
              onClick={() => {
                setActiveMenu("reports");
                setShowCrypto(false);
                setShowSettings(false);
                closeSidebarOnMobile();
              }}
              className={() => getMenuClass({ menuKey: "reports" })}
            >
              <BarChart2 size={18} className="xl:w-4 xl:h-4" />
              {open && <span className="xl:text-sm">Report</span>}
            </NavLink>
          </div>
        </div>

        {/* Logout */}
        <div className="border-t border-white/10 p-4 xl:p-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 xl:gap-2 px-3 xl:px-2.5 py-3 xl:py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut size={18} className="xl:w-4 xl:h-4" />
            {open && (
              <span className="xl:text-sm">
                Logout
              </span>
            )}

          </button>
        </div>

      </aside>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-[90] lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}