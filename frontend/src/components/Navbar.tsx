"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full px-6 md:px-10 py-4 flex items-center justify-end bg-black/40 backdrop-blur-lg border-b border-gray-800">
      
      {/* Only Right Side Links */}
      <div className="flex items-center gap-6 text-gray-300 text-sm md:text-base">
        
        <Link 
          href="/" 
          className="hover:text-white transition duration-200"
        >
          Home
        </Link>

        <Link 
          href="/auth/signup" 
          className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 text-white transition duration-300"
        >
          Signup
        </Link>

        <Link 
          href="/auth/login" 
          className="px-4 py-2 border border-gray-500 rounded-lg hover:bg-gray-800 transition duration-300"
        >
          Login
        </Link>

      </div>
    </nav>
  );
}