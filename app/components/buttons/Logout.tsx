'use client'
import { signOut } from "next-auth/react";

const Logout = () => {
    return (
        <button
            className="bg-blue-200 rounded-md p-2 shadow-md"
            onClick={() => signOut()}>
            Logout
        </button>
    );
}

export default Logout;