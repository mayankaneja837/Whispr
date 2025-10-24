"use client"
import React from "react";
import Link from "next/link";
import { useSession,signOut } from "next-auth/react";
import {User} from 'next-auth'
import { Button } from "./ui/button";

const Navbar = ()=>{
    const {data:session} = useSession()

    const user: User = session?.user as User

    return (
        <nav className="p-4 md:p-6 shadow-md">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <a className="text-xl font-bold mb-4 md:mb-6" href="#">Mystery Message</a>
                {
                    session ? (
                        <><span>Welcome , user {user.username || user.email}</span>
                        <Button onClick={() => signOut()}>Logout</Button></>
                    ) : (
                        <Link className="cursor-pointer" href='/sign-in'>
                            <Button>Login</Button>
                        </Link>
                    )
                }
            </div>
        </nav>
    )
}

export default Navbar