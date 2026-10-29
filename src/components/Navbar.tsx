"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Bell, Menu, X, LogOut, User, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import SearchBar from "@/components/SearchBar";

export default function Navbar() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const toggleNotification = () => setIsNotificationOpen(!isNotificationOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Hide Navbar on login page
  if (pathname === "/login") return null;

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/", label: "Event Directory" },
    { href: "/clients", label: "Clients" },
    { href: "/rooms", label: "Rooms" },
    { href: "/reports", label: "Reports" },
    { href: "/email-campaigns", label: "Email Campaigns" },
  ];

  const getInitials = () => {
    return "A";
  };

  return (
    <nav className="bg-white dark:bg-[#141414] border-b border-gray-200 dark:border-[#262626] relative z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between h-14 sm:h-16">
          <div className="flex items-center min-w-0">
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <div className="bg-[#00a650] p-1 sm:p-1.5 rounded flex-shrink-0">
                <Calendar className="text-white h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white truncate">
                STANDS Conference Facilities
              </span>
            </Link>
          </div>
          
          <div className="hidden lg:ml-6 xl:ml-8 lg:flex lg:items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-2 xl:px-3 py-2 rounded text-xs xl:text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#00a650]"
                      : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex flex-1 max-w-xs mx-4">
            <SearchBar />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            <ThemeToggle />
            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-1.5 sm:p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            {/* Notifications */}
            <div className="relative hidden sm:block" ref={notificationRef}>
              <button
                onClick={toggleNotification}
                className="p-1.5 sm:p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition focus:outline-none"
              >
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#141414]"></span>
              </button>
              {isNotificationOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <span className="text-sm font-semibold text-gray-900">Notifications</span>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-sm text-gray-500">You have no new notifications.</p>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="relative ml-2" ref={profileRef}>
              <button 
                onClick={toggleProfile}
                className="flex items-center gap-2 focus:outline-none rounded-full ring-2 ring-transparent focus:ring-[#00a650]/20 transition"
              >
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#00a650] flex items-center justify-center text-white font-medium shadow-sm">
                  {getInitials()}
                </div>
              </button>
              
              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white dark:bg-[#141414] ring-1 ring-black/5 dark:ring-white/5 overflow-hidden divide-y divide-gray-100 dark:divide-[#262626]">
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      Admin User
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      admin@stands.co.ke
                    </p>
                    <div className="mt-2 text-xs font-semibold px-2 py-1 bg-green-50 dark:bg-green-900/20 text-[#00a650] rounded inline-block uppercase tracking-wide">
                      Admin
                    </div>
                  </div>
                  <div className="py-1">
                    <button 
                      onClick={() => {
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="sm:hidden flex items-center ml-2">
              <button 
                onClick={toggleMobileMenu} 
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="sm:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition ${
                    isActive
                      ? "text-indigo-600 bg-indigo-50"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}