"use client"

import React from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { User } from "next-auth"
import { Button } from "./ui/button"

const Navbar = () => {
  const { data: session } = useSession()
  const user: User = session?.user as User

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-[#0b0f19]/70 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <Link href="/">
          <span className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent cursor-pointer">
            Whispr
          </span>
        </Link>

        {session ? (
          <div className="flex items-center gap-6">

            <span className="hidden md:block text-sm text-gray-300">
              Welcome, {user?.username || user?.email}
            </span>

            <Button
              onClick={() => signOut()}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white"
            >
              Logout
            </Button>

          </div>
        ) : (
          <div className="flex items-center gap-4">

            <Link href="/sign-in">
              <Button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white">
                Login
              </Button>
            </Link>

            <Link href="/sign-up">
              <Button className="bg-teal-400 text-black hover:scale-105 transition">
                Sign Up
              </Button>
            </Link>

          </div>
        )}

      </div>
    </nav>
  )
}

export default Navbar