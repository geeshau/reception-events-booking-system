import Link from "next/link";
import { Calendar, Facebook, Twitter, Instagram, Linkedin } from "react-feather";

export default function Footer() {
  const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/calendar", label: "Calendar" },
    { href: "/reports", label: "Reports" },
    { href: "/settings", label: "Settings" },
  ];

  const socialLinks = [
    { href: "#", icon: <Facebook className="h-6 w-6" /> },
    { href: "#", icon: <Twitter className="h-6 w-6" /> },
    { href: "#", icon: <Instagram className="h-6 w-6" /> },
    { href: "#", icon: <Linkedin className="h-6 w-6" /> },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center">
              <Calendar className="text-primary-500 h-8 w-8" />
              <span className="ml-3 text-2xl font-bold text-gray-900">STANDS Conference Facilities</span>
            </div>
            <p className="text-gray-500 text-base">
              Manage all your events in one place.
            </p>
            <div className="flex space-x-6">
              {socialLinks.map((link, index) => (
                <a key={index} href={link.href} className="text-gray-400 hover:text-gray-500">
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Solutions</h3>
                <ul className="mt-4 space-y-4">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-base text-gray-500 hover:text-gray-900">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                      Terms
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; {new Date().getFullYear()} STANDS Conference Facilities. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}